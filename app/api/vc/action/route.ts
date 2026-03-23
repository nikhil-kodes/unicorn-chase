import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase/admin'
import { getUserRole } from '@/lib/auth/getRole'

export const dynamic = 'force-dynamic'
 
export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const role = await getUserRole(session.user.id)
    if (role !== 'vc') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const adminAuthClient = getServiceRoleClient()
    
    const { data: config } = await adminAuthClient.from('app_config').select('value').eq('key', 'event_ended').maybeSingle()
    if (config?.value === 'true') {
      return NextResponse.json({ error: 'Event has concluded. Actions are locked.' }, { status: 403 })
    }

    const { actionType, teamId, payload } = await req.json()

    const { data: teamData } = await adminAuthClient.from('teams').select('team_name, tokens, route_progress(*)').eq('id', teamId).single()
    if (!teamData) return NextResponse.json({ error: 'Team not found' }, { status: 404 })

    let tokenDelta = 0
    let metadata: any = { teamName: teamData.team_name }

    if (actionType === 'hint_given') {
      tokenDelta = -1
    } else if (actionType === 'skip_task') {
      tokenDelta = -4
      // the PRD states: "Can skip and mark a task as completed" 
      // Need to find the first incomplete stage and mark it completed.
      const uncompletedStages = ['alpha', 'beta', 'charlie', 'delta', 'gamma'].filter(stage => {
          const pb = teamData.route_progress.find((p: any) => p.stage === stage)
          return pb && !pb.completed
      })
      if (uncompletedStages.length === 0) return NextResponse.json({ error: 'No stages left to skip' }, { status: 400 })

      const stageToSkip = uncompletedStages[0]

      const { error: markError } = await adminAuthClient
        .from('route_progress')
        .update({ completed: true, completed_at: new Date().toISOString() })
        .eq('team_id', teamId)
        .eq('stage', stageToSkip)
      
      if (markError) throw markError
      
      metadata.stage = stageToSkip
      
    } else if (actionType === 'token_increase') {
      const amount = parseInt(payload.amount)
      if (isNaN(amount) || amount <= 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
      tokenDelta = amount
    } else {
      return NextResponse.json({ error: 'Invalid action type' }, { status: 400 })
    }

    if (tokenDelta !== 0) {
      await adminAuthClient.rpc('increment_tokens', { team_id: teamId, amount: tokenDelta })
      if (tokenDelta < 0) {
          tokenDelta = Math.max(tokenDelta, -teamData.tokens)
      }
    }

    // Insert broadcast event
    await adminAuthClient.from('events').insert({
      event_type: actionType,
      team_id: teamId,
      triggered_by_role: 'vc',
      triggered_by_user_id: session.user.id,
      token_delta: tokenDelta,
      metadata
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

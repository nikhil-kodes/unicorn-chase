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
    if (role !== 'black_market') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const adminAuthClient = getServiceRoleClient()

    const { data: config } = await adminAuthClient.from('app_config').select('value').eq('key', 'event_ended').maybeSingle()
    if (config?.value === 'true') {
      return NextResponse.json({ error: 'Event has concluded. Actions are locked.' }, { status: 403 })
    }

    const { actionType, teamId, payload } = await req.json()
    const { data: teamData } = await adminAuthClient.from('teams').select('team_name, tokens, is_paused, route_progress(*)').eq('id', teamId).single()
    if (!teamData) return NextResponse.json({ error: 'Team not found' }, { status: 404 })

    let tokenDelta = 0
    let metadata: any = { teamName: teamData.team_name }
    let secondaryTeamId = null

    if (actionType === 'hint_given') {
      tokenDelta = -1
    } else if (actionType === 'task_changed') {
      tokenDelta = -3
    } else if (actionType === 'sabotage_sold') {
      const bid = parseInt(payload.bid)
      if (isNaN(bid) || bid <= 0) return NextResponse.json({ error: 'Invalid bid' }, { status: 400 })
      tokenDelta = -bid
    } else if (actionType === 'sabotage_used') {
      secondaryTeamId = payload.victimId
      const { data: victimData } = await adminAuthClient
        .from('teams')
        .select('team_name, is_paused, route_progress(*)')
        .eq('id', secondaryTeamId)
        .single()
      
      if (!victimData) return NextResponse.json({ error: 'Victim not found' }, { status: 404 })
      if (victimData.is_paused) return NextResponse.json({ error: 'Victim already paused' }, { status: 400 })
      
      // PRD: Cannot target Gamma
      const isGamma = victimData.route_progress.find((p: any) => p.stage === 'gamma')?.completed
      if (isGamma) return NextResponse.json({ error: 'Cannot sabotage a team that reached Gamma' }, { status: 400 })

      metadata.secondaryTeamName = victimData.team_name

      // Update victim's pause state
      const pauseUntil = new Date(Date.now() + 5 * 60000).toISOString()
      await adminAuthClient.from('teams').update({ is_paused: true, pause_until: pauseUntil }).eq('id', secondaryTeamId)

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
          // Adjust delta if going below 0 (for accurate log, though UI might just say "deducted X")
          tokenDelta = Math.max(tokenDelta, -teamData.tokens)
      }
    }

    // Insert broadcast event
    await adminAuthClient.from('events').insert({
      event_type: actionType,
      team_id: teamId,
      secondary_team_id: secondaryTeamId,
      triggered_by_role: 'black_market',
      triggered_by_user_id: session.user.id,
      token_delta: tokenDelta,
      metadata
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

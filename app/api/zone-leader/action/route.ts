import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase/admin'
import { getUserRole } from '@/lib/auth/getRole'
import { STAGE_POINTS, STAGE_ORDER } from '@/lib/utils/stages'

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const role = await getUserRole(session.user.id)
    if (role !== 'zone_leader') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const adminAuthClient = getServiceRoleClient()
    
    const { data: config } = await adminAuthClient.from('app_config').select('value').eq('key', 'event_ended').maybeSingle()
    if (config?.value === 'true') {
      return NextResponse.json({ error: 'Event has concluded. Actions are locked.' }, { status: 403 })
    }

    const body = await req.json()
    const { actionType, teamId, stage, amount } = body

    if (actionType === 'complete-stage') {
      if (!STAGE_ORDER.includes(stage)) return NextResponse.json({ error: 'Invalid stage' }, { status: 400 })
      const { data: teamData } = await adminAuthClient.from('teams').select('team_name, route_progress(*)').eq('id', teamId).single()
      if (!teamData) return NextResponse.json({ error: 'Team not found' }, { status: 400 })

      const targetProgress = teamData.route_progress.find((p: any) => p.stage === stage)
      if (!targetProgress) return NextResponse.json({ error: 'Progress node missing' }, { status: 400 })
      if (targetProgress.completed) return NextResponse.json({ error: 'Stage already completed' }, { status: 400 })

      const { error: markError } = await adminAuthClient.from('route_progress').update({ completed: true, completed_at: new Date().toISOString() }).eq('team_id', teamId).eq('stage', stage)
      if (markError) throw markError

      const points = STAGE_POINTS[stage as string]
      if (points > 0) await adminAuthClient.rpc('increment_tokens', { team_id: teamId, amount: points })

      await adminAuthClient.from('events').insert({
        event_type: 'stage_completed',
        team_id: teamId,
        triggered_by_role: 'zone_leader',
        triggered_by_user_id: session.user.id,
        token_delta: points,
        metadata: { stage, teamName: teamData.team_name }
      })
    } 
    else if (actionType === 'phone-usage') {
      const penaltyAmount = -2
      const { data: teamData } = await adminAuthClient.from('teams').select('team_name, tokens').eq('id', teamId).single()
      if (!teamData) return NextResponse.json({ error: 'Team not found' }, { status: 404 })

      await adminAuthClient.rpc('increment_tokens', { team_id: teamId, amount: penaltyAmount })

      await adminAuthClient.from('events').insert({
        event_type: 'phone_usage',
        team_id: teamId,
        triggered_by_role: 'zone_leader',
        triggered_by_user_id: session.user.id,
        token_delta: Math.max(penaltyAmount, -teamData.tokens),
        metadata: { teamName: teamData.team_name }
      })
    } 
    else if (actionType === 'deduct') {
      const deduction = -Math.abs(amount)
      if (isNaN(deduction) || deduction === 0) return NextResponse.json({ error: 'Invalid deduction amount' }, { status: 400 })
      
      const { data: teamData } = await adminAuthClient.from('teams').select('team_name, tokens').eq('id', teamId).single()
      if (!teamData) return NextResponse.json({ error: 'Team not found' }, { status: 404 })

      await adminAuthClient.rpc('increment_tokens', { team_id: teamId, amount: deduction })

      await adminAuthClient.from('events').insert({
        event_type: 'manual_deduction',
        team_id: teamId,
        triggered_by_role: 'zone_leader',
        triggered_by_user_id: session.user.id,
        token_delta: Math.max(deduction, -teamData.tokens),
        metadata: { teamName: teamData.team_name }
      })
    } 
    else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

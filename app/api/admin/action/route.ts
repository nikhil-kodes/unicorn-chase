import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase/admin'
import { getUserRole } from '@/lib/auth/getRole'

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const role = await getUserRole(session.user.id)
    if (role !== 'admin' || session.user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { actionType, teamId, marker, tokens } = body
    const adminAuthClient = getServiceRoleClient()

    if (actionType === 'start_event') {
      const { error } = await adminAuthClient.from('app_config').update({ value: 'true' }).eq('key', 'event_started')
      if (error) throw error
    } 
    else if (actionType === 'assign_marker') {
      const { error } = await adminAuthClient.from('teams').update({ route_marker: marker }).eq('id', teamId)
      if (error) throw error
    } 
    else if (actionType === 'override_tokens') {
      const { data: teamData } = await adminAuthClient.from('teams').select('team_name, tokens').eq('id', teamId).single()
      const { error } = await adminAuthClient.from('teams').update({ tokens: Math.max(0, tokens) }).eq('id', teamId)
      if (error) throw error
      await adminAuthClient.from('events').insert({
        event_type: 'admin_token_change',
        team_id: teamId,
        triggered_by_role: 'admin',
        triggered_by_user_id: session.user.id,
        token_delta: tokens - (teamData?.tokens || 0),
        metadata: { teamName: teamData?.team_name, isAdminOverride: true }
      })
    } 
    else if (actionType === 'delete_team') {
      const { data: teamData } = await adminAuthClient.from('teams').select('user_id').eq('id', teamId).single()
      if (teamData?.user_id) {
         await adminAuthClient.auth.admin.deleteUser(teamData.user_id)
      } else {
         await adminAuthClient.from('teams').delete().eq('id', teamId)
      }
    } 
    else if (actionType === 'broadcast') {
      const { message } = body
      await adminAuthClient.from('events').insert({
        event_type: 'admin_token_change',
        triggered_by_role: 'admin',
        triggered_by_user_id: session.user.id,
        metadata: { isBroadcast: true, message }
      })
    }
    else if (actionType === 'end_event') {
      const { error } = await adminAuthClient.from('app_config').upsert({ key: 'event_ended', value: 'true' })
      if (error) throw error
      await adminAuthClient.from('events').insert({
        event_type: 'admin_token_change',
        triggered_by_role: 'admin',
        triggered_by_user_id: session.user.id,
        metadata: { isEndEvent: true }
      })
    }
    else {
      return NextResponse.json({ error: 'Invalid action type' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

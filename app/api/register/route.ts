import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await req.json()
    const { roleType } = body
    
    // Check if event already started (blocks all registrations)
    const { data: config } = await supabase.from('app_config').select('value').eq('key', 'event_started').maybeSingle()
    if (config?.value === 'true') {
      return NextResponse.json({ error: 'Registration is locked - Event has already started.' }, { status: 403 })
    }

    const adminAuthClient = getServiceRoleClient()

    if (roleType === 'team') {
      const { teamName, members, email, password } = body

      // Check team name uniqueness
      const { data: existingTeam } = await adminAuthClient.from('teams').select('id').eq('team_name', teamName).maybeSingle()
      if (existingTeam) return NextResponse.json({ error: 'Team name already taken' }, { status: 400 })

      // Create auth user
      const { data: authData, error: authError } = await adminAuthClient.auth.admin.createUser({
        email, password, email_confirm: true
      })
      if (authError) throw authError

      // Insert team
      const { data: teamData, error: teamError } = await adminAuthClient.from('teams').insert({
        team_name: teamName, user_id: authData.user.id
      }).select().single()
      if (teamError) throw teamError

      // Insert members
      const memberInserts = members.map((m: any) => ({ ...m, team_id: teamData.id }))
      const { error: membersError } = await adminAuthClient.from('team_members').insert(memberInserts)
      if (membersError) throw membersError

      // Setup initial progress mapping
      const progressInserts = ['alpha', 'beta', 'charlie', 'delta', 'gamma'].map(stage => ({
        team_id: teamData.id, stage, completed: false
      }))
      const { error: progressError } = await adminAuthClient.from('route_progress').insert(progressInserts)
      if (progressError) throw progressError
      
      return NextResponse.json({ success: true })
    } 
    else if (['zone_leader', 'black_market', 'vc'].includes(roleType)) {
      const { name, branch, rollNumber, year, code, email, password } = body
      
      // Validate code by fetching from role_codes
      const { data: codeData } = await adminAuthClient.from('role_codes').select('code').eq('role', roleType).maybeSingle()
      if (!codeData || codeData.code !== code) {
        return NextResponse.json({ error: 'Invalid secret registration code' }, { status: 400 })
      }

      // Create auth user
      const { data: authData, error: authError } = await adminAuthClient.auth.admin.createUser({
        email, password, email_confirm: true
      })
      if (authError) throw authError

      const tableMap: Record<string, string> = {
        zone_leader: 'zone_leaders',
        black_market: 'black_market_users',
        vc: 'vc_users'
      }

      const { error: insertError } = await adminAuthClient.from(tableMap[roleType]).insert({
        user_id: authData.user.id, name, branch, roll_number: rollNumber, year
      })
      
      if (insertError) throw insertError

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid role type' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 8

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { data: teams, error } = await supabase
      .from('teams')
      .select(`
        id,
        team_name,
        tokens,
        is_paused,
        pause_until,
        route_marker,
        members:team_members(name, roll_number, branch, year, section),
        progress:route_progress(stage, completed, completed_at)
      `)
      .order('tokens', { ascending: false })
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(teams, {
      headers: {
        'Cache-Control': 'public, s-maxage=8, stale-while-revalidate=4',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

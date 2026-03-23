import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { data: teams, error } = await supabase
      .from('teams')
      .select(`
        *,
        members:team_members(*),
        progress:route_progress(*)
      `)
      .order('tokens', { ascending: false })
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(teams)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

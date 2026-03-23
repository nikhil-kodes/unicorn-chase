import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { data: team, error } = await supabase
      .from('teams')
      .select(`
        *,
        members:team_members(*),
        progress:route_progress(*)
      `)
      .eq('id', params.id)
      .single()

    if (error || !team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    return NextResponse.json(team)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

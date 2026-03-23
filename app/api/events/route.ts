import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 10

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Filter out broadcasts for the public feed
    const filteredEvents = (events || []).filter(ev => !ev.metadata?.isBroadcast && !ev.metadata?.isEndEvent)

    return NextResponse.json(filteredEvents, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=5',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getUserRole } from '@/lib/auth/getRole'

export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const role = await getUserRole(session.user.id)
  if (!role) {
    return NextResponse.json({ error: 'Role not found' }, { status: 404 })
  }

  return NextResponse.json({ role })
}

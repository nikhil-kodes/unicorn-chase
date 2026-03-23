import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
 
export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  await supabase.auth.signOut()
  
  return NextResponse.redirect(new URL('/login', req.url), {
    status: 302,
  })
}

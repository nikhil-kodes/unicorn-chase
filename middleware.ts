import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Note: checking roles on every request in middleware can be slow since it hits DB, 
// so middleware just checks for valid session. The page server-components will check the actual role.
const PROTECTED_ROUTES: Record<string, string[]> = {
  '/dashboard/admin': ['admin'],
  '/dashboard/zone-leader': ['zone_leader'],
  '/dashboard/black-market': ['black_market'],
  '/dashboard/vc': ['vc'],
  '/passport': ['team'],
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const { data: { session } } = await supabase.auth.getSession()

  const path = req.nextUrl.pathname

  // Registration lock check
  if (path.startsWith('/register')) {
    const { data } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'event_started')
      .single()

    if (data?.value === 'true') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  // Auth check for protected routes
  for (const [route] of Object.entries(PROTECTED_ROUTES)) {
    if (path.startsWith(route)) {
      if (!session) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
      
      // Strict email check for admin dashboard
      if (route === '/dashboard/admin' && session.user.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/passport', '/register/:path*'],
}

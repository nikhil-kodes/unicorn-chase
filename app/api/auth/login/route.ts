import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { email, password } = await req.json()

    // Handle Admin override using pure env vars checking
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPass = process.env.ADMIN_PASSWORD
    if (email === adminEmail && password === adminPass) {
       // login directly via supabase auth using the standard signInWithPassword
       // as admin was theoretically created via dashboard
       const { data, error } = await supabase.auth.signInWithPassword({
         email: email,
         password: password
       })
       if (error) {
         return NextResponse.json({ error: error.message }, { status: 401 })
       }
       return NextResponse.json({ success: true, role: 'admin' })
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      return NextResponse.json({ error: error?.message || 'Invalid credentials' }, { status: 401 })
    }

    // Note: The actual redirecting to dashboards and getting role is done client-side after successful login
    // or by the client calling the getUserRole manually inside Server Components
    // Returning true implies Auth was successful
    return NextResponse.json({ success: true })

  } catch (error: any) {
    return NextResponse.json({ error: 'Server error: ' + error.message }, { status: 500 })
  }
}

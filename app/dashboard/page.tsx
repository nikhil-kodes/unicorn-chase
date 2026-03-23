import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserRole } from '@/lib/auth/getRole'

export const dynamic = 'force-dynamic'

export default async function DashboardRedirect() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  // If no session, go to login
  if (!session) {
    redirect('/login')
  }

  // Find their role and redirect accordingly
  const role = await getUserRole(session.user.id)

  switch (role) {
    case 'admin':
      redirect('/dashboard/admin')
    case 'zone_leader':
      redirect('/dashboard/zone-leader')
    case 'black_market':
      redirect('/dashboard/black-market')
    case 'vc':
      redirect('/dashboard/vc')
    case 'team':
      redirect('/passport')
    default:
      // If no valid role is found, just send them home
      redirect('/')
  }
}

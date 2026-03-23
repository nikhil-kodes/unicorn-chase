import { createServerClient } from '../supabase/server'
import { UserRole } from '@/types'

export async function getUserRole(userId: string): Promise<UserRole | null> {
  const supabase = createServerClient()
  
  // Check if admin via env
  if (userId && process.env.ADMIN_USER_ID && userId === process.env.ADMIN_USER_ID) {
    return 'admin'
  }

  const checks = [
    { table: 'zone_leaders', role: 'zone_leader' as UserRole },
    { table: 'black_market_users', role: 'black_market' as UserRole },
    { table: 'vc_users', role: 'vc' as UserRole },
    { table: 'teams', role: 'team' as UserRole },
  ]

  const results = await Promise.all(
    checks.map(async (check) => {
      const { data } = await supabase
        .from(check.table)
        .select('id')
        .eq('user_id', userId)
        .maybeSingle()
      return data ? check.role : null
    })
  )

  const foundRole = results.find(role => role !== null)
  return foundRole || null
}

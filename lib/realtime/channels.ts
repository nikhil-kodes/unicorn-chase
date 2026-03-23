import { createClient } from '../supabase/client'

export const subscribeToLeaderboard = async (onUpdate: (payload: any) => void) => {
  const supabase = createClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null

  return supabase
    .channel('leaderboard')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'teams' }, onUpdate)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'route_progress' }, onUpdate)
    .subscribe()
}

export const subscribeToEvents = async (onEvent: (payload: any) => void) => {
  const supabase = createClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null

  return supabase
    .channel('event-broadcast')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'events' }, onEvent)
    .subscribe()
}

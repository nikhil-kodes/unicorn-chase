import { createClient } from '../supabase/client'

export const subscribeToLeaderboard = (onUpdate: (payload: any) => void) => {
  const supabase = createClient()
  return supabase
    .channel('leaderboard')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'teams' }, onUpdate)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'route_progress' }, onUpdate)
    .subscribe()
}

export const subscribeToEvents = (onEvent: (payload: any) => void) => {
  const supabase = createClient()
  return supabase
    .channel('event-broadcast')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'events' }, onEvent)
    .subscribe()
}

export type RouteMarker = 'red' | 'blue' | 'green' | 'yellow' | 'black'
export type Stage = 'alpha' | 'beta' | 'charlie' | 'delta' | 'gamma'
export type UserRole = 'team' | 'zone_leader' | 'black_market' | 'vc' | 'admin'
export type EventType =
  | 'stage_completed' | 'phone_usage' | 'manual_deduction'
  | 'hint_given' | 'task_changed' | 'sabotage_sold' | 'sabotage_used'
  | 'token_increase' | 'skip_task' | 'admin_token_change'

export interface Team {
  id: string
  team_name: string
  route_marker: RouteMarker | null
  tokens: number
  is_paused: boolean
  pause_until: string | null
  created_at: string
  members?: TeamMember[]
  progress?: RouteProgress[]
}

export interface TeamMember {
  id: string
  team_id: string
  name: string
  roll_number: string
  branch: string
  year: number
  section: string
}

export interface RouteProgress {
  id: string
  team_id: string
  stage: Stage
  completed: boolean
  completed_at: string | null
}

export interface GameEvent {
  id: string
  event_type: EventType
  team_id: string | null
  secondary_team_id: string | null
  triggered_by_role: UserRole
  triggered_by_user_id: string | null
  token_delta: number | null
  metadata: Record<string, any>
  created_at: string
}

export interface ToastPayload {
  id: string
  eventType: EventType
  teamName: string
  teamId: string
  secondaryTeamName?: string
  triggeredByRole: UserRole
  tokenDelta?: number
  metadata?: Record<string, any>
}

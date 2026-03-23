'use client'

import { motion } from 'framer-motion'
import { X } from 'lucide-react'

interface EventToastProps {
  id: string
  event_type: string
  team_name?: string
  secondary_team_name?: string
  triggered_by_role: string
  token_delta?: number
  metadata?: any
  onDismiss: (id: string) => void
}

const roleAccent: Record<string, { bg: string; border: string; text: string }> = {
  zone_leader: { bg: 'bg-blue-500/[0.08]', border: 'border-blue-500/20', text: 'text-blue-400' },
  black_market: { bg: 'bg-rose-500/[0.08]', border: 'border-rose-500/20', text: 'text-rose-400' },
  vc: { bg: 'bg-emerald-500/[0.08]', border: 'border-emerald-500/20', text: 'text-emerald-400' },
  admin: { bg: 'bg-orange-500/[0.08]', border: 'border-orange-500/20', text: 'text-orange-400' },
}

export default function EventToast({ id, event_type, team_name, secondary_team_name, triggered_by_role, token_delta, metadata, onDismiss }: EventToastProps) {
  const accent = roleAccent[triggered_by_role] || roleAccent.zone_leader

  const getLabel = () => {
    switch (event_type) {
      case 'stage_completed': return `${metadata?.teamName || team_name} completed ${metadata?.stage?.toUpperCase()}`
      case 'phone_usage': return `📵 ${metadata?.teamName || team_name} caught using phone`
      case 'manual_deduction': return `⚖️ ${metadata?.teamName || team_name} penalized`
      case 'hint_given': return `💡 Hint given to ${metadata?.teamName || team_name}`
      case 'task_changed': return `🔄 Task changed for ${metadata?.teamName || team_name}`
      case 'sabotage_sold': return `💣 ${metadata?.teamName || team_name} bought a sabotage`
      case 'sabotage_used': return `❄️ ${metadata?.secondaryTeamName || secondary_team_name} frozen for 5 min!`
      case 'token_increase': return `⬆️ ${metadata?.teamName || team_name} received tokens`
      case 'skip_task': return `⏭️ Task skipped for ${metadata?.teamName || team_name}`
      case 'admin_token_change': return metadata?.isAdminOverride 
        ? `⚙️ Admin adjusted ${metadata?.teamName || team_name} tokens`
        : `⚙️ Global update applied by Admin`
      default: return `Announcement from ${triggered_by_role.replace(/_/g, ' ')}`
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl ${accent.bg} ${accent.border} shadow-card max-w-sm w-full`}
    >
      <div className="p-4 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${accent.text}`}>
              {triggered_by_role.replace('_', ' ')}
            </span>
            {token_delta !== undefined && token_delta !== 0 && (
              <span className={`text-xs font-mono font-bold ${token_delta > 0 ? 'text-accent-finish' : 'text-accent-danger'}`}>
                {token_delta > 0 ? '+' : ''}{token_delta}
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-primary leading-snug">{getLabel()}</p>
        </div>
        <button onClick={() => onDismiss(id)} className="text-muted hover:text-secondary transition-colors shrink-0 mt-0.5">
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

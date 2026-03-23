'use client'

import { Team } from '@/types'
import { Timer, ChevronDown } from 'lucide-react'
import TokenBadge from './TokenBadge'
import StageProgress from './StageProgress'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const MARKER_COLORS: Record<string, string> = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  black: '#6b7280',
}

export default function TeamCard({ team, rank }: { team: Team; rank: number }) {
  const [expanded, setExpanded] = useState(false)
  const [timeLeft, setTimeLeft] = useState<string | null>(null)

  useEffect(() => {
    if (!team.is_paused || !team.pause_until) { setTimeLeft(null); return }
    const interval = setInterval(() => {
      const remainingMs = new Date(team.pause_until!).getTime() - Date.now()
      if (remainingMs <= 0) { setTimeLeft('00:00'); clearInterval(interval) }
      else {
        const m = Math.floor(remainingMs / 60000)
        const s = Math.floor((remainingMs % 60000) / 1000)
        setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [team.is_paused, team.pause_until])

  const markerColor = team.route_marker ? MARKER_COLORS[team.route_marker] : undefined
  const isPaused = team.is_paused && timeLeft !== '00:00'
  const isTopThree = rank <= 3
  const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ layout: { type: 'spring', stiffness: 180, damping: 22 } }}
      className={`card group ${isPaused ? 'border-cyan-500/30' : ''} ${isTopThree ? 'glow-sm' : ''}`}
    >
      <div
        className="p-5 md:p-6 flex items-center justify-between cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4 md:gap-5 flex-1 min-w-0">
          {/* Rank */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold ${
            isTopThree
              ? 'bg-accent-primary/10 text-accent-glow border border-accent-primary/20'
              : 'bg-white/[0.03] text-muted border border-white/[0.06]'
          }`}>
            {rankEmoji || `#${rank}`}
          </div>

          {/* Team Info */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="font-display font-bold text-base md:text-lg text-primary truncate tracking-tight">
                {team.team_name}
              </h3>

              {markerColor && (
                <span className="chip flex items-center gap-1.5" style={{ borderColor: `${markerColor}30`, color: markerColor }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: markerColor }} />
                  {team.route_marker}
                </span>
              )}

              {isPaused && (
                <span className="chip flex items-center gap-1.5 border-cyan-500/30 text-cyan-400 animate-pulse">
                  <Timer className="w-3 h-3" />
                  {timeLeft}
                </span>
              )}
            </div>

            <StageProgress progress={team.progress || []} />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-5 shrink-0 ml-4">
          <TokenBadge tokens={team.tokens} />
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4 text-muted group-hover:text-secondary transition-colors" />
          </motion.div>
        </div>
      </div>

      {/* Expanded Members */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 md:px-6 pb-5 md:pb-6 pt-2">
              <div className="border-t border-white/[0.04] pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {team.members?.map((m, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1.5">
                      <p className="font-semibold text-sm text-primary">{m.name}</p>
                      <p className="text-xs font-mono text-muted">{m.roll_number}</p>
                      <p className="text-[11px] text-secondary">{m.branch} · Year {m.year} · {m.section}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

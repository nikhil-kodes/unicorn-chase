'use client'

import { Team } from '@/types'
import { Search, Zap } from 'lucide-react'
import { useState } from 'react'

interface TeamSelectorProps {
  teams: Team[]
  selectedTeamId: string | null
  onSelect: (id: string) => void
  disabledTeams?: string[]
}

export default function TeamSelector({ teams, selectedTeamId, onSelect, disabledTeams = [] }: TeamSelectorProps) {
  const [query, setQuery] = useState('')

  const filtered = teams.filter(t =>
    t.team_name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="h-full border-r border-white/[0.04] bg-base/50 overflow-y-auto flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-white/[0.04] sticky top-0 bg-base/80 backdrop-blur-xl z-10">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent-primary/30 transition-colors"
            placeholder="Search teams..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <p className="text-[11px] text-muted mt-2.5 font-mono">{filtered.length} teams</p>
      </div>

      {/* List */}
      <div className="flex-1">
        {filtered.map(team => {
          const isSelected = selectedTeamId === team.id
          const isDisabled = disabledTeams.includes(team.id)

          return (
            <div
              key={team.id}
              onClick={() => !isDisabled && onSelect(team.id)}
              className={`px-4 py-3.5 cursor-pointer transition-all duration-200 border-l-2 ${
                isSelected
                  ? 'bg-accent-primary/[0.06] border-accent-primary'
                  : isDisabled
                  ? 'opacity-30 cursor-not-allowed border-transparent'
                  : 'hover:bg-white/[0.02] border-transparent hover:border-white/[0.08]'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-sm text-primary truncate">{team.team_name}</span>
                <span className="text-accent-gold font-mono text-xs font-bold flex items-center gap-1 shrink-0 ml-2">
                  <Zap className="w-3 h-3 fill-current" />
                  {team.tokens}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {team.route_marker && (
                  <span className="text-[10px] font-bold uppercase text-muted">{team.route_marker}</span>
                )}
                {team.is_paused && (
                  <span className="text-[10px] font-bold text-cyan-400 animate-pulse">FROZEN</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

'use client'

import { Team } from '@/types'
import { useState, useEffect } from 'react'
import TeamSelector from '@/components/dashboard/TeamSelector'
import RoleHeader from '@/components/layout/RoleHeader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { subscribeToLeaderboard } from '@/lib/realtime/channels'

export default function VCDashboard() {
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [boostAmount, setBoostAmount] = useState('')

  useEffect(() => {
    fetch('/api/teams').then(res => res.json()).then(setTeams)
    const channelPromise = subscribeToLeaderboard(() => {
      fetch('/api/teams').then(res => res.json()).then(setTeams)
    })
    return () => { channelPromise.then(c => c?.unsubscribe()) }
  }, [])

  const selectedTeam = teams.find(t => t.id === selectedId)

  const handleAction = async (actionType: string, payload: any = {}) => {
    setLoading(true)
    await fetch('/api/vc/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ actionType, teamId: selectedId, payload }) })
    setLoading(false)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <RoleHeader roleName="Venture Capitalist" roleType="vc" />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 shrink-0 h-full"><TeamSelector teams={teams} selectedTeamId={selectedId} onSelect={setSelectedId} /></div>

        <div className="flex-1 h-full overflow-y-auto p-6 md:p-8">
          {selectedTeam ? (
            <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
              <div className="space-y-3">
                <h2 className="text-2xl font-display font-bold tracking-tight">{selectedTeam.team_name}</h2>
                <span className="chip border-accent-gold/20 text-accent-gold">⚡ {selectedTeam.tokens} tokens</span>
              </div>

              <div className="divider" />

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-secondary uppercase tracking-wider">Investment Actions</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="card p-5 space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm">💡 Strategic Insight</h4>
                      <p className="text-xs text-muted mt-1">Issue a puzzle hint for −1 token</p>
                    </div>
                    <Button className="w-full" size="sm" onClick={() => handleAction('hint_given')} isLoading={loading}>
                      Issue Hint
                    </Button>
                  </div>

                  <div className="card p-5 space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm">⏭️ Fast Track</h4>
                      <p className="text-xs text-muted mt-1">Skip next task for −4 tokens</p>
                    </div>
                    <Button className="w-full" size="sm" onClick={() => handleAction('skip_task')} isLoading={loading}>
                      Authorize Skip
                    </Button>
                  </div>
                </div>

                <div className="card p-5 space-y-3">
                  <h4 className="font-semibold text-sm text-emerald-400">💰 Capital Injection</h4>
                  <p className="text-xs text-muted">Direct token boost to team portfolio</p>
                  <div className="flex gap-2">
                    <Input placeholder="Amount" type="number" min={1} value={boostAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBoostAmount(e.target.value)} className="flex-1" />
                    <Button className="bg-emerald-600 hover:bg-emerald-500 text-white" onClick={() => { if (boostAmount) { handleAction('token_increase', { amount: Number(boostAmount) }); setBoostAmount('') } }} isLoading={loading}>
                      Inject
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center"><div className="space-y-3 text-center"><div className="text-4xl animate-float">💼</div><p className="text-muted text-sm">Select a team from the sidebar</p></div></div>
          )}
        </div>
      </div>
    </div>
  )
}

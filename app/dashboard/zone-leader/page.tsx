'use client'

import { Team } from '@/types'
import { useState, useEffect } from 'react'
import TeamSelector from '@/components/dashboard/TeamSelector'
import Sidebar from '@/components/dashboard/Sidebar'
import RoleHeader from '@/components/layout/RoleHeader'
import { Button } from '@/components/ui/Button'
import { getNextStage } from '@/lib/utils/stages'
import { subscribeToLeaderboard } from '@/lib/realtime/channels'

export default function ZoneLeaderDashboard() {
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [deductAmount, setDeductAmount] = useState('')
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetch('/api/teams').then(res => res.json()).then(setTeams)
    const channelPromise = subscribeToLeaderboard(() => {
      fetch('/api/teams').then(res => res.json()).then(setTeams)
    })
    return () => { channelPromise.then(c => c?.unsubscribe()) }
  }, [])

  const selectedTeam = teams.find(t => t.id === selectedId)
  const nextStage = selectedTeam ? getNextStage(selectedTeam.progress || []) : null

  const handleAction = async (endpoint: string, payload: any) => {
    setLoading(true)
    await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setLoading(false)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <RoleHeader roleName="Zone Leader" roleType="zone" onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)}>
          <TeamSelector teams={teams} selectedTeamId={selectedId} onSelect={(id) => { setSelectedId(id); setSidebarOpen(false) }} />
        </Sidebar>

        <div className="flex-1 h-full overflow-y-auto p-6 md:p-8">
          {selectedTeam ? (
            <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
              {/* Team Header */}
              <div className="space-y-3">
                <h2 className="text-2xl font-display font-bold tracking-tight">{selectedTeam.team_name}</h2>
                <div className="flex flex-wrap gap-2">
                  {selectedTeam.route_marker && <span className="chip">{selectedTeam.route_marker} route</span>}
                  <span className="chip border-accent-gold/20 text-accent-gold">⚡ {selectedTeam.tokens} tokens</span>
                </div>
              </div>

              <div className="divider" />

              {/* Stage Action */}
              <div className="card p-6 space-y-4">
                <h3 className="text-sm font-bold text-secondary uppercase tracking-wider">Stage Progression</h3>
                {nextStage ? (
                  <div className="space-y-4">
                    <p className="text-secondary text-sm">Next stage to mark complete:</p>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-display font-bold capitalize text-gradient">{nextStage}</span>
                    </div>
                    <Button
                      size="lg"
                      isLoading={loading}
                      onClick={() => handleAction('/api/zone-leader/action', { actionType: 'complete-stage', teamId: selectedTeam.id, stage: nextStage })}
                      className="w-full"
                    >
                      ✓ Mark {nextStage} Complete
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4"><p className="text-accent-finish font-bold text-lg">🏆 All stages completed!</p></div>
                )}
              </div>

              {/* Penalties */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-secondary uppercase tracking-wider">Penalties</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="card p-5 space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm flex items-center gap-2">📵 Phone Usage</h4>
                      <p className="text-xs text-muted mt-1">Fixed −2 token penalty</p>
                    </div>
                    <Button variant="destructive" className="w-full" size="sm" isLoading={loading}
                      onClick={() => handleAction('/api/zone-leader/action', { actionType: 'phone-usage', teamId: selectedTeam.id })}>
                      Apply Penalty
                    </Button>
                  </div>

                  <div className="card p-5 space-y-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">⚖️ Custom Deduction</h4>
                    <div className="flex gap-2">
                      <input
                        type="number" placeholder="Amount" min={1}
                        className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent-primary/30"
                        value={deductAmount} onChange={e => setDeductAmount(e.target.value)}
                      />
                      <Button variant="destructive" size="sm" isLoading={loading}
                        onClick={() => { if (deductAmount) { handleAction('/api/zone-leader/action', { actionType: 'deduct', teamId: selectedTeam.id, amount: Number(deductAmount) }); setDeductAmount('') } }}>
                        Deduct
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              <div className="space-y-3"><div className="text-4xl animate-float">🛡️</div><p className="text-muted text-sm">Select a team from the sidebar</p></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

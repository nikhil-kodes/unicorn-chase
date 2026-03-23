'use client'

import { Team } from '@/types'
import { useState, useEffect } from 'react'
import TeamSelector from '@/components/dashboard/TeamSelector'
import RoleHeader from '@/components/layout/RoleHeader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { subscribeToLeaderboard } from '@/lib/realtime/channels'

export default function BlackMarketDashboard() {
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sabotageBid, setSabotageBid] = useState('')
  const [victimMode, setVictimMode] = useState(false)
  const [sabotageBuyerId, setSabotageBuyerId] = useState<string | null>(null)
  const [boostAmount, setBoostAmount] = useState('')

  useEffect(() => {
    fetch('/api/teams').then(res => res.json()).then(setTeams)
    const channelPromise = subscribeToLeaderboard(() => { fetch('/api/teams').then(res => res.json()).then(setTeams) })
    return () => { channelPromise.then(c => c?.unsubscribe()) }
  }, [])

  const selectedTeam = teams.find(t => t.id === selectedId)

  const handleAction = async (actionType: string, payload: any = {}) => {
    setLoading(true)
    const res = await fetch('/api/black-market/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ actionType, teamId: selectedId, payload }) })
    setLoading(false)
    return res.ok
  }

  const handleBuySabotage = async () => {
    if (!sabotageBid) return
    const success = await handleAction('sabotage_sold', { bid: Number(sabotageBid) })
    if (success) { setSabotageBuyerId(selectedId); setVictimMode(true); setSelectedId(null); setSabotageBid('') }
  }

  const handleUseSabotage = async () => {
    if (!selectedId) return
    setLoading(true)
    await fetch('/api/black-market/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ actionType: 'sabotage_used', teamId: sabotageBuyerId, payload: { victimId: selectedId } }) })
    setLoading(false)
    setVictimMode(false)
    setSabotageBuyerId(null)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <RoleHeader roleName="Black Market" roleType="bm" />

      {victimMode && (
        <div className="w-full bg-accent-danger/10 border-b border-accent-danger/20 text-accent-danger font-bold text-center py-2.5 text-sm animate-pulse uppercase tracking-wider">
          ⚠️ Select a victim team to deploy sabotage
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 shrink-0 h-full">
          <TeamSelector teams={teams} selectedTeamId={selectedId} onSelect={setSelectedId} disabledTeams={victimMode ? [sabotageBuyerId!] : []} />
        </div>

        <div className="flex-1 h-full overflow-y-auto p-6 md:p-8">
          {selectedTeam ? (
            <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
              <div className="space-y-3">
                <h2 className="text-2xl font-display font-bold tracking-tight">{selectedTeam.team_name}</h2>
                <span className="chip border-accent-gold/20 text-accent-gold">⚡ {selectedTeam.tokens} tokens</span>
              </div>

              <div className="divider" />

              {victimMode ? (
                <div className="card p-6 border-accent-danger/20 space-y-4 text-center">
                  <h3 className="text-xl font-bold text-accent-danger">Deploy Sabotage</h3>
                  <p className="text-secondary text-sm">Freeze <strong>{selectedTeam.team_name}</strong> for 5 minutes?</p>
                  <Button className="w-full bg-accent-danger hover:bg-accent-danger/90 text-white" size="lg" onClick={handleUseSabotage} isLoading={loading}>
                    Confirm & Fire
                  </Button>
                  <button className="text-xs text-muted hover:text-secondary transition-colors" onClick={() => setVictimMode(false)}>Cancel</button>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-secondary uppercase tracking-wider">Actions</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button onClick={() => handleAction('hint_given')} disabled={loading}
                      className="card p-5 text-left hover:bg-white/[0.02] group transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-sm">💡 Hint</h4>
                        <span className="chip text-accent-danger border-accent-danger/20">−1</span>
                      </div>
                      <p className="text-xs text-muted">Provide puzzle assistance</p>
                    </button>

                    <button onClick={() => handleAction('task_changed')} disabled={loading}
                      className="card p-5 text-left hover:bg-white/[0.02] group transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-sm">🔄 Task Change</h4>
                        <span className="chip text-accent-danger border-accent-danger/20">−3</span>
                      </div>
                      <p className="text-xs text-muted">Swap current puzzle</p>
                    </button>
                  </div>

                  <div className="card p-5 space-y-3">
                    <h4 className="font-semibold text-sm text-emerald-400">⬆️ Boost Tokens</h4>
                    <div className="flex gap-2">
                      <Input placeholder="Amount" type="number" min={1} value={boostAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBoostAmount(e.target.value)} className="flex-1" />
                      <Button className="bg-emerald-600 hover:bg-emerald-500 text-white" onClick={() => { if (boostAmount) { handleAction('token_increase', { amount: Number(boostAmount) }); setBoostAmount('') } }} isLoading={loading}>
                        Boost
                      </Button>
                    </div>
                  </div>

                  <div className="card p-5 border-accent-danger/10 space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-accent-danger">💣 Sell Sabotage</h4>
                      <p className="text-xs text-muted mt-1">Deduct from buyer, then select a victim to freeze</p>
                    </div>
                    <div className="flex gap-2">
                      <Input type="number" min={1} placeholder="Bid amount" value={sabotageBid} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSabotageBid(e.target.value)} className="flex-1 font-mono" />
                      <Button variant="destructive" onClick={handleBuySabotage} disabled={!sabotageBid} isLoading={loading}>
                        Sell
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center"><div className="space-y-3 text-center"><div className="text-4xl animate-float">💣</div><p className="text-muted text-sm">Select a team from the sidebar</p></div></div>
          )}
        </div>
      </div>
    </div>
  )
}

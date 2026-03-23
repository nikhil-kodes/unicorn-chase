'use client'

import { Team } from '@/types'
import { useState, useEffect } from 'react'
import RoleHeader from '@/components/layout/RoleHeader'
import { Button } from '@/components/ui/Button'
import { subscribeToLeaderboard } from '@/lib/realtime/channels'
import { Zap, Users, Activity, Settings, Trash2 } from 'lucide-react'

export default function AdminDashboard() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(false)
  const [eventStarted, setEventStarted] = useState(false)
  const [eventEnded, setEventEnded] = useState(false)
  const [broadcastMessage, setBroadcastMessage] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  const fetchState = async () => {
    const t = await fetch('/api/teams').then(res => res.json())
    setTeams(t)
  }

  useEffect(() => {
    fetchState()
    const channel = subscribeToLeaderboard(() => fetchState())
    return () => { channel.unsubscribe() }
  }, [])

  const handleStartEvent = async () => {
    const conf = prompt("Type CONFIRM to lock registration and start the event:")
    if (conf === "CONFIRM") {
      setLoading(true)
      const res = await fetch('/api/admin/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ actionType: 'start_event' }) })
      if (res.ok) setEventStarted(true)
      setLoading(false)
    }
  }

  const handleEndEvent = async () => {
    const conf = prompt("Type END to officially finish the event and lock all actions:")
    if (conf === "END") {
      setLoading(true)
      const res = await fetch('/api/admin/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ actionType: 'end_event' }) })
      if (res.ok) setEventEnded(true)
      setLoading(false)
    }
  }

  const handleBroadcast = async () => {
    if (!broadcastMessage.trim()) return
    setLoading(true)
    const res = await fetch('/api/admin/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ actionType: 'broadcast', message: broadcastMessage }) })
    if (res.ok) setBroadcastMessage('')
    setLoading(false)
  }

  const handleAssignMarker = async (id: string, marker: string) => {
    await fetch('/api/admin/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ actionType: 'assign_marker', teamId: id, marker }) })
  }

  const handleDelete = async (id: string) => {
    if (confirm("Permanently delete this team?")) {
      await fetch('/api/admin/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ actionType: 'delete_team', teamId: id }) })
      setTeams(teams.filter(t => t.id !== id))
    }
  }

  const handleTokenOverride = async (id: string) => {
    const amt = prompt("Enter new token count:")
    if (amt && !isNaN(parseInt(amt))) {
      await fetch('/api/admin/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ actionType: 'override_tokens', teamId: id, tokens: parseInt(amt) }) })
    }
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Activity },
    { key: 'teams', label: 'Teams', icon: Users },
    { key: 'controls', label: 'Controls', icon: Settings },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <RoleHeader roleName="Administrator" roleType="admin" />

      {/* Tabs */}
      <div className="border-b border-white/[0.04] bg-base/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 flex gap-1">
          {tabs.map(tab => (
            <button key={tab.key}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium transition-all border-b-2 ${
                activeTab === tab.key
                  ? 'text-orange-400 border-orange-400'
                  : 'text-muted hover:text-secondary border-transparent'
              }`}
              onClick={() => setActiveTab(tab.key)}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 md:p-8">
        <div className="max-w-6xl mx-auto">

          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="card p-6 space-y-2">
                  <div className="flex items-center gap-2 text-muted"><Users className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-wider">Teams</span></div>
                  <p className="text-4xl font-display font-bold">{teams.length}</p>
                </div>
                <div className="card p-6 space-y-2">
                  <div className="flex items-center gap-2 text-muted"><Activity className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-wider">Status</span></div>
                  <p className={`text-4xl font-display font-bold ${eventStarted ? 'text-accent-finish' : 'text-accent-gold'}`}>
                    {eventStarted ? 'LIVE' : 'PRE-GAME'}
                  </p>
                </div>
                <div className="card p-6 space-y-2">
                  <div className="flex items-center gap-2 text-muted"><Zap className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-wider">Top Score</span></div>
                  <p className="text-4xl font-display font-bold text-accent-gold">{teams[0]?.tokens || 0}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'teams' && (
            <div className="animate-fade-in">
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.04]">
                        <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted">Team</th>
                        <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted">Route</th>
                        <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted text-right">Tokens</th>
                        <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {teams.map(team => (
                        <tr key={team.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-3.5 font-semibold text-primary">{team.team_name}</td>
                          <td className="px-5 py-3.5">
                            <select
                              className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-2.5 py-1.5 text-xs text-primary focus:outline-none focus:border-accent-primary/30 cursor-pointer"
                              value={team.route_marker || ''}
                              onChange={(e) => handleAssignMarker(team.id, e.target.value)}>
                              <option value="">None</option>
                              <option value="red">Red</option>
                              <option value="blue">Blue</option>
                              <option value="green">Green</option>
                              <option value="yellow">Yellow</option>
                              <option value="black">Black</option>
                            </select>
                          </td>
                          <td className="px-5 py-3.5 text-right font-mono text-accent-gold font-bold text-sm">
                            <span className="inline-flex items-center gap-1"><Zap className="w-3 h-3 fill-current" />{team.tokens}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex gap-2 justify-center">
                              <Button size="sm" variant="ghost" className="text-xs h-8" onClick={() => handleTokenOverride(team.id)}>Edit ⚡</Button>
                              <Button size="sm" variant="destructive" className="text-xs h-8" onClick={() => handleDelete(team.id)}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'controls' && (
            <div className="max-w-md animate-fade-in space-y-6">
              <div className="card p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-display font-bold mb-1">Event Lifecycle</h3>
                  <p className="text-sm text-muted">Manage the global state of the entire scavenger hunt.</p>
                </div>
                <div className="space-y-3">
                  <Button
                    variant={eventStarted ? 'secondary' : 'primary'}
                    size="lg" className="w-full"
                    disabled={eventStarted || loading}
                    onClick={handleStartEvent}
                    isLoading={loading}>
                    {eventStarted ? '🟢 Event is Live' : '🚀 Start Event'}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="lg" className="w-full"
                    disabled={!eventStarted || eventEnded || loading}
                    onClick={handleEndEvent}
                    isLoading={loading}>
                    {eventEnded ? '🛑 Event Ended' : '🛑 End Event'}
                  </Button>
                </div>
              </div>

              <div className="card p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-display font-bold mb-1">Global Broadcast</h3>
                  <p className="text-sm text-muted">Send a massive flash alert to all players and event staff instantly.</p>
                </div>
                <textarea 
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent-primary/50 resize-none h-24"
                  placeholder="e.g. Stage 3 is now open! Bonus 50 tokens for the next team to arrive..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                />
                <Button onClick={handleBroadcast} disabled={!broadcastMessage.trim() || loading} isLoading={loading} className="w-full">
                  📣 Dispatch Broadcast
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

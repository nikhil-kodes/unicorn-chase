'use client'

import { useState, useEffect } from 'react'
import { subscribeToLeaderboard } from '@/lib/realtime/channels'
import TeamCard from './TeamCard'

export default function LeaderboardList({ initialTeams }: { initialTeams: any[] }) {
  const [teams, setTeams] = useState<any[]>(initialTeams)

  useEffect(() => {
    const channel = subscribeToLeaderboard(() => {
      fetch('/api/teams')
        .then(res => res.json())
        .then(data => setTeams(data))
    })
    return () => { channel.unsubscribe() }
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 space-y-3">
      {teams.length === 0 && (
        <div className="text-center py-28">
          <div className="text-5xl mb-4 animate-float">🦄</div>
          <p className="text-secondary text-lg font-medium">No teams registered yet</p>
          <p className="text-muted text-sm mt-2">Teams will appear here once they sign up</p>
        </div>
      )}

      <div className="stagger">
        {teams.map((team, index) => (
          <TeamCard key={team.id} team={team} rank={index + 1} />
        ))}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import TeamCard from './TeamCard'

export default function LeaderboardList({ initialTeams }: { initialTeams: any[] }) {
  const [teams, setTeams] = useState<any[]>(initialTeams)
  const supabase = createClient()

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/leaderboard')
        const data = await res.json()
        if (Array.isArray(data)) setTeams(data)
      } catch (err) {
        console.error('Polling failed:', err)
      }
    }

    fetchLeaderboard() // Immediate first load
    const interval = setInterval(fetchLeaderboard, 10000)
    return () => clearInterval(interval)
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

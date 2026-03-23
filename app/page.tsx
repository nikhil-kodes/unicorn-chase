import { createServerClient } from '@/lib/supabase/server'
import LeaderboardList from '@/components/leaderboard/LeaderboardList'
import ActivityFeed from '@/components/leaderboard/ActivityFeed'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = createServerClient()

  const { data: teams } = await supabase
    .from('teams')
    .select('*, members:team_members(*), progress:route_progress(*)')
    .order('tokens', { ascending: false })
    .order('created_at', { ascending: true })

  const { data: config } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', 'event_ended')
    .single()
    
  const eventEnded = config?.value === 'true'

  // Fetch initial events for the activity feed, filtering out broadcasts
  const { data: recentEvents } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)
    
  const filteredEvents = (recentEvents || []).filter(ev => !ev.metadata?.isBroadcast && !ev.metadata?.isEndEvent)

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* ── Ambient Background ── */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-accent-primary/[0.08] blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-accent-gold/[0.04] blur-[120px] rounded-full" />
        <div className="dot-grid absolute inset-0 opacity-40" />
      </div>

      {/* ── Navigation Bar ── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.04] bg-base/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="rounded-xl" />
            <span className="font-display font-bold text-lg tracking-tight">Unicorn Chase</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/register" className="text-sm text-secondary hover:text-primary transition-colors px-4 py-2">
              Register
            </Link>
            <Link href="/login" className="text-sm bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/[0.15] px-5 py-2 rounded-xl font-medium transition-all">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative z-10 pt-20 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {eventEnded ? (
            <div className="inline-flex items-center gap-2.5 chip bg-accent-gold/10 border-accent-gold/20 text-accent-gold animate-fade-in">
              <span>🏆 EVENT CONCLUDED</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2.5 chip animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-finish opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-finish" />
              </span>
              LIVE LEADERBOARD
            </div>
          )}

          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-[1.05] animate-fade-in-up">
            <span className="text-gradient">The Race</span>{' '}
            <span className="text-primary">{eventEnded ? 'Is Over' : 'Is On'}</span>
          </h1>

          <p className="text-secondary text-lg md:text-xl max-w-xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {eventEnded 
              ? "The dust has settled. The chase is complete. Behold the final standings of the startup challenge."
              : "Real-time scores, live sabotages, and startup chaos. Track every team's journey to the finish line."}
          </p>
        </div>
      </section>

      {/* ── Main Content Area ── */}
      <section className="relative z-10 pb-32 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Activity Feed (Left Column visually, takes up 4 columns on large screens) */}
          <div className="lg:col-span-4 order-2 lg:order-1 sticky top-24 pt-12 lg:pt-0">
            <ActivityFeed initialEvents={filteredEvents} />
          </div>

          {/* Leaderboard (Right/Main Column, takes up 8 columns) */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <LeaderboardList initialTeams={teams || []} />
          </div>

        </div>
      </section>
    </main>
  )
}

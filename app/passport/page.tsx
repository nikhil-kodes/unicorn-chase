import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TokenBadge from '@/components/leaderboard/TokenBadge'
import StageProgress from '@/components/leaderboard/StageProgress'
import { getUserRole } from '@/lib/auth/getRole'
import Link from 'next/link'
import { LogOut } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function PassportPage() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const role = await getUserRole(session.user.id)
  if (role !== 'team') redirect('/login')

  const { data: teamData } = await supabase
    .from('teams')
    .select('*, members:team_members(*), progress:route_progress(*)')
    .eq('user_id', session.user.id)
    .single()

  if (!teamData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <p className="text-secondary text-lg mb-4">Team data not found.</p>
        <form action="/auth/signout" method="post"><button type="submit" className="text-accent-glow hover:underline">Logout</button></form>
      </div>
    )
  }

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .or(`team_id.eq.${teamData.id},secondary_team_id.eq.${teamData.id}`)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent-primary/[0.06] blur-[140px] rounded-full" />
        <div className="dot-grid absolute inset-0 opacity-30" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.04] bg-base/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-sm text-muted hover:text-secondary transition-colors group">
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            Leaderboard
          </Link>
          <form action="/auth/signout" method="post">
            <button type="submit" className="text-sm font-medium text-muted hover:text-secondary transition-colors flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </form>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-fade-in-up">

        {/* Hero */}
        <header className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="chip border-accent-primary/20 text-accent-glow">Equity Passport</span>
            {teamData.is_paused && (
              <span className="chip border-cyan-500/20 text-cyan-400 animate-pulse">❄️ Frozen</span>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">{teamData.team_name}</h1>
              {teamData.route_marker && (
                <span className="chip capitalize">{teamData.route_marker} route</span>
              )}
            </div>

            <div className="card p-5 flex flex-col items-end shrink-0 min-w-[160px]">
              <span className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5">Total Equity</span>
              <TokenBadge tokens={teamData.tokens} />
            </div>
          </div>
        </header>

        <div className="divider" />

        {/* Route Progress */}
        <section className="card p-6 space-y-5">
          <h2 className="text-sm font-bold text-secondary uppercase tracking-wider">Route Progression</h2>
          <div className="flex justify-center py-2 transform scale-125 origin-center">
            <StageProgress progress={teamData.progress || []} />
          </div>
        </section>

        {/* Team Roster */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-secondary uppercase tracking-wider">Team Roster</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {teamData.members?.map((m: any, idx: number) => (
              <div key={idx} className="card p-4 space-y-2">
                <p className="font-semibold text-sm text-primary">{m.name}</p>
                <p className="text-xs font-mono text-muted">{m.roll_number}</p>
                <p className="text-[11px] text-secondary">{m.branch} · Year {m.year} · {m.section}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Transaction History */}
        <section className="space-y-4 pb-16">
          <h2 className="text-sm font-bold text-secondary uppercase tracking-wider">Transaction History</h2>
          <div className="card overflow-hidden">
            {events?.length ? (
              <div className="divide-y divide-white/[0.03]">
                {events.map((ev: any) => (
                  <div key={ev.id} className="px-5 py-4 flex justify-between items-center hover:bg-white/[0.01] transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="chip text-[10px]">{ev.triggered_by_role.replace('_', ' ')}</span>
                        <span className="text-[11px] text-muted font-mono">{new Date(ev.created_at).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm text-primary font-medium">
                        {ev.event_type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </p>
                    </div>
                    {ev.token_delta !== 0 && ev.token_delta && (
                      <span className={`font-mono font-bold text-sm ${ev.token_delta > 0 ? 'text-accent-finish' : 'text-accent-danger'}`}>
                        {ev.token_delta > 0 ? '+' : ''}{ev.token_delta}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted text-sm">No transactions yet</div>
            )}
          </div>
        </section>

      </div>
    </div>
  )
}

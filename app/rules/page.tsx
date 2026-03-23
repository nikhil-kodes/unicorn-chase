import Link from 'next/link'
import { ArrowLeft, Landmark, Zap, Compass, Users, Scroll, ShieldAlert, Award, MessageSquare } from 'lucide-react'

export const metadata = {
  title: "Official Rulebook — Unicorn Chase",
  description: "Understand the startup lifecycle, token economy, and competition rules of the live scavenger hunt."
}

export default function RulebookPage() {
  return (
    <div className="min-h-screen relative overflow-hidden selection:bg-accent-primary/20">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent-primary/[0.04] blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-gold/[0.04] blur-[120px] rounded-full" />
        <div className="dot-grid absolute inset-0 opacity-20" />
      </div>

      <nav className="sticky top-0 z-50 border-b border-white/[0.04] bg-base/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted hover:text-secondary transition-all group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16 space-y-20 pb-32">
        
        {/* Header */}
        <header className="space-y-6 text-center">
          <div className="inline-flex items-center gap-2.5 chip bg-white/[0.03] border-white/[0.08] text-muted uppercase tracking-[0.2em] text-[10px] font-bold">
            <Scroll className="w-3 h-3" />
            V1.0 Official Rulebook
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight">
            The <span className="text-primary italic">Unicorn</span> Chase
          </h1>
          <p className="text-secondary text-lg font-medium italic opacity-70">
            &quot;Think like a Startup. Move like a Wolfpack.&quot;
          </p>
        </header>

        {/* Sections */}
        <div className="space-y-16">
          
          {/* 1. Startup Journey */}
          <section className="space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-display font-bold tracking-tight text-primary uppercase">1. The Startup Journey (Zones)</h2>
            </div>
            <div className="card p-6 md:p-8 space-y-6 bg-blue-500/[0.02]">
              <p className="text-secondary leading-relaxed">All teams must complete the startup lifecycle stages in sequence:</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {['Alpha', 'Beta', 'Charlie', 'Delta', 'Gamma'].map((zone, i) => (
                  <div key={zone} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Stage {i+1}</span>
                    <span className="font-display font-bold text-sm text-primary">{zone}</span>
                  </div>
                ))}
              </div>
              <ul className="space-y-3 pt-2">
                <li className="flex gap-3 text-sm text-secondary">
                  <span className="text-blue-400 font-bold">→</span>
                  Passport Stamp is the official proof of zone completion.
                </li>
                <li className="flex gap-3 text-sm text-secondary">
                  <span className="text-blue-400 font-bold">→</span>
                  Marker colour determines the task in each zone.
                </li>
                <li className="flex gap-3 text-sm text-secondary">
                  <span className="text-blue-400 font-bold">→</span>
                  Zones must be completed in alphabetical order. <span className="text-accent-danger font-semibold italic">Skipping any zone = immediate disqualification.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 2. Team & Movement */}
          <section className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-display font-bold tracking-tight text-primary uppercase">2. Team & Movement Rules</h2>
            </div>
            <div className="card p-6 md:p-8 space-y-5">
              <div className="p-4 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/10 border-l-4 border-l-emerald-400">
                <h4 className="text-emerald-400 font-bold text-sm uppercase tracking-wider mb-2">Wolfpack Rule</h4>
                <p className="text-secondary text-sm leading-relaxed">Full team must be present for all tasks and stamps. Splitting up results in <strong>−3 Tokens</strong> and return to previous zone.</p>
              </div>
              <ul className="space-y-3 list-disc list-inside text-sm text-secondary leading-relaxed marker:text-emerald-400/50">
                <li>Team size: 3–4 members.</li>
                <li>Zones must be completed in alphabetical order (Alpha → Beta → Charlie → Delta → Gamma).</li>
                <li>Misconduct or public nuisance: −2 Tokens + 2-minute timeout.</li>
                <li>Arguing with Zone Leads or Volunteers: <span className="text-accent-danger font-bold uppercase underline decoration-2 underline-offset-4">Immediate Disqualification.</span></li>
              </ul>
            </div>
          </section>

          {/* 3. The Token Economy */}
          <section className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center text-accent-gold group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <h2 className="text-2xl font-display font-bold tracking-tight text-primary uppercase">3. The Token Economy (Funding)</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card p-6 space-y-3">
                <h4 className="text-xs font-bold text-muted uppercase">Base Capital</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-secondary">Starting Funding</span>
                    <span className="font-mono text-accent-gold font-bold">2 Tokens</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-secondary">Min Active Balance</span>
                    <span className="font-mono text-accent-gold font-bold">3 Tokens</span>
                  </div>
                </div>
              </div>
              <div className="card p-6 space-y-3">
                <h4 className="text-xs font-bold text-muted uppercase">Zone Rewards</h4>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <span className="text-secondary">Alpha</span><span className="text-accent-finish font-bold">+2 Tokens</span>
                  <span className="text-secondary">Beta</span><span className="text-accent-finish font-bold">+2 Tokens</span>
                  <span className="text-secondary">Charlie</span><span className="text-accent-finish font-bold">+3 Tokens</span>
                  <span className="text-secondary">Delta</span><span className="text-accent-finish font-bold">+3 Tokens</span>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Marketplace */}
          <section className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Landmark className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-display font-bold tracking-tight text-primary uppercase">4. The Dynamic Marketplace</h2>
            </div>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-white/[0.04] text-muted border-b border-white/[0.06]">
                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Advantage</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Cost</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Provider</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {[
                      { item: 'Clue Hint', cost: '1 Token', provider: 'VC / Black Market' },
                      { item: 'Phone Usage (2 min)', cost: '2 Tokens', provider: 'Zone Lead' },
                      { item: 'Pivot (Task Swap)', cost: '3 Tokens', provider: 'Black Market' },
                      { item: 'Fast Track (Skip)', cost: '4 Tokens', provider: 'Venture Capitalist' },
                      { item: 'Sabotage rival', cost: 'Bid 3+', provider: 'Black Market' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-white/[0.01]">
                        <td className="px-6 py-4 font-medium text-primary">{row.item}</td>
                        <td className="px-6 py-4 font-mono text-accent-gold">{row.cost}</td>
                        <td className="px-6 py-4 text-muted italic">{row.provider}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-accent-primary/10 text-[11px] text-accent-glow flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-glow animate-pulse" />
                Note: VC & Black Market locations update periodically during the event.
              </div>
            </div>
          </section>

          {/* 5. Sabotage & Penalties */}
          <section className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-accent-danger/10 border border-accent-danger/20 flex items-center justify-center text-accent-danger group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-display font-bold tracking-tight text-primary uppercase">5. Sabotage & Penalties</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card p-6 space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold"><Zap className="w-4 h-4" /> Freeze Rule</div>
                <p className="text-xs text-secondary leading-relaxed">Spend tokens to stop a rival for 5 mins. Max 3 sabotage cards allowed total per team.</p>
              </div>
              <div className="card p-6 border-accent-danger/20 bg-accent-danger/[0.02] space-y-4">
                <div className="flex items-center gap-2 text-accent-danger font-bold underline underline-offset-4 decoration-accent-danger/30">Immediate DQ</div>
                <p className="text-xs text-secondary leading-relaxed">Stamp forgery, token tampering, or passport fraud results in instant disqualification.</p>
              </div>
            </div>
            
            <div className="card overflow-hidden border-white/[0.02]">
              <div className="bg-white/[0.03] px-6 py-3 text-[10px] font-bold text-muted uppercase tracking-widest border-b border-white/[0.05]">Violation Reference Card</div>
              <div className="divide-y divide-white/[0.03]">
                {[
                  { v: 'Splitting members', c: '−3 Tokens + return to previous zone' },
                  { v: 'Skipping zones', c: 'Instant Disqualification' },
                  { v: 'Public nuisance', c: '−2 Tokens + 2-min timeout' },
                  { v: 'Arguing with staff', c: 'Instant Disqualification' },
                  { v: 'Outside help', c: '−3 Tokens' },
                ].map((row, i) => (
                  <div key={i} className="px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 hover:bg-white/[0.01]">
                    <span className="text-primary font-medium text-sm">{row.v}</span>
                    <span className="text-muted text-xs font-mono">{row.c}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 6. Winners */}
          <section className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-accent-finish/10 border border-accent-finish/20 flex items-center justify-center text-accent-finish group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-display font-bold tracking-tight text-primary uppercase">6. Winner Criteria & Prizes</h2>
            </div>
            <div className="card p-6 md:p-8 space-y-6">
              <div className="text-center p-6 bg-accent-finish/[0.04] rounded-2xl border border-accent-finish/10">
                <p className="text-secondary text-sm mb-4">The ultimate goal:</p>
                <div className="text-primary font-display font-bold text-xl md:text-2xl leading-tight">
                  First team to reach <span className="text-accent-finish italic underline decoration-accent-finish/20 underline-offset-8">Gamma (IPO) Zone</span> with all stamps & min balance.
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-3">
                  <h4 className="text-xs font-bold text-muted uppercase tracking-widest">Tie-Breaker Hierarchy</h4>
                  <ol className="list-decimal list-inside text-sm text-secondary space-y-2">
                    <li>Highest remaining token balance</li>
                    <li>Task performance rating</li>
                  </ol>
                </div>
                <div className="flex-1 space-y-3">
                  <h4 className="text-xs font-bold text-muted uppercase tracking-widest">Prize Pool</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm"><span className="text-primary">🥇 1st Place</span><span className="font-bold text-accent-gold">₹5,000</span></div>
                    <div className="flex justify-between items-center text-sm"><span className="text-primary">🥈 2nd Place</span><span className="text-zinc-300">₹3,000</span></div>
                    <div className="flex justify-between items-center text-sm"><span className="text-primary">🥉 3rd Place</span><span className="text-orange-600">₹2,000</span></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 7. Dispute */}
          <section className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-display font-bold tracking-tight text-primary uppercase">7. Dispute Resolution</h2>
            </div>
            <div className="card p-6 space-y-4">
              <p className="text-sm text-secondary leading-relaxed">All disputes must be escalated in this order:</p>
              <div className="flex items-center gap-2 flex-wrap text-sm text-primary font-mono font-bold">
                <span>Zone Lead</span> <span className="text-muted">→</span>
                <span>Ops Lead</span> <span className="text-muted">→</span>
                <span>Vice President</span> <span className="text-muted">→</span>
                <span className="chip border-orange-500/30 text-orange-400">President (Final Decision)</span>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <footer className="card p-8 bg-accent-gold/[0.02] border-accent-gold/10 text-center space-y-4">
          <div className="chip border-accent-gold/20 text-accent-gold mx-auto">FINAL RULE</div>
          <p className="text-secondary text-sm leading-relaxed max-w-lg mx-auto italic">
            &quot;Breaking rules may result in token penalties, time penalties, or disqualification. The Organizing Committee reserves the right to make final decisions on all matters. All decisions by the President are binding and final.&quot;
          </p>
          <div className="pt-6">
            <Link href="/register" className="btn-primary flex items-center justify-center gap-2 group max-w-xs mx-auto">
              I Understand, Sign Up
              <Zap className="w-4 h-4 fill-current group-hover:scale-125 transition-transform" />
            </Link>
          </div>
        </footer>

      </main>
    </div>
  )
}

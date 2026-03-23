'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Users, Shield, Bomb, Briefcase, ArrowRight, Lock } from 'lucide-react'

const initialRoles = [
  {
    name: 'Team',
    description: 'Create a squad of 1–4 members and compete.',
    href: '/register/team',
    icon: Users,
    gradient: 'from-violet-500/20 to-purple-600/20',
    border: 'group-hover:border-violet-500/30',
    iconBg: 'bg-violet-500/10 text-violet-400',
    isTeam: true,
  },
  {
    name: 'Zone Leader',
    description: 'Manage stages and enforce penalties. Code required.',
    href: '/register/zone-leader',
    icon: Shield,
    gradient: 'from-blue-500/20 to-cyan-500/20',
    border: 'group-hover:border-blue-500/30',
    iconBg: 'bg-blue-500/10 text-blue-400',
  },
  {
    name: 'Black Market',
    description: 'Sell sabotages and run the underground. Code required.',
    href: '/register/black-market',
    icon: Bomb,
    gradient: 'from-rose-500/20 to-red-600/20',
    border: 'group-hover:border-rose-500/30',
    iconBg: 'bg-rose-500/10 text-rose-400',
  },
  {
    name: 'Venture Capitalist',
    description: 'Fast-track teams and inject capital. Code required.',
    href: '/register/vc',
    icon: Briefcase,
    gradient: 'from-emerald-500/20 to-green-600/20',
    border: 'group-hover:border-emerald-500/30',
    iconBg: 'bg-emerald-500/10 text-emerald-400',
  },
]

export default function RegisterPortalPage() {
  const [registrationsOpen, setRegistrationsOpen] = useState<boolean | null>(null)

  useEffect(() => {
    fetch('/api/api-config')
      .then(res => res.json())
      .then(data => {
        setRegistrationsOpen(data.registrations_open === 'true')
      })
      .catch(() => setRegistrationsOpen(false))
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-accent-primary/[0.06] blur-[140px] rounded-full" />
        <div className="dot-grid absolute inset-0 opacity-30" />
      </div>

      <div className="w-full max-w-3xl animate-fade-in-up">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-secondary transition-colors mb-10 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Back to leaderboard
        </Link>

        <div className="space-y-3 mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
            Join the <span className="text-gradient">Chase</span>
          </h1>
          <p className="text-secondary text-lg max-w-lg leading-relaxed">
            Select your role to get started. Team registration depends on the event organizer's toggle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {initialRoles.map((role) => {
            const isTeamLocked = role.isTeam && registrationsOpen === false
            
            return (
              <Link
                key={role.name}
                href={isTeamLocked ? '#' : role.href}
                className={`group card p-6 flex items-start gap-4 transition-all duration-300 ${
                  isTeamLocked 
                    ? 'opacity-60 grayscale cursor-not-allowed border-white/[0.04]' 
                    : `hover:bg-white/[0.02] ${role.border}`
                }`}
                onClick={(e) => { if (isTeamLocked) e.preventDefault() }}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  isTeamLocked ? 'bg-white/[0.05] text-muted' : role.iconBg
                } transition-transform group-hover:scale-110`}>
                  {isTeamLocked ? <Lock className="w-5 h-5" /> : <role.icon className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="font-display font-bold text-lg text-primary">{role.name}</h2>
                    {!isTeamLocked && <ArrowRight className="w-4 h-4 text-muted group-hover:text-secondary group-hover:translate-x-0.5 transition-all" />}
                  </div>
                  <p className="text-sm text-secondary leading-relaxed">
                    {isTeamLocked 
                      ? 'Registration is currently locked by the admin.' 
                      : role.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

        <p className="mt-10 text-center text-sm text-muted">
          Already registered?{' '}
          <Link href="/login" className="text-accent-glow hover:text-accent-primary transition-colors font-medium">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  )
}

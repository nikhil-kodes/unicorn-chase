'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import Link from 'next/link'

export default function TeamRegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [memberCount, setMemberCount] = useState(1)

  const asyncWrapper = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const teamName = formData.get('teamName') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const members = Array.from({ length: memberCount }).map((_, i) => ({
      name: formData.get(`member_${i}_name`),
      roll_number: formData.get(`member_${i}_roll`),
      branch: formData.get(`member_${i}_branch`),
      year: parseInt(formData.get(`member_${i}_year`) as string, 10),
      section: formData.get(`member_${i}_section`),
    }))

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleType: 'team', teamName, email, password, members })
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Registration failed')
      router.push('/passport')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] bg-accent-primary/[0.06] blur-[140px] rounded-full" />
      </div>

      <div className="w-full max-w-lg animate-fade-in-up">
        <Link href="/register" className="inline-flex items-center gap-2 text-sm text-muted hover:text-secondary transition-colors mb-8 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          All roles
        </Link>

        <div className="space-y-2 mb-8">
          <div className="chip w-fit border-accent-primary/20 text-accent-glow">🦄 Team</div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Register Your Team</h1>
          <p className="text-secondary text-sm">Create your squad, get your passport, and start competing.</p>
        </div>

        {error && (
          <div className="mb-6 bg-accent-danger/[0.08] border border-accent-danger/20 text-accent-danger px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={asyncWrapper} className="space-y-6">
          {/* Team Details */}
          <div className="card p-5 space-y-4">
            <h2 className="text-sm font-bold text-secondary uppercase tracking-wider">Team Details</h2>
            <Input label="Team Name" name="teamName" placeholder="Your team's identity" required />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Login Email" name="email" type="email" placeholder="team@email.com" required />
              <Input label="Password" name="password" type="password" placeholder="Min 6 chars" required minLength={6} />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-secondary mb-2.5 tracking-wide">Members</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(num => (
                  <button
                    key={num}
                    type="button"
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      memberCount === num
                        ? 'bg-accent-primary text-white shadow-glow-sm'
                        : 'bg-white/[0.04] border border-white/[0.06] text-secondary hover:bg-white/[0.06] hover:border-white/[0.1]'
                    }`}
                    onClick={() => setMemberCount(num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Members */}
          <div className="space-y-4">
            {Array.from({ length: memberCount }).map((_, i) => (
              <div key={i} className="card p-5 space-y-3">
                <h2 className="text-sm font-bold text-accent-glow uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-accent-primary/15 text-accent-glow text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                  Member {i + 1} {i === 0 && '· Captain'}
                </h2>
                <Input label="Full Name" name={`member_${i}_name`} placeholder="Full name" required />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Roll Number" name={`member_${i}_roll`} placeholder="Roll No." required />
                  <Input label="Branch" name={`member_${i}_branch`} placeholder="e.g. CSE" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Year" name={`member_${i}_year`} type="number" min={1} max={4} placeholder="1–4" required />
                  <Input label="Section" name={`member_${i}_section`} placeholder="e.g. A" required />
                </div>
              </div>
            ))}
          </div>

          <Button type="submit" className="w-full" isLoading={loading} size="lg">
            Create Team
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted">
          Already registered?{' '}
          <Link href="/login" className="text-accent-glow hover:text-accent-primary transition-colors font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

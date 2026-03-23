'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import Link from 'next/link'

export interface RoleRegisterFormProps {
  roleName: string
  roleColorType: 'zone' | 'bm' | 'vc'
  endpoint: string
  icon: string
}

const accentMap = {
  zone: { label: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/10' },
  bm: { label: 'text-rose-400', border: 'border-rose-500/20', bg: 'bg-rose-500/10' },
  vc: { label: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10' },
}

export default function RoleRegisterForm({ roleName, roleColorType, endpoint, icon }: RoleRegisterFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const accent = accentMap[roleColorType]

  const asyncWrapper = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const roleType = endpoint.split('/').pop()?.replace('-', '_')
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleType, ...data })
      })
      const result = await res.json()

      if (!res.ok) throw new Error(result.error || 'Registration failed')
      router.push(`/dashboard/${endpoint.split('/').pop()}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-accent-primary/[0.06] blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        <Link href="/register" className="inline-flex items-center gap-2 text-sm text-muted hover:text-secondary transition-colors mb-8 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          All roles
        </Link>

        <div className="space-y-2 mb-8">
          <div className={`chip w-fit ${accent.border} ${accent.label}`}>
            {icon} {roleName}
          </div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Register as {roleName}</h1>
          <p className="text-secondary text-sm">Fill in your details and secret code to continue</p>
        </div>

        {error && (
          <div className="mb-6 bg-accent-danger/[0.08] border border-accent-danger/20 text-accent-danger px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={asyncWrapper} className="space-y-4">
          <Input label="Full Name" name="name" placeholder="Your full name" required />
          <Input label="Email" name="email" type="email" placeholder="you@example.com" required />
          <Input label="Password" name="password" type="password" placeholder="Min 6 characters" required minLength={6} />

          <div className="grid grid-cols-2 gap-3">
            <Input label="Roll Number" name="rollNumber" placeholder="e.g. 2100910130" required />
            <Input label="Year" name="year" type="number" min={1} max={4} placeholder="1–4" required />
          </div>

          <Input label="Branch" name="branch" placeholder="e.g. CSE" required />

          <div className="pt-1">
            <Input label="Secret Code" name="code" type="password" placeholder="Enter access code" required className="font-mono tracking-widest" />
          </div>

          <div className="pt-3">
            <Button type="submit" className="w-full" isLoading={loading} size="lg">
              Create Account
            </Button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-muted">
          Already registered?{' '}
          <Link href="/login" className="text-accent-glow hover:text-accent-primary transition-colors font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

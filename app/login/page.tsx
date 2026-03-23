'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const result = await res.json()

      if (!res.ok) throw new Error(result.error || 'Login failed')

      if (result.role === 'admin') {
        router.push('/dashboard/admin')
        return
      }

      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Session verification failed')

      const roleReq = await fetch('/api/auth/role')
      if (roleReq.ok) {
        const { role } = await roleReq.json()
        if (role === 'team') router.push('/passport')
        else if (role === 'zone_leader') router.push('/dashboard/zone-leader')
        else if (role === 'black_market') router.push('/dashboard/black-market')
        else if (role === 'vc') router.push('/dashboard/vc')
        else if (role === 'admin') router.push('/dashboard/admin')
        else router.push('/')
      } else {
        router.push('/')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      {/* Background blurs */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-accent-primary/[0.06] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] bg-accent-gold/[0.04] blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-sm animate-fade-in-up">
        {/* Back to home */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-secondary transition-colors mb-8 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Back to leaderboard
        </Link>

        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-display font-bold tracking-tight">Welcome back</h1>
          <p className="text-secondary text-sm">Sign in to access your dashboard</p>
        </div>

        {error && (
          <div className="mb-6 bg-accent-danger/[0.08] border border-accent-danger/20 text-accent-danger px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <Input label="Email" name="email" type="email" placeholder="you@example.com" required />
          <Input label="Password" name="password" type="password" placeholder="••••••••" required />

          <Button type="submit" className="w-full" isLoading={loading} size="lg">
            Sign In
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-accent-glow hover:text-accent-primary transition-colors font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}

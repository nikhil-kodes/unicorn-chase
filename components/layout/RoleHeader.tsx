import { LogOut, Menu } from 'lucide-react'
import Image from 'next/image'

export default function RoleHeader({ 
  roleName, 
  roleType, 
  onMenuClick 
}: { 
  roleName: string, 
  roleType: 'zone' | 'bm' | 'vc' | 'admin',
  onMenuClick?: () => void
}) {
  const config = {
    zone: { color: 'text-blue-400', dot: 'bg-blue-400', chipBg: 'bg-blue-500/10', chipBorder: 'border-blue-500/20' },
    bm: { color: 'text-rose-400', dot: 'bg-rose-400', chipBg: 'bg-rose-500/10', chipBorder: 'border-rose-500/20' },
    vc: { color: 'text-emerald-400', dot: 'bg-emerald-400', chipBg: 'bg-emerald-500/10', chipBorder: 'border-emerald-500/20' },
    admin: { color: 'text-orange-400', dot: 'bg-orange-400', chipBg: 'bg-orange-500/10', chipBorder: 'border-orange-500/20' },
  }

  const c = config[roleType]

  return (
    <header className="border-b border-white/[0.04] bg-base/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="px-6 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onMenuClick && (
            <button 
              onClick={onMenuClick}
              className="p-2.5 -ml-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-muted hover:text-primary transition-all hover:bg-white/[0.06]"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="hidden sm:flex items-center gap-4">
            <Image src="/logo.jpg" alt="Logo" width={32} height={32} className="rounded-lg shadow-sm" />
            <div className="w-px h-6 bg-white/[0.06]" />
          </div>
          <h1 className={`font-display font-bold text-base md:text-lg tracking-tight ${c.color}`}>
            {roleName}
          </h1>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <div className={`chip hidden sm:flex ${c.chipBg} ${c.chipBorder} ${c.color} items-center gap-2`}>
            <span className="relative flex h-1.5 w-1.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${c.dot} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${c.dot}`} />
            </span>
            ONLINE
          </div>

          <div className="w-px h-6 bg-white/[0.06]" />

          <form action="/auth/signout" method="post">
            <button type="submit" className="text-sm font-medium text-muted hover:text-secondary transition-colors flex items-center gap-2.5">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}

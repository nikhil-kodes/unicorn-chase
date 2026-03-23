'use client'

import { motion } from 'framer-motion'
import { X, Megaphone } from 'lucide-react'

interface GlobalBroadcastProps {
  message: string
  onDismiss: () => void
}

export default function GlobalBroadcast({ message, onDismiss }: GlobalBroadcastProps) {
  return (
    <div className="fixed inset-0 z-[999] p-4 sm:p-6 flex items-start justify-center pointer-events-none">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
        onClick={onDismiss}
      />

      {/* Broadcast Content */}
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative w-full max-w-lg pointer-events-auto mt-4 sm:mt-8"
      >
        <div className="rounded-3xl overflow-hidden border border-accent-primary/30 bg-[#111] shadow-[0_0_80px_rgba(var(--accent-primary-rgb),0.2)]">
          {/* Top colored aesthetic bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-accent-primary via-accent-glow to-accent-primary" />
          
          <div className="p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] bg-accent-primary/20 blur-[60px] pointer-events-none" />

            <div className="w-16 h-16 rounded-full bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center mb-6 relative">
              <Megaphone className="w-8 h-8 text-accent-primary relative z-10" />
              <div className="absolute inset-0 rounded-full bg-accent-primary/20 animate-ping opacity-50" />
            </div>

            <h2 className="text-xl sm:text-2xl font-display font-bold text-white mb-4 tracking-tight">
              FLASH ANNOUNCEMENT
            </h2>

            <p className="text-secondary text-base sm:text-lg leading-relaxed mb-8">
              {message}
            </p>

            <button 
              onClick={onDismiss}
              className="w-full py-3.5 bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 rounded-xl text-white font-medium transition-all"
            >
              Acknowledge
            </button>
            
            <button 
              onClick={onDismiss}
              className="absolute top-4 right-4 text-muted hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

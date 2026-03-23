'use client'

import { STAGE_ORDER } from '@/lib/utils/stages'
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'

export default function StageProgress({ progress }: { progress: any[] }) {
  let activeFound = false

  return (
    <div className="flex items-center gap-0.5">
      {STAGE_ORDER.map((stageName, index) => {
        const p = progress?.find((x: any) => x.stage === stageName)
        const isCompleted = p?.completed
        const isNext = !isCompleted && !activeFound
        if (isNext) activeFound = true

        return (
          <div key={stageName} className="flex items-center">
            <div className="relative group">
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-elevated text-[10px] font-mono font-bold uppercase text-secondary px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/[0.06]">
                {stageName}
              </div>

              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold uppercase transition-all duration-300 ${
                  isCompleted
                    ? 'bg-accent-primary/20 text-accent-glow border border-accent-primary/30'
                    : isNext
                    ? 'border-2 border-accent-primary/60 text-accent-glow shadow-glow-sm'
                    : 'bg-white/[0.03] border border-white/[0.06] text-muted'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                ) : (
                  <span className="text-[9px]">{stageName[0]}</span>
                )}

                {isNext && (
                  <motion.div
                    className="absolute inset-0 rounded-lg border border-accent-primary/40"
                    animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
                  />
                )}
              </div>
            </div>

            {index < STAGE_ORDER.length - 1 && (
              <div className={`w-3 h-[1.5px] transition-colors duration-300 ${isCompleted ? 'bg-accent-primary/40' : 'bg-white/[0.06]'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

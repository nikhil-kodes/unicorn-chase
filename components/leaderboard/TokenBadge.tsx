'use client'

import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function TokenBadge({ tokens }: { tokens: number }) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
    const timeout = setTimeout(() => setAnimate(false), 400)
    return () => clearTimeout(timeout)
  }, [tokens])

  return (
    <motion.div
      animate={animate ? { scale: [1, 1.15, 1] } : {}}
      transition={{ duration: 0.35 }}
      className="inline-flex items-center gap-1.5 font-mono text-lg font-bold text-gradient-gold"
    >
      <Zap className="w-4 h-4 text-accent-gold fill-accent-gold" />
      <span className="text-accent-gold">{tokens || 0}</span>
    </motion.div>
  )
}

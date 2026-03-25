'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { ReactNode } from 'react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export default function Sidebar({ isOpen, onClose, children }: SidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-base/60 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar Content */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-[20rem] bg-elevated border-r border-white/[0.08] shadow-2xl z-[101] flex flex-col"
          >
            <div className="p-4 border-b border-white/[0.04] flex items-center justify-between bg-base/80 backdrop-blur-xl">
              <h3 className="font-display font-bold text-sm tracking-widest uppercase text-muted">Team Selection</h3>
              <button 
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/[0.05] text-muted hover:text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden" onClick={onClose}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

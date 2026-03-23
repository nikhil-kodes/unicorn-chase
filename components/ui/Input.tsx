'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-[13px] font-medium text-secondary mb-2 tracking-wide">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-primary placeholder:text-muted transition-all duration-200 focus:outline-none focus:border-accent-primary/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-accent-primary/20 hover:border-white/[0.12] ${error ? 'border-accent-danger/50 focus:border-accent-danger/50' : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-accent-danger">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

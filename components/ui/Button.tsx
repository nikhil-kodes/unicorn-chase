'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const base = 'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]'

    const variants: Record<string, string> = {
      primary: 'bg-accent-primary hover:bg-[#6d28d9] text-white shadow-glow-sm hover:shadow-glow-md',
      secondary: 'bg-white/[0.06] hover:bg-white/[0.1] text-primary border border-white/[0.08] hover:border-white/[0.15]',
      ghost: 'bg-transparent hover:bg-white/[0.05] text-secondary hover:text-primary',
      destructive: 'bg-accent-danger/10 hover:bg-accent-danger/20 text-accent-danger border border-accent-danger/20 hover:border-accent-danger/40',
      outline: 'bg-transparent border border-white/[0.1] hover:border-white/[0.2] text-primary hover:bg-white/[0.03]',
    }

    const sizes: Record<string, string> = {
      sm: 'text-xs px-3.5 py-2 gap-1.5',
      md: 'text-sm px-5 py-2.5 gap-2',
      lg: 'text-base px-7 py-3.5 gap-2.5',
    }

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

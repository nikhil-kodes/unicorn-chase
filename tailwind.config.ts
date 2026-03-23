import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        base: 'var(--bg-base)',
        surface: 'var(--bg-surface)',
        elevated: 'var(--bg-elevated)',
        'card-bg': 'var(--bg-card)',
        border: 'var(--border)',
        'border-hover': 'var(--border-hover)',
        'border-active': 'var(--border-active)',
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        accent: {
          primary: 'var(--accent-primary)',
          glow: 'var(--accent-glow)',
          gold: 'var(--accent-gold)',
          finish: 'var(--accent-finish)',
          danger: 'var(--accent-danger)',
        },
        role: {
          zone: { DEFAULT: 'var(--role-zone)', bg: '#0c1929', text: '#93c5fd' },
          bm: { DEFAULT: 'var(--role-bm)', bg: '#1a0a0e', text: '#fda4af' },
          vc: { DEFAULT: 'var(--role-vc)', bg: '#052e1c', text: '#6ee7b7' },
          admin: { DEFAULT: 'var(--role-admin)', bg: '#1c1004', text: '#fdba74' },
          team: { DEFAULT: '#10b981', bg: '#052e1c', text: '#6ee7b7' },
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      boxShadow: {
        'glow-sm': '0 0 20px rgba(124,58,237,0.15)',
        'glow-md': '0 0 40px rgba(124,58,237,0.2)',
        'glow-lg': '0 0 80px rgba(124,58,237,0.25)',
        'glow-gold': '0 0 30px rgba(251,191,36,0.2)',
        'soft': '0 2px 20px rgba(0,0,0,0.3)',
        'card': '0 4px 30px rgba(0,0,0,0.4)',
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'scale-in': 'scale-in 0.3s ease-out forwards',
        'shimmer': 'shimmer 2s infinite linear',
        'float': 'float 3s ease-in-out infinite',
        'gradient': 'gradient-shift 4s ease infinite',
      },
    },
  },
  plugins: [],
}
export default config

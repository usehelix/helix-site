import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#ffffff', muted: '#fafafa', card: '#f4f4f5' },
        fg: {
          DEFAULT: '#0a0a0a',
          2: '#3f3f46',
          3: '#71717a',
          4: '#a1a1aa',
          5: '#d4d4d8',
        },
        border: { DEFAULT: '#e5e5e5', 2: '#e4e4e7', 3: '#d4d4d8' },
        indigo: { DEFAULT: '#4f46e5', 2: '#6366f1', soft: '#eef2ff' },
        code: { bg: '#0f0f10', bg2: '#171719', border: '#27272a' },
        signal: { green: '#10b981', red: '#ef4444', amber: '#f59e0b' },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        h1: '-0.035em',
        h2: '-0.025em',
        body: '-0.005em',
        tightest: '-0.04em',
      },
      maxWidth: {
        container: '1180px',
        narrow: '900px',
      },
      keyframes: {
        helixPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
        helixNetpulse: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        helixBlink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        helixTypeReveal: {
          from: { clipPath: 'inset(0 100% 0 0)' },
          to: { clipPath: 'inset(0 0 0 0)' },
        },
      },
      animation: {
        'helix-pulse': 'helixPulse 2.5s infinite',
        'helix-netpulse': 'helixNetpulse 1.6s ease-in-out infinite',
        'helix-blink': 'helixBlink 1s steps(2) infinite',
      },
    },
  },
  plugins: [],
}

export default config

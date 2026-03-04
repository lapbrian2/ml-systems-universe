import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.ts',
    './plugins/**/*.ts',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          bg: '#05070f',
          surface: '#0a0e1a',
          card: '#0f1325',
          border: 'rgba(255,255,255,0.06)',
        },
        primary: '#14b8a6',
        accent: {
          purple: '#a855f7',
          green: '#22c55e',
          amber: '#f0a500',
          red: '#ff6b6b',
          pink: '#ec4899',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        hero: 'clamp(2.5rem, 6vw, 5rem)',
        section: 'clamp(1.75rem, 4vw, 3rem)',
        heading: 'clamp(1.25rem, 2.5vw, 1.75rem)',
      },
    },
  },
} satisfies Config

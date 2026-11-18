/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ews: {
          dark: '#080d1a',
          surface: '#0f172a',
          card: 'rgba(15, 23, 42, 0.65)',
          border: 'rgba(255, 255, 255, 0.12)',
          accent: '#10b981',
          gold: '#f59e0b',
          crimson: '#ef4444',
          cyan: '#06b6d4',
          navy: '#1e293b'
        }
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
        glassHeavy: '24px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-glow': '0 0 20px rgba(16, 185, 129, 0.25)',
        'glass-glow-red': '0 0 20px rgba(239, 68, 68, 0.3)',
        'glass-inner': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar': 'radar 4s linear infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}

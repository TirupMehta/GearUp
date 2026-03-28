/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',    // deep zinc black
        panel: '#18181b',         // elevated zinc
        primary: '#6366f1',       // bright electric indigo
        primaryHover: '#4f46e5',  // active indigo
        accent: '#10b981',        // neon emerald
        danger: '#f43f5e',        // vivid rose
        warning: '#f59e0b',       // amber glow
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        popOut: {
          '0%': { transform: 'scale(0.5) translateY(20px)', opacity: '0' },
          '20%': { transform: 'scale(1.2) translateY(-40px)', opacity: '1' },
          '80%': { transform: 'scale(1) translateY(-100px)', opacity: '1' },
          '100%': { transform: 'scale(0.8) translateY(-120px)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
          '50%': { opacity: 0.8, filter: 'brightness(1.5)' },
        }
      },
      animation: {
        popOut: 'popOut 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        fadeIn: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
      }
    },
  },
  plugins: [],
}

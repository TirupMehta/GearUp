/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',    // dark slate
        panel: '#1e293b',         // lighter slate
        primary: '#3b82f6',       // electric blue
        primaryHover: '#2563eb',  // deeper blue
        accent: '#22c55e',        // neon green
        danger: '#ef4444',        // red
        warning: '#f59e0b',       // amber
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
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      },
      animation: {
        popOut: 'popOut 1.5s ease-out forwards',
        fadeIn: 'fadeIn 0.5s ease-out forwards',
      }
    },
  },
  plugins: [],
}

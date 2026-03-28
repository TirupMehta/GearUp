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
      }
    },
  },
  plugins: [],
}

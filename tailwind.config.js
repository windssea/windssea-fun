/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#0d1117',
          green: '#00ff41',
          dim: '#0a2a0a',
          gray: '#2a2a2a',
          dark: '#111',
          text: '#ccc',
          inactive: '#333'
        }
      },
      fontFamily: {
        mono: ['"Courier New"', 'Courier', 'monospace'],
      },
      borderRadius: {
        icon: '14px',
        card: '12px'
      }
    },
  },
  plugins: [],
}

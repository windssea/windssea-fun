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
          bg: '#040609',
          green: '#00ff66',
          dim: '#0b2e14',
          gray: '#4d6b56',
          dark: '#0a0e0c',
          text: '#f0fdf4',
          inactive: '#8eb898'
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

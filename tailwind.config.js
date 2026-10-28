/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { paper: '#f5f4ef', ink: '#20211f', muted: '#74746d', acid: '#d8f36a', line: '#deddd6' },
      fontFamily: { sans: ['DM Sans', 'sans-serif'], serif: ['Playfair Display', 'serif'], mono: ['DM Mono', 'monospace'] },
    },
  },
  plugins: [],
}

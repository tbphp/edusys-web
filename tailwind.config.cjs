/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      colors: {
        blue: '#2A8DFF'
      }
    }
  }
}

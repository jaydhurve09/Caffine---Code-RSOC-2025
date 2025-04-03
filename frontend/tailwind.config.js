/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        github: {
          dark: '#24292e',
          light: '#f6f8fa'
        }
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}
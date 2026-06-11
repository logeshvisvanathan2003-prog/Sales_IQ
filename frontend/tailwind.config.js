/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '400px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      colors: {
        amber: { DEFAULT: '#D4851A', light: '#F5C87A', bg: '#FDF6E9', border: '#F0D5A0' },
        coral: { DEFAULT: '#C9502A', light: '#F0A080', bg: '#FDF0EB', border: '#F0C0B0' },
        teal:  { DEFAULT: '#1A9E8F', light: '#7FD4CA', bg: '#EAF7F5', border: '#A8E4DE' },
        purple:{ DEFAULT: '#6B5EBF', light: '#B0A4E8', bg: '#F0EEF9', border: '#C8C0F0' },
      },
    }
  },
  plugins: [],
}

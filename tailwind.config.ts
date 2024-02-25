/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['Gill Sans', 'PingFang SC', 'sans-serif'],
      serif: ['Baskerville', 'Songti SC', 'serif'],
      condensedSans: ['DIN Condensed', 'PingFang SC', 'sans-serif'],
      activitySans: ['Helvetica Neue', 'PingFang SC', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [],
};

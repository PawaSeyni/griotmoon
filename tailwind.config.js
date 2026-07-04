/** @type {import('tailwindcss').Config} */
// Griot Moon "Midnight Indigo" theme.
//
// The components use raw Tailwind palette classes (purple-600, pink-500, ...),
// so instead of renaming hundreds of classes we re-point the four brand scales
// at the Griot Moon palette: purple = night indigo-violet, pink = terracotta
// (from the cowrie emblem), yellow = moon gold, orange = fire amber.
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          50: '#f2f1fa',
          100: '#e4e1f4',
          200: '#c9c4e2',
          300: '#a89ecf',
          400: '#7d6cb0',
          500: '#55488f',
          600: '#3d3474',
          700: '#2a2456',
          800: '#1b1b48',
          900: '#10102e',
        },
        pink: {
          50: '#faf0ea',
          100: '#f5e0d3',
          200: '#e8c0a8',
          300: '#d99a78',
          400: '#c9744b',
          500: '#b3572e',
          600: '#9a4a26',
          700: '#7c3b1f',
          800: '#5e2c17',
          900: '#401e10',
        },
        yellow: {
          50: '#fdf8ec',
          100: '#f9eecd',
          200: '#f2dd9e',
          300: '#ecc36a',
          400: '#e9b95c',
          500: '#d9a441',
          600: '#b98831',
          700: '#936b26',
          800: '#6d4f1c',
          900: '#473311',
        },
        orange: {
          50: '#fdf4ea',
          100: '#fae4cb',
          200: '#f5c795',
          300: '#f7b566',
          400: '#f5a23c',
          500: '#e88a25',
          600: '#c9701c',
          700: '#a55a17',
          800: '#7c4311',
          900: '#532c0b',
        },
        primary: {
          50: '#f2f1fa',
          100: '#e4e1f4',
          500: '#55488f',
          600: '#3d3474',
          700: '#2a2456',
        },
        accent: {
          orange: '#e88a25',
          pink: '#b3572e',
          yellow: '#d9a441',
        }
      },
      fontFamily: {
        sans: ['Lexend Variable', 'Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}

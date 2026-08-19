/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A8A', // Blue 900
          dark: '#172554',
          light: '#DBEAFE', // Blue 100
        },
        secondary: {
          DEFAULT: '#FACC15', // Yellow 400
          dark: '#EAB308',
        },
        background: '#F9FAFB',
        text: {
          DEFAULT: '#1F2937',
          secondary: '#4B5563',
        },
        border: {
          DEFAULT: '#E5E7EB',
          dark: '#D1D5DB'
        },
        success: '#10B981',
        error: '#EF4444'
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
        serif: ['Georgia', '"Times New Roman"', 'serif']
      }
    },
  },
  plugins: [],
}

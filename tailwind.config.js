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
          DEFAULT: '#003366', // Navy Blue
          dark: '#002244',
          light: '#E6F0FA',
        },
        secondary: {
          DEFAULT: '#F97316', // Orange / Saffron accent
          dark: '#EA580C',
        },
        background: '#F9FAFB',
        text: {
          DEFAULT: '#111827',
          secondary: '#4B5563',
        },
        border: {
          DEFAULT: '#E5E7EB',
          dark: '#D1D5DB'
        },
        success: '#15803D', // Green for success / e-verify
        error: '#EF4444',
        accent: '#22C55E', // Green accent
      },
      fontFamily: {
        sans: ['"Inter"', 'Arial', 'Helvetica', 'sans-serif'],
        serif: ['Georgia', '"Times New Roman"', 'serif']
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  // darkMode: 'selector',
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'sc-red': '#6b0221',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeOutDown: {
          '0%': { opacity: 1, transform: 'translateY(0)' },
          '100%': { opacity: 0, transform: 'translateY(10px)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.15s ease-out',
        fadeOutDown: 'fadeOutDown 0.15s ease-out',
      },
    },
  },
  plugins: [],
}


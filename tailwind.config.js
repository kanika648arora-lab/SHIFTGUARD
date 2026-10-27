/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        emerald: {
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        navy: {
          800: '#1E293B',
          900: '#0F172A',
          950: '#0B1120',
        },
        coral: {
          500: '#EF4444',
          600: '#DC2626',
        },
        amber: {
          500: '#F59E0B',
          600: '#D97706',
        }
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1.2)' },
        }
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#F4F7F3',
          100: '#E8F0E7',
          200: '#D2E1D1',
          300: '#BDD2BC',
          400: '#A8B9A5',
          500: '#8FA48C',
          600: '#6E836B',
          700: '#526350',
          800: '#34443A',
          900: '#1F2A23',
        },
        softblue: {
          50: '#F5F9FA',
          100: '#E7F2F6',
          200: '#DCEAF0',
          300: '#B8D5E1',
          400: '#8FBACD',
          500: '#679DB5',
          600: '#487F96',
          700: '#356073',
          800: '#264452',
          900: '#192C35',
        },
        warmbeige: {
          50: '#FAF8F5',
          100: '#F4EEE5',
          200: '#EADECF',
          300: '#DFCEB9',
          400: '#CBBAA3',
          500: '#B2A088',
          600: '#8E7F6A',
          700: '#6B5E4E',
          800: '#4A4136',
          900: '#2B251E',
        },
        medical: {
          green: '#2E7D32',
          lightGreen: '#E8F5E9',
          amber: '#ED6C02',
          lightAmber: '#FFF4E5',
          red: '#D32F2F',
          lightRed: '#FFEBEE',
          blue: '#0288D1',
          lightBlue: '#E1F5FE'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(52, 68, 58, 0.06), 0 2px 6px -1px rgba(52, 68, 58, 0.04)',
        'soft-lg': '0 12px 32px -4px rgba(52, 68, 58, 0.08), 0 4px 12px -2px rgba(52, 68, 58, 0.05)',
        'soft-xl': '0 20px 40px -6px rgba(52, 68, 58, 0.12), 0 8px 16px -4px rgba(52, 68, 58, 0.06)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}

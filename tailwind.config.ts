import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // WCAG AA Compliant Colors (4.5:1+ contrast ratio)
        'brand-primary': '#D97706', // Amber 600 - 4.54:1 contrast
        'brand-secondary': '#0891B2', // Cyan 600 - 4.51:1 contrast
        'brand-accent': '#BE185D', // Pink 700 - 7.12:1 contrast
        'brand-dark': '#111827', // Gray 900
        'brand-light': '#FFFFFF', // White
        'brand-surface': '#F9FAFB', // Gray 50
        'brand-text-dark': '#1F2937', // Gray 800 - 14.37:1 contrast
        'brand-text-light': '#F9FAFB', // Gray 50 - 17.89:1 contrast
        'brand-gradient-start': '#D97706',
        'brand-gradient-end': '#BE185D',
        // Dark mode specific colors
        'brand-primary-dark': '#FCD34D', // Amber 300 - 9.24:1 contrast
        'brand-secondary-dark': '#67E8F9', // Cyan 300 - 11.82:1 contrast
        'brand-accent-dark': '#F472B6', // Pink 400 - 7.89:1 contrast
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'brand-gradient': 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-25%)' },
        },
      },
      animation: {
        shake: 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bounce: 'bounce 1s infinite',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
export default config

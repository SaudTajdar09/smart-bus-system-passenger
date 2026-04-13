/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    colors: {
      'cb-brand': '#2563eb',
      'cb-brand-hover': '#1d4ed8',
      'cb-text': '#1f2937',
      'cb-text-secondary': '#6b7280',
      'cb-text-tertiary': '#9ca3af',
      white: '#ffffff',
      black: '#000000',
      slate: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
      },
      blue: {
        50: '#eff6ff',
        100: '#dbeafe',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
      },
      emerald: {
        50: '#f0fdf4',
        100: '#dcfce7',
        300: '#86efac',
        600: '#16a34a',
        700: '#15803d',
      },
      orange: {
        50: '#fff7ed',
        100: '#ffedd5',
        300: '#fed7aa',
        600: '#ea580c',
        700: '#c2410c',
      },
      red: {
        100: '#fee2e2',
        300: '#fca5a5',
        600: '#dc2626',
        700: '#b91c1c',
      },
      transparent: 'transparent',
    },
    extend: {
      supports: {
        'backdrop-filter': 'backdrop-filter',
      },
    },
  },
  plugins: [],
}

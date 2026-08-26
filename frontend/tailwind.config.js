/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17211d',
        paper: '#f4f0e6',
        canvas: '#e9e5da',
        line: '#d2cdbd',
        harvest: '#e36b2c',
        moss: '#43624d',
        signal: '#f1c45b',
        danger: '#b8473c',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'ui-sans-serif', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        panel: '0 14px 35px rgba(23, 33, 29, 0.08)',
        lifted: '0 8px 16px rgba(23, 33, 29, 0.12)',
      },
    },
  },
  plugins: [],
}

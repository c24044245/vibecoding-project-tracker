/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
       brand: {
          DEFAULT: '#3730A3', // indigo-800: header, primary buttons, focus ring
          hover: '#312E81',   // indigo-900
          soft: '#EEF2FF',    // indigo-50: light backgrounds
        },
        surface: {
          page: '#F1F5F9',    // slate-100
          column: '#E2E8F0',  // slate-200
          card: '#FFFFFF',
        },
        ink: {
          DEFAULT: '#0F172A', // slate-900: body text
          muted: '#475569',   // slate-600: captions, dates, counts
        },
        feature: {
          DEFAULT: '#047857', // emerald-700
          soft: '#ECFDF5',
        },
        bug: {
          DEFAULT: '#B91C1C', // red-700
          soft: '#FEF2F2',
        },
      },
      fontFamily: {
        // Atkinson Hyperlegible was designed by the Braille Institute for low-vision readers.
        sans: ['"Atkinson Hyperlegible"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};

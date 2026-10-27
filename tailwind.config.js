/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Colours come from CSS variables in src/index.css, so one set of class names
      // works for both the light and dark themes. Contrast is checked for both (NFR1).
      colors: {
        brand: {
          DEFAULT: 'var(--brand)',     // header, primary buttons
          hover: 'var(--brand-hover)',
          soft: 'var(--brand-soft)',   // light backgrounds, selected states
          ink: 'var(--brand-ink)',     // brand-coloured text and outlines
          ring: 'var(--brand-ring)',   // highlight rings
        },
        surface: {
          page: 'var(--surface-page)',
          column: 'var(--surface-column)',
          card: 'var(--surface-card)',
          muted: 'var(--surface-muted)', // Done cards
          hover: 'var(--surface-hover)',
        },
        ink: {
          DEFAULT: 'var(--ink)',       // body text
          muted: 'var(--ink-muted)',   // captions, dates, counts
        },
        line: {
          DEFAULT: 'var(--line)',      // card borders
          soft: 'var(--line-soft)',    // dividers
          strong: 'var(--line-strong)', // form field borders (3:1, WCAG 1.4.11)
        },
        feature: {
          DEFAULT: 'var(--feature)',
          soft: 'var(--feature-soft)',
        },
        bug: {
          DEFAULT: 'var(--bug)',
          soft: 'var(--bug-soft)',
        },
        danger: {
          DEFAULT: 'var(--danger)',    // delete / remove buttons
          hover: 'var(--danger-hover)',
        },
        toast: {
          DEFAULT: 'var(--toast)',
          ink: 'var(--toast-ink)',
        },
        // Due-date states (FR16): text colour, soft card tint and border for each.
        due: {
          calm: 'var(--due-calm)',
          warning: 'var(--due-warning)',
          'warning-soft': 'var(--due-warning-soft)',
          'warning-line': 'var(--due-warning-line)',
          overdue: 'var(--due-overdue)',
          'overdue-soft': 'var(--due-overdue-soft)',
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

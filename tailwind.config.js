/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f46e5',
          hover: '#4338ca',
          active: '#3730a3',
          soft: '#eef2ff',
          border: '#c7d2fe',
        },
        secondary: {
          DEFAULT: '#0891b2',
          hover: '#0e7490',
          soft: '#ecfeff',
          border: '#a5f3fc',
        },
        success: {
          DEFAULT: '#059669',
          hover: '#047857',
          soft: '#ecfdf5',
          border: '#a7f3d0',
        },
        error: {
          DEFAULT: '#e11d48',
          hover: '#be123c',
          soft: '#fff1f2',
          border: '#fecdd3',
        },
        warning: {
          DEFAULT: '#d97706',
          hover: '#b45309',
          soft: '#fffbeb',
          border: '#fde68a',
        },
        background: '#f8fafc',
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f1f5f9',
        },
        border: {
          DEFAULT: '#e2e8f0',
          subtle: '#f1f5f9',
          strong: '#cbd5e1',
        },
        text: {
          primary: '#0f172a',
          secondary: '#64748b',
          tertiary: '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      transitionDuration: {
        app: '200ms',
        entrance: '300ms',
      },
      transitionTimingFunction: {
        app: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
      boxShadow: {
        sm: '0 10px 28px rgb(15 23 42 / 0.06)',
        md: '0 10px 28px rgb(15 23 42 / 0.06)',
        xl: '0 10px 28px rgb(15 23 42 / 0.06)',
      },
    },
  },
}

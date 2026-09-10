/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // Institutional navy — primary brand anchor (headers, nav, control surfaces)
        navy: {
          DEFAULT: '#002147',
          50: '#eef3fa',
          100: '#c9d7eb',
          200: '#a4c2e6',
          300: '#4e749e',
          400: '#1f4068',
          500: '#142d4c',
          600: '#0d3460',
          700: '#0b2b57',
          800: '#081728',
          900: '#040e1a',
        },
        // Tricolour + statutory accent
        saffron: '#FF9933',
        indiagreen: '#138808',
        // Secondary analytical tier / teal (DESIGN.md "Deep Sea Teal")
        teal: {
          DEFAULT: '#085E68',
          dark: '#0A6C77',
        },
        // Tertiary — verified system metadata (DESIGN.md "Deep Verdigris")
        verdigris: '#0F766E',
        // Statutory & compliance state tokens (DESIGN.md)
        compliant: { DEFAULT: '#047857', bg: '#ECFDF5', border: '#A7F3D0' },
        cautionary: { DEFAULT: '#B45309', bg: '#FFFBEB', border: '#FDE68A' },
        noncompliant: { DEFAULT: '#B91C1C', bg: '#FEF2F2', border: '#FECACA' },
        connector: { DEFAULT: '#4338CA', bg: '#EEF2FF' },
      },
      borderRadius: {
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'fade-in-up': { '0%': { opacity: '0', transform: 'translateY(14px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'scale-in': { '0%': { opacity: '0', transform: 'scale(.96)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        'pulse-subtle': { '0%, 100%': { opacity: '.72' }, '50%': { opacity: '1' } },
      },
      animation: {
        marquee: 'marquee 34s linear infinite',
        'fade-in-up': 'fade-in-up .5s ease-out both',
        'scale-in': 'scale-in .4s ease-out both',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

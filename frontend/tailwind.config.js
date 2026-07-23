/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#07070a',
          900: '#0b0b12',
          850: '#101018',
          800: '#15151f',
          700: '#1c1c28',
          600: '#262635',
          500: '#3b3b52',
        },
        acid: {
          DEFAULT: '#c6ff3d',
          soft: '#e6ff8a',
          deep: '#8fbf1a',
        },
        iris: {
          DEFAULT: '#a78bfa',
          deep: '#7c3aed',
        },
        coral: '#ff6a5b',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'ui-serif', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(198,255,61,0.15), 0 0 40px -8px rgba(198,255,61,0.35)',
        irisGlow: '0 0 0 1px rgba(167,139,250,0.2), 0 0 40px -8px rgba(167,139,250,0.4)',
      },
      keyframes: {
        pulseDot: {
          '0%,100%': { opacity: 0.4, transform: 'scale(0.9)' },
          '50%': { opacity: 1, transform: 'scale(1.15)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        pulseDot: 'pulseDot 1.6s ease-in-out infinite',
        scan: 'scan 2.4s linear infinite',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
}

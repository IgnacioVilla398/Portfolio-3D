/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta base: negro editorial + hueso + un único acento frío.
        ink: {
          950: '#08090B',
          900: '#0B0C0F',
          850: '#101216',
          800: '#15171C',
          700: '#1D2026',
          600: '#2A2E36',
        },
        bone: {
          50: '#F7F7F5',
          100: '#EFEFEC',
          200: '#DEDEDA',
          300: '#C2C2BC',
          400: '#A6A6A0',
          500: '#8B8B86',
        },
        accent: {
          DEFAULT: '#4F8CFF',
          soft: '#8FB4FF',
          deep: '#1E4FD8',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['"Inter Tight"', '"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        // Escala tipográfica editorial (con clamp para responsividad real).
        'display-xl': ['clamp(2.75rem, 11vw, 11rem)', { lineHeight: '0.92', letterSpacing: '-0.04em' }],
        'display-lg': ['clamp(2.25rem, 7.5vw, 6.5rem)', { lineHeight: '0.95', letterSpacing: '-0.035em' }],
        'display-md': ['clamp(1.875rem, 5vw, 4rem)', { lineHeight: '1', letterSpacing: '-0.03em' }],
        'display-sm': ['clamp(1.5rem, 3.2vw, 2.5rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'eyebrow': ['0.6875rem', { lineHeight: '1', letterSpacing: '0.28em' }],
      },
      maxWidth: {
        shell: '90rem',
      },
      spacing: {
        gutter: 'clamp(1.25rem, 3vw, 6rem)',
      },
      backgroundImage: {
        'grid-line':
          'linear-gradient(to right, rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.055) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '88px 88px',
      },
      boxShadow: {
        lift: '0 30px 80px -40px rgba(0,0,0,0.9)',
        frame: '0 40px 120px -50px rgba(0,0,0,1)',
        glow: '0 0 0 1px rgba(79,140,255,0.35), 0 20px 60px -30px rgba(79,140,255,0.45)',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translate3d(0,0,0)' },
          to: { transform: 'translate3d(-50%,0,0)' },
        },
        'caret-blink': {
          '0%, 45%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        // Efecto flotante (idle loop) para la pieza 3D del hero.
        float: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -16px, 0)' },
        },
      },
      animation: {
        marquee: 'marquee 42s linear infinite',
        caret: 'caret-blink 1.15s steps(1, end) infinite',
        float: 'float 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

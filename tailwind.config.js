/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core background
        base: {
          900: '#0a0a0a',
          800: '#0d0d0d',
          700: '#111111',
          600: '#141414',
          500: '#1a1a1a',
          400: '#222222',
          300: '#2a2a2a',
        },
        // Primary - Cinematic Orange
        brand: {
          DEFAULT: '#ff6b00',
          50:  '#fff2e6',
          100: '#ffe0bf',
          200: '#ffcc99',
          300: '#ffad5c',
          400: '#ff8c2e',
          500: '#ff6b00',
          600: '#cc5500',
          700: '#993f00',
          800: '#662a00',
          900: '#331500',
        },
        // Text
        surface: {
          primary:   '#f0ece4',
          secondary: '#a09890',
          muted:     '#6a6460',
          dim:       '#3a3632',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-lg': ['6rem', { lineHeight: '1', letterSpacing: '-0.04em', fontWeight: '800' }],
        'h1': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '600' }],
        'h3': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body': ['1rem', { lineHeight: '1.65' }],
        'small': ['0.875rem', { lineHeight: '1.6' }],
        'xs': ['0.75rem', { lineHeight: '1.5' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
      },
      borderRadius: {
        'none': '0',
        'sm': '4px',
        DEFAULT: '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        'full': '9999px',
      },
      boxShadow: {
        'glow-sm': '0 0 12px rgba(255,107,0,0.2)',
        'glow':    '0 0 24px rgba(255,107,0,0.3)',
        'glow-lg': '0 0 48px rgba(255,107,0,0.4)',
        'glow-xl': '0 0 80px rgba(255,107,0,0.5)',
        'card':    '0 4px 24px rgba(0,0,0,0.4)',
        'card-lg': '0 8px 48px rgba(0,0,0,0.6)',
        'glass':   '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      backdropBlur: {
        'xs': '4px',
        'sm': '8px',
        DEFAULT: '12px',
        'md': '16px',
        'lg': '24px',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.25,0.1,0.25,1) forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'slide-left': 'slideLeft 0.5s cubic-bezier(0.25,0.1,0.25,1) forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,107,0,0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(255,107,0,0.5)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      backgroundImage: {
        'gradient-radial-brand': 'radial-gradient(ellipse at center, rgba(255,107,0,0.15) 0%, transparent 70%)',
        'gradient-brand': 'linear-gradient(135deg, #ff6b00 0%, #ff8c42 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0a0a0a 0%, #111111 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}

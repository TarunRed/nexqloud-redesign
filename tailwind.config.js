/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#080d2c',
          elevated: '#1d2242',
          card: '#151e41',
          deep: '#090e2d',
        },
        accent: {
          blue: '#5c9cff',
        },
        navy: {
          50: '#ccd5e5',
          100: '#7089c0',
          800: '#3d5181',
          900: '#151e41',
        },
        tier: {
          a: '#22d39b',
          b: '#2dd4bf',
          c: '#5c9cff',
          d: '#9ca3ff',
        },
        text: {
          primary: '#ffffff',
          muted: '#7089c0',
          faint: '#3d5181',
        },
        sand: '#ece8e2',
        success: '#22d39b',
        danger: '#db4d4d',
      },
      fontFamily: {
        display: ['"Urbanist"', 'system-ui', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}

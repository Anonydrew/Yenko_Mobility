import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand lime. Pair it with `onbrand` text.
        brand: {
          50: '#FBFCE8',
          100: '#F5F8C6',
          200: '#EDF294',
          300: '#E4EA5C',
          DEFAULT: '#D9E026',
          400: '#D9E026',
          500: '#BFC61A',
          600: '#969C12',
          700: '#6F7412',
          800: '#585C14',
          900: '#4A4D16',
          950: '#282A06',
        },
        /** Text on lime or white backgrounds. */
        onbrand: '#0B0B0C',
        // Text colours for the dark theme (light on black).
        ink: {
          DEFAULT: '#F4F5F2',
          soft: '#D3D6D2',
          muted: '#9BA09F',
          subtle: '#6A706F',
        },
        surface: {
          DEFAULT: '#000000', // page background
          muted: '#111414', // cards and quiet sections
          sunken: '#1B1F1F', // raised cards, hovers, inputs on cards
        },
        /** Header and footer background. */
        chrome: '#0E1010',
        line: '#262B2B',
      },
      fontFamily: {
        sans: ['"Google Sans"', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        'display-2xl': ['clamp(3rem, 7.2vw, 6.25rem)', { lineHeight: '0.98', letterSpacing: '-0.035em' }],
        'display-xl': ['clamp(2.5rem, 5.4vw, 4.75rem)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2rem, 3.8vw, 3.25rem)', { lineHeight: '1.06', letterSpacing: '-0.025em' }],
        'display-md': ['clamp(1.5rem, 2.4vw, 2.125rem)', { lineHeight: '1.14', letterSpacing: '-0.02em' }],
      },
      maxWidth: {
        site: '84rem',
      },
      // Every card and panel uses an 18px corner radius.
      borderRadius: {
        '2xl': '18px',
        '3xl': '18px',
        '4xl': '18px',
        '5xl': '18px',
      },
      boxShadow: {
        panel: '0 30px 60px -30px rgb(0 0 0 / 0.8)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-down': { from: { opacity: '0', transform: 'translateY(-6px)' }, to: { opacity: '1', transform: 'none' } },
      },
      animation: {
        'fade-in': 'fade-in 180ms ease-out',
        'slide-down': 'slide-down 260ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#D3D6D2',
            '--tw-prose-headings': '#F4F5F2',
            '--tw-prose-lead': '#9BA09F',
            '--tw-prose-links': '#F4F5F2',
            '--tw-prose-bold': '#FFFFFF',
            '--tw-prose-counters': '#9BA09F',
            '--tw-prose-bullets': '#6A706F',
            '--tw-prose-hr': '#262B2B',
            '--tw-prose-quotes': '#F4F5F2',
            '--tw-prose-quote-borders': '#D9E026',
            '--tw-prose-captions': '#9BA09F',
            '--tw-prose-code': '#FFFFFF',
            '--tw-prose-th-borders': '#262B2B',
            '--tw-prose-td-borders': '#262B2B',
          },
        },
      },
    },
  },
  plugins: [typography],
} satisfies Config;

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /* ── Brand Colors (DESIGN.md §2) ── */
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',

        // Primary palette
        'neon-green': '#D4FF00',
        'deep-navy': '#1A1A2E',
        charcoal: '#333333',

        // Category gradients
        category: {
          'tech-start': '#2563EB',
          'tech-mid': '#06B6D4',
          'tech-end': '#10B981',
          'beauty-start': '#FF6B9D',
          'beauty-end': '#C71585',
          'wellness-start': '#20D5C5',
          'wellness-end': '#34D399',
          'sports-start': '#FF6B3D',
          'sports-end': '#FF4B2B',
          'fashion-start': '#8B5CF6',
          'fashion-end': '#3B82F6',
        },

        // Functional colors
        'live-indicator': '#FF6B3D',
        'alert-notification': '#FF7B5C',
        'favorite-heart': '#FF8C42',
        'neutral-gray': '#E5E5E5',
      },

      /* ── Typography (DESIGN.md §3) ── */
      fontFamily: {
        sans: [
          'Inter',
          'SF Pro',
          '-apple-system',
          'BlinkMacSystemFont',
          'Arial',
          'Helvetica',
          'sans-serif',
        ],
      },
      fontSize: {
        'hero-heading': [
          '64px',
          { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
        'page-title': ['42px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'banner-title': [
          '36px',
          { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
        'section-heading': ['28px', { lineHeight: '1.3', fontWeight: '600' }],
        'card-title': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        body: ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        small: ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'button-text': ['18px', { lineHeight: '1', fontWeight: '600' }],
      },

      /* ── Spacing (DESIGN.md §4.2 — 8px base unit) ── */
      spacing: {
        '1u': '8px',
        '2u': '16px',
        '3u': '24px',
        '4u': '32px',
        '6u': '48px',
        '8u': '64px',
      },

      /* ── Border Radius (DESIGN.md §5) ── */
      borderRadius: {
        button: '24px',
        'button-secondary': '20px',
        card: '16px',
        'card-sm': '12px',
        search: '24px',
      },

      /* ── Layout (DESIGN.md §4) ── */
      maxWidth: {
        container: '1440px',
      },

      /* ── Shadows ── */
      boxShadow: {
        header: '0 1px 3px rgba(0, 0, 0, 0.08)',
        card: '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'live-glow': '0 0 12px rgba(255, 107, 61, 0.4)',
      },

      /* ── Animations (DESIGN.md §8) ── */
      keyframes: {
        'live-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
        'bell-shake': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(8deg)' },
          '75%': { transform: 'rotate(-8deg)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'live-pulse': 'live-pulse 1.5s ease-in-out infinite',
        'bell-shake': 'bell-shake 0.5s ease-in-out infinite',
        'slide-up': 'slide-up 300ms ease-out',
      },

      /* ── Transitions (DESIGN.md §8.1) ── */
      transitionDuration: {
        hover: '200ms',
        button: '150ms',
      },
    },
  },
  plugins: [],
};
export default config;

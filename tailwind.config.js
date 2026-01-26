/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'md': '700px',  // 700px 이상: 데스크톱
    },
    extend: {
      colors: {
        // Primary Brand
        primary: {
          DEFAULT: '#2048E5',
          hover: '#1A3BB8',
          active: '#142E8C',
          light: '#EEF5FE',
          border: '#D9E7FC',
        },
        // Accent
        accent: {
          DEFAULT: '#8A38F5',
          hover: '#7229CC',
          active: '#5A1FA3',
        },
        // Neutral
        gray: {
          50: '#F8F9FA',
          100: '#F3F4F6',
          200: '#E6E6E6',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#909090',
          600: '#727272',
          700: '#4B5563',
          800: '#1F2937',
          900: '#111827',
        },
        // Semantic
        success: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
        },
        info: {
          DEFAULT: '#3B82F6',
          light: '#DBEAFE',
        },
        // Status Colors
        draft: '#909090',
        inspection: '#3B82F6',
        bidding: '#8B5CF6',
        'active-sale': '#10B981',
        sold: '#F97316',
        'pending-settlement': '#F59E0B',
        completed: '#14B8A6',
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'sans-serif'],
      },
      fontSize: {
        'h1': ['clamp(2rem, 2.5vw, 36px)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'h2': ['clamp(1.5rem, 1.67vw, 24px)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'h3': ['clamp(1.125rem, 1.25vw, 18px)', { lineHeight: '1.2' }],
        'h4': ['clamp(1rem, 1.11vw, 16px)', { lineHeight: '1.5' }],
        'body': ['clamp(0.875rem, 0.97vw, 14px)', { lineHeight: '1.5' }],
        'button': ['clamp(0.75rem, 0.83vw, 12px)', { lineHeight: '1.5' }],
        'caption': ['clamp(0.625rem, 0.69vw, 10px)', { lineHeight: '1.5' }],
      },
      spacing: {
        '1': 'clamp(4px, 0.28vw, 4px)',
        '2': 'clamp(8px, 0.56vw, 8px)',
        '3': 'clamp(12px, 0.83vw, 12px)',
        '4': 'clamp(16px, 1.11vw, 16px)',
        '5': 'clamp(20px, 1.39vw, 20px)',
        '6': 'clamp(24px, 1.67vw, 24px)',
        '8': 'clamp(32px, 2.22vw, 32px)',
        '10': 'clamp(40px, 2.78vw, 40px)',
        '12': 'clamp(48px, 3.33vw, 48px)',
        '16': 'clamp(64px, 4.44vw, 64px)',
        '20': 'clamp(80px, 5.56vw, 80px)',
        '24': 'clamp(96px, 6.67vw, 96px)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '10px',
        'lg': '20px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 3px 10px rgba(0, 0, 0, 0.05)',
        'lg': '0 10px 25px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 40px rgba(0, 0, 0, 0.15)',
      },
      maxWidth: {
        'container': '1440px',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '250ms',
        'slow': '400ms',
      },
    },
  },
  plugins: [],
}

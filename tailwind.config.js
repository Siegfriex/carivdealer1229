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
      /* Figma SSOT 1440px 기준 px 정합 (rem/vw 제거) */
      fontSize: {
        'h1': ['36px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'h2': ['24px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'h3': ['18px', { lineHeight: '1.2' }],
        'h4': ['16px', { lineHeight: '1.5' }],
        'body': ['14px', { lineHeight: '1.5' }],
        'button': ['12px', { lineHeight: '1.5' }],
        'caption': ['10px', { lineHeight: '1.5' }],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
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

import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        devflow: {
          bg: '#090B12',
          secondaryBg: '#101421',
          card: '#151A29',
          cardHover: '#1B2135',
          border: '#1E2638',
          textMuted: '#94A3B8',
          violet: '#8B5CF6',
          violetHover: '#7C3AED',
          cyan: '#06B6D4',
          cyanHover: '#0891B2',
          emerald: '#10B981',
          rose: '#F43F5E',
          amber: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

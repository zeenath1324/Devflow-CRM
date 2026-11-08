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
          bg: '#07090E',
          secondaryBg: '#0D111C',
          card: '#121726',
          cardHover: '#181F33',
          border: '#1B2338',
          borderHover: '#2B3754',
          textMuted: '#8290AA',
          violet: '#8B5CF6',
          violetHover: '#7C3AED',
          violetGlow: '#A78BFA',
          cyan: '#06B6D4',
          cyanHover: '#0891B2',
          cyanGlow: '#22D3EE',
          emerald: '#10B981',
          rose: '#F43F5E',
          amber: '#F59E0B',
        },
      },
      boxShadow: {
        'glow-violet': '0 0 30px -5px rgba(139, 92, 246, 0.22)',
        'glow-cyan': '0 0 30px -5px rgba(6, 182, 212, 0.22)',
        'subtle-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;

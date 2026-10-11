import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#2EC4B6',
          tealDark: '#1fa89b',
          tealLight: '#5eead4',
          purple: '#8B3FF7',
          purpleDark: '#6c23d9',
          purpleLight: '#a770fa',
          blue: '#2E6BF7',
          blueDark: '#1b4fd8',
          blueLight: '#6093fa',
        },
        dark: {
          bg: '#12121C',
          card: '#1A1A2E',
          cardHover: '#23233D',
          border: '#2A2A48',
          text: '#F1F1F6',
          muted: '#9CA3AF',
        },
        light: {
          bg: '#FAF9FC',
          card: '#FFFFFF',
          cardHover: '#F4F3F8',
          border: '#E5E4F0',
          text: '#12121C',
          muted: '#6B7280',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #8B3FF7 0%, #2E6BF7 50%, #2EC4B6 100%)',
        'brand-gradient-teal': 'linear-gradient(135deg, #2EC4B6 0%, #2E6BF7 100%)',
        'brand-gradient-purple': 'linear-gradient(135deg, #8B3FF7 0%, #2EC4B6 100%)',
        'radial-glow': 'radial-gradient(circle at 50% 50%, rgba(46, 196, 182, 0.15), transparent 70%)',
        'radial-purple-glow': 'radial-gradient(circle at 50% 50%, rgba(139, 63, 247, 0.15), transparent 70%)',
      },
      boxShadow: {
        'glow-teal': '0 0 25px -5px rgba(46, 196, 182, 0.4)',
        'glow-purple': '0 0 25px -5px rgba(139, 63, 247, 0.4)',
        'glow-brand': '0 0 30px -5px rgba(46, 196, 182, 0.3), 0 0 20px -5px rgba(139, 63, 247, 0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'gradient-x': 'gradient-x 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Google Sans', 'system-ui', 'sans-serif'],
        display: ['Google Sans Display', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'md-none': '0px',
        'md-xs': '4px',
        'md-sm': '8px',
        'md-md': '12px',
        'md-lg': '16px',
        'md-xl': '28px',
        'md-full': '9999px',
      },
      transitionTimingFunction: {
        'md-standard': 'cubic-bezier(0.2, 0, 0, 1)',
        'md-emphasized': 'cubic-bezier(0.2, 0, 0, 1)',
        'md-decelerate': 'cubic-bezier(0.05, 0.7, 0.1, 1)',
        'md-accelerate': 'cubic-bezier(0.3, 0, 0.8, 0.15)',
      },
      transitionDuration: {
        'md-short1': '50ms',
        'md-short4': '200ms',
        'md-medium2': '300ms',
        'md-medium4': '400ms',
        'md-long1': '450ms',
      },
    },
  },
  plugins: [],
};

export default config;

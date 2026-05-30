// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // M3 Core Colors
        primary: 'var(--md-sys-color-primary)',
        'on-primary': 'var(--md-sys-color-on-primary)',
        'primary-container': 'var(--md-sys-color-primary-container)',
        'on-primary-container': 'var(--md-sys-color-on-primary-container)',
        secondary: 'var(--md-sys-color-secondary)',
        'on-secondary': 'var(--md-sys-color-on-secondary)',
        'secondary-container': 'var(--md-sys-color-secondary-container)',
        'on-secondary-container': 'var(--md-sys-color-on-secondary-container)',
        tertiary: 'var(--md-sys-color-tertiary)',
        'on-tertiary': 'var(--md-sys-color-on-tertiary)',
        'tertiary-container': 'var(--md-sys-color-tertiary-container)',
        'on-tertiary-container': 'var(--md-sys-color-on-tertiary-container)',
        error: 'var(--md-sys-color-error)',
        'on-error': 'var(--md-sys-color-on-error)',
        'error-container': 'var(--md-sys-color-error-container)',
        'on-error-container': 'var(--md-sys-color-on-error-container)',
        background: 'var(--md-sys-color-background)',
        'on-background': 'var(--md-sys-color-on-background)',
        surface: 'var(--md-sys-color-surface)',
        'on-surface': 'var(--md-sys-color-on-surface)',
        'surface-variant': 'var(--md-sys-color-surface-variant)',
        'on-surface-variant': 'var(--md-sys-color-on-surface-variant)',
        outline: 'var(--md-sys-color-outline)',
        'outline-variant': 'var(--md-sys-color-outline-variant)',

        // ── Flow Custom Colors (Weights) ──
        // Background colors (Light = pastel, Dark = vivid)
        'flow-quick': 'var(--flow-weight-quick-color)',
        'flow-focused': 'var(--flow-weight-focused-color)',
        'flow-deep': 'var(--flow-weight-deep-color)',

        // Text/Icon colors (Contrast colors for inside the bubbles)
        // ⚠️ БЫЛИ ПРОПУЩЕНЫ, ДОБАВЛЕНЫ СЕЙЧАС
        'flow-quick-on': 'var(--flow-weight-quick-on-color)',
        'flow-focused-on': 'var(--flow-weight-focused-on-color)',
        'flow-deep-on': 'var(--flow-weight-deep-on-color)',

        // ── Flow Custom Colors (Time Blocks) ──
        'flow-morning': 'var(--flow-block-morning)',
        'flow-afternoon': 'var(--flow-block-afternoon)',
        'flow-evening': 'var(--flow-block-evening)',
        'flow-night': 'var(--flow-block-night)',
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
        'm3-emphasized': 'cubic-bezier(0.2, 0.0, 0, 1.0)',
        'm3-decelerate': 'cubic-bezier(0.0, 0.0, 0, 1.0)',
        'm3-accelerate': 'cubic-bezier(0.3, 0.0, 1.0, 1.0)',
      },
      transitionDuration: {
        'md-short1': '50ms',
        'md-short4': '200ms',
        'md-medium2': '300ms',
        'md-medium4': '400ms',
        'md-long1': '450ms',
        'm3-short-1': '100ms',
        'm3-short-2': '200ms',
        'm3-medium-1': '250ms',
        'm3-medium-2': '400ms',
        'm3-long-1': '500ms',
      },
    },
  },
  plugins: [],
};
export default config;
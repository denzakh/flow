/**
 * FLOW Design System Tokens
 * Централизованная система дизайн-токенов для консистентности UI
 */

import { TaskWeight, TimePeriod, OptimizationStrategy } from './types';

/* ──────────────────────────────────────────────────────────────────────────
   COLOR PALETTE
   ────────────────────────────────────────────────────────────────────────── */

export const colors = {
  /* Backgrounds */
  bg: {
    primary: '#0a0a0a',
    secondary: '#0f0f0f',
    card: '#141414',
    elevated: '#1a1a1a',
    glass: 'rgba(20, 20, 20, 0.7)',
    glassCard: 'rgba(30, 30, 30, 0.5)',
    glassCardHover: 'rgba(35, 35, 35, 0.6)',
  },

  /* Text */
  text: {
    primary: '#ffffff',
    secondary: '#a0a0a0',
    tertiary: '#666666',
    muted: '#444444',
    disabled: 'rgba(255, 255, 255, 0.3)',
  },

  /* Accent Colors - Flow Brand */
  accent: {
    evening: '#d4a574',
    eveningGlow: 'rgba(212, 165, 116, 0.3)',
    morning: '#ffffff',
    night: '#6b7280',
    active: '#10b981',
    activeGlow: 'rgba(16, 185, 129, 0.3)',
  },

  /* Task Weights - Visual Coding */
  weight: {
    [TaskWeight.QUICK]: {
      primary: '#34d399',
      bg: 'rgba(52, 211, 153, 0.1)',
      border: 'rgba(52, 211, 153, 0.3)',
      glow: 'rgba(52, 211, 153, 0.2)',
    },
    [TaskWeight.FOCUSED]: {
      primary: '#60a5fa',
      bg: 'rgba(96, 165, 250, 0.1)',
      border: 'rgba(96, 165, 250, 0.3)',
      glow: 'rgba(96, 165, 250, 0.2)',
    },
    [TaskWeight.DEEP]: {
      primary: '#a78bfa',
      bg: 'rgba(167, 139, 250, 0.1)',
      border: 'rgba(167, 139, 250, 0.3)',
      glow: 'rgba(167, 139, 250, 0.2)',
    },
  },

  /* Time Periods */
  period: {
    [TimePeriod.MORNING]: {
      primary: '#fef3c7',
      bg: 'rgba(254, 243, 199, 0.05)',
      border: 'rgba(254, 243, 199, 0.2)',
    },
    [TimePeriod.AFTERNOON]: {
      primary: '#fde68a',
      bg: 'rgba(253, 230, 138, 0.05)',
      border: 'rgba(253, 230, 138, 0.2)',
    },
    [TimePeriod.EVENING]: {
      primary: '#d4a574',
      bg: 'rgba(212, 165, 116, 0.05)',
      border: 'rgba(212, 165, 116, 0.3)',
      glow: 'rgba(212, 165, 116, 0.15)',
    },
    [TimePeriod.NIGHT]: {
      primary: '#6b7280',
      bg: 'rgba(107, 114, 128, 0.05)',
      border: 'rgba(255, 255, 255, 0.08)',
    },
  },

  /* Priority Colors */
  priority: {
    high: {
      primary: '#f87171',
      bg: 'rgba(248, 113, 113, 0.1)',
      border: 'rgba(248, 113, 113, 0.3)',
    },
    medium: {
      primary: '#fbbf24',
      bg: 'rgba(251, 191, 36, 0.1)',
      border: 'rgba(251, 191, 36, 0.2)',
    },
    low: {
      primary: '#60a5fa',
      bg: 'rgba(96, 165, 250, 0.1)',
      border: 'rgba(96, 165, 250, 0.2)',
    },
  },

  /* Borders */
  border: {
    default: 'rgba(255, 255, 255, 0.08)',
    dashed: 'rgba(255, 255, 255, 0.3)',
    evening: 'rgba(212, 165, 116, 0.4)',
    hover: 'rgba(255, 255, 255, 0.15)',
    focus: 'rgba(255, 255, 255, 0.2)',
    active: 'rgba(255, 255, 255, 0.25)',
  },

  /* States */
  state: {
    hover: 'rgba(255, 255, 255, 0.05)',
    active: 'rgba(255, 255, 255, 0.1)',
    disabled: 'rgba(255, 255, 255, 0.02)',
    selected: 'rgba(16, 185, 129, 0.15)',
    error: 'rgba(248, 113, 113, 0.15)',
    success: 'rgba(16, 185, 129, 0.15)',
  },

  /* Gradient Borders */
  gradient: {
    input: 'linear-gradient(0deg, rgba(43, 72, 172, 0.60) -50.01%, rgba(140, 110, 50, 0.60) 189.97%, rgba(172, 169, 0, 0.60) 289.14%, rgba(255, 255, 255, 0.60) 348.64%)',
    inputFocus: 'linear-gradient(57deg, rgba(0, 0, 0, 0.00) 40.89%, #72AAC5 94.84%), linear-gradient(65deg, #FFFEC4 4.43%, rgba(6, 25, 47, 0.00) 45.35%), linear-gradient(110deg, #000 52.9%, #846757 96.98%)',
    alarm: 'linear-gradient(57deg, rgba(0, 0, 0, 0.00) 40.89%, #72AAC5 94.84%), linear-gradient(65deg, #FFFEC4 4.43%, rgba(6, 25, 47, 0.00) 45.35%), linear-gradient(110deg, #000 52.9%, #846757 96.98%)',
    topBar: 'linear-gradient(to right, rgba(16, 185, 129, 0.3), rgba(212, 165, 116, 0.3))',
  },
};

/* ──────────────────────────────────────────────────────────────────────────
   SPACING SYSTEM (8px base unit)
   ────────────────────────────────────────────────────────────────────────── */

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
  '5xl': '48px',
  '6xl': '64px',
};

/* ──────────────────────────────────────────────────────────────────────────
   BORDER RADIUS (Consistent family)
   ────────────────────────────────────────────────────────────────────────── */

export const radius = {
  none: '0px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
  full: '9999px',
};

/* ──────────────────────────────────────────────────────────────────────────
   TYPOGRAPHY (Poppins font family)
   ────────────────────────────────────────────────────────────────────────── */

export const typography = {
  fontFamily: "'Poppins', sans-serif",
  
  /* Font Sizes */
  fontSize: {
    xs: '10px',      // 0.625rem
    sm: '12px',      // 0.75rem
    base: '14px',    // 0.875rem
    lg: '16px',      // 1rem
    xl: '18px',      // 1.125rem
    '2xl': '20px',   // 1.25rem
    '3xl': '24px',   // 1.5rem
    '4xl': '32px',   // 2rem
    '5xl': '40px',   // 2.5rem
  },

  /* Font Weights */
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },

  /* Line Heights */
  lineHeight: {
    none: 1,
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  /* Letter Spacing */
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
    ultra: '0.25em',
    ultraWide: '0.4em',
  },

  /* Preset Styles */
  presets: {
    h1: {
      fontSize: '40px',
      fontWeight: 300,
      lineHeight: 1.25,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '32px',
      fontWeight: 300,
      lineHeight: 1.25,
    },
    h3: {
      fontSize: '24px',
      fontWeight: 300,
      lineHeight: 1.375,
    },
    h4: {
      fontSize: '20px',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    label: {
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
    },
    tiny: {
      fontSize: '10px',
      fontWeight: 900,
      letterSpacing: '0.25em',
      textTransform: 'uppercase' as const,
    },
  },
};

/* ──────────────────────────────────────────────────────────────────────────
   SHADOWS & GLOWS
   ────────────────────────────────────────────────────────────────────────── */

export const shadows = {
  /* Base Shadows */
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  /* Flow-specific */
  card: '0 4px 24px 0 rgba(0, 0, 0, 0.3)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  
  /* Glows */
  glowEvening: '0 0 40px rgba(212, 165, 116, 0.15)',
  glowSubtle: '0 0 20px rgba(255, 255, 255, 0.05)',
  glowActive: '0 0 30px rgba(16, 185, 129, 0.2)',
  
  /* Night Block Special */
  nightBlock: '-4px -4px 10px 0 rgba(129, 177, 213, 0.30) inset, 4px 4px 15px 0 rgba(160, 123, 78, 0.40)',
  
  /* Original Halo Effect */
  halo: '-4px -4px 10px 0 rgba(129, 177, 213, 0.30) inset, 4px 4px 15px 0 rgba(160, 123, 78, 0.40)',
};

/* ──────────────────────────────────────────────────────────────────────────
   TRANSITIONS & ANIMATIONS
   ────────────────────────────────────────────────────────────────────────── */

export const transitions = {
  /* Durations */
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },

  /* Easing */
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  /* Presets */
  presets: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

/* ──────────────────────────────────────────────────────────────────────────
   ICON SYSTEM (Lucide React - Consistent weight)
   ────────────────────────────────────────────────────────────────────────── */

export const icons = {
  /* Sizes */
  sizes: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
  },

  /* Stroke Width (consistent across all icons) */
  strokeWidth: 1.5,

  /* Touch target for icon buttons */
  touchTarget: {
    min: '44px',
    comfortable: '48px',
  },
};

/* ──────────────────────────────────────────────────────────────────────────
   OPTIMIZATION STRATEGIES (Visual representation)
   ────────────────────────────────────────────────────────────────────────── */

export const optimizationStrategies: Record<OptimizationStrategy, {
  label: Record<'en' | 'ru' | 'es', string>;
  description: Record<'en' | 'ru' | 'es', string>;
  icon: string;
  color: string;
}> = {
  balanced: {
    label: { en: 'Balanced', ru: 'Сбалансированный', es: 'Equilibrado' },
    description: { 
      en: 'Considers time of day and task weight', 
      ru: 'Учитывает время суток и вес задач',
      es: 'Considera la hora del día y el peso de las tareas'
    },
    icon: 'Target',
    color: colors.weight[TaskWeight.FOCUSED].primary,
  },
  'quick-wins': {
    label: { en: 'Quick Wins', ru: 'Быстрые победы', es: 'Victorias Rápidas' },
    description: { 
      en: 'Prioritize easy tasks for momentum', 
      ru: 'Приоритет лёгким задачам для импульса',
      es: 'Prioriza tareas fáciles para el impulso'
    },
    icon: 'Zap',
    color: colors.weight[TaskWeight.QUICK].primary,
  },
  'priority-first': {
    label: { en: 'Priority First', ru: 'Сначала важное', es: 'Primero lo Importante' },
    description: { 
      en: 'High priority tasks come first', 
      ru: 'Сначала задачи с высоким приоритетом',
      es: 'Las tareas de alta prioridad van primero'
    },
    icon: 'Layers',
    color: colors.priority.high.primary,
  },
};

/* ──────────────────────────────────────────────────────────────────────────
   EMPTY STATES
   ────────────────────────────────────────────────────────────────────────── */

export const emptyStates = {
  noTasks: {
    icon: 'Check',
    title: {
      en: 'All clear',
      ru: 'Всё готово',
      es: 'Todo listo',
    },
    description: {
      en: 'No tasks for this period',
      ru: 'Нет задач на этот период',
      es: 'No hay tareas para este período',
    },
  },
  noUpcoming: {
    icon: 'Calendar',
    title: {
      en: 'Nothing planned',
      ru: 'Ничего не запланировано',
      es: 'Nada planeado',
    },
    description: {
      en: 'Add tasks to see them here',
      ru: 'Добавьте задачи, чтобы увидеть их здесь',
      es: 'Añade tareas para verlas aquí',
    },
  },
  recoveryMode: {
    icon: 'Heart',
    title: {
      en: 'Recovery Mode',
      ru: 'Режим восстановления',
      es: 'Modo Recuperación',
    },
    description: {
      en: 'Time to rest and recharge',
      ru: 'Время отдохнуть и восстановиться',
      es: 'Hora de descansar y recargar',
    },
  },
};

/* ──────────────────────────────────────────────────────────────────────────
   EXPORT HELPER FUNCTIONS
   ────────────────────────────────────────────────────────────────────────── */

/**
 * Get CSS variable reference for dynamic theming
 */
export const cssVar = (name: string) => `var(--${name})`;

/**
 * Generate inline style from token path
 * Example: getTokenStyle('bg.primary') -> { backgroundColor: '#0a0a0a' }
 */
export const getTokenStyle = (path: string): React.CSSProperties => {
  const keys = path.split('.');
  let value: any = colors;
  
  for (const key of keys) {
    value = value?.[key as keyof typeof value];
  }
  
  if (typeof value === 'string') {
    return { backgroundColor: value };
  }
  
  return {};
};

/**
 * Get spacing value in px
 */
export const getSpacing = (key: keyof typeof spacing): string => {
  return spacing[key];
};

/**
 * Get radius value in px
 */
export const getRadius = (key: keyof typeof radius): string => {
  return radius[key];
};

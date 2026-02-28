/**
 * FLOW Design System - React Utilities
 * Хуки и helper-функции для применения дизайн-токенов в компонентах
 */

import { colors, spacing, radius, typography, shadows, transitions, icons } from './design-tokens';
import { TaskWeight, TimePeriod, Priority } from '../types';

/* ──────────────────────────────────────────────────────────────────────────
   TYPE HELPERS
   ────────────────────────────────────────────────────────────────────────── */

export type ColorPath = keyof typeof colors;
export type SpacingKey = keyof typeof spacing;
export type RadiusKey = keyof typeof radius;
export type ShadowKey = keyof typeof shadows;
export type TransitionKey = keyof typeof transitions.duration;

/* ──────────────────────────────────────────────────────────────────────────
   STYLE GENERATORS
   ────────────────────────────────────────────────────────────────────────── */

/**
 * Генерирует inline styles для цветовых токенов
 * @example getColorStyles('bg.primary') -> { backgroundColor: '#0a0a0a' }
 */
export const getColorStyles = (path: string): React.CSSProperties => {
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
 * Генерирует styles для текста
 * @example getTextStyles('secondary') -> { color: '#a0a0a0' }
 */
export const getTextStyles = (variant: keyof typeof colors.text): React.CSSProperties => {
  return { color: colors.text[variant] };
};

/**
 * Генерирует styles для фона
 */
export const getBgStyles = (variant: keyof typeof colors.bg): React.CSSProperties => {
  return { backgroundColor: colors.bg[variant] };
};

/**
 * Генерирует border styles с учетом состояния
 */
export const getBorderStyles = (
  variant: keyof typeof colors.border | keyof typeof colors.weight | keyof typeof colors.priority = 'default',
  state: 'default' | 'hover' | 'focus' | 'active' = 'default'
): React.CSSProperties => {
  let borderColor: string;
  
  if (variant in colors.border) {
    borderColor = colors.border[variant as keyof typeof colors.border] as string;
  } else if (variant in colors.weight) {
    const weightColors = colors.weight[variant as keyof typeof colors.weight];
    borderColor = weightColors.border;
  } else if (variant in colors.priority) {
    const priorityColors = colors.priority[variant as keyof typeof colors.priority];
    borderColor = priorityColors.border;
  } else {
    borderColor = colors.border.default;
  }
  
  return {
    borderColor,
    transition: `border-color ${transitions.presets.normal}`,
  };
};

/* ──────────────────────────────────────────────────────────────────────────
   SPACING UTILITIES
   ────────────────────────────────────────────────────────────────────────── */

/**
 * Возвращает значение spacing в px
 */
export const getSpacingValue = (key: SpacingKey): string => {
  return spacing[key];
};

/**
 * Генерирует padding styles
 */
export const getPaddingStyles = (key: SpacingKey): React.CSSProperties => {
  return { padding: spacing[key] };
};

/**
 * Генерирует margin styles
 */
export const getMarginStyles = (key: SpacingKey): React.CSSProperties => {
  return { margin: spacing[key] };
};

/**
 * Генерирует gap styles для flex/grid
 */
export const getGapStyles = (key: SpacingKey): React.CSSProperties => {
  return { gap: spacing[key] };
};

/* ──────────────────────────────────────────────────────────────────────────
   RADIUS UTILITIES
   ────────────────────────────────────────────────────────────────────────── */

/**
 * Возвращает значение radius в px
 */
export const getRadiusValue = (key: RadiusKey): string => {
  return radius[key];
};

/**
 * Генерирует border-radius styles
 */
export const getRadiusStyles = (key: RadiusKey): React.CSSProperties => {
  return { borderRadius: radius[key] };
};

/* ──────────────────────────────────────────────────────────────────────────
   SHADOW UTILITIES
   ────────────────────────────────────────────────────────────────────────── */

export type ShadowType = 'default' | 'glow';

/**
 * Генерирует box-shadow styles
 */
export const getShadowStyles = (
  key: ShadowKey,
  type: ShadowType = 'default'
): React.CSSProperties => {
  const shadowValue = shadows[key as keyof typeof shadows];
  return { boxShadow: shadowValue };
};

/**
 * Специальные glow эффекты
 */
export const getGlowStyles = (variant: 'evening' | 'active' | 'subtle'): React.CSSProperties => {
  const glowMap = {
    evening: shadows.glowEvening,
    active: shadows.glowActive,
    subtle: shadows.glowSubtle,
  };
  return { boxShadow: glowMap[variant] };
};

/* ──────────────────────────────────────────────────────────────────────────
   TYPOGRAPHY UTILITIES
   ────────────────────────────────────────────────────────────────────────── */

/**
 * Генерирует typography styles из preset
 */
export const getTypographyStyles = (
  preset: keyof typeof typography.presets
): React.CSSProperties => {
  return { ...typography.presets[preset] };
};

/**
 * Генерирует font-size styles
 */
export const getFontSizeStyles = (
  size: keyof typeof typography.fontSize
): React.CSSProperties => {
  return { fontSize: typography.fontSize[size] };
};

/**
 * Генерирует font-weight styles
 */
export const getFontWeightStyles = (
  weight: keyof typeof typography.fontWeight
): React.CSSProperties => {
  return { fontWeight: typography.fontWeight[weight] };
};

/**
 * Генерирует letter-spacing styles
 */
export const getLetterSpacingStyles = (
  spacing: keyof typeof typography.letterSpacing
): React.CSSProperties => {
  return { letterSpacing: typography.letterSpacing[spacing] };
};

/* ──────────────────────────────────────────────────────────────────────────
   TRANSITION UTILITIES
   ────────────────────────────────────────────────────────────────────────── */

/**
 * Генерирует transition styles
 */
export const getTransitionStyles = (
  duration: TransitionKey = 'normal',
  properties: string[] = ['all']
): React.CSSProperties => {
  return {
    transition: properties
      .map(p => `${p} ${transitions.duration[duration]} ${transitions.easing.default}`)
      .join(', '),
  };
};

/**
 * Preset transition для часто используемых случаев
 */
export const transitionsPresets = {
  button: {
    transition: `all ${transitions.duration.normal} ${transitions.easing.bounce}`,
  },
  card: {
    transition: `background-color ${transitions.duration.normal} ${transitions.easing.default}, box-shadow ${transitions.duration.slow} ${transitions.easing.default}`,
  },
  input: {
    transition: `border-color ${transitions.duration.normal} ${transitions.easing.default}`,
  },
  fade: {
    transition: `opacity ${transitions.duration.slow} ${transitions.easing.default}`,
  },
  slide: {
    transition: `transform ${transitions.duration.slow} ${transitions.easing.easeOut}`,
  },
};

/* ──────────────────────────────────────────────────────────────────────────
   ICON UTILITIES
   ────────────────────────────────────────────────────────────────────────── */

/**
 * Возвращает размер иконки в px
 */
export const getIconSize = (size: keyof typeof icons.sizes): number => {
  return icons.sizes[size];
};

/**
 * Генерирует styles для иконки
 */
export const getIconStyles = (
  size: keyof typeof icons.sizes = 'md'
): React.CSSProperties => {
  return {
    width: icons.sizes[size],
    height: icons.sizes[size],
    strokeWidth: icons.strokeWidth,
  };
};

/**
 * Touch target для кнопок с иконками
 */
export const getTouchTargetStyles = (
  comfortable: boolean = true
): React.CSSProperties => {
  return {
    minHeight: comfortable ? icons.touchTarget.comfortable : icons.touchTarget.min,
    minWidth: comfortable ? icons.touchTarget.comfortable : icons.touchTarget.min,
  };
};

/* ──────────────────────────────────────────────────────────────────────────
   TASK-SPECIFIC UTILITIES
   ────────────────────────────────────────────────────────────────────────── */

/**
 * Styles для задачи в зависимости от веса
 */
export const getTaskWeightStyles = (weight: TaskWeight): React.CSSProperties => {
  const weightColors = colors.weight[weight];
  return {
    backgroundColor: weightColors.bg,
    borderColor: weightColors.border,
    color: weightColors.primary,
  };
};

/**
 * Styles для задачи в зависимости от приоритета
 */
export const getTaskPriorityStyles = (priority: Priority): React.CSSProperties => {
  const priorityColors = colors.priority[priority];
  return {
    backgroundColor: priorityColors.bg,
    borderColor: priorityColors.border,
  };
};

/**
 * Styles для временного периода
 */
export const getPeriodStyles = (period: TimePeriod): React.CSSProperties => {
  const periodColors = colors.period[period];
  return {
    backgroundColor: periodColors.bg,
    borderColor: periodColors.border,
    color: periodColors.primary,
  };
};

/* ──────────────────────────────────────────────────────────────────────────
   COMPOSITE STYLES (Готовые комбинации)
   ────────────────────────────────────────────────────────────────────────── */

/**
 * Базовый стиль карточки
 */
export const cardBaseStyles: React.CSSProperties = {
  background: colors.bg.card,
  borderRadius: radius['2xl'],
  border: `1px solid ${colors.border.default}`,
  ...transitionsPresets.card,
};

/**
 * Стиль карточки с hover эффектом
 */
export const cardHoverStyles: React.CSSProperties = {
  ...cardBaseStyles,
  transition: `background-color ${transitions.duration.normal} ${transitions.easing.bounce}, box-shadow ${transitions.duration.slow} ${transitions.easing.default}`,
};

/**
 * Стиль стеклянной карточки
 */
export const glassCardStyles: React.CSSProperties = {
  background: colors.bg.glassCard,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: `1px solid ${colors.border.default}`,
  boxShadow: shadows.card,
};

/**
 * Стиль input поля
 */
export const inputBaseStyles: React.CSSProperties = {
  background: colors.bg.primary,
  border: `1px solid ${colors.border.default}`,
  borderRadius: radius['2xl'],
  fontFamily: typography.fontFamily,
  fontSize: typography.fontSize.base,
  fontWeight: typography.fontWeight.bold,
  color: colors.text.primary,
  outline: 'none',
  ...transitionsPresets.input,
};

/**
 * Стиль кнопки
 */
export const buttonBaseStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacing.sm,
  fontFamily: typography.fontFamily,
  fontWeight: typography.fontWeight.bold,
  borderRadius: radius.xl,
  border: 'none',
  cursor: 'pointer',
  ...transitionsPresets.button,
};

/**
 * Primary кнопка
 */
export const buttonPrimaryStyles: React.CSSProperties = {
  ...buttonBaseStyles,
  background: colors.accent.active,
  color: colors.text.primary,
};

/**
 * Secondary кнопка
 */
export const buttonSecondaryStyles: React.CSSProperties = {
  ...buttonBaseStyles,
  background: 'transparent',
  border: `1px solid ${colors.border.default}`,
  color: colors.text.primary,
};

/* ──────────────────────────────────────────────────────────────────────────
   CLASS NAME GENERATORS (для Tailwind + CSS variables)
   ────────────────────────────────────────────────────────────────────────── */

/**
 * Генерирует className для цветовых утилит
 */
export const textColors = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  tertiary: 'text-tertiary',
  muted: 'text-muted',
  disabled: 'text-disabled',
};

export const bgColors = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  card: 'bg-card',
  elevated: 'bg-elevated',
};

export const borders = {
  default: 'border-default',
  hover: 'border-hover',
  focus: 'border-focus',
  active: 'border-active',
};

export const radii = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  '4xl': 'rounded-4xl',
  full: 'rounded-full',
};

export const shadows_classes = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  card: 'shadow-card',
};

export const transitions_classes = {
  fast: 'transition-fast',
  normal: 'transition-normal',
  slow: 'transition-slow',
};

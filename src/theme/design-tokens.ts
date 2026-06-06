import { TaskWeight } from '../types';

/**
 * FLOW Design System Tokens
 * Централизованная система дизайн-токенов для консистентности UI.
 * 
 * Источники:
 * Material Design 3 tokens: src/theme/tokens.css
 * Flow-specific tokens: src/theme/tokens.css (prefixed --flow-)
 */

// ─────────────────────────────────────────────────────────────
// Типы
// ─────────────────────────────────────────────────────────────
export type TokenValue = string;
export type ColorToken = keyof typeof colors;
export type ShapeToken = keyof typeof shape;
export type TypographyToken = keyof typeof typography;
export type MotionToken = keyof typeof motion;
export type ElevationToken = keyof typeof elevation;

// ─────────────────────────────────────────────────────────────
// Colors — только CSS-переменные
// ─────────────────────────────────────────────────────────────
export const colors = {
  // M3 System colors
  background: 'var(--md-sys-color-background)',
  onBackground: 'var(--md-sys-color-on-background)',
  surface: 'var(--md-sys-color-surface)',
  onSurface: 'var(--md-sys-color-on-surface)',
  surfaceVariant: 'var(--md-sys-color-surface-variant)',
  onSurfaceVariant: 'var(--md-sys-color-on-surface-variant)',
  surfaceContainer: 'var(--md-sys-color-surface-container)',
  surfaceContainerLow: 'var(--md-sys-color-surface-container-low)',
  surfaceContainerHigh: 'var(--md-sys-color-surface-container-high)',
  primary: 'var(--md-sys-color-primary)',
  onPrimary: 'var(--md-sys-color-on-primary)',
  primaryContainer: 'var(--md-sys-color-primary-container)',
  onPrimaryContainer: 'var(--md-sys-color-on-primary-container)',
  secondary: 'var(--md-sys-color-secondary)',
  onSecondary: 'var(--md-sys-color-on-secondary)',
  secondaryContainer: 'var(--md-sys-color-secondary-container)',
  onSecondaryContainer: 'var(--md-sys-color-on-secondary-container)',
  tertiary: 'var(--md-sys-color-tertiary)',
  onTertiary: 'var(--md-sys-color-on-tertiary)',
  tertiaryContainer: 'var(--md-sys-color-tertiary-container)',
  onTertiaryContainer: 'var(--md-sys-color-on-tertiary-container)',
  error: 'var(--md-sys-color-error)',
  onError: 'var(--md-sys-color-on-error)',
  errorContainer: 'var(--md-sys-color-error-container)',
  onErrorContainer: 'var(--md-sys-color-on-error-container)',
  outline: 'var(--md-sys-color-outline)',
  outlineVariant: 'var(--md-sys-color-outline-variant)',

  // Flow-specific block colors (backgrounds of time blocks)
  flowBlockMorning: 'var(--flow-block-morning)',
  flowBlockAfternoon: 'var(--flow-block-afternoon)',
  flowBlockEvening: 'var(--flow-block-evening)',
  flowBlockNight: 'var(--flow-block-night)',

  // Flow-specific weight colors (bubbles / indicators)
  // В CSS используется суффикс -color (пастель light / vivid dark)
  flowWeightQuick: 'var(--flow-weight-quick-color)',
  flowWeightFocused: 'var(--flow-weight-focused-color)',
  flowWeightDeep: 'var(--flow-weight-deep-color)',
} as const;

// ─────────────────────────────────────────────────────────────
// Flow-specific weight config (used in constants.tsx)
// ─────────────────────────────────────────────────────────────
export const WEIGHT_CONFIG = {
  [TaskWeight.quick]: { label: 'Quick', points: 1, color: colors.flowWeightQuick },
  [TaskWeight.focused]: { label: 'Focused', points: 3, color: colors.flowWeightFocused },
  [TaskWeight.deep]: { label: 'Deep', points: 6, color: colors.flowWeightDeep },
} as const;


// ─────────────────────────────────────────────────────────────
// Shape (скругления) — только CSS-переменные
// ─────────────────────────────────────────────────────────────
export const shape = {
  cornerNone: 'var(--md-sys-shape-corner-none)',           // 0px
  cornerExtraSmall: 'var(--md-sys-shape-corner-extra-small)', // 4px
  cornerSmall: 'var(--md-sys-shape-corner-small)',         // 8px
  cornerMedium: 'var(--md-sys-shape-corner-medium)',        // 12px — карточки задач
  cornerLarge: 'var(--md-sys-shape-corner-large)',          // 16px — FAB, навигация
  cornerExtraLarge: 'var(--md-sys-shape-corner-extra-large)', // 28px — диалоги
  cornerFull: 'var(--md-sys-shape-corner-full)',            // 9999px — кнопки
} as const;

// ─────────────────────────────────────────────────────────────
// Typography — ссылки на M3 CSS-переменные
// ─────────────────────────────────────────────────────────────
// В CSS имена короче: ...-font, ...-size, ...-weight
export const typography = {
  fontFamily: 'var(--md-sys-typescale-body-large-font)',
  headlineLargeSize: 'var(--md-sys-typescale-headline-large-size)',
  headlineLargeLineHeight: 'var(--md-sys-typescale-headline-large-line-height)',
  headlineLargeWeight: 'var(--md-sys-typescale-headline-large-weight)',
  headlineMediumSize: 'var(--md-sys-typescale-headline-medium-size)',
  headlineMediumLineHeight: 'var(--md-sys-typescale-headline-medium-line-height)',
  headlineMediumWeight: 'var(--md-sys-typescale-headline-medium-weight)',
  headlineSmallSize: 'var(--md-sys-typescale-headline-small-size)',
  headlineSmallLineHeight: 'var(--md-sys-typescale-headline-small-line-height)',
  headlineSmallWeight: 'var(--md-sys-typescale-headline-small-weight)',
  titleLargeSize: 'var(--md-sys-typescale-title-large-size)',
  titleLargeLineHeight: 'var(--md-sys-typescale-title-large-line-height)',
  titleLargeWeight: 'var(--md-sys-typescale-title-large-weight)',
  titleMediumSize: 'var(--md-sys-typescale-title-medium-size)',
  titleMediumLineHeight: 'var(--md-sys-typescale-title-medium-line-height)',
  titleMediumWeight: 'var(--md-sys-typescale-title-medium-weight)',
  titleSmallSize: 'var(--md-sys-typescale-title-small-size)',
  titleSmallLineHeight: 'var(--md-sys-typescale-title-small-line-height)',
  titleSmallWeight: 'var(--md-sys-typescale-title-small-weight)',
  bodyLargeSize: 'var(--md-sys-typescale-body-large-size)',
  bodyLargeLineHeight: 'var(--md-sys-typescale-body-large-line-height)',
  bodyLargeWeight: 'var(--md-sys-typescale-body-large-weight)',
  bodyMediumSize: 'var(--md-sys-typescale-body-medium-size)',
  bodyMediumLineHeight: 'var(--md-sys-typescale-body-medium-line-height)',
  bodyMediumWeight: 'var(--md-sys-typescale-body-medium-weight)',
  bodySmallSize: 'var(--md-sys-typescale-body-small-size)',
  bodySmallLineHeight: 'var(--md-sys-typescale-body-small-line-height)',
  bodySmallWeight: 'var(--md-sys-typescale-body-small-weight)',
  labelLargeSize: 'var(--md-sys-typescale-label-large-size)',
  labelLargeLineHeight: 'var(--md-sys-typescale-label-large-line-height)',
  labelLargeWeight: 'var(--md-sys-typescale-label-large-weight)',
  labelMediumSize: 'var(--md-sys-typescale-label-medium-size)',
  labelMediumLineHeight: 'var(--md-sys-typescale-label-medium-line-height)',
  labelMediumWeight: 'var(--md-sys-typescale-label-medium-weight)',
  labelSmallSize: 'var(--md-sys-typescale-label-small-size)',
  labelSmallLineHeight: 'var(--md-sys-typescale-label-small-line-height)',
  labelSmallWeight: 'var(--md-sys-typescale-label-small-weight)',
} as const;

// ─────────────────────────────────────────────────────────────
// Motion (M3 easing & duration)
// ─────────────────────────────────────────────────────────────
export const motion = {
  durationShort1: 'var(--md-sys-motion-duration-short1)',   // 50ms
  durationShort2: 'var(--md-sys-motion-duration-short2)',   // 100ms
  durationMedium1: 'var(--md-sys-motion-duration-medium1)', // 250ms
  durationMedium2: 'var(--md-sys-motion-duration-medium2)', // 300ms
  durationLong1: 'var(--md-sys-motion-duration-long1)',     // 450ms
  easingStandard: 'var(--md-sys-motion-easing-standard)',
  easingEmphasized: 'var(--md-sys-motion-easing-emphasized)',
  easingDecelerate: 'var(--md-sys-motion-easing-emphasized-decel)', // Исправлено имя
  easingAccelerate: 'var(--md-sys-motion-easing-emphasized-accel)', // Исправлено имя
} as const;

// ─────────────────────────────────────────────────────────────
// Elevation
// ─────────────────────────────────────────────────────────────
export const elevation = {
  level1: 'var(--md-sys-elevation-level1)',
  level2: 'var(--md-sys-elevation-level2)',
  level3: 'var(--md-sys-elevation-level3)',
  level4: 'var(--md-sys-elevation-level4)',
  level5: 'var(--md-sys-elevation-level5)',
} as const;

// ─────────────────────────────────────────────────────────────
// Spacing — строгая сетка 4px
// ─────────────────────────────────────────────────────────────
export const spacing = {
  none: '0px',
  xs: '4px',   // микро-расстояния
  sm: '8px',   // иконки, чипсы
  md: '12px',  // стандартный отступ (M3 Medium)
  lg: '16px',  // крупные блоки (M3 Large)
  xl: '24px',  // отступы экранов (6 * 4px)
  xxl: '32px', // 8 * 4px
  xxxl: '48px' // 12 * 4px
} as const;

// ─────────────────────────────────────────────────────────────
// Touch target & sizing
// ─────────────────────────────────────────────────────────────
export const touchTarget = {
  minSize: '48px',
} as const;

export const componentSize = {
  cardBorderRadius: shape.cornerMedium,    // 12px
  fabBorderRadius: shape.cornerLarge,      // 16px
  chipBorderRadius: shape.cornerSmall,     // 8px
  dialogBorderRadius: shape.cornerExtraLarge, // 28px
} as const;

// ─────────────────────────────────────────────────────────────
// Утилиты
// ─────────────────────────────────────────────────────────────

/**
 * Генератор CSS-переменной для произвольного имени.
 */
export function cssVar(name: string): string {
  return `var(${name})`;
}

/**
 * Типизированный доступ к цветовому токену.
 */
export function getColorToken(token: ColorToken): string {
  return colors[token];
}

/**
 * Типизированный доступ к токену скругления.
 */
export function getShapeToken(token: ShapeToken): string {
  return shape[token];
}

/**
 * Типизированный доступ к токену анимации.
 */
export function getMotionToken(token: MotionToken): string {
  return motion[token];
}

/**
 * Комбинатор для inline-стилей React.
 * Пример: style={tokenStyle('backgroundColor', 'primaryContainer')}
 */
export function tokenStyle<T extends keyof typeof colors>(
  property: string,
  token: T
): Record<string, string> {
  return { [property]: colors[token] };
}
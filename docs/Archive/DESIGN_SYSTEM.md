# FLOW Design System

Документация по дизайн-системе проекта Flow Calendar.

---

## 📦 Структура

```
Flow-calendar/
├── design-tokens.ts       # Централизованные токены
├── styles.css             # CSS-переменные и глобальные стили
├── utils/
│   └── design-utils.ts    # Утилиты для компонентов
├── components/
│   └── ui/
│       └── index.tsx      # Атомарные UI-компоненты
└── types.ts               # Общие типы
```

---

## 🎨 Цветовая палитра

### Backgrounds

| Токен | Значение | Пример |
|-------|----------|--------|
| `--bg-primary` | `#0a0a0a` | ████ |
| `--bg-secondary` | `#0f0f0f` | ████ |
| `--bg-card` | `#141414` | ████ |
| `--bg-elevated` | `#1a1a1a` | ████ |
| `--bg-glass` | `rgba(20, 20, 20, 0.7)` | ░░░░ |

### Text

| Токен | Значение | Пример |
|-------|----------|--------|
| `--text-primary` | `#ffffff` | ████ |
| `--text-secondary` | `#a0a0a0` | ████ |
| `--text-tertiary` | `#666666` | ████ |
| `--text-muted` | `#444444` | ████ |
| `--text-disabled` | `rgba(255, 255, 255, 0.3)` | ░░░░ |

### Accent Colors

| Токен | Значение | Пример |
|-------|----------|--------|
| `--accent-evening` | `#d4a574` | ████ |
| `--accent-morning` | `#ffffff` | ████ |
| `--accent-night` | `#6b7280` | ████ |
| `--accent-active` | `#10b981` | ████ |

### Task Weights

| Вес | Токен | Цвет | Фон | Бордер |
|-----|-------|------|-----|--------|
| quick | `--weight-quick` | `#34d399` | `rgba(52, 211, 153, 0.1)` | `rgba(52, 211, 153, 0.3)` |
| focused | `--weight-focused` | `#60a5fa` | `rgba(96, 165, 250, 0.1)` | `rgba(96, 165, 250, 0.3)` |
| deep | `--weight-deep` | `#a78bfa` | `rgba(167, 139, 250, 0.1)` | `rgba(167, 139, 250, 0.3)` |

### Priority

| Приоритет | Токен | Цвет |
|-----------|-------|------|
| HIGH | `--priority-high` | `#f87171` |
| MEDIUM | `--priority-medium` | `#fbbf24` |
| LOW | `--priority-low` | `#60a5fa` |

---

## 📏 Spacing System (8px base)

| Токен | Значение |
|-------|----------|
| `--space-xs` | 4px |
| `--space-sm` | 8px |
| `--space-md` | 12px |
| `--space-lg` | 16px |
| `--space-xl` | 20px |
| `--space-2xl` | 24px |
| `--space-3xl` | 32px |
| `--space-4xl` | 40px |
| `--space-5xl` | 48px |
| `--space-6xl` | 64px |

---

## 🔘 Border Radius

| Токен | Значение |
|-------|----------|
| `--radius-none` | 0px |
| `--radius-sm` | 8px |
| `--radius-md` | 12px |
| `--radius-lg` | 16px |
| `--radius-xl` | 20px |
| `--radius-2xl` | 24px |
| `--radius-3xl` | 32px |
| `--radius-4xl` | 40px |
| `--radius-full` | 9999px |

---

## 📝 Типографика

### Шрифт
```css
font-family: 'Poppins', sans-serif;
```

### Размеры

| Токен | Значение |
|-------|----------|
| `--font-size-xs` | 10px |
| `--font-size-sm` | 12px |
| `--font-size-base` | 14px |
| `--font-size-lg` | 16px |
| `--font-size-xl` | 18px |
| `--font-size-2xl` | 20px |
| `--font-size-3xl` | 24px |
| `--font-size-4xl` | 32px |
| `--font-size-5xl` | 40px |

### Насыщенность

| Токен | Значение |
|-------|----------|
| `--font-weight-light` | 300 |
| `--font-weight-normal` | 400 |
| `--font-weight-medium` | 500 |
| `--font-weight-semibold` | 600 |
| `--font-weight-bold` | 700 |
| `--font-weight-black` | 900 |

### Presets

```typescript
// Заголовки
h1 { font-size: 40px; font-weight: 300; line-height: 1.25; }
h2 { font-size: 32px; font-weight: 300; line-height: 1.25; }
h3 { font-size: 24px; font-weight: 300; line-height: 1.375; }
h4 { font-size: 20px; font-weight: 400; line-height: 1.5; }

// Текст
body { font-size: 14px; font-weight: 400; line-height: 1.5; }
caption { font-size: 12px; font-weight: 400; line-height: 1.5; }

// Label (uppercase)
.label { font-size: 10px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }

// Tiny (ultra tracking)
.tiny { font-size: 10px; font-weight: 900; letter-spacing: 0.25em; text-transform: uppercase; }
```

---

## 🎭 Shadows & Glows

### Базовые тени

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

### Flow-specific

```css
--shadow-card: 0 4px 24px 0 rgba(0, 0, 0, 0.3);
--shadow-night-block: -4px -4px 10px 0 rgba(129, 177, 213, 0.30) inset, 4px 4px 15px 0 rgba(160, 123, 78, 0.40);
--glow-evening: 0 0 40px rgba(212, 165, 116, 0.15);
--glow-active: 0 0 30px rgba(16, 185, 129, 0.2);
```

---

## 🎬 Transitions

### Durations

```css
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;
```

### Easing

```css
--easing-default: cubic-bezier(0.4, 0, 0.2, 1);
--easing-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

## 🧩 UI Компоненты

### Button

```tsx
import { Button } from './components/ui';

<Button variant="primary" size="md">
  Click me
</Button>

// Variants: primary | secondary | ghost | danger
// Sizes: sm | md | lg
// Props: isLoading, leftIcon, rightIcon, disabled
```

### Input

```tsx
import { Input } from './components/ui';

<Input
  label="Task Title"
  placeholder="What's next?"
  leftIcon={<Search size={20} />}
  hasGradient={true}
  error="Invalid input"
/>
```

### Card

```tsx
import { Card } from './components/ui';

<Card variant="glass" padding="xl">
  Content here
</Card>

// Variants: default | elevated | glass | dashed
// Padding: xs | sm | md | lg | xl | 2xl | 3xl | 4xl
```

### Badge

```tsx
import { Badge } from './components/ui';

<Badge variant="quick" size="md">Quick</Badge>

// Variants: quick | focused | deep | high | medium | low
// Sizes: sm | md
```

### EmptyState

```tsx
import { EmptyState } from './components/ui';

<EmptyState
  icon={<Check size={32} />}
  title="All clear"
  description="No tasks for this period"
  action={<Button>Add Task</Button>}
/>
```

---

## 🛠 Утилиты

### design-utils.ts

```typescript
import {
  // Colors
  getColorStyles,
  getTextStyles,
  getBgStyles,
  getBorderStyles,
  
  // Spacing
  getSpacingValue,
  getPaddingStyles,
  getMarginStyles,
  getGapStyles,
  
  // Radius
  getRadiusValue,
  getRadiusStyles,
  
  // Shadows
  getShadowStyles,
  getGlowStyles,
  
  // Typography
  getTypographyStyles,
  getFontSizeStyles,
  getFontWeightStyles,
  
  // Transitions
  getTransitionStyles,
  transitionsPresets,
  
  // Icons
  getIconSize,
  getIconStyles,
  getTouchTargetStyles,
  
  // Task-specific
  getTaskWeightStyles,
  getTaskPriorityStyles,
  getPeriodStyles,
  
  // Composite styles
  cardBaseStyles,
  cardHoverStyles,
  glassCardStyles,
  inputBaseStyles,
  buttonBaseStyles,
  buttonPrimaryStyles,
  buttonSecondaryStyles,
} from './utils/design-utils';
```

### Пример использования

```tsx
import { 
  cardBaseStyles, 
  getTextStyles, 
  getSpacingValue,
  transitionsPresets 
} from './utils/design-utils';
import { colors } from './design-tokens';

const MyComponent = () => {
  return (
    <div style={{
      ...cardBaseStyles,
      padding: getSpacingValue('xl'),
      ...transitionsPresets.card,
    }}>
      <h3 style={{
        ...getTextStyles('primary'),
        fontSize: '20px',
      }}>
        Title
      </h3>
    </div>
  );
};
```

---

## ♿ Accessibility

### Touch Targets
- Минимальный размер: **44px**
- Комфортный размер: **48px**

### Focus Visible
```css
:focus-visible {
  outline: 2px solid var(--accent-active);
  outline-offset: 2px;
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Значение |
|------------|----------|
| Mobile | < 640px |
| Tablet | 640px - 1024px |
| Desktop | > 1024px |

---

## 🎯 Best Practices

### ✅ Делайте
- Используйте CSS-переменные для консистентности
- Применяйте утилиты `design-utils.ts` для inline styles
- Следуйте spacing scale (8px base)
- Используйте готовые presets типографики
- Соблюдайте минимальные touch targets (44px)

### ❌ Не делайте
- Не хардкодьте цвета (`#fff` → `var(--text-primary)`)
- Не создавайте новые значения spacing/radius
- Не игнорируйте состояния (hover, focus, disabled)
- Не используйте разные иконки (только Lucide, stroke-width: 1.5)

---

## 🔄 Миграция

### Обновление существующих компонентов

**До:**
```tsx
<div style={{ background: '#0a0a0a', padding: '24px', borderRadius: '24px' }}>
```

**После:**
```tsx
import { colors, spacing, radius } from './design-tokens';

<div style={{ 
  background: colors.bg.primary, 
  padding: spacing['2xl'], 
  borderRadius: radius['2xl'] 
}}>
```

**Или через CSS-классы:**
```tsx
<div className="bg-primary pad-2xl rounded-2xl">
```

---

## 📄 Лицензия

Внутренняя дизайн-система проекта Flow Calendar.

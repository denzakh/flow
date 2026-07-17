
# TimeBlock (Circadian Block)

**Status:** Ready for Dev
**Source:** Figma → `Morning Block vertical` (base), `Night Block` (recovery variant)
**Owner:** Flow Product Team
**Last updated:** 2026-06-04

## Purpose

Универсальный каркас циркадного блока времени. Один компонент для 4 периодов суток.

Внешняя оболочка (Header + Progress Bar + Container) идентична. Меняется только:
- Цветовая схема (по периоду)
- Content Slot (активные периоды vs. Recovery)

**Философия:** Блок — это ментальная комната. Утро/день/вечер — для дел. Ночь — для восстановления. Интерфейс не вызывает тревогу перегрузом.

## Usage

**Использовать:**
- Ячейка сетки 2×2 (Day View)
- Элемент вертикальной галереи (List View)
- Hero-режим (раскрытие ячейки сетки)

**Не использовать:**
- Для одиночных задач вне контекста временных блоков
- Для событий без очков (pts), кроме Recovery-контента

## Anatomy

```
─ Container ───────────────────────────────┐
│  padding: 16px (all sides)                │
│  border-radius: 24px                      │
│  background: var(--flow-block-[period]-container)   │
│  display: flex                            │
│  flex-direction: column                   │
│  align-items: flex-start                  │
│                                           │
│  ─ Header Row 1 ───────────────────────┐ │
│  │ [time range]          [X/Y pts]      │ │
│  ──────────────────────────────────────┘ │
│                                           │
│  ┌─ Header Row 2 ───────────────────────┐ │
│  │ [Period Title]                        │ │
│  └──────────────────────────────────────┘ │
│                                           │
│  ┌─ Progress Bar ───────────────────────┐ │
│  │ ▓▓▓▓▓▓▓▓░░░░░░░░░░                 │ │
│  └──────────────────────────────────────┘ │
│                                           │
│  ┌─ Content Slot (flex: 1) ───────────── │
│  │                                      │ │
│  │  [BUBBLES]  OR  [CARDS]  OR  [TEXT]  │ │
│  │  Morning/Afternoon/Evening  Night    │ │
│  │  (physics)    (vertical)   only      │ │
│  └──────────────────────────────────────┘ │
│                                           │
│  ┌─ Inline Slot (reserved) ─────────────┐ │
│  │ [helper text on overflow]            │ │
│  └──────────────────────────────────────┘ │
└───────────────────────────────────────────┘
```

## Layout & Structure (CSS)

```css
/* Container */
.time-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  border-radius: 24px;
  background-color: var(--flow-block-[period]-container);
  border: 1px solid transparent;
  box-shadow: var(--md-sys-elevation-shadow-1);
  box-sizing: border-box;
  /* Loading fade-in при маунте — однократно, не циклично */
  animation: block-appear var(--md-sys-motion-duration-medium1)
             var(--md-sys-motion-easing-emphasized-decel) both;
}

/* Dark theme override */
.dark .time-block {
  border: 1px solid color-mix(in srgb, var(--flow-block-[period]-on-container) 15%, transparent);
  box-shadow: none;
}

@keyframes block-appear {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .time-block { animation: none; }
}

/* Header Row 1 — Time + Capacity */
.time-block__header-row-1 {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  width: 100%;
}

/* Header Row 2 — Title */
.time-block__header-row-2 {
  width: 100%;
  margin-top: 0;
}

/* Progress Bar Container */
.time-block__progress {
  width: 100%;
  margin-top: 8px;
}

/* Content Slot */
.time-block__content {
  flex: 1;
  width: 100%;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* Inline Slot — зарезервирован всегда, предотвращает layout shift */
.time-block__inline {
  width: 100%;
  min-height: 20px;
  margin-top: 8px;
}
```

**Night overrides:**

```css
/* Night: правый слот в Header Row 1 пустой,
   space-between сохраняется для стабильности layout */
.time-block--night .time-block__capacity {
  visibility: hidden; /* резервирует место, не вызывает layout shift */
}

/* Night: Progress Bar скрыт */
.time-block--night .time-block__progress {
  display: none;
  /* Content Slot margin-top: 12px остаётся — нет лишнего gap */
}

/* Night: Content Slot — центрирование Recovery Text */
.time-block--night .time-block__content {
  justify-content: center;
  align-items: center;
  text-align: center;
}
```

## Content Slot Specification

Content Slot — единственная переменная часть. Режим определяется пропсом `contentMode`.

### Mode A: Bubbles (Физические пузыри)

**Периоды:** Morning, Afternoon, Evening
**Контекст:** Grid Cell (2×2)
**Рендер:** Matter.js SVG-слой, 100% × 100% Content Slot
**Данные:** Каждый пузырь = задача. Размер ∝ task.points
**Layout:** Физическая симуляция (гравитация, коллизии)

**Условия рендера (ALL true):**
- `period !== 'night'`
- `contentMode === 'bubbles'`
- `isRecoveryMode === false`
- `prefers-reduced-motion === false`

Если ANY false: fallback → статичный CSS Flexbox column с миниатюрами задач

### Mode B: Task Cards (Вертикальный стек)

**Периоды:** Morning, Afternoon, Evening
**Контексты:** List Item, Hero Expanded
**Рендер:** CSS Flexbox column, `gap: 8px`, `overflow-y: auto`
**Данные:** Массив `TaskIndicator` + `TaskItem` компонентов
**Layout:** Строгий вертикальный порядок

### Mode C: Recovery Text (Ночной режим)

**Период:** Night only
**Контексты:** Все (Grid, List, Hero)
**Рендер:** Центрированный текстовый блок

**Локализация:**
- EN: `"Wind down space. Rest well."`
- RU: `"Время для восстановления. Отдыхайте хорошо."`
- ES: `"Espacio de descanso. Buenas noches."`

**Layout:** Flex center

**Типографика:** `var(--md-sys-typescale-body-medium-size)` (14px), weight 400, цвет `var(--flow-block-night-on-container)` с opacity 0.6

**Нет:** Progress Bar, Capacity, Inline Slot content, задач

## Progress Bar (Capacity Linear)

**Track (background):**
```css
.time-block__progress-track {
  background-color: var(--flow-block-[period]-seed-on);
  border: 0.2px solid var(--flow-block-[period]-on-container);
  border-radius: var(--md-sys-shape-corner-full);
  height: 4px;
  width: 100%;
}
```

**Indicator (fill):**
```css
.time-block__progress-indicator {
  background-color: var(--flow-block-[period]-seed);
  height: 100%;
  border-radius: var(--md-sys-shape-corner-full);
  transition: width var(--md-sys-motion-duration-medium2)
              var(--md-sys-motion-easing-emphasized);
}
```

**Calculation:** `width = (currentPts / totalPts) × 100%`

**Overflow:** indicator остаётся на 100%, цвет трека и индикатора переключается на `var(--flow-capacity-overload)` (`#FCD34D`).

> ⚠️ Красный цвет (error) для overflow строго запрещён. Amber = забота, не тревога.

**Night:** Progress Bar Container скрыт (`display: none`).

## Typography

Все шрифты — Inter через `var(--md-sys-typescale-*)`. Хардкод размеров запрещён.

| Element | Token | Size | Weight | Letter Spacing | Color |
|---------|-------|------|--------|----------------|-------|
| Period Title | `title-large` | 22px | 500 | **-0.5px** | `var(--flow-block-[period]-on-container)` |
| Time Range | `label-small` | 11px | 500 | 0.5px | `var(--flow-block-[period]-on-container)` |
| Capacity (X/Y pts) | `label-small` | 11px | 500 | 0.5px | `var(--flow-block-[period]-on-container)` |
| Recovery Text | `body-medium` | 14px | 400 | 0.25px | `var(--flow-block-[period]-on-container)` + opacity 0.6 |
| Helper Text (Overflow) | `body-small` | 12px | 400 | 0.4px | `var(--md-sys-color-on-surface-variant)` |

**Примечание:** Time Range и Capacity — `label-small` (11px), не `title-small` (14px). В Figma: `font-size: 11px`, `font-weight: 500`, `line-height: 16px`.

## Spacing (Figma Verified)

- Container padding: `16px` (all sides)
- Header Row 1 → Title: `0px`
- Title → Progress Bar: `8px`
- Progress Bar → Content Slot: `12px`
- Content Slot → Inline Slot: `8px`
- Inline Slot reserved height: `20px` — всегда зарезервирован, предотвращает layout shift

**Критическое правило:** любое изменение состояния не должно вызывать Layout Shift. Высота контейнера зарезервирована.

## Tokens & Colors

**Правило:** все цвета — только через CSS-переменные из `src/theme/tokens.css`. Хардкод hex в компонентах запрещён. Hex ниже — справочные значения.

Dark theme переключается автоматически через `.dark` класс — дополнительных переопределений не требуется.

### Маппинг CSS-переменных:

| Element | CSS-переменная | Light (справка) | Dark (справка) |
|---------|---------------|-----------------|----------------|
| **Container Background** | `var(--flow-block-[period]-container)` | `#FFECE2` / `#D1E4FF` / `#EADDFF` / `#C5C4F0` | `#2A1A10` / `#0A1A30` / `#1A0F2E` / `#0A0A18` |
| **Title Text** | `var(--flow-block-[period]-on-container)` | `#6E390E` / `#194975` / `#4E3D75` / `#505075` | `#FFDCC7` / `#D1E4FF` / `#EADDFF` / `#E1DFFF` |
| **Meta Text** | `var(--flow-block-[period]-on-container)` + opacity 0.7 | тот же | тот же |
| **Progress Fill** | `var(--flow-block-[period]-seed)` | `#8C4F27` / `#36618E` / `#65558F` / `#595992` | `#FFB68C` / `#A0CAFD` / `#CFBDFE` / `#C2C1FF` |
| **Progress Track** | `var(--flow-block-[period]-seed-on)` | `#FFFFFF` / `#FFFFFF` / `#FFFFFF` / `#FFFFFF` | `#532200` / `#003258` / `#36275D` / `#2A2A60` |
| **Progress Border** | `0.2px solid var(--flow-block-[period]-on-container)` | тот же | тот же |
| **Overflow Accent** | `var(--flow-capacity-overload)` | `#FCD34D` | `#FCD34D` |

**Период placeholders:** `[period]` → `morning`, `afternoon`, `evening`, `night`

### Border & Elevation (Light vs Dark)

**Light theme:**
```css
.time-block {
  border: 1px solid transparent;
  box-shadow: var(--md-sys-elevation-shadow-1);
}
```

**Dark theme:**
```css
.dark .time-block {
  border: 1px solid color-mix(in srgb, var(--flow-block-[period]-on-container) 15%, transparent);
  box-shadow: none;
}
```

## States

### 1. Loading (Инициализация)

**Визуал:** Skeleton loaders запрещены. Блок сразу рендерится в цвете `var(--flow-block-[period]-container)`.

**Анимация:** Однократный fade-in при маунте — `opacity: 0 → 1`, `duration-m3-medium-1` (250ms), `ease-m3-decelerate`. Не циклично — соответствует манифесту Flow.

**Reduced motion:** `animation: none` — блок появляется мгновенно.

### 2. Empty (0 pts, Morning/Afternoon/Evening)

**Визуал:** Header + Progress Bar (0%) + Content Slot с семантической иконкой периода.

**Иконка:** из `lucide-react`, period-специфичная, `color: var(--flow-block-[period]-on-container)`, `opacity: var(--md-sys-state-hover-opacity)` (0.08).
- Morning → `Sunrise`
- Afternoon → `Sun`
- Evening → `Sunset`

Иконка не интерактивна (`aria-hidden="true"`), не содержит текста.

**Progress Bar:** indicator width `0%`.

**Night:** не применимо (Recovery Text всегда отображается).

### 3. Normal (0 < currentPts ≤ totalPts)

**Content Slot:** Активен (пузыри или карточки).

**Progress Bar:** Пропорционально заполнен.

### 4. Overflow (currentPts > totalPts)

**Визуал:** Двойной inset border через `box-shadow`:
```css
box-shadow:
  inset 0 0 0 1px var(--flow-capacity-overload),
  inset 0 0 0 3px transparent; /* gap между контурами */
```

**Progress Bar:** 100%, цвет → `var(--flow-capacity-overload)`.

**Inline Slot:** helper text — `"Capacity exceeded"` / `"Блок переполнен"` / `"Capacidad superada"`. Шрифт `body-small`, цвет `var(--md-sys-color-on-surface-variant)`. Место зарезервировано заранее — нет layout shift.

**Matter.js:** `restitution` тел увеличивается `0.3 → 0.8`, пузыри визуально "теснят" друг друга.

> Красный запрещён. Amber = забота, сигнал без тревоги.

### 5. Recovery (Night only)

**Визуал:** Header (Time + Title) + Content Slot с центрированным Recovery Text.

**Progress Bar:** Скрыт (`display: none`).

**Capacity:** Скрыта (`visibility: hidden`).

**Recovery Text:** локализованная строка (см. раздел Content Slot, Mode C).

**Анимация текста:** нет пульсации — соответствует манифесту Flow. Текст статичен.

### 6. Hero Expanded

**Визуал:** Тот же блок, увеличенный до размеров 2×2 grid-контейнера. Header и Progress Bar сохраняют пропорции.

**Content Slot:** Переключается с Matter.js canvas на scrollable список (Morning/Afternoon/Evening) или Recovery Text (Night).

**Animation:** FLIP technique. `duration-m3-medium-2` (300ms), `ease-m3-decelerate` (элемент влетает на экран).

**Overlay:** Остальные блоки затемняются scrim, opacity 32%.

### 7. Drag-over / Drop Target

**Morning/Afternoon/Evening:** M3 State Layer поверх surface — `::after` с `opacity: var(--md-sys-state-hover-opacity)` (0.08). Тень: `elevation-0 → elevation-1`.

**Night:** Drag-over не применим — нет задач для перетаскивания.

### 8. Disabled

**Visual:** `opacity: var(--md-sys-state-disabled-opacity)` (0.38), `pointer-events: none`.

## Interaction

| Контекст | Период | Действие | Результат |
|----------|--------|----------|-----------|
| Grid Cell | Morning/Afternoon/Evening | Tap | Hero Expanded (cards) |
| Grid Cell | Night | Tap | Hero Expanded (recovery text) |
| Grid Cell | Morning/Afternoon/Evening | Long Press (>500ms) | Drag & Drop mode |
| Grid Cell | Night | Long Press | Нет действия (задач нет) |
| List Item | Any | Tap | Нет (уже вертикальный вид) |
| List Item | Morning/Afternoon/Evening | Scroll | Вертикальный скролл задач |
| List Item | Night | Scroll | Не требуется (текст статичен) |
| Hero | Any | Tap scrim / Swipe down | Закрытие, возврат в Grid Cell |

## Matter.js Integration (Content Slot — Mode Bubbles)

**Условия рендера (ALL true):**
- `period !== 'night'`
- `contentMode === 'bubbles'`
- `isRecoveryMode === false`
- `prefers-reduced-motion === false`

Если ANY false: Content Slot рендерит fallback — статичный CSS Flexbox column с миниатюрами задач.

**Canvas sizing:** 100% × 100% Content Slot.

**Cleanup:** `Engine.destroy()` при unmount.

**Performance:** `requestAnimationFrame` паузится при `IntersectionObserver` threshold < 0.1.

**Настройки физики:**
```javascript
// Нормальный режим
restitution: 0.72,
frictionAir: 0.007,
density: 0.00035

// Overflow режим (currentPts > totalPts)
restitution: 0.8  // пузыри теснят друг друга
```

## Accessibility

**Role:** `region`

**Label (Morning/Afternoon/Evening):** `"[Period] Block, [time range], [currentPts] of [totalPts] points"`
- RU: `"Блок [период], [диапазон времени], [X] из [Y] очков"`
- ES: `"Bloque [período], [rango de tiempo], [X] de [Y] puntos"`

**Label (Night):** `"Night Block, [time range], recovery period. No tasks scheduled."`
- RU: `"Ночной блок, [диапазон времени], время восстановления. Задач нет."`

**Hero transition:** `aria-expanded="true"` при раскрытии

**Focus:** `2px outline`, offset `2px`, цвет `var(--md-sys-color-primary)`

**Empty state иконка:** `aria-hidden="true"` — декоративная, не объявляется скринридером

**Reduced motion:** все анимации уважают `prefers-reduced-motion`. Night recovery text — без анимации всегда.

## Responsive Behavior

| Контекст | Width | Height | Content Mode (Active) | Content Mode (Night) |
|----------|-------|--------|----------------------|---------------------|
| Grid Cell (mobile) | `calc(50% - 8px)`, min 160px | 253px (Figma verified) | bubbles | recovery |
| Grid Cell (tablet) | ~50% | см. Open Questions | bubbles | recovery |
| List Item | 100%, max 400px | auto, min 253px | cards | recovery |
| Hero Expanded | = 2×2 grid area | auto | cards | recovery |

## Props Interface

```typescript
import { TimePeriod, Task } from '@/types'; // Импорт из существующих типов Flow

type ContentMode = 'bubbles' | 'cards' | 'recovery';
type PlacementContext = 'grid-cell' | 'list-item' | 'hero';

interface TimeBlockProps {
  period: TimePeriod;                      // из @/types — не переопределять
  timeRange: { start: string; end: string };
  totalPts: number;                        // default: 12. Ignored when period === 'night'.
  currentPts: number;                      // сумма pts задач. 0 для Night.
  tasks: Task[];                           // пустой массив для Night.

  // Placement context — определяет contentMode по умолчанию
  placement: PlacementContext;

  // Content mode (auto-derived из period + placement, но overridable)
  contentMode?: ContentMode;

  // Recovery text (Night only) — локализованная строка
  recoveryText?: string;                   // default: "Wind down space. Rest well."

  // States
  isRecoveryMode?: boolean;               // глобальный recovery (отключает физику)
  isExpanded?: boolean;                   // true в Hero режиме

  // Callbacks
  onExpand?: () => void;
  onClose?: () => void;
  onTaskDrop?: (taskId: string, period: TimePeriod) => void; // ignored when period === 'night'
}
```

**Auto-derive логика contentMode:**
```typescript
function deriveContentMode(period: TimePeriod, placement: PlacementContext): ContentMode {
  if (period === 'night') return 'recovery';
  if (placement === 'grid-cell') return 'bubbles';
  return 'cards'; // list-item, hero
}
```

## Mapping to Code

**Компонент:** `src/components/blocks/TimeBlock.tsx` (универсальный).

**Внутренние части:**
- `TimeBlockHeader` — статичный, всегда рендерится. Скрывает Capacity для Night через `visibility: hidden`.
- `TimeBlockProgress` — статичный. `display: none` для Night.
- `TimeBlockContent` — switch по `contentMode`:
  - `'bubbles'` → `MatterCanvas` (lazy-loaded)
  - `'cards'` → `TaskCardList` (scrollable flex column)
  - `'recovery'` → `RecoveryContent` (centered text)

**Color resolution в компоненте:**
```typescript
// CSS-переменная резолвится через period prop
// Пример: period="morning" → var(--flow-block-morning-container)
const surfaceVar = `var(--flow-block-${period}-container)`;
const onColorVar = `var(--flow-block-${period}-on-container)`;
```

**Hero-анимация:**
FLIP technique или CSS `transform` + `position: fixed`
Блок стартует с координат Grid Cell, анимируется до 2×2 grid bounding box
`duration-m3-medium-2` (300ms), `ease-m3-decelerate`

**Hard constraints:**
- Нет hex в компоненте — только CSS-переменные
- Нет skeleton loaders
- `min-height: 253px` всегда
- Inline Slot `min-height: 20px` зарезервирован всегда
- Night никогда не рендерит Matter.js
- `TimePeriod` — импорт из `@/types`, не переопределять локально

## Open Questions

1. **Grid Cell tablet height:** `280px` — источник не верифицирован из Figma. Подтвердить или зафиксировать как `253px` для всех размеров экранов.

2. **Night Hero Expanded:** Есть ли смысл раскрывать Night block в Hero если там только Recovery Text? Возможные варианты: (a) Hero для Night отключить, (b) добавить в Night Hero дополнительный контент (статистика дня, summary).

3. **Empty state иконка — анимация:** Нужна ли иконке лёгкая CSS-анимация при появлении (fade-in вместе с блоком) или она должна быть статичной?

4. **Overflow двойной border — gap:** Расстояние между двумя контурами `box-shadow` не зафиксировано. Рекомендация: 2px gap (`inset 0 0 0 1px`, `inset 0 0 0 3px transparent`).

5. **Recovery Text анимация (Night):** Финально решено — без пульсации, текст статичен. Если в будущем понадобится анимация: только однократный fade-in, не цикличная пульсация.

6. **`onTaskDrop` для Night:** Проп передаётся но игнорируется. Рассмотреть: убрать из interface и обрабатывать на уровне родителя.

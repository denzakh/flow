# Task Indicator

## Status
- **Ready for Dev**
- Source: Figma → Flow Design System
- Owner: [TBD]
- Last updated: 2026-06-04

## Purpose
Визуальный индикатор задачи в Day View (сетка 2×2), который одновременно отображает два ключевых параметра:
- **Вес задачи** (weight) — влияет на размер компонента и цветовую схему
- **Приоритет задачи** (priority) — влияет на форму компонента

Компонент используется как физический пузырь в Matter.js-слое блоков времени. Пользователь считывает вес и приоритет визуально, без текста задачи — текст в сетке 2×2 недоступен.

> **Три независимых визуальных канала:** размер + цвет + форма. Ни один параметр не передаётся цветом в одиночку. ✅ WCAG 1.4.1

## Usage

### Когда использовать:
- В Day View (Matter.js physics layer) — основной контекст
- В списке задач после tap на блок (в виде weight-dot)
- В WeekView / MonthView как индикатор плотности задач
- Везде, где нужно быстро считать вес + приоритет без чтения текста

### Когда НЕ использовать:
- Для простых чекбоксов или todo-списков (используйте `TaskItem`)
- Когда нужно показать только один параметр (используйте `Badge`)
- В плотных таблицах, где важна компактность
- В Night block — он только для отдыха, задачи не добавляются

### Альтернативы:
- **Badge** — для показа только веса без приоритета
- **weight-dot** — минималистичная точка в `TaskItem` строках
- **Checkbox** — для режима списка задач (после tap на блок)

---

## Variants

### По весу задачи (Weight):

> Все цвета берутся из `src/theme/tokens.css`. Хардкод hex в компонентах запрещён.

#### Quick Task (Быстрая задача)
- **Размер:** 60×60px (`--task-size-quick: 60px`)
- **Цветовая схема:**
  - Fill: `var(--flow-weight-quick-color)` → Light: `#A8F2C8` / Dark: `#90D5AE`
  - Icon: `var(--flow-weight-quick-on-color)` → Light: `#005234` / Dark: `#003823`
  - Stroke: нет (форма определяет границу)
- **Когда применять:** Задачи весом 1pt (Quick=1pt), < 15 минут, микро-задачи
- **Семантика:** Лёгкость, скорость, низкая когнитивная нагрузка
- **Matter.js:** `r: 14`, `restitution: 0.72`, `frictionAir: 0.007`

#### Focused Task (Фокусная задача)
- **Размер:** 90×90px (`--task-size-focused: 90px`)
- **Цветовая схема:**
  - Fill: `var(--flow-weight-focused-color)` → Light: `#FFDEA3` / Dark: `#ECC06C`
  - Icon: `var(--flow-weight-focused-on-color)` → Light: `#5D4200` / Dark: `#412D00`
  - Stroke: нет
- **Когда применять:** Задачи весом 3pt (Focused=3pt), требующие фокуса, 15–60 минут
- **Семантика:** Внимание, концентрация, умеренная сложность
- **Matter.js:** `r: 21`

#### Deep Task (Глубокая задача)
- **Размер:** 114×114px (`--task-size-deep: 114px`)
- **Цветовая схема:**
  - Fill: `var(--flow-weight-deep-color)` → Light: `#EADDFF` / Dark: `#B388FF`
  - Icon: `var(--flow-weight-deep-on-color)` → Light: `#4E3D75` / Dark: `#37265C`
  - Stroke: нет
  - Backdrop blur: `var(--task-deep-blur)` → `blur(2px)` в CSS
- **Когда применять:** Задачи весом 6pt (Deep=6pt), deep work, > 60 минут
- **Семантика:** Глубина, сложность, максимальные когнитивные усилия
- **Matter.js:** `r: 30`

---

### По приоритету (Priority):

> Форма кодирует только приоритет, цвет кодирует только вес. Эти каналы не пересекаются.

#### Low (Низкий)
- **Форма:** Круг (circle)
- **SVG:** Простой круг с равными радиусами
- **Matter.js:** `Bodies.circle()` — плавно катится и оседает
- **Семантика:** Спокойная геометрия, задачу можно отложить

#### Medium (Средний)
- **Форма:** Squircle (мягкий квадрат)
- **SVG:** Квадрат со скруглёнными углами — `border-radius` в духе M3 (`--md-sys-shape-corner-large: 16px` или органичнее через SVG path)
- **Matter.js:** `Bodies.fromVertices()` — оседает на грань
- **Семантика:** Структурированность, умеренная срочность

#### High (Высокий)
- **Форма:** 12-sided cookie (12-гранная форма с мягкими вогнутыми краями)
- **SVG:** Органический замкнутый path без острых углов, 12 граней
- **Важно:** Острые углы запрещены — они противоречат философии Flow и M3 Expressive
- **Matter.js:** `Bodies.fromVertices()` — непредсказуемо отпрыгивает, физически передаёт срочность
- **Семантика:** Динамичность, требует внимания, сложно игнорировать

---

## States

### Enabled (Default)
- **Визуал:** Fill и icon — полная непрозрачность, форма по priority
- **Deep Task:** `backdrop-filter: var(--task-deep-blur)` активен
- **Что НЕ меняется:** Размер, форма
- **Допустимые переходы:** → Hovered, → Focused, → Pressed, → Disabled

### Hovered
- **Визуал:**
  - Fill: осветляется на 5–8% через `color-mix(in srgb, var(--flow-weight-*-color), white 8%)`
  - State layer: `::after` с `opacity: var(--md-sys-state-hover-opacity)` (0.08) поверх fill
  - Cursor: `pointer`
  - Elevation: опционально `var(--md-sys-elevation-shadow-1)`
- **Что НЕ меняется:** Размер, форма
- **Допустимые переходы:** → Enabled, → Pressed, → Focused

### Focused
- **Визуал:**
  - Focus ring: `2px solid`, offset `2px`, цвет `var(--md-sys-color-primary)`
  - Видим только при клавиатурной навигации (`useFocusRing` из React Aria)
  - Всё остальное как в Enabled
- **Что НЕ меняется:** Внутреннее содержимое
- **Допустимые переходы:** → Enabled, → Pressed

### Pressed
- **Визуал:**
  - State layer opacity: `var(--md-sys-state-pressed-opacity)` (0.12)
  - Scale: `0.96` (`transform: scale(0.96)`)
  - Transition: `var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`
  - Elevation убирается если была
- **Что НЕ меняется:** Форма
- **Допустимые переходы:** → Hovered, → Enabled

### Disabled
- **Визуал:**
  - `opacity: var(--md-sys-state-disabled-opacity)` (0.38) — для всего компонента
  - `backdrop-filter` для Deep: отключён
  - `cursor: not-allowed`
- **Что НЕ меняется:** Размер, форма
- **Interaction:** Не реагирует на клики, hover, focus
- **Допустимые переходы:** → Enabled (при изменении данных задачи)

---

## Anatomy

### Составные части:

1. **Container (Контейнер)**
   - Определяет общий размер компонента
   - Размеры: `60×60px` / `90×90px` / `114×114px`
   - `position: relative`
   - `overflow: clip`
   - Реализует `md-state-layer` (из `tokens.css`) для state overlays

2. **Shape Path (SVG путь формы)**
   - Inset: ~7.89% от размера контейнера
   - Fill: `var(--flow-weight-{weight}-color)`
   - Stroke: нет (форма — граница)
   - Форма определяется priority (low/medium/high)
   - Deep Task: `backdrop-filter: var(--task-deep-blur)` + `clip-path`

3. **Icon Container (Контейнер иконки)**
   - Size: `24×24px` (фиксированный)
   - `position: absolute`, центрирован (`translate -50%/-50%`)

4. **Icon (Иконка задачи)**
   - **User-selectable** — пользователь выбирает иконку из `lucide-react`
   - Иконка по умолчанию: `Circle` (нейтральный fallback)
   - Stroke: `var(--flow-weight-{weight}-on-color)`
   - `strokeWidth: 2px`, `strokeLinecap: round`, `strokeLinejoin: round`
   - Назначение: дополнительная визуальная индикация в сетке 2×2, где текст задачи недоступен
   - Импорт строго из `lucide-react` — альтернативные иконочные системы запрещены

### Визуальная схема:
```
┌─────────────────────────┐
│   Container             │
│  ┌───────────────────┐  │
│  │  Shape Path (SVG) │  │
│  │                   │  │
│  │      ┌───┐        │  │
│  │      │ ✦ │        │  │ ← Icon из lucide-react (24×24)
│  │      └───┘        │  │   цвет: --flow-weight-{w}-on-color
│  │                   │  │
│  └───────────────────┘  │
└─────────────────────────┘
     ↑ state layer ::after
```

---

## Layout rules

### Иерархия контейнеров (по ui-layout-flow.md):
- **Physical Layer (Matter.js)** — основной контекст внутри `Section Container` (блок времени)
- **Inline Slot** — при использовании как weight-dot в `TaskItem` строке

### Размеры:
- **Минимальные:** 60×60px (Quick Task) — соответствует touch target 44×44px ✅
- **Максимальные:** 114×114px (Deep Task)
- **Фиксированные:** Три строго фиксированных размера, масштабирование запрещено

### Spacing:
- **Internal:** Shape inset `~7.89%`, icon всегда центрирован
- **External в Matter.js:** Физический движок управляет позицией
- **External в списках:** `gap: var(--spacing-md)` (12px) / `gap: var(--spacing-lg)` (16px)

### Поведение при нехватке места:
- Компонент не сжимается
- В grid/flex — переносится на новую строку
- Если места совсем нет — скрыть полностью (`visibility: hidden`), не обрезать
- Компактный режим на очень маленьких экранах (<360px): Quick→48px, Focused→72px, Deep→96px

---

## Tokens

### Color tokens (ссылки на tokens.css — не переопределять!):

```css
/* Quick Task */
--flow-weight-quick-color       /* Fill пузыря */
--flow-weight-quick-on-color    /* Иконка внутри */

/* Focused Task */
--flow-weight-focused-color
--flow-weight-focused-on-color

/* Deep Task */
--flow-weight-deep-color
--flow-weight-deep-on-color
```

> Токены автоматически переключаются между light и dark через `.dark` класс в `tokens.css`.
> Дополнительных переопределений не требуется.

### Sizing tokens (добавить в tokens.css или design-tokens.ts):

```css
--task-size-quick: 60px;
--task-size-focused: 90px;
--task-size-deep: 114px;
--task-icon-size: 24px;
--task-shape-inset: 7.89%;
```

### Stroke tokens:
```css
--task-stroke-width: 2px;
/* hover stroke убран — используется state layer opacity из M3 */
```

### Effect tokens:
```css
--task-deep-blur: blur(2px);   /* backdrop-filter для Deep Task */
```

### Motion tokens (из tokens.css — не дублировать):
```css
/* Transition duration */
var(--md-sys-motion-duration-short2)   /* 100ms — иконки, ripple */
var(--md-sys-motion-duration-short4)   /* 200ms — смена состояний, hover */

/* Easing */
var(--md-sys-motion-easing-standard)   /* cubic-bezier(0.2, 0, 0, 1) */
```

### State layer tokens (из tokens.css):
```css
var(--md-sys-state-hover-opacity)     /* 0.08 */
var(--md-sys-state-pressed-opacity)   /* 0.12 */
var(--md-sys-state-disabled-opacity)  /* 0.38 */
```

### Tailwind class mapping:
```
size-[60px] / size-[90px] / size-[114px]
relative  absolute inset-0
absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
transition-[opacity,transform] duration-m3-short-2 ease-md-standard
```

---

## Interaction

### Click / Tap behavior:
- **Action:** Открывает детали задачи (TaskSheet / bottom sheet)
- **Feedback:** Pressed state → Release → Action
- **Timing:** `onPress` (React Aria) срабатывает при release, не при press
- **В Matter.js:** клик останавливает физику блока, запускает transition пузыри→список

### Keyboard behavior:
- **Tab:** Включён в естественный tab order
- **Enter / Space:** Активация через `onPress` (React Aria `useButton`)
- **Arrow keys:** Навигация между задачами в списке (опционально)
- **Escape:** Снять фокус

### Focus behavior:
- **Focus ring:** `2px solid var(--md-sys-color-primary)`, offset `2px`
- **Visible:** Только при клавиатурной навигации (`useFocusRing`)
- **Programmatic focus:** Поддерживается через `ref`

### Disabled behavior:
- **No interaction:** Не реагирует на hover, click, focus, keyboard
- **Cursor:** `cursor: not-allowed`
- **Visual:** `opacity: var(--md-sys-state-disabled-opacity)` (0.38)

### Recovery Mode / Reduced Motion:
- **prefers-reduced-motion:** `transform: none`, все transitions → `0ms` (автоматически через `tokens.css`)
- **Recovery Mode:** Matter.js физика отключается, пузыри переходят в статичную сетку с `fade-in`
- Оба режима не изменяют форму и цвет компонента

---

## Accessibility

### ARIA Role:
- `role="button"` если кликабельно (открывает детали)
- `role="img"` если только индикатор без действия
- Если часть более крупного компонента задачи с доступным текстом: `aria-hidden="true"`

### ARIA Label:
```html
aria-label="Deep task, high priority"
<!-- RU: "Глубокая задача, высокий приоритет" -->
<!-- ES: "Tarea profunda, prioridad alta" -->
```
- Flow поддерживает EN / RU / ES — локализовать aria-label
- Если иконка задачи семантична: включить в label ("Deep task, Laptop icon, high priority")

### Focus ring:
- Толщина: `2px`
- Цвет: `var(--md-sys-color-primary)` — единый для всех вариантов (не цвет веса)
- Контраст с фоном: минимум 3:1 ✅
- Offset: `2px`

### Hit target:
- Минимум WCAG: 44×44px
- Quick Task: 60×60px ✅
- Focused Task: 90×90px ✅
- Deep Task: 114×114px ✅

### Contrast:

#### Quick Task:
- Icon `var(--flow-weight-quick-on-color)` на Fill `var(--flow-weight-quick-color)`
- Light: `#005234` на `#A8F2C8` — **~7.2:1** ✅ AAA

#### Focused Task:
- Light: `#5D4200` на `#FFDEA3` — **~4.8:1** ✅ AA

#### Deep Task:
- Light: `#4E3D75` на `#EADDFF` — **~4.6:1** ✅ AA (на границе, проверить после реализации)
- Dark: `#37265C` на `#B388FF` — проверить при реализации dark theme
- ⚠️ Если контраст < 4.5:1 в каком-либо режиме — затемнить `--flow-weight-deep-on-color`

### Screen reader:
```html
<div role="button"
     aria-label="Deep task, high priority"
     tabindex="0"
     data-task-weight="deep"
     data-task-priority="high">
  <!-- visual content -->
</div>
```

### Reduced motion:
```css
/* tokens.css уже содержит: */
@media (prefers-reduced-motion: reduce) {
  :root {
    --md-sys-motion-duration-short2: 0ms;
    --md-sys-motion-duration-short4: 0ms;
    /* ... все durations → 0ms */
  }
}
/* Дополнительно в компоненте: */
@media (prefers-reduced-motion: reduce) {
  .task-indicator {
    transform: none !important;
  }
}
```

---

## States by variant

### Quick Task (60px):
- **Enabled:** `var(--flow-weight-quick-color)` fill, круг/squircle/cookie по priority
- **Hovered:** state layer 0.08 opacity поверх fill
- **Focused:** focus ring `var(--md-sys-color-primary)` 2px offset 2px
- **Pressed:** state layer 0.12 + scale 0.96
- **Disabled:** весь компонент opacity 0.38

### Focused Task (90px):
- **Enabled:** `var(--flow-weight-focused-color)` fill
- **Hovered:** state layer 0.08
- **Focused:** focus ring `var(--md-sys-color-primary)` 2px offset 2px
- **Pressed:** state layer 0.12 + scale 0.96
- **Disabled:** opacity 0.38

### Deep Task (114px):
- **Enabled:** `var(--flow-weight-deep-color)` fill, `backdrop-filter: var(--task-deep-blur)` активен
- **Hovered:** state layer 0.08, blur усиливается до 3px опционально
- **Focused:** focus ring `var(--md-sys-color-primary)` 2px offset 2px, blur активен
- **Pressed:** state layer 0.12 + scale 0.96, blur сохраняется
- **Disabled:** opacity 0.38, **blur отключён**

---

## Content rules

### Иконка задачи:
- **User-selectable** из `lucide-react` — пользователь выбирает при создании задачи
- **Fallback по умолчанию:** нейтральный символ (например `Circle` или `Dot` из lucide)
- Иконка — обязательная часть компонента (обеспечивает дополнительный визуальный якорь в безтекстовой сетке 2×2)
- Размер: всегда `24×24px`, не масштабируется с пузырём
- Запрещено: использовать иконочные системы кроме `lucide-react`

### Текст:
- Компонент не содержит текста задачи
- Если нужен label рядом — он в отдельном элементе (не внутри индикатора)
- `aria-label` локализован (EN / RU / ES)

---

## Edge cases

### Empty state:
- Не применимо — компонент не рендерится если задача отсутствует

### Loading state:
- **Рекомендация:** Skeleton-круг (Low priority форма), цвет `var(--md-sys-color-surface-container-highest)`
- Shimmer-анимация поверх skeleton опционально
- Отключается при `prefers-reduced-motion`

### Error state:
- Fill: `var(--md-sys-color-error-container)`
- Icon: `var(--md-sys-color-on-error-container)`, иконка → `AlertCircle` из lucide
- Клик → retry или отображение error message

### Overflow:
- SVG paths масштабируются внутри viewBox, не выходят за container
- `overflow: clip` на контейнере
- Если иконка не загрузилась: fallback на первую букву веса (`Q` / `F` / `D`)

### Localization:
- Визуальный компонент — локализация не требуется
- `aria-label` локализован (EN / RU / ES): `"Quick task, low priority"` / `"Быстрая задача, низкий приоритет"` / `"Tarea rápida, prioridad baja"`

### RTL / Left-handed mode:
- Компонент симметричный — зеркалирование не требуется
- В layout с `isLeftHanded: true`: позиционирование компонента корректируется снаружи (FAB, контекстные меню), сам индикатор не меняется

### Responsive:
- Размеры фиксированные
- На экранах <360px: Quick→48px, Focused→72px, Deep→96px
- Изменение через переопределение `--task-size-*` токенов на уровне breakpoint

---

## Mapping to code

### Подход к реализации:
**Custom React component** — прямых аналогов в UI-библиотеках нет.

- **Интерактивность:** `useButton` из `react-aria` — обязательно (правило из `ui-react-aria-flow.md`)
- **Фокус:** `useFocusRing` из `react-aria` — для keyboard-only focus ring
- **Не использовать:** MUI Badge/Chip, произвольные нативные обработчики без контекста доступности

### File structure (в соответствии с архитектурой Flow):
```
src/components/ui/
  TaskIndicator/
    index.tsx           — единый компонент с props weight/priority
    shapes.ts           — SVG paths + Matter.js vertex arrays (low/medium/high)
    types.ts            — TypeScript types
    TaskIndicator.test.tsx
```

> Отдельные файлы `QuickTask.tsx`, `FocusedTask.tsx`, `DeepTask.tsx` не нужны —
> варианты реализуются через props, не через отдельные компоненты.

### Props:

```typescript
import { TaskWeight, Priority } from '@/types';

type TaskIndicatorProps = {
  // Вес задачи (определяет размер и цвет)
  weight: TaskWeight; // 'quick' | 'focused' | 'deep'

  // Приоритет (определяет форму)
  priority: Priority; // 'low' | 'medium' | 'high'

  // Иконка из lucide-react (user-selectable, обязательна)
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>;

  // Опциональные
  disabled?: boolean;
  onPress?: () => void;        // React Aria onPress, не onClick
  ariaLabel?: string;
  className?: string;
}
```

### Events (React Aria паттерн):

```typescript
// Через useButton из react-aria:
onPress?: (e: PressEvent) => void;   // основной обработчик (Enter/Space/Click)
onFocus?: (e: FocusEvent) => void;
onBlur?: (e: FocusEvent) => void;
// onKeyDown не нужен — useButton обрабатывает Enter/Space автоматически
```

### Data attributes:

```html
data-task-weight="quick" | "focused" | "deep"
data-task-priority="low" | "medium" | "high"
data-disabled="true" | "false"
data-testid="task-indicator"
```

### Usage example:

```tsx
import { TaskIndicator } from '@/components/ui/TaskIndicator';
import { Zap, Brain, Coffee } from 'lucide-react';

// Quick задача, высокий приоритет, иконка пользователя
<TaskIndicator weight="quick" priority="high" icon={Zap} />

// Deep задача с обработчиком
<TaskIndicator
  weight="deep"
  priority="medium"
  icon={Brain}
  onPress={() => openTaskDetails(taskId)}
  ariaLabel="Deep work task, medium priority"
/>

// Disabled
<TaskIndicator weight="focused" priority="low" icon={Coffee} disabled />
```

---

## Figma references

- **Main component:** [TBD — добавить ссылку на Figma]
- **SVG assets:**
  - `/imports/QuickTask/svg-0n0tlnyby1.ts`
  - `/imports/FocusedTask/svg-a68ij1ynpz.ts`
  - `/imports/DeepTask/svg-x61pn1bfn5.ts`
- **Related docs:**
  - `src/theme/tokens.css` — все цветовые токены Flow
  - `docs/CURRENT/ui-rules.md` — правила компонентов
  - `CLAUDE.md` → секции "Shape System" и "New UI Concept"

---

## Open questions

1. **Иконка по умолчанию:**
   - Какая lucide-иконка используется если пользователь не выбрал? `Circle`, `Dot`, или разная для каждого веса?

2. **Контраст Deep Task dark:**
   - Проверить `#37265C` на `#B388FF` в dark theme — нужно ≥ 4.5:1

3. **Interaction model в Matter.js:**
   - При клике на пузырь в физическом слое — tap останавливает физику всего блока или только этого пузыря?
   - Нужна ли анимация морфинга при изменении priority (форма меняется)?

4. **Compact mode breakpoint:**
   - Подтвердить брейкпоинт <360px для уменьшенных размеров

5. **Focus ring в Matter.js-слое:**
   - Как реализовать focus ring на SVG-пузыре внутри Canvas/SVG Matter.js-рендера?
   - Возможно, нужен отдельный DOM-слой поверх физического для accessibility

6. **Drag & drop:**
   - Нужна ли поддержка drag для перемещения задачи между блоками в Day View?
   - Если да — Matter.js constraint или нативный pointer event?

7. **Tooltip:**
   - Показывать ли название задачи в tooltip при hover (единственный способ увидеть текст в сетке 2×2)?
   - Delay: 500ms, реализация через React Aria `useTooltip`

---

## Примечания для разработчиков

### Текущая реализация (из Figma):
- ✅ Три варианта: QuickTask, FocusedTask, DeepTask
- ✅ SVG paths для форм (low/medium/high)
- ✅ Цветовые схемы
- ✅ Размеры фиксированы
- ✅ Backdrop blur для DeepTask

### Требуется добавить:
- ⚠️ Заменить хардкод hex → CSS-переменные `--flow-weight-*`
- ⚠️ Добавить dark theme поддержку (автоматически через токены)
- ⚠️ Состояния: hover, focus, pressed, disabled через M3 state layer
- ⚠️ `useButton` + `useFocusRing` из `react-aria`
- ⚠️ ARIA атрибуты + локализованный aria-label (EN/RU/ES)
- ⚠️ Рефакторинг в единый `TaskIndicator` с props `weight`/`priority`/`icon`
- ⚠️ Переименование `property1` → `priority`
- ⚠️ Проверка контраста Deep Task в dark theme

### Рефакторинг API:

```tsx
// До (текущая реализация из Figma):
<QuickTask property1="high" />
<FocusedTask property1="medium" />
<DeepTask property1="low" />

// После (Flow-совместимый API):
<TaskIndicator weight="quick" priority="high" icon={Zap} />
<TaskIndicator weight="focused" priority="medium" icon={Brain} />
<TaskIndicator weight="deep" priority="low" icon={Coffee} />
```
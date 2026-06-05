# TaskSheet (FocusPoint Bottom Sheet)

**Status:** Ready for Dev
**Source:** Flow Product Design + M3 Expressive Guidelines
**Owner:** Flow Product Team
**Last updated:** 2026-06-04

---

## Purpose

Bottom Sheet для ручного ввода задач во Flow. Открывается поверх Day View (сетка 2×2), сохраняя визуальную связь с основным экраном. Пользователь видит контекст — в какой блок попадёт задача — пока вводит её параметры.

**Философия:** Ввод задачи должен быть быстрым и малотревожным. Система делает умные выборы по умолчанию (период, вес), пользователь только корректирует если нужно.

---

## Usage

**Открывается:**
- Tap на FAB `+` в Day View
- Голосовая команда → неполные данные → confirmation bottom sheet
- Long press на пустую зону TimeBlock (опционально)

**Закрывается:**
- Свайп вниз за drag handle
- Tap на scrim (затемнённая область за sheet)
- Tap "Отмена" (текстовая кнопка)
- После успешного добавления задачи → автозакрытие

**Не использовать:**
- Для редактирования существующей задачи (отдельный компонент)
- Для Night block (задачи в Night не добавляются)
- Вместо полноэкранного Settings (у него своя модалка)

---

## Anatomy

```
┌─────────────────────────────────────────────┐
│              ████  drag handle              │  ← 32×4px, on-surface-variant 40%
│                                             │
│  Новая задача                               │  ← Title (Title Large)
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ 🔮  Название задачи...        🔄   │    │  ← TextField
│  └─────────────────────────────────────┘    │
│  Supporting text / ошибка                   │  ← зарезервировано всегда
│                                             │
│  ВЕС                                        │  ← Section label (Label M)
│  ┌──────────┬──────────┬──────────┐         │
│  │  Quick   │ Focused  │   Deep   │         │  ← Segmented Buttons
│  └──────────┴──────────┴──────────┘         │
│                                             │
│  ПРИОРИТЕТ                                  │  ← Section label (Label M)
│  ┌──────────┬──────────┬──────────┐         │
│  │  ○ Low   │  ◇ Med   │  ✦ High  │         │  ← Segmented Buttons
│  └──────────┴──────────┴──────────┘         │
│                                             │
│  ПЕРИОД                                     │  ← Section label (Label M)
│  ┌──────────┬──────────┬──────────┐         │
│  │ Morning* │Afternoon │ Evening  │         │  ← Segmented Buttons (* = auto)
│  └──────────┴──────────┴──────────┘         │
│  сейчас активен                             │  ← Label S, on-surface-variant
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │         + Добавить задачу            │   │  ← Filled Button (full width)
│  └──────────────────────────────────────┘   │
│  [Отмена]                                   │  ← Text Button, centered
└─────────────────────────────────────────────┘
```

---

## Container

```css
.task-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--md-sys-color-surface-container-low);
  border-radius: var(--md-sys-shape-corner-extra-large) /* 28px */
               var(--md-sys-shape-corner-extra-large)
               0 0;
  padding: 0 16px 32px; /* bottom: safe area + 16px */
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 90dvh;
  overflow-y: auto;
  z-index: 300;

  /* Появление */
  animation: sheet-enter var(--md-sys-motion-duration-medium2)
             var(--md-sys-motion-easing-emphasized-decel) both;
}

@keyframes sheet-enter {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}

/* Закрытие */
.task-sheet[data-closing="true"] {
  animation: sheet-exit var(--md-sys-motion-duration-medium1)
             var(--md-sys-motion-easing-emphasized-accel) both;
}

@keyframes sheet-exit {
  from { transform: translateY(0); }
  to   { transform: translateY(100%); }
}

@media (prefers-reduced-motion: reduce) {
  .task-sheet { animation: none; }
}

/* Scrim */
.task-sheet-scrim {
  position: fixed;
  inset: 0;
  background: var(--md-sys-color-scrim);
  opacity: 0.32;
  z-index: 299;
}
```

**Spring-анимации запрещены** — манифест Flow. Только `ease-m3-decelerate` / `ease-m3-accelerate`.

---

## Drag Handle

M3 стандарт:
```css
.task-sheet__handle {
  width: 32px;
  height: 4px;
  border-radius: var(--md-sys-shape-corner-full);
  background: var(--md-sys-color-on-surface-variant);
  opacity: 0.4;
  margin: 22px auto 0;
  flex-shrink: 0;
}
```

Свайп вниз → закрытие (через pointer events на контейнере). Touch target для handle: `44×44px` невидимой зоны вокруг.

---

## TextField (Название + LeadingIcon + TrailingIcon)

### Структура:
```
┌────────────────────────────────────────┐
│ [leadingIcon]  Placeholder...  [🔄]   │
└────────────────────────────────────────┘
  Supporting text / validation error
```

### LeadingIcon — автоиконка задачи:
- Источник: `lucide-react`, подбирается автоматически по тексту названия
- **Алгоритм (rule-based MVP):** словарь ключевых слов → иконка:

```typescript
// src/services/iconSuggester.ts
const ICON_MAP: Record<string, LucideIcon> = {
  // Работа
  'встреч|созвон|митинг|call|meeting': Users,
  'код|код|program|разработ|dev|fix|баг': Code,
  'письм|email|почт|mail': Mail,
  'отчёт|report|доклад': FileText,
  'план|plan|стратег': Target,
  // Здоровье
  'трен|спорт|бег|gym|workout|йога': Dumbbell,
  'еда|обед|ужин|завтрак|food|lunch': UtensilsCrossed,
  'сон|спать|отдых|rest|sleep': Moon,
  'таблетк|лекарств|медицин': Pill,
  // Быт
  'купить|магазин|shop|покупк': ShoppingCart,
  'убор|чист|уборк|clean': Sparkles,
  'звонок|позвонить|phone|call': Phone,
  // Учёба
  'читать|книг|read|book': BookOpen,
  'учить|учёба|study|курс': GraduationCap,
  'писать|текст|write|статья': PenLine,
};

// Fallback по умолчанию
const DEFAULT_ICON = Circle;

export function suggestIcon(title: string): LucideIcon { ... }
```

- Иконка обновляется с debounce 300ms по мере ввода текста
- Переключение без анимации — просто swap
- Цвет: `var(--md-sys-color-on-surface-variant)`
- Редактирование иконки вручную — **не в этом компоненте** (см. Open Questions)

### TrailingIcon — Recurrence:
- Иконка: `Repeat` из lucide-react
- По умолчанию (recurrence = `'none'`): цвет `var(--md-sys-color-on-surface-variant)`
- Активный повтор (recurrence ≠ `'none'`): цвет `var(--md-sys-color-primary)` — визуальный сигнал что повтор установлен
- При нажатии → Popover (см. раздел Recurrence ниже)
- `aria-label`: `"Set recurrence"` / `"Настроить повтор"` / `"Configurar repetición"`

### CSS:
```css
.task-sheet__textfield {
  width: 100%;
  background: var(--md-sys-color-surface-container-highest);
  border-radius: var(--md-sys-shape-corner-large); /* 16px */
  border: 1px solid var(--md-sys-color-outline-variant);
  padding: 16px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: border-color var(--md-sys-motion-duration-short4)
              var(--md-sys-motion-easing-standard);
}

.task-sheet__textfield:focus-within {
  border-color: var(--md-sys-color-primary);
}

.task-sheet__textfield input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--md-sys-typescale-body-large-font);
  font-size: var(--md-sys-typescale-body-large-size);
  font-weight: 600;
  color: var(--md-sys-color-on-surface);
}

/* Supporting text — зарезервирован всегда, предотвращает layout shift */
.task-sheet__supporting {
  min-height: 20px;
  font-size: var(--md-sys-typescale-body-small-size);
  color: var(--md-sys-color-on-surface-variant);
  padding: 0 4px;
}

.task-sheet__supporting--error {
  color: var(--md-sys-color-error);
}
```

---

## Recurrence Popover

Открывается при нажатии на `trailingIcon` (Repeat) в TextField.

### Варианты (финальный список):
| Value (`Recurrence`) | Label EN | Label RU | Label ES |
|---|---|---|---|
| `'none'` | Once | Один раз | Una vez |
| `'daily'` | Every day | Каждый день | Cada día |
| `'weekly'` | Every week | Каждую неделю | Cada semana |
| `'monthly'` | Every month | Каждый месяц | Cada mes |
| `'all-blocks'` | All active blocks | Все активные блоки | Todos los bloques |
| *(planned)* | Choose dates... | Выбрать даты... | Elegir fechas... |

"Choose dates..." — последний пункт, открывает Date Picker. **Не реализовывать в MVP**, зарезервировать место в списке.

### Визуал Popover:
- Тип: React Aria `useOverlay` + `usePopover`
- Позиция: открывается вверх от TextField (если места внизу нет — вниз)
- Background: `var(--md-sys-color-surface-container-high)`
- Border-radius: `var(--md-sys-shape-corner-large)` (16px)
- Shadow: `var(--md-sys-elevation-shadow-2)`
- Анимация: fade-in `duration-m3-short-2` (200ms), `ease-m3-decelerate`
- Каждый пункт: `48px` высота, `padding: 0 16px`, текст `body-large`
- Selected пункт: `var(--md-sys-color-secondary-container)` background

### Удаление задачи с повтором:
⚠️ **Известная проблема:** при удалении задачи с `recurrence ≠ 'none'` задача удаляется из ВСЕХ слотов сразу.

**Решение (задокументировать для разработчиков):** при удалении задачи с активным recurrence показывать диалог:
> "Удалить только эту задачу или все повторы?"
> [Только эту] [Все повторы] [Отмена]

Это стандартный паттерн Google Calendar. Реализовать в `TaskItem.tsx` — за пределами TaskSheet, но связано с той же бизнес-логикой.

---

## Weight Selector (Segmented Buttons)

Три кнопки: Quick / Focused / Deep.

### Визуал:
- Компонент: React Aria `useToggleButtonGroup` или MUI `ToggleButtonGroup`
- Layout: `display: flex`, `width: 100%`, равные части

```css
.task-sheet__weight-group {
  display: flex;
  width: 100%;
  border-radius: var(--md-sys-shape-corner-medium); /* 12px */
  overflow: hidden;
  border: 1px solid var(--md-sys-color-outline-variant);
}

.task-sheet__weight-btn {
  flex: 1;
  padding: 10px 8px;
  font-size: var(--md-sys-typescale-label-large-size);
  font-weight: var(--md-sys-typescale-label-large-weight);
  text-align: center;
  background: var(--md-sys-color-surface-container-highest);
  color: var(--md-sys-color-on-surface-variant);
  border: none;
  cursor: pointer;
  transition: background var(--md-sys-motion-duration-short4)
              var(--md-sys-motion-easing-standard);
  min-height: 44px; /* touch target */
}

/* Selected states — цвета весов */
.task-sheet__weight-btn[data-weight="quick"][aria-pressed="true"] {
  background: var(--flow-weight-quick-color);
  color: var(--flow-weight-quick-on-color);
}
.task-sheet__weight-btn[data-weight="focused"][aria-pressed="true"] {
  background: var(--flow-weight-focused-color);
  color: var(--flow-weight-focused-on-color);
}
.task-sheet__weight-btn[data-weight="deep"][aria-pressed="true"] {
  background: var(--flow-weight-deep-color);
  color: var(--flow-weight-deep-on-color);
}
```

**Smart default:** `suggestWeight()` из `taskOptimizer.ts` автоматически предлагает вес на основе текста названия. Пользователь видит уже выбранный вариант, может переключить.

---

## Priority Selector (Segmented Buttons)

Три кнопки: Low / Medium / High. Каждая содержит иконку формы + текст.

| Priority | Иконка (lucide) | Label EN | Label RU | Label ES |
|---|---|---|---|---|
| `'low'` | `Circle` | Low | Низкий | Bajo |
| `'medium'` | `Diamond` | Med | Средний | Medio |
| `'high'` | `Star` | High | Высокий | Alto |

> Иконки в кнопках — визуальный preview формы пузыря. Тот же язык что в TaskIndicator.

**Default:** `'medium'` — нейтральный стартовый выбор.

```css
.task-sheet__priority-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

/* Selected state — primary container */
.task-sheet__priority-btn[aria-pressed="true"] {
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}
```

---

## Period Selector (Segmented Buttons)

Три кнопки: Morning / Afternoon / Evening. Night не включается.

### Умный автовыбор:
- При открытии TaskSheet **активный период выбран автоматически** на основе `activePeriodId` из App.tsx
- Под группой кнопок — вспомогательный текст `"сейчас активен"` (`Label S`, `on-surface-variant`) под выбранной кнопкой
- Пользователь может переключить вручную — вспомогательный текст исчезает

```typescript
// Логика в компоненте:
const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>(activePeriodId ?? TimePeriod.MORNING);
const [isAutoSelected, setIsAutoSelected] = useState(true);

const handlePeriodChange = (period: TimePeriod) => {
  setSelectedPeriod(period);
  setIsAutoSelected(false); // пользователь переключил вручную
};
```

### Selected state — цвета блоков:
```css
.task-sheet__period-btn[data-period="morning"][aria-pressed="true"] {
  background: var(--flow-block-morning);
  color: var(--flow-block-morning-on-color);
}
.task-sheet__period-btn[data-period="afternoon"][aria-pressed="true"] {
  background: var(--flow-block-afternoon);
  color: var(--flow-block-afternoon-on-color);
}
.task-sheet__period-btn[data-period="evening"][aria-pressed="true"] {
  background: var(--flow-block-evening);
  color: var(--flow-block-evening-on-color);
}
```

### Вспомогательный текст:
```css
.task-sheet__period-hint {
  font-size: var(--md-sys-typescale-label-small-size); /* 11px */
  color: var(--md-sys-color-on-surface-variant);
  text-align: center; /* центрирован под активной кнопкой */
  min-height: 16px; /* зарезервировано — нет layout shift */
  margin-top: 4px;
  opacity: 0;
  transition: opacity var(--md-sys-motion-duration-short4)
              var(--md-sys-motion-easing-standard);
}
.task-sheet__period-hint[data-visible="true"] {
  opacity: 1;
}
```

Текст локализован:
- EN: `"currently active"`
- RU: `"сейчас активен"`
- ES: `"actualmente activo"`

---

## Add Button + Cancel

### Filled Button (Add):
```css
.task-sheet__add-btn {
  width: 100%;
  padding: 16px;
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  border-radius: var(--md-sys-shape-corner-full); /* 9999px */
  font-size: var(--md-sys-typescale-label-large-size);
  font-weight: var(--md-sys-typescale-label-large-weight);
  min-height: 52px;
  border: none;
  cursor: pointer;
  transition: opacity var(--md-sys-motion-duration-short4)
              var(--md-sys-motion-easing-standard);
}

.task-sheet__add-btn:disabled {
  opacity: var(--md-sys-state-disabled-opacity); /* 0.38 */
  pointer-events: none;
}
```

**Disabled когда:** title пустой или только пробелы.

### Text Button (Cancel):
```css
.task-sheet__cancel-btn {
  display: block;
  margin: 0 auto;
  padding: 8px 16px;
  color: var(--md-sys-color-on-surface-variant);
  font-size: var(--md-sys-typescale-label-large-size);
  background: transparent;
  border: none;
  cursor: pointer;
  min-height: 44px;
}
```

---

## Submit Logic

```typescript
const handleSubmit = () => {
  if (!title.trim()) return;

  // Capacity check через adjustTaskPeriods()
  const adjustment = adjustTaskPeriods(
    tasks,
    [selectedPeriod],
    todayStr,
    selectedWeight,
    activePeriodId,
    currentTime
  );

  if (adjustment.transferred) {
    // Период изменён системой — показать Snackbar
    showCapacityNotification({
      type: 'transferred',
      message: `Task moved to ${adjustment.period} (${adjustment.date})`
    });
  }

  // Добавление задачи
  addTask({
    title: title.trim(),
    periods: adjustment.periods,
    dueDate: adjustment.date,
    weight: selectedWeight,
    priority: selectedPriority,
    recurrence: selectedRecurrence,
    icon: suggestIcon(title), // автоиконка
  });

  // Закрытие sheet
  onClose();
};
```

**После добавления:** новый пузырь появляется в соответствующем TimeBlock через Matter.js (всплытие снизу вверх).

---

## Validation

| Поле | Правило | Supporting text |
|---|---|---|
| Title | Обязательно, не пустое | `"Введите название задачи"` / `"Task name required"` |
| Title | Максимум 100 символов | `"Максимум 100 символов"` / `"Max 100 characters"` |
| Period | Всегда выбран (auto) | — |
| Weight | Всегда выбран (auto) | — |
| Priority | Всегда выбран (default medium) | — |

Ошибки показываются в supporting text под TextField. Место зарезервировано — нет layout shift.

---

## Typography

| Element | Token | Size | Weight |
|---|---|---|---|
| Sheet title | `title-large` | 22px | 500 |
| Section labels (ВЕС, ПРИОРИТЕТ, ПЕРИОД) | `label-medium` | 12px | 500 |
| TextField input | `body-large` | 16px | 600 |
| Supporting text | `body-small` | 12px | 400 |
| Button labels | `label-large` | 14px | 500 |
| Period hint | `label-small` | 11px | 500 |

Section labels — uppercase, `letter-spacing: 0.5em`, цвет `var(--md-sys-color-on-surface-variant)`.

---

## Tokens

> Все цвета — только CSS-переменные из `tokens.css`. Хардкод hex запрещён.
> Dark theme переключается автоматически через `.dark` класс.

| Element | CSS-переменная |
|---|---|
| Sheet background | `var(--md-sys-color-surface-container-low)` |
| TextField background | `var(--md-sys-color-surface-container-highest)` |
| TextField border | `var(--md-sys-color-outline-variant)` |
| TextField focus border | `var(--md-sys-color-primary)` |
| Section labels | `var(--md-sys-color-on-surface-variant)` |
| Add button bg | `var(--md-sys-color-primary)` |
| Add button text | `var(--md-sys-color-on-primary)` |
| Cancel text | `var(--md-sys-color-on-surface-variant)` |
| Scrim | `var(--md-sys-color-scrim)` opacity 0.32 |
| Quick selected | `var(--flow-weight-quick-color)` / `--flow-weight-quick-on-color` |
| Focused selected | `var(--flow-weight-focused-color)` / `--flow-weight-focused-on-color` |
| Deep selected | `var(--flow-weight-deep-color)` / `--flow-weight-deep-on-color` |
| Morning selected | `var(--flow-block-morning)` / `--flow-block-morning-on-color` |
| Afternoon selected | `var(--flow-block-afternoon)` / `--flow-block-afternoon-on-color` |
| Evening selected | `var(--flow-block-evening)` / `--flow-block-evening-on-color` |
| Priority selected | `var(--md-sys-color-primary-container)` / `--md-sys-color-on-primary-container` |
| Recurrence active icon | `var(--md-sys-color-primary)` |

---

## Motion

| Действие | Duration | Easing |
|---|---|---|
| Sheet появление | `duration-m3-medium-2` (300ms) | `ease-m3-decelerate` |
| Sheet закрытие | `duration-m3-medium-1` (250ms) | `ease-m3-accelerate` |
| Popover появление | `duration-m3-short-2` (200ms) | `ease-m3-decelerate` |
| State changes (hover/focus) | `duration-m3-short-4` (200ms) | `ease-m3-standard` |
| Icon swap в TextField | без анимации — мгновенно | — |
| Period hint fade | `duration-m3-short-4` (200ms) | `ease-m3-standard` |

**Spring-анимации запрещены** — манифест Flow.

---

## Accessibility

- **Role:** `dialog`, `aria-modal="true"`, `aria-label="Add task"` / `"Добавить задачу"`
- **Focus management:** при открытии фокус → TextField input
- **Focus trap:** Tab циклится внутри sheet пока открыт
- **Close:** Escape → закрытие
- **Drag handle:** `role="button"`, `aria-label="Close sheet"` / `"Закрыть"`
- **Segmented buttons:** `role="group"`, каждая кнопка `aria-pressed="true/false"`
- **Weight buttons:** `aria-label="Quick, 1 point"` / `"Focused, 3 points"` / `"Deep, 6 points"`
- **Priority buttons:** `aria-label="Low priority, circle shape"` / `"Medium priority, diamond shape"` / `"High priority, star shape"`
- **Period auto-select:** `aria-description="Currently active period"` на выбранной кнопке
- **Add button disabled:** `aria-disabled="true"` + `aria-describedby` → supporting text с объяснением
- **Reduced motion:** анимации отключаются автоматически через `tokens.css`

---

## Mapping to Code

**Файл:** `src/components/modals/TaskSheet.tsx`

**Зависимости:**
```typescript
import { useDialog, useOverlay, useModalOverlay } from 'react-aria';
import { useOverlayTriggerState } from 'react-stately';
import { suggestWeight } from '@/services/taskOptimizer';
import { suggestIcon } from '@/services/iconSuggester'; // новый файл
import { adjustTaskPeriods } from '@/services/taskOptimizer';
import { TimePeriod, TaskWeight, Priority, Recurrence } from '@/types';
```

**Props:**
```typescript
interface TaskSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdd: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  activePeriodId: TimePeriod;
  tasks: Task[];
  currentTime: Date;
  language: Language;
}
```

**Internal state:**
```typescript
const [title, setTitle] = useState('');
const [selectedWeight, setSelectedWeight] = useState<TaskWeight>(TaskWeight.FOCUSED);
const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');
const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>(activePeriodId);
const [selectedRecurrence, setSelectedRecurrence] = useState<Recurrence>('none');
const [isAutoSelected, setIsAutoSelected] = useState(true);
const [titleError, setTitleError] = useState<string | null>(null);

// Auto-suggest weight при изменении title
useEffect(() => {
  if (title.trim()) {
    const suggested = suggestWeight(title);
    setSelectedWeight(suggested);
  }
}, [title]);
```

**Новый сервис:**
```typescript
// src/services/iconSuggester.ts
export function suggestIcon(title: string): string // возвращает имя иконки lucide
```

---

## File Structure

```
src/
  components/
    modals/
      TaskSheet.tsx              — основной компонент
      TaskSheet.test.tsx
  services/
    iconSuggester.ts             — новый: автоподбор иконки по тексту
```

---

## Open Questions

1. **Ручная смена иконки:** пользователь хочет изменить автоподобранную иконку. Решение: long press на пузырь → контекстное меню → "Сменить иконку" → отдельный Icon Picker Bottom Sheet. Не входит в TaskSheet. Нужна отдельная спека для `IconPickerSheet.tsx`.

2. **Date Picker (Choose dates...):** последний пункт Recurrence Popover — "Выбрать даты...". Компонент не реализован. Нужна спека для Date Picker компонента (calendar grid с multi-select).

3. **Удаление с повтором:** при удалении задачи с `recurrence ≠ 'none'` нужен диалог выбора ("удалить только эту" vs "удалить все повторы"). Реализовать в `TaskItem.tsx`, не в TaskSheet.

4. **`suggestIcon` AI-апгрейд:** rule-based словарь → Anthropic API call (`suggestWeightAI` уже запланирован в CLAUDE.md). `suggestIconAI` — логичное расширение того же вызова.

5. **Мультиселект периодов:** `selectedPeriods: TimePeriod[]` в App.tsx поддерживает массив. Текущее решение — один период. Если понадобится мультиселект в будущем — Period Selector переходит с `radio` на `checkbox` поведение без изменения визуала.

6. **Safe area (iOS):** `padding-bottom` должен учитывать `env(safe-area-inset-bottom)`. Добавить: `padding-bottom: calc(32px + env(safe-area-inset-bottom))`.
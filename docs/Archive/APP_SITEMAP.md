# Flow Calendar — Карта приложения (Sitemap)

## Обзор приложения

**Flow Calendar** — это персональное приложение для управления задачами с концепцией "потока" (Flow), основанной на временных блоках и энергетическом весе задач.

### Технологический стек
- **Фреймворк:** React 19.2.3 + TypeScript
- **Сборка:** Vite 6.2.0
- **UI библиотека:** React Aria (доступность), Lucide React (иконки)
- **Стили:** Tailwind CSS + CSS Variables (Material Design 3 tokens)
- **Хранение:** localStorage (tasks, settings, user, voice settings)

---

## Структура приложения (Sitemap)

```
┌─────────────────────────────────────────────────────────────────┐
│                        FLOW CALENDAR APP                        │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌─────────────────┐    ┌───────────────┐
│   SPLASH      │    │   AUTH SCREEN   │    │   MAIN APP    │
│   SCREEN      │───▶│   (Guest Login) │───▶│   (Ready)     │
│               │    │                 │    │               │
│   • Logo      │    │  • Name input   │    │  ┌─────────┐  │
│   • Animation │    │  • Email input  │    │  │ HEADER  │  │
│   • 3 sec     │    │  • Guest auth   │    │  └─────────┘  │
└───────────────┘    └─────────────────┘    │  ┌─────────┐  │
                                            │  │ NAVBAR  │  │
                                            │  └─────────┘  │
                                            │  ┌─────────┐  │
                                            │  │  VIEW   │  │
                                            │  │ CONTENT │  │
                                            │  └─────────┘  │
                                            │  ┌─────────┐  │
                                            │  │  MODAL  │  │
                                            │  │ OVERLAY │  │
                                            │  └─────────┘  │
                                            └───────────────┘
```

---

## Детальная карта экранов

### 1. Splash Screen (Загрузочный экран)
**Путь:** `/` (начальное состояние)
**Компонент:** `App.tsx` (состояние `appState === 'splash'`)

```
┌─────────────────────────────┐
│         Flow                │
│      [Logo + Icon]          │
│   "Harmonize your day"      │
│                             │
│   • Анимация вращения       │
│   • Фоновые пятна (spots)   │
│   • 3 секунды показ         │
└─────────────────────────────┘
```

**Переходы:**
- Через 3 сек → `auth` (если нет пользователя)
- Через 3 сек → `ready` (если пользователь есть в localStorage)

---

### 2. Auth Screen (Экран авторизации)
**Путь:** `/auth`
**Компонент:** `Auth.tsx`

```
┌─────────────────────────────┐
│         Flow                │
│                             │
│  ┌─────────────────────┐    │
│  │ Имя                 │    │
│  │ email@example.com   │    │
│  │ [Продолжить]        │    │
│  └─────────────────────┘    │
│                             │
│  • Guest-аутентификация     │
│  • Данные в localStorage    │
└─────────────────────────────┘
```

**Переходы:**
- Успех → `ready` (основное приложение)

---

### 3. Main App (Основное приложение)

#### 3.1 Header (Шапка)
**Компонент:** `Header.tsx`

```
┌─────────────────────────────────────────┐
│ [Menu]  Flow              [Alarm][⚙️]   │
│         [Greeting]                      │
│         [Current Time]                  │
└─────────────────────────────────────────┘
```

**Элементы:**
- Menu button → Settings Modal
- Alarm icon → Alarm Modal
- Settings icon → Settings Modal
- Voice button → Toggle voice listening

---

#### 3.2 Navigation Bar (Нижняя навигация)
**Компонент:** `ViewSwitcher.tsx`

```
┌─────────────────────────────────────────┐
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐    │
│  │ Day │  │Week │  │Month│  │Year │    │
│  │ 📅  │  │ 📆  │  │ 📊  │  │ 🗓️  │    │
│  └─────┘  └─────┘  └─────┘  └─────┘    │
│   (active)                              │
└─────────────────────────────────────────┘
```

**Режимы просмотра:**
- `day` — День (4 временных блока)
- `week` — Неделя (7 дней)
- `month` — Месяц (календарная сетка)
- `year` — Год (12 месяцев)

---

#### 3.3 Date Navigator (Навигация по датам)
**Компонент:** `DateNavigator.tsx`

```
┌─────────────────────────────────────────┐
│  [<]  "Week of Jan 15-21"  [>]          │
│         [Today]                         │
└─────────────────────────────────────────┘
```

**Функции:**
- Navigation: prev/next
- Today button: возврат к текущей дате

---

### 4. View Content (Содержимое представлений)

#### 4.1 Day View (Дневной просмотр)
**Компонент:** `DayView.tsx`

```
┌─────────────────────────────────────────┐
│  ┌─────────────────────────────────┐    │
│  │   TASK MANAGER PANEL            │    │
│  │   [Stats: Total/Active/Done]    │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │   FOCUS POINT (Add Task)        │    │
│  │   [Task input...]               │    │
│  │   [Weight: Quick/Focused/Deep]  │    │
│  │   [Period: Morning/Afternoon/   │    │
│  │            Evening]             │    │
│  │   [Recurrence: Once/Daily/...]  │    │
│  │   [+ Add Button]                │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │   RECOVERY BANNER               │    │
│  │   (если режим восстановления)   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │   MORNING BLOCK                 │    │
│  │   [06:00 - 10:00] [Capacity]    │    │
│  │   • Task 1 [✓]                  │    │
│  │   • Task 2                      │    │
│  │   [+] Quick Add                 │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │   AFTERNOON BLOCK               │    │
│  │   [10:00 - 14:00] [Capacity]    │    │
│  │   • Task 3                      │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │   EVENING BLOCK                 │    │
│  │   [14:00 - 22:00] [Capacity]    │    │
│  │   • Task 4                      │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │   NIGHT BLOCK                   │    │
│  │   [22:00 - 06:00]               │    │
│  │   (Silence period)              │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

**Подкомпоненты:**
- `TaskManagerPanel` — панель управления задачами
- `FocusPoint` — форма добавления задачи
- `RecoveryBanner` — баннер режима восстановления
- `TimeBlockList` → `TimeBlock` — список временных блоков

---

#### 4.2 Week View (Недельный просмотр)
**Компонент:** `WeekView.tsx`

```
┌─────────────────────────────────────────┐
│  Week of January 15-21, 2024            │
├─────────────────────────────────────────┤
│  Mon 15  │  Tasks: 3  │  ████████░░     │
│  Tue 16  │  Tasks: 5  │  ██████████     │
│  Wed 17  │  Tasks: 2  │  ████░░░░░░     │
│  Thu 18  │  Tasks: 4  │  ████████░░     │
│  Fri 19  │  Tasks: 6  │  ██████████     │
│  Sat 20  │  Tasks: 0  │  ░░░░░░░░░░     │
│  Sun 21  │  Tasks: 1  │  ██░░░░░░░░     │
└─────────────────────────────────────────┘
```

---

#### 4.3 Month View (Месячный просмотр)
**Компонент:** `MonthView.tsx`

```
┌─────────────────────────────────────────┐
│        January 2024                     │
├─────────────────────────────────────────┤
│  Su  Mo  Tu  We  Th  Fr  Sa             │
│      1   2   3   4   5   6              │
│   7   8   9  10  11  12  13             │
│  14  15  16  17  18  19  20             │
│  21  22  23  24  25  26  27             │
│  28  29  30  31                         │
└─────────────────────────────────────────┘
```

**Клик на день** → переход в Day View

---

#### 4.4 Year View (Годовой просмотр)
**Компонент:** `YearView.tsx`

```
┌─────────────────────────────────────────┐
│           2024                          │
├─────────────────────────────────────────┤
│  Jan  Feb  Mar  Apr                     │
│  May  Jun  Jul  Aug                     │
│  Sep  Oct  Nov  Dec                     │
└─────────────────────────────────────────┘
```

---

### 5. Modals (Модальные окна)

#### 5.1 Settings Modal
**Компонент:** `SettingsModal.tsx`

```
┌─────────────────────────────────────────┐
│  Settings                          [X]  │
│  ─────────────────────────────────────  │
│  Dark theme                    [Toggle] │
│                                         │
│  Morning Start    [07:00]              │
│  Night Rest       [23:00]              │
│                                         │
│  Language                               │
│  [EN] [RU] [ES]                        │
│                                         │
│  ──── Voice Control ────                │
│  Enable Voice                  [Toggle] │
│  Language: [RU] [EN] [ES]              │
│  Auto Submit                   [Toggle] │
│  Require Confirmation          [Toggle] │
│  Voice Feedback                [Toggle] │
│  Confidence: [━━━━━●━━━━] 70%          │
│                                         │
│  [Save Changes]                         │
│  [Log Out]                              │
└─────────────────────────────────────────┘
```

---

#### 5.2 Alarm Modal
**Компонент:** `AlarmModal.tsx`

```
┌─────────────────────────────────────────┐
│  Alarm Clock                       [X]  │
│  ─────────────────────────────────────  │
│  Enable Alarm                  [Toggle] │
│                                         │
│  Alarm Time     [07:00]                │
│                                         │
│  Sound                                  │
│  [Forest] [Sea Waves] [Stream]         │
│  [Birds] [Soft Rain] [Wind] [Zen]      │
│                                         │
│  [Save]                                 │
└─────────────────────────────────────────┘
```

---

#### 5.3 Alarm Playing Modal
**Компонент:** `AlarmPlayingModal.tsx`

```
┌─────────────────────────────────────────┐
│                                         │
│      🌅 Good Morning!                   │
│                                         │
│      [Alarm Sound Playing...]           │
│                                         │
│      [Stop]        [Snooze 5 min]       │
│                                         │
└─────────────────────────────────────────┘
```

---

#### 5.4 Voice Settings Modal
**Компонент:** `VoiceSettingsModal.tsx`

```
┌─────────────────────────────────────────┐
│  Voice Control                     [X]  │
│  ─────────────────────────────────────  │
│  Enable Voice Control          [Toggle] │
│                                         │
│  Voice Language                         │
│  [Russian] [English] [Spanish]          │
│                                         │
│  Auto Submit Commands          [Toggle] │
│  Require Confirmation          [Toggle] │
│  Voice Feedback (TTS)          [Toggle] │
│                                         │
│  Voice: [Select Voice ▼]                │
│                                         │
│  Recognition Confidence                 │
│  [━━━━━●━━━━] 70%                      │
│                                         │
└─────────────────────────────────────────┘
```

---

#### 5.5 Voice Confirmation Modal
**Путь:** Встроен в `App.tsx`

```
┌─────────────────────────────────────────┐
│                                         │
│  Add task "Buy milk"?                   │
│                                         │
│  [Cancel]          [Confirm]            │
│                                         │
└─────────────────────────────────────────┘
```

---

### 6. Voice Feedback Overlay
**Компонент:** `VoiceFeedback.tsx`

```
┌─────────────────────────────────────────┐
│  🎤 Listening...                        │
│  "Add task buy milk"                    │
│  Confidence: ████████░░ 80%             │
└─────────────────────────────────────────┘
```

**Состояния:**
- `idle` — скрыт
- `listening` — показ транскрипта
- `processing` — индикатор обработки
- `success` — подтверждение
- `error` — сообщение об ошибке

---

### 7. Capacity Notification
**Путь:** Встроен в `App.tsx`

```
┌─────────────────────────────────────────┐
│  ⚠️ Task "Buy milk" transferred to     │
│     Afternoon (block overflow)          │
└─────────────────────────────────────────┘
```

**Типы:**
- `transferred` — задача перенесена (зелёный)
- `full` — все блоки переполнены (янтарный)

---

## Компонентная иерархия

```
App.tsx
├── Header
│   ├── Menu Button → SettingsModal
│   ├── Alarm Icon → AlarmModal
│   └── Voice Button
├── ViewSwitcher (Navigation Bar)
├── DateNavigator
├── VoiceFeedback
├── CapacityNotification
├── VoiceConfirmationModal
├── DayView
│   ├── RecoveryBanner
│   ├── TaskManagerPanel
│   │   └── ConfirmationModal
│   ├── FocusPoint
│   │   ├── Weight Picker (Quick/Focused/Deep)
│   │   ├── Period Picker (Morning/Afternoon/Evening)
│   │   └── Recurrence Menu
│   └── TimeBlockList
│       └── TimeBlock (×4: Morning, Afternoon, Evening, Night)
│           └── TaskItem (×N)
├── WeekView
├── MonthView
├── YearView
├── SettingsModal
│   └── VoiceSettingsSection
├── AlarmModal
└── AlarmPlayingModal
```

---

## Сервисы и утилиты

### Services

```
services/
├── taskOptimizer.ts
│   ├── optimizeTasks() — сортировка задач по приоритету
│   ├── suggestWeight() — определение веса задачи
│   ├── prioritizeEisenhower() — матрица Эйзенхауэра
│   ├── calculatePeriodPoints() — подсчёт баллов периода
│   ├── wouldExceedCapacity() — проверка лимита
│   ├── findAvailableSlot() — поиск свободного слота
│   └── adjustTaskPeriods() — корректировка периодов
│
└── voice/
    ├── VoiceControlService.ts
    │   ├── startListening()
    │   ├── stopListening()
    │   ├── speak() — TTS
    │   └── getAvailableVoices()
    │
    ├── VoiceCommandProcessor.ts
    │   └── parseCommand() — парсинг команды
    │
    └── commands/
        ├── TaskCommands.ts — add/toggle/delete
        ├── NavigationCommands.ts — date/view
        └── UpdateCommands.ts — update task
```

### Utils

```
utils/
├── design-utils.ts
├── getCurrentYear.ts
└── MaterialIcons.tsx
```

### Theme

```
theme/
├── tokens.css — Material Design 3 tokens
├── design-tokens.ts — TypeScript определения
└── material-theme.json — JSON тема
```

---

## Типы данных (TypeScript)

### Основные типы

```typescript
// Временные периоды
enum TimePeriod {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  EVENING = 'evening',
  NIGHT = 'night'
}

// Вес задачи (effort)
enum TaskWeight {
  quick = 'quick',      // 1 point, <15 мин
  focused = 'focused',  // 3 points, ~1 час
  deep = 'deep'         // 6 points, 2+ часа
}

// Приоритет
type Priority = 'low' | 'medium' | 'high'

// Язык
type Language = 'en' | 'ru' | 'es'

// Повторение
type Recurrence = 'none' | 'daily' | 'weekly' | 'monthly' | 'all-blocks'
```

### Интерфейсы

```typescript
// Задача
interface Task {
  id: string;
  title: string;
  periods: TimePeriod[];
  completed: boolean;
  createdAt: number;
  priority: Priority;
  weight: TaskWeight;
  notes?: string;
  dueDate?: string;
  recurrence?: Recurrence;
}

// Настройки пользователя
interface UserSettings {
  wakeUpTime: string;      // HH:mm
  restTime: string;        // HH:mm
  recoveryDays: number[];  // [0-6]
  workHistory: string[];   // YYYY-MM-DD
  language: Language;
  alarm: AlarmConfig;
}

// Конфигурация будильника
interface AlarmConfig {
  enabled: boolean;
  time: string;
  sound: string;
}

// Профиль пользователя
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isGuest: boolean;
}

// Настройки голоса
interface VoiceSettings {
  enabled: boolean;
  language: 'ru' | 'en' | 'es';
  autoSubmit: boolean;
  requireConfirmation: boolean;
  ttsEnabled: boolean;
  ttsVoice?: string;
  confidenceThreshold: number;
}

// Голосовая команда
interface VoiceCommand {
  type: CommandType;
  intent: string;
  entities: CommandEntities;
  confidence: number;
  rawText: string;
  silent?: boolean;
}
```

---

## Голосовые команды

### Типы команд (CommandType)

```typescript
enum CommandType {
  ADD_TASK = 'add_task',
  TOGGLE_TASK = 'toggle_task',
  DELETE_TASK = 'delete_task',
  NAVIGATE_DATE = 'navigate_date',
  CHANGE_VIEW = 'change_view',
  UPDATE_TASK = 'update_task',
  UNKNOWN = 'unknown'
}
```

### Примеры команд

| Команда | Тип | Сущности |
|---------|-----|----------|
| "Add task buy milk" | ADD_TASK | title: "buy milk" |
| "Complete task 1" | TOGGLE_TASK | index: 1 |
| "Delete task meeting" | DELETE_TASK | title: "meeting" |
| "Next day" | NAVIGATE_DATE | direction: "next" |
| "Show week view" | CHANGE_VIEW | viewMode: "week" |
| "Change task 2 to deep" | UPDATE_TASK | index: 2, weight: "deep" |

---

## Хранение данных (localStorage)

| Ключ | Данные |
|------|--------|
| `flow_user` | UserProfile |
| `flow_tasks` | Task[] |
| `flow_settings` | UserSettings |
| `flow_voice_settings` | VoiceSettings |
| `flow_theme` | 'light' \| 'dark' |

---

## Дизайн-система

### Material Design 3 Tokens

**Цвета:**
- Primary, OnPrimary, PrimaryContainer
- Secondary, OnSecondary, SecondaryContainer
- Tertiary, OnTertiary, TertiaryContainer
- Surface, OnSurface, SurfaceVariant
- Error, OnError, ErrorContainer

**Формы:**
- `--md-sys-shape-corner-extra-small`: 4px
- `--md-sys-shape-corner-small`: 8px
- `--md-sys-shape-corner-medium`: 12px
- `--md-sys-shape-corner-large`: 16px
- `--md-sys-shape-corner-extra-large`: 28px
- `--md-sys-shape-corner-full`: 9999px

**Elevation (Dark Theme):**
- Level 1: 5% tint
- Level 2: 8% tint
- Level 3: 11% tint
- Level 4: 12% tint
- Level 5: 14% tint

**Motion:**
- Short: 50-200ms
- Medium: 250-400ms
- Long: 450-500ms
- Easing: `cubic-bezier(0.2, 0, 0, 1)`

---

## Flow-специфичные концепции

### Временные блоки (Time Blocks)

| Блок | Время (по умолчанию) | Ёмкость |
|------|---------------------|---------|
| Morning | Wake Up → +4h | 12 points |
| Afternoon | +4h → +8h | 12 points |
| Evening | +8h → Rest Time | 12 points |
| Night | Rest Time → Wake Up | ∞ (no limit) |

### Вес задач (Task Weight)

| Вес | Баллы | Время | Цвет (light) |
|-----|-------|-------|--------------|
| Quick | 1 | <15 мин | #CCFCE3 (mint) |
| Focused | 3 | ~1 час | #FEF3C7 (lemon) |
| Deep | 6 | 2+ часа | #FCE4F5 (rose) |

### Режим восстановления (Recovery Mode)

Активируется когда:
- Текущий день в `recoveryDays` (выходные)
- Активен `isWindDown` (90 мин до сна)

В режиме восстановления:
- Показывается RecoveryBanner
- Задачи не добавляются в NIGHT period
- Предлагается отдых

---

## Доступность (Accessibility)

### Поддерживаемые режимы

1. **prefers-reduced-motion** — отключение анимаций
2. **prefers-contrast: more** — высокая контрастность
3. **forced-colors** (Windows High Contrast) — системная тема

### Интерактивные элементы

- Минимальный размер: 48×48px
- Focus indicator: 3px solid, контраст ≥ 3:1
- State layers: hover/focus/pressed/dragged

---

## Локализация

Поддерживаемые языки:
- **English** (en)
- **Русский** (ru)
- **Español** (es)

Файлы переводов:
- `TRANSLATIONS` — общий UI
- `VOICE_TRANSLATIONS` — голосовые команды

---

## Ссылки

- [Material Design 3](https://m3.material.io)
- [React Aria](https://react-spectrum.adobe.com/react-aria/)
- [GitHub Repository](https://github.com/denzakh/flow.git)
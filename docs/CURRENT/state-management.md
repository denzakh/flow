# Flow State Management & Interaction Rules (Temporal & Expressive Architecture)

> ⚠️ КРИТИЧЕСКИЙ СТАТУС: Приложение использует ГИБРИДНУЮ архитектуру (MUI v5/v6 + React Aria + Tailwind v4).
> Раздел "Глобальное состояние" (Раздел 3) описывает ПЛАНИРУЕМУЮ архитектуру. Не реализовывать User Bio-Resource State без явного запроса.
> Демаркационная линия священна: стандартный UI управляется MUI, уникальный физический UI — React Aria.

---

## 1. Состояния Интерактивности и State Layers (M3 Standard)

Все интерактивные элементы обязаны поддерживать 5 каноничных состояний M3: **Enabled, Hovered, Focused, Pressed, Disabled**.

### А. В зоне STANDARD UI (Компоненты MUI):
- Управление состояниями (включая Ripple-эффект, Focus Trap, тональное окрашивание и Hover-оверлеи) деленировано **внутренней логике MUI** и конфигурации `src/theme/mui-theme.ts`.
- ИИ-агентам запрещено вручную навешивать хуки React Aria на компоненты MUI. Стилизация состояний идет через Tailwind-классы или адаптивные свойства MUI.

### Б. В зоне EXPRESSIVE UI (Кастомные компоненты: Blocks, Bubbles, DateNavigator):
Интерактивность строится на базе **React Aria** (нормализация тач-событий мобильных устройств через `onPress` вместо `onClick`) и визуализируется через кастомный CSS State Layer:

```css
/* Паттерн оверлея для кастомных экспрессивных компонентов */
.expressive-interactive {
  position: relative;
  overflow: hidden;
}
.expressive-interactive::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: currentColor;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
}
/* Оверлеи прозрачности M3 */
.expressive-interactive[data-hovered='true']::after { opacity: 0.08; }
.expressive-interactive[data-focused='true']::after { opacity: 0.12; }
.expressive-interactive[data-pressed='true']::after { opacity: 0.12; }

```

---

## 2. Текущая Архитектура Состояний (РЕАЛИЗОВАНО)

### А. Персистентные состояния (localStorage / SSOT)

Все глобальные настройки и пользовательские данные хранятся в `localStorage`. ИИ-агенты обязаны использовать строго функциональные обновления для мутации этих объектов.

```typescript
// Ключ в localStorage: 'flow_settings'
interface UserSettings {
  wakeUpTime: string;      // Формат "HH:MM", дефолт: "07:00"
  restTime: string;        // Формат "HH:MM", дефолт: "23:00"
  language: 'en' | 'ru' | 'es';
  isLeftHanded: boolean;   // КРИТИЧЕСКОЕ ПОЛЕ: Управляет биомеханикой и зеркалированием UI
}

// Ключ в localStorage: 'flow_tasks'
type TaskList = Task[];

// Ключ в localStorage: 'flow_voice_settings'
interface VoiceSettings {
  enabled: boolean;
  language: string;
  silenceThreshold: number;
}
---

## 3. Планируемая Архитектура (НЕ РЕАЛИЗОВЫВАТЬ СЕЙЧАС)

*Этот раздел является исключительно дорожной картой (roadmap).*

### User Bio-Resource Profile (Фаза 2):

* Субъективный уровень энергии (0–100), рассчитываемый динамически на основе `UserSettings.energyPeak`.
* Влияние веса выполненных задач (Quick/Focused/Deep) на кривую истощения ресурса.

---

## 4. Доступность Состояний (Accessibility & ARIA)

* Любое изменение состояния задачи (выполнение, перенос) должно немедленно транслироваться в accessibility tree через атрибуты `aria-checked` и `aria-selected`.
* **Голосовые и системные уведомления:** Использовать `aria-live="polite"` для неблокирующих уведомлений (например, автоматический перенос задачи из-за перегрузки емкости). `aria-live="assertive"` разрешен только для критических аппаратных сбоев (отказ Web Speech API).
* **Динамический ARIA-контракт для центрального Smart FAB:**
* Если `primaryInputMethod === 'voice'`:
* Стейт `idle` ➔ `aria-label="Начать голосовой ввод задач"`.
* Стейт `listening` ➔ `aria-label="Остановить распознавание голоса, идет запись"`.
* Если `primaryInputMethod === 'text'`:
* `aria-label="Открыть панель быстрого текстового добавления задачи"`.

---

## 5. Паттерны Разработки для Экспрессивных Компонентов

При создании кастомных элементов интерфейса (блоки, пузыри, стрелки навигации Слоя Времени) строго использовать связку хуков React Aria для нормализации мобильного UX:

### Кнопки навигации Слоя Времени (DateNavigator):

```tsx
import { useRef } from 'react';
import { useButton } from 'react-aria';

export function TemporalButton(props) {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps, isPressed } = useButton(props, ref);
  
  return (
    <button
      {...buttonProps}
      ref={ref}
      data-pressed={isPressed}
      className="expressive-interactive w-12 h-12 rounded-full text-on-surface-variant transition-transform data-[pressed=true]:scale-95"
    >
      {props.children}
    </button>
  );
}

```

### Сетка Квадрантов (DayView Grid):

Использует кастомные контейнеры с фиксированным `min-height` для блокировки Layout Shift. Физика Matter.js инициализируется внутри хука `useEffect` только при условии:

const shouldEnablePhysics = !isRecoveryMode && !prefersReducedMotion

Если `shouldEnablePhysics === false`, состояние отображения пузырей принудительно переключается на статичную CSS-верстку (Flex/Grid).


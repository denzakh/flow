---
Контекст проекта: Flow App
Слой системы: Логика, интерактивность и доступность (State & Accessibility)
Официальные спецификации:
- React Aria: https://react-spectrum.adobe.com/react-aria/
- React Stately: https://react-spectrum.adobe.com/react-stately/index.html
---

> ⚠️ ТЕКУЩИЙ СТАТУС: Приложение в процессе миграции на M3.
> Раздел "Глобальное состояние" описывает ПЛАНИРУЕМУЮ архитектуру, не текущую.
> Текущая архитектура: useState в App.tsx + localStorage.
> НЕ реализовывать User Bio-Resource State без явного запроса.

---

# Flow State Management & Interaction Rules

## 1. Состояния Интерактивности (M3 Interaction States via React Aria)
Любой интерактивный элемент управляется через React Aria и визуализируется через State Layers:

- **Enabled (Дефолт):** Базовый цвет из `src/theme/tokens.css`
- **Hovered:** `isHovered` из React Aria → оверлей `currentColor` opacity 8%
- **Focused:** `isFocused` → outline 3px, цвет `--md-sys-color-primary`, offset 2px
- **Pressed:** `isPressed` → оверлей opacity 12% + scale(0.98)
- **Disabled:** `isDisabled` → opacity 38%, события заблокированы на уровне React Aria

### Реализация State Layer (обязательный паттерн):
```css
.component {
  position: relative;
  overflow: hidden;
}
.component::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: currentColor;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
}
.component:hover::after   { opacity: 0.08; }
.component:focus::after   { opacity: 0.12; }
.component:active::after  { opacity: 0.12; }
```

## 2. Текущая Архитектура Состояний (РЕАЛИЗОВАНО)

### Персистентные состояния (localStorage):
- `flow_tasks` — массив задач
- `flow_settings` — настройки (wakeUpTime, restTime, recoveryDays, language, alarm)
- `flow_user` — профиль пользователя
- `flow_voice_settings` — настройки голосового модуля

### Навигация и вид:
- `viewMode` — 'day' | 'week' | 'month' | 'year'
- `viewDate` — текущая дата просмотра
- `currentTime` — обновляется каждую секунду

### Голосовой модуль (8 состояний):
- `isVoiceListening`, `isVoiceProcessing` — booleans
- `voiceTranscript`, `voiceConfidence` — результат распознавания
- `voiceStatus` — 'idle' | 'listening' | 'processing' | 'error' | 'success'
- `pendingVoiceCommand` — команда ожидающая подтверждения

## 3. Планируемая Архитектура (НЕ РЕАЛИЗОВЫВАТЬ СЕЙЧАС)
> Этот раздел — roadmap, не текущее задание.

### User Bio-Resource State (будущее):
- Уровень энергии (0–100) на основе времени суток и выполненных задач
- Динамика изменения энергии (растёт/падает)
- Зависимость от Recovery Mode и workHistory

### Task State расширение (будущее):
- Статусы: backlog | in-progress | done
- Вес задачи влияет на bio-resource

### Timer/Focus State (будущее):
- Режим глубокого фокуса
- Таймер с обратным отсчётом

## 4. Доступность Состояний (Accessibility & ARIA)
- Изменение состояния задачи → мгновенно в accessibility tree
- Использовать `aria-selected`, `aria-checked`, `aria-expanded` строго по React Aria
- Системные уведомления → `aria-live="polite"` (не прерывает пользователя)
- `aria-live="assertive"` только для критических ошибок
- Все интерактивные элементы → `aria-label` или видимый текст
- Голосовой модуль → `aria-label` на FAB меняется по состоянию:
  - listening: "Остановить распознавание"
  - idle: "Начать голосовой ввод"

## 5. Паттерны React Aria для Flow компонентов

### Кнопки и FAB:
```tsx
import { useButton } from 'react-aria'
const { buttonProps, isPressed } = useButton({ onPress, isDisabled }, ref)
```

### Переключатели (Switch):
```tsx
import { useToggle } from 'react-aria'
import { useToggleState } from 'react-stately'
const state = useToggleState({ defaultSelected: false })
const { inputProps } = useToggle(props, state, ref)
```

### Диалоги и модалки:
```tsx
import { useDialog, useModal, useOverlay } from 'react-aria'
// Всегда использовать FocusTrap внутри модалок
```

### Списки задач:
```tsx
import { useListBox, useOption } from 'react-aria'
import { useListState } from 'react-stately'
```

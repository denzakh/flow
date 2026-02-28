# 🎨 Flow Design System 2.0 — Кастомизированная версия

## Ваши предпочтения учтены ✅

### Что включено:

| Категория | Что оставили | Что изменили |
|-----------|--------------|--------------|
| **Компоненты** | Инпуты, Задачи | Кнопки — inner glow |
| **Эффекты** | Все полностью | + Halo effect секция |
| **Типографика** | Вся полностью | Без изменений |
| **Цвета** | Все кроме active green | Primary button — amber glow |
| **Бейджи** | Без иконок | + Halo эффект |

---

## 🚀 Запуск

```bash
npm run dev
# Откройте: http://localhost:3000?preview=true
```

---

## 📋 Обновлённые компоненты

### 1. Кнопки 2.0 — Inner Glow

**Было:**
```tsx
// Заливка цветом
background: colors.accent.active;
```

**Стало:**
```tsx
// Inner glow эффект
background: colors.bg.primary;
border: `1px solid ${colors.accent.evening}`;
boxShadow: `inset 0 0 20px ${colors.accent.evening}40`;
```

**Варианты:**
- **Primary** — Amber inner glow (вместо зелёной заливки)
- **Secondary** — Прозрачная с border
- **Ghost** — Без border
- **Gradient** — С внутренним белым свечением

---

### 2. Бейджи 2.0 — Без иконок + Halo

**Было:**
```tsx
<Badge2 variant="quick">⚡ Quick</Badge2>
```

**Стало:**
```tsx
<Badge2 variant="quick">Quick</Badge2>
<Badge2 variant="high" withHalo>High Priority</Badge2>
```

**Новый prop:**
- `withHalo` — включает двойное свечение вокруг бейджа

**Halo эффект:**
```tsx
boxShadow: `0 0 20px ${colorsVariant.glow}, 0 0 40px ${colorsVariant.glow}`
```

---

### 3. Инпуты 2.0 — Без изменений

Animated gradient border работает как прежде:
- Статичный градиент в покое
- Вращающийся градиент при фокусе

---

### 4. Задачи 2.0 — Без изменений

Hover lift + custom checkbox работают как прежде.

---

## ✨ Halo Effect — Где используется

### В бейджах:
```tsx
<Badge2 variant="quick" withHalo>Quick</Badge2>
<Badge2 variant="focused" withHalo>Focused</Badge2>
<Badge2 variant="deep" withHalo>Deep</Badge2>
<Badge2 variant="high" withHalo>High Priority</Badge2>
```

### Цвета halo:
| Вес | Цвет свечения |
|-----|---------------|
| Quick | `rgba(52, 211, 153, 0.2)` |
| Focused | `rgba(96, 165, 250, 0.2)` |
| Deep | `rgba(167, 139, 250, 0.2)` |
| High Priority | `rgba(248, 113, 113, 0.3)` |

---

## 🎨 Цветовая палитра

### Исключён:
- ❌ `--accent-active: #10B981` (зелёный)

### Основные акценты:
- ✅ `--accent-evening: #D4A574` (amber — signature)
- ✅ `--accent-morning: #FFFFFF` (white)
- ✅ `--accent-night: #6B7280` (gray)

### Task weights:
- ✅ Quick: `#34D399` (emerald)
- ✅ Focused: `#60A5FA` (blue)
- ✅ Deep: `#A78BFA` (purple)

### Priority:
- ✅ High: `#F87171` (red)
- ✅ Medium: `#FBBF24` (amber)
- ✅ Low: `#60A5FA` (blue)

---

## 📊 Вкладки Preview

### 1. Компоненты
- **Кнопки** — 4 варианта + inner glow
- **Инпуты** — 2 примера
- **Бейджи** — 6 вариантов без иконок
- **Задачи** — 3 примера

### 2. Эффекты
- **Glassmorphism 2.0** — 3 варианта
- **Halo Effect** — 4 примера (quick/focused/deep/high)
- **Hover Lift** — интерактивная демо

### 3. Типографика
- Заголовки H1-H4
- Текст primary/secondary/tertiary
- Label/Tiny стили

### 4. Цвета
- Backgrounds (4 цвета)
- Task Weights (3 цвета)
- Accents (3 цвета, без зелёного)

---

## 🔧 Как использовать

### Кнопка с inner glow:
```tsx
import { Button2 } from './components/preview/DesignPreview2';

<Button2 variant="primary">Primary</Button2>
```

### Бейдж с halo:
```tsx
import { Badge2 } from './components/preview/DesignPreview2';

<Badge2 variant="focused" withHalo>Focused</Badge2>
```

### Инпут:
```tsx
import { Input2 } from './components/preview/DesignPreview2';

<Input2
  label="Task"
  placeholder="What's next?"
/>
```

### Задача:
```tsx
import { TaskItem2 } from './components/preview/DesignPreview2';

<TaskItem2
  title="Design review"
  weight="deep"
  priority="high"
  completed={false}
/>
```

---

## 🎯 Где применить в основном приложении

### 1. Header — кнопки:
```tsx
// Settings button
<Button2 variant="ghost" leftIcon={<Settings size={20} />}>
  Settings
</Button2>
```

### 2. Task Input — инпут:
```tsx
<Input2
  placeholder="What's next?"
  leftIcon={<Plus size={20} />}
/>
```

### 3. Task List — задачи:
```tsx
<TaskItem2
  title={task.title}
  weight={task.weight}
  priority={task.priority}
  completed={task.completed}
  onToggle={() => toggleTask(task.id)}
/>
```

### 4. Weight Selector — бейджи:
```tsx
<Badge2 
  variant={selectedWeight} 
  withHalo={selectedWeight === 'deep'}
>
  {selectedWeight}
</Badge2>
```

---

## 💡 Советы

### Inner Glow в кнопках:
- Используйте для **акцентных действий** (Add Task, Save)
- Не используйте для **второстепенных кнопок**

### Halo Effect:
- Используйте для **важных статусов** (deep tasks, high priority)
- Не переусердствуйте — halo привлекает внимание

### Glassmorphism:
- Используйте для **карточек и модалок**
- Избегайте на **мелких элементах**

---

## 📊 Метрики

| Метрика | Значение |
|---------|----------|
| **Размер JS** | 285.14 kB |
| **Размер CSS** | 12.37 kB |
| **Компонентов** | 12 |
| **Эффектов** | 8 |
| **Цвета акцентов** | 3 (без зелёного) |

---

## 🎨 Следующие шаги

### Хотите применить к основному приложению?

1. **Замените импорты** в DayView.tsx:
   ```tsx
   import { Button2, Input2, TaskItem2, Badge2 } from './preview/DesignPreview2';
   ```

2. **Обновите компоненты**:
   - Button → Button2 (variant="primary")
   - Input → Input2
   - Task cards → TaskItem2
   - Weight badges → Badge2 (без иконок)

3. **Добавьте halo** для важных задач:
   ```tsx
   <Badge2 variant={weight} withHalo={weight === 'deep'}>
     {weight}
   </Badge2>
   ```

---

**Enjoy your custom Design System 2.0! 🎨**

# 🎨 Flow Design System 2.0 — CSS Classes Documentation

Полная документация по CSS классам Design System 2.0.

---

## 📦 Установка и использование

Все классы уже доступны в `styles.css`. Просто добавляйте классы к вашим компонентам.

```tsx
// Пример использования
<div className="glass-2 hover-lift">
  Content
</div>
```

---

## 🔮 Glassmorphism 2.0

### Базовые классы

| Класс | Описание | Пример |
|-------|----------|--------|
| `.glass-2` | Базовое стекло с noise + inner highlight | `<div className="glass-2">` |
| `.glass-2-elevated` | Приподнятое стекло с тенью | `<div className="glass-2-elevated">` |
| `.glass-2-active` | Активное стекло с evening glow | `<div className="glass-2-active">` |
| `.glass-2-dashed` | Пустое стекло с dashed border | `<div className="glass-2-dashed">` |

### Специализированные классы

| Класс | Описание |
|-------|----------|
| `.glass-header` | Glass для header (rounded-3xl + padding) |
| `.glass-btn` | Glass кнопка с hover эффектом |
| `.glass-card-2` | Альтернативное название для glass-2 |

### Эффекты

**Noise texture** — автоматически добавляется через `::before` псевдо-элемент  
**Inner highlight** — автоматически добавляется через `::after` псевдо-элемент

---

## 🎯 Hover Effects

### Hover Lift

```tsx
<div className="hover-lift">
  Поднимается на 4px при наведении
</div>

<div className="hover-lift-strong">
  Поднимается на 8px при наведении
</div>
```

| Класс | Эффект |
|-------|--------|
| `.hover-lift` | translateY(-4px) + shadow-lg |
| `.hover-lift-strong` | translateY(-8px) + shadow-2xl |

---

## 🌈 Gradient Borders

### Input Gradient

```tsx
<input className="input-gradient" />
<input className="input-gradient-focus" />
```

| Класс | Описание |
|-------|----------|
| `.input-gradient` | Статичный градиент (синий → жёлтый → белый) |
| `.input-gradient-focus` | Анимированный градиент при фокусе |

### Gradient Border Button

```tsx
<button className="gradient-border-btn">
  Кнопка с градиентной рамкой
</button>
```

---

## 🏷️ Badge 2.0

### Базовый класс

```tsx
<span className="badge-2 badge-2-md badge-focused">
  Focused
</span>
```

### Размеры

| Класс | Размер |
|-------|--------|
| `.badge-2-sm` | 10px font, xs/sm padding |
| `.badge-2-md` | 12px font, sm/md padding |

### Цветовые варианты

| Класс | Цвет |
|-------|------|
| `.badge-quick` | Emerald (#34d399) |
| `.badge-focused` | Blue (#60a5fa) |
| `.badge-deep` | Purple (#a78bfa) |
| `.badge-high` | Red (#f87171) |
| `.badge-medium` | Amber (#fbbf24) |
| `.badge-low` | Blue (#60a5fa) |

### Анимация

```tsx
<span className="badge-2 badge-pulse">
  Пульсирующий бейдж
</span>
```

---

## 📭 Empty States

```tsx
<div className="empty-state-2">
  <div className="empty-state-2-icon">
    <Icon size={32} />
  </div>
  <h3 className="empty-state-2-title">Title</h3>
  <p className="empty-state-2-description">Description</p>
</div>
```

| Класс | Описание |
|-------|----------|
| `.empty-state-2` | Контейнер с центрированием |
| `.empty-state-2-icon` | Круглая иконка (64px) |
| `.empty-state-2-title` | Заголовок (16px, normal weight) |
| `.empty-state-2-description` | Описание (14px, secondary color) |

---

## 🃏 Card Variants

| Класс | Описание |
|-------|----------|
| `.night-block` | Night block с оригинальным halo эффектом |
| `.night-block-inner` | Внутренний чёрный блок для night |
| `.card-active-evening` | Активный блок с evening glow |
| `.card-dashed` | Пустой блок с dashed border |

---

## 🎬 Animations

### Fade In

```tsx
<div className="animate-fade-in">
  Появляется с прозрачности
</div>
```

### Scale In

```tsx
<div className="animate-scale-in">
  Появляется с уменьшением
</div>
```

### Slide Up

```tsx
<div className="animate-slide-up">
  Выезжает снизу
</div>
```

### Swing (для будильника)

```tsx
<Icon className="animate-swing" />
```

---

## 📊 CSS Variables

Все классы используют CSS переменные из `:root`:

```css
/* Colors */
--bg-primary: #0a0a0a;
--text-primary: #ffffff;
--accent-evening: #d4a574;

/* Spacing */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 12px;

/* Radius */
--radius-xl: 20px;
--radius-2xl: 24px;
--radius-3xl: 32px;
--radius-4xl: 40px;

/* Shadows */
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--glow-evening: 0 0 40px rgba(212, 165, 116, 0.15);

/* Transitions */
--duration-normal: 200ms;
--easing-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

## 🎨 Примеры использования

### FocusPoint Card

```tsx
<div className="glass-2 p-6 mb-6" style={{
  borderRadius: '40px',
  border: '1px solid rgba(43, 72, 172, 0.6)',
  boxShadow: '-4px -4px 10px 0 rgba(129, 177, 213, 0.30) inset, 4px 4px 15px 0 rgba(160, 123, 78, 0.40)'
}}>
  <h3>Focus Point</h3>
</div>
```

### Header

```tsx
<header className="glass-header">
  <h1>Header</h1>
  <button className="glass-btn">Action</button>
</header>
```

### Task Item

```tsx
<div className="glass-2 p-4 hover-lift">
  <p>Task Title</p>
  <span className="badge-2 badge-2-sm badge-quick">Quick</span>
</div>
```

### Modal

```tsx
<div className="fixed inset-0 z-[110] flex items-end animate-in slide-in-from-bottom">
  <div className="w-full glass-2 rounded-t-[3rem] p-8" style={{
    background: 'rgba(15, 15, 15, 0.95)',
    borderRadius: '48px 48px 0 0',
  }}>
    <button className="glass-btn">Close</button>
  </div>
</div>
```

### Time Block

```tsx
<section className={`glass-2 p-6 transition-all duration-700`} style={{
  borderRadius: '40px',
  border: isActive ? '1px solid rgba(212, 165, 116, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: isActive ? '0 0 40px rgba(212, 165, 116, 0.15)' : undefined,
}}>
  <h2>Time Block</h2>
</section>
```

---

## 📋 Checklist для применения

- [ ] **Glass 2.0** — все карточки и модалки
- [ ] **Hover Lift** — интерактивные элементы
- [ ] **Badge 2.0** — все бейджи задач
- [ ] **Glass Btn** — все кнопки
- [ ] **Input Gradient** — все инпуты
- [ ] **Animations** — fade-in, slide-up для переходов

---

## 🔧 Утилиты

### Комбинирование классов

```tsx
// Glass + Hover + Active
<div className="glass-2 hover-lift glass-2-active">

// Badge + Pulse
<span className="badge-2 badge-focused badge-pulse">

// Header + Buttons
<header className="glass-header">
  <button className="glass-btn">
```

### Кастомные стили

CSS классы можно комбинировать с inline стилями:

```tsx
<div className="glass-2" style={{
  borderRadius: '40px',
  border: '1px solid rgba(43, 72, 172, 0.6)',
}}>
```

---

**Flow Design System 2.0 — Harmonize your code ✨**

---
Контекст проекта: Flow App
Слой системы: Визуальный (UI/UX)
Официальные спецификации:
- Дизайн-система Google M3: https://m3.material.io/
- Стилизация компонентов: https://react-spectrum.adobe.com/react-aria/react-aria-components.html
---

# Flow UI Implementation Rules (Material 3 + Tailwind)

## 1. Сетка и Анатомия Отступов (Layout & Spacing)
- **Базовый шаг:** Строгая сетка 4px. Все отступы (padding, margin), размеры элементов и расстояния между ними должны быть кратны 4.
- **Стандартные шаги Tailwind:** - `p-2` / `m-2` = 8px (микро-расстояния, иконки)
  - `p-4` / `m-4` = 16px (стандартный отступ внутри карточек)
  - `p-6` / `m-6` = 24px (крупные блоки, отступы экранов)
- **Плотность (Density):** Для списков задач во Flow использовать компактную сетку (разрывы 8px), чтобы минимизировать вертикальный скролл и снизить когнитивную нагрузку.

## 2. Геометрия и Формы (Shapes & Borders)
Мы следуем спецификации M3 по скруглению углов (Shape Scale):
- `rounded-none` (0px) — Край экрана десктопа.
- `rounded-m3-xs` (4px) — Тултипы, маленькие индикаторы.
- `rounded-m3-sm` (8px) — Чипсы (теги категорий), контекстные меню.
- `rounded-m3-md` (12px) — Карточки задач, блоки таймера фокуса.
- `rounded-m3-lg` (16px) — Навигационные панели (Bottom Navigation / Navigation Rail).
- `rounded-m3-xl` (28px) — Диалоговые окна, попапы.
- `rounded-full` (9999px) — Кнопки (Filled, Outlined, FAB), аватары.

## 3. Маппинг Цветовых Ролей (Color Roles Mapping)
Использовать исключительно токены из `src/theme/theme.json`. Произвольные HEX-коды запрещены.
- **Экран фокуса/Календарь:** Фон должен использовать `md.sys.color.surface-container-low` или `surface`, чтобы создавать ощущение «воздуха» и пространства.
- **Карточки активных задач:** `md.sys.color.surface-container-high`.
- **Текст заголовков:** `md.sys.color.on-surface` (максимальный контраст).
- **Второстепенный текст:** `md.sys.color.on-surface-variant` (приглушенный).

## 4. Типографика (Typography Scale)
- **Названия экранов/Крупные цифры таймера:** `typescale.display-large` или `headline-large`.
- **Заголовки задач в списке:** `typescale.title-medium` (шрифт без засечек, полужирный).
- **Описания задач/Заметки:** `typescale.body-small`.
- **Текст на кнопках/Индикаторы времени:** `typescale.label-large` (всегда uppercase или medium начертание для читаемости).
---
Контекст проекта: Flow App
Слой системы: Визуальный (UI/UX)
Официальные спецификации:
- Дизайн-система Google M3: https://m3.material.io/
- Стилизация компонентов: https://react-spectrum.adobe.com/react-aria/react-aria-components.html
---

> ⚠️ ТЕКУЩИЙ СТАТУС: Приложение в процессе миграции на M3.
> Компонентная библиотека: `src/components/ui/` (в разработке)
> Готовые компоненты: Button.tsx, FAB.tsx
> Токены: `src/theme/tokens.css` (актуально, использовать всегда)
> Тема: `src/theme/material-theme.json` (актуально)
> Структура: все исходники в `src/`, импорты относительные

---

# Flow UI Implementation Rules (Material 3 + Tailwind)

## 1. Сетка и Анатомия Отступов (Layout & Spacing)
- **Базовый шаг:** Строгая сетка 4px. Все отступы (padding, margin), размеры элементов и расстояния между ними должны быть кратны 4.
- **Стандартные шаги Tailwind:**
  - `p-2` / `m-2` = 8px (микро-расстояния, иконки)
  - `p-4` / `m-4` = 16px (стандартный отступ внутри карточек)
  - `p-6` / `m-6` = 24px (крупные блоки, отступы экранов)
- **Плотность (Density):** Для списков задач во Flow использовать компактную сетку (разрывы 8px), чтобы минимизировать вертикальный скролл.
- **Минимальный touch target:** 48×48px для любого интерактивного элемента.

## 2. Геометрия и Формы (Shapes & Borders)
Использовать CSS переменные из `src/theme/tokens.css`, не хардкоженные значения:

| Tailwind класс | CSS переменная | Размер | Применение |
|---|---|---|---|
| — | `--md-sys-shape-corner-none` | 0px | Край экрана десктопа |
| `rounded-m3-xs` | `--md-sys-shape-corner-extra-small` | 4px | Тултипы, маленькие индикаторы |
| `rounded-m3-sm` | `--md-sys-shape-corner-small` | 8px | Чипсы, контекстные меню |
| `rounded-m3-md` | `--md-sys-shape-corner-medium` | 12px | Карточки задач |
| `rounded-m3-lg` | `--md-sys-shape-corner-large` | 16px | FAB, навигационные панели |
| `rounded-m3-xl` | `--md-sys-shape-corner-extra-large` | 28px | Диалоги, Bottom Sheet |
| `rounded-full` | `--md-sys-shape-corner-full` | 9999px | Кнопки, аватары |

## 3. Маппинг Цветовых Ролей (Color Roles Mapping)
Использовать исключительно токены из `src/theme/tokens.css`.
Произвольные HEX-коды в компонентах **запрещены**.

### Системные роли M3:
- **Фон приложения:** `var(--md-sys-color-background)`
- **Поверхность карточек:** `var(--md-sys-color-surface-container)`
- **Карточки активных задач:** `var(--md-sys-color-surface-container-high)`
- **Экран с воздухом:** `var(--md-sys-color-surface-container-low)`
- **Текст заголовков:** `var(--md-sys-color-on-surface)`
- **Второстепенный текст:** `var(--md-sys-color-on-surface-variant)`
- **Акцент/Primary:** `var(--md-sys-color-primary)`
- **Текст на Primary:** `var(--md-sys-color-on-primary)`
- **Ошибки:** `var(--md-sys-color-error)`
- **Разделители:** `var(--md-sys-color-outline-variant)`

### Flow-специфичные роли (блоки дня):
- **Morning:** `var(--flow-block-morning)` — терракота #D4622A
- **Afternoon:** `var(--flow-block-afternoon)` — синий #1976D2
- **Evening:** `var(--flow-block-evening)` — пурпурный #7B3FC4
- **Night:** `var(--flow-block-night)` — индиго #37306B

### Flow-специфичные роли (веса задач):
- **Quick:** `var(--flow-weight-quick-container)` — мята #CCFCE3
- **Focused:** `var(--flow-weight-focused-container)` — лимон #FEF3C7
- **Deep:** `var(--flow-weight-deep-container)` — роза #FCE4F5

## 4. Типографика (Typography Scale)
Шрифт: **Inter** (подключён в index.html).
Все размеры через CSS переменные из `src/theme/tokens.css`.

| Применение | CSS переменная |
|---|---|
| Названия экранов | `--md-sys-typescale-headline-large-*` |
| Названия блоков дня | `--md-sys-typescale-title-large-*` |
| Заголовки задач | `--md-sys-typescale-title-medium-*` |
| Описания, заметки | `--md-sys-typescale-body-medium-*` |
| Текст на кнопках | `--md-sys-typescale-label-large-*` |
| Чипсы, бейджи | `--md-sys-typescale-label-medium-*` |
| Временные метки | `--md-sys-typescale-body-small-*` |

## 5. Компонентная Библиотека (src/components/ui/)
Всегда проверять наличие готового компонента перед созданием нового:

| Компонент | Статус | Применение |
|---|---|---|
| `Button.tsx` | ✅ готов | Все кнопки (filled/tonal/outlined/text) |
| `FAB.tsx` | ✅ готов | Голосовая кнопка, главные действия |
| `Switch.tsx` | 🔄 в плане | Тоглы в настройках |
| `Chip.tsx` | 🔄 в плане | Веса задач, фильтры |
| `BottomSheet.tsx` | 🔄 в плане | Модалки, панели |
| `ListItem.tsx` | 🔄 в плане | Строки задач |
| `NavigationBar.tsx` | 🔄 в плане | Bottom navigation |

## 6. Запрещённые Паттерны
- ❌ Хардкоженные HEX цвета в компонентах
- ❌ Хардкоженные px значения (только кратные 4)
- ❌ `backdrop-filter: blur()` — удалён, не использовать
- ❌ Glassmorphism классы (glass-card, glass-2 и т.д.) — удалены
- ❌ Импорты из корня проекта — все файлы в `src/`
- ❌ Создание нового UI элемента без проверки компонентной библиотеки

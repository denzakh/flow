import React, { useRef } from 'react';
import { useButton, useHover } from 'react-aria';
import { LayoutGrid, GalleryVertical, Moon, Sun } from 'lucide-react';
import { TRANSLATIONS } from '../../constants.tsx';

interface HeaderProps {
  currentTime: Date;
  user: { name: string } | null;
  language: keyof typeof TRANSLATIONS;
  isDarkTheme: boolean;
  isListView: boolean;
  onToggleTheme: () => void;
  onToggleView: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentTime,
  user,
  language,
  isDarkTheme,
  isListView,
  onToggleTheme,
  onToggleView,
}) => {
  const t = TRANSLATIONS[language];

  const getGreeting = () => {
    const hours = currentTime.getHours();
    if (hours < 12) return t.goodMorning;
    if (hours < 17) return t.goodAfternoon;
    if (hours < 21) return t.goodEvening;
    return t.goodNight;
  };

  return (
    <header
      className="flex items-start self-stretch"
      style={{
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingBottom: '16px',
        gap: '10px',
      }}
    >
      {/* Текстовая часть */}
      <div className="flex flex-col flex-1">
        <h1
          className="m-0"
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '33px',
            lineHeight: '40px',
            fontWeight: 600,
            letterSpacing: '-0.4px',
            color: 'var(--md-sys-color-primary)',
          }}
        >
          {getGreeting()}, {user?.name.split(' ')[0]}
        </h1>
      </div>

      {/* Кнопки переключения */}
      <div className="flex gap-2">
        {/* Toggle View (Сетка / Список) */}
        <ToggleIconButton
          isSelected={isListView}
          onPress={onToggleView}
          ariaLabel={isListView ? 'Switch to grid view' : 'Switch to list view'}
          selectedIcon={<GalleryVertical size={24} />}
          unselectedIcon={<LayoutGrid size={24} />}
        />

        {/* Toggle Theme (Темная / Светлая) */}
        <ToggleIconButton
          isSelected={isDarkTheme}
          onPress={onToggleTheme}
          ariaLabel={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
          selectedIcon={<Sun size={24} />}
          unselectedIcon={<Moon size={24} />}
        />
      </div>
    </header>
  );
};

// Компонент Toggle Icon Button с состояниями
interface ToggleIconButtonProps {
  isSelected: boolean;
  onPress: () => void;
  ariaLabel: string;
  selectedIcon: React.ReactNode;
  unselectedIcon: React.ReactNode;
}

const ToggleIconButton: React.FC<ToggleIconButtonProps> = ({
  isSelected,
  onPress,
  ariaLabel,
  selectedIcon,
  unselectedIcon,
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps, isPressed } = useButton({ onPress }, ref);
  const { hoverProps, isHovered } = useHover({});

  // Объединяем пропсы
  const combinedProps = {
    ...buttonProps,
    ...hoverProps,
    ref,
  };

  // Определяем форму заливки
  const getHoverBorderRadius = () => {
    if (isPressed) return '12px'; // Всегда квадратная при нажатии
    if (isSelected) return '9999px'; // Круглая когда selected
    return '12px'; // Квадратная когда unselected
  };

  return (
    <button
      {...combinedProps}
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        color: 'var(--md-sys-color-on-surface-variant)',
        transition: 'background-color 150ms ease',
      }}
    >
      {/* СЛОЙ 1: Selected background (постоянный, самый нижний) */}
      {isSelected && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: 'var(--md-sys-color-primary)',
            opacity: 0.08,
            zIndex: 0,
          }}
        />
      )}

      {/* СЛОЙ 2: Hover overlay (средний) */}
      {isHovered && (
        <div
          className="absolute inset-0"
          style={{
            borderRadius: getHoverBorderRadius(),
            backgroundColor: 'var(--md-sys-color-on-surface-variant)',
            opacity: isPressed ? 0.12 : 0.08, // Темнее при нажатии
            transition: 'border-radius 150ms ease, opacity 150ms ease',
            zIndex: 10,
          }}
        />
      )}

      {/* СЛОЙ 3: Иконка (верхний) */}
      <div className="relative z-20" style={{ width: '24px', height: '24px' }}>
        {isSelected ? selectedIcon : unselectedIcon}
      </div>
    </button>
  );
};

export default Header;
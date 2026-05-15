import React from 'react';
import { Calendar, CalendarDays, CalendarRange, CalendarClock } from 'lucide-react';
import { TRANSLATIONS } from '../../constants.tsx';

type ViewMode = 'day' | 'week' | 'month' | 'year';

interface ViewSwitcherProps {
  viewMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  language: keyof typeof TRANSLATIONS;
}

const VIEW_ICONS: Record<ViewMode, React.FC<{ size?: number; strokeWidth?: number }>> = {
  day: Calendar,
  week: CalendarDays,
  month: CalendarRange,
  year: CalendarClock,
};

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ viewMode, onModeChange, language }) => {
  const t = TRANSLATIONS[language];

  return (
    <nav
      className="flex justify-between items-center px-2 py-2"
      style={{
        height: '80px',
        background: 'var(--md-sys-color-surface-container)',
        borderRadius: 'var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-large) 0 0',
        boxShadow: 'var(--md-sys-elevation-2)',
      }}
      aria-label="View mode"
    >
      {(['day', 'week', 'month', 'year'] as ViewMode[]).map((mode) => {
        const Icon = VIEW_ICONS[mode];
        const isActive = viewMode === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => onModeChange(mode)}
            className="md-state-layer md-focus-ring relative flex flex-col items-center justify-center gap-1 flex-1 transition-colors duration-md-short4 ease-md-standard"
            style={{
              minHeight: '48px',
              minWidth: '48px',
              color: isActive
                ? 'var(--md-sys-color-on-secondary-container)'
                : 'var(--md-sys-color-on-surface-variant)',
            }}
          >
            {isActive && (
              <span
                className="absolute inset-x-auto"
                style={{
                  width: '64px',
                  height: '32px',
                  borderRadius: 'var(--md-sys-shape-corner-full)',
                  background: 'var(--md-sys-color-secondary-container)',
                  zIndex: 0,
                }}
              />
            )}
            <Icon size={24} className="relative z-[1]" />
            <span className="md-typescale-label-medium relative z-[1]">{t[mode]}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default ViewSwitcher;

import React from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from '../../utils/MaterialIcons';
import { TRANSLATIONS } from '../../constants.tsx';

interface DateNavigatorProps {
  viewDate: Date;
  viewMode: 'day' | 'week' | 'month' | 'year';
  todayStr: string;
  language: keyof typeof TRANSLATIONS;
  onNavigate: (direction: number) => void;
  onToday: () => void;
}

const DateNavigator: React.FC<DateNavigatorProps> = ({
  viewDate,
  viewMode,
  todayStr,
  language,
  onNavigate,
  onToday,
}) => {
  const t = TRANSLATIONS[language];

  const getTitle = () => {
    switch (viewMode) {
      case 'day':
        return todayStr === viewDate.toISOString().split('T')[0]
          ? t.today
          : viewDate.toLocaleDateString(language, { day: 'numeric', month: 'long' });
      case 'week':
        return `Week ${Math.ceil(viewDate.getDate() / 7)}`;
      case 'month':
        return viewDate.toLocaleDateString(language, { month: 'long', year: 'numeric' });
      case 'year':
        return viewDate.getFullYear().toString();
    }
  };

  const getSubtitle = () => {
    if (viewMode === 'day') {
      return viewDate.toLocaleDateString(language, { weekday: 'long' });
    }
    return t.upcoming;
  };

  const btnStyle: React.CSSProperties = {
    borderRadius: 'var(--md-sys-shape-corner-medium)',
    background: 'var(--md-sys-color-surface-container-high)',
    color: 'var(--md-sys-color-on-surface)',
    minWidth: '40px',
    minHeight: '40px',
  };

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex flex-col">
        <h2 className="md-typescale-title-large" style={{ color: 'var(--md-sys-color-on-surface)' }}>
          {getTitle()}
        </h2>
        <span className="md-typescale-label-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
          {getSubtitle()}
        </span>
      </div>
      <div className="flex gap-1">
        <button type="button" onClick={() => onNavigate(-1)} className="md-state-layer md-focus-ring flex items-center justify-center w-10 h-10 transition-all" style={btnStyle}>
          <ChevronLeft size={22} />
        </button>
        <button type="button" onClick={onToday} className="md-state-layer md-focus-ring flex items-center justify-center w-10 h-10 transition-all" style={btnStyle}>
          <RotateCcw size={22} />
        </button>
        <button type="button" onClick={() => onNavigate(1)} className="md-state-layer md-focus-ring flex items-center justify-center w-10 h-10 transition-all" style={btnStyle}>
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
};

export default DateNavigator;

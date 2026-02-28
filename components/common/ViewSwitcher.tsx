import React from 'react';
import { TRANSLATIONS } from '../../constants.tsx';

type ViewMode = 'day' | 'week' | 'month' | 'year';

interface ViewSwitcherProps {
  viewMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  language: keyof typeof TRANSLATIONS;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ viewMode, onModeChange, language }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="flex justify-between py-[10px] px-[10px] glass-2">
      {(['day', 'week', 'month', 'year'] as ViewMode[]).map(mode => (
        <button
          key={mode}
          onClick={() => onModeChange(mode)}
          className="text-[11px] font-black uppercase tracking-[0.15em] transition-all"
          style={{
            borderRadius: '16px',
            background: viewMode === mode ? '#0a0a0a' : 'transparent',
            boxShadow: viewMode === mode ? '0 10px 15px -3px rgba(16, 185, 129, 0.10), 0 4px 6px -4px rgba(16, 185, 129, 0.10)' : 'none',
            padding: '12px 20px',
            color: viewMode === mode ? '#ffffff' : '#a0a0a0',
            border: viewMode === mode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
            minWidth: '70px',
          }}
        >
          {t[mode]}
        </button>
      ))}
    </div>
  );
};

export default ViewSwitcher;

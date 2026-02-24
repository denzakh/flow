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
    <div className="flex justify-between py-[10px] px-[10px]" style={{
      borderRadius: '24px',
      border: '1px solid #2B48AC',
      background: 'rgba(1, 1, 1, 0.05)',
      boxShadow: '-4px -4px 10px 0 rgba(129, 177, 213, 0.30) inset, 4px 4px 15px 0 rgba(160, 123, 78, 0.40)'
    }}>
      {(['day', 'week', 'month', 'year'] as ViewMode[]).map(mode => (
        <button
          key={mode}
          onClick={() => onModeChange(mode)}
          className="text-[12px] font-black uppercase tracking-widest transition-all"
          style={{
            borderRadius: '16px',
            background: viewMode === mode ? '#000' : 'transparent',
            boxShadow: viewMode === mode ? '0 10px 15px -3px rgba(16, 185, 129, 0.10), 0 4px 6px -4px rgba(16, 185, 129, 0.10)' : 'none',
            padding: '10px 10px',
            color: viewMode === mode ? '#ffffff' : 'rgba(255, 255, 255, 0.40)'
          }}
        >
          {t[mode]}
        </button>
      ))}
    </div>
  );
};

export default ViewSwitcher;

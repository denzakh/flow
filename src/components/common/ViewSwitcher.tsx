import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Check } from 'lucide-react';
import { TRANSLATIONS } from '../../constants.tsx';

type ViewMode = 'day' | 'week' | 'month' | 'year';

interface ViewSwitcherProps {
  viewMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  language: keyof typeof TRANSLATIONS;
}

const VIEW_MODES: ViewMode[] = ['day', 'week', 'month', 'year'];


const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ viewMode, onModeChange, language }) => {
  const t = TRANSLATIONS[language];

  const handleChange = (_event: React.MouseEvent<HTMLElement>, newMode: ViewMode | null) => {
    if (newMode !== null) {
      onModeChange(newMode);
    }
  };

  return (
    <ToggleButtonGroup
      value={viewMode}
      exclusive
      onChange={handleChange}
      aria-label="View mode"
      sx={{
        display: 'flex',
        backgroundColor: 'transparent',
        borderRadius: '9999px', // ← Pill shape
        border: '1px solid var(--md-sys-color-outline)',
        overflow: 'hidden',
        '& .MuiToggleButtonGroup-grouped': {
          border: 'none',
          borderRadius: '0 !important',
          margin: 0,
          flex: 1,
          minHeight: '40px',
          padding: '0 16px',
          gap: '6px',
          color: 'var(--md-sys-color-on-surface)',
          textTransform: 'none',
          fontSize: '14px',
          fontWeight: 500,
          backgroundColor: 'transparent',
          '&:not(:last-of-type)': {
            borderRight: '1px solid var(--md-sys-color-outline)',
          },
          '&:first-of-type': {
            borderRadius: '9999px 0 0 9999px !important', // ← Левый край pill
          },
          '&:last-of-type': {
            borderRadius: '0 9999px 9999px 0 !important', // ← Правый край pill
          },
          '&.Mui-selected': {
            backgroundColor: 'var(--md-sys-color-secondary-container)',
            color: 'var(--md-sys-color-on-secondary-container)',
          },
          '&:hover': {
            backgroundColor: 'var(--md-sys-color-surface-container)',
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'var(--md-sys-color-secondary-container)',
          },
        },
      }}
    >
      {VIEW_MODES.map((mode) => (
        <ToggleButton
          key={mode}
          value={mode}
        >
          {mode === viewMode && <Check size={18} />}
          <span>{t[mode]}</span>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default ViewSwitcher;
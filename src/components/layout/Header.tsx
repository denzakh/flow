import React from 'react';
import FAB from '../ui/FAB';
import { Mic } from 'lucide-react';
import { Bell, Settings } from '../../utils/MaterialIcons';
import { UserSettings } from '../../types.ts';
import { TRANSLATIONS } from '../../constants.tsx';

interface HeaderProps {
  currentTime: Date;
  user: { name: string } | null;
  settings: UserSettings;
  alarmEnabled: boolean;
  onSettingsClick: () => void;
  onAlarmClick: () => void;
  language: keyof typeof TRANSLATIONS;
  isVoiceListening?: boolean;
  isVoiceSupported?: boolean;
  onVoiceClick?: () => void;
  isVoiceEnabled?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  currentTime,
  user,
  settings,
  alarmEnabled,
  onSettingsClick,
  onAlarmClick,
  language,
  isVoiceListening = false,
  isVoiceSupported = false,
  onVoiceClick,
  isVoiceEnabled = false,
}) => {
  const t = TRANSLATIONS[language];

  const getGreeting = () => {
    const hours = currentTime.getHours();
    if (hours < 12) return t.goodMorning;
    if (hours < 17) return t.goodAfternoon;
    if (hours < 21) return t.goodEvening;
    return t.goodNight;
  };

  const formattedDate = currentTime.toLocaleDateString(language, {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  return (
    <header
      className="mb-6 p-4"
      style={{
        background: 'var(--md-sys-color-surface-container)',
        borderRadius: 'var(--md-sys-shape-corner-large)',
        boxShadow: 'var(--md-sys-elevation-1)',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span
            className="md-typescale-label-medium mb-1"
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            {formattedDate}
          </span>
          <h1 className="md-typescale-headline-medium" style={{ color: 'var(--md-sys-color-on-surface)' }}>
            {getGreeting()}, {user?.name.split(' ')[0]}
          </h1>
        </div>
        <div className="flex gap-2">
          {isVoiceSupported && onVoiceClick && isVoiceEnabled && (
            <FAB
              size="small"
              icon={<Mic size={20} />}
              onPress={onVoiceClick}
              isListening={isVoiceListening}
              aria-label={isVoiceListening ? 'Stop listening' : 'Start voice control'}
              color="surface"
            />
          )}
          <button
            type="button"
            onClick={onAlarmClick}
            className={`md-state-layer md-focus-ring flex items-center justify-center w-12 h-12 ${alarmEnabled ? 'alarm-active' : ''
              }`}
            style={{
              borderRadius: 'var(--md-sys-shape-corner-full)',
              background: alarmEnabled
                ? 'var(--md-sys-color-primary-container)'
                : 'var(--md-sys-color-surface-container-high)',
              color: alarmEnabled
                ? 'var(--md-sys-color-on-primary-container)'
                : 'var(--md-sys-color-on-surface)',
              minWidth: '48px',
              minHeight: '48px',
            }}
          >
            <Bell size={22} className={alarmEnabled ? 'animate-swing' : ''} />
          </button>
          <button
            type="button"
            onClick={onSettingsClick}
            className="md-state-layer md-focus-ring flex items-center justify-center w-12 h-12"
            style={{
              borderRadius: 'var(--md-sys-shape-corner-full)',
              background: 'var(--md-sys-color-surface-container-high)',
              color: 'var(--md-sys-color-on-surface)',
              minWidth: '48px',
              minHeight: '48px',
            }}
          >
            <Settings size={22} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
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
}

const Header: React.FC<HeaderProps> = ({
  currentTime,
  user,
  settings,
  alarmEnabled,
  onSettingsClick,
  onAlarmClick,
  language
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
    month: 'short'
  });

  return (
    <header className="glass-header mb-6">
      <div className="flex items-center justify-between" style={{ position: 'relative', zIndex: 1 }}>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase text-white tracking-[0.2em]">
              {formattedDate}
            </span>
          </div>
          <h1 className="text-3xl font-light text-white tracking-tighter">
            {getGreeting()}, {user?.name.split(' ')[0]}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onAlarmClick}
            className={`glass-btn w-12 h-12 flex items-center justify-center ${
              alarmEnabled ? 'alarm-active' : ''
            }`}
          >
            <Bell size={22} className={alarmEnabled ? 'animate-swing' : ''} />
          </button>
          <button
            onClick={onSettingsClick}
            className="glass-btn w-12 h-12 flex items-center justify-center"
          >
            <Settings size={22} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

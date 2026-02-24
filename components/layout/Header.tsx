import React from 'react';
import { Bell, Settings } from 'lucide-react';
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
    <header className="flex items-center justify-between mb-12">
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
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
            alarmEnabled ? 'alarm-active text-white' : 'bg-[#0a0a0a] text-white'
          }`}
        >
          <Bell size={22} className={alarmEnabled ? 'animate-[swing_2s_ease-in-out_infinite]' : ''} />
        </button>
        <button
          onClick={onSettingsClick}
          className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#0a0a0a] text-white transition-all"
        >
          <Settings size={22} />
        </button>
      </div>
    </header>
  );
};

export default Header;

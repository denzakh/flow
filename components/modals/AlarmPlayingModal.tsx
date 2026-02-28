import React from 'react';
import { Bell } from '../../utils/MaterialIcons';
import { UserSettings, Language } from '../../types.ts';
import { TRANSLATIONS, RECOVERY_TIPS } from '../../constants.tsx';

interface AlarmPlayingModalProps {
  settings: UserSettings;
  onStop: () => void;
  onSnooze: () => void;
}

const AlarmPlayingModal: React.FC<AlarmPlayingModalProps> = ({
  settings,
  onStop,
  onSnooze
}) => {
  const t = TRANSLATIONS[settings.language];
  const tipIndex = Math.floor(new Date().getHours() / 5) % 5;
  const tip = RECOVERY_TIPS[settings.language][tipIndex];

  return (
    <div className="fixed inset-0 z-[100] glass-2 flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500" style={{
      background: 'rgba(10, 10, 10, 0.95)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    }}>
      <div className="w-32 h-32 bg-[#0a0a0a] rounded-full flex items-center justify-center mb-12 animate-bounce shadow-lg">
        <Bell size={64} className="text-white animate-pulse" />
      </div>
      <h2 className="text-4xl font-light text-white mb-4">{t.flowStart}</h2>
      <p className="text-white font-bold mb-12 text-sm max-w-md">"{tip}"</p>
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <button
          onClick={onStop}
          className="glass-btn w-full py-5 text-white rounded-3xl font-black shadow-xl active:scale-95 transition-all"
        >
          {t.enterThread}
        </button>
        <button
          onClick={onSnooze}
          className="glass-btn w-full py-5 text-white rounded-3xl font-black active:scale-95 transition-all"
        >
          {t.snooze}
        </button>
      </div>
    </div>
  );
};

export default AlarmPlayingModal;

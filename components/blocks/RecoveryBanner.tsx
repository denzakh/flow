import React from 'react';
import { BedDouble, Sparkles } from 'lucide-react';
import { RECOVERY_TIPS } from '../../constants.tsx';

interface RecoveryBannerProps {
  isWindDown: boolean;
  currentTime: Date;
  language: 'en' | 'ru' | 'es';
}

const RecoveryBanner: React.FC<RecoveryBannerProps> = ({
  isWindDown,
  currentTime,
  language
}) => {
  const tipIndex = Math.floor(currentTime.getHours() / 5) % 5;
  const tip = RECOVERY_TIPS[language][tipIndex];

  return (
    <div className={`p-6 rounded-[2.5rem] flex items-center gap-5 transition-all duration-[2000ms] ${
      isWindDown ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'
    }`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${
        isWindDown ? 'bg-indigo-500/20 text-white' : 'bg-emerald-500/20 text-white'
      }`}>
        {isWindDown ? <BedDouble size={22} /> : <Sparkles size={22} />}
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-light uppercase tracking-widest mb-1 text-white">
          {isWindDown ? 'Good Night' : 'Neural Recovery Active'}
        </h3>
        <p className="text-[11px] font-bold text-white leading-relaxed italic">
          "{tip}"
        </p>
      </div>
    </div>
  );
};

export default RecoveryBanner;

import React from 'react';
import { Moon, Sparkles } from 'lucide-react';
import { RECOVERY_TIPS } from '../../constants.tsx';

interface RecoveryBannerProps {
  isWindDown: boolean;
  currentTime: Date;
  language: 'en' | 'ru' | 'es';
}

const RecoveryBanner: React.FC<RecoveryBannerProps> = ({ isWindDown, currentTime, language }) => {
  const tipIndex = Math.floor(currentTime.getHours() / 5) % 5;
  const tip = RECOVERY_TIPS[language][tipIndex];

  return (
    <div
      className="p-6 flex items-center gap-5 transition-all duration-[2000ms]"
      style={{
        borderRadius: 'var(--md-sys-shape-corner-extra-large)',
        background: isWindDown ? 'var(--flow-block-evening-container)' : 'var(--flow-weight-quick-container)',
        border: `1px solid ${isWindDown ? 'var(--flow-block-evening)' : 'var(--flow-weight-quick)'}`,
      }}
    >
      <div
        className="w-14 h-14 flex items-center justify-center"
        style={{
          borderRadius: 'var(--md-sys-shape-corner-large)',
          background: isWindDown ? 'var(--flow-block-evening)' : 'var(--flow-weight-quick)',
          color: '#ffffff',
        }}
      >
        {isWindDown ? <Moon size={22} /> : <Sparkles size={22} />}
      </div>
      <div className="flex-1">
        <h3
          className="md-typescale-title-medium mb-1"
          style={{ color: isWindDown ? 'var(--flow-block-evening-on-container)' : 'var(--flow-weight-quick-on-container)' }}
        >
          {isWindDown ? 'Good Night' : 'Neural Recovery Active'}
        </h3>
        <p
          className="md-typescale-body-medium italic leading-relaxed"
          style={{ color: isWindDown ? 'var(--flow-block-evening-on-container)' : 'var(--flow-weight-quick-on-container)' }}
        >
          &ldquo;{tip}&rdquo;
        </p>
      </div>
    </div>
  );
};

export default RecoveryBanner;

import React from 'react';
import { X, LogOut, AlertCircle } from '../../utils/MaterialIcons';
import { UserSettings, AlarmConfig, Language } from '../../types.ts';
import { TRANSLATIONS } from '../../constants.tsx';

interface SettingsModalProps {
  settings: UserSettings;
  tempWake: string;
  tempRest: string;
  tempLang: Language;
  tempAlarm: AlarmConfig;
  error: string | null;
  onSave: () => void;
  onClose: () => void;
  onLogout: () => void;
  onTempWakeChange: (value: string) => void;
  onTempRestChange: (value: string) => void;
  onTempLangChange: (lang: Language) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  tempWake,
  tempRest,
  tempLang,
  tempAlarm,
  error,
  onSave,
  onClose,
  onLogout,
  onTempWakeChange,
  onTempRestChange,
  onTempLangChange
}) => {
  const t = TRANSLATIONS[settings.language];

  return (
    <div className="fixed inset-0 z-[110] flex items-end animate-in slide-in-from-bottom duration-500">
      <div className="w-full glass-2 rounded-t-[3rem] p-8 pb-12 shadow-2xl space-y-10 border-t border-white/5" style={{
        background: 'rgba(15, 15, 15, 0.95)',
        borderRadius: '48px 48px 0 0',
      }}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-light text-white tracking-tighter">{t.settings}</h2>
          <button
            onClick={onClose}
            className="glass-btn w-10 h-10 flex items-center justify-center"
          >
            <X size={22} />
          </button>
        </div>

        <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-white/60 tracking-widest">
                {t.morning} Start
              </label>
              <input
                type="time"
                value={tempWake}
                onChange={e => onTempWakeChange(e.target.value)}
                className="w-full p-4 bg-[#0a0a0a] rounded-2xl border border-white/10 font-bold text-white focus:border-white/20 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-white/60 tracking-widest">
                {t.night} Rest
              </label>
              <input
                type="time"
                value={tempRest}
                onChange={e => onTempRestChange(e.target.value)}
                className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 font-bold text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-white/60 tracking-widest">{t.language}</label>
            <div className="grid grid-cols-3 gap-2">
              {(['en', 'ru', 'es'] as Language[]).map(l => (
                <button
                  key={l}
                  onClick={() => onTempLangChange(l)}
                  className={`py-3 rounded-xl text-[10px] font-black uppercase ${
                    tempLang === l ? 'bg-[#0a0a0a] text-white' : 'bg-white/5 text-white/40'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-col gap-3">
            <button
              onClick={onSave}
              className="glass-btn w-full py-5 text-white rounded-3xl font-black shadow-xl active:scale-95 transition-all"
            >
              {t.save}
            </button>
            <button
              onClick={onLogout}
              className="w-full py-5 text-rose-400 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/10 rounded-3xl transition-all flex items-center justify-center gap-2 glass-btn"
            >
              <LogOut size={14} /> {t.rhythm === 'Your Rhythm' ? 'Log Out' : t.rhythm}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-rose-400 text-[10px] font-bold">
              <AlertCircle size={14} /> {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

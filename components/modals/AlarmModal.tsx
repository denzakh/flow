import React from 'react';
import { X, Bell, ChevronDown } from 'lucide-react';
import { UserSettings, AlarmConfig, Language } from '../../types.ts';
import { TRANSLATIONS, ALARM_SOUNDS } from '../../constants.tsx';

interface AlarmModalProps {
  settings: UserSettings;
  tempAlarm: AlarmConfig;
  onSave: () => void;
  onClose: () => void;
  onTempAlarmChange: (alarm: AlarmConfig) => void;
}

const AlarmModal: React.FC<AlarmModalProps> = ({
  settings,
  tempAlarm,
  onSave,
  onClose,
  onTempAlarmChange
}) => {
  const t = TRANSLATIONS[settings.language];

  return (
    <div className="fixed inset-0 z-[110] glass-container flex items-end animate-in slide-in-from-bottom duration-500">
      <div className="w-full bg-[#0f0f0f] rounded-t-[3rem] p-8 pb-12 shadow-2xl space-y-10 border-t border-white/5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-light text-white tracking-tighter">{t.alarm}</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#0a0a0a] text-white transition-all"
          >
            <X size={22} />
          </button>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between p-6 bg-white/5 rounded-[2.5rem]">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                tempAlarm.enabled ? 'bg-[#0a0a0a] text-white shadow-lg' : 'bg-white/10 text-white/30'
              }`}>
                <Bell size={22} />
              </div>
              <div>
                <h3 className="text-sm font-light uppercase tracking-widest">{t.enableAlarm}</h3>
                <span className="text-[10px] font-bold text-white/40">Smooth wake-up sequence</span>
              </div>
            </div>
            <button
              onClick={() => onTempAlarmChange({ ...tempAlarm, enabled: !tempAlarm.enabled })}
              className={`w-14 h-8 rounded-full transition-colors relative ${
                tempAlarm.enabled ? 'bg-[#0a0a0a]' : 'bg-white/10'
              }`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                tempAlarm.enabled ? 'left-7' : 'left-1'
              } shadow-sm`} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 items-center">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-white/40 tracking-widest">Wake Time</label>
              <input
                type="time"
                value={tempAlarm.time}
                onChange={e => onTempAlarmChange({ ...tempAlarm, time: e.target.value })}
                className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 font-black text-2xl text-white focus:ring-0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-white/40 tracking-widest">{t.sound}</label>
              <div className="relative group">
                <select
                  value={tempAlarm.sound}
                  onChange={e => onTempAlarmChange({ ...tempAlarm, sound: e.target.value })}
                  className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 font-bold text-white appearance-none focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                >
                  {ALARM_SOUNDS.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.label[settings.language as keyof typeof s.label]}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
              </div>
            </div>
          </div>

          <button
            onClick={onSave}
            className="w-full py-5 bg-[#0a0a0a] text-white rounded-3xl font-black shadow-xl active:scale-95 transition-all"
          >
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlarmModal;

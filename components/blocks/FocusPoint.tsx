import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Repeat, Check, Clock, Plus, Zap, Target, Layers } from '../../utils/MaterialIcons';
import { TimePeriod, TaskWeight, Recurrence, Language } from '../../types.ts';
import { WEIGHT_CONFIG, TRANSLATIONS } from '../../constants.tsx';
import { suggestWeight } from '../../services/taskOptimizer.ts';

interface FocusPointProps {
  onTaskAdd: (title: string, periods: TimePeriod[], recurrence: Recurrence, weight: TaskWeight) => void;
  selectedWeight: TaskWeight;
  selectedPeriods: TimePeriod[];
  selectedRecurrence: Recurrence;
  isInputFocused: boolean;
  onWeightChange: (weight: TaskWeight) => void;
  onPeriodToggle: (period: TimePeriod) => void;
  onRecurrenceChange: (recurrence: Recurrence) => void;
  onInputFocusChange: (focused: boolean) => void;
  language: Language;
}

const FocusPoint: React.FC<FocusPointProps> = ({
  onTaskAdd,
  selectedWeight,
  selectedPeriods,
  selectedRecurrence,
  isInputFocused,
  onWeightChange,
  onPeriodToggle,
  onRecurrenceChange,
  onInputFocusChange,
  language
}) => {
  const t = TRANSLATIONS[language];
  const [taskTitle, setTaskTitle] = useState('');
  const [isRecurrenceMenuOpen, setIsRecurrenceMenuOpen] = useState(false);
  const taskInputRef = useRef<HTMLInputElement>(null);

  // Автоматическая рекомендация веса задачи на основе эвристик
  useEffect(() => {
    const currentTitle = taskTitle.trim();
    if (currentTitle.length > 3) {
      const weight = suggestWeight(currentTitle);
      onWeightChange(weight);
    }
  }, [taskTitle, onWeightChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const periodsToUse = selectedRecurrence === 'all-blocks'
      ? [TimePeriod.MORNING, TimePeriod.AFTERNOON, TimePeriod.EVENING]
      : selectedPeriods;

    onTaskAdd(taskTitle, periodsToUse, selectedRecurrence, selectedWeight);
    setTaskTitle('');
    onRecurrenceChange('none');
    onPeriodToggle(TimePeriod.MORNING);
  };

  const weights = ['quick', 'focused', 'deep'] as TaskWeight[];

  return (
    <div className="glass-2 mb-6" style={{
      borderRadius: '40px',
      padding: '24px',
    }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="px-2 mb-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">{t.addPoint}</h3>
        </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={`relative group ${isInputFocused ? 'input-gradient-focus' : 'input-gradient'}`}>
          <input
            ref={taskInputRef}
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            onFocus={() => onInputFocusChange(true)}
            onBlur={() => onInputFocusChange(false)}
            placeholder="What's next?"
            className="w-full bg-[#0a0a0a] border-0 rounded-[24px] py-5 pl-6 pr-[110px] text-sm font-bold text-white placeholder:text-white shadow-sm focus:ring-0 focus:outline-none transition-all outline-none"
            style={{ height: '66px' }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRecurrenceMenuOpen(!isRecurrenceMenuOpen)}
                className="w-[46px] h-[46px] rounded-[16px] flex items-center justify-center transition-all bg-transparent text-white hover:bg-white/5"
              >
                <Repeat size={22} />
              </button>
              {isRecurrenceMenuOpen && (
                <div className="absolute bottom-full right-0 mb-3 w-48 glass-container rounded-3xl overflow-hidden py-3 shadow-2xl z-30">
                  {(['none', 'daily', 'weekly', 'monthly', 'all-blocks'] as Recurrence[]).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => { onRecurrenceChange(r); setIsRecurrenceMenuOpen(false); }}
                      className={`w-full text-left px-5 py-3 text-xs font-black flex items-center justify-between transition-colors ${
                        selectedRecurrence === r ? 'text-emerald-400 bg-emerald-500/10' : 'text-white/60 hover:bg-white/5'
                      }`}
                    >
                      {t[`rec_${r === 'all-blocks' ? 'all_blocks' : r}` as keyof typeof t]}
                      {selectedRecurrence === r && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-[46px] h-[46px] bg-[#000000] text-white rounded-[16px] shadow-lg active:scale-90 transition-all flex items-center justify-center"
              style={{ boxShadow: '0 0 5px 0 #45556C inset' }}
            >
              <Plus size={22} />
            </button>
          </div>
        </div>

        <div className="space-y-3 px-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Effort Weight</span>
          </div>
          
          <div className="flex gap-2">
            {weights.map(w => {
              const info = WEIGHT_CONFIG[w];
              const Icon = info.icon;
              const isSelected = selectedWeight === w;
              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => onWeightChange(w)}
                  className={`glass-btn flex-1 py-3 rounded-2xl flex flex-col items-center gap-1 transition-all ${
                    isSelected ? 'shadow-md' : 'opacity-60'
                  }`}
                >
                  <Icon size={22} style={{ color: isSelected ? '#ffffff' : 'inherit' }} />
                  <span className="text-[9px] font-black uppercase tracking-tighter" style={{ color: isSelected ? '#ffffff' : 'inherit' }}>
                    {info.label} ({info.points})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {selectedRecurrence !== 'all-blocks' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock size={12} className="text-white/30" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Target Flow Blocks</span>
            </div>
            <div className="flex gap-2">
              {[TimePeriod.MORNING, TimePeriod.AFTERNOON, TimePeriod.EVENING].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPeriodToggle(p)}
                  className={`glass-btn flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    selectedPeriods.includes(p)
                      ? 'text-white'
                      : 'text-white/40'
                  }`}
                >
                  {t[p as keyof typeof t]}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
      </div>
    </div>
  );
};

export default FocusPoint;

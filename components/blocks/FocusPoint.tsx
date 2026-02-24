import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Repeat, Check, Clock, Plus, Zap, Target, Layers } from 'lucide-react';
import { TimePeriod, TaskWeight, Recurrence, Language } from '../../types.ts';
import { WEIGHT_CONFIG, TRANSLATIONS } from '../../constants.tsx';
import { suggestWeight } from '../../services/geminiService.ts';

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
  const [isSuggestingWeight, setIsSuggestingWeight] = useState(false);
  const taskInputRef = useRef<HTMLInputElement>(null);
  const titleTimeoutRef = useRef<number | null>(null);

  // AI weight suggestion
  useEffect(() => {
    let isMounted = true;
    const currentTitle = taskTitle.trim();

    if (currentTitle.length > 3) {
      if (titleTimeoutRef.current) clearTimeout(titleTimeoutRef.current);

      titleTimeoutRef.current = window.setTimeout(async () => {
        if (!isMounted) return;
        setIsSuggestingWeight(true);
        try {
          const weight = await suggestWeight(currentTitle);
          if (isMounted && taskTitle.trim() === currentTitle) {
            onWeightChange(weight);
          }
        } catch (err) {
          console.warn("Weight suggestion failed", err);
        } finally {
          if (isMounted) setIsSuggestingWeight(false);
        }
      }, 1000);
    }

    return () => {
      isMounted = false;
      if (titleTimeoutRef.current) clearTimeout(titleTimeoutRef.current);
    };
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
    <div className="glass-container p-6 rounded-[2.5rem] space-y-6" style={{
      borderRadius: '40px',
      border: '1px solid #2B48AC',
      background: 'rgba(1, 1, 1, 0.05)',
      boxShadow: '-4px -4px 10px 0 rgba(129, 177, 213, 0.30) inset, 4px 4px 15px 0 rgba(160, 123, 78, 0.40)'
    }}>
      <div className="px-2">
        <h3 className="text-xs font-light uppercase tracking-widest text-white">{t.addPoint}</h3>
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
            {isSuggestingWeight && <span className="text-[9px] font-bold text-emerald-400 animate-pulse italic">Thinking...</span>}
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
                  className={`flex-1 py-3 rounded-2xl flex flex-col items-center gap-1 border transition-all ${
                    isSelected ? 'bg-[#0a0a0a] border-white/20 shadow-md' : 'bg-[#0a0a0a] border-transparent opacity-60'
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
                  className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    selectedPeriods.includes(p)
                      ? 'bg-[#0a0a0a] text-white shadow-lg scale-100'
                      : 'bg-[#0a0a0a] text-white/40 scale-95 opacity-60'
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
  );
};

export default FocusPoint;

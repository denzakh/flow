import React, { useState, useEffect, useRef } from 'react';
import { Repeat, Check, Clock, Zap, Target, Layers } from '../../utils/MaterialIcons';
import { Plus } from 'lucide-react';
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
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [taskTitle, setTaskTitle] = useState('');
  const [isRecurrenceMenuOpen, setIsRecurrenceMenuOpen] = useState(false);
  const taskInputRef = useRef<HTMLInputElement>(null);

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

    const periodsToUse =
      selectedRecurrence === 'all-blocks'
        ? [TimePeriod.MORNING, TimePeriod.AFTERNOON, TimePeriod.EVENING]
        : selectedPeriods;

    onTaskAdd(taskTitle, periodsToUse, selectedRecurrence, selectedWeight);
    setTaskTitle('');
    onRecurrenceChange('none');
    onPeriodToggle(TimePeriod.MORNING);
  };

  const weights = ['quick', 'focused', 'deep'] as TaskWeight[];

  return (
    <div
      className="mb-6"
      style={{
        background: 'var(--md-sys-color-surface-container-low)',
        borderRadius: 'var(--md-sys-shape-corner-extra-large)',
        padding: '24px',
        boxShadow: 'var(--md-sys-elevation-1)',
      }}
    >
      <div className="px-2 mb-4">
        <h3 className="md-typescale-label-large" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
          {t.addPoint}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            ref={taskInputRef}
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            onFocus={() => onInputFocusChange(true)}
            onBlur={() => onInputFocusChange(false)}
            placeholder="What's next?"
            className={`md-typescale-body-large w-full md-focus-ring transition-all duration-md-short3 ease-md-standard ${
              isInputFocused ? 'pt-6 pb-3' : 'py-4'
            }`}
            style={{
              background: 'var(--md-sys-color-surface-container-highest)',
              color: 'var(--md-sys-color-on-surface)',
              borderRadius: `${isInputFocused ? 'var(--md-sys-shape-corner-extra-small)' : 'var(--md-sys-shape-corner-extra-small)'} ${isInputFocused ? 'var(--md-sys-shape-corner-extra-small)' : 'var(--md-sys-shape-corner-extra-small)'} 0 0`,
              border: 'none',
              borderBottom: `2px solid ${isInputFocused ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline-variant)'}`,
              paddingLeft: '16px',
              paddingRight: '110px',
            }}
          />
          {isInputFocused && (
            <label
              className="md-typescale-label-small absolute left-4 top-2 pointer-events-none"
              style={{ color: 'var(--md-sys-color-primary)' }}
            >
              What's next?
            </label>
          )}

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRecurrenceMenuOpen(!isRecurrenceMenuOpen)}
                className="md-state-layer md-focus-ring w-10 h-10 flex items-center justify-center transition-colors duration-md-short4"
                style={{
                  borderRadius: 'var(--md-sys-shape-corner-large)',
                  color: 'var(--md-sys-color-on-surface-variant)',
                  minWidth: '40px',
                  minHeight: '40px',
                }}
              >
                <Repeat size={22} />
              </button>
              {isRecurrenceMenuOpen && (
                <div
                  className="absolute bottom-full right-0 mb-3 w-48 py-2 z-30"
                  style={{
                    background: 'var(--md-sys-color-surface-container-high)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    boxShadow: 'var(--md-sys-elevation-3)',
                  }}
                >
                  {(['none', 'daily', 'weekly', 'monthly', 'all-blocks'] as Recurrence[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        onRecurrenceChange(r);
                        setIsRecurrenceMenuOpen(false);
                      }}
                      className="md-state-layer w-full text-left px-5 py-3 md-typescale-body-medium flex items-center justify-between transition-colors duration-md-short4"
                      style={{
                        minHeight: '48px',
                        color:
                          selectedRecurrence === r
                            ? 'var(--md-sys-color-primary)'
                            : 'var(--md-sys-color-on-surface-variant)',
                        background:
                          selectedRecurrence === r ? 'var(--md-sys-color-primary-container)' : 'transparent',
                      }}
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
              className="md-state-layer md-focus-ring flex items-center justify-center transition-shadow duration-md-medium2 ease-md-decelerate hover:shadow-[var(--md-sys-elevation-4)]"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--md-sys-shape-corner-large)',
                background: 'var(--md-sys-color-primary)',
                color: 'var(--md-sys-color-on-primary)',
                boxShadow: 'var(--md-sys-elevation-3)',
              }}
              aria-label="Add task"
            >
              <Plus size={22} />
            </button>
          </div>
        </div>

        <div className="space-y-3 px-2">
          <span className="md-typescale-label-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            Effort Weight
          </span>

          <div className="flex gap-2 flex-wrap">
            {weights.map((w) => {
              const info = WEIGHT_CONFIG[w];
              const Icon = info.icon;
              const isSelected = selectedWeight === w;
              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => onWeightChange(w)}
                  className={`md-state-layer md-focus-ring inline-flex items-center gap-2 h-8 px-3 md-typescale-label-large transition-all duration-md-short4 ${
                    isSelected ? '' : ''
                  }`}
                  style={{
                    borderRadius: 'var(--md-sys-shape-corner-full)',
                    minHeight: '32px',
                    background: isSelected
                      ? 'var(--md-sys-color-primary-container)'
                      : 'transparent',
                    color: isSelected
                      ? 'var(--md-sys-color-on-primary-container)'
                      : 'var(--md-sys-color-on-surface-variant)',
                    border: isSelected ? 'none' : '1px solid var(--md-sys-color-outline-variant)',
                  }}
                >
                  {isSelected && <Check size={14} />}
                  <Icon size={18} />
                  {info.label} ({info.points})
                </button>
              );
            })}
          </div>
        </div>

        {selectedRecurrence !== 'all-blocks' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock size={12} style={{ color: 'var(--md-sys-color-on-surface-variant)' }} />
              <span className="md-typescale-label-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                Target Flow Blocks
              </span>
            </div>
            <div className="flex gap-2">
              {[TimePeriod.MORNING, TimePeriod.AFTERNOON, TimePeriod.EVENING].map((p) => {
                const selected = selectedPeriods.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onPeriodToggle(p)}
                    className="md-state-layer md-focus-ring flex-1 py-3 md-typescale-label-large transition-all duration-md-short4"
                    style={{
                      borderRadius: 'var(--md-sys-shape-corner-full)',
                      minHeight: '32px',
                      background: selected
                        ? 'var(--md-sys-color-primary-container)'
                        : 'transparent',
                      color: selected
                        ? 'var(--md-sys-color-on-primary-container)'
                        : 'var(--md-sys-color-on-surface-variant)',
                      border: selected ? 'none' : '1px solid var(--md-sys-color-outline-variant)',
                    }}
                  >
                    {t[p as keyof typeof t]}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default FocusPoint;

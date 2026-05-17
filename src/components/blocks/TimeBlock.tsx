import React from 'react';
import { LayoutGrid, Plus, AlertCircle } from '../../utils/MaterialIcons';
import { TimeBlockConfig, TimePeriod, Task, Language } from '../../types.ts';
import { BLOCK_CAPACITY, TRANSLATIONS } from '../../constants.tsx';
import TaskItem from '../TaskItem.tsx';
import { getIcon } from '../../constants.tsx';

interface TimeBlockProps {
  block: TimeBlockConfig;
  isActive: boolean;
  isPast: boolean;
  isNight: boolean;
  tasks: Task[];
  totalPoints: number;
  capacityPercent: number;
  isOverCapacity: boolean;
  onQuickAdd: () => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  language: Language;
}

const BLOCK_BG: Record<TimePeriod, string> = {
  [TimePeriod.MORNING]: 'var(--flow-block-morning-bg)',
  [TimePeriod.AFTERNOON]: 'var(--flow-block-afternoon-bg)',
  [TimePeriod.EVENING]: 'var(--flow-block-evening-bg)',
  [TimePeriod.NIGHT]: 'var(--flow-block-night-bg)',
};

const TimeBlock: React.FC<TimeBlockProps> = ({
  block,
  isActive,
  isPast,
  isNight,
  tasks,
  totalPoints,
  capacityPercent,
  isOverCapacity,
  onQuickAdd,
  onToggle,
  onDelete,
  onUpdate,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const isOverloaded = totalPoints > 10;
  const blockBg = BLOCK_BG[block.id];

  return (
    <section
      className={`block-card md-state-layer relative p-6 transition-shadow duration-md-medium2 ease-md-standard ${isActive ? 'border-l-[3px] border-l-white/90' : ''
        }`}
      style={{
        borderRadius: 'var(--md-sys-shape-corner-extra-large)',
        background: blockBg,
        boxShadow: isActive ? 'var(--md-sys-elevation-3)' : 'var(--md-sys-elevation-1)',
        color: 'var(--md-sys-color-on-surface)',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.boxShadow = 'var(--md-sys-elevation-2)';
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = isActive
          ? 'var(--md-sys-elevation-3)'
          : 'var(--md-sys-elevation-1)';
      }}
    >
      {isOverCapacity && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: 'var(--md-sys-shape-corner-extra-large)',
            border: '2px solid var(--flow-capacity-overload)',
            opacity: 0.35,
          }}
        />
      )}

      <div className="flex items-center justify-between mb-4 px-2 relative z-[1]">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 flex items-center justify-center"
            style={{
              borderRadius: 'var(--md-sys-shape-corner-full)',
              background: 'color-mix(in srgb, var(--md-sys-color-surface-container) 40%, transparent)',
            }}
          >
            {getIcon(block.icon, 'w-[22px] h-[22px]')}
          </div>
          <div>
            <h2 className="md-typescale-title-large" style={{ color: 'var(--md-sys-color-on-surface)' }}>{block.label}</h2>
            <span className="md-typescale-label-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              {block.startTime} — {block.endTime}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isNight && (
            <div className="flex flex-col items-end gap-1 min-w-[4rem]">
              <span
                className={`md-typescale-label-small ${isOverCapacity ? 'text-[var(--flow-capacity-overload)]' : ''}`}
                style={{ color: isOverCapacity ? undefined : 'color-mix(in srgb, var(--md-sys-color-on-surface) 80%, transparent)' }}
              >
                {totalPoints} / {BLOCK_CAPACITY}
              </span>
              <div
                className="w-full h-1 overflow-hidden"
                style={{
                  borderRadius: 'var(--md-sys-shape-corner-full)',
                  background: 'color-mix(in srgb, var(--md-sys-color-on-surface) 20%, transparent)',
                }}
              >
                <div
                  className="h-full transition-all duration-md-medium2 ease-md-standard"
                  style={{
                    width: `${Math.min(capacityPercent, 100)}%`,
                    borderRadius: 'var(--md-sys-shape-corner-full)',
                    background: isOverloaded
                      ? 'var(--flow-capacity-overload)'
                      : 'color-mix(in srgb, var(--md-sys-color-on-surface) 80%, transparent)',
                  }}
                />
              </div>
            </div>
          )}

          {!isNight && !isPast && (
            <button
              type="button"
              onClick={onQuickAdd}
              className="md-state-layer md-focus-ring w-10 h-10 flex items-center justify-center transition-opacity duration-md-short4 ease-md-standard"
              style={{
                borderRadius: 'var(--md-sys-shape-corner-full)',
                background: 'color-mix(in srgb, var(--md-sys-color-on-surface) 15%, transparent)',
                color: 'var(--md-sys-color-on-surface)',
                minWidth: '40px',
                minHeight: '40px',
              }}
              aria-label={t.addPoint}
            >
              <Plus size={22} />
            </button>
          )}
        </div>
      </div>

      {isOverCapacity && (
        <div
          className="mb-4 p-3 flex items-start gap-3"
          style={{
            borderRadius: 'var(--md-sys-shape-corner-medium)',
            background: 'color-mix(in srgb, var(--md-sys-color-on-surface) 12%, transparent)',
            border: '1px solid color-mix(in srgb, var(--md-sys-color-on-surface) 20%, transparent)',
          }}
        >
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <p className="md-typescale-label-medium leading-tight" style={{ color: 'var(--md-sys-color-on-surface)' }}>
            Your {block.label.toLowerCase()} looks a bit crowded. Remember to leave space for yourself.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <div key={task.id} className="task-enter task-enter-active">
              <TaskItem
                task={task}
                index={index + 1}
                lang={language}
                onToggle={onToggle}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            </div>
          ))
        ) : (
          <button
            type="button"
            onClick={() => (!isNight && !isPast ? onQuickAdd() : undefined)}
            className={`md-state-layer w-full py-8 flex flex-col items-center justify-center gap-2 transition-colors duration-md-short4 ease-md-standard group ${isNight ? '' : 'border-2 border-dashed hover:bg-white/[0.08]'
              }`}
            style={{
              borderRadius: 'var(--md-sys-shape-corner-extra-large)',
              borderColor: isNight ? undefined : 'color-mix(in srgb, var(--md-sys-color-on-surface) 25%, transparent)',
              minHeight: '48px',
            }}
          >
            {isNight ? (
              <>
                <img src="/assets/images/Background+Border+Shadow.png" alt="Rest" className="w-8 h-8 opacity-80" />
                <span className="md-typescale-label-medium" style={{ color: 'var(--md-sys-color-on-surface)' }}>Rest Phase</span>
              </>
            ) : (
              <>
                <LayoutGrid
                  size={24}
                  className="transition-transform duration-md-short4"
                  style={{ color: isActive ? 'color-mix(in srgb, var(--md-sys-color-on-surface) 50%, transparent)' : 'color-mix(in srgb, var(--md-sys-color-on-surface) 25%, transparent)' }}
                />
                <span className="md-typescale-label-medium" style={{ color: isActive ? 'color-mix(in srgb, var(--md-sys-color-on-surface) 60%, transparent)' : 'color-mix(in srgb, var(--md-sys-color-on-surface) 50%, transparent)' }}>
                  {isPast ? 'Wrapped' : isActive ? 'Open Flow' : 'Free Space'}
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
};

export default TimeBlock;

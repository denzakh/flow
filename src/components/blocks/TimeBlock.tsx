import React from 'react';
import { Grid, Plus, AlertTriangle } from 'lucide-react';
import { TimeBlockConfig, TimePeriod, Task, Language } from '../../types.ts';
import { BLOCK_CAPACITY, TRANSLATIONS } from '../../constants.tsx';
import TaskItem from '../TaskItem.tsx';
import BubbleBlock from './BubbleBlock.tsx';
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
  viewMode?: 'grid' | 'vertical';
}

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
  viewMode = 'grid',
}) => {
  const t = TRANSLATIONS[language];
  const periodId = block.id;
  const containerColor = `var(--flow-block-${periodId}-container)`;
  const onContainerColor = `var(--flow-block-${periodId}-on-container)`;
  const seedColor = `var(--flow-block-${periodId}-seed)`;
  const seedOnColor = `var(--flow-block-${periodId}-seed-on)`;
  const borderColor = `var(--flow-block-${periodId}-border)`;

  return (
    <section
      className={`relative p-1 ${viewMode === 'vertical' ? 'min-h-[228px] h-auto' : 'h-[228px]'} flex flex-col gap-2 transition-shadow duration-200 ${isActive ? 'border-l-[3px] border-l-white/90' : ''
        } shadow-md dark:shadow-none`}
      style={{
        borderRadius: '24px',
        background: containerColor,
        borderColor: isNight ? 'transparent' : borderColor,
        borderWidth: '1px',
        borderStyle: 'solid',
        animation: `block-appear 250ms var(--md-sys-motion-easing-emphasized-decel) both`,
      } as React.CSSProperties}
    >
      {/* Header Rows */}
      <div className="flex flex-col gap-2 px-3 pt-3">
        {/* Header Row 1: Time Range + Capacity */}
        <div className="flex justify-between items-center w-full">
          <span className="text-xs font-medium opacity-70 whitespace-nowrap" style={{ color: onContainerColor }}>
            {block.startTime} — {block.endTime}
          </span>
          {!isNight && (
            <span className="text-xs font-medium opacity-70 whitespace-nowrap" style={{ color: onContainerColor }}>
              {totalPoints} / {BLOCK_CAPACITY}
            </span>
          )}
        </div>

        {/* Header Row 2: Period Name */}
        <div>
          <span className="text-2xl font-semibold tracking-[-0.5px]" style={{ color: onContainerColor }}>
            {block.label}
          </span>
        </div>
      </div>

      {/* Progress Bar (visible for non-night periods) */}
      {!isNight && (
        <div className="flex flex-col items-start gap-1 min-w-[4rem] px-3">
          <div className="w-full h-1 overflow-hidden" style={{
            borderRadius: 'var(--md-sys-shape-corner-full)',
            background: seedOnColor,
            border: '0.2px solid var(--flow-block-${periodId}-on-container)',
          }}>
            <div className="h-full transition-all duration-md-medium2 ease-md-standard" style={{
              width: `${Math.min(capacityPercent, 100)}%`,
              borderRadius: 'var(--md-sys-shape-corner-full)',
              background: isOverCapacity ? 'var(--flow-capacity-overload)' : seedColor,
            }}>
            </div>
          </div>
        </div>
      )}

      {/* Content Slot */}
      <div className="flex-1 relative overflow-visible w-full rounded-b-[20px] rounded-t-none">
        {isNight ? (
          <div className="text-center pt-4 px-3">
            <p className="text-xl font-medium text-[var(--flow-block-night-on-container)] opacity-60">
              Wind down space. Rest well.
            </p>
          </div>
        ) : tasks.length > 0 ? (
          viewMode === 'grid' ? (
            <BubbleBlock
              tasks={tasks}
              isRecoveryMode={false}
              blockId={block.id}
              onBubbleClick={onToggle}
            />
          ) : (
            /* Заглушки для вертикального режима (будут заменены на TaskListItem позже) */
            <div className="flex flex-col gap-2 px-3 pb-12 pt-1">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className="h-14 w-full rounded-xl flex items-center px-4"
                  style={{ border: `1px solid var(--flow-block-${periodId}-on-container)` }}
                >
                  <div className="w-4 h-4 rounded-full mr-3 border opacity-50" />
                  <span className="text-sm font-medium opacity-80" style={{ color: onContainerColor }}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center pt-4 px-3">
            <div className="w-8 h-8 mx-auto mb-2">
              {block.id === 'morning' && getIcon('sunrise', 'w-8 h-8')}
              {block.id === 'afternoon' && getIcon('sun', 'w-8 h-8')}
              {block.id === 'evening' && getIcon('sunset', 'w-8 h-8')}
            </div>
            <p className="text-lg text-[var(--flow-block-${periodId}-on-container)] opacity-8">
              No tasks scheduled
            </p>
          </div>
        )}
      </div>

      {/* Inline Slot for overflow text - absolutely positioned */}
      <div className="absolute bottom-2 left-0 right-0 px-3 z-10 pointer-events-none flex justify-center">
        {isOverCapacity && (
          <p className="text-xs text-[var(--md-sys-color-error)] bg-[var(--md-sys-color-error-container)] px-2 py-0.5 rounded-md">
            Capacity exceeded
          </p>
        )}
      </div>
    </section>
  );
};

export default TimeBlock;
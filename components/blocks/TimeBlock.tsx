import React from 'react';
import { LayoutGrid, Plus, AlertCircle } from 'lucide-react';
import { TimeBlockConfig, TimePeriod, Task, TaskWeight, Language } from '../../types.ts';
import { WEIGHT_CONFIG, BLOCK_CAPACITY, TRANSLATIONS } from '../../constants.tsx';
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
  language
}) => {
  const t = TRANSLATIONS[language];

  return (
    <section className="transition-all duration-700 relative p-6 rounded-[2.5rem] night-block" style={{ opacity: 1, transform: 'scale(1)', zIndex: 10 }}>
      {isOverCapacity && (
        <div className="absolute top-0 left-0 w-full h-full border-2 border-amber-500/20 rounded-[2.5rem] pointer-events-none animate-pulse" />
      )}
      
      <div className="flex items-center justify-between mb-4 px-2 relative" style={{ zIndex: 1 }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-[#0a0a0a] text-white">
            {getIcon(block.icon, 'w-[22px] h-[22px]')}
          </div>
          <div>
            <h2 className="text-sm font-light uppercase tracking-[0.2em] text-white">{block.label}</h2>
            <span className="text-[10px] font-bold text-white/60 tracking-tighter">{block.startTime} — {block.endTime}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!isNight && (
            <div className="flex flex-col items-end gap-1">
              <span className={`text-[10px] font-black uppercase tracking-tighter ${isOverCapacity ? 'text-amber-400' : 'text-white/20'}`}>
                {totalPoints} / {BLOCK_CAPACITY}
              </span>
              <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${isOverCapacity ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${capacityPercent}%` }} />
              </div>
            </div>
          )}
          
          {!isNight && !isPast && (
            <button onClick={onQuickAdd} className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#0a0a0a] text-white transition-all">
              <Plus size={22} />
            </button>
          )}
        </div>
      </div>

      {isOverCapacity && (
        <div className="mb-4 p-3 bg-amber-500/10 rounded-2xl flex items-start gap-3 border border-amber-500/20 animate-in slide-in-from-top-2 duration-500">
          <AlertCircle size={14} className="text-amber-400 mt-0.5" />
          <p className="text-[10px] font-bold text-amber-200/80 leading-tight">
            Your {block.label.toLowerCase()} looks a bit crowded. Remember to leave space for yourself.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskItem key={task.id} task={task} lang={language} onToggle={onToggle} onDelete={onDelete} onUpdate={onUpdate} />
          ))
        ) : (
          <button
            onClick={() => !isNight && !isPast ? onQuickAdd() : null}
            className={`w-full py-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 transition-all group ${
              isNight ? 'night-block-inner' : 'border-2 border-dashed border-white/20 hover:bg-white/5'
            }`}
          >
            {isNight ? (
              <>
                <img src="/assets/images/Background+Border+Shadow.png" alt="Rest" className="w-8 h-8 opacity-80" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Rest Phase</span>
              </>
            ) : (
              <>
                <LayoutGrid size={24} className={`transition-transform ${!isNight && !isPast && 'group-hover:scale-110'} ${isActive ? 'text-emerald-400/40' : 'text-white/10'}`} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-emerald-400/40' : 'text-white/40'}`}>
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

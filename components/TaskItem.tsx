import React, { useState, memo } from 'react';
import { Check, Trash2, ArrowRight, ChevronDown, ChevronUp, StickyNote, Calendar, Edit2, Save, X, MoreHorizontal, Repeat, Layers, Zap, Target } from '../utils/MaterialIcons';
import { Task, TimePeriod, Language, TaskWeight } from '../types.ts';
import { WEIGHT_CONFIG, TRANSLATIONS } from '../constants.tsx';

interface TaskItemProps {
  task: Task;
  lang: Language;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, lang, onToggle, onDelete, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const t = TRANSLATIONS[lang];
  const weightInfo = WEIGHT_CONFIG[task.weight];

  const handleSave = () => {
    onUpdate(task.id, { title: editTitle });
    setIsEditing(false);
  };

  const togglePeriod = (p: TimePeriod) => {
    const current = task.periods || [];
    const updated = current.includes(p)
      ? current.filter(x => x !== p)
      : [...current, p];

    if (updated.length > 0) {
      onUpdate(task.id, { periods: updated });
    }
  };

  const changeWeight = (w: TaskWeight) => {
    onUpdate(task.id, { weight: w });
  };

  const periods = [
    { id: TimePeriod.MORNING, label: t.morning },
    { id: TimePeriod.AFTERNOON, label: t.afternoon },
    { id: TimePeriod.EVENING, label: t.evening }
  ];

  const weights = [
    { id: TaskWeight.QUICK, icon: Zap },
    { id: TaskWeight.FOCUSED, icon: Target },
    { id: TaskWeight.DEEP, icon: Layers }
  ];

  return (
    <div 
      className="glass-2 p-4 transition-all active:scale-[0.98] cursor-pointer hover-lift"
      style={{
        opacity: task.completed ? 0.4 : 1,
      }}
    >
      <div className="flex items-center justify-between gap-3 touch-target" style={{ position: 'relative', zIndex: 1 }}>
        <button
          onClick={() => onToggle(task.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            task.completed ? 'bg-[#0a0a0a] border-[#0a0a0a]' : 'border-white/30'
          }`}
        >
          {task.completed && <Check size={14} className="text-white" />}
        </button>

        <div className="flex-1 min-w-0 flex items-center gap-2 overflow-hidden" onClick={() => !isEditing && setIsExpanded(!isExpanded)}>
          {isEditing ? (
            <input
              autoFocus
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="w-full text-sm font-bold bg-[#0a0a0a] border border-white/10 rounded-lg px-2 py-1 focus:ring-2 focus:ring-white/20 text-white"
            />
          ) : (
            <div className="flex-1 min-w-0 flex flex-col">
              <span className={`text-sm font-bold truncate tracking-tight text-white ${task.completed ? 'line-through opacity-50' : ''}`}>
                {task.title}
              </span>
              {task.periods.length > 1 && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Layers size={14} className="text-white/60" />
                  <span className="text-[8px] font-black uppercase text-white/60 tracking-tighter">Multi-Block</span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {task.recurrence && task.recurrence !== 'none' && (
              <Repeat size={14} className="text-white/30" />
            )}
            <span className={`badge-2 badge-2-sm badge-${task.weight}`}>
              {weightInfo.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMoveMenu(!showMoveMenu); }} 
            className="glass-btn w-9 h-9 flex items-center justify-center p-0"
          >
            <MoreHorizontal size={20} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} 
            className="glass-btn w-9 h-9 flex items-center justify-center p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {showMoveMenu && (
        <div className="absolute right-0 top-full mt-1 w-44 glass-container rounded-2xl z-20 overflow-hidden py-2 shadow-xl animate-in fade-in zoom-in duration-200">
          <div className="px-4 py-2 text-[10px] font-black uppercase text-white/40 tracking-widest border-b border-white/10 mb-1">Manage Blocks</div>
          {periods.map(p => (
            <button
              key={p.id}
              onClick={() => { togglePeriod(p.id); setShowMoveMenu(false); }}
              className={`w-full text-left px-4 py-3 text-xs font-black flex items-center justify-between transition-colors ${task.periods.includes(p.id) ? 'bg-[#0a0a0a] text-white' : 'text-white/60 hover:bg-white/5'}`}
            >
              {p.label}
              {task.periods.includes(p.id) && <Check size={14} />}
            </button>
          ))}
        </div>
      )}

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-4 animate-in fade-in">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <span className="text-[9px] font-black uppercase text-white/30 tracking-widest">Weight:</span>
                <div className="flex gap-1">
                   {weights.map(w => {
                      const Icon = w.icon;
                      const active = task.weight === w.id;
                      const info = WEIGHT_CONFIG[w.id];
                      return (
                        <button
                           key={w.id}
                           onClick={() => changeWeight(w.id)}
                           className={`p-2 flex-1 rounded-xl flex items-center justify-center transition-all ${
                             active ? 'bg-[#0a0a0a] shadow-sm ring-1 ring-white/20' : 'bg-[#0a0a0a] opacity-40 hover:opacity-60'
                           }`}
                           style={{ color: active ? '#ffffff' : 'inherit' }}
                        >
                           <Icon size={22} />
                        </button>
                      );
                   })}
                </div>
             </div>
             <div className="space-y-2">
                <span className="text-[9px] font-black uppercase text-white/30 tracking-widest">Priority:</span>
                <div className="flex gap-1">
                   {(['low', 'medium', 'high'] as const).map(p => (
                      <button
                         key={p}
                         onClick={() => onUpdate(task.id, { priority: p })}
                         className={`p-2 flex-1 rounded-xl flex items-center justify-center text-[9px] font-black uppercase tracking-tighter transition-all ${
                           task.priority === p ? 'bg-[#0a0a0a] shadow-sm ring-1 ring-white/20 text-white' : 'bg-[#0a0a0a] text-white/30'
                         }`}
                      >
                         {p[0]}
                      </button>
                   ))}
                </div>
             </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/60 text-xs font-bold">
              <Calendar size={14} className="text-white" />
              <span>{task.dueDate || t.deadline}</span>
            </div>
            {task.recurrence && task.recurrence !== 'none' && (
              <div className="text-[10px] font-black text-white/60 uppercase tracking-widest flex items-center gap-2">
                <Repeat size={12} />
                {t[`rec_${task.recurrence === 'all-blocks' ? 'all_blocks' : task.recurrence}` as keyof typeof t]}
              </div>
            )}
          </div>

          <div className="space-y-2">
             <span className="text-[9px] font-black uppercase text-white/30 tracking-widest">Scheduled for:</span>
             <div className="flex flex-wrap gap-1.5">
               {periods.map(p => (
                 <button
                   key={p.id}
                   onClick={() => togglePeriod(p.id)}
                   className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${
                     task.periods.includes(p.id)
                       ? 'bg-[#0a0a0a] text-white shadow-sm'
                       : 'bg-[#0a0a0a] text-white/40 hover:bg-white/20'
                   }`}
                 >
                   {p.label}
                 </button>
               ))}
             </div>
          </div>

          <div className="flex gap-2">
            <button
               onClick={() => setIsEditing(true)}
               className="flex-1 py-3 rounded-xl bg-[#0a0a0a] text-white/60 text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2"
            >
               <Edit2 size={14} /> Edit Title
            </button>
            <button
              onClick={() => {
                const date = task.dueDate || new Date().toISOString().split('T')[0];
                const cleanDate = date.replace(/-/g, '');
                window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(task.title)}&dates=${cleanDate}T090000/${cleanDate}T100000`, '_blank');
              }}
              className="flex-1 py-3 rounded-xl bg-[#0a0a0a] text-white text-[10px] font-black uppercase tracking-widest shadow-sm active:scale-95 transition-all"
            >
              To Google Calendar
            </button>
          </div>
        </div>
      )}

      <div className={`absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full ${task.priority === 'high' ? 'bg-rose-400' : task.priority === 'medium' ? 'bg-amber-400' : 'bg-white'}`} />
    </div>
  );
};

export default memo(TaskItem);

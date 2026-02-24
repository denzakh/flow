import React from 'react';
import { Task, Language } from '../../types.ts';

interface MonthViewProps {
  viewDate: Date;
  tasks: Task[];
  settings: { language: Language };
  todayStr: string;
  onDayClick: (day: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ viewDate, tasks, settings, todayStr, onDayClick }) => {
  const startOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const endOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const currentMonthDays = Array.from({ length: endOfMonth.getDate() }, (_, i) => {
    const d = new Date(startOfMonth);
    d.setDate(i + 1);
    return d;
  });

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <div key={d} className="text-[9px] font-black uppercase text-white/40 text-center py-2">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {currentMonthDays.map((day) => {
          const dStr = day.toISOString().split('T')[0];
          const isToday = dStr === todayStr;
          const dayTasks = tasks.filter(t => t.dueDate === dStr);

          return (
            <div
              key={dStr}
              onClick={() => onDayClick(day)}
              className={`aspect-square rounded-xl p-1 flex flex-col items-center justify-between transition-all cursor-pointer ${
                isToday ? 'bg-[#0a0a0a] text-white shadow-lg' : 'bg-[#0a0a0a]/50 text-white/60 hover:bg-[#0a0a0a]'
              }`}
            >
              <span className="text-[10px] font-black">{day.getDate()}</span>
              <div className="flex flex-wrap gap-0.5 justify-center">
                {dayTasks.slice(0, 3).map(t => (
                  <div key={t.id} className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-white/60'}`} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;

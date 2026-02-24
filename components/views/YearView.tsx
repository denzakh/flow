import React from 'react';
import { Task } from '../../types.ts';

interface YearViewProps {
  viewDate: Date;
  tasks: Task[];
  language: 'en' | 'ru' | 'es';
}

const YearView: React.FC<YearViewProps> = ({ viewDate, tasks, language }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 12 }, (_, m) => {
        const monthDate = new Date(viewDate.getFullYear(), m, 1);
        const daysInMonth = new Date(viewDate.getFullYear(), m + 1, 0).getDate();
        const startDay = new Date(viewDate.getFullYear(), m, 1).getDay();

        return (
          <div key={m} className="space-y-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-white">
              {monthDate.toLocaleDateString(language, { month: 'long' })}
            </span>
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: startDay }).map((_, i) => (
                <div key={`empty-${i}`} className="w-2 h-2" />
              ))}
              {Array.from({ length: daysInMonth }, (_, d) => {
                const dStr = new Date(viewDate.getFullYear(), m, d + 1).toISOString().split('T')[0];
                const hasTasks = tasks.some(t => t.dueDate === dStr);
                return (
                  <div
                    key={d}
                    className={`w-2 h-2 flex items-center justify-center text-[6px] font-black ${
                      hasTasks ? 'text-white' : 'text-white/20'
                    }`}
                  >
                    {d + 1}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default YearView;

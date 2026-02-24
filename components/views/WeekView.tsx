import React from 'react';
import { TimePeriod, Task, Language, UserSettings } from '../../types.ts';

interface WeekViewProps {
  viewDate: Date;
  tasks: Task[];
  settings: UserSettings;
  todayStr: string;
  language: Language;
}

const WeekView: React.FC<WeekViewProps> = ({ viewDate, tasks, settings, todayStr, language }) => {
  const startOfWeek = new Date(viewDate);
  startOfWeek.setDate(viewDate.getDate() - viewDate.getDay());
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  return (
    <div className="space-y-2">
      {days.map((day) => {
        const dStr = day.toISOString().split('T')[0];
        const isWeekend = day.getDay() === 0 || day.getDay() === 6;
        const dayTasks = tasks.filter(t => t.dueDate === dStr);
        const isToday = dStr === todayStr;

        return (
          <div key={dStr} className={`flex gap-3 ${isWeekend ? 'opacity-90' : ''}`}>
            <div className={`w-20 text-center py-2 rounded-lg flex-shrink-0 ${
              isToday ? 'bg-[#0a0a0a] text-white' : 'bg-[#0a0a0a] text-white/40'
            }`}>
              <span className="text-[8px] font-black uppercase tracking-wider block">
                {day.toLocaleDateString(language, { weekday: 'short' })}
              </span>
              <span className="text-sm font-black">{day.getDate()}</span>
            </div>
            <div className="flex-1 flex gap-2">
              {[TimePeriod.MORNING, TimePeriod.AFTERNOON, TimePeriod.EVENING].map(p => (
                <div key={p} className="flex-1 h-12 rounded-md bg-[#0a0a0a] flex items-center justify-center p-1 border border-white/10">
                  {dayTasks.filter(t => t.periods.includes(p)).map(t => (
                    <div key={t.id} className={`w-1.5 h-1.5 rounded-full ${t.completed ? 'bg-white/20' : 'bg-white'}`} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeekView;

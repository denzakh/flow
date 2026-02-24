import React from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { TRANSLATIONS } from '../../constants.tsx';

interface DateNavigatorProps {
  viewDate: Date;
  viewMode: 'day' | 'week' | 'month' | 'year';
  todayStr: string;
  language: keyof typeof TRANSLATIONS;
  onNavigate: (direction: number) => void;
  onToday: () => void;
}

const DateNavigator: React.FC<DateNavigatorProps> = ({
  viewDate,
  viewMode,
  todayStr,
  language,
  onNavigate,
  onToday
}) => {
  const t = TRANSLATIONS[language];

  const getTitle = () => {
    switch (viewMode) {
      case 'day':
        return todayStr === viewDate.toISOString().split('T')[0]
          ? t.today
          : viewDate.toLocaleDateString(language, { day: 'numeric', month: 'long' });
      case 'week':
        return `Week ${Math.ceil(viewDate.getDate() / 7)}`;
      case 'month':
        return viewDate.toLocaleDateString(language, { month: 'long', year: 'numeric' });
      case 'year':
        return viewDate.getFullYear().toString();
    }
  };

  const getSubtitle = () => {
    if (viewMode === 'day') {
      return viewDate.toLocaleDateString(language, { weekday: 'long' });
    }
    return t.upcoming;
  };

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex flex-col">
        <h2 className="text-xl font-light tracking-tight text-white">
          {getTitle()}
        </h2>
        <span className="text-[10px] font-black uppercase text-white tracking-widest">
          {getSubtitle()}
        </span>
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => onNavigate(-1)}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0a0a0a] text-white transition-all"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={onToday}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0a0a0a] text-white transition-all"
        >
          <RotateCcw size={22} />
        </button>
        <button
          onClick={() => onNavigate(1)}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0a0a0a] text-white transition-all"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
};

export default DateNavigator;

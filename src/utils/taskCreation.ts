import { Task, TimePeriod, TaskWeight, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { adjustTaskPeriods } from '../services/taskOptimizer';

export interface CapacityNotification {
  type: 'transferred' | 'full';
  message: string;
}

const periodNameKeys = {
  [TimePeriod.MORNING]: 'morning',
  [TimePeriod.AFTERNOON]: 'afternoon',
  [TimePeriod.EVENING]: 'evening',
} as const;

function formatShortDate(dateStr: string, language: Language): string {
  const locale = language === 'ru' ? 'ru-RU' : language === 'es' ? 'es-ES' : 'en-US';
  return new Date(dateStr).toLocaleDateString(locale, { day: 'numeric', month: 'short' });
}

function buildTransferMessage(
  title: string,
  periods: TimePeriod[],
  targetDate: string,
  todayStr: string,
  language: Language,
  includeBlockOverflowSuffix: boolean
): string {
  const t = TRANSLATIONS[language];
  const periodName = periods[0]
    ? t[periodNameKeys[periods[0]] as 'morning' | 'afternoon' | 'evening']
    : '';

  if (targetDate !== todayStr) {
    return t.taskTransferredTomorrow
      .replace('{title}', title)
      .replace('{period}', periodName)
      .replace('{date}', formatShortDate(targetDate, language));
  }

  const base = t.taskTransferred
    .replace('{title}', title)
    .replace('{period}', periodName);

  return includeBlockOverflowSuffix ? `${base} ${t.blockOverflow}` : base;
}

export function resolveTaskPlacement(
  tasks: Task[],
  periods: TimePeriod[],
  targetDate: string,
  weight: TaskWeight,
  activePeriodId: TimePeriod,
  currentTime: Date,
  language: Language,
  todayStr: string,
  options: { title: string; includeBlockOverflowSuffix?: boolean } = { title: '' }
): {
  periods: TimePeriod[];
  date: string;
  notification: CapacityNotification | null;
} {
  const periodsToUse = periods.filter((period) => period !== TimePeriod.NIGHT);
  const adjustment = adjustTaskPeriods(
    tasks,
    periodsToUse,
    targetDate,
    weight,
    activePeriodId,
    currentTime
  );

  if (adjustment.transferred) {
    return {
      periods: adjustment.periods,
      date: adjustment.date,
      notification: {
        type: 'transferred',
        message: buildTransferMessage(
          options.title,
          adjustment.periods,
          adjustment.date,
          todayStr,
          language,
          options.includeBlockOverflowSuffix ?? false
        ),
      },
    };
  }

  if (adjustment.allFull) {
    return {
      periods: periodsToUse,
      date: targetDate,
      notification: {
        type: 'full',
        message: TRANSLATIONS[language].allBlocksFull,
      },
    };
  }

  return {
    periods: periodsToUse,
    date: targetDate,
    notification: null,
  };
}

export function createTaskId(): string {
  return Math.random().toString(36).slice(2, 11);
}

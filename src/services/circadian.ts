import { TimePeriod, TimeBlockConfig, UserSettings } from '../types';

type BlockLabels = {
  morning: string;
  afternoon: string;
  evening: string;
  night: string;
};

function formatTime(totalMinutes: number): string {
  const h = Math.floor((totalMinutes % (24 * 60)) / 60);
  const m = totalMinutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function getIsWindDown(restTime: string, currentTime: Date): boolean {
  const [rH, rM] = restTime.split(':').map(Number);
  const restMins = rH * 60 + rM;
  const currentMins = currentTime.getHours() * 60 + currentTime.getMinutes();
  const windDownStart = restMins - 90;

  if (windDownStart < 0) {
    const adjustedStart = 1440 + windDownStart;
    return currentMins >= adjustedStart || currentMins < restMins;
  }

  return currentMins >= windDownStart && currentMins < restMins;
}

export function getActivePeriodId(settings: UserSettings, currentTime: Date): TimePeriod {
  const currentMins = currentTime.getHours() * 60 + currentTime.getMinutes();
  const [wH, wM] = settings.wakeUpTime.split(':').map(Number);
  const [rH, rM] = settings.restTime.split(':').map(Number);
  let wakeMins = wH * 60 + wM;
  let restMins = rH * 60 + rM;

  const isNight = restMins > wakeMins
    ? currentMins >= restMins || currentMins < wakeMins
    : currentMins >= restMins && currentMins < wakeMins;

  if (isNight) return TimePeriod.NIGHT;

  let adjustedCurrent = currentMins;
  if (adjustedCurrent < wakeMins) adjustedCurrent += 24 * 60;

  const activeDuration = (restMins < wakeMins ? restMins + 24 * 60 : restMins) - wakeMins;
  const offset = adjustedCurrent - wakeMins;

  if (offset < activeDuration / 3) return TimePeriod.MORNING;
  if (offset < (2 * activeDuration) / 3) return TimePeriod.AFTERNOON;
  return TimePeriod.EVENING;
}

export function getIsRecoveryMode(
  settings: UserSettings,
  currentTime: Date,
  activePeriodId: TimePeriod,
  isWindDown: boolean
): boolean {
  if (activePeriodId === TimePeriod.NIGHT) return false;
  const isDesignatedDay = settings.recoveryDays.includes(currentTime.getDay());
  return isDesignatedDay || isWindDown;
}

export function getDynamicBlocks(settings: UserSettings, labels: BlockLabels): TimeBlockConfig[] {
  const [wH, wM] = settings.wakeUpTime.split(':').map(Number);
  const [rH, rM] = settings.restTime.split(':').map(Number);
  let wakeMinutes = wH * 60 + wM;
  let restMinutes = rH * 60 + rM;

  if (restMinutes <= wakeMinutes) restMinutes += 24 * 60;

  const activeDuration = restMinutes - wakeMinutes;
  const blockDuration = Math.floor(activeDuration / 3);

  return [
    {
      id: TimePeriod.MORNING,
      label: labels.morning,
      startTime: formatTime(wakeMinutes),
      endTime: formatTime(wakeMinutes + blockDuration),
      icon: 'Sun',
    },
    {
      id: TimePeriod.AFTERNOON,
      label: labels.afternoon,
      startTime: formatTime(wakeMinutes + blockDuration),
      endTime: formatTime(wakeMinutes + 2 * blockDuration),
      icon: 'SunDim',
    },
    {
      id: TimePeriod.EVENING,
      label: labels.evening,
      startTime: formatTime(wakeMinutes + 2 * blockDuration),
      endTime: formatTime(restMinutes),
      icon: 'CloudMoon',
    },
    {
      id: TimePeriod.NIGHT,
      label: labels.night,
      startTime: formatTime(restMinutes),
      endTime: formatTime(wakeMinutes),
      icon: 'Moon',
    },
  ];
}

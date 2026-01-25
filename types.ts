export enum TimePeriod {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  EVENING = 'evening',
  NIGHT = 'night'
}

export enum TaskWeight {
  QUICK = 'quick',
  FOCUSED = 'focused',
  DEEP = 'deep'
}

export type Language = 'en' | 'ru' | 'es';

export type Recurrence = 'none' | 'daily' | 'weekly' | 'monthly' | 'all-blocks';

export interface AlarmConfig {
  enabled: boolean;
  time: string; // HH:mm
  sound: string; // sound key
}

export interface UserSettings {
  wakeUpTime: string; // HH:mm
  restTime: string;   // HH:mm
  recoveryDays: number[]; // [0-6] where 0 is Sunday
  workHistory: string[]; // List of YYYY-MM-DD strings where tasks were completed
  language: Language;
  alarm: AlarmConfig;
}

export interface Task {
  id: string;
  title: string;
  periods: TimePeriod[];
  completed: boolean;
  createdAt: number;
  originalPeriod?: TimePeriod;
  priority: 'low' | 'medium' | 'high';
  weight: TaskWeight;
  notes?: string;
  dueDate?: string;
  recurrence?: Recurrence;
}

export interface TimeBlockConfig {
  id: TimePeriod;
  label: string;
  startTime: string; 
  endTime: string;
  icon: string;
}

// Added UserProfile interface to fix the "Module '../types' has no exported member 'UserProfile'" error in Auth.tsx
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isGuest: boolean;
}
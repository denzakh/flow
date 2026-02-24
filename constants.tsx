
import React from 'react';
import { Sun, SunDim, Moon, CloudMoon, Zap, Target, Layers, Coffee, Trees, Heart } from 'lucide-react';
import { TimePeriod, TimeBlockConfig, TaskWeight } from './types';

export const WEIGHT_CONFIG = {
  [TaskWeight.QUICK]: { label: 'Quick', points: 1, icon: Zap, color: '#34d399' },
  [TaskWeight.FOCUSED]: { label: 'Focused', points: 3, icon: Target, color: '#60a5fa' },
  [TaskWeight.DEEP]: { label: 'Deep', points: 6, icon: Layers, color: '#a78bfa' }
};

export const RECOVERY_TIPS = {
  en: [
    "A 48-hour disconnect increases your creativity by 60% for the week ahead.",
    "Cognitive performance drops by 25% after 6 days of continuous work without a full day off.",
    "Active rest, like walking in nature, accelerates neural recovery more than passive rest.",
    "Your brain consolidates complex problem-solving strategies during periods of 'Free Flow' leisure.",
    "Recovery isn't just absence of work; it's the presence of restorative activities."
  ],
  ru: [
    "48-часовое отключение повышает вашу креативность на 60% на предстоящую неделю.",
    "Когнитивные показатели падают на 25% после 6 дней непрерывной работы без полноценного выходного.",
    "Активный отдых, например, прогулка на природе, ускоряет восстановление нейронов эффективнее пассивного отдыха.",
    "Ваш мозг закрепляет стратегии решения сложных задач в периоды свободного досуга.",
    "Восстановление — это не просто отсутствие работы, это наличие восстанавливающих занятий."
  ],
  es: [
    "Desconectarse por 48 horas aumenta tu creatividad en un 60% para la semana siguiente.",
    "El rendimiento cognitivo cae un 25% después de 6 días de trabajo continuo sin un día libre.",
    "El descanso activo, como caminar en la naturaleza, acelera la recuperación neural más que el descanso pasivo.",
    "Tu cerebro consolida estrategias complejas de resolución de problemas durante los periodos de ocio 'Free Flow'.",
    "Recuperación no es solo ausencia de trabajo; es la presencia de actividades reparadoras."
  ]
};

export const ALARM_SOUNDS = [
  { id: 'forest', label: { en: 'Forest', ru: 'Лес', es: 'Bosque' }, url: 'https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3' },
  { id: 'sea', label: { en: 'Sea Waves', ru: 'Морские волны', es: 'Olas del mar' }, url: 'https://assets.mixkit.co/active_storage/sfx/1110/1110-preview.mp3' },
  { id: 'water', label: { en: 'Stream', ru: 'Ручей', es: 'Arroyo' }, url: 'https://assets.mixkit.co/active_storage/sfx/1114/1114-preview.mp3' },
  { id: 'birds', label: { en: 'Morning Birds', ru: 'Утренние птицы', es: 'Pájaros matutinos' }, url: 'https://assets.mixkit.co/active_storage/sfx/2431/2431-preview.mp3' },
  { id: 'rain', label: { en: 'Soft Rain', ru: 'Тихий дождь', es: 'Lluvia suave' }, url: 'https://assets.mixkit.co/active_storage/sfx/1112/1112-preview.mp3' },
  { id: 'wind', label: { en: 'Mountain Wind', ru: 'Горный ветер', es: 'Viento de montaña' }, url: 'https://assets.mixkit.co/active_storage/sfx/1116/1116-preview.mp3' },
  { id: 'zen', label: { en: 'Zen Bowl', ru: 'Дзен-чаша', es: 'Cuenco Zen' }, url: 'https://assets.mixkit.co/active_storage/sfx/1118/1118-preview.mp3' },
];

export const TRANSLATIONS = {
  en: {
    today: "Today's Flow",
    upcoming: "Future Flow",
    week: "Week",
    month: "Month",
    year: "Year",
    prev: "Previous",
    next: "Next",
    rhythm: "Your Rhythm",
    alarm: "Alarm Clock",
    settings: "Settings",
    now: "Now",
    goodMorning: "Good Morning",
    goodAfternoon: "Good Afternoon",
    goodEvening: "Good Evening",
    goodNight: "Good Night",
    recoveryMode: "Recovery Mode",
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Evening",
    night: "Night",
    addPoint: "Focus Point",
    placeholder: "What are we doing next?",
    addButton: "Add to Flow",
    weightless: "Weightless",
    leisure: "Pure leisure only.",
    recoveryActive: "Neural Recovery Active",
    save: "Save Changes",
    language: "Language",
    sound: "Wake-up Sound",
    enableAlarm: "Enable Alarm",
    moveTask: "Move to",
    carriedForward: "Carried Forward",
    syncCalendar: "Sync to Calendar",
    deadline: "No Deadline",
    noUpcoming: "No upcoming tasks scheduled.",
    upcomingTasks: "Upcoming Tasks",
    flowStart: "Good morning. Your flow starts now.",
    enterThread: "Enter Thread",
    snooze: "5 more minutes",
    recurrence: "Repeat",
    rec_none: "Once",
    rec_daily: "Every Day",
    rec_weekly: "Every Week",
    rec_monthly: "Every Month",
    rec_all_blocks: "3x / Day",
  },
  ru: {
    today: "Ваш поток",
    upcoming: "Будущий поток",
    week: "Неделя",
    month: "Месяц",
    year: "Год",
    prev: "Назад",
    next: "Вперед",
    rhythm: "Ваш ритм",
    alarm: "Будильник",
    settings: "Настройки",
    now: "Сейчас",
    goodMorning: "Доброе утро",
    goodAfternoon: "Добрый день",
    goodEvening: "Добрый вечер",
    goodNight: "Доброй ночи",
    recoveryMode: "Режим восстановления",
    morning: "Утро",
    afternoon: "День",
    evening: "Вечер",
    night: "Ночь",
    addPoint: "Точка фокуса",
    placeholder: "Что планируем дальше?",
    addButton: "В поток",
    weightless: "Налегке",
    leisure: "Только отдых.",
    recoveryActive: "Восстановление нейронов",
    save: "Сохранить",
    language: "Язык",
    sound: "Звук пробуждения",
    enableAlarm: "Включить будильник",
    moveTask: "Переместить в",
    carriedForward: "Перенесено",
    syncCalendar: "В календарь",
    deadline: "Без дедлайна",
    noUpcoming: "Будущих задач не запланировано.",
    upcomingTasks: "Предстоящие задачи",
    flowStart: "Доброе утро. Ваш поток начинается сейчас.",
    enterThread: "Войти в поток",
    snooze: "Еще 5 минут",
    recurrence: "Повтор",
    rec_none: "Один раз",
    rec_daily: "Ежедневно",
    rec_weekly: "Еженедельно",
    rec_monthly: "Ежемесячно",
    rec_all_blocks: "3 раза в день",
  },
  es: {
    today: "Tu Flujo",
    upcoming: "Flujo Futuro",
    week: "Semana",
    month: "Mes",
    year: "Año",
    prev: "Anterior",
    next: "Siguiente",
    rhythm: "Tu Ritmo",
    alarm: "Reloj Alarma",
    settings: "Ajustes",
    now: "Ahora",
    goodMorning: "Buenos Días",
    goodAfternoon: "Buenas Tardes",
    goodEvening: "Buenas Noches",
    goodNight: "Buenas Noches",
    recoveryMode: "Modo Recuperación",
    morning: "Mañana",
    afternoon: "Tarde",
    evening: "Noche",
    night: "Noche",
    addPoint: "Punto de Enfoque",
    placeholder: "¿Qué haremos después?",
    addButton: "Añadir al Flujo",
    weightless: "Ligero",
    leisure: "Puro ocio solamente.",
    recoveryActive: "Recuperación Neural Activa",
    save: "Guardar Cambios",
    language: "Idioma",
    sound: "Sonido Despertar",
    enableAlarm: "Activar Alarma",
    moveTask: "Mover a",
    carriedForward: "Continuado",
    syncCalendar: "Sincronizar Calendario",
    deadline: "Sin Fecha Límite",
    noUpcoming: "No hay tareas programadas.",
    upcomingTasks: "Tareas Próximas",
    flowStart: "Buenos días. Tu flujo comienza ahora.",
    enterThread: "Entrar al Flujo",
    snooze: "5 minutos más",
    recurrence: "Repetir",
    rec_none: "Una vez",
    rec_daily: "Diario",
    rec_weekly: "Semanal",
    rec_monthly: "Mensual",
    rec_all_blocks: "3x / Día",
  }
};

export const BLOCK_CAPACITY = 12;

export const getIcon = (iconName: string, className?: string) => {
  switch (iconName) {
    case 'Sun': return <Sun className={className} />;
    case 'SunDim': return <SunDim className={className} />;
    case 'CloudMoon': return <CloudMoon className={className} />;
    case 'Moon': return <Moon className={className} />;
    case 'Coffee': return <Coffee className={className} />;
    case 'Trees': return <Trees className={className} />;
    case 'Heart': return <Heart className={className} />;
    default: return null;
  }
};

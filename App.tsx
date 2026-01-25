import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { 
  Plus, Settings as SettingsIcon, RefreshCcw, LayoutGrid, 
  X, Moon, Sun, Sparkles, SunDim, CloudMoon, Bell, CalendarDays,
  Repeat, Check, ChevronLeft, ChevronRight, ChevronDown, AlertCircle, BedDouble, LogOut, Coffee, Layers,
  Calendar, RotateCcw, Clock, CheckCircle2, Trees, Heart, Zap, Target, Info
} from 'lucide-react';
import { Task, TimePeriod, UserSettings, TimeBlockConfig, Language, AlarmConfig, Recurrence, TaskWeight, UserProfile } from './types.ts';
import { getIcon, TRANSLATIONS, ALARM_SOUNDS, RECOVERY_TIPS, WEIGHT_CONFIG, BLOCK_CAPACITY } from './constants.tsx';
import { suggestWeight } from './services/geminiService.ts';
import TaskItem from './components/TaskItem.tsx';
import Auth from './components/Auth.tsx';

type ViewMode = 'day' | 'week' | 'month' | 'year';

const BackgroundSpots = memo(({ isWindDown }: { isWindDown: boolean }) => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-layer">
    <div className={`absolute top-[-5%] left-[-5%] w-[50%] h-[50%] rounded-full blur-[100px] animate-pulse bg-layer transition-colors duration-[3000ms] ${isWindDown ? 'bg-purple-400/20' : 'bg-emerald-400/20'}`} style={{ animationDuration: '10s' }} />
    <div className={`absolute top-[25%] left-[25%] w-[50%] h-[50%] rounded-full blur-[120px] animate-pulse bg-layer transition-colors duration-[3000ms] ${isWindDown ? 'bg-indigo-400/15' : 'bg-purple-300/15'}`} style={{ animationDuration: '12s', animationDelay: '1s' }} />
    <div className={`absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] rounded-full blur-[100px] animate-pulse bg-layer transition-colors duration-[3000ms] ${isWindDown ? 'bg-violet-300/20' : 'bg-lime-300/20'}`} style={{ animationDuration: '8s', animationDelay: '2s' }} />
  </div>
));

const App: React.FC = () => {
  const [appState, setAppState] = useState<'splash' | 'auth' | 'ready'>(() => {
    const user = localStorage.getItem('flow_user');
    return user ? 'ready' : 'splash';
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('flow_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [viewDate, setViewDate] = useState(new Date());
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('flow_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('flow_settings');
    return saved ? JSON.parse(saved) : { 
      wakeUpTime: '07:00', 
      restTime: '23:00',
      recoveryDays: [0, 6], 
      workHistory: [],
      language: 'en',
      alarm: { enabled: false, time: '07:00', sound: 'forest' }
    };
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false);
  const [showAlarmMenu, setShowAlarmMenu] = useState(false);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const [lastAlarmTriggeredAt, setLastAlarmTriggeredAt] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const taskInputRef = useRef<HTMLInputElement>(null);

  const t = TRANSLATIONS[settings.language];
  const todayStr = currentTime.toISOString().split('T')[0];
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedPeriods, setSelectedPeriods] = useState<TimePeriod[]>([TimePeriod.MORNING]);
  const [selectedRecurrence, setSelectedRecurrence] = useState<Recurrence>('none');
  const [selectedWeight, setSelectedWeight] = useState<TaskWeight>(TaskWeight.FOCUSED);
  const [isRecurrenceMenuOpen, setIsRecurrenceMenuOpen] = useState(false);
  const [isSuggestingWeight, setIsSuggestingWeight] = useState(false);

  const [tempWake, setTempWake] = useState(settings.wakeUpTime);
  const [tempRest, setTempRest] = useState(settings.restTime);
  const [tempLang, setTempLang] = useState<Language>(settings.language);
  const [tempAlarm, setTempAlarm] = useState<AlarmConfig>(settings.alarm);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  useEffect(() => {
    if (appState === 'splash') {
      const timer = setTimeout(() => {
        if (!user) setAppState('auth');
        else setAppState('ready');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [appState, user]);

  useEffect(() => {
    localStorage.setItem('flow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('flow_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (user) localStorage.setItem('flow_user', JSON.stringify(user));
    else localStorage.removeItem('flow_user');
  }, [user]);

  const isWindDown = useMemo(() => {
    const [rH, rM] = settings.restTime.split(':').map(Number);
    const restMins = rH * 60 + rM;
    const currentMins = currentTime.getHours() * 60 + currentTime.getMinutes();
    const windDownStart = restMins - 90;
    if (windDownStart < 0) {
      const adjustedStart = 1440 + windDownStart;
      return currentMins >= adjustedStart || currentMins < restMins;
    }
    return currentMins >= windDownStart && currentMins < restMins;
  }, [settings.restTime, currentTime]);

  const activePeriodId = useMemo(() => {
    const currentMins = currentTime.getHours() * 60 + currentTime.getMinutes();
    const [wH, wM] = settings.wakeUpTime.split(':').map(Number);
    const [rH, rM] = settings.restTime.split(':').map(Number);
    let wakeMins = wH * 60 + wM;
    let restMins = rH * 60 + rM;
    const isNight = restMins > wakeMins 
      ? (currentMins >= restMins || currentMins < wakeMins) 
      : (currentMins >= restMins && currentMins < wakeMins);
    if (isNight) return TimePeriod.NIGHT;
    let adjustedCurrent = currentMins;
    if (adjustedCurrent < wakeMins) adjustedCurrent += 24 * 60;
    const activeDuration = (restMins < wakeMins ? restMins + 24 * 60 : restMins) - wakeMins;
    const offset = adjustedCurrent - wakeMins;
    if (offset < activeDuration / 3) return TimePeriod.MORNING;
    if (offset < 2 * activeDuration / 3) return TimePeriod.AFTERNOON;
    return TimePeriod.EVENING;
  }, [settings, currentTime]);

  useEffect(() => {
    if (appState === 'ready' && activePeriodId !== TimePeriod.NIGHT && selectedPeriods.length === 1 && selectedPeriods[0] === TimePeriod.MORNING) {
      setSelectedPeriods([activePeriodId]);
    }
  }, [activePeriodId, appState]);

  const isNightSilence = activePeriodId === TimePeriod.NIGHT;

  const isRecoveryMode = useMemo(() => {
    if (isNightSilence) return false;
    const isDesignatedDay = settings.recoveryDays.includes(currentTime.getDay());
    return isDesignatedDay || isWindDown;
  }, [settings.recoveryDays, currentTime, isWindDown, isNightSilence]);
  
  const dynamicBlocks = useMemo<TimeBlockConfig[]>(() => {
    const [wH, wM] = settings.wakeUpTime.split(':').map(Number);
    const [rH, rM] = settings.restTime.split(':').map(Number);
    let wakeMinutes = wH * 60 + wM;
    let restMinutes = rH * 60 + rM;
    if (restMinutes <= wakeMinutes) restMinutes += 24 * 60;
    const activeDuration = restMinutes - wakeMinutes;
    const blockDuration = Math.floor(activeDuration / 3);
    const formatTime = (totalMinutes: number) => {
      const h = Math.floor((totalMinutes % (24 * 60)) / 60);
      const m = totalMinutes % 60;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };
    return [
      { id: TimePeriod.MORNING, label: t.morning, startTime: formatTime(wakeMinutes), endTime: formatTime(wakeMinutes + blockDuration), icon: 'Sun' },
      { id: TimePeriod.AFTERNOON, label: t.afternoon, startTime: formatTime(wakeMinutes + blockDuration), endTime: formatTime(wakeMinutes + 2 * blockDuration), icon: 'SunDim' },
      { id: TimePeriod.EVENING, label: t.evening, startTime: formatTime(wakeMinutes + 2 * blockDuration), endTime: formatTime(restMinutes), icon: 'CloudMoon' },
      { id: TimePeriod.NIGHT, label: t.night, startTime: formatTime(restMinutes), endTime: formatTime(wakeMinutes), icon: 'Moon' }
    ] as TimeBlockConfig[];
  }, [settings, t]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      if (settings.alarm.enabled) {
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        if (timeStr === settings.alarm.time && !isAlarmPlaying && lastAlarmTriggeredAt !== timeStr) {
          triggerAlarm();
          setLastAlarmTriggeredAt(timeStr);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [settings.alarm, isAlarmPlaying, lastAlarmTriggeredAt]);

  const triggerAlarm = () => {
    const sound = ALARM_SOUNDS.find(s => s.id === settings.alarm.sound);
    if (sound && !isAlarmPlaying) {
      const audio = new Audio(sound.url);
      audio.loop = true;
      audio.volume = 0;
      audio.play().catch(e => console.error("Audio playback blocked", e));
      audioRef.current = audio;
      setIsAlarmPlaying(true);
      const fadeTime = 15000;
      const steps = 100;
      let currentStep = 0;
      fadeIntervalRef.current = window.setInterval(() => {
        currentStep++;
        if (audioRef.current) audioRef.current.volume = Math.min(1, currentStep / steps);
        if (currentStep >= steps && fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      }, fadeTime / steps);
    }
  };

  const stopAlarm = () => {
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setIsAlarmPlaying(false);
  };

  const snoozeAlarm = () => {
    stopAlarm();
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    const newTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    setSettings(prev => ({ ...prev, alarm: { ...prev.alarm, time: newTime } }));
  };

  const togglePeriodSelection = (period: TimePeriod) => {
    if (period === TimePeriod.NIGHT) return;
    setSelectedPeriods(prev => {
      if (prev.includes(period)) {
        return prev.length > 1 ? prev.filter(p => p !== period) : prev;
      } else {
        return [...prev, period];
      }
    });
  };

  const handleQuickAdd = (period: TimePeriod) => {
    if (period === TimePeriod.NIGHT) return;
    setSelectedPeriods([period]);
    taskInputRef.current?.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const titleTimeoutRef = useRef<number | null>(null);
  useEffect(() => {
    let isMounted = true;
    const currentTitle = newTaskTitle.trim();
    
    if (currentTitle.length > 3) {
      if (titleTimeoutRef.current) clearTimeout(titleTimeoutRef.current);
      
      titleTimeoutRef.current = window.setTimeout(async () => {
        if (!isMounted) return;
        setIsSuggestingWeight(true);
        try {
          const weight = await suggestWeight(currentTitle);
          if (isMounted && newTaskTitle.trim() === currentTitle) {
            setSelectedWeight(weight);
          }
        } catch (err) {
          console.warn("Weight suggestion failed quietly to prevent lock", err);
        } finally {
          if (isMounted) setIsSuggestingWeight(false);
        }
      }, 1000);
    }
    
    return () => { 
      isMounted = false;
      if (titleTimeoutRef.current) clearTimeout(titleTimeoutRef.current); 
    };
  }, [newTaskTitle]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    const periodsToUse = selectedRecurrence === 'all-blocks' 
      ? [TimePeriod.MORNING, TimePeriod.AFTERNOON, TimePeriod.EVENING] 
      : selectedPeriods;
    
    const baseTask: Omit<Task, 'id' | 'periods' | 'dueDate'> = {
      title: newTaskTitle,
      completed: false,
      createdAt: Date.now(),
      priority: 'medium',
      weight: selectedWeight,
      recurrence: selectedRecurrence
    };
    
    let newTasks: Task[] = [];
    const targetDate = viewMode === 'day' ? todayStr : viewDate.toISOString().split('T')[0];
    
    newTasks = [{ ...baseTask, id: Math.random().toString(36).substr(2, 9), periods: periodsToUse, dueDate: targetDate }];

    setTasks([...tasks, ...newTasks]);
    setNewTaskTitle('');
    setSelectedRecurrence('none');
    if (activePeriodId !== TimePeriod.NIGHT) {
      setSelectedPeriods([activePeriodId]);
    }
  };

  const toggleTask = useCallback((id: string) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)), []);
  const deleteTask = useCallback((id: string) => setTasks(prev => prev.filter(t => t.id !== id)), []);
  const updateTask = useCallback((id: string, updates: Partial<Task>) => setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t)), []);

  const navigateDate = (direction: number) => {
    const newDate = new Date(viewDate);
    if (viewMode === 'day') newDate.setDate(newDate.getDate() + direction);
    else if (viewMode === 'week') newDate.setDate(newDate.getDate() + direction * 7);
    else if (viewMode === 'month') newDate.setMonth(newDate.getMonth() + direction);
    else if (viewMode === 'year') newDate.setFullYear(newDate.getFullYear() + direction);
    setViewDate(newDate);
  };

  const handleSaveSettings = () => {
    const [wH, wM] = tempWake.split(':').map(Number);
    const [rH, rM] = tempRest.split(':').map(Number);
    const wakeM = wH * 60 + wM;
    const restM = rH * 60 + rM;
    const diff = (wakeM + 1440 - restM) % 1440;
    if (diff < 420) {
      setSettingsError(settings.language === 'en' ? 'Sleep gap must be at least 7 hours.' : 'Сон должен длиться не менее 7 часов.');
      return;
    }
    setSettings({ ...settings, wakeUpTime: tempWake, restTime: tempRest, language: tempLang, alarm: tempAlarm });
    setSettingsError(null);
    setShowSettings(false);
    setShowAlarmMenu(false);
  };

  const handleLogout = () => {
    setUser(null);
    setAppState('auth'); 
    localStorage.removeItem('flow_user');
    window.location.reload();
  };

  const WeekView = () => {
    const startOfWeek = new Date(viewDate);
    startOfWeek.setDate(viewDate.getDate() - viewDate.getDay());
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
    return (
      <div className="flex gap-2 overflow-x-auto pb-4 -mx-6 px-6 snap-x">
        {days.map((day) => {
          const dStr = day.toISOString().split('T')[0];
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;
          const dayTasks = tasks.filter(t => t.dueDate === dStr);
          const isToday = dStr === todayStr;
          return (
            <div key={dStr} className={`flex-shrink-0 w-32 snap-start space-y-2 transition-all ${isWeekend ? 'opacity-90' : ''}`}>
              <div className={`text-center p-3 rounded-2xl ${isToday ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/40 text-charcoal/40'} ${isWeekend ? 'bg-indigo-50/50' : ''}`}>
                <span className="text-[10px] font-black uppercase tracking-widest block leading-none mb-1 opacity-60">{day.toLocaleDateString(settings.language, { weekday: 'short' })}</span>
                <span className="text-lg font-black leading-none">{day.getDate()}</span>
              </div>
              <div className={`min-h-[300px] rounded-3xl border border-dashed p-2 transition-all ${isWeekend ? 'bg-[size:10px_10px] border-indigo-200/30' : 'border-charcoal/5 bg-white/10'}`}>
                {[TimePeriod.MORNING, TimePeriod.AFTERNOON, TimePeriod.EVENING].map(p => (
                  <div key={p} className="h-20 mb-1 rounded-xl bg-white/30 flex flex-wrap gap-1 justify-center p-2 border border-white/40">
                    {dayTasks.filter(t => t.periods.includes(p)).map(t => (
                      <div key={t.id} className={`w-2 h-2 rounded-full ${t.completed ? 'bg-emerald-500/20' : 'bg-emerald-500'}`} />
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

  const MonthView = () => {
    const startOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const endOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay();
    const currentMonthDays = Array.from({ length: endOfMonth.getDate() }, (_, i) => {
      const d = new Date(startOfMonth);
      d.setDate(i + 1);
      return d;
    });
    return (
      <div className="grid grid-cols-7 gap-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-[10px] font-black text-charcoal/20 text-center py-2">{d}</div>)}
        {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} className="aspect-square" />)}
        {currentMonthDays.map((day) => {
          const dStr = day.toISOString().split('T')[0];
          const isToday = dStr === todayStr;
          const dayTasks = tasks.filter(t => t.dueDate === dStr);
          return (
            <div key={dStr} onClick={() => { setViewDate(day); setViewMode('day'); }} className={`aspect-square rounded-xl p-1 flex flex-col items-center justify-between transition-all ${isToday ? 'bg-emerald-500 text-white shadow-md' : 'bg-white/40 hover:bg-white/80'}`}>
              <span className="text-[10px] font-black">{day.getDate()}</span>
              <div className="flex flex-wrap gap-0.5 justify-center">
                {dayTasks.slice(0, 3).map(t => <div key={t.id} className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-emerald-500'}`} />)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const YearView = () => (
    <div className="grid grid-cols-3 gap-6">
      {Array.from({ length: 12 }, (_, m) => {
        const monthDate = new Date(viewDate.getFullYear(), m, 1);
        const daysInMonth = new Date(viewDate.getFullYear(), m + 1, 0).getDate();
        return (
          <div key={m} className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-charcoal/40">{monthDate.toLocaleDateString(settings.language, { month: 'short' })}</span>
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: daysInMonth }, (_, d) => {
                const dStr = new Date(viewDate.getFullYear(), m, d + 1).toISOString().split('T')[0];
                const hasTasks = tasks.some(t => t.dueDate === dStr);
                return <div key={d} className={`w-2 h-2 rounded-[2px] ${hasTasks ? 'bg-emerald-400' : 'bg-charcoal/5'}`} />;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  if (appState === 'splash') {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[100] animate-out fade-out duration-1000 fill-mode-forwards">
        <BackgroundSpots isWindDown={false} />
        <div className="relative mb-12">
          <RefreshCcw size={80} className="text-emerald-500 animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles size={24} className="text-emerald-400 animate-pulse" />
          </div>
        </div>
        <h1 className="text-5xl font-black text-charcoal tracking-tighter mb-4">Flow</h1>
        <p className="text-charcoal/30 font-bold uppercase tracking-[0.4em] text-[10px]">Harmonize your day</p>
      </div>
    );
  }

  if (appState === 'auth') {
    return <Auth lang={settings.language} onAuth={(u) => { setUser(u); setAppState('ready'); }} />;
  }

  return (
    <div className="min-h-screen max-w-lg mx-auto px-6 py-12 relative">
      <BackgroundSpots isWindDown={isWindDown} />

      {isAlarmPlaying && (
        <div className="fixed inset-0 z-[100] glass-container flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
          <div className="w-32 h-32 bg-emerald-500/10 rounded-full flex items-center justify-center mb-12 animate-bounce">
            <Bell size={64} className="text-emerald-600 animate-pulse" />
          </div>
          <h2 className="text-4xl font-black text-charcoal mb-4">{t.flowStart}</h2>
          <p className="text-charcoal/40 font-bold mb-12 text-sm">{RECOVERY_TIPS[settings.language][0]}</p>
          <div className="flex flex-col gap-4 w-full">
            <button onClick={stopAlarm} className="w-full py-5 bg-emerald-500 text-white rounded-3xl font-black shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">{t.enterThread}</button>
            <button onClick={snoozeAlarm} className="w-full py-5 glass-card rounded-3xl font-black text-charcoal/60 active:scale-95 transition-all">{t.snooze}</button>
          </div>
        </div>
      )}

      <header className="flex items-center justify-between mb-12">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase text-charcoal/30 tracking-[0.2em]">{currentTime.toLocaleDateString(settings.language, { weekday: 'long', day: 'numeric', month: 'short' })}</span>
          </div>
          <h1 className="text-3xl font-black text-charcoal tracking-tighter">
            {currentTime.getHours() < 12 ? t.goodMorning : currentTime.getHours() < 17 ? t.goodAfternoon : currentTime.getHours() < 21 ? t.goodEvening : t.goodNight}, {user?.name.split(' ')[0]}
          </h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAlarmMenu(true)} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${settings.alarm.enabled ? 'bg-emerald-500/10 text-emerald-600' : 'glass-card text-charcoal/20'}`}>
            <Bell size={20} className={settings.alarm.enabled ? 'animate-[swing_2s_ease-in-out_infinite]' : ''} />
          </button>
          <button onClick={() => setShowSettings(true)} className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center text-charcoal/20">
            <SettingsIcon size={20} />
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-6 mb-8">
        <div className="flex gap-1 p-1 bg-charcoal/5 rounded-2xl">
          {(['day', 'week', 'month', 'year'] as ViewMode[]).map(mode => (
            <button key={mode} onClick={() => setViewMode(mode)} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === mode ? 'bg-white text-emerald-600 shadow-sm' : 'text-charcoal/30 hover:text-charcoal/50'}`}>{mode}</button>
          ))}
        </div>
        <div className="flex items-center justify-between px-2">
          <div className="flex flex-col">
            <h2 className="text-xl font-black tracking-tight text-charcoal">
              {viewMode === 'day' ? todayStr === viewDate.toISOString().split('T')[0] ? t.today : viewDate.toLocaleDateString(settings.language, { day: 'numeric', month: 'long' }) :
               viewMode === 'week' ? `Week ${Math.ceil(viewDate.getDate() / 7)}` :
               viewMode === 'month' ? viewDate.toLocaleDateString(settings.language, { month: 'long', year: 'numeric' }) : viewDate.getFullYear()}
            </h2>
            <span className="text-[10px] font-black uppercase text-charcoal/20 tracking-widest">{viewMode === 'day' ? viewDate.toLocaleDateString(settings.language, { weekday: 'long' }) : t.upcoming}</span>
          </div>
          <div className="flex gap-1">
            <button onClick={() => navigateDate(-1)} className="w-10 h-10 glass-card rounded-xl flex items-center justify-center text-charcoal/30 hover:text-emerald-500 transition-colors"><ChevronLeft size={20} /></button>
            <button onClick={() => setViewDate(new Date())} className="w-10 h-10 glass-card rounded-xl flex items-center justify-center text-charcoal/30 hover:text-emerald-500 transition-colors"><RotateCcw size={16} /></button>
            <button onClick={() => navigateDate(1)} className="w-10 h-10 glass-card rounded-xl flex items-center justify-center text-charcoal/30 hover:text-emerald-500 transition-colors"><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>

      <main className="space-y-10 animate-in fade-in duration-500">
        {viewMode === 'day' && (
          <>
            {isRecoveryMode && (
              <div className={`p-6 rounded-[2.5rem] flex items-center gap-5 transition-all duration-[2000ms] ${isWindDown ? 'bg-indigo-500/10' : 'bg-emerald-500/10'}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner border border-white/40 ${isWindDown ? 'bg-indigo-500 text-white' : 'bg-emerald-500 text-white'}`}>
                  {isWindDown ? <BedDouble size={24} /> : <Sparkles size={24} />}
                </div>
                <div className="flex-1">
                  <h3 className={`text-sm font-black uppercase tracking-widest mb-1 ${isWindDown ? 'text-indigo-600' : 'text-emerald-600'}`}>{isWindDown ? t.goodNight : t.recoveryActive}</h3>
                  <p className="text-[11px] font-bold text-charcoal/40 leading-relaxed italic">"{RECOVERY_TIPS[settings.language][Math.floor(currentTime.getHours() / 5) % 5]}"</p>
                </div>
              </div>
            )}
            <div className="glass-container p-6 rounded-[2.5rem] space-y-6">
              <div className="flex items-center gap-3 px-2">
                <Sparkles size={20} className="text-emerald-500" />
                <h3 className="text-xs font-black uppercase tracking-widest text-charcoal/60">{t.addPoint}</h3>
              </div>
              <form onSubmit={addTask} className="space-y-4">
                <div className="relative group">
                  <input ref={taskInputRef} type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder={t.placeholder} className="w-full bg-white border border-charcoal/5 rounded-3xl py-5 pl-6 pr-32 text-sm font-bold text-charcoal placeholder:text-charcoal/20 shadow-sm focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none" />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <div className="relative">
                      <button type="button" onClick={() => setIsRecurrenceMenuOpen(!isRecurrenceMenuOpen)} className={`p-3 rounded-2xl transition-all ${selectedRecurrence !== 'none' ? 'bg-emerald-500 text-white' : 'text-charcoal/20 hover:text-emerald-500'}`}><Repeat size={18} /></button>
                      {isRecurrenceMenuOpen && (
                        <div className="absolute bottom-full right-0 mb-3 w-48 glass-container rounded-3xl overflow-hidden py-3 shadow-2xl z-30">
                          {(['none', 'daily', 'weekly', 'monthly', 'all-blocks'] as Recurrence[]).map(r => (
                            <button key={r} type="button" onClick={() => { setSelectedRecurrence(r); setIsRecurrenceMenuOpen(false); }} className={`w-full text-left px-5 py-3 text-xs font-black flex items-center justify-between transition-colors ${selectedRecurrence === r ? 'text-emerald-600 bg-emerald-500/5' : 'text-charcoal/60 hover:bg-white/40'}`}>
                              {t[`rec_${r === 'all-blocks' ? 'all_blocks' : r}` as keyof typeof t]}
                              {selectedRecurrence === r && <Check size={14} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button type="submit" className="p-3 bg-emerald-500 text-white rounded-2xl shadow-lg active:scale-90 transition-all"><Plus size={22} /></button>
                  </div>
                </div>
                <div className="space-y-3 px-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">Effort Weight</span>
                    {isSuggestingWeight && <span className="text-[9px] font-bold text-emerald-500 animate-pulse italic">Thinking...</span>}
                  </div>
                  <div className="flex gap-2">
                    {(['quick', 'focused', 'deep'] as TaskWeight[]).map(w => {
                      const info = WEIGHT_CONFIG[w];
                      const Icon = info.icon;
                      const isSelected = selectedWeight === w;
                      return (
                        <button key={w} type="button" onClick={() => setSelectedWeight(w)} className={`flex-1 py-3 rounded-2xl flex flex-col items-center gap-1 border transition-all ${isSelected ? 'bg-white border-emerald-500/20 shadow-md ring-2 ring-emerald-500/5' : 'bg-charcoal/5 border-transparent opacity-60'}`}>
                          <Icon size={14} style={{ color: isSelected ? info.color : 'inherit' }} />
                          <span className="text-[9px] font-black uppercase tracking-tighter" style={{ color: isSelected ? info.color : 'inherit' }}>{info.label} ({info.points})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                {selectedRecurrence !== 'all-blocks' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2"><Clock size={12} className="text-charcoal/30" /><span className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">Target Flow Blocks</span></div>
                    <div className="flex gap-2">
                      {[TimePeriod.MORNING, TimePeriod.AFTERNOON, TimePeriod.EVENING].map(p => (
                        <button key={p} type="button" onClick={() => togglePeriodSelection(p)} className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedPeriods.includes(p) ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/10 scale-100' : 'bg-charcoal/5 text-charcoal/40 scale-95 opacity-60'}`}>{t[p as keyof typeof t]}</button>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </div>
            <div className="space-y-12">
              {dynamicBlocks.map((block) => {
                const isActive = activePeriodId === block.id && todayStr === viewDate.toISOString().split('T')[0];
                const isNight = block.id === TimePeriod.NIGHT;
                const blockTasks = tasks.filter(task => task.periods.includes(block.id) && (task.dueDate === viewDate.toISOString().split('T')[0]));
                const totalPoints = blockTasks.reduce((sum, task) => sum + WEIGHT_CONFIG[task.weight].points, 0);
                const isOverCapacity = !isNight && totalPoints > BLOCK_CAPACITY;
                const capacityPercent = Math.min(100, (totalPoints / BLOCK_CAPACITY) * 100);
                const blockIndex = dynamicBlocks.findIndex(b => b.id === block.id);
                const activeIndex = dynamicBlocks.findIndex(b => b.id === activePeriodId);
                const isPast = (todayStr === viewDate.toISOString().split('T')[0] && blockIndex < activeIndex) || (viewDate < currentTime && todayStr !== viewDate.toISOString().split('T')[0]);
                return (
                  <section key={block.id} className={`transition-all duration-700 relative p-6 -mx-6 rounded-[2.5rem] ${isActive ? 'scale-100 opacity-100 z-10' : isPast ? 'opacity-40 scale-[0.97]' : 'opacity-80 scale-[0.98]'} ${isNight ? 'bg-violet-50/40' : isOverCapacity ? 'bg-amber-50/50' : isActive ? 'bg-white/50' : ''}`}>
                    {isOverCapacity && <div className="absolute top-0 left-0 w-full h-full border-2 border-amber-200/20 rounded-[2.5rem] pointer-events-none animate-pulse" />}
                    <div className="flex items-center justify-between mb-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isActive ? (isNight ? 'bg-indigo-400 text-white' : 'bg-emerald-500 text-white shadow-lg') : 'bg-charcoal/5 text-charcoal/20'}`}>{getIcon(block.icon, 'w-5 h-5')}</div>
                        <div><h2 className={`text-sm font-black uppercase tracking-[0.2em] ${isActive ? 'text-charcoal' : 'text-charcoal/40'}`}>{block.label}</h2><span className="text-[10px] font-bold text-charcoal/20 tracking-tighter">{block.startTime} — {block.endTime}</span></div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isActive && <div className={`flex items-center gap-1.5 px-3 py-1 ${isNight ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-500/10 text-emerald-600'} rounded-full`}><div className={`w-1 h-1 rounded-full ${isNight ? 'bg-indigo-400' : 'bg-emerald-500'} animate-ping`} /><span className="text-[9px] font-black uppercase tracking-tighter">{t.now}</span></div>}
                        {!isNight && (
                          <div className="flex flex-col items-end gap-1">
                            <span className={`text-[10px] font-black uppercase tracking-tighter ${isOverCapacity ? 'text-amber-600' : 'text-charcoal/20'}`}>{totalPoints} / {BLOCK_CAPACITY}</span>
                            <div className="w-16 h-1 bg-charcoal/5 rounded-full overflow-hidden"><div className={`h-full transition-all duration-1000 ${isOverCapacity ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${capacityPercent}%` }} /></div>
                          </div>
                        )}
                        {!isNight && <button onClick={() => handleQuickAdd(block.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-charcoal/20 hover:text-emerald-500 transition-all"><Plus size={18} /></button>}
                      </div>
                    </div>
                    {isOverCapacity && <div className="mb-4 p-3 bg-amber-50 rounded-2xl flex items-start gap-3 border border-amber-200/30 animate-in slide-in-from-top-2 duration-500"><AlertCircle size={14} className="text-amber-500 mt-0.5" /><p className="text-[10px] font-bold text-amber-700 leading-tight">Your {block.label.toLowerCase()} looks a bit crowded. Remember to leave space for yourself.</p></div>}
                    <div className="space-y-3">
                      {blockTasks.length > 0 ? blockTasks.map(task => <TaskItem key={task.id} task={task} lang={settings.language} onToggle={toggleTask} onDelete={deleteTask} onUpdate={updateTask} />) : (
                        <button onClick={() => !isNight ? handleQuickAdd(block.id) : null} className={`w-full py-8 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center gap-2 transition-all group ${isNight ? 'border-indigo-100 bg-indigo-50/30' : 'border-charcoal/5 hover:bg-charcoal/[0.02]'}`}>
                          <LayoutGrid size={24} className={`transition-transform ${!isNight && 'group-hover:scale-110'} ${isActive && !isNight ? 'text-emerald-500/20' : isNight ? 'text-indigo-100' : 'text-charcoal/10'}`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${isNight ? 'text-indigo-300/60' : 'text-charcoal/10'}`}>{isPast ? 'Wrapped' : isActive ? 'Open Flow' : isNight ? 'Rest Phase' : 'Free Space'}</span>
                        </button>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          </>
        )}
        {viewMode === 'week' && <WeekView />}
        {viewMode === 'month' && <MonthView />}
        {viewMode === 'year' && <YearView />}
      </main>

      {showSettings && (
        <div className="fixed inset-0 z-[110] glass-container flex items-end animate-in slide-in-from-bottom duration-500">
          <div className="w-full bg-white rounded-t-[3rem] p-8 pb-12 shadow-2xl space-y-10 border-t border-white/60">
            <div className="flex items-center justify-between"><h2 className="text-2xl font-black text-charcoal tracking-tighter">{t.settings}</h2><button onClick={() => setShowSettings(false)} className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-charcoal/30"><X size={20} /></button></div>
            <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-charcoal/40 tracking-widest">{t.morning} Start</label><input type="time" value={tempWake} onChange={e => setTempWake(e.target.value)} className="w-full p-4 bg-charcoal/5 rounded-2xl border-none font-bold text-charcoal" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-charcoal/40 tracking-widest">{t.night} Rest</label><input type="time" value={tempRest} onChange={e => setTempRest(e.target.value)} className="w-full p-4 bg-charcoal/5 rounded-2xl border-none font-bold text-charcoal" /></div>
              </div>
              <div className="space-y-2"><label className="text-[10px] font-black uppercase text-charcoal/40 tracking-widest">{t.language}</label><div className="grid grid-cols-3 gap-2">{(['en', 'ru', 'es'] as Language[]).map(l => <button key={l} onClick={() => setTempLang(l)} className={`py-3 rounded-xl text-[10px] font-black uppercase ${tempLang === l ? 'bg-emerald-500 text-white' : 'bg-charcoal/5 text-charcoal/40'}`}>{l}</button>)}</div></div>
              <div className="pt-6 border-t border-charcoal/5 flex flex-col gap-3">
                <button onClick={handleSaveSettings} className="w-full py-5 bg-emerald-500 text-white rounded-3xl font-black shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">{t.save}</button>
                <button onClick={handleLogout} className="w-full py-5 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/5 rounded-3xl transition-all flex items-center justify-center gap-2"><LogOut size={14} /> Log Out</button>
              </div>
              {settingsError && <div className="flex items-center gap-2 text-rose-500 text-[10px] font-bold"><AlertCircle size={14} /> {settingsError}</div>}
            </div>
          </div>
        </div>
      )}

      {showAlarmMenu && (
        <div className="fixed inset-0 z-[110] glass-container flex items-end animate-in slide-in-from-bottom duration-500">
          <div className="w-full bg-white rounded-t-[3rem] p-8 pb-12 shadow-2xl space-y-10 border-t border-white/60">
            <div className="flex items-center justify-between"><h2 className="text-2xl font-black text-charcoal tracking-tighter">{t.alarm}</h2><button onClick={() => setShowAlarmMenu(false)} className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-charcoal/30 transition-colors hover:bg-charcoal/5"><X size={20} /></button></div>
            <div className="space-y-8">
              <div className="flex items-center justify-between p-6 bg-charcoal/5 rounded-[2.5rem]">
                <div className="flex items-center gap-4"><div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tempAlarm.enabled ? 'bg-emerald-500 text-white shadow-lg' : 'bg-charcoal/10 text-charcoal/30'}`}><Bell size={24} /></div><div><h3 className="text-sm font-black uppercase tracking-widest">{t.enableAlarm}</h3><span className="text-[10px] font-bold text-charcoal/40">Smooth wake-up sequence</span></div></div>
                <button onClick={() => setTempAlarm(prev => ({ ...prev, enabled: !prev.enabled }))} className={`w-14 h-8 rounded-full transition-colors relative ${tempAlarm.enabled ? 'bg-emerald-500' : 'bg-charcoal/20'}`}><div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${tempAlarm.enabled ? 'left-7' : 'left-1'} shadow-sm`} /></button>
              </div>
              <div className="grid grid-cols-2 gap-6 items-center">
                 <div className="space-y-2"><label className="text-[10px] font-black uppercase text-charcoal/40 tracking-widest">Wake Time</label><input type="time" value={tempAlarm.time} onChange={e => setTempAlarm(prev => ({ ...prev, time: e.target.value }))} className="w-full p-4 bg-charcoal/5 rounded-2xl border-none font-black text-2xl text-charcoal focus:ring-0" /></div>
                 <div className="space-y-2"><label className="text-[10px] font-black uppercase text-charcoal/40 tracking-widest">{t.sound}</label><div className="relative group"><select value={tempAlarm.sound} onChange={e => setTempAlarm(prev => ({ ...prev, sound: e.target.value }))} className="w-full p-4 bg-charcoal/5 rounded-2xl border-none font-bold text-charcoal appearance-none focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none">{ALARM_SOUNDS.map(s => <option key={s.id} value={s.id}>{s.label[settings.language as keyof typeof s.label]}</option>)}</select><ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/20 pointer-events-none" /></div></div>
              </div>
              <button onClick={handleSaveSettings} className="w-full py-5 bg-emerald-500 text-white rounded-3xl font-black shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">{t.save}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
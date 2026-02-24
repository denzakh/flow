import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import {
  Plus, Settings as SettingsIcon, RefreshCcw, LayoutGrid,
  X, Moon, Sun, Sparkles, SunDim, CloudMoon, Bell, CalendarDays,
  Repeat, Check, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, AlertCircle, BedDouble, LogOut, Coffee, Layers,
  Calendar, RotateCcw, Clock, CheckCircle2, Trees, Heart, Zap, Target, Info
} from 'lucide-react';
import { Task, TimePeriod, UserSettings, TimeBlockConfig, Language, AlarmConfig, Recurrence, TaskWeight, UserProfile } from './types.ts';
import { getIcon, TRANSLATIONS, ALARM_SOUNDS, RECOVERY_TIPS, WEIGHT_CONFIG, BLOCK_CAPACITY } from './constants.tsx';
import { suggestWeight } from './services/geminiService.ts';
import TaskItem from './components/TaskItem.tsx';
import Auth from './components/Auth.tsx';
import restIcon from './assets/images/Background+Border+Shadow.png';

type ViewMode = 'day' | 'week' | 'month' | 'year';

const BackgroundSpots = memo(({ isWindDown }: { isWindDown: boolean }) => null);

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
  const [collapsedBlocks, setCollapsedBlocks] = useState<Record<string, boolean>>({});
  const [isInputFocused, setIsInputFocused] = useState(false);

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
      <div className="space-y-2">
        {days.map((day) => {
          const dStr = day.toISOString().split('T')[0];
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;
          const dayTasks = tasks.filter(t => t.dueDate === dStr);
          const isToday = dStr === todayStr;
          return (
            <div key={dStr} className={`flex gap-3 ${isWeekend ? 'opacity-90' : ''}`}>
              <div className={`w-20 text-center py-2 rounded-lg flex-shrink-0 ${isToday ? 'bg-[#0a0a0a] text-white' : 'bg-[#0a0a0a] text-white/40'}`}>
                <span className="text-[8px] font-black uppercase tracking-wider block">{day.toLocaleDateString(settings.language, { weekday: 'short' })}</span>
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
      <div className="space-y-2">
        <div className="grid grid-cols-7 gap-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-[9px] font-black uppercase text-white/40 text-center py-2">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} className="aspect-square" />)}
          {currentMonthDays.map((day) => {
            const dStr = day.toISOString().split('T')[0];
            const isToday = dStr === todayStr;
            const dayTasks = tasks.filter(t => t.dueDate === dStr);
            return (
              <div key={dStr} onClick={() => { setViewDate(day); setViewMode('day'); }} className={`aspect-square rounded-xl p-1 flex flex-col items-center justify-between transition-all cursor-pointer ${isToday ? 'bg-[#0a0a0a] text-white shadow-lg' : 'bg-[#0a0a0a]/50 text-white/60 hover:bg-[#0a0a0a]'}`}>
                <span className="text-[10px] font-black">{day.getDate()}</span>
                <div className="flex flex-wrap gap-0.5 justify-center">
                  {dayTasks.slice(0, 3).map(t => <div key={t.id} className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-white/60'}`} />)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const YearView = () => (
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 12 }, (_, m) => {
        const monthDate = new Date(viewDate.getFullYear(), m, 1);
        const daysInMonth = new Date(viewDate.getFullYear(), m + 1, 0).getDate();
        const startDay = new Date(viewDate.getFullYear(), m, 1).getDay();
        return (
          <div key={m} className="space-y-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-white">{monthDate.toLocaleDateString(settings.language, { month: 'long' })}</span>
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} className="w-2 h-2" />)}
              {Array.from({ length: daysInMonth }, (_, d) => {
                const dStr = new Date(viewDate.getFullYear(), m, d + 1).toISOString().split('T')[0];
                const hasTasks = tasks.some(t => t.dueDate === dStr);
                return <div key={d} className={`w-2 h-2 flex items-center justify-center text-[6px] font-black ${hasTasks ? 'text-white' : 'text-white/20'}`}>{d + 1}</div>;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  if (appState === 'splash') {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] z-[100] animate-out fade-out duration-1000 fill-mode-forwards">
        <BackgroundSpots isWindDown={false} />
        <div className="relative mb-12">
          <RefreshCcw size={80} className="text-white animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles size={22} className="text-white animate-pulse" />
          </div>
        </div>
        <h1 className="text-5xl font-light text-white tracking-tighter mb-4">Flow</h1>
        <p className="text-white font-bold uppercase tracking-[0.4em] text-[10px]">Harmonize your day</p>
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
          <div className="w-32 h-32 bg-[#0a0a0a] rounded-full flex items-center justify-center mb-12 animate-bounce">
            <Bell size={64} className="text-white animate-pulse" />
          </div>
          <h2 className="text-4xl font-light text-white mb-4">{t.flowStart}</h2>
          <p className="text-white font-bold mb-12 text-sm">{RECOVERY_TIPS[settings.language][0]}</p>
          <div className="flex flex-col gap-4 w-full">
            <button onClick={stopAlarm} className="w-full py-5 bg-[#0a0a0a] text-white rounded-3xl font-black shadow-xl active:scale-95 transition-all">{t.enterThread}</button>
            <button onClick={snoozeAlarm} className="w-full py-5 bg-[#0a0a0a] rounded-3xl font-black text-white active:scale-95 transition-all">{t.snooze}</button>
          </div>
        </div>
      )}

      <header className="flex items-center justify-between mb-12">
          <div className="flex flex-col" style={{ maxWidth: 'calc(100% - 112px - 16px)', flexWrap: 'wrap' }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase text-white tracking-[0.2em]">{currentTime.toLocaleDateString(settings.language, { weekday: 'long', day: 'numeric', month: 'short' })}</span>
            </div>
          <h1 className="text-3xl font-light text-white tracking-tighter" style={{ wordBreak: 'break-word' }}>
            {currentTime.getHours() < 12 ? t.goodMorning : currentTime.getHours() < 17 ? t.goodAfternoon : currentTime.getHours() < 21 ? t.goodEvening : t.goodNight}, {user?.name.split(' ')[0]}
          </h1>
        </div>
        <div className="flex gap-2" style={{ flexShrink: 0 }}>
          <button onClick={() => setShowAlarmMenu(true)} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${settings.alarm.enabled ? 'alarm-active text-white' : 'bg-[#0a0a0a] text-white'}`}>
            <Bell size={22} className={settings.alarm.enabled ? 'animate-[swing_2s_ease-in-out_infinite]' : ''} />
          </button>
          <button onClick={() => setShowSettings(true)} className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#0a0a0a] text-white transition-all">
            <SettingsIcon size={22} />
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-6 mb-8">
        <div className="flex justify-between py-[10px] px-[10px]" style={{
          borderRadius: '24px',
          border: '1px solid #2B48AC',
          background: 'rgba(1, 1, 1, 0.05)',
          boxShadow: '-4px -4px 10px 0 rgba(129, 177, 213, 0.30) inset, 4px 4px 15px 0 rgba(160, 123, 78, 0.40)'
        }}>
          {(['day', 'week', 'month', 'year'] as ViewMode[]).map(mode => (
            <button key={mode} onClick={() => setViewMode(mode)} className="text-[12px] font-black uppercase tracking-widest transition-all" style={{
              borderRadius: '16px',
              background: viewMode === mode ? '#000' : 'transparent',
              boxShadow: viewMode === mode ? '0 10px 15px -3px rgba(16, 185, 129, 0.10), 0 4px 6px -4px rgba(16, 185, 129, 0.10)' : 'none',
              padding: '10px 10px',
              color: viewMode === mode ? '#ffffff' : 'rgba(255, 255, 255, 0.40)'
            }}>{mode}</button>
          ))}
        </div>
        <div className="flex items-center justify-between px-2">
          <div className="flex flex-col">
            <h2 className="text-xl font-light tracking-tight text-white">
              {viewMode === 'day' ? todayStr === viewDate.toISOString().split('T')[0] ? t.today : viewDate.toLocaleDateString(settings.language, { day: 'numeric', month: 'long' }) :
               viewMode === 'week' ? `Week ${Math.ceil(viewDate.getDate() / 7)}` :
               viewMode === 'month' ? viewDate.toLocaleDateString(settings.language, { month: 'long', year: 'numeric' }) : viewDate.getFullYear()}
            </h2>
            <span className="text-[10px] font-black uppercase text-white tracking-widest">{viewMode === 'day' ? viewDate.toLocaleDateString(settings.language, { weekday: 'long' }) : t.upcoming}</span>
          </div>
          <div className="flex gap-1">
            <button onClick={() => navigateDate(-1)} className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0a0a0a] text-white transition-all"><ChevronLeft size={22} /></button>
            <button onClick={() => setViewDate(new Date())} className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0a0a0a] text-white transition-all"><RotateCcw size={22} /></button>
            <button onClick={() => navigateDate(1)} className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0a0a0a] text-white transition-all"><ChevronRight size={22} /></button>
          </div>
        </div>
      </div>

      <main className="space-y-10 animate-in fade-in duration-500">
        {viewMode === 'day' && (
          <>
            {isRecoveryMode && (
              <div className={`p-6 rounded-[2.5rem] flex items-center gap-5 transition-all duration-[2000ms] ${isWindDown ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${isWindDown ? 'bg-indigo-500/20 text-white' : 'bg-emerald-500/20 text-white'}`}>
                  {isWindDown ? <BedDouble size={22} /> : <Sparkles size={22} />}
                </div>
                <div className="flex-1">
                  <h3 className={`text-sm font-light uppercase tracking-widest mb-1 ${isWindDown ? 'text-white' : 'text-white'}`}>{isWindDown ? t.goodNight : t.recoveryActive}</h3>
                  <p className="text-[11px] font-bold text-white leading-relaxed italic">"{RECOVERY_TIPS[settings.language][Math.floor(currentTime.getHours() / 5) % 5]}"</p>
                </div>
              </div>
            )}
            <div className="glass-container p-6 rounded-[2.5rem] space-y-6" style={{
              borderRadius: '40px',
              border: '1px solid #2B48AC',
              background: 'rgba(1, 1, 1, 0.05)',
              boxShadow: '-4px -4px 10px 0 rgba(129, 177, 213, 0.30) inset, 4px 4px 15px 0 rgba(160, 123, 78, 0.40)'
            }}>
              <div className="px-2">
                <h3 className="text-xs font-light uppercase tracking-widest text-white">{t.addPoint}</h3>
              </div>
              <form onSubmit={addTask} className="space-y-4">
                <div className={`relative group ${isInputFocused ? 'input-gradient-focus' : 'input-gradient'}`}>
                  <input ref={taskInputRef} type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} onFocus={() => setIsInputFocused(true)} onBlur={() => setIsInputFocused(false)} placeholder="What's next?" className="w-full bg-[#0a0a0a] border-0 rounded-[24px] py-5 pl-6 pr-[110px] text-sm font-bold text-white placeholder:text-white shadow-sm focus:ring-0 focus:outline-none transition-all outline-none" style={{ height: '66px' }} />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
                    <div className="relative">
                      <button type="button" onClick={() => setIsRecurrenceMenuOpen(!isRecurrenceMenuOpen)} className="w-[46px] h-[46px] rounded-[16px] flex items-center justify-center transition-all bg-transparent text-white hover:bg-white/5"><Repeat size={22} /></button>
                      {isRecurrenceMenuOpen && (
                        <div className="absolute bottom-full right-0 mb-3 w-48 glass-container rounded-3xl overflow-hidden py-3 shadow-2xl z-30">
                          {(['none', 'daily', 'weekly', 'monthly', 'all-blocks'] as Recurrence[]).map(r => (
                            <button key={r} type="button" onClick={() => { setSelectedRecurrence(r); setIsRecurrenceMenuOpen(false); }} className={`w-full text-left px-5 py-3 text-xs font-black flex items-center justify-between transition-colors ${selectedRecurrence === r ? 'text-emerald-400 bg-emerald-500/10' : 'text-white/60 hover:bg-white/5'}`}>
                              {t[`rec_${r === 'all-blocks' ? 'all_blocks' : r}` as keyof typeof t]}
                              {selectedRecurrence === r && <Check size={14} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button type="submit" className="w-[46px] h-[46px] bg-[#000000] text-white rounded-[16px] shadow-lg active:scale-90 transition-all flex items-center justify-center" style={{ boxShadow: '0 0 5px 0 #45556C inset' }}><Plus size={22} /></button>
                  </div>
                </div>
                <div className="space-y-3 px-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Effort Weight</span>
                    {isSuggestingWeight && <span className="text-[9px] font-bold text-emerald-400 animate-pulse italic">Thinking...</span>}
                  </div>
                  <div className="flex gap-2">
                    {(['quick', 'focused', 'deep'] as TaskWeight[]).map(w => {
                      const info = WEIGHT_CONFIG[w];
                      const Icon = info.icon;
                      const isSelected = selectedWeight === w;
                      return (
                        <button key={w} type="button" onClick={() => setSelectedWeight(w)} className={`flex-1 py-3 rounded-2xl flex flex-col items-center gap-1 border transition-all ${isSelected ? 'bg-[#0a0a0a] border-white/20 shadow-md' : 'bg-[#0a0a0a] border-transparent opacity-60'}`}>
                          <Icon size={22} style={{ color: isSelected ? '#ffffff' : 'inherit' }} />
                          <span className="text-[9px] font-black uppercase tracking-tighter" style={{ color: isSelected ? '#ffffff' : 'inherit' }}>{info.label} ({info.points})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                {selectedRecurrence !== 'all-blocks' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2"><Clock size={12} className="text-white/30" /><span className="text-[10px] font-black uppercase tracking-widest text-white/30">Target Flow Blocks</span></div>
                    <div className="flex gap-2">
                      {[TimePeriod.MORNING, TimePeriod.AFTERNOON, TimePeriod.EVENING].map(p => (
                        <button key={p} type="button" onClick={() => togglePeriodSelection(p)} className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedPeriods.includes(p) ? 'bg-[#0a0a0a] text-white shadow-lg scale-100' : 'bg-[#0a0a0a] text-white/40 scale-95 opacity-60'}`}>{t[p as keyof typeof t]}</button>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </div>
            <div className="space-y-6">
              {dynamicBlocks.map((block) => {
                const isActive = activePeriodId === block.id && todayStr === viewDate.toISOString().split('T')[0];
                const isNight = block.id === TimePeriod.NIGHT;
                const blockTasks = tasks.filter(task => task.periods.includes(block.id) && (task.dueDate === viewDate.toISOString().split('T')[0]));
                const totalPoints = blockTasks.reduce((sum, task) => sum + WEIGHT_CONFIG[task.weight].points, 0);
                const isOverCapacity = !isNight && totalPoints > BLOCK_CAPACITY;
                const capacityPercent = Math.min(100, (totalPoints / BLOCK_CAPACITY) * 100);
                const blockIndex = dynamicBlocks.findIndex(b => b.id === block.id);
                const activeIndex = dynamicBlocks.findIndex(b => b.id === activePeriodId);
                const isPast = todayStr === viewDate.toISOString().split('T')[0] && blockIndex < activeIndex;
                const isEvening = block.id === TimePeriod.EVENING && isActive;
                const isCollapsed = collapsedBlocks[block.id] || false;

                return (
                  <section key={block.id} className={`transition-all duration-700 relative p-6 rounded-[2.5rem] ${isNight ? 'night-block' : 'card-dark'}`} style={{ 
                    opacity: 1, 
                    transform: 'scale(1)', 
                    zIndex: 10
                  }}>
                    <div className="flex items-center justify-between mb-4 px-2 relative" style={{ zIndex: 1 }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-[#0a0a0a] text-white">{getIcon(block.icon, 'w-[22px] h-[22px]')}</div>
                        <div><h2 className="text-sm font-light uppercase tracking-[0.2em] text-white">{block.label}</h2><span className="text-[10px] font-bold text-white/60 tracking-tighter">{block.startTime} — {block.endTime}</span></div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!isNight && (
                          <div className="flex flex-col items-end gap-1">
                            <span className={`text-[10px] font-black uppercase tracking-tighter ${isOverCapacity ? 'text-amber-400' : 'text-white/20'}`}>{totalPoints} / {BLOCK_CAPACITY}</span>
                            <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden"><div className={`h-full transition-all duration-1000 ${isOverCapacity ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${capacityPercent}%` }} /></div>
                          </div>
                        )}
                        {!isNight && !isPast && <button onClick={() => handleQuickAdd(block.id)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#0a0a0a] text-white transition-all"><Plus size={22} /></button>}
                        {!isActive && isPast && (
                          <button onClick={() => setCollapsedBlocks(prev => ({ ...prev, [block.id]: !isCollapsed }))} className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#0a0a0a] text-white transition-all">
                            {isCollapsed ? <ChevronDown size={22} /> : <ChevronUp size={22} />}
                          </button>
                        )}
                      </div>
                    </div>
                    {isOverCapacity && <div className="mb-4 p-3 bg-amber-500/10 rounded-2xl flex items-start gap-3 border border-amber-500/20 animate-in slide-in-from-top-2 duration-500"><AlertCircle size={14} className="text-amber-400 mt-0.5" /><p className="text-[10px] font-bold text-amber-200/80 leading-tight">Your {block.label.toLowerCase()} looks a bit crowded. Remember to leave space for yourself.</p></div>}
                    {!isCollapsed && (
                      <div className="space-y-3">
                        {blockTasks.length > 0 ? blockTasks.map(task => <TaskItem key={task.id} task={task} lang={settings.language} onToggle={toggleTask} onDelete={deleteTask} onUpdate={updateTask} />) : (
                          <button onClick={() => !isNight && !isPast ? handleQuickAdd(block.id) : null} className={`w-full py-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 transition-all group ${isNight ? 'night-block-inner' : 'border-2 border-dashed border-white/20 hover:bg-white/5'}`}>
                            {isNight ? (
                              <>
                                <img src={restIcon} alt="Rest" className="w-8 h-8 opacity-80" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">Rest Phase</span>
                              </>
                            ) : (
                              <>
                                <LayoutGrid size={24} className={`transition-transform ${!isNight && !isPast && 'group-hover:scale-110'} ${isActive && !isNight ? 'text-emerald-400/40' : 'text-white/10'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isActive && !isNight ? 'text-emerald-400/40' : 'text-white/40'}`}>{isPast ? 'Wrapped' : isActive ? 'Open Flow' : 'Free Space'}</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )}
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
          <div className="w-full bg-[#0f0f0f] rounded-t-[3rem] p-8 pb-12 shadow-2xl space-y-10 border-t border-white/5">
            <div className="flex items-center justify-between"><h2 className="text-2xl font-light text-white tracking-tighter">{t.settings}</h2><button onClick={() => setShowSettings(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-[#0a0a0a] text-white transition-all"><X size={22} /></button></div>
            <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-white/60 tracking-widest">{t.morning} Start</label><input type="time" value={tempWake} onChange={e => setTempWake(e.target.value)} className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 font-bold text-white" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-white/60 tracking-widest">{t.night} Rest</label><input type="time" value={tempRest} onChange={e => setTempRest(e.target.value)} className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 font-bold text-white" /></div>
              </div>
              <div className="space-y-2"><label className="text-[10px] font-black uppercase text-white/60 tracking-widest">{t.language}</label><div className="grid grid-cols-3 gap-2">{(['en', 'ru', 'es'] as Language[]).map(l => <button key={l} onClick={() => setTempLang(l)} className={`py-3 rounded-xl text-[10px] font-black uppercase ${tempLang === l ? 'bg-[#0a0a0a] text-white' : 'bg-white/5 text-white/40'}`}>{l}</button>)}</div></div>
              <div className="pt-6 border-t border-white/5 flex flex-col gap-3">
                <button onClick={handleSaveSettings} className="w-full py-5 bg-[#0a0a0a] text-white rounded-3xl font-black shadow-xl active:scale-95 transition-all">{t.save}</button>
                <button onClick={handleLogout} className="w-full py-5 text-rose-400 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/10 rounded-3xl transition-all flex items-center justify-center gap-2"><LogOut size={14} /> Log Out</button>
              </div>
              {settingsError && <div className="flex items-center gap-2 text-rose-400 text-[10px] font-bold"><AlertCircle size={14} /> {settingsError}</div>}
            </div>
          </div>
        </div>
      )}

      {showAlarmMenu && (
        <div className="fixed inset-0 z-[110] glass-container flex items-end animate-in slide-in-from-bottom duration-500">
          <div className="w-full bg-[#0f0f0f] rounded-t-[3rem] p-8 pb-12 shadow-2xl space-y-10 border-t border-white/5">
            <div className="flex items-center justify-between"><h2 className="text-2xl font-light text-white tracking-tighter">{t.alarm}</h2><button onClick={() => setShowAlarmMenu(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-[#0a0a0a] text-white transition-all"><X size={22} /></button></div>
            <div className="space-y-8">
              <div className="flex items-center justify-between p-6 bg-white/5 rounded-[2.5rem]">
                <div className="flex items-center gap-4"><div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tempAlarm.enabled ? 'bg-[#0a0a0a] text-white shadow-lg' : 'bg-white/10 text-white/30'}`}><Bell size={22} /></div><div><h3 className="text-sm font-light uppercase tracking-widest">{t.enableAlarm}</h3><span className="text-[10px] font-bold text-white/40">Smooth wake-up sequence</span></div></div>
                <div className="">
                <button onClick={() => setTempAlarm(prev => ({ ...prev, enabled: !prev.enabled }))} className={`w-14 h-8 rounded-full transition-colors relative ${tempAlarm.enabled ? 'bg-[#0a0a0a]' : 'bg-white/10'}`}><div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${tempAlarm.enabled ? 'left-7' : 'left-1'} shadow-sm`} /></button>
              </div></div>
              <div className="grid grid-cols-2 gap-6 items-center">
                 <div className="space-y-2"><label className="text-[10px] font-black uppercase text-white/40 tracking-widest">Wake Time</label><input type="time" value={tempAlarm.time} onChange={e => setTempAlarm(prev => ({ ...prev, time: e.target.value }))} className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 font-black text-2xl text-white focus:ring-0" /></div>
                 <div className="space-y-2"><label className="text-[10px] font-black uppercase text-white/40 tracking-widest">{t.sound}</label><div className="relative group"><select value={tempAlarm.sound} onChange={e => setTempAlarm(prev => ({ ...prev, sound: e.target.value }))} className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 font-bold text-white appearance-none focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none">{ALARM_SOUNDS.map(s => <option key={s.id} value={s.id}>{s.label[settings.language as keyof typeof s.label]}</option>)}</select><ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" /></div></div>
              </div>
              <button onClick={handleSaveSettings} className="w-full py-5 bg-[#0a0a0a] text-white rounded-3xl font-black shadow-xl active:scale-95 transition-all">{t.save}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
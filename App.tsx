import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { getIcon } from './constants.tsx';
import { Task, TimePeriod, UserSettings, TimeBlockConfig, Language, AlarmConfig, Recurrence, TaskWeight, UserProfile } from './types.ts';
import { TRANSLATIONS, ALARM_SOUNDS, RECOVERY_TIPS, WEIGHT_CONFIG } from './constants.tsx';
import { suggestWeight } from './services/taskOptimizer.ts';
import TaskItem from './components/TaskItem.tsx';
import Auth from './components/Auth.tsx';
import Header from './components/layout/Header.tsx';
import ViewSwitcher from './components/common/ViewSwitcher.tsx';
import DateNavigator from './components/common/DateNavigator.tsx';
import DayView from './components/views/DayView.tsx';
import WeekView from './components/views/WeekView.tsx';
import MonthView from './components/views/MonthView.tsx';
import YearView from './components/views/YearView.tsx';
import SettingsModal from './components/modals/SettingsModal.tsx';
import AlarmModal from './components/modals/AlarmModal.tsx';
import AlarmPlayingModal from './components/modals/AlarmPlayingModal.tsx';
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

  const t = TRANSLATIONS[settings.language];
  const todayStr = currentTime.toISOString().split('T')[0];

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedPeriods, setSelectedPeriods] = useState<TimePeriod[]>([TimePeriod.MORNING]);
  const [selectedRecurrence, setSelectedRecurrence] = useState<Recurrence>('none');
  const [selectedWeight, setSelectedWeight] = useState<TaskWeight>(TaskWeight.FOCUSED);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const titleTimeoutRef = useRef<number | null>(null);
  useEffect(() => {
    const currentTitle = newTaskTitle.trim();
    if (currentTitle.length > 3) {
      if (titleTimeoutRef.current) clearTimeout(titleTimeoutRef.current);
      titleTimeoutRef.current = window.setTimeout(() => {
        const weight = suggestWeight(currentTitle);
        if (newTaskTitle.trim() === currentTitle) {
          setSelectedWeight(weight);
        }
      }, 1000);
    }
    return () => {
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

    const targetDate = viewMode === 'day' ? todayStr : viewDate.toISOString().split('T')[0];
    const newTask: Task = { ...baseTask, id: Math.random().toString(36).substr(2, 9), periods: periodsToUse, dueDate: targetDate };

    setTasks([...tasks, newTask]);
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

  if (appState === 'splash') {
    console.log('Rendering splash screen');
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] z-[100]" style={{ background: '#0a0a0a' }}>
        <BackgroundSpots isWindDown={false} />
        <div className="relative mb-12">
          {getIcon('refresh', 'text-white animate-[spin_10s_linear_infinite]', 80)}
          <div className="absolute inset-0 flex items-center justify-center">
            {getIcon('auto_awesome', 'text-white animate-pulse', 22)}
          </div>
        </div>
        <h1 className="text-5xl font-light text-white tracking-tighter mb-4" style={{ color: 'white' }}>Flow</h1>
        <p className="text-white font-bold uppercase tracking-[0.4em] text-[10px]" style={{ color: 'white' }}>Harmonize your day</p>
      </div>
    );
  }

  if (appState === 'auth') {
    console.log('Rendering auth screen');
    return <Auth lang={settings.language} onAuth={(u) => { setUser(u); setAppState('ready'); }} />;
  }

  console.log('Rendering main app, viewMode:', viewMode);
  return (
    <div className="min-h-screen max-w-lg mx-auto px-6 py-8 relative">
      <BackgroundSpots isWindDown={isWindDown} />

      {isAlarmPlaying && (
        <AlarmPlayingModal
          settings={settings}
          onStop={stopAlarm}
          onSnooze={snoozeAlarm}
        />
      )}

      <Header
        currentTime={currentTime}
        user={user}
        settings={settings}
        alarmEnabled={settings.alarm.enabled}
        onSettingsClick={() => setShowSettings(true)}
        onAlarmClick={() => setShowAlarmMenu(true)}
        language={settings.language}
      />

      <div className="flex flex-col gap-4 mb-6">
        <ViewSwitcher
          viewMode={viewMode}
          onModeChange={setViewMode}
          language={settings.language}
        />
        <DateNavigator
          viewDate={viewDate}
          viewMode={viewMode}
          todayStr={todayStr}
          language={settings.language}
          onNavigate={navigateDate}
          onToday={() => setViewDate(new Date())}
        />
      </div>

      <main className="space-y-10 animate-in fade-in duration-500">
        {viewMode === 'day' && (
          <DayView
            isRecoveryMode={isRecoveryMode}
            isWindDown={isWindDown}
            currentTime={currentTime}
            dynamicBlocks={dynamicBlocks}
            activePeriodId={activePeriodId}
            todayStr={todayStr}
            viewDate={viewDate}
            tasks={tasks}
            collapsedBlocks={collapsedBlocks}
            language={settings.language}
            onTaskAdd={(title, periods, recurrence, weight) => {
              const baseTask: Omit<Task, 'id' | 'periods' | 'dueDate'> = {
                title,
                completed: false,
                createdAt: Date.now(),
                priority: 'medium',
                weight,
                recurrence
              };
              const newTask: Task = { ...baseTask, id: Math.random().toString(36).substr(2, 9), periods, dueDate: todayStr };
              setTasks([...tasks, newTask]);
              setNewTaskTitle('');
              setSelectedRecurrence('none');
              if (activePeriodId !== TimePeriod.NIGHT) setSelectedPeriods([activePeriodId]);
            }}
            onQuickAdd={handleQuickAdd}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onUpdate={updateTask}
            onToggleCollapse={(blockId) => setCollapsedBlocks(prev => ({ ...prev, [blockId]: !prev[blockId] }))}
            onWeightChange={setSelectedWeight}
            onPeriodToggle={togglePeriodSelection}
            onRecurrenceChange={setSelectedRecurrence}
            onInputFocusChange={setIsInputFocused}
            selectedWeight={selectedWeight}
            selectedPeriods={selectedPeriods}
            selectedRecurrence={selectedRecurrence}
            isInputFocused={isInputFocused}
          />
        )}
        {viewMode === 'week' && <WeekView viewDate={viewDate} tasks={tasks} settings={settings} todayStr={todayStr} language={settings.language} />}
        {viewMode === 'month' && <MonthView viewDate={viewDate} tasks={tasks} settings={settings} todayStr={todayStr} onDayClick={(day) => { setViewDate(day); setViewMode('day'); }} />}
        {viewMode === 'year' && <YearView viewDate={viewDate} tasks={tasks} language={settings.language} />}
      </main>

      {showSettings && (
        <SettingsModal
          settings={settings}
          tempWake={tempWake}
          tempRest={tempRest}
          tempLang={tempLang}
          tempAlarm={tempAlarm}
          error={settingsError}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
          onLogout={handleLogout}
          onTempWakeChange={setTempWake}
          onTempRestChange={setTempRest}
          onTempLangChange={setTempLang}
        />
      )}

      {showAlarmMenu && (
        <AlarmModal
          settings={settings}
          tempAlarm={tempAlarm}
          onSave={handleSaveSettings}
          onClose={() => setShowAlarmMenu(false)}
          onTempAlarmChange={setTempAlarm}
        />
      )}
    </div>
  );
};

export default App;

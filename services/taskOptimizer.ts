import { Task, TimePeriod, TaskWeight, Priority } from '../types';

export type OptimizationStrategy = 'balanced' | 'quick-wins' | 'priority-first';

export interface OptimizationOptions {
  currentPeriod?: TimePeriod;
  strategy?: OptimizationStrategy;
}

/**
 * Оптимизирует порядок задач с помощью детерминированного алгоритма.
 * 
 * Алгоритм учитывает:
 * - Приоритет задачи (high/medium/low)
 * - Вес задачи (quick/focused/deep)
 * - Время суток (утро/день/вечер)
 * - Возраст задачи (старые задачи получают бонус)
 * - Выбранную стратегию оптимизации
 */
export const optimizeTasks = (
  tasks: Task[],
  options: OptimizationOptions = {}
): string[] => {
  if (tasks.length === 0) return [];

  const { currentPeriod = TimePeriod.MORNING, strategy = 'balanced' } = options;

  const priorityScore = { high: 3, medium: 2, low: 1 };
  const weightScore = { quick: 1, focused: 3, deep: 6 };

  // Бонусы для времени суток (в Flow-концепции)
  const periodBonus: Record<TimePeriod, Record<TaskWeight, number>> = {
    [TimePeriod.MORNING]: { deep: 3, focused: 2, quick: 1 },
    [TimePeriod.AFTERNOON]: { focused: 3, deep: 2, quick: 1 },
    [TimePeriod.EVENING]: { quick: 3, focused: 2, deep: 1 },
    [TimePeriod.NIGHT]: { quick: 3, focused: 1, deep: 0 }
  };

  // Расчёт скоринга для одной задачи
  const calculateScore = (task: Task): number => {
    // Базовый скоринг: приоритет важнее всего (умножаем на 10)
    let score = priorityScore[task.priority] * 10;

    switch (strategy) {
      case 'quick-wins':
        // Лёгкие задачи получают бонус для быстрых побед
        score += (7 - weightScore[task.weight]) * 5;
        break;

      case 'priority-first':
        // Только приоритет имеет значение
        score += priorityScore[task.priority] * 5;
        break;

      case 'balanced':
      default:
        // Учёт времени суток для Flow-концепции
        const bonus = periodBonus[currentPeriod]?.[task.weight] || 0;
        score += bonus * 3;
        break;
    }

    // Бонус за возраст задачи (чтобы не висели вечно)
    const ageHours = (Date.now() - task.createdAt) / (1000 * 60 * 60);
    score += Math.min(ageHours / 24, 5); // Макс +5 за старые задачи

    return score;
  };

  // Сортировка задач по убыванию скоринга
  const sorted = [...tasks].sort((a, b) => calculateScore(b) - calculateScore(a));

  return sorted.map(t => t.id);
};

/**
 * Получает рекомендуемый вес задачи на основе простых эвристик.
 * Заменяет AI-функцию suggestWeight.
 * 
 * Эвристики:
 * - Ключевые слова для быстрых задач
 * - Ключевые слова для глубоких задач
 * - Длина названия (короткие = проще)
 */
export const suggestWeight = (title: string): TaskWeight => {
  const normalizedTitle = title.toLowerCase().trim();

  // Ключевые слова для QUICK задач (< 15 мин)
  const quickKeywords = [
    'email', 'почта', 'письмо', 'звонок', 'call', 'sms', 'message', 'сообщение',
    'coffee', 'кофе', 'чай', 'tea', 'break', 'перерыв',
    'check', 'проверить', 'посмотреть', 'glance',
    'quick', 'быстро', 'легко', 'simple', 'простой',
    'оплатить', 'pay', 'bill', 'счет',
    'купить', 'buy', 'магазин', 'shop', 'store',
    'убрать', 'уборка', 'clean', 'tidy',
    'заказать', 'order', 'доставка', 'delivery'
  ];

  // Ключевые слова для DEEP задач (2+ часа)
  const deepKeywords = [
    'код', 'code', 'разработать', 'develop', 'программ', 'program',
    'дизайн', 'design', 'проект', 'project', 'систем', 'system',
    'исследование', 'research', 'анализ', 'analyze', 'анализировать',
    'написать', 'write', 'статья', 'article', 'книга', 'book', 'глава', 'chapter',
    'изучить', 'study', 'learn', 'курс', 'course', 'экзамен', 'exam',
    'стратег', 'strateg', 'планирован', 'plann', 'roadmap',
    'презентация', 'presentation', 'доклад', 'report',
    'рефактор', 'refactor', 'оптимиз', 'optimiz', 'миграц', 'migrat',
    'тест', 'test', 'testing', 'тестирован',
    'архитектур', 'architect', 'инфраструктур', 'infrastruct'
  ];

  // Проверка на QUICK задачи
  const hasQuickKeyword = quickKeywords.some(keyword => 
    normalizedTitle.includes(keyword)
  );

  // Проверка на DEEP задачи
  const hasDeepKeyword = deepKeywords.some(keyword => 
    normalizedTitle.includes(keyword)
  );

  // Эвристика по длине названия
  const isShortTitle = normalizedTitle.length <= 20;
  const isLongTitle = normalizedTitle.length >= 50;

  // Логика принятия решения
  if (hasDeepKeyword && !hasQuickKeyword) {
    return 'deep';
  }
  
  if (hasQuickKeyword && !hasDeepKeyword) {
    return 'quick';
  }

  // Если оба или ни одного — используем эвристику длины
  if (isShortTitle) {
    return 'quick';
  }
  
  if (isLongTitle) {
    return 'deep';
  }

  // По умолчанию — focused
  return 'focused';
};

/**
 * Группирует задачи по матрице Эйзенхауэра.
 * Возвращает задачи в порядке приоритетности.
 */
export const prioritizeEisenhower = (tasks: Task[]): string[] => {
  const quadrants = {
    doFirst: [] as Task[],      // Важно + Срочно (high priority + quick)
    schedule: [] as Task[],     // Важно + Не срочно (high priority)
    delegate: [] as Task[],     // Не важно + Срочно (low priority + quick)
    eliminate: [] as Task[]     // Не важно + Не срочно
  };

  tasks.forEach(task => {
    const isImportant = task.priority === 'high';
    const isUrgent = task.weight === 'quick';

    if (isImportant && isUrgent) {
      quadrants.doFirst.push(task);
    } else if (isImportant) {
      quadrants.schedule.push(task);
    } else if (isUrgent) {
      quadrants.delegate.push(task);
    } else {
      quadrants.eliminate.push(task);
    }
  });

  return [
    ...quadrants.doFirst,
    ...quadrants.schedule,
    ...quadrants.delegate,
    ...quadrants.eliminate
  ].map(t => t.id);
};

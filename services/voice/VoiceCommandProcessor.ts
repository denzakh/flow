/**
 * VoiceCommandProcessor - NLP процессор для обработки голосовых команд
 * Использует гибридный подход: регулярные выражения + контекстный анализ
 */

import { VoiceCommand, CommandType, CommandEntities, TaskWeight, TimePeriod } from '../../types';
import { taskPatterns } from './commands/TaskCommands';
import { navigationPatterns } from './commands/NavigationCommands';
import { updatePatterns, numberMapping } from './commands/UpdateCommands';

type Language = 'ru' | 'en' | 'es';

// Noise phrases that should NOT become tasks
const NOISE_PHRASES: Record<string, string[]> = {
  ru: [
    'окей гугл',
    'привет',
    'алиса',
    'стоп',
    'отмена',
    'эй',
    'хм',
    'мм',
    'эм'
    // Убраны: 'да', 'нет', 'ага' — слишком короткие, блокируют нормальные команды
  ],
  en: [
    'ok google',
    'hey siri',
    'hello',
    'hi',
    'stop',
    'cancel',
    'hey',
    'um',
    'hmm'
    // Убраны: 'yeah', 'no', 'uh huh' — слишком короткие
  ],
  es: [
    'oye siri',
    'hola',
    'para',
    'cancela',
    'eh',
    'um',
    'hmm'
    // Убраны: 'si', 'no' — слишком короткие
  ]
};

export class VoiceCommandProcessor {
  private language: Language;

  constructor(language: Language = 'en') {
    this.language = language;
  }

  /**
   * Нормализовать текст для распознавания команд
   * - Приводит к нижнему регистру
   * - Удаляет пунктуацию
   * - Заменяет ё на е (STT часто возвращает inconsistently)
   * - Удаляет лишние пробелы
   */
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/ё/g, 'е')         // STT often returns ё inconsistently
      .replace(/[.,!?;:]+/g, '')  // strip punctuation
      .replace(/\s+/g, ' ');      // collapse whitespace
  }

  /**
   * Главная функция обработки текста в команду
   */
  parseCommand(text: string, sttConfidence?: number): VoiceCommand {
    const normalizedText = this.normalizeText(text);
    if (!normalizedText) {
      return this.createUnknownCommand(text, sttConfidence);
    }

    // ПРОВЕРКА НА ШУМ В САМОМ НАЧАЛЕ (до любой другой обработки)
    const noisePhrases = NOISE_PHRASES[this.language] || NOISE_PHRASES.en;

    // Приводим normalizedText к нижнему регистру и обрезаем пробелы для надежного сравнения
    const cleanNormalizedText = normalizedText.trim().toLowerCase();

    // Используем точное совпадение для коротких фраз, includes() для длинных
    const isNoise = noisePhrases.some(phrase => {
      // Для фраз короче 6 символов — используем includes() для надежности
      if (phrase.length < 6) {
        return cleanNormalizedText.includes(phrase.toLowerCase());
      }
      // Для длинных фраз — проверка на вхождение
      return cleanNormalizedText.includes(phrase.toLowerCase());
    });

    console.log('🔍 Noise check:', { original: text, normalized: normalizedText, cleanNormalized: cleanNormalizedText, matched: isNoise });

    if (isNoise) {
      console.log('🚫 Noise phrase detected, ignoring:', normalizedText);
      return this.createUnknownCommand(text, sttConfidence, true);
    }

    // Попытка распознать конкретные команды
    const command = this.tryRecognizeCommand(normalizedText, sttConfidence);

    if (command.type !== CommandType.UNKNOWN) {
      return command;
    }

    // Fallback: любой текст считается добавлением задачи
    return this.createAddTaskCommand(normalizedText, sttConfidence);
  }

  /**
   * Попытка распознать конкретную команду
   */
  private tryRecognizeCommand(text: string, sttConfidence?: number): VoiceCommand {
    // 1. Сначала DELETE/TOGGLE (самые специфичные)
    const deleteCommand = this.tryDeleteCommand(text, sttConfidence);
    if (deleteCommand) return deleteCommand;

    const toggleCommand = this.tryToggleCommand(text, sttConfidence);
    if (toggleCommand) return toggleCommand;

    // 2. Потом UPDATE (период/вес) — ВАЖНО: ДО навигации!
    // Проверка: если есть "задачу" + "на [период]" → это changePeriod
    if (text.includes('задачу') && (text.includes('на утро') || text.includes('на день') || text.includes('на вечер'))) {
      const updateCommand = this.tryUpdateCommand(text, sttConfidence);
      if (updateCommand) return updateCommand;
    }

    // 3. Только потом навигация
    const navCommand = this.tryNavigationCommand(text, sttConfidence);
    if (navCommand) return navCommand;

    // 4. Fallback
    return this.createUnknownCommand(text, sttConfidence);
  }

  /**
   * Попытка распознать команду навигации
   */
  private tryNavigationCommand(text: string, sttConfidence?: number): VoiceCommand | null {
    const patterns = navigationPatterns[this.language] || navigationPatterns.en;

    // Проверять в порядке специфичности: сначала view modes, потом days
    // Это предотвращает ложные совпадения (например, "покажи неделю" не должно быть "сегодня")
    const priorityOrder = ['goToDay', 'goToWeek', 'goToMonth', 'goToYear', 'nextDay', 'prevDay', 'today'];

    for (const action of priorityOrder) {
      const patternArray = patterns[action as keyof typeof patterns];
      if (!patternArray) continue;

      // patternArray - это массив RegExp
      for (const pattern of patternArray) {
        const match = text.match(pattern);
        if (match) {
          const entities: CommandEntities = {};
          // Навигационные команды имеют четкие паттерны, используем высокий confidence
          // Если STT confidence есть и > 0, используем его, иначе высокий fallback
          const confidence = (sttConfidence !== undefined && sttConfidence > 0)
            ? Math.min(sttConfidence * 0.95, 0.98)
            : 0.85;

          switch (action) {
            case 'nextDay':
              entities.direction = 'next';
              return this.createCommand(CommandType.NAVIGATE_DATE, action, entities, text, confidence);
            case 'prevDay':
              entities.direction = 'prev';
              return this.createCommand(CommandType.NAVIGATE_DATE, action, entities, text, confidence);
            case 'today':
              entities.direction = 'today';
              return this.createCommand(CommandType.NAVIGATE_DATE, action, entities, text, confidence);
            case 'goToDay':
              entities.viewMode = 'day';
              return this.createCommand(CommandType.CHANGE_VIEW, action, entities, text, confidence);
            case 'goToWeek':
              entities.viewMode = 'week';
              return this.createCommand(CommandType.CHANGE_VIEW, action, entities, text, confidence);
            case 'goToMonth':
              entities.viewMode = 'month';
              return this.createCommand(CommandType.CHANGE_VIEW, action, entities, text, confidence);
            case 'goToYear':
              entities.viewMode = 'year';
              return this.createCommand(CommandType.CHANGE_VIEW, action, entities, text, confidence);
          }

          return this.createCommand(CommandType.NAVIGATE_DATE, action, entities, text, confidence);
        }
      }
    }

    return null;
  }

  /**
   * Попытка распознать команду переключения задачи
   */
  private tryToggleCommand(text: string, sttConfidence?: number): VoiceCommand | null {
    const patterns = taskPatterns[this.language]?.toggle || taskPatterns.en.toggle;
    console.log('🔄 Trying toggle command:', text);

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        console.log('✅ Toggle pattern matched:', pattern.source);
        const entities: CommandEntities = {};

        // Извлечь индекс или название задачи
        if (match[1]) {
          const index = this.parseNumber(match[1]);
          if (index > 0) {
            entities.index = index;
            console.log('📍 Toggle by index:', index);
          } else {
            const extractedName = match[1].trim();
            entities.title = extractedName;
            console.log('🔄 Toggle pattern matched:', { text: text, taskName: extractedName });
          }
        }

        // Используем STT confidence если доступно, иначе 0.85
        const confidence = sttConfidence !== undefined ? sttConfidence * 0.9 : 0.85;
        return this.createCommand(CommandType.TOGGLE_TASK, 'toggle', entities, text, confidence);
      }
    }

    console.log('❌ No toggle pattern matched');
    return null;
  }

  /**
   * Попытка распознать команду удаления
   */
  private tryDeleteCommand(text: string, sttConfidence?: number): VoiceCommand | null {
    const patterns = taskPatterns[this.language]?.delete || taskPatterns.en.delete;
    console.log('🗑️ Trying delete command:', text);

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        console.log('✅ Delete pattern matched:', pattern.source);
        const entities: CommandEntities = {};

        if (match[1]) {
          const index = this.parseNumber(match[1]);
          if (index > 0) {
            entities.index = index;
            console.log('📍 Delete by index:', index);
          } else {
            entities.title = match[1].trim();
            console.log('📍 Delete by title:', entities.title);
          }
        }

        // Используем STT confidence если доступно, иначе 0.85
        const confidence = sttConfidence !== undefined ? sttConfidence * 0.9 : 0.85;
        return this.createCommand(CommandType.DELETE_TASK, 'delete', entities, text, confidence);
      }
    }

    console.log('❌ No delete pattern matched');
    return null;
  }

  /**
   * Попытка распознать команду обновления
   */
  private tryUpdateCommand(text: string, sttConfidence?: number): VoiceCommand | null {
    console.log('🔍 Trying update command:', text);
    // Нормализуем текст для pattern matching
    const normalizedText = this.normalizeText(text);
    console.log('🧹 Normalized text:', normalizedText);

    const patterns = updatePatterns[this.language] || updatePatterns.en;
    console.log('📋 Patterns loaded:', {
      changeWeight: patterns.changeWeight?.length || 0,
      changePeriod: patterns.changePeriod?.length || 0,
      changePriority: patterns.changePriority?.length || 0
    });

    // Используем STT confidence если доступно, иначе 0.8 для update команд
    const baseConfidence = sttConfidence !== undefined ? sttConfidence * 0.85 : 0.8;

    // Проверка изменения веса
    for (const pattern of patterns.changeWeight) {
      const match = normalizedText.match(pattern);
      if (match && (match[1] || match[2])) {
        // Умное определение: где число, а где вес
        const group1 = match[1] ? match[1].trim() : '';
        const group2 = match[2] ? match[2].trim() : '';

        const index1 = this.parseNumber(group1);
        const index2 = this.parseNumber(group2);
        const weight1 = this.parseWeight(group1);
        const weight2 = this.parseWeight(group2);

        // Определяем, где индекс, а где вес
        let index, weight;
        if (index1 > 0 && weight2) {
          index = index1;
          weight = weight2;
        } else if (index2 > 0 && weight1) {
          index = index2;
          weight = weight1;
        } else {
          console.log('⚠️ Weight groups parsed but invalid:', { group1, group2, index1, index2, weight1, weight2 });
          continue;
        }

        console.log('⚖️ Weight pattern matched:', { match, index, weight });
        const entities: CommandEntities = { index, weight };

        if (index > 0 && weight) {
          console.log('✅ UPDATE_TASK: changeWeight', entities);
          return this.createCommand(CommandType.UPDATE_TASK, 'changeWeight', entities, text, baseConfidence);
        }
      }
    }

    // Проверка изменения периода
    for (const pattern of patterns.changePeriod) {
      const match = normalizedText.match(pattern);
      if (match && (match[1] || match[2])) {
        const group1 = match[1] ? match[1].trim() : '';
        const group2 = match[2] ? match[2].trim() : '';

        const index1 = this.parseNumber(group1);
        const index2 = this.parseNumber(group2);
        const period1 = this.parsePeriod(group1);
        const period2 = this.parsePeriod(group2);

        let index, period;
        if (index1 > 0 && period2) {
          index = index1;
          period = period2;
        } else if (index2 > 0 && period1) {
          index = index2;
          period = period1;
        } else {
          console.log('⚠️ Period groups parsed but invalid:', { group1, group2, index1, index2, period1, period2 });
          continue;
        }

        console.log('🕐 Period pattern matched:', { match, index, period });
        const entities: CommandEntities = { index, period };

        if (index > 0 && period) {
          console.log('✅ UPDATE_TASK: changePeriod', entities);
          return this.createCommand(CommandType.UPDATE_TASK, 'changePeriod', entities, text, baseConfidence);
        }
      }
    }

    // Проверка изменения приоритета
    if (patterns.changePriority) {
      for (const pattern of patterns.changePriority) {
        const match = normalizedText.match(pattern);
        if (match && (match[1] || match[2])) {
          const group1 = match[1] ? match[1].trim() : '';
          const group2 = match[2] ? match[2].trim() : '';

          const index1 = this.parseNumber(group1);
          const index2 = this.parseNumber(group2);
          const priority1 = this.parsePriority(group1);
          const priority2 = this.parsePriority(group2);

          let index, priority;
          if (index1 > 0 && priority2) {
            index = index1;
            priority = priority2;
          } else if (index2 > 0 && priority1) {
            index = index2;
            priority = priority1;
          } else {
            console.log('⚠️ Priority groups parsed but invalid:', { group1, group2, index1, index2, priority1, priority2 });
            continue;
          }

          console.log('🔥 Priority pattern matched:', { match, index, priority });
          const entities: CommandEntities = { index, priority };

          if (index > 0 && priority) {
            console.log('✅ UPDATE_TASK: changePriority', entities);
            return this.createCommand(CommandType.UPDATE_TASK, 'changePriority', entities, text, baseConfidence);
          }
        }
      }
    }

    console.log('❌ No update pattern matched');
    return null;
  }

  /**
   * Попытка распознать команду изменения вида
   */
  private tryViewCommand(text: string, sttConfidence?: number): VoiceCommand | null {
    const viewPatterns: Record<string, RegExp> = {
      en: /(?:show|go to|switch to|показать|переключить)\s*(day|week|month|year|день|неделю|месяц|год)/i,
      ru: /(?:показать|переключи|перейди)\s*(?:на)?\s*(day|week|month|year|день|неделю|месяц|год)/i
    };

    const pattern = viewPatterns[this.language] || viewPatterns.en;
    const match = text.match(pattern);

    if (match && match[1]) {
      const viewMode = this.parseViewMode(match[1]);
      if (viewMode) {
        // Используем STT confidence если доступно, иначе 0.85
        const confidence = sttConfidence !== undefined ? sttConfidence * 0.9 : 0.85;
        return this.createCommand(
          CommandType.CHANGE_VIEW,
          'changeView',
          { viewMode },
          text,
          confidence
        );
      }
    }

    return null;
  }

  /**
   * Создать команду добавления задачи
   */
  private createAddTaskCommand(title: string, sttConfidence?: number): VoiceCommand {
    // Очистить title от ключевых слов команд
    const cleanTitle = this.cleanTitle(title);

    // Используем STT confidence если доступно, иначе 0.75 для fallback
    const confidence = (sttConfidence !== undefined && sttConfidence > 0) ? sttConfidence * 0.8 : 0.75;

    return this.createCommand(
      CommandType.ADD_TASK,
      'add',
      { title: cleanTitle },
      title,
      confidence
    );
  }

  /**
   * Очистить заголовок от ключевых слов
   */
  private cleanTitle(title: string): string {
    const patterns = taskPatterns[this.language]?.add || taskPatterns.en.add;

    for (const pattern of patterns) {
      const match = title.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return title;
  }

  /**
   * Создать неизвестную команду
   */
  private createUnknownCommand(text: string, sttConfidence?: number, silent: boolean = false): VoiceCommand {
    return {
      type: CommandType.UNKNOWN,
      intent: 'unknown',
      entities: {},
      confidence: 0,
      rawText: text,
      silent
    };
  }

  /**
   * Создать команду с параметрами
   */
  private createCommand(
    type: CommandType,
    intent: string,
    entities: CommandEntities,
    rawText: string,
    confidence: number
  ): VoiceCommand {
    return {
      type,
      intent,
      entities,
      confidence,
      rawText
    };
  }

  /**
   * Парсинг веса из текста
   */
  private parseWeight(text: string): TaskWeight | undefined {
    const normalized = text.toLowerCase().trim();

    const weightMap: Record<string, TaskWeight> = {
      // English
      'quick': TaskWeight.QUICK,
      'focused': TaskWeight.FOCUSED,
      'deep': TaskWeight.DEEP,
      // Russian - все падежи
      'быстрая': TaskWeight.QUICK,
      'быстрый': TaskWeight.QUICK,
      'быструю': TaskWeight.QUICK,
      'быстрое': TaskWeight.QUICK,
      'быстро': TaskWeight.QUICK,
      'фокус': TaskWeight.FOCUSED,
      'фокусированная': TaskWeight.FOCUSED,
      'фокусированной': TaskWeight.FOCUSED,
      'фокусированный': TaskWeight.FOCUSED,
      'фокусированную': TaskWeight.FOCUSED,
      'фокусированное': TaskWeight.FOCUSED,
      'фокусировано': TaskWeight.FOCUSED,
      'фокусированном': TaskWeight.FOCUSED,
      'фокусированных': TaskWeight.FOCUSED,
      'глубокая': TaskWeight.DEEP,
      'глубокой': TaskWeight.DEEP,
      'глубокий': TaskWeight.DEEP,
      'глубокую': TaskWeight.DEEP,
      'глубокое': TaskWeight.DEEP,
      'глубоко': TaskWeight.DEEP,
      'глубоком': TaskWeight.DEEP
    };

    // Точное совпадение
    if (weightMap[normalized]) {
      return weightMap[normalized];
    }

    // Нечеткое совпадение - проверяем префиксы
    if (normalized.startsWith('быстр')) {
      return TaskWeight.QUICK;
    }
    if (normalized.includes('фокус')) {
      return TaskWeight.FOCUSED;
    }
    if (normalized.startsWith('глубок')) {
      return TaskWeight.DEEP;
    }
    if (normalized.startsWith('quick')) {
      return TaskWeight.QUICK;
    }
    if (normalized.includes('focus')) {
      return TaskWeight.FOCUSED;
    }
    if (normalized.startsWith('deep')) {
      return TaskWeight.DEEP;
    }

    return undefined;
  }

  /**
   * Парсинг периода из текста
   */
  private parsePeriod(text: string): TimePeriod | undefined {
    const normalized = text.toLowerCase().trim();

    const periodMap: Record<string, TimePeriod> = {
      // English
      'morning': TimePeriod.MORNING,
      'afternoon': TimePeriod.AFTERNOON,
      'evening': TimePeriod.EVENING,
      // Russian - все падежи
      'утро': TimePeriod.MORNING,
      'утром': TimePeriod.MORNING,
      'утру': TimePeriod.MORNING,
      'утра': TimePeriod.MORNING,
      'день': TimePeriod.AFTERNOON,
      'днём': TimePeriod.AFTERNOON,
      'днем': TimePeriod.AFTERNOON,
      'дня': TimePeriod.AFTERNOON,
      'дню': TimePeriod.AFTERNOON,
      'вечер': TimePeriod.EVENING,
      'вечером': TimePeriod.EVENING,
      'вечера': TimePeriod.EVENING,
      'вечеру': TimePeriod.EVENING
    };

    // Точное совпадение
    if (periodMap[normalized]) {
      return periodMap[normalized];
    }

    // Нечеткое совпадение - проверяем префиксы
    if (normalized.startsWith('утр')) {
      return TimePeriod.MORNING;
    }
    if (normalized.startsWith('дн') || normalized.startsWith('day')) {
      return TimePeriod.AFTERNOON;
    }
    if (normalized.startsWith('веч')) {
      return TimePeriod.EVENING;
    }
    if (normalized.startsWith('morn')) {
      return TimePeriod.MORNING;
    }
    if (normalized.startsWith('aft')) {
      return TimePeriod.AFTERNOON;
    }
    if (normalized.startsWith('eve')) {
      return TimePeriod.EVENING;
    }

    return undefined;
  }

  /**
   * Парсинг приоритета из текста
   */
  private parsePriority(text: string): 'high' | 'medium' | 'low' | undefined {
    const normalized = text.toLowerCase().trim();

    // Нечеткое совпадение - проверяем префиксы ПЕРВЫМ
    if (normalized.startsWith('важн') || normalized.startsWith('высок') || normalized === 'важно' || normalized === 'высоко') {
      return 'high';
    }
    if (normalized.startsWith('средн') || normalized === 'средне') {
      return 'medium';
    }
    if (normalized.startsWith('низк') || normalized === 'низко') {
      return 'low';
    }
    if (normalized.startsWith('high')) {
      return 'high';
    }
    if (normalized.startsWith('med')) {
      return 'medium';
    }
    if (normalized.startsWith('low')) {
      return 'low';
    }

    const priorityMap: Record<string, 'high' | 'medium' | 'low'> = {
      // English
      'high': 'high',
      'medium': 'medium',
      'low': 'low',
      // Russian - все падежи
      'важная': 'high',
      'важной': 'high',
      'важный': 'high',
      'важное': 'high',
      'важного': 'high',
      'важно': 'high',
      'высокая': 'high',
      'высокой': 'high',
      'высокий': 'high',
      'высокую': 'high',
      'высокое': 'high',
      'высокого': 'high',
      'высоко': 'high',
      'средняя': 'medium',
      'средней': 'medium',
      'средний': 'medium',
      'среднюю': 'medium',
      'среднее': 'medium',
      'среднего': 'medium',
      'средне': 'medium',
      'низкая': 'low',
      'низкой': 'low',
      'низкий': 'low',
      'низкую': 'low',
      'низкое': 'low',
      'низкого': 'low',
      'низко': 'low'
    };

    // Точное совпадение
    if (priorityMap[normalized]) {
      return priorityMap[normalized];
    }

    return undefined;
  }

  /**
   * Парсинг числа (текстового или цифрового)
   */
  private parseNumber(text: string): number {
    const normalized = text.toLowerCase().trim();

    // Сначала проверим текстовые числа
    if (numberMapping[normalized] !== undefined) {
      return numberMapping[normalized];
    }

    // Если не текстовое, пробуем парсить как число
    const parsed = parseInt(normalized);
    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Парсинг режима просмотра
   */
  private parseViewMode(text: string): 'day' | 'week' | 'month' | 'year' | null {
    const normalized = text.toLowerCase().trim();

    const viewMap: Record<string, 'day' | 'week' | 'month' | 'year'> = {
      'day': 'day',
      'день': 'day',
      'week': 'week',
      'неделю': 'week',
      'неделя': 'week',
      'month': 'month',
      'месяц': 'month',
      'year': 'year',
      'год': 'year'
    };

    return viewMap[normalized] || null;
  }

  /**
   * Валидация команды
   */
  private validateCommand(command: VoiceCommand): boolean {
    if (command.type === CommandType.UNKNOWN) {
      return false;
    }

    // Проверка обязательных сущностей для разных типов команд
    switch (command.type) {
      case CommandType.ADD_TASK:
        return !!command.entities.title && command.entities.title.length > 0;

      case CommandType.TOGGLE_TASK:
      case CommandType.DELETE_TASK:
        return (
          (command.entities.index !== undefined && !isNaN(command.entities.index)) ||
          (command.entities.title !== undefined && command.entities.title.length > 0)
        );

      case CommandType.UPDATE_TASK:
        return (
          (command.entities.index !== undefined && !isNaN(command.entities.index)) &&
          ((command.entities.weight !== undefined) || (command.entities.period !== undefined))
        );

      case CommandType.NAVIGATE_DATE:
      case CommandType.CHANGE_VIEW:
        return true;

      default:
        return false;
    }
  }

  /**
   * Обновить язык процессора
   */
  setLanguage(language: Language): void {
    this.language = language;
  }

  /**
   * Получить текущий язык
   */
  getLanguage(): Language {
    return this.language;
  }
}
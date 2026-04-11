/**
 * VoiceCommandProcessor - NLP процессор для обработки голосовых команд
 * Использует гибридный подход: регулярные выражения + контекстный анализ
 */

import { VoiceCommand, CommandType, CommandEntities, TaskWeight, TimePeriod } from '../../types';
import { taskPatterns } from './commands/TaskCommands';
import { navigationPatterns } from './commands/NavigationCommands';
import { updatePatterns, numberMapping } from './commands/UpdateCommands';

type Language = 'ru' | 'en';

export class VoiceCommandProcessor {
  private language: Language;

  constructor(language: Language = 'en') {
    this.language = language;
  }

  /**
   * Главная функция обработки текста в команду
   */
  parseCommand(text: string): VoiceCommand {
    const trimmedText = text.trim();
    if (!trimmedText) {
      return this.createUnknownCommand(text);
    }

    // Попытка распознать конкретные команды
    const command = this.tryRecognizeCommand(trimmedText);

    if (command.type !== CommandType.UNKNOWN) {
      return command;
    }

    // Fallback: любой текст считается добавлением задачи
    return this.createAddTaskCommand(trimmedText);
  }

  /**
   * Попытка распознать конкретную команду
   */
  private tryRecognizeCommand(text: string): VoiceCommand {
    // Проверка команд навигации
    const navCommand = this.tryNavigationCommand(text);
    if (navCommand) return navCommand;

    // Проверка команд обновления (ПЕРЕД добавлением, чтобы не перехватить "сделай задачу X")
    const updateCommand = this.tryUpdateCommand(text);
    if (updateCommand) return updateCommand;

    // Проверка команд переключения задач
    const toggleCommand = this.tryToggleCommand(text);
    if (toggleCommand) return toggleCommand;

    // Проверка команд удаления
    const deleteCommand = this.tryDeleteCommand(text);
    if (deleteCommand) return deleteCommand;

    // Проверка команд изменения вида
    const viewCommand = this.tryViewCommand(text);
    if (viewCommand) return viewCommand;

    return this.createUnknownCommand(text);
  }

  /**
   * Попытка распознать команду навигации
   */
  private tryNavigationCommand(text: string): VoiceCommand | null {
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

          switch (action) {
            case 'nextDay':
              entities.direction = 'next';
              return this.createCommand(CommandType.NAVIGATE_DATE, action, entities, text, 0.9);
            case 'prevDay':
              entities.direction = 'prev';
              return this.createCommand(CommandType.NAVIGATE_DATE, action, entities, text, 0.9);
            case 'today':
              entities.direction = 'today';
              return this.createCommand(CommandType.NAVIGATE_DATE, action, entities, text, 0.9);
            case 'goToDay':
              entities.viewMode = 'day';
              return this.createCommand(CommandType.CHANGE_VIEW, action, entities, text, 0.9);
            case 'goToWeek':
              entities.viewMode = 'week';
              return this.createCommand(CommandType.CHANGE_VIEW, action, entities, text, 0.9);
            case 'goToMonth':
              entities.viewMode = 'month';
              return this.createCommand(CommandType.CHANGE_VIEW, action, entities, text, 0.9);
            case 'goToYear':
              entities.viewMode = 'year';
              return this.createCommand(CommandType.CHANGE_VIEW, action, entities, text, 0.9);
          }

          return this.createCommand(CommandType.NAVIGATE_DATE, action, entities, text, 0.9);
        }
      }
    }

    return null;
  }

  /**
   * Попытка распознать команду переключения задачи
   */
  private tryToggleCommand(text: string): VoiceCommand | null {
    const patterns = taskPatterns[this.language]?.toggle || taskPatterns.en.toggle;

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const entities: CommandEntities = {};

        // Извлечь индекс или название задачи
        if (match[1]) {
          const index = this.parseNumber(match[1]);
          if (index > 0) {
            entities.index = index;
          } else {
            entities.title = match[1].trim();
          }
        }

        return this.createCommand(CommandType.TOGGLE_TASK, 'toggle', entities, text, 0.85);
      }
    }

    return null;
  }

  /**
   * Попытка распознать команду удаления
   */
  private tryDeleteCommand(text: string): VoiceCommand | null {
    const patterns = taskPatterns[this.language]?.delete || taskPatterns.en.delete;

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const entities: CommandEntities = {};

        if (match[1]) {
          const index = this.parseNumber(match[1]);
          if (index > 0) {
            entities.index = index;
          }
        }

        return this.createCommand(CommandType.DELETE_TASK, 'delete', entities, text, 0.85);
      }
    }

    return null;
  }

  /**
   * Попытка распознать команду обновления
   */
  private tryUpdateCommand(text: string): VoiceCommand | null {
    console.log('🔍 Trying update command:', text);
    // Очищаем текст от знаков препинания в конце
    const cleanText = text.replace(/[.!?,;:]+$/, '').trim();
    console.log('🧹 Cleaned text:', cleanText);

    const patterns = updatePatterns[this.language] || updatePatterns.en;
    console.log('📋 Patterns loaded:', {
      changeWeight: patterns.changeWeight?.length || 0,
      changePeriod: patterns.changePeriod?.length || 0,
      changePriority: patterns.changePriority?.length || 0
    });

    // Проверка изменения веса
    for (const pattern of patterns.changeWeight) {
      const match = cleanText.match(pattern);
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
          return this.createCommand(CommandType.UPDATE_TASK, 'changeWeight', entities, text, 0.8);
        }
      }
    }

    // Проверка изменения периода
    for (const pattern of patterns.changePeriod) {
      const match = cleanText.match(pattern);
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
          return this.createCommand(CommandType.UPDATE_TASK, 'changePeriod', entities, text, 0.8);
        }
      }
    }

    // Проверка изменения приоритета
    if (patterns.changePriority) {
      for (const pattern of patterns.changePriority) {
        const match = cleanText.match(pattern);
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
            return this.createCommand(CommandType.UPDATE_TASK, 'changePriority', entities, text, 0.8);
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
  private tryViewCommand(text: string): VoiceCommand | null {
    const viewPatterns: Record<string, RegExp> = {
      en: /(?:show|go to|switch to|показать|переключить)\s*(day|week|month|year|день|неделю|месяц|год)/i,
      ru: /(?:показать|переключи|перейди)\s*(?:на)?\s*(day|week|month|year|день|неделю|месяц|год)/i
    };

    const pattern = viewPatterns[this.language] || viewPatterns.en;
    const match = text.match(pattern);

    if (match && match[1]) {
      const viewMode = this.parseViewMode(match[1]);
      if (viewMode) {
        return this.createCommand(
          CommandType.CHANGE_VIEW,
          'changeView',
          { viewMode },
          text,
          0.85
        );
      }
    }

    return null;
  }

  /**
   * Создать команду добавления задачи
   */
  private createAddTaskCommand(title: string): VoiceCommand {
    // Очистить title от ключевых слов команд
    const cleanTitle = this.cleanTitle(title);

    return this.createCommand(
      CommandType.ADD_TASK,
      'add',
      { title: cleanTitle },
      title,
      0.75 // Более низкая уверенность для fallback команды
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
  private createUnknownCommand(text: string): VoiceCommand {
    return {
      type: CommandType.UNKNOWN,
      intent: 'unknown',
      entities: {},
      confidence: 0,
      rawText: text
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
      'quick': TaskWeight.QUICK,
      'фокус': TaskWeight.FOCUSED,
      'фокусированная': TaskWeight.FOCUSED,
      'фокусированной': TaskWeight.FOCUSED,
      'фокусированный': TaskWeight.FOCUSED,
      'фокусированную': TaskWeight.FOCUSED,
      'фокусированное': TaskWeight.FOCUSED,
      'фокусировано': TaskWeight.FOCUSED,
      'фокусированном': TaskWeight.FOCUSED,
      'фокусированных': TaskWeight.FOCUSED,
      'focused': TaskWeight.FOCUSED,
      'глубокая': TaskWeight.DEEP,
      'глубокой': TaskWeight.DEEP,
      'глубокий': TaskWeight.DEEP,
      'глубокую': TaskWeight.DEEP,
      'глубокое': TaskWeight.DEEP,
      'глубоко': TaskWeight.DEEP,
      'глубоком': TaskWeight.DEEP,
      'deep': TaskWeight.DEEP
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
   * Извлечь сущности из текста по паттерну
   */
  private extractEntities(text: string, pattern: RegExp): CommandEntities {
    const entities: CommandEntities = {};
    const match = text.match(pattern);

    if (match) {
      // Извлечь именованные группы из match
      for (let i = 1; i < match.length; i++) {
        if (match[i]) {
          // Паттерн должен иметь именованные группы
        }
      }
    }

    return entities;
  }

  /**
   * Рассчитать уверенность распознавания
   */
  private calculateConfidence(matches: number, textLength: number): number {
    // Базовая уверенность на количестве совпадений
    let confidence = Math.min(matches * 0.3, 0.9);

    // Бонус за корректную длину текста
    if (textLength >= 5 && textLength <= 50) {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
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
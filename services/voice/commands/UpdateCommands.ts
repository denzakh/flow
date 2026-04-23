/**
 * UpdateCommands - Паттерны для распознавания команд обновления задач
 */

export const updatePatterns = {
  en: {
    changeWeight: [
      // Прямые команды изменения веса (с цифрами)
      /(?:change|make|set)\s+(?:task\s+)?(\d+)\s+(?:to\s+)?(quick|focused|deep)/i,
      /(?:task\s+)?(\d+)\s+(?:is|should\s+be)\s+(quick|focused|deep)/i,

      // С текстовыми числами
      /(?:change|make|set)\s+(?:task\s+)?(one|two|three|four|five|six|seven|eight|nine|ten)\s+(?:to\s+)?(quick|focused|deep)/i,
      /(?:task\s+)?(one|two|three|four|five|six|seven|eight|nine|ten)\s+(?:is|should\s+be)\s+(quick|focused|deep)/i,

      // Естественные формулировки
      /(?:mark|set)\s+(?:task\s+)?(\d+)\s+as\s+(quick|focused|deep)/i,
      /task\s+(\d+)\s+(?:weight|priority)\s+(?:is\s+)?(quick|focused|deep)/i,

      // Вопросительные формы
      /can\s+(?:you\s+)?(?:change|make)\s+(?:task\s+)?(\d+)\s+(quick|focused|deep)/i,
      /set\s+(?:task\s+)?(\d+)\s+to\s+(quick|focused|deep)\s+priority/i
    ],
    changePeriod: [
      // С цифрами
      /(?:move|switch|change)\s+(?:task\s+)?(\d+)\s+(?:to\s+)?(morning|afternoon|evening)/i,
      /(?:task\s+)?(\d+)\s+(?:goes|move)\s+to\s+(morning|afternoon|evening)/i,

      // С текстовыми числами
      /(?:move|switch|change)\s+(?:task\s+)?(one|two|three|four|five|six|seven|eight|nine|ten)\s+(?:to\s+)?(morning|afternoon|evening)/i,
      /(?:task\s+)?(one|two|three|four|five|six|seven|eight|nine|ten)\s+(?:goes|move)\s+to\s+(morning|afternoon|evening)/i,

      // Естественные формулировки
      /(?:put|place)\s+(?:task\s+)?(\d+)\s+in\s+(morning|afternoon|evening)/i,
      /task\s+(\d+)\s+(?:for|in)\s+the\s+(morning|afternoon|evening)/i,

      // Вопросительные формы
      /can\s+(?:you\s+)?(?:move|switch)\s+(?:task\s+)?(\d+)\s+to\s+(morning|afternoon|evening)/i
    ],
    changePriority: [
      // С цифрами - БЕЗ обязательного "priority"
      /(?:change|make)\s+(?:task\s+)?(\d+)\s+(?:to\s+)?(high|low|medium)(?:\s+priority)?/i,
      /(?:task\s+)?(\d+)\s+(?:is|should\s+be)\s+(high|low|medium)(?:\s+priority)?/i,

      // С текстовыми числами - БЕЗ обязательного "priority"
      /(?:change|make)\s+(?:task\s+)?(one|two|three|four|five|six|seven|eight|nine|ten)\s+(?:to\s+)?(high|low|medium)(?:\s+priority)?/i,
      /(?:task\s+)?(one|two|three|four|five|six|seven|eight|nine|ten)\s+(?:is|should\s+be)\s+(high|low|medium)(?:\s+priority)?/i,

      // Естественные формулировки
      /(?:mark|set)\s+(?:task\s+)?(\d+)\s+as\s+(high|low|medium)(?:\s+priority)?/i,
      /task\s+(\d+)\s+priority\s+(?:is\s+)?(high|low|medium)/i
    ]
  },
  ru: {
    changeWeight: [
      // Супер-гибкие паттерны - ANY word variations, flexible "задача" word
      /(?:задач[а-я]{0,10}\s*)?(\d+|один|одну|одно|два|две|три|четыре|пять|шесть|семь|восемь|девять|десять)\s+(?:в|как|на)?\s*(быстр|фокус|глубок|quick|focused|deep)[а-я]*/i,
      /(быстр|фокус|глубок|quick|focused|deep)[а-я]*\s+(?:задач[а-я]{0,10}\s*)?(\d+|один|одну|одно|два|две|три|четыре|пять|шесть|семь|восемь|девять|десять)/i,

      // С глаголами
      /(?:сделай|измени|поставь|отметь|хочу)\s+(?:задач[а-я]{0,10}\s*)?(\d+|один|одну|одно|два|две|три|четыре|пять|шесть|семь|восемь|девять|десять)\s+(?:в|как|на)?\s*(быстр|фокус|глубок)[а-я]*/i,
      /(?:сделай|измени|поставь|отметь|хочу)\s+(?:задач[а-я]{0,10}\s*)?.*?\s+(быстр|фокус|глубок)[а-я]*\s+(\d+|один|одну|одно|два|две|три|четыре|пять|шесть|семь|восемь|девять|десять)/i,

      // Естественные формулировки
      /отметь\s+(?:задач[а-я]{0,10}\s*)?(\d+)\s+как\s*(быстр|фокус|глубок)[а-я]*/i,
      /задач[а-я]{0,10}\s+(\d+)\s+вес\s*(быстр|фокус|глубок|quick|focused|deep)[а-я]*/i,
    ],
    changePeriod: [
      // Супер-гибкие паттерны - ANY word variations, flexible "задача" word
      /(?:задач[а-я]{0,10}\s*)?(\d+|один|одну|одно|два|две|три|четыре|пять|шесть|семь|восемь|девять|десять)\s+(?:на|в)?\s*(утро|день|вечер|morning|afternoon|evening)[а-я]*/i,
      /(утро|день|вечер|morning|afternoon|evening)[а-я]*\s+(?:задач[а-я]{0,10}\s*)?(\d+|один|одну|одно|два|две|три|четыре|пять|шесть|семь|восемь|девять|десять)/i,

      // С глаголами
      /(?:перемести|перенеси|измени|поставь|размести|хочу)\s+(?:задач[а-я]{0,10}\s*)?(\d+|один|одну|одно|два|две|три|четыре|пять|шесть|семь|восемь|девять|десять)\s+(?:на|в)?\s*(утро|день|вечер)[а-я]*/i,
      /(?:перемести|перенеси|измени|поставь|размести|хочу)\s+(?:задач[а-я]{0,10}\s*)?.*?\s+(утро|день|вечер)[а-я]*\s+(\d+|один|одну|одно|два|две|три|четыре|пять|шесть|семь|восемь|девять|десять)/i,

      // Естественные формулировки
      /задач[а-я]{0,10}\s+(\d+)\s+на\s*(утро|день|вечер)[а-я]*/i,
    ],
    changePriority: [
      // Супер-гибкие паттерны - ANY word variations, flexible "задача" word, short forms, commas
      /(?:задач[а-я]{0,10}\s*)?(\d+|один|одну|одно|два|две|три|четыре|пять|шесть|семь|восемь|девять|десять)\s+(?:в|как|с)?\s*(важн[а-я]*|высок[а-я]*|средн[а-я]*|низк[а-я]*|важно|высоко|средне|низко|high|medium|low)(?:\s+приоритет)?/i,
      /(важн[а-я]*|высок[а-я]*|средн[а-я]*|низк[а-я]*|важно|высоко|средне|низко|high|medium|low)(?:\s+приоритет)?[\s,]+(?:задач[а-я]{0,10}\s*)?(\d+|один|одну|одно|два|две|три|четыре|пять|шесть|семь|восемь|девять|десять)/i,

      // С глаголами
      /(?:сделай|измени|поставь|отметь|хочу)\s+(?:задач[а-я]{0,10}\s*)?(\d+|один|одну|одно|два|две|три|четыре|пять|шесть|семь|восемь|девять|десять)\s+(?:в|как|с)?\s*(важн[а-я]*|высок[а-я]*|средн[а-я]*|низк[а-я]*|важно|высоко|средне|низко)(?:\s+приоритет)?/i,
      /(?:сделай|измени|поставь|отметь|хочу)\s+(?:задач[а-я]{0,10}\s*)?.*?\s+(важн[а-я]*|высок[а-я]*|средн[а-я]*|низк[а-я]*|важно|высоко|средне|низко)[\s,]+(\d+|один|одну|одно|два|две|три|четыре|пять|шесть|семь|восемь|девять|десять)/i,

      // Обратный порядок с глаголом - с запятыми И без
      /(важн[а-я]*|высок[а-я]*|средн[а-я]*|низк[а-я]*|важно|высоко|средне|низко|high|medium|low)(?:\s+приоритет)?[\s,]+(?:сделай|измени|поставь|отметь|хочу)\s+(?:задач[а-я]{0,10}\s*)?(\d+|один|одну|одно|два|две|три|четыре|пять|шесть|семь|восемь|девять|десять)/i,
      /(важн[а-я]*|высок[а-я]*|средн[а-я]*|низк[а-я]*|важно|высоко|средне|низко|high|medium|low)(?:\s+приоритет)?\s+(?:сделай|измени|поставь|отметь|хочу)\s+(?:задач[а-я]{0,10}\s*)?(\d+|один|одну|одно|два|две|три|четыре|пять|шесть|семь|восемь|девять|десять)/i,

      // Естественные формулировки
      /отметь\s+(?:задач[а-я]{0,10}\s*)?(\d+)\s+как\s*(важн[а-я]*|высок[а-я]*|средн[а-я]*|низк[а-я]*|важно|высоко|средне|низко)(?:\s+приоритет)?/i,
      /задач[а-я]{0,10}\s+(\d+)\s+приоритет\s*(важн[а-я]*|высок[а-я]*|средн[а-я]*|низк[а-я]*|важно|высоко|средне|низко)/i,
    ]
  },
  es: {
    changeWeight: [
      // Con números
      /(?:cambia|haz|pon)\s+(?:tarea\s+)?(\d+)\s+(?:a\s+)?(rápida|enfocada|profunda)/i,
      /(?:tarea\s+)?(\d+)\s+(?:es|debe\s+ser)\s+(rápida|enfocada|profunda)/i,

      // Con números textuales
      /(?:cambia|haz|pon)\s+(?:tarea\s+)?(uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s+(?:a\s+)?(rápida|enfocada|profunda)/i,
      /(?:tarea\s+)?(uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s+(?:es|debe\s+ser)\s+(rápida|enfocada|profunda)/i,

      // Formulaciones naturales
      /(?:marca|pon)\s+(?:tarea\s+)?(\d+)\s+como\s+(rápida|enfocada|profunda)/i,
      /tarea\s+(\d+)\s+(?:peso|prioridad)\s+(?:es\s+)?(rápida|enfocada|profunda)/i,

      // Formas interrogativas
      /puedes\s+(?:tú\s+)?(?:cambiar|hacer)\s+(?:tarea\s+)?(\d+)\s+(rápida|enfocada|profunda)/i,
      /pon\s+(?:tarea\s+)?(\d+)\s+a\s+(rápida|enfocada|profunda)\s+prioridad/i
    ],
    changePeriod: [
      // Con números
      /(?:mueve|cambia|pon)\s+(?:tarea\s+)?(\d+)\s+(?:a\s+)?(mañana|tarde|noche)/i,
      /(?:tarea\s+)?(\d+)\s+(?:va|va\s+a)\s+(mañana|tarde|noche)/i,

      // Con números textuales
      /(?:mueve|cambia|pon)\s+(?:tarea\s+)?(uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s+(?:a\s+)?(mañana|tarde|noche)/i,
      /(?:tarea\s+)?(uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s+(?:va|va\s+a)\s+(mañana|tarde|noche)/i,

      // Formulaciones naturales
      /(?:pon|coloca)\s+(?:tarea\s+)?(\d+)\s+en\s+(mañana|tarde|noche)/i,
      /tarea\s+(\d+)\s+(?:para|en)\s+(?:la\s+)?(mañana|tarde|noche)/i,

      // Formas interrogativas
      /puedes\s+(?:tú\s+)?(?:mover|cambiar)\s+(?:tarea\s+)?(\d+)\s+a\s+(mañana|tarde|noche)/i
    ],
    changePriority: [
      // Sin "prioridad" obligatorio - formas cortas
      /(?:cambia|haz)\s+(?:tarea\s+)?(\d+)\s+(?:a\s+)?(importante|alta|media|baja)(?:\s+prioridad)?/i,
      /(?:tarea\s+)?(\d+)\s+(?:es|debe\s+ser)\s+(importante|alta|media|baja)(?:\s+prioridad)?/i,

      // Con números textuales - sin "prioridad" obligatorio
      /(?:cambia|haz)\s+(?:tarea\s+)?(uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s+(?:a\s+)?(importante|alta|media|baja)(?:\s+prioridad)?/i,
      /(?:tarea\s+)?(uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s+(?:es|debe\s+ser)\s+(importante|alta|media|baja)(?:\s+prioridad)?/i,

      // Formulaciones naturales
      /(?:marca|pon)\s+(?:tarea\s+)?(\d+)\s+como\s+(importante|alta|media|baja)(?:\s+prioridad)?/i,
      /tarea\s+(\d+)\s+prioridad\s+(?:es\s+)?(importante|alta|media|baja)/i
    ]
  }
};

// Карта соответствия текстовых чисел к цифрам
export const numberMapping: Record<string, number> = {
  // English
  'one': 1,
  'two': 2,
  'three': 3,
  'four': 4,
  'five': 5,
  'six': 6,
  'seven': 7,
  'eight': 8,
  'nine': 9,
  'ten': 10,
  // Russian
  'один': 1,
  'одну': 1,
  'одно': 1,
  'два': 2,
  'две': 2,
  'три': 3,
  'четыре': 4,
  'пять': 5,
  'шесть': 6,
  'семь': 7,
  'восемь': 8,
  'девять': 9,
  'десять': 10,
  // Spanish
  'uno': 1,
  'una': 1,
  'dos': 2,
  'tres': 3,
  'cuatro': 4,
  'cinco': 5,
  'seis': 6,
  'siete': 7,
  'ocho': 8,
  'nueve': 9,
  'diez': 10
};

// Карта соответствия текстовых значений к типам
export const weightMapping = {
  en: {
    'quick': 'quick',
    'focused': 'focused',
    'deep': 'deep'
  },
  ru: {
    'быструю': 'quick',
    'быстрый': 'quick',
    'фокусированную': 'focused',
    'фокусированный': 'focused',
    'глубокую': 'deep',
    'глубокий': 'deep'
  },
  es: {
    'rápida': 'quick',
    'rápido': 'quick',
    'enfocada': 'focused',
    'enfocado': 'focused',
    'profunda': 'deep',
    'profundo': 'deep'
  }
};

export const periodMapping = {
  en: {
    'morning': 'morning',
    'afternoon': 'afternoon',
    'evening': 'evening'
  },
  ru: {
    'утро': 'morning',
    'утром': 'morning',
    'день': 'afternoon',
    'днём': 'afternoon',
    'днем': 'afternoon',
    'вечер': 'evening',
    'вечером': 'evening'
  },
  es: {
    'mañana': 'morning',
    'tarde': 'afternoon',
    'noche': 'evening'
  }
};

export const priorityMapping = {
  en: {
    'high': 'high',
    'medium': 'medium',
    'low': 'low'
  },
  ru: {
    'важная': 'high',
    'важный': 'high',
    'высокая': 'high',
    'высокий': 'high',
    'high': 'high',
    'средняя': 'medium',
    'средний': 'medium',
    'medium': 'medium',
    'низкая': 'low',
    'низкий': 'low',
    'low': 'low'
  },
  es: {
    'importante': 'high',
    'alta': 'high',
    'alto': 'high',
    'high': 'high',
    'media': 'medium',
    'medio': 'medium',
    'medium': 'medium',
    'baja': 'low',
    'bajo': 'low',
    'low': 'low'
  }
};
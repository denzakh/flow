/**
 * NavigationCommands - Паттерны для распознавания команд навигации по календарю
 */

export const navigationPatterns = {
  en: {
    nextDay: [
      // Прямые команды
      /(?:next|go\s+to|forward)\s+(?:day|tomorrow)/i,
      /show\s+next\s+day/i,

      // Естественные формулировки
      /what'?s\s+(?:happening|due)\s+tomorrow/i,
      /go\s+to\s+tomorrow/i,
      /show\s+me\s+tomorrow/i
    ],
    prevDay: [
      // Прямые команды
      /(?:previous|prev|go\s+to|back)\s+(?:day|yesterday)/i,
      /show\s+previous\s+day/i,
      /go\s+back\s+a\s+day/i,

      // Естественные формулировки
      /what\s+was\s+(?:happening|due)\s+yesterday/i,
      /go\s+to\s+yesterday/i,
      /show\s+me\s+yesterday/i
    ],
    today: [
      // Прямые команды - более специфичные паттерны
      /^today$/i,
      /^now$/i,
      /go\s+to\s+today/i,
      /show\s+today/i,
      /show\s+(?:the\s+)?current\s+day/i,

      // Естественные формулировки
      /what'?s\s+(?:happening|due)\s+today/i,
      /show\s+me\s+today/i,
      /back\s+to\s+today/i
    ],
    goToDay: [
      // Прямые команды
      /(?:show|go\s+to|switch\s+to|view)\s+(?:the\s+)?day/i,
      /show\s+daily\s+view/i,
      /daily\s+view/i,

      // Естественные формулировки
      /show\s+me\s+today\s+in\s+day\s+view/i,
      /day\s+overview/i,

      // Разговорные формулировки
      /i\s+want\s+to\s+see\s+day/i,
      /open\s+day/i,
      /back\s+to\s+day/i
    ],
    goToWeek: [
      // Прямые команды
      /(?:show|go\s+to|switch\s+to|view)\s+(?:the\s+)?week/i,
      /show\s+weekly\s+view/i,
      /weekly\s+view/i,

      // Естественные формулировки
      /show\s+me\s+this\s+week/i,
      /what'?s\s+(?:happening|due)\s+this\s+week/i,
      /week\s+overview/i,

      // Разговорные формулировки
      /i\s+want\s+to\s+see\s+week/i,
      /open\s+week/i
    ],
    goToMonth: [
      // Прямые команды
      /(?:show|go\s+to|switch\s+to|view)\s+(?:the\s+)?month/i,
      /show\s+monthly\s+view/i,
      /monthly\s+view/i,

      // Естественные формулировки
      /show\s+me\s+this\s+month/i,
      /what'?s\s+(?:happening|due)\s+this\s+month/i,
      /month\s+overview/i,

      // Разговорные формулировки
      /i\s+want\s+to\s+see\s+month/i,
      /open\s+month/i
    ],
    goToYear: [
      // Прямые команды
      /(?:show|go\s+to|switch\s+to|view)\s+(?:the\s+)?year/i,
      /show\s+yearly\s+view/i,
      /yearly\s+view/i,

      // Естественные формулировки
      /show\s+me\s+this\s+year/i,
      /year\s+overview/i,

      // Разговорные формулировки
      /i\s+want\s+to\s+see\s+year/i,
      /open\s+year/i
    ]
  },
  ru: {
    nextDay: [
      // Прямые команды
      /(?:следующий|перейди\s+на|вперед)\s+(?:день|завтра)/i,
      /покажи\s+следующий\s+день/i,

      // Естественные формулировки
      /что\s+(?:происходит|запланировано)\s+на\s+завтра/i,
      /перейди\s+на\s+завтра/i,
      /покажи\s+завтра/i
    ],
    prevDay: [
      // Прямые команды
      /(?:предыдущий|назад)\s+(?:день|вчера)/i,
      /покажи\s+предыдущий\s+день/i,
      /назад\s+на\s+день/i,

      // Естественные формулировки
      /что\s+(?:происходило|было\s+запланировано)\s+вчера/i,
      /перейди\s+на\s+вчера/i,
      /покажи\s+вчера/i
    ],
    today: [
      // Прямые команды - более специфичные паттерны
      /^сегодня$/i,
      /^сейчас$/i,
      /перейди\s+на\s+сегодня/i,
      /покажи\s+сегодня/i,
      /покажи\s+текущий\s+день/i,

      // Естественные формулировки
      /что\s+(?:происходит|запланировано)\s+на\s+сегодня/i,
      /покажи\s+мне\s+сегодня/i,
      /обратно\s+к\s+сегодняшнему\s+дню/i
    ],
    goToWeek: [
      // Прямые команды
      /(?:покажи|перейди\s+на|переключи\s+на)\s+(?:на\s+)?неделю/i,
      /покажи\s+недельный\s+вид/i,
      /недельный\s+вид/i,
      /на\s+неделю/i,

      // Естественные формулировки
      /покажи\s+мне\s+эту\s+неделю/i,
      /что\s+на\s+этой\s+неделе/i,

      // Разговорные формулировки
      /хочу\s+видеть\s+неделю/i,
      /открой\s+неделю/i,
      /неделя/i
    ],
    goToMonth: [
      // Прямые команды
      /(?:покажи|перейди\s+на|переключи\s+на)\s+(?:на\s+)?месяц/i,
      /покажи\s+месячный\s+вид/i,
      /месячный\s+вид/i,
      /на\s+месяц/i,

      // Естественные формулировки
      /покажи\s+мне\s+этот\s+месяц/i,
      /что\s+в\s+этом\s+месяце/i,

      // Разговорные формулировки
      /хочу\s+видеть\s+месяц/i,
      /открой\s+месяц/i,
      /месяц/i
    ],
    goToDay: [
      // Прямые команды
      /(?:покажи|перейди\s+на|переключи\s+на)\s+(?:на\s+)?день/i,
      /покажи\s+дневной\s+вид/i,
      /дневной\s+вид/i,
      /на\s+день/i,

      // Естественные формулировки
      /покажи\s+мне\s+этот\s+день/i,
      /день\s+обзор/i,

      // Разговорные формулировки
      /хочу\s+видеть\s+день/i,
      /открой\s+день/i,
      /вернись\s+на\s+день/i
    ],
    goToYear: [
      // Прямые команды
      /(?:покажи|перейди\s+на|переключи\s+на)\s+год/i,
      /покажи\s+годовой\s+вид/i,
      /годовой\s+вид/i,

      // Естественные формулировки
      /покажи\s+мне\s+этот\s+год/i,
      /год\s+обзор/i,

      // Разговорные формулировки
      /хочу\s+видеть\s+год/i,
      /открой\s+год/i
    ]
  },
  es: {
    nextDay: [
      // Comandos directos
      /(?:siguiente|ir\s+a|adelante)\s+(?:día|mañana)/i,
      /muestra\s+el\s+siguiente\s+día/i,

      // Formulaciones naturales
      /qué\s+(?:pasa|está\s+programado)\s+mañana/i,
      /ir\s+a\s+mañana/i,
      /muestra\s+mañana/i
    ],
    prevDay: [
      // Comandos directos
      /(?:anterior|prev|ir\s+a|atrás)\s+(?:día|ayer)/i,
      /muestra\s+día\s+anterior/i,
      /volver\s+un\s+día/i,

      // Formulaciones naturales
      /qué\s+(?:pasó|estaba\s+programado)\s+ayer/i,
      /ir\s+a\s+ayer/i,
      /muestra\s+ayer/i
    ],
    today: [
      // Comandos directos - más específicos
      /^hoy$/i,
      /^ahora$/i,
      /ir\s+a\s+hoy/i,
      /muestra\s+hoy/i,
      /muestra\s+el\s+día\s+actual/i,

      // Formulaciones naturales
      /qué\s+(?:pasa|está\s+programado)\s+hoy/i,
      /muestra\s+me\s+hoy/i,
      /volver\s+a\s+hoy/i
    ],
    goToWeek: [
      // Comandos directos
      /(?:muestra|ir\s+a|cambiar\s+a)\s+(?:a\s+)?semana/i,
      /muestra\s+vista\s+semanal/i,
      /vista\s+semanal/i,
      /a\s+semana/i,

      // Formulaciones naturales
      /muestra\s+me\s+esta\s+semana/i,
      /qué\s+hay\s+esta\s+semana/i,

      // Formulaciones conversacionales
      /quiero\s+ver\s+semana/i,
      /abrir\s+semana/i,
      /semana/i
    ],
    goToMonth: [
      // Comandos directos
      /(?:muestra|ir\s+a|cambiar\s+a)\s+(?:a\s+)?mes/i,
      /muestra\s+vista\s+mensual/i,
      /vista\s+mensual/i,
      /a\s+mes/i,

      // Formulaciones naturales
      /muestra\s+me\s+este\s+mes/i,
      /qué\s+hay\s+este\s+mes/i,

      // Formulaciones conversacionales
      /quiero\s+ver\s+mes/i,
      /abrir\s+mes/i,
      /mes/i
    ],
    goToDay: [
      // Comandos directos
      /(?:muestra|ir\s+a|cambiar\s+a)\s+(?:a\s+)?día/i,
      /muestra\s+vista\s+diaria/i,
      /vista\s+diaria/i,
      /a\s+día/i,

      // Formulaciones naturales
      /muestra\s+me\s+este\s+día/i,
      /día\s+resumen/i,

      // Formulaciones conversacionales
      /quiero\s+ver\s+día/i,
      /abrir\s+día/i,
      /volver\s+a\s+día/i
    ],
    goToYear: [
      // Comandos directos
      /(?:muestra|ir\s+a|cambiar\s+a)\s+año/i,
      /muestra\s+vista\s+anual/i,
      /vista\s+anual/i,

      // Formulaciones naturales
      /muestra\s+me\s+este\s+año/i,
      /año\s+resumen/i,

      // Formulaciones conversacionales
      /quiero\s+ver\s+año/i,
      /abrir\s+año/i
    ]
  }
};

// Синонимы для относительных дат
export const relativeDateSynonyms = {
  en: {
    tomorrow: 'next',
    yesterday: 'prev',
    today: 'today'
  },
  ru: {
    завтра: 'next',
    вчера: 'prev',
    сегодня: 'today'
  },
  es: {
    mañana: 'next',
    ayer: 'prev',
    hoy: 'today'
  }
};
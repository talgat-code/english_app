export type PrepositionCategoryId = 'place' | 'time' | 'movement' | 'way'

export interface PrepositionExample {
  english: string
  russian: string
}

export interface PrepositionItem {
  id: string
  preposition: string
  meaning: string
  use: string
  pattern: string
  examples: PrepositionExample[]
  commonMistake: string
}

export interface PrepositionCategory {
  id: PrepositionCategoryId
  title: string
  description: string
  question: string
  items: PrepositionItem[]
}

export const prepositionCategories: PrepositionCategory[] = [
  {
    id: 'place',
    title: 'Место',
    description: 'Где находится человек, предмет или событие.',
    question: 'Где?',
    items: [
      {
        id: 'place-in',
        preposition: 'in',
        meaning: 'внутри, в пределах',
        use: 'Используй, когда объект находится внутри пространства, города, страны, комнаты или контейнера.',
        pattern: 'in + место с границами',
        examples: [
          { english: 'She is in the kitchen.', russian: 'Она на кухне.' },
          { english: 'I live in Almaty.', russian: 'Я живу в Алматы.' },
        ],
        commonMistake: 'Не говори at the room, если человек именно внутри комнаты: in the room.',
      },
      {
        id: 'place-on',
        preposition: 'on',
        meaning: 'на поверхности',
        use: 'Используй, когда предмет касается поверхности: стол, стена, пол, экран, страница.',
        pattern: 'on + поверхность',
        examples: [
          { english: 'The book is on the table.', russian: 'Книга на столе.' },
          { english: 'There is a photo on the wall.', russian: 'На стене есть фото.' },
        ],
        commonMistake: 'On не значит любое "на": в машине обычно in the car, не on the car.',
      },
      {
        id: 'place-at',
        preposition: 'at',
        meaning: 'в точке, у места',
        use: 'Используй для точки на карте, адреса, события или места как ориентира.',
        pattern: 'at + точка / событие',
        examples: [
          { english: 'I am at the bus stop.', russian: 'Я на автобусной остановке.' },
          { english: 'We met at the station.', russian: 'Мы встретились на станции.' },
        ],
        commonMistake: 'At показывает точку, а in - внутреннее пространство: at school как место учебы, in the school как внутри здания.',
      },
      {
        id: 'place-between',
        preposition: 'between',
        meaning: 'между',
        use: 'Используй, когда объект находится между двумя понятными точками или людьми.',
        pattern: 'between + A and B',
        examples: [
          { english: 'The cafe is between the bank and the shop.', russian: 'Кафе между банком и магазином.' },
          { english: 'Sit between Anna and Max.', russian: 'Сядь между Анной и Максом.' },
        ],
        commonMistake: 'Для двух объектов лучше between, а не among.',
      },
    ],
  },
  {
    id: 'time',
    title: 'Время',
    description: 'Когда происходит действие: точное время, день, месяц или период.',
    question: 'Когда?',
    items: [
      {
        id: 'time-at',
        preposition: 'at',
        meaning: 'в точное время',
        use: 'Используй с часами, моментами дня и устойчивыми выражениями.',
        pattern: 'at + точное время',
        examples: [
          { english: 'The lesson starts at seven.', russian: 'Урок начинается в семь.' },
          { english: 'I work better at night.', russian: 'Я лучше работаю ночью.' },
        ],
        commonMistake: 'Не говори in 7 o\'clock. С точным временем нужен at.',
      },
      {
        id: 'time-on',
        preposition: 'on',
        meaning: 'в день / дату',
        use: 'Используй с днями недели, датами и конкретными днями.',
        pattern: 'on + day/date',
        examples: [
          { english: 'I have a meeting on Monday.', russian: 'У меня встреча в понедельник.' },
          { english: 'Her birthday is on June 10.', russian: 'Ее день рождения 10 июня.' },
        ],
        commonMistake: 'С Monday нужен on, не in Monday.',
      },
      {
        id: 'time-in',
        preposition: 'in',
        meaning: 'в периоде',
        use: 'Используй с месяцами, годами, сезонами и частями дня.',
        pattern: 'in + month/year/season/period',
        examples: [
          { english: 'We travel in summer.', russian: 'Мы путешествуем летом.' },
          { english: 'I was born in 2000.', russian: 'Я родился в 2000 году.' },
        ],
        commonMistake: 'С конкретной датой нужен on, а не in: on June 10.',
      },
      {
        id: 'time-for',
        preposition: 'for',
        meaning: 'в течение',
        use: 'Используй, когда говоришь длительность действия.',
        pattern: 'for + duration',
        examples: [
          { english: 'I studied for two hours.', russian: 'Я занимался два часа.' },
          { english: 'She lived here for five years.', russian: 'Она жила здесь пять лет.' },
        ],
        commonMistake: 'For отвечает на "как долго?", а since - "с какого момента?".',
      },
    ],
  },
  {
    id: 'movement',
    title: 'Движение',
    description: 'Куда, откуда и через что движется человек или предмет.',
    question: 'Куда?',
    items: [
      {
        id: 'move-to',
        preposition: 'to',
        meaning: 'к, в направлении',
        use: 'Используй, когда есть конечная точка движения.',
        pattern: 'go/travel/send + to + place/person',
        examples: [
          { english: 'I go to work by bus.', russian: 'Я езжу на работу на автобусе.' },
          { english: 'Send this message to Kate.', russian: 'Отправь это сообщение Кейт.' },
        ],
        commonMistake: 'После go почти всегда нужен to: go to school, go to the office.',
      },
      {
        id: 'move-into',
        preposition: 'into',
        meaning: 'внутрь',
        use: 'Используй, когда объект движется снаружи внутрь пространства.',
        pattern: 'move/go/put + into + space',
        examples: [
          { english: 'She went into the room.', russian: 'Она вошла в комнату.' },
          { english: 'Put the keys into the bag.', russian: 'Положи ключи в сумку.' },
        ],
        commonMistake: 'In показывает место, into - движение внутрь.',
      },
      {
        id: 'move-through',
        preposition: 'through',
        meaning: 'через, сквозь',
        use: 'Используй, когда движение проходит внутри пространства от начала до конца.',
        pattern: 'go/walk/drive + through + space',
        examples: [
          { english: 'We walked through the park.', russian: 'Мы прошли через парк.' },
          { english: 'The train goes through the tunnel.', russian: 'Поезд идет через тоннель.' },
        ],
        commonMistake: 'Through - сквозь пространство, across - через поверхность или с одной стороны на другую.',
      },
      {
        id: 'move-across',
        preposition: 'across',
        meaning: 'через поверхность',
        use: 'Используй, когда движение идет с одной стороны на другую.',
        pattern: 'go/walk/run + across + surface',
        examples: [
          { english: 'They walked across the street.', russian: 'Они перешли улицу.' },
          { english: 'She swam across the river.', russian: 'Она переплыла реку.' },
        ],
        commonMistake: 'Для улицы и реки чаще across, не through.',
      },
    ],
  },
  {
    id: 'way',
    title: 'Способ и причина',
    description: 'Как, чем, для чего или из-за чего происходит действие.',
    question: 'Как / зачем?',
    items: [
      {
        id: 'way-by',
        preposition: 'by',
        meaning: 'способом, транспортом, кем-то',
        use: 'Используй для транспорта, способа действия и автора в passive voice.',
        pattern: 'by + transport/method/person',
        examples: [
          { english: 'I go to work by bus.', russian: 'Я езжу на работу на автобусе.' },
          { english: 'The book was written by Orwell.', russian: 'Книга была написана Оруэллом.' },
        ],
        commonMistake: 'С пешком говорят on foot, не by foot.',
      },
      {
        id: 'way-with',
        preposition: 'with',
        meaning: 'с, при помощи',
        use: 'Используй для инструмента, человека рядом или характеристики.',
        pattern: 'with + tool/person/feature',
        examples: [
          { english: 'Cut it with a knife.', russian: 'Разрежь это ножом.' },
          { english: 'I live with my family.', russian: 'Я живу с семьей.' },
        ],
        commonMistake: 'By показывает способ в целом, with - конкретный инструмент.',
      },
      {
        id: 'way-for',
        preposition: 'for',
        meaning: 'для, ради',
        use: 'Используй, когда говоришь цель, пользу или получателя.',
        pattern: 'for + person/purpose',
        examples: [
          { english: 'This gift is for you.', russian: 'Этот подарок для тебя.' },
          { english: 'I study English for work.', russian: 'Я учу английский для работы.' },
        ],
        commonMistake: 'For + цель-существительное: for work. Чтобы сказать действие-цель, часто нужен to: I called to ask.',
      },
      {
        id: 'way-because-of',
        preposition: 'because of',
        meaning: 'из-за',
        use: 'Используй с существительным, когда называешь причину.',
        pattern: 'because of + noun',
        examples: [
          { english: 'We stayed home because of the rain.', russian: 'Мы остались дома из-за дождя.' },
          { english: 'The flight was late because of the weather.', russian: 'Рейс задержался из-за погоды.' },
        ],
        commonMistake: 'Because of + noun, но because + full sentence: because it was raining.',
      },
    ],
  },
]

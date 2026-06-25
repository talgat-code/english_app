export type PhrasalVerbCategory =
  | 'повседневные'
  | 'работа'
  | 'движение'
  | 'отношения'
  | 'разное'

export type PhrasalVerbFilter = PhrasalVerbCategory | 'all'

export interface PhrasalVerbMeaning {
  russian: string
  example: string
  exampleTranslation: string
}

export interface PhrasalVerb {
  id: string
  phrase: string
  meanings: PhrasalVerbMeaning[]
  category: PhrasalVerbCategory
}

export const phrasalVerbCategories: {
  id: PhrasalVerbCategory
  label: string
  emoji: string
}[] = [
  { id: 'повседневные', label: 'Повседневные', emoji: '☀️' },
  { id: 'работа', label: 'Работа', emoji: '💼' },
  { id: 'движение', label: 'Движение', emoji: '🚶' },
  { id: 'отношения', label: 'Отношения', emoji: '🤝' },
  { id: 'разное', label: 'Разное', emoji: '✨' },
]

export const phrasalVerbs: PhrasalVerb[] = [
  {
    id: 'phrasal-verb-1',
    phrase: 'give up',
    category: 'повседневные',
    meanings: [
      {
        russian: 'сдаться, перестать пытаться',
        example: 'Do not give up after one mistake.',
        exampleTranslation: 'Не сдавайся после одной ошибки.',
      },
      {
        russian: 'бросить привычку или занятие',
        example: 'He gave up smoking last year.',
        exampleTranslation: 'В прошлом году он бросил курить.',
      },
    ],
  },
  {
    id: 'phrasal-verb-2',
    phrase: 'look for',
    category: 'повседневные',
    meanings: [
      {
        russian: 'искать',
        example: 'I am looking for my keys.',
        exampleTranslation: 'Я ищу свои ключи.',
      },
    ],
  },
  {
    id: 'phrasal-verb-3',
    phrase: 'get up',
    category: 'повседневные',
    meanings: [
      {
        russian: 'вставать с кровати',
        example: 'I usually get up at seven.',
        exampleTranslation: 'Я обычно встаю в семь.',
      },
      {
        russian: 'подняться после сидения или падения',
        example: 'She got up and opened the window.',
        exampleTranslation: 'Она встала и открыла окно.',
      },
    ],
  },
  {
    id: 'phrasal-verb-4',
    phrase: 'turn off',
    category: 'повседневные',
    meanings: [
      {
        russian: 'выключить',
        example: 'Please turn off the lights before you leave.',
        exampleTranslation: 'Пожалуйста, выключи свет перед уходом.',
      },
      {
        russian: 'оттолкнуть, вызвать неприязнь',
        example: 'His rude tone turned me off.',
        exampleTranslation: 'Его грубый тон меня оттолкнул.',
      },
    ],
  },
  {
    id: 'phrasal-verb-5',
    phrase: 'turn on',
    category: 'повседневные',
    meanings: [
      {
        russian: 'включить',
        example: 'Can you turn on the heater?',
        exampleTranslation: 'Можешь включить обогреватель?',
      },
      {
        russian: 'заинтересовать, увлечь',
        example: 'That book turned me on to history.',
        exampleTranslation: 'Эта книга заинтересовала меня историей.',
      },
    ],
  },
  {
    id: 'phrasal-verb-6',
    phrase: 'find out',
    category: 'разное',
    meanings: [
      {
        russian: 'узнать, выяснить',
        example: 'I found out the truth yesterday.',
        exampleTranslation: 'Я вчера узнал правду.',
      },
    ],
  },
  {
    id: 'phrasal-verb-7',
    phrase: 'come back',
    category: 'движение',
    meanings: [
      {
        russian: 'вернуться',
        example: 'She will come back after lunch.',
        exampleTranslation: 'Она вернётся после обеда.',
      },
      {
        russian: 'снова стать популярным или привычным',
        example: 'Vinyl records are coming back.',
        exampleTranslation: 'Виниловые пластинки снова становятся популярными.',
      },
    ],
  },
  {
    id: 'phrasal-verb-8',
    phrase: 'put off',
    category: 'работа',
    meanings: [
      {
        russian: 'отложить на потом',
        example: 'We put off the meeting until Friday.',
        exampleTranslation: 'Мы отложили встречу до пятницы.',
      },
    ],
  },
  {
    id: 'phrasal-verb-9',
    phrase: 'run out of',
    category: 'повседневные',
    meanings: [
      {
        russian: 'израсходовать, остаться без чего-то',
        example: 'We ran out of milk this morning.',
        exampleTranslation: 'Сегодня утром у нас закончилось молоко.',
      },
    ],
  },
  {
    id: 'phrasal-verb-10',
    phrase: 'look after',
    category: 'отношения',
    meanings: [
      {
        russian: 'присматривать, заботиться',
        example: 'Can you look after my dog this weekend?',
        exampleTranslation: 'Можешь присмотреть за моей собакой на выходных?',
      },
    ],
  },
  {
    id: 'phrasal-verb-11',
    phrase: 'carry on',
    category: 'работа',
    meanings: [
      {
        russian: 'продолжать',
        example: 'Carry on with the exercise.',
        exampleTranslation: 'Продолжай выполнять упражнение.',
      },
    ],
  },
  {
    id: 'phrasal-verb-12',
    phrase: 'pick up',
    category: 'повседневные',
    meanings: [
      {
        russian: 'забрать кого-то или что-то',
        example: 'I will pick you up at the station.',
        exampleTranslation: 'Я заберу тебя со станции.',
      },
      {
        russian: 'нахвататься, выучить без специальных занятий',
        example: 'She picked up Spanish while traveling.',
        exampleTranslation: 'Она подхватила испанский во время путешествий.',
      },
    ],
  },
  {
    id: 'phrasal-verb-13',
    phrase: 'take off',
    category: 'движение',
    meanings: [
      {
        russian: 'взлететь',
        example: 'The plane took off on time.',
        exampleTranslation: 'Самолёт взлетел вовремя.',
      },
      {
        russian: 'снять одежду или обувь',
        example: 'Take off your coat and sit down.',
        exampleTranslation: 'Сними пальто и садись.',
      },
      {
        russian: 'быстро стать успешным',
        example: 'Her channel took off in the spring.',
        exampleTranslation: 'Её канал резко стал успешным весной.',
      },
    ],
  },
  {
    id: 'phrasal-verb-14',
    phrase: 'put on',
    category: 'повседневные',
    meanings: [
      {
        russian: 'надеть',
        example: 'Put on a jacket, it is cold outside.',
        exampleTranslation: 'Надень куртку, на улице холодно.',
      },
      {
        russian: 'набрать вес',
        example: 'I put on a little weight during the holidays.',
        exampleTranslation: 'Я немного набрал вес за праздники.',
      },
    ],
  },
  {
    id: 'phrasal-verb-15',
    phrase: 'go on',
    category: 'разное',
    meanings: [
      {
        russian: 'продолжаться',
        example: 'The rain went on for hours.',
        exampleTranslation: 'Дождь продолжался несколько часов.',
      },
      {
        russian: 'происходить',
        example: 'What is going on here?',
        exampleTranslation: 'Что здесь происходит?',
      },
    ],
  },
  {
    id: 'phrasal-verb-16',
    phrase: 'come in',
    category: 'движение',
    meanings: [
      {
        russian: 'войти',
        example: 'Come in and close the door.',
        exampleTranslation: 'Входи и закрой дверь.',
      },
      {
        russian: 'прибыть, поступить',
        example: 'New orders came in this morning.',
        exampleTranslation: 'Сегодня утром поступили новые заказы.',
      },
    ],
  },
  {
    id: 'phrasal-verb-17',
    phrase: 'get back',
    category: 'движение',
    meanings: [
      {
        russian: 'вернуться',
        example: 'We got back home late.',
        exampleTranslation: 'Мы вернулись домой поздно.',
      },
      {
        russian: 'получить обратно',
        example: 'Did you get your money back?',
        exampleTranslation: 'Ты получил деньги обратно?',
      },
    ],
  },
  {
    id: 'phrasal-verb-18',
    phrase: 'wake up',
    category: 'повседневные',
    meanings: [
      {
        russian: 'проснуться или разбудить',
        example: 'The alarm woke me up at six.',
        exampleTranslation: 'Будильник разбудил меня в шесть.',
      },
    ],
  },
  {
    id: 'phrasal-verb-19',
    phrase: 'sit down',
    category: 'движение',
    meanings: [
      {
        russian: 'сесть',
        example: 'Sit down and tell me what happened.',
        exampleTranslation: 'Садись и расскажи, что случилось.',
      },
    ],
  },
  {
    id: 'phrasal-verb-20',
    phrase: 'stand up',
    category: 'движение',
    meanings: [
      {
        russian: 'встать',
        example: 'Everyone stood up when the teacher entered.',
        exampleTranslation: 'Все встали, когда вошёл учитель.',
      },
      {
        russian: 'заступиться за себя или другого',
        example: 'You need to stand up for yourself.',
        exampleTranslation: 'Тебе нужно постоять за себя.',
      },
    ],
  },
  {
    id: 'phrasal-verb-21',
    phrase: 'go out',
    category: 'движение',
    meanings: [
      {
        russian: 'выходить куда-то',
        example: 'We went out for dinner.',
        exampleTranslation: 'Мы вышли поужинать.',
      },
      {
        russian: 'встречаться с кем-то романтически',
        example: 'They have been going out for two months.',
        exampleTranslation: 'Они встречаются уже два месяца.',
      },
    ],
  },
  {
    id: 'phrasal-verb-22',
    phrase: 'come over',
    category: 'движение',
    meanings: [
      {
        russian: 'зайти в гости, приехать к кому-то',
        example: 'Come over after work if you have time.',
        exampleTranslation: 'Заходи после работы, если будет время.',
      },
    ],
  },
  {
    id: 'phrasal-verb-23',
    phrase: 'hang out',
    category: 'отношения',
    meanings: [
      {
        russian: 'проводить время вместе без особого плана',
        example: 'We like to hang out at the park.',
        exampleTranslation: 'Нам нравится проводить время в парке.',
      },
    ],
  },
  {
    id: 'phrasal-verb-24',
    phrase: 'get along with',
    category: 'отношения',
    meanings: [
      {
        russian: 'ладить с кем-то',
        example: 'I get along with my new colleagues.',
        exampleTranslation: 'Я хорошо лажу с новыми коллегами.',
      },
    ],
  },
  {
    id: 'phrasal-verb-25',
    phrase: 'break up',
    category: 'отношения',
    meanings: [
      {
        russian: 'расстаться',
        example: 'They broke up last summer.',
        exampleTranslation: 'Они расстались прошлым летом.',
      },
      {
        russian: 'разделить на части',
        example: 'Break up the text into short paragraphs.',
        exampleTranslation: 'Разбей текст на короткие абзацы.',
      },
    ],
  },
  {
    id: 'phrasal-verb-26',
    phrase: 'make up',
    category: 'отношения',
    meanings: [
      {
        russian: 'помириться',
        example: 'They argued, but they made up quickly.',
        exampleTranslation: 'Они поссорились, но быстро помирились.',
      },
      {
        russian: 'придумать, выдумать',
        example: 'He made up a funny story.',
        exampleTranslation: 'Он придумал смешную историю.',
      },
    ],
  },
  {
    id: 'phrasal-verb-27',
    phrase: 'ask out',
    category: 'отношения',
    meanings: [
      {
        russian: 'пригласить на свидание',
        example: 'He asked her out after class.',
        exampleTranslation: 'Он пригласил её на свидание после занятия.',
      },
    ],
  },
  {
    id: 'phrasal-verb-28',
    phrase: 'fall out',
    category: 'отношения',
    meanings: [
      {
        russian: 'поссориться',
        example: 'They fell out over money.',
        exampleTranslation: 'Они поссорились из-за денег.',
      },
    ],
  },
  {
    id: 'phrasal-verb-29',
    phrase: 'cheer up',
    category: 'отношения',
    meanings: [
      {
        russian: 'подбодрить, развеселить',
        example: 'This song always cheers me up.',
        exampleTranslation: 'Эта песня всегда поднимает мне настроение.',
      },
      {
        russian: 'повеселеть',
        example: 'She cheered up after the call.',
        exampleTranslation: 'Она повеселела после звонка.',
      },
    ],
  },
  {
    id: 'phrasal-verb-30',
    phrase: 'calm down',
    category: 'отношения',
    meanings: [
      {
        russian: 'успокоиться или успокоить',
        example: 'Take a deep breath and calm down.',
        exampleTranslation: 'Сделай глубокий вдох и успокойся.',
      },
    ],
  },
  {
    id: 'phrasal-verb-31',
    phrase: 'deal with',
    category: 'работа',
    meanings: [
      {
        russian: 'разбираться с проблемой или ситуацией',
        example: 'I will deal with this issue tomorrow.',
        exampleTranslation: 'Я разберусь с этой проблемой завтра.',
      },
      {
        russian: 'иметь дело с кем-то или чем-то',
        example: 'She deals with customers every day.',
        exampleTranslation: 'Она каждый день работает с клиентами.',
      },
    ],
  },
  {
    id: 'phrasal-verb-32',
    phrase: 'work out',
    category: 'работа',
    meanings: [
      {
        russian: 'получиться, сложиться удачно',
        example: 'I hope everything works out.',
        exampleTranslation: 'Надеюсь, всё получится.',
      },
      {
        russian: 'тренироваться',
        example: 'He works out three times a week.',
        exampleTranslation: 'Он тренируется три раза в неделю.',
      },
      {
        russian: 'решить, разобраться',
        example: 'We worked out the answer together.',
        exampleTranslation: 'Мы вместе нашли решение.',
      },
    ],
  },
  {
    id: 'phrasal-verb-33',
    phrase: 'set up',
    category: 'работа',
    meanings: [
      {
        russian: 'настроить, установить',
        example: 'Can you set up the new app?',
        exampleTranslation: 'Можешь настроить новое приложение?',
      },
      {
        russian: 'организовать',
        example: 'They set up a meeting with the client.',
        exampleTranslation: 'Они организовали встречу с клиентом.',
      },
    ],
  },
  {
    id: 'phrasal-verb-34',
    phrase: 'take over',
    category: 'работа',
    meanings: [
      {
        russian: 'взять контроль или ответственность',
        example: 'She took over the project in May.',
        exampleTranslation: 'Она взяла проект под контроль в мае.',
      },
    ],
  },
  {
    id: 'phrasal-verb-35',
    phrase: 'fill in',
    category: 'работа',
    meanings: [
      {
        russian: 'заполнить форму или пропуск',
        example: 'Please fill in this form.',
        exampleTranslation: 'Пожалуйста, заполните эту форму.',
      },
      {
        russian: 'заменить кого-то временно',
        example: 'Can you fill in for me tomorrow?',
        exampleTranslation: 'Можешь подменить меня завтра?',
      },
    ],
  },
  {
    id: 'phrasal-verb-36',
    phrase: 'bring up',
    category: 'работа',
    meanings: [
      {
        russian: 'поднять тему',
        example: 'She brought up an important question.',
        exampleTranslation: 'Она подняла важный вопрос.',
      },
      {
        russian: 'воспитывать ребёнка',
        example: 'He was brought up by his grandparents.',
        exampleTranslation: 'Его воспитали бабушка и дедушка.',
      },
    ],
  },
  {
    id: 'phrasal-verb-37',
    phrase: 'call off',
    category: 'работа',
    meanings: [
      {
        russian: 'отменить',
        example: 'They called off the trip because of the storm.',
        exampleTranslation: 'Они отменили поездку из-за шторма.',
      },
    ],
  },
  {
    id: 'phrasal-verb-38',
    phrase: 'follow up',
    category: 'работа',
    meanings: [
      {
        russian: 'уточнить, продолжить после первого контакта',
        example: 'I will follow up by email.',
        exampleTranslation: 'Я уточню всё по электронной почте.',
      },
    ],
  },
  {
    id: 'phrasal-verb-39',
    phrase: 'look into',
    category: 'работа',
    meanings: [
      {
        russian: 'изучить, расследовать',
        example: 'We need to look into this complaint.',
        exampleTranslation: 'Нам нужно разобраться с этой жалобой.',
      },
    ],
  },
  {
    id: 'phrasal-verb-40',
    phrase: 'hand in',
    category: 'работа',
    meanings: [
      {
        russian: 'сдать работу, документ или задание',
        example: 'Please hand in your homework by Monday.',
        exampleTranslation: 'Пожалуйста, сдайте домашнее задание к понедельнику.',
      },
    ],
  },
  {
    id: 'phrasal-verb-41',
    phrase: 'go ahead',
    category: 'работа',
    meanings: [
      {
        russian: 'начинать, продолжать с разрешения',
        example: 'You can go ahead and send the file.',
        exampleTranslation: 'Можешь отправлять файл.',
      },
    ],
  },
  {
    id: 'phrasal-verb-42',
    phrase: 'check in',
    category: 'движение',
    meanings: [
      {
        russian: 'зарегистрироваться в отеле или аэропорту',
        example: 'We checked in at the hotel at noon.',
        exampleTranslation: 'Мы зарегистрировались в отеле в полдень.',
      },
      {
        russian: 'связаться, чтобы узнать, как дела',
        example: 'I just wanted to check in and see how you are.',
        exampleTranslation: 'Я просто хотел связаться и узнать, как ты.',
      },
    ],
  },
  {
    id: 'phrasal-verb-43',
    phrase: 'move on',
    category: 'отношения',
    meanings: [
      {
        russian: 'жить дальше после трудной ситуации',
        example: 'It took her time to move on after the breakup.',
        exampleTranslation: 'Ей понадобилось время, чтобы жить дальше после расставания.',
      },
      {
        russian: 'перейти к следующей теме или делу',
        example: 'Let us move on to the next question.',
        exampleTranslation: 'Давайте перейдём к следующему вопросу.',
      },
    ],
  },
  {
    id: 'phrasal-verb-44',
    phrase: 'get over',
    category: 'отношения',
    meanings: [
      {
        russian: 'пережить, оправиться эмоционально',
        example: 'He is still getting over the breakup.',
        exampleTranslation: 'Он всё ещё переживает расставание.',
      },
      {
        russian: 'выздороветь после болезни',
        example: 'She got over the flu quickly.',
        exampleTranslation: 'Она быстро выздоровела после гриппа.',
      },
    ],
  },
  {
    id: 'phrasal-verb-45',
    phrase: 'show up',
    category: 'движение',
    meanings: [
      {
        russian: 'появиться, прийти',
        example: 'He showed up ten minutes late.',
        exampleTranslation: 'Он появился на десять минут позже.',
      },
    ],
  },
  {
    id: 'phrasal-verb-46',
    phrase: 'drop off',
    category: 'движение',
    meanings: [
      {
        russian: 'завезти, высадить',
        example: 'I will drop you off near the office.',
        exampleTranslation: 'Я высажу тебя рядом с офисом.',
      },
      {
        russian: 'заснуть',
        example: 'The baby dropped off after dinner.',
        exampleTranslation: 'Ребёнок заснул после ужина.',
      },
    ],
  },
  {
    id: 'phrasal-verb-47',
    phrase: 'pass out',
    category: 'разное',
    meanings: [
      {
        russian: 'потерять сознание',
        example: 'He almost passed out from the heat.',
        exampleTranslation: 'Он почти потерял сознание от жары.',
      },
      {
        russian: 'раздать',
        example: 'The teacher passed out the tests.',
        exampleTranslation: 'Учитель раздал тесты.',
      },
    ],
  },
  {
    id: 'phrasal-verb-48',
    phrase: 'figure out',
    category: 'разное',
    meanings: [
      {
        russian: 'понять, разобраться',
        example: 'I cannot figure out this rule.',
        exampleTranslation: 'Я не могу разобраться с этим правилом.',
      },
    ],
  },
  {
    id: 'phrasal-verb-49',
    phrase: 'bring back',
    category: 'разное',
    meanings: [
      {
        russian: 'вернуть',
        example: 'Please bring back my book tomorrow.',
        exampleTranslation: 'Пожалуйста, верни мою книгу завтра.',
      },
      {
        russian: 'напомнить, вернуть воспоминания',
        example: 'This song brings back school memories.',
        exampleTranslation: 'Эта песня навевает школьные воспоминания.',
      },
    ],
  },
  {
    id: 'phrasal-verb-50',
    phrase: 'cut down on',
    category: 'повседневные',
    meanings: [
      {
        russian: 'сократить потребление или количество',
        example: 'I am trying to cut down on sugar.',
        exampleTranslation: 'Я стараюсь есть меньше сахара.',
      },
    ],
  },
]

export const totalPhrasalVerbCount = phrasalVerbs.length

const phrasalVerbsById = new Map(
  phrasalVerbs.map((phrasalVerb) => [phrasalVerb.id, phrasalVerb] as const),
)

export function getPhrasalVerbById(id: string): PhrasalVerb | undefined {
  return phrasalVerbsById.get(id)
}

export function getPhrasalVerbsByCategory(
  category: PhrasalVerbFilter,
): PhrasalVerb[] {
  if (category === 'all') return phrasalVerbs
  return phrasalVerbs.filter((phrasalVerb) => phrasalVerb.category === category)
}

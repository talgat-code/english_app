export type GerundInfinitiveMode = 'gerund' | 'infinitive' | 'both'

export interface TranslationExample {
  english: string
  russian: string
}

export interface GerundInfinitiveRule {
  id: string
  title: string
  explanation: string
  pattern: string
  examples: TranslationExample[]
  commonMistake: string
  mode?: GerundInfinitiveMode
  note?: string
}

export interface VerbPatternGroup {
  id: string
  title: string
  pattern: string
  verbs: string[]
  examples: TranslationExample[]
  mode?: GerundInfinitiveMode
  note?: string
}

export interface GerundInfinitiveQuestion {
  id: string
  sentence: string
  options: string[]
  correctIndex: number
  explanation: string
  ruleId?: string
  mode?: GerundInfinitiveMode
}

export const gerundInfinitiveRules: GerundInfinitiveRule[] = [
  {
    id: 'gerund-after-verbs',
    title: 'После некоторых глаголов нужен -ing',
    mode: 'gerund',
    explanation:
      'После enjoy, avoid, finish, mind, suggest и некоторых других глаголов используется герундий: глагол с окончанием -ing.',
    pattern: 'verb + doing',
    examples: [
      {
        english: 'I enjoy reading in English.',
        russian: 'Мне нравится читать на английском.',
      },
      {
        english: 'She finished writing the report.',
        russian: 'Она закончила писать отчет.',
      },
    ],
    commonMistake: 'I enjoy to read → I enjoy reading.',
  },
  {
    id: 'infinitive-after-verbs',
    title: 'После want, decide, plan нужен to + verb',
    mode: 'infinitive',
    explanation:
      'После глаголов желания, решения, надежды и планирования обычно используется инфинитив с to. После to глагол всегда остается в базовой форме.',
    pattern: 'verb + to do',
    examples: [
      {
        english: 'I want to speak better.',
        russian: 'Я хочу говорить лучше.',
      },
      {
        english: 'We decided to stay home.',
        russian: 'Мы решили остаться дома.',
      },
    ],
    commonMistake: 'She decided staying → She decided to stay.',
  },
  {
    id: 'after-prepositions',
    title: 'После предлогов обычно нужен -ing',
    mode: 'gerund',
    explanation:
      'После предлогов используется форма -ing: after working, before leaving, without asking. Это относится и к выражениям, где to является предлогом.',
    pattern: 'preposition + doing',
    examples: [
      {
        english: 'He left without saying goodbye.',
        russian: 'Он ушел, не попрощавшись.',
      },
      {
        english: 'I look forward to hearing from you.',
        russian: 'Я с нетерпением жду вестей от тебя.',
      },
    ],
    commonMistake: 'without to ask → without asking.',
    note: 'В look forward to и be used to слово to — это предлог, поэтому после него нужен -ing.',
  },
  {
    id: 'purpose-infinitive',
    title: 'Для выражения цели нужен to + verb',
    mode: 'infinitive',
    explanation:
      'Когда действие отвечает на вопрос «зачем?», используй to + verb. Так выражается цель действия.',
    pattern: 'action + to do something',
    examples: [
      {
        english: 'I called to ask a question.',
        russian: 'Я позвонил, чтобы задать вопрос.',
      },
      {
        english: 'She went to the shop to buy milk.',
        russian: 'Она пошла в магазин, чтобы купить молоко.',
      },
    ],
    commonMistake: 'I came for ask → I came to ask.',
  },
  {
    id: 'both-forms',
    title: 'Like, love, hate и prefer могут идти с обеими формами',
    mode: 'both',
    explanation:
      'После like, love, hate и prefer часто возможны и -ing, и to + verb. Форма -ing обычно говорит о действии в целом, а to + verb чаще показывает привычку, выбор или конкретную ситуацию.',
    pattern: 'like doing / like to do',
    examples: [
      {
        english: 'I like learning languages.',
        russian: 'Мне нравится изучать языки.',
      },
      {
        english: 'I like to check my work twice.',
        russian: 'Я предпочитаю проверять свою работу дважды.',
      },
    ],
    commonMistake:
      'I like to swimming → I like swimming / I like to swim.',
    note: 'Разница между формами не всегда строгая и зависит от контекста.',
  },
  {
    id: 'meaning-change',
    title: 'После remember, stop и try форма меняет смысл',
    mode: 'both',
    explanation:
      'Некоторые глаголы могут использоваться с обеими формами, но значение предложения меняется. Их нужно учить парами.',
    pattern: 'remember doing / remember to do',
    examples: [
      {
        english: 'I remember meeting her.',
        russian: 'Я помню, как встретил ее.',
      },
      {
        english: 'Remember to call her.',
        russian: 'Не забудь позвонить ей.',
      },
    ],
    commonMistake:
      'I stopped to smoke не означает «Я бросил курить». Это значит: «Я остановился, чтобы покурить».',
  },
]

export const verbPatternGroups: VerbPatternGroup[] = [
  {
    id: 'gerund-verbs',
    title: 'Глаголы + -ing',
    mode: 'gerund',
    pattern: 'enjoy doing',
    verbs: [
      'enjoy',
      'avoid',
      'finish',
      'keep',
      'mind',
      'miss',
      'practice',
      'suggest',
      'recommend',
      'consider',
    ],
    examples: [
      {
        english: 'Practice speaking every day.',
        russian: 'Практикуй говорение каждый день.',
      },
      {
        english: 'Do you mind waiting?',
        russian: 'Ты не против подождать?',
      },
    ],
  },
  {
    id: 'infinitive-verbs',
    title: 'Глаголы + to do',
    mode: 'infinitive',
    pattern: 'want to do',
    verbs: [
      'want',
      'need',
      'decide',
      'plan',
      'hope',
      'learn',
      'promise',
      'expect',
      'agree',
      'refuse',
      'would like',
    ],
    examples: [
      {
        english: 'I hope to see you soon.',
        russian: 'Надеюсь скоро тебя увидеть.',
      },
      {
        english: 'They plan to move next year.',
        russian: 'Они планируют переехать в следующем году.',
      },
    ],
  },
  {
    id: 'preposition-patterns',
    title: 'Выражения с предлогом + -ing',
    mode: 'gerund',
    pattern: 'look forward to doing',
    verbs: [
      'look forward to',
      'be used to',
      'get used to',
      'object to',
      'think about',
      'apologize for',
    ],
    examples: [
      {
        english: 'She is used to working late.',
        russian: 'Она привыкла работать допоздна.',
      },
      {
        english: 'We are thinking about moving abroad.',
        russian: 'Мы думаем о переезде за границу.',
      },
    ],
    note: 'После этих выражений to и about являются предлогами.',
  },
  {
    id: 'both-verbs',
    title: 'Глаголы с обеими формами',
    mode: 'both',
    pattern: 'like doing / like to do',
    verbs: [
      'like',
      'love',
      'hate',
      'prefer',
      'start',
      'begin',
      'continue',
    ],
    examples: [
      {
        english: 'I love learning languages.',
        russian: 'Я люблю изучать языки.',
      },
      {
        english: 'She started to laugh.',
        russian: 'Она начала смеяться.',
      },
    ],
  },
  {
    id: 'meaning-change-verbs',
    title: 'Глаголы, где форма меняет смысл',
    mode: 'both',
    pattern: 'stop doing / stop to do',
    verbs: ['remember', 'forget', 'stop', 'try', 'regret'],
    examples: [
      {
        english: 'He stopped smoking.',
        russian: 'Он бросил курить.',
      },
      {
        english: 'He stopped to smoke.',
        russian: 'Он остановился, чтобы покурить.',
      },
    ],
    note: 'Здесь нельзя выбирать форму случайно: она меняет смысл предложения.',
  },
]

export const gerundInfinitivePractice: GerundInfinitiveQuestion[] = [
  {
    id: 'gi-1',
    sentence: 'I enjoy ___ English podcasts.',
    options: ['listen to', 'listening to', 'to listen to', 'listened to'],
    correctIndex: 1,
    explanation: 'После enjoy нужен gerund: enjoy listening.',
    ruleId: 'gerund-after-verbs',
    mode: 'gerund',
  },
  {
    id: 'gi-2',
    sentence: 'She decided ___ a new course.',
    options: ['taking', 'take', 'to take', 'took'],
    correctIndex: 2,
    explanation: 'После decide нужен infinitive: decided to take.',
    ruleId: 'infinitive-after-verbs',
    mode: 'infinitive',
  },
  {
    id: 'gi-3',
    sentence: 'He left without ___ goodbye.',
    options: ['say', 'to say', 'saying', 'said'],
    correctIndex: 2,
    explanation: 'После without нужен -ing: without saying.',
    ruleId: 'after-prepositions',
    mode: 'gerund',
  },
  {
    id: 'gi-4',
    sentence: 'We went to the café ___ lunch.',
    options: ['having', 'to have', 'have', 'had'],
    correctIndex: 1,
    explanation:
      'Цель действия выражается через to + verb: went to have lunch.',
    ruleId: 'purpose-infinitive',
    mode: 'infinitive',
  },
  {
    id: 'gi-5',
    sentence: 'Do you mind ___ the window?',
    options: ['open', 'to open', 'opening', 'opened'],
    correctIndex: 2,
    explanation: 'После mind нужен gerund: mind opening.',
    ruleId: 'gerund-after-verbs',
    mode: 'gerund',
  },
  {
    id: 'gi-6',
    sentence: 'I would like ___ a table for two.',
    options: ['booking', 'book', 'to book', 'booked'],
    correctIndex: 2,
    explanation: 'После would like нужен infinitive: would like to book.',
    ruleId: 'infinitive-after-verbs',
    mode: 'infinitive',
  },
  {
    id: 'gi-7',
    sentence: 'They suggested ___ earlier.',
    options: ['meeting', 'to meet', 'meet', 'met'],
    correctIndex: 0,
    explanation: 'После suggest нужен gerund: suggested meeting.',
    ruleId: 'gerund-after-verbs',
    mode: 'gerund',
  },
  {
    id: 'gi-8',
    sentence: 'I need ___ my pronunciation.',
    options: ['improving', 'improve', 'to improve', 'improved'],
    correctIndex: 2,
    explanation: 'После need обычно нужен infinitive: need to improve.',
    ruleId: 'infinitive-after-verbs',
    mode: 'infinitive',
  },
  {
    id: 'gi-9',
    sentence: 'I look forward to ___ from you.',
    options: ['hear', 'hearing', 'to hear', 'heard'],
    correctIndex: 1,
    explanation:
      'В look forward to слово to — предлог, поэтому после него нужен -ing: hearing.',
    ruleId: 'after-prepositions',
    mode: 'gerund',
  },
  {
    id: 'gi-10',
    sentence: 'She is used to ___ up early.',
    options: ['get', 'getting', 'to get', 'got'],
    correctIndex: 1,
    explanation:
      'В be used to слово to — предлог: be used to getting up early.',
    ruleId: 'after-prepositions',
    mode: 'gerund',
  },
  {
    id: 'gi-11',
    sentence: 'Please remember ___ the door.',
    options: ['lock', 'locking', 'to lock', 'locked'],
    correctIndex: 2,
    explanation:
      'Remember to do означает «не забыть сделать что-то»: remember to lock.',
    ruleId: 'meaning-change',
    mode: 'both',
  },
  {
    id: 'gi-12',
    sentence: 'I remember ___ this film when I was a child.',
    options: ['watch', 'to watch', 'watching', 'watched'],
    correctIndex: 2,
    explanation:
      'Remember doing означает помнить прошлое действие: remember watching.',
    ruleId: 'meaning-change',
    mode: 'both',
  },
  {
    id: 'gi-13',
    sentence: 'He stopped ___ because he was tired.',
    options: ['work', 'working', 'to work', 'worked'],
    correctIndex: 1,
    explanation:
      'Stop doing означает прекратить действие: he stopped working.',
    ruleId: 'meaning-change',
    mode: 'both',
  },
  {
    id: 'gi-14',
    sentence: 'We stopped ___ some water on the way home.',
    options: ['buy', 'buying', 'to buy', 'bought'],
    correctIndex: 2,
    explanation:
      'Stop to do означает остановиться, чтобы сделать другое действие: stopped to buy.',
    ruleId: 'meaning-change',
    mode: 'both',
  },
  {
    id: 'gi-15',
    sentence: 'Try ___ a short break when you cannot focus.',
    options: ['take', 'taking', 'to take', 'took'],
    correctIndex: 1,
    explanation:
      'Try doing означает попробовать метод как эксперимент: try taking a break.',
    ruleId: 'meaning-change',
    mode: 'both',
  },
]
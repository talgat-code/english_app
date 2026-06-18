export type GerundInfinitiveMode = 'gerund' | 'infinitive' | 'both'

export interface GerundInfinitiveRule {
  id: string
  title: string
  explanation: string
  pattern: string
  examples: { english: string; russian: string }[]
  commonMistake: string
}

export interface VerbPatternGroup {
  id: string
  title: string
  pattern: string
  verbs: string[]
  examples: { english: string; russian: string }[]
}

export interface GerundInfinitiveQuestion {
  id: string
  sentence: string
  options: string[]
  correctIndex: number
  explanation: string
}

export const gerundInfinitiveRules: GerundInfinitiveRule[] = [
  {
    id: 'gerund-after-verbs',
    title: 'После enjoy, avoid, finish нужен -ing',
    explanation:
      'Некоторые глаголы требуют после себя герундий. В русском переводе это часто звучит как обычный инфинитив, поэтому форму лучше запоминать вместе с глаголом.',
    pattern: 'verb + doing',
    examples: [
      { english: 'I enjoy reading in English.', russian: 'Мне нравится читать на английском.' },
      { english: 'She finished writing the report.', russian: 'Она закончила писать отчет.' },
    ],
    commonMistake: 'I enjoy to read -> I enjoy reading.',
  },
  {
    id: 'infinitive-after-verbs',
    title: 'После want, decide, plan нужен to + verb',
    explanation:
      'Глаголы желания, решения и планирования часто требуют инфинитив с to. После to глагол остается в базовой форме.',
    pattern: 'verb + to do',
    examples: [
      { english: 'I want to speak better.', russian: 'Я хочу говорить лучше.' },
      { english: 'We decided to stay home.', russian: 'Мы решили остаться дома.' },
    ],
    commonMistake: 'She decided staying -> She decided to stay.',
  },
  {
    id: 'after-prepositions',
    title: 'После предлогов обычно нужен -ing',
    explanation:
      'Если перед действием стоит предлог, следующий глагол чаще переходит в форму -ing: after working, without asking, before leaving.',
    pattern: 'preposition + doing',
    examples: [
      { english: 'He left without saying goodbye.', russian: 'Он ушел, не попрощавшись.' },
      { english: 'After finishing work, I went home.', russian: 'Закончив работу, я пошел домой.' },
    ],
    commonMistake: 'without to ask -> without asking.',
  },
  {
    id: 'purpose-infinitive',
    title: 'Для цели часто нужен to + verb',
    explanation:
      'Когда отвечаешь на вопрос "зачем?", используй to + verb. Это короткий способ показать цель действия.',
    pattern: 'action + to do something',
    examples: [
      { english: 'I called to ask a question.', russian: 'Я позвонил, чтобы задать вопрос.' },
      { english: 'She went to the shop to buy milk.', russian: 'Она пошла в магазин, чтобы купить молоко.' },
    ],
    commonMistake: 'I came for ask -> I came to ask.',
  },
]

export const verbPatternGroups: VerbPatternGroup[] = [
  {
    id: 'gerund-verbs',
    title: 'Глаголы + -ing',
    pattern: 'enjoy doing',
    verbs: ['enjoy', 'avoid', 'finish', 'keep', 'mind', 'miss', 'practice', 'suggest'],
    examples: [
      { english: 'Practice speaking every day.', russian: 'Практикуй говорение каждый день.' },
      { english: 'Do you mind waiting?', russian: 'Ты не против подождать?' },
    ],
  },
  {
    id: 'infinitive-verbs',
    title: 'Глаголы + to do',
    pattern: 'want to do',
    verbs: ['want', 'need', 'decide', 'plan', 'hope', 'learn', 'promise', 'would like'],
    examples: [
      { english: 'I hope to see you soon.', russian: 'Надеюсь скоро тебя увидеть.' },
      { english: 'They plan to move next year.', russian: 'Они планируют переехать в следующем году.' },
    ],
  },
  {
    id: 'both-verbs',
    title: 'Могут работать с обеими формами',
    pattern: 'like doing / like to do',
    verbs: ['like', 'love', 'hate', 'prefer', 'start', 'begin', 'continue'],
    examples: [
      { english: 'I like learning languages.', russian: 'Мне нравится изучать языки.' },
      { english: 'I like to check my work twice.', russian: 'Мне нравится проверять работу дважды.' },
    ],
  },
]

export const gerundInfinitivePractice: GerundInfinitiveQuestion[] = [
  {
    id: 'gi-1',
    sentence: 'I enjoy ___ English podcasts.',
    options: ['listen to', 'listening to', 'to listen to', 'listened to'],
    correctIndex: 1,
    explanation: 'После enjoy нужен gerund: enjoy listening.',
  },
  {
    id: 'gi-2',
    sentence: 'She decided ___ a new course.',
    options: ['taking', 'take', 'to take', 'took'],
    correctIndex: 2,
    explanation: 'После decide нужен infinitive: decided to take.',
  },
  {
    id: 'gi-3',
    sentence: 'He left without ___ goodbye.',
    options: ['say', 'to say', 'saying', 'said'],
    correctIndex: 2,
    explanation: 'После without нужен -ing: without saying.',
  },
  {
    id: 'gi-4',
    sentence: 'We went to the cafe ___ lunch.',
    options: ['having', 'to have', 'have', 'had'],
    correctIndex: 1,
    explanation: 'Цель действия выражаем через to + verb: went to have lunch.',
  },
  {
    id: 'gi-5',
    sentence: 'Do you mind ___ the window?',
    options: ['open', 'to open', 'opening', 'opened'],
    correctIndex: 2,
    explanation: 'После mind нужен gerund: mind opening.',
  },
  {
    id: 'gi-6',
    sentence: 'I would like ___ a table for two.',
    options: ['booking', 'book', 'to book', 'booked'],
    correctIndex: 2,
    explanation: 'После would like нужен infinitive: would like to book.',
  },
  {
    id: 'gi-7',
    sentence: 'They suggested ___ earlier.',
    options: ['meeting', 'to meet', 'meet', 'met'],
    correctIndex: 0,
    explanation: 'После suggest нужен gerund: suggested meeting.',
  },
  {
    id: 'gi-8',
    sentence: 'I need ___ my pronunciation.',
    options: ['improving', 'improve', 'to improve', 'improved'],
    correctIndex: 2,
    explanation: 'После need чаще нужен infinitive: need to improve.',
  },
]

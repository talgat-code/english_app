export type IdiomCategory =
  | 'повседневные'
  | 'эмоции'
  | 'работа'
  | 'отношения'
  | 'разговорные'

export type IdiomFilter = IdiomCategory | 'all'

export interface Idiom {
  id: string
  phrase: string
  literal: string
  meaning: string
  example: string
  exampleTranslation: string
  category: IdiomCategory
}

type IdiomEntry = [
  phrase: string,
  literal: string,
  meaning: string,
  example: string,
  exampleTranslation: string,
  category: IdiomCategory,
]

function makeIdioms(entries: IdiomEntry[]): Idiom[] {
  return entries.map(
    ([phrase, literal, meaning, example, exampleTranslation, category], index) => ({
      id: `idiom-${index + 1}`,
      phrase,
      literal,
      meaning,
      example,
      exampleTranslation,
      category,
    }),
  )
}

export const idiomCategories: { id: IdiomCategory; label: string; emoji: string }[] = [
  { id: 'повседневные', label: 'Повседневные', emoji: '☀️' },
  { id: 'эмоции', label: 'Эмоции', emoji: '❤️' },
  { id: 'работа', label: 'Работа', emoji: '💼' },
  { id: 'отношения', label: 'Отношения', emoji: '🤝' },
  { id: 'разговорные', label: 'Разговорные', emoji: '💬' },
]

export const idioms: Idiom[] = makeIdioms([
  [
    'break the ice',
    'сломать лёд',
    'разрядить обстановку и начать общение',
    'I told a quick joke to break the ice at the meeting.',
    'Я рассказал короткую шутку, чтобы разрядить обстановку на встрече.',
    'повседневные',
  ],
  [
    'piece of cake',
    'кусок торта',
    'что-то очень лёгкое',
    'The test was a piece of cake for her.',
    'Тест был для неё очень лёгким.',
    'повседневные',
  ],
  [
    'once in a blue moon',
    'однажды в голубую луну',
    'крайне редко',
    'We eat out once in a blue moon these days.',
    'Сейчас мы едим вне дома крайне редко.',
    'повседневные',
  ],
  [
    'call it a day',
    'назвать это днём',
    'закончить на сегодня',
    'It is getting late, so let us call it a day.',
    'Уже поздно, так что давай на сегодня закончим.',
    'повседневные',
  ],
  [
    'kill two birds with one stone',
    'убить двух птиц одним камнем',
    'сделать два дела одним действием',
    'I walked to the store to kill two birds with one stone and get some exercise.',
    'Я пошёл в магазин пешком, чтобы и купить продукты, и немного размяться.',
    'повседневные',
  ],
  [
    'cost an arm and a leg',
    'стоить руку и ногу',
    'стоить очень дорого',
    'That sofa costs an arm and a leg.',
    'Этот диван стоит очень дорого.',
    'повседневные',
  ],
  [
    'get the hang of it',
    'уловить, как это работает',
    'освоиться и начать понимать, как что-то делать',
    'Give it a few days and you will get the hang of it.',
    'Дай себе пару дней, и ты освоишься.',
    'повседневные',
  ],
  [
    'back to square one',
    'назад к первой клетке',
    'вернуться к самому началу',
    'The plan failed, so we are back to square one.',
    'План провалился, так что мы снова вернулись к самому началу.',
    'повседневные',
  ],
  [
    'let the cat out of the bag',
    'выпустить кота из мешка',
    'случайно выдать секрет',
    'He let the cat out of the bag about the surprise party.',
    'Он случайно выдал секрет о вечеринке-сюрпризе.',
    'повседневные',
  ],
  [
    'under the weather',
    'под погодой',
    'чувствовать себя не очень хорошо',
    'I am a bit under the weather today, so I will stay home.',
    'Сегодня я не очень хорошо себя чувствую, поэтому останусь дома.',
    'эмоции',
  ],
  [
    'on cloud nine',
    'на девятом облаке',
    'быть очень счастливым',
    'She was on cloud nine after getting the job offer.',
    'Она была на седьмом небе от счастья после предложения о работе.',
    'эмоции',
  ],
  [
    'down in the dumps',
    'в мусорных баках',
    'быть подавленным и в плохом настроении',
    'He has been down in the dumps since the weekend.',
    'С выходных он ходит подавленный.',
    'эмоции',
  ],
  [
    'over the moon',
    'над луной',
    'быть в полном восторге',
    'We were over the moon when we heard the news.',
    'Мы были в полном восторге, когда услышали эту новость.',
    'эмоции',
  ],
  [
    'get cold feet',
    'получить холодные ноги',
    'струсить в последний момент',
    'She got cold feet right before the presentation.',
    'Она струсила прямо перед презентацией.',
    'эмоции',
  ],
  [
    'blow off steam',
    'выпустить пар',
    'снять напряжение и выплеснуть эмоции',
    'I go for a run to blow off steam after work.',
    'После работы я бегаю, чтобы снять напряжение.',
    'эмоции',
  ],
  [
    'keep your chin up',
    'держать подбородок вверх',
    'не унывать',
    'Keep your chin up, things will get better soon.',
    'Не унывай, скоро всё наладится.',
    'эмоции',
  ],
  [
    'lose your temper',
    'потерять свой характер',
    'вспылить, выйти из себя',
    'He lost his temper when the computer crashed again.',
    'Он вышел из себя, когда компьютер снова завис.',
    'эмоции',
  ],
  [
    'feel blue',
    'чувствовать себя синим',
    'грустить',
    'I sometimes feel blue on rainy Sundays.',
    'Иногда по дождливым воскресеньям мне грустно.',
    'эмоции',
  ],
  [
    'hit the books',
    'удариться в книги',
    'сесть серьёзно заниматься',
    'I need to hit the books before my English exam.',
    'Мне нужно серьёзно позаниматься перед экзаменом по английскому.',
    'работа',
  ],
  [
    'burn the midnight oil',
    'жечь полуночное масло',
    'работать или учиться допоздна',
    'She burned the midnight oil to finish the report.',
    'Она засиделась до ночи, чтобы закончить отчёт.',
    'работа',
  ],
  [
    'think outside the box',
    'думать вне коробки',
    'мыслить нестандартно',
    'We need to think outside the box to solve this problem.',
    'Нам нужно мыслить нестандартно, чтобы решить эту проблему.',
    'работа',
  ],
  [
    'on the same page',
    'на одной и той же странице',
    'одинаково понимать ситуацию',
    'Let us make sure we are all on the same page before we start.',
    'Давайте убедимся, что все одинаково понимают задачу, прежде чем начнём.',
    'работа',
  ],
  [
    'learn the ropes',
    'изучить верёвки',
    'освоить основы нового дела',
    'It took me a week to learn the ropes at my new job.',
    'Мне понадобилась неделя, чтобы освоить основы на новой работе.',
    'работа',
  ],
  [
    'touch base',
    'коснуться базы',
    'коротко связаться и свериться',
    'Let us touch base tomorrow morning about the project.',
    'Давай завтра утром коротко сверимся по проекту.',
    'работа',
  ],
  [
    'in the loop',
    'внутри круга',
    'быть в курсе происходящего',
    'Please keep me in the loop about any changes.',
    'Пожалуйста, держи меня в курсе любых изменений.',
    'работа',
  ],
  [
    'go the extra mile',
    'пройти лишнюю милю',
    'сделать больше, чем от тебя ожидают',
    'She always goes the extra mile for her clients.',
    'Она всегда делает для клиентов больше, чем от неё ожидают.',
    'работа',
  ],
  [
    'cut corners',
    'срезать углы',
    'делать кое-как ради экономии времени или денег',
    'If we cut corners now, we will have bigger problems later.',
    'Если сейчас схалтурим, позже проблем будет только больше.',
    'работа',
  ],
  [
    'pull some strings',
    'потянуть за ниточки',
    'использовать связи, чтобы что-то устроить',
    'He pulled some strings to get us a meeting with the manager.',
    'Он задействовал связи, чтобы организовать нам встречу с менеджером.',
    'работа',
  ],
  [
    'see eye to eye',
    'видеть глаз в глаз',
    'полностью соглашаться друг с другом',
    'We do not always see eye to eye, but we work well together.',
    'Мы не всегда во всём согласны, но хорошо работаем вместе.',
    'отношения',
  ],
  [
    'get along with',
    'ладить с',
    'хорошо уживаться с кем-то',
    'She gets along with almost everyone in the office.',
    'Она ладит почти со всеми в офисе.',
    'отношения',
  ],
  [
    'give someone the cold shoulder',
    'показать кому-то холодное плечо',
    'демонстративно игнорировать кого-то',
    'He gave me the cold shoulder after our argument.',
    'После нашей ссоры он меня демонстративно игнорировал.',
    'отношения',
  ],
  [
    'patch things up',
    'залатать вещи',
    'помириться и наладить отношения',
    'They had a long talk and patched things up.',
    'Они долго поговорили и помирились.',
    'отношения',
  ],
  [
    'have a soft spot for',
    'иметь мягкое место для',
    'испытывать тёплую слабость к кому-то или чему-то',
    'I have a soft spot for old family photos.',
    'У меня особая слабость к старым семейным фотографиям.',
    'отношения',
  ],
  [
    'hit it off',
    'сразу попасть в ритм',
    'сразу найти общий язык',
    'We hit it off the first time we met.',
    'Мы сразу нашли общий язык при первой встрече.',
    'отношения',
  ],
  [
    'be there for someone',
    'быть рядом для кого-то',
    'поддерживать человека в трудный момент',
    'She was there for me when I really needed help.',
    'Она поддержала меня, когда мне действительно нужна была помощь.',
    'отношения',
  ],
  [
    'bend over backwards',
    'согнуться назад',
    'очень сильно стараться ради кого-то',
    'He bent over backwards to make his guests comfortable.',
    'Он очень старался, чтобы гостям было комфортно.',
    'отношения',
  ],
  [
    'no big deal',
    'не большое дело',
    'ничего страшного, пустяки',
    'Missing one bus is no big deal.',
    'Пропустить один автобус — не страшно.',
    'разговорные',
  ],
  [
    'my bad',
    'моя вина',
    'это моя ошибка',
    'My bad, I sent the file to the wrong chat.',
    'Моя ошибка, я отправил файл не в тот чат.',
    'разговорные',
  ],
  [
    'fair enough',
    'достаточно честно',
    'ладно, это справедливо',
    'Fair enough, let us try your idea first.',
    'Ладно, это справедливо, давай сначала попробуем твою идею.',
    'разговорные',
  ],
  [
    "I've got your back",
    'я прикрою твою спину',
    'я тебя поддержу и помогу',
    "Do not worry about the meeting, I've got your back.",
    'Не переживай из-за встречи, я тебя прикрою.',
    'разговорные',
  ],
  [
    'take it easy',
    'воспринимай это легко',
    'не напрягайся, успокойся',
    'Take it easy, we still have plenty of time.',
    'Спокойнее, у нас ещё достаточно времени.',
    'разговорные',
  ],
  [
    'hang out',
    'болтаться вместе',
    'проводить время без особого плана',
    'We usually hang out at the park after class.',
    'После занятий мы обычно просто тусуемся в парке.',
    'разговорные',
  ],
  [
    'catch up',
    'догнать',
    'наверстать или обменяться новостями',
    'Let us grab coffee and catch up this weekend.',
    'Давай выпьем кофе и обменяемся новостями на выходных.',
    'разговорные',
  ],
  [
    'show up',
    'появиться',
    'прийти, объявиться',
    'He showed up twenty minutes late.',
    'Он появился с опозданием на двадцать минут.',
    'разговорные',
  ],
  [
    'wrap your head around',
    'обернуть это вокруг головы',
    'до конца понять сложную идею',
    'It took me a while to wrap my head around the new rules.',
    'Мне потребовалось время, чтобы до конца понять новые правила.',
    'разговорные',
  ],
])

export const totalIdiomCount = idioms.length

const idiomsById = new Map(idioms.map((idiom) => [idiom.id, idiom] as const))

export function getIdiomById(id: string): Idiom | undefined {
  return idiomsById.get(id)
}

export function getIdiomsByCategory(category: IdiomFilter): Idiom[] {
  if (category === 'all') return idioms
  return idioms.filter((idiom) => idiom.category === category)
}

function getDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function hashSeed(seed: string): number {
  let hash = 0

  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }

  return hash
}

export function getIdiomOfDay(date = new Date()): Idiom {
  const seed = getDateKey(date)
  const index = hashSeed(seed) % idioms.length

  return idioms[index]
}

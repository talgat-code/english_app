import type { Word } from './words'
import type { Lesson, LessonLevel } from '../types/lesson'

export interface LessonLevelInfo {
  id: LessonLevel
  name: string
  title: string
  description: string
}

export const lessonLevels: LessonLevelInfo[] = [
  {
    id: 'A1',
    name: 'Beginner',
    title: 'A1 Beginner',
    description:
      'Научишься знакомиться, говорить о семье, еде, времени и простых описаниях.',
  },
  {
    id: 'A2',
    name: 'Elementary',
    title: 'A2 Elementary',
    description:
      'Соберешь базовую грамматику для рассказа о дне, прошлом, планах и сравнениях.',
  },
  {
    id: 'B1',
    name: 'Intermediate',
    title: 'B1 Intermediate',
    description:
      'Начнешь говорить о личном опыте, условиях, пассивном залоге и косвенной речи.',
  },
]

function word(
  id: string,
  english: string,
  russian: string,
  transcription: string,
  example: string,
  exampleRu: string,
): Word {
  return { id, english, russian, transcription, example, exampleRu }
}

export const lessons: Lesson[] = [
  {
    id: 'a1-1-greetings',
    level: 'A1',
    order: 1,
    title: 'Знакомство и приветствия',
    description: 'Учимся здороваться, представляться и вежливо начинать разговор.',
    theory: {
      explanation:
        'В английском знакомство чаще строится вокруг коротких фраз: приветствие, имя и простой вопрос о делах. Для формального общения выбирай Hello и Nice to meet you, для друзей подойдут Hi и See you.',
      rules: [
        'Hello и Hi означают приветствие, но Hello звучит нейтральнее и немного формальнее.',
        'I am можно сокращать до I\'m: I am Anna = I\'m Anna.',
        'После My name is называем имя без артикля: My name is Max.',
        'Nice to meet you говорят при первой встрече.',
      ],
      tips: [
        'How are you? часто не требует длинного ответа: Fine, thanks подходит почти всегда.',
        'Сразу добавляй имя собеседника: Hello, Kate. Так фраза звучит живее.',
      ],
    },
    vocabulary: [
      word('les-a1-1-hello', 'Hello', 'Привет / Здравствуйте', 'heh-loh', 'Hello, my name is Anna.', 'Здравствуйте, меня зовут Анна.'),
      word('les-a1-1-hi', 'Hi', 'Привет', 'hai', 'Hi, Tom!', 'Привет, Том!'),
      word('les-a1-1-name', 'Name', 'Имя', 'neim', 'What is your name?', 'Как тебя зовут?'),
      word('les-a1-1-meet', 'Meet', 'Знакомиться / встречать', 'meet', 'Nice to meet you.', 'Приятно познакомиться.'),
      word('les-a1-1-fine', 'Fine', 'Хорошо', 'fain', 'I am fine, thanks.', 'У меня все хорошо, спасибо.'),
      word('les-a1-1-thanks', 'Thanks', 'Спасибо', 'thanks', 'Thanks for your help.', 'Спасибо за помощь.'),
      word('les-a1-1-goodbye', 'Goodbye', 'До свидания', 'good-bai', 'Goodbye, see you soon.', 'До свидания, скоро увидимся.'),
      word('les-a1-1-please', 'Please', 'Пожалуйста', 'pleez', 'Please repeat your name.', 'Пожалуйста, повторите ваше имя.'),
    ],
    examples: [
      { english: 'Hello, I am Dima.', russian: 'Привет, я Дима.' },
      { english: 'My name is Kate.', russian: 'Меня зовут Кейт.' },
      { english: 'Nice to meet you.', russian: 'Приятно познакомиться.' },
      { english: 'How are you?', russian: 'Как дела?' },
      { english: 'I am fine, thanks.', russian: 'У меня все хорошо, спасибо.' },
    ],
    exercises: [
      {
        type: 'fill_blank',
        sentence: 'Hello, my ___ is Anna.',
        answer: 'name',
        hint: 'Слово "имя" по-английски.',
      },
      {
        type: 'translate',
        russian: 'Приятно познакомиться.',
        correctAnswer: 'Nice to meet you.',
        alternativeAnswers: ['Nice to meet you', 'It is nice to meet you.'],
      },
      {
        type: 'choose_correct',
        question: 'Как сказать "До свидания"?',
        options: ['Thanks', 'Goodbye', 'Please', 'Fine'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'a1-2-numbers-time',
    level: 'A1',
    order: 2,
    title: 'Числа и время',
    description: 'Считаем простые числа и называем время в повседневных ситуациях.',
    theory: {
      explanation:
        'Числа нужны для возраста, телефона, цены и времени. Чтобы назвать ровный час, используй It is + число + o\'clock. В разговоре часто говорят коротко: It\'s five.',
      rules: [
        'One, two, three, four, five - базовые числа от 1 до 5.',
        'Для ровного часа добавь o\'clock: six o\'clock.',
        'В вопросе о времени говорят: What time is it?',
        'At используется для времени: at seven, at nine o\'clock.',
      ],
      tips: [
        'Тренируй числа вслух группами: one-two-three, four-five-six.',
        'Если не уверен в minutes, сначала уверенно называй ровные часы.',
      ],
    },
    vocabulary: [
      word('les-a1-2-one', 'One', 'Один', 'wun', 'I have one book.', 'У меня есть одна книга.'),
      word('les-a1-2-two', 'Two', 'Два', 'too', 'Two friends are here.', 'Два друга здесь.'),
      word('les-a1-2-three', 'Three', 'Три', 'three', 'She has three cats.', 'У нее три кошки.'),
      word('les-a1-2-five', 'Five', 'Пять', 'faiv', 'It is five o\'clock.', 'Сейчас пять часов.'),
      word('les-a1-2-seven', 'Seven', 'Семь', 'seh-vuhn', 'Dinner is at seven.', 'Ужин в семь.'),
      word('les-a1-2-time', 'Time', 'Время', 'taim', 'What time is it?', 'Который час?'),
      word('les-a1-2-clock', 'Clock', 'Часы', 'klok', 'The clock is on the wall.', 'Часы на стене.'),
      word('les-a1-2-morning', 'Morning', 'Утро', 'mor-ning', 'Good morning!', 'Доброе утро!'),
    ],
    examples: [
      { english: 'It is five o\'clock.', russian: 'Сейчас пять часов.' },
      { english: 'What time is it?', russian: 'Который час?' },
      { english: 'I have two pens.', russian: 'У меня две ручки.' },
      { english: 'Breakfast is at seven.', russian: 'Завтрак в семь.' },
      { english: 'Good morning!', russian: 'Доброе утро!' },
    ],
    exercises: [
      {
        type: 'fill_blank',
        sentence: 'It is five ___.',
        answer: 'o\'clock',
        hint: 'Так говорят о ровном часе.',
      },
      {
        type: 'translate',
        russian: 'Который час?',
        correctAnswer: 'What time is it?',
        alternativeAnswers: ['What time is it'],
      },
      {
        type: 'choose_correct',
        question: 'Как переводится "seven"?',
        options: ['Три', 'Пять', 'Семь', 'Десять'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'a1-3-colors-description',
    level: 'A1',
    order: 3,
    title: 'Цвета и описание',
    description: 'Описываем предметы через цвет, размер и простые прилагательные.',
    theory: {
      explanation:
        'В английском прилагательное обычно стоит перед существительным: a red bag, a big house. Для простого описания используй It is или This is.',
      rules: [
        'Цвет ставится перед предметом: a blue pen.',
        'A используется с одним исчисляемым предметом: a small car.',
        'It is описывает предмет: It is green.',
        'This is указывает на предмет рядом: This is a white cup.',
      ],
      tips: [
        'Сначала называй цвет, затем предмет: red apple, black phone.',
        'Не добавляй окончание множественного числа к прилагательному: blue cars, не blues cars.',
      ],
    },
    vocabulary: [
      word('les-a1-3-red', 'Red', 'Красный', 'red', 'This is a red apple.', 'Это красное яблоко.'),
      word('les-a1-3-blue', 'Blue', 'Синий / голубой', 'bloo', 'I have a blue pen.', 'У меня синяя ручка.'),
      word('les-a1-3-green', 'Green', 'Зеленый', 'green', 'The tree is green.', 'Дерево зеленое.'),
      word('les-a1-3-white', 'White', 'Белый', 'wait', 'She has a white bag.', 'У нее белая сумка.'),
      word('les-a1-3-black', 'Black', 'Черный', 'blak', 'My phone is black.', 'Мой телефон черный.'),
      word('les-a1-3-big', 'Big', 'Большой', 'big', 'It is a big room.', 'Это большая комната.'),
      word('les-a1-3-small', 'Small', 'Маленький', 'small', 'This is a small cup.', 'Это маленькая чашка.'),
      word('les-a1-3-beautiful', 'Beautiful', 'Красивый', 'byoo-ti-fuhl', 'It is a beautiful city.', 'Это красивый город.'),
    ],
    examples: [
      { english: 'This is a red bag.', russian: 'Это красная сумка.' },
      { english: 'The car is black.', russian: 'Машина черная.' },
      { english: 'I have a small room.', russian: 'У меня маленькая комната.' },
      { english: 'It is a beautiful flower.', russian: 'Это красивый цветок.' },
      { english: 'My pen is blue.', russian: 'Моя ручка синяя.' },
    ],
    exercises: [
      {
        type: 'fill_blank',
        sentence: 'This is a ___ apple.',
        answer: 'red',
        hint: 'Цвет яблока в примере.',
      },
      {
        type: 'translate',
        russian: 'Моя ручка синяя.',
        correctAnswer: 'My pen is blue.',
        alternativeAnswers: ['My pen is blue'],
      },
      {
        type: 'choose_correct',
        question: 'Где правильный порядок слов?',
        options: ['A bag red', 'A red bag', 'Red a bag', 'Bag a red'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'a1-4-family',
    level: 'A1',
    order: 4,
    title: 'Семья',
    description: 'Говорим о членах семьи и простых отношениях.',
    theory: {
      explanation:
        'Для семьи часто нужны притяжательные слова my, your, his, her. Чтобы сказать, кто это, используй This is my mother или He is my brother.',
      rules: [
        'My означает "мой / моя / мое": my father, my sister.',
        'His используют для мужчины, her - для женщины.',
        'This is подходит, когда представляешь человека.',
        'He is - про мужчину, she is - про женщину.',
      ],
      tips: [
        'В английском my не меняется по роду: my mother и my father.',
        'Family может означать всю семью как одну группу.',
      ],
    },
    vocabulary: [
      word('les-a1-4-family', 'Family', 'Семья', 'fam-uh-lee', 'My family is small.', 'Моя семья маленькая.'),
      word('les-a1-4-mother', 'Mother', 'Мама', 'muh-thur', 'This is my mother.', 'Это моя мама.'),
      word('les-a1-4-father', 'Father', 'Папа', 'fah-thur', 'My father is kind.', 'Мой папа добрый.'),
      word('les-a1-4-sister', 'Sister', 'Сестра', 'sis-tur', 'Her sister is at school.', 'Ее сестра в школе.'),
      word('les-a1-4-brother', 'Brother', 'Брат', 'bruh-thur', 'His brother is tall.', 'Его брат высокий.'),
      word('les-a1-4-child', 'Child', 'Ребенок', 'chaild', 'The child is happy.', 'Ребенок счастлив.'),
      word('les-a1-4-parents', 'Parents', 'Родители', 'pair-ents', 'My parents live here.', 'Мои родители живут здесь.'),
      word('les-a1-4-home', 'Home', 'Дом', 'hohm', 'We are at home.', 'Мы дома.'),
    ],
    examples: [
      { english: 'This is my mother.', russian: 'Это моя мама.' },
      { english: 'He is my brother.', russian: 'Он мой брат.' },
      { english: 'Her sister is kind.', russian: 'Ее сестра добрая.' },
      { english: 'My family is big.', russian: 'Моя семья большая.' },
      { english: 'My parents are at home.', russian: 'Мои родители дома.' },
    ],
    exercises: [
      {
        type: 'fill_blank',
        sentence: 'This is my ___.',
        answer: 'mother',
        hint: 'Мама по-английски.',
      },
      {
        type: 'translate',
        russian: 'Он мой брат.',
        correctAnswer: 'He is my brother.',
        alternativeAnswers: ['He is my brother', 'He\'s my brother.'],
      },
      {
        type: 'choose_correct',
        question: 'Как сказать "моя семья"?',
        options: ['Me family', 'My family', 'Mine family', 'I family'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'a1-5-food-drinks',
    level: 'A1',
    order: 5,
    title: 'Еда и напитки',
    description: 'Заказываем простую еду и говорим, что любим.',
    theory: {
      explanation:
        'Чтобы сказать, что тебе нравится еда или напиток, используй I like. Для просьбы подойдет Can I have...? - это вежливый способ заказать или попросить.',
      rules: [
        'I like + еда/напиток: I like tea.',
        'I do not like означает "я не люблю".',
        'Can I have...? значит "можно мне...?"',
        'A/an нужны для одного предмета: an apple, a sandwich.',
      ],
      tips: [
        'С едой в кафе Can I have...? звучит естественнее, чем I want.',
        'An ставится перед словом, которое начинается с гласного звука: an apple.',
      ],
    },
    vocabulary: [
      word('les-a1-5-water', 'Water', 'Вода', 'waw-ter', 'Can I have water?', 'Можно мне воды?'),
      word('les-a1-5-tea', 'Tea', 'Чай', 'tee', 'I like tea with lemon.', 'Я люблю чай с лимоном.'),
      word('les-a1-5-coffee', 'Coffee', 'Кофе', 'kaw-fee', 'She drinks coffee.', 'Она пьет кофе.'),
      word('les-a1-5-bread', 'Bread', 'Хлеб', 'bred', 'The bread is fresh.', 'Хлеб свежий.'),
      word('les-a1-5-apple', 'Apple', 'Яблоко', 'ap-uhl', 'This is an apple.', 'Это яблоко.'),
      word('les-a1-5-soup', 'Soup', 'Суп', 'soop', 'The soup is hot.', 'Суп горячий.'),
      word('les-a1-5-sandwich', 'Sandwich', 'Сэндвич', 'sand-wich', 'I have a sandwich.', 'У меня есть сэндвич.'),
      word('les-a1-5-juice', 'Juice', 'Сок', 'joos', 'Orange juice is sweet.', 'Апельсиновый сок сладкий.'),
    ],
    examples: [
      { english: 'I like coffee.', russian: 'Я люблю кофе.' },
      { english: 'Can I have a sandwich?', russian: 'Можно мне сэндвич?' },
      { english: 'This is an apple.', russian: 'Это яблоко.' },
      { english: 'The soup is hot.', russian: 'Суп горячий.' },
      { english: 'I do not like tea.', russian: 'Я не люблю чай.' },
    ],
    exercises: [
      {
        type: 'fill_blank',
        sentence: 'Can I ___ water?',
        answer: 'have',
        hint: 'Вежливая просьба: Can I have...?',
      },
      {
        type: 'translate',
        russian: 'Я люблю кофе.',
        correctAnswer: 'I like coffee.',
        alternativeAnswers: ['I like coffee'],
      },
      {
        type: 'choose_correct',
        question: 'Что правильно перед apple?',
        options: ['a apple', 'an apple', 'the an apple', 'one an apple'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'a2-1-present-simple',
    level: 'A2',
    order: 1,
    title: 'Мой день (Present Simple)',
    description: 'Рассказываем о привычках, расписании и обычном дне.',
    theory: {
      explanation:
        'Present Simple описывает то, что происходит регулярно: привычки, расписание, факты. С I/you/we/they глагол идет в базовой форме, а с he/she/it чаще добавляется -s.',
      rules: [
        'I work, you study, we live - базовая форма глагола.',
        'He works, she studies, it starts - для he/she/it добавляется -s или -es.',
        'Для отрицания с I/you/we/they используй do not, с he/she/it - does not.',
        'Слова usually, often, every day помогают показать регулярность.',
      ],
      tips: [
        'Проверяй подлежащее: если he/she/it, почти всегда нужен глагол с -s.',
        'Every day обычно ставят в конец предложения: I study English every day.',
      ],
    },
    vocabulary: [
      word('les-a2-1-wake', 'Wake up', 'Просыпаться', 'weik up', 'I wake up at seven.', 'Я просыпаюсь в семь.'),
      word('les-a2-1-work', 'Work', 'Работать', 'werk', 'She works in an office.', 'Она работает в офисе.'),
      word('les-a2-1-study', 'Study', 'Учиться / изучать', 'stuh-dee', 'We study English every day.', 'Мы учим английский каждый день.'),
      word('les-a2-1-usually', 'Usually', 'Обычно', 'yoo-zhoo-uh-lee', 'I usually drink tea.', 'Я обычно пью чай.'),
      word('les-a2-1-often', 'Often', 'Часто', 'aw-fuhn', 'He often reads books.', 'Он часто читает книги.'),
      word('les-a2-1-always', 'Always', 'Всегда', 'awl-weiz', 'She always helps me.', 'Она всегда помогает мне.'),
      word('les-a2-1-breakfast', 'Breakfast', 'Завтрак', 'brek-fuhst', 'Breakfast starts at eight.', 'Завтрак начинается в восемь.'),
      word('les-a2-1-evening', 'Evening', 'Вечер', 'eev-ning', 'I relax in the evening.', 'Я отдыхаю вечером.'),
    ],
    examples: [
      { english: 'I wake up at seven every day.', russian: 'Я просыпаюсь в семь каждый день.' },
      { english: 'She works in a bank.', russian: 'Она работает в банке.' },
      { english: 'We do not study on Sunday.', russian: 'Мы не учимся в воскресенье.' },
      { english: 'He often reads in the evening.', russian: 'Он часто читает вечером.' },
      { english: 'Do you like your job?', russian: 'Тебе нравится твоя работа?' },
    ],
    exercises: [
      {
        type: 'fill_blank',
        sentence: 'She ___ in an office.',
        answer: 'works',
        hint: 'С she глаголу work нужна буква s.',
      },
      {
        type: 'translate',
        russian: 'Я учу английский каждый день.',
        correctAnswer: 'I study English every day.',
        alternativeAnswers: ['I learn English every day.', 'I study English every day'],
      },
      {
        type: 'choose_correct',
        question: 'Выбери правильное предложение.',
        options: ['He work every day.', 'He works every day.', 'He working every day.', 'He does works every day.'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'a2-2-present-continuous',
    level: 'A2',
    order: 2,
    title: 'Что я делаю сейчас (Present Continuous)',
    description: 'Говорим о действиях, которые происходят прямо сейчас.',
    theory: {
      explanation:
        'Present Continuous показывает действие в процессе: I am reading, she is cooking. Он строится через am/is/are и глагол с окончанием -ing.',
      rules: [
        'I am + V-ing: I am listening.',
        'He/she/it is + V-ing: She is cooking.',
        'You/we/they are + V-ing: They are playing.',
        'Now, right now, at the moment часто подсказывают Present Continuous.',
      ],
      tips: [
        'Не забывай am/is/are: I reading - ошибка, I am reading - верно.',
        'У коротких глаголов иногда удваивается согласная: run -> running.',
      ],
    },
    vocabulary: [
      word('les-a2-2-now', 'Now', 'Сейчас', 'nau', 'I am busy now.', 'Я сейчас занят.'),
      word('les-a2-2-listen', 'Listen', 'Слушать', 'lis-uhn', 'I am listening to music.', 'Я слушаю музыку.'),
      word('les-a2-2-cook', 'Cook', 'Готовить', 'kook', 'She is cooking dinner.', 'Она готовит ужин.'),
      word('les-a2-2-read', 'Read', 'Читать', 'reed', 'He is reading a book.', 'Он читает книгу.'),
      word('les-a2-2-watch', 'Watch', 'Смотреть', 'woch', 'We are watching a film.', 'Мы смотрим фильм.'),
      word('les-a2-2-wait', 'Wait', 'Ждать', 'weit', 'They are waiting outside.', 'Они ждут снаружи.'),
      word('les-a2-2-call', 'Call', 'Звонить', 'kawl', 'I am calling my friend.', 'Я звоню другу.'),
      word('les-a2-2-moment', 'Moment', 'Момент', 'moh-muhnt', 'At the moment, I am working.', 'В данный момент я работаю.'),
    ],
    examples: [
      { english: 'I am reading now.', russian: 'Я сейчас читаю.' },
      { english: 'She is cooking dinner.', russian: 'Она готовит ужин.' },
      { english: 'They are watching TV.', russian: 'Они смотрят телевизор.' },
      { english: 'We are not waiting.', russian: 'Мы не ждем.' },
      { english: 'Are you listening?', russian: 'Ты слушаешь?' },
    ],
    exercises: [
      {
        type: 'fill_blank',
        sentence: 'I am ___ to music now.',
        answer: 'listening',
        hint: 'После am нужен глагол с -ing.',
      },
      {
        type: 'translate',
        russian: 'Она готовит ужин.',
        correctAnswer: 'She is cooking dinner.',
        alternativeAnswers: ['She is cooking dinner', 'She\'s cooking dinner.'],
      },
      {
        type: 'choose_correct',
        question: 'Какая форма правильная для "они смотрят сейчас"?',
        options: ['They watch now.', 'They are watching now.', 'They is watching now.', 'They watching now.'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'a2-3-past-simple',
    level: 'A2',
    order: 3,
    title: 'Мой вчерашний день (Past Simple)',
    description: 'Рассказываем о событиях, которые уже закончились.',
    theory: {
      explanation:
        'Past Simple нужен для прошлого: yesterday, last week, two days ago. У правильных глаголов добавляется -ed, а неправильные формы нужно запоминать отдельно.',
      rules: [
        'Правильные глаголы получают -ed: work -> worked, play -> played.',
        'Неправильные глаголы меняют форму: go -> went, have -> had.',
        'Отрицание строится через did not + базовый глагол: I did not go.',
        'В вопросе используй Did + подлежащее + базовый глагол?',
      ],
      tips: [
        'После did глагол возвращается в базовую форму: Did you went - ошибка.',
        'Yesterday почти всегда сигнализирует Past Simple.',
      ],
    },
    vocabulary: [
      word('les-a2-3-yesterday', 'Yesterday', 'Вчера', 'yes-ter-dei', 'I called you yesterday.', 'Я звонил тебе вчера.'),
      word('les-a2-3-went', 'Went', 'Пошел / поехал', 'went', 'We went to the park.', 'Мы ходили в парк.'),
      word('les-a2-3-had', 'Had', 'Имел / ел / был', 'had', 'I had breakfast at home.', 'Я завтракал дома.'),
      word('les-a2-3-saw', 'Saw', 'Видел', 'saw', 'She saw a good film.', 'Она посмотрела хороший фильм.'),
      word('les-a2-3-called', 'Called', 'Позвонил', 'kawld', 'He called me at six.', 'Он позвонил мне в шесть.'),
      word('les-a2-3-played', 'Played', 'Играл', 'pleid', 'They played football.', 'Они играли в футбол.'),
      word('les-a2-3-last', 'Last', 'Прошлый', 'last', 'Last week was busy.', 'Прошлая неделя была занятой.'),
      word('les-a2-3-ago', 'Ago', 'Назад', 'uh-goh', 'I moved here two years ago.', 'Я переехал сюда два года назад.'),
    ],
    examples: [
      { english: 'I worked yesterday.', russian: 'Я работал вчера.' },
      { english: 'We went to the park.', russian: 'Мы ходили в парк.' },
      { english: 'She did not call me.', russian: 'Она не звонила мне.' },
      { english: 'Did you watch the film?', russian: 'Ты смотрел фильм?' },
      { english: 'He had breakfast at home.', russian: 'Он завтракал дома.' },
    ],
    exercises: [
      {
        type: 'fill_blank',
        sentence: 'We ___ to the park yesterday.',
        answer: 'went',
        hint: 'Прошлая форма глагола go.',
      },
      {
        type: 'translate',
        russian: 'Я работал вчера.',
        correctAnswer: 'I worked yesterday.',
        alternativeAnswers: ['I worked yesterday'],
      },
      {
        type: 'choose_correct',
        question: 'Что правильно после did not?',
        options: ['did not went', 'did not go', 'did not goes', 'did not going'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'a2-4-going-to',
    level: 'A2',
    order: 4,
    title: 'Планы (Future with going to)',
    description: 'Говорим о намерениях и планах на ближайшее будущее.',
    theory: {
      explanation:
        'Going to используется, когда у тебя уже есть план или намерение. Схема простая: am/is/are + going to + базовый глагол.',
      rules: [
        'I am going to study tonight.',
        'He/she/it is going to travel.',
        'You/we/they are going to meet later.',
        'После going to глагол идет без окончания: going to visit, going to buy.',
      ],
      tips: [
        'Going to часто сокращается в речи до gonna, но в учебных ответах лучше писать going to.',
        'Tomorrow и next week помогают показать будущее.',
      ],
    },
    vocabulary: [
      word('les-a2-4-plan', 'Plan', 'План', 'plan', 'I have a plan.', 'У меня есть план.'),
      word('les-a2-4-tomorrow', 'Tomorrow', 'Завтра', 'tuh-mor-oh', 'I am going to call you tomorrow.', 'Я собираюсь позвонить тебе завтра.'),
      word('les-a2-4-visit', 'Visit', 'Посещать / навещать', 'viz-it', 'We are going to visit grandma.', 'Мы собираемся навестить бабушку.'),
      word('les-a2-4-buy', 'Buy', 'Покупать', 'bai', 'She is going to buy a ticket.', 'Она собирается купить билет.'),
      word('les-a2-4-travel', 'Travel', 'Путешествовать', 'trav-uhl', 'They are going to travel in July.', 'Они собираются путешествовать в июле.'),
      word('les-a2-4-tonight', 'Tonight', 'Сегодня вечером', 'tuh-nait', 'I am going to study tonight.', 'Я собираюсь учиться сегодня вечером.'),
      word('les-a2-4-next', 'Next', 'Следующий', 'nekst', 'Next week will be busy.', 'Следующая неделя будет занятой.'),
      word('les-a2-4-meet', 'Meet', 'Встречаться', 'meet', 'We are going to meet at six.', 'Мы собираемся встретиться в шесть.'),
    ],
    examples: [
      { english: 'I am going to study tonight.', russian: 'Я собираюсь учиться сегодня вечером.' },
      { english: 'She is going to buy a car.', russian: 'Она собирается купить машину.' },
      { english: 'We are going to meet tomorrow.', russian: 'Мы собираемся встретиться завтра.' },
      { english: 'They are not going to travel.', russian: 'Они не собираются путешествовать.' },
      { english: 'Are you going to call him?', russian: 'Ты собираешься позвонить ему?' },
    ],
    exercises: [
      {
        type: 'fill_blank',
        sentence: 'I am going to ___ tonight.',
        answer: 'study',
        hint: 'После going to нужен базовый глагол.',
      },
      {
        type: 'translate',
        russian: 'Мы собираемся встретиться завтра.',
        correctAnswer: 'We are going to meet tomorrow.',
        alternativeAnswers: ['We are going to meet tomorrow', 'We\'re going to meet tomorrow.'],
      },
      {
        type: 'choose_correct',
        question: 'Выбери правильную форму.',
        options: ['She going to buy a ticket.', 'She is going to buy a ticket.', 'She is going to buys a ticket.', 'She are going to buy a ticket.'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'a2-5-comparatives',
    level: 'A2',
    order: 5,
    title: 'Сравнение предметов (Comparatives)',
    description: 'Сравниваем людей, места и вещи: больше, лучше, интереснее.',
    theory: {
      explanation:
        'Comparatives помогают сравнивать два предмета. К коротким прилагательным добавляется -er, а с длинными используется more. После сравнения часто стоит than.',
      rules: [
        'Small -> smaller, tall -> taller, fast -> faster.',
        'Для длинных слов используй more: more interesting, more expensive.',
        'Good имеет особую форму better.',
        'После сравнительной формы часто идет than: bigger than, better than.',
      ],
      tips: [
        'Не смешивай more и -er: more bigger - ошибка.',
        'Than переводится как "чем" и соединяет две части сравнения.',
      ],
    },
    vocabulary: [
      word('les-a2-5-bigger', 'Bigger', 'Больше', 'big-er', 'This room is bigger.', 'Эта комната больше.'),
      word('les-a2-5-smaller', 'Smaller', 'Меньше', 'small-er', 'My bag is smaller.', 'Моя сумка меньше.'),
      word('les-a2-5-better', 'Better', 'Лучше', 'bet-er', 'This book is better.', 'Эта книга лучше.'),
      word('les-a2-5-worse', 'Worse', 'Хуже', 'wers', 'The weather is worse today.', 'Погода сегодня хуже.'),
      word('les-a2-5-cheaper', 'Cheaper', 'Дешевле', 'cheep-er', 'This phone is cheaper.', 'Этот телефон дешевле.'),
      word('les-a2-5-expensive', 'Expensive', 'Дорогой', 'ik-spen-siv', 'That hotel is expensive.', 'Тот отель дорогой.'),
      word('les-a2-5-interesting', 'Interesting', 'Интересный', 'in-truh-sting', 'This lesson is interesting.', 'Этот урок интересный.'),
      word('les-a2-5-than', 'Than', 'Чем', 'than', 'Tea is cheaper than coffee.', 'Чай дешевле, чем кофе.'),
    ],
    examples: [
      { english: 'This room is bigger than my room.', russian: 'Эта комната больше, чем моя.' },
      { english: 'Tea is cheaper than coffee.', russian: 'Чай дешевле, чем кофе.' },
      { english: 'This film is more interesting.', russian: 'Этот фильм интереснее.' },
      { english: 'Your answer is better.', russian: 'Твой ответ лучше.' },
      { english: 'The red bag is smaller than the black bag.', russian: 'Красная сумка меньше, чем черная.' },
    ],
    exercises: [
      {
        type: 'fill_blank',
        sentence: 'This room is bigger ___ my room.',
        answer: 'than',
        hint: 'Слово "чем" в сравнении.',
      },
      {
        type: 'translate',
        russian: 'Этот фильм интереснее.',
        correctAnswer: 'This film is more interesting.',
        alternativeAnswers: ['This movie is more interesting.', 'This film is more interesting'],
      },
      {
        type: 'choose_correct',
        question: 'Какая форма правильная для good?',
        options: ['Gooder', 'More good', 'Better', 'Bestest'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'b1-1-present-perfect',
    level: 'B1',
    order: 1,
    title: 'Опыт и достижения (Present Perfect)',
    description: 'Говорим о жизненном опыте и результате, важном сейчас.',
    theory: {
      explanation:
        'Present Perfect связывает прошлое с настоящим. Он строится через have/has + третью форму глагола: I have visited, she has finished. Часто используется с ever, never, already, yet.',
      rules: [
        'I/you/we/they have + V3: I have visited London.',
        'He/she/it has + V3: She has finished the project.',
        'Ever используют в вопросах об опыте: Have you ever tried sushi?',
        'Never означает "никогда": I have never been there.',
      ],
      tips: [
        'Если есть точное время в прошлом, чаще нужен Past Simple: yesterday, last year.',
        'Present Perfect важен, когда результат чувствуется сейчас.',
      ],
    },
    vocabulary: [
      word('les-b1-1-ever', 'Ever', 'Когда-либо', 'ev-er', 'Have you ever been abroad?', 'Ты когда-либо был за границей?'),
      word('les-b1-1-never', 'Never', 'Никогда', 'nev-er', 'I have never tried sushi.', 'Я никогда не пробовал суши.'),
      word('les-b1-1-already', 'Already', 'Уже', 'awl-red-ee', 'She has already finished.', 'Она уже закончила.'),
      word('les-b1-1-yet', 'Yet', 'Еще / уже', 'yet', 'Have you finished yet?', 'Ты уже закончил?'),
      word('les-b1-1-experience', 'Experience', 'Опыт', 'ik-speer-ee-uhns', 'This experience changed me.', 'Этот опыт изменил меня.'),
      word('les-b1-1-achieve', 'Achieve', 'Достигать', 'uh-cheev', 'They have achieved a lot.', 'Они многого достигли.'),
      word('les-b1-1-visited', 'Visited', 'Посетил', 'viz-it-id', 'I have visited Paris.', 'Я посетил Париж.'),
      word('les-b1-1-finished', 'Finished', 'Закончил', 'fin-isht', 'We have finished the lesson.', 'Мы закончили урок.'),
    ],
    examples: [
      { english: 'I have visited London.', russian: 'Я был в Лондоне.' },
      { english: 'She has already finished her work.', russian: 'Она уже закончила свою работу.' },
      { english: 'Have you ever tried sushi?', russian: 'Ты когда-нибудь пробовал суши?' },
      { english: 'We have never been there.', russian: 'Мы никогда там не были.' },
      { english: 'He has not called yet.', russian: 'Он еще не звонил.' },
    ],
    exercises: [
      {
        type: 'fill_blank',
        sentence: 'She has ___ finished her work.',
        answer: 'already',
        hint: 'Слово "уже" в Present Perfect.',
      },
      {
        type: 'translate',
        russian: 'Я никогда не был там.',
        correctAnswer: 'I have never been there.',
        alternativeAnswers: ['I have never been there', 'I\'ve never been there.'],
      },
      {
        type: 'choose_correct',
        question: 'Выбери правильную форму Present Perfect.',
        options: ['She has finish.', 'She have finished.', 'She has finished.', 'She finished yesterday.'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'b1-2-second-conditional',
    level: 'B1',
    order: 2,
    title: 'Если бы... (Second Conditional)',
    description: 'Строим воображаемые ситуации и говорим, что было бы.',
    theory: {
      explanation:
        'Second Conditional описывает нереальные или маловероятные ситуации в настоящем или будущем. Схема: If + Past Simple, would + базовый глагол.',
      rules: [
        'If I had more time, I would travel.',
        'После if используется Past Simple, даже если говорим о настоящем.',
        'Во второй части ставим would + базовый глагол.',
        'Для be часто используют were со всеми лицами: If I were you...',
      ],
      tips: [
        'Would не меняется по лицам: he would, they would.',
        'If I were you - устойчивый совет: "на твоем месте".',
      ],
    },
    vocabulary: [
      word('les-b1-2-if', 'If', 'Если', 'if', 'If I had time, I would read.', 'Если бы у меня было время, я бы читал.'),
      word('les-b1-2-would', 'Would', 'Бы', 'wood', 'I would help you.', 'Я бы помог тебе.'),
      word('les-b1-2-could', 'Could', 'Мог бы', 'kood', 'She could learn faster.', 'Она могла бы учиться быстрее.'),
      word('les-b1-2-time', 'Time', 'Время', 'taim', 'If we had time, we would stay.', 'Если бы у нас было время, мы бы остались.'),
      word('les-b1-2-rich', 'Rich', 'Богатый', 'rich', 'If he were rich, he would travel.', 'Если бы он был богат, он бы путешествовал.'),
      word('les-b1-2-advice', 'Advice', 'Совет', 'ad-vais', 'My advice is simple.', 'Мой совет простой.'),
      word('les-b1-2-dream', 'Dream', 'Мечта', 'dreem', 'It is my dream.', 'Это моя мечта.'),
      word('les-b1-2-chance', 'Chance', 'Шанс', 'chans', 'I would take this chance.', 'Я бы использовал этот шанс.'),
    ],
    examples: [
      { english: 'If I had more time, I would study more.', russian: 'Если бы у меня было больше времени, я бы больше учился.' },
      { english: 'If she lived here, we would meet often.', russian: 'Если бы она жила здесь, мы бы часто встречались.' },
      { english: 'I would buy a house if I were rich.', russian: 'Я бы купил дом, если бы был богат.' },
      { english: 'If I were you, I would call him.', russian: 'На твоем месте я бы позвонил ему.' },
      { english: 'They would travel if they had money.', russian: 'Они бы путешествовали, если бы у них были деньги.' },
    ],
    exercises: [
      {
        type: 'fill_blank',
        sentence: 'If I had more time, I ___ study more.',
        answer: 'would',
        hint: 'Во второй части Second Conditional нужен would.',
      },
      {
        type: 'translate',
        russian: 'На твоем месте я бы позвонил ему.',
        correctAnswer: 'If I were you, I would call him.',
        alternativeAnswers: ['If I were you I would call him', 'If I were you, I\'d call him.'],
      },
      {
        type: 'choose_correct',
        question: 'Выбери правильную структуру.',
        options: ['If I have time, I would travel.', 'If I had time, I would travel.', 'If I had time, I will travel.', 'If I would have time, I travel.'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'b1-3-passive-voice',
    level: 'B1',
    order: 3,
    title: 'Пассивный залог (Passive Voice)',
    description: 'Говорим о действии, когда важнее объект, а не исполнитель.',
    theory: {
      explanation:
        'Passive Voice нужен, когда важно, что произошло с объектом: The letter was sent. Он строится через be в нужном времени и третью форму глагола.',
      rules: [
        'Present Simple Passive: am/is/are + V3 - The room is cleaned.',
        'Past Simple Passive: was/were + V3 - The letter was sent.',
        'Исполнителя можно добавить через by: written by Mark.',
        'Пассив часто используют, когда исполнитель неизвестен или не важен.',
      ],
      tips: [
        'Сначала найди объект действия: что построили, отправили, сделали?',
        'Не забывай форму be: The book written - ошибка, The book was written - верно.',
      ],
    },
    vocabulary: [
      word('les-b1-3-built', 'Built', 'Построен', 'bilt', 'The house was built in 2010.', 'Дом был построен в 2010 году.'),
      word('les-b1-3-written', 'Written', 'Написан', 'rit-uhn', 'The book was written by her.', 'Книга была написана ею.'),
      word('les-b1-3-sent', 'Sent', 'Отправлен', 'sent', 'The email was sent yesterday.', 'Письмо было отправлено вчера.'),
      word('les-b1-3-made', 'Made', 'Сделан', 'meid', 'This table is made of wood.', 'Этот стол сделан из дерева.'),
      word('les-b1-3-known', 'Known', 'Известный', 'nohn', 'This city is known for music.', 'Этот город известен музыкой.'),
      word('les-b1-3-produced', 'Produced', 'Произведен', 'pruh-doost', 'Coffee is produced here.', 'Кофе производится здесь.'),
      word('les-b1-3-by', 'By', 'Кем / чем', 'bai', 'The song was written by John.', 'Песня была написана Джоном.'),
      word('les-b1-3-object', 'Object', 'Объект / предмет', 'ob-jekt', 'The object is important.', 'Объект важен.'),
    ],
    examples: [
      { english: 'The house was built in 2010.', russian: 'Дом был построен в 2010 году.' },
      { english: 'English is spoken in many countries.', russian: 'На английском говорят во многих странах.' },
      { english: 'The email was sent yesterday.', russian: 'Письмо было отправлено вчера.' },
      { english: 'This table is made of wood.', russian: 'Этот стол сделан из дерева.' },
      { english: 'The song was written by John.', russian: 'Песня была написана Джоном.' },
    ],
    exercises: [
      {
        type: 'fill_blank',
        sentence: 'The email was ___ yesterday.',
        answer: 'sent',
        hint: 'Третья форма глагола send.',
      },
      {
        type: 'translate',
        russian: 'Дом был построен в 2010 году.',
        correctAnswer: 'The house was built in 2010.',
        alternativeAnswers: ['The house was built in 2010', 'The house was built in twenty ten.'],
      },
      {
        type: 'choose_correct',
        question: 'Выбери Passive Voice.',
        options: ['They built the house.', 'The house was built.', 'The house built.', 'They were building.'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'b1-4-reported-speech',
    level: 'B1',
    order: 4,
    title: 'Косвенная речь (Reported Speech)',
    description: 'Передаем слова другого человека без прямой цитаты.',
    theory: {
      explanation:
        'Reported Speech помогает пересказать, что кто-то сказал. После said или told время часто сдвигается назад: am -> was, do -> did, will -> would.',
      rules: [
        'He said, "I am tired" -> He said that he was tired.',
        'Say обычно без объекта, tell - с объектом: told me, told her.',
        'Present Simple часто становится Past Simple.',
        'Will часто становится would.',
      ],
      tips: [
        'Следи за местоимениями: I может стать he или she.',
        'That часто можно опустить, но на этапе обучения лучше оставлять.',
      ],
    },
    vocabulary: [
      word('les-b1-4-said', 'Said', 'Сказал', 'sed', 'He said that he was tired.', 'Он сказал, что устал.'),
      word('les-b1-4-told', 'Told', 'Сказал кому-то', 'tohld', 'She told me the truth.', 'Она сказала мне правду.'),
      word('les-b1-4-that', 'That', 'Что', 'that', 'I know that you are busy.', 'Я знаю, что ты занят.'),
      word('les-b1-4-truth', 'Truth', 'Правда', 'trooth', 'Tell me the truth.', 'Скажи мне правду.'),
      word('les-b1-4-message', 'Message', 'Сообщение', 'mes-ij', 'He left a message.', 'Он оставил сообщение.'),
      word('les-b1-4-asked', 'Asked', 'Спросил', 'askt', 'She asked where I lived.', 'Она спросила, где я живу.'),
      word('les-b1-4-would', 'Would', 'Будет / бы в косвенной речи', 'wood', 'He said he would call.', 'Он сказал, что позвонит.'),
      word('les-b1-4-was', 'Was', 'Был', 'woz', 'She said she was ready.', 'Она сказала, что готова.'),
    ],
    examples: [
      { english: 'He said that he was tired.', russian: 'Он сказал, что устал.' },
      { english: 'She told me that she liked English.', russian: 'Она сказала мне, что ей нравится английский.' },
      { english: 'They said they would call later.', russian: 'Они сказали, что позвонят позже.' },
      { english: 'I told him that I was busy.', russian: 'Я сказал ему, что занят.' },
      { english: 'She asked where I lived.', russian: 'Она спросила, где я живу.' },
    ],
    exercises: [
      {
        type: 'fill_blank',
        sentence: 'He said that he ___ tired.',
        answer: 'was',
        hint: 'Am в косвенной речи часто становится was.',
      },
      {
        type: 'translate',
        russian: 'Она сказала мне, что ей нравится английский.',
        correctAnswer: 'She told me that she liked English.',
        alternativeAnswers: ['She told me she liked English.', 'She told me that she liked English'],
      },
      {
        type: 'choose_correct',
        question: 'Что правильно с объектом "me"?',
        options: ['She said me the truth.', 'She told me the truth.', 'She told the truth me.', 'She said to me truth.'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'b1-5-modal-verbs',
    level: 'B1',
    order: 5,
    title: 'Модальные глаголы (Modal Verbs)',
    description: 'Говорим о возможности, необходимости, советах и запретах.',
    theory: {
      explanation:
        'Модальные глаголы меняют смысл основного глагола: can - могу, must - должен, should - стоит. После модального глагола основной глагол идет в базовой форме без to.',
      rules: [
        'Can выражает возможность или умение: I can swim.',
        'Must выражает сильную необходимость: You must stop.',
        'Should дает совет: You should rest.',
        'После can/must/should глагол без to и без -s: she can speak.',
      ],
      tips: [
        'Не добавляй -s к модальному глаголу: she cans - ошибка.',
        'Should звучит мягче, чем must, поэтому подходит для советов.',
      ],
    },
    vocabulary: [
      word('les-b1-5-can', 'Can', 'Мочь / уметь', 'kan', 'I can speak English.', 'Я могу говорить по-английски.'),
      word('les-b1-5-must', 'Must', 'Должен', 'must', 'You must wear a seat belt.', 'Ты должен пристегнуть ремень.'),
      word('les-b1-5-should', 'Should', 'Следует', 'shood', 'You should drink water.', 'Тебе стоит пить воду.'),
      word('les-b1-5-might', 'Might', 'Возможно', 'mait', 'It might rain today.', 'Сегодня может пойти дождь.'),
      word('les-b1-5-allowed', 'Allowed', 'Разрешено', 'uh-loud', 'You are allowed to enter.', 'Тебе разрешено войти.'),
      word('les-b1-5-necessary', 'Necessary', 'Необходимый', 'nes-uh-ser-ee', 'It is necessary to practice.', 'Необходимо практиковаться.'),
      word('les-b1-5-advice', 'Advice', 'Совет', 'ad-vais', 'This is good advice.', 'Это хороший совет.'),
      word('les-b1-5-possible', 'Possible', 'Возможный', 'pos-uh-buhl', 'It is possible to learn fast.', 'Возможно учиться быстро.'),
    ],
    examples: [
      { english: 'I can help you.', russian: 'Я могу помочь тебе.' },
      { english: 'You must wear a seat belt.', russian: 'Ты должен пристегнуть ремень.' },
      { english: 'She should rest today.', russian: 'Ей стоит отдохнуть сегодня.' },
      { english: 'It might rain in the evening.', russian: 'Вечером может пойти дождь.' },
      { english: 'He can speak English well.', russian: 'Он хорошо говорит по-английски.' },
    ],
    exercises: [
      {
        type: 'fill_blank',
        sentence: 'She can ___ English well.',
        answer: 'speak',
        hint: 'После can нужен базовый глагол без -s.',
      },
      {
        type: 'translate',
        russian: 'Тебе стоит отдохнуть сегодня.',
        correctAnswer: 'You should rest today.',
        alternativeAnswers: ['You should rest today', 'You should have a rest today.'],
      },
      {
        type: 'choose_correct',
        question: 'Выбери правильное предложение.',
        options: ['She cans speak English.', 'She can speaks English.', 'She can speak English.', 'She can to speak English.'],
        correctIndex: 2,
      },
    ],
  },
]

export function getLessonsByLevel(level: LessonLevel): Lesson[] {
  return lessons
    .filter((lesson) => lesson.level === level)
    .sort((a, b) => a.order - b.order)
}

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id)
}

export function getLevelInfo(level: LessonLevel): LessonLevelInfo | undefined {
  return lessonLevels.find((item) => item.id === level)
}


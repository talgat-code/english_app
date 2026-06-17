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

const coreLessons: Lesson[] = [
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

const expandedLessons: Lesson[] = [
  {
    id: 'a1-6-home-rooms',
    level: 'A1',
    order: 6,
    title: 'Дом и комнаты',
    description: 'Называем комнаты, мебель и простые действия дома.',
    theory: {
      explanation:
        'Чтобы описать дом, удобно использовать This is и There is. This is показывает конкретный предмет, а There is говорит, что предмет где-то есть.',
      rules: [
        'Room означает комнату, house - дом как здание, home - дом как место, где живешь.',
        'There is используют с одним предметом: There is a table.',
        'Предлог in помогает сказать, где находится предмет: in the kitchen.',
        'Для простого описания комнаты используй It is + прилагательное.',
      ],
      tips: [
        'Kitchen, bedroom и bathroom часто идут с the, когда говорим о своем доме.',
        'Не переводи "у меня дома есть" дословно: лучше There is или We have.',
      ],
    },
    vocabulary: [
      word('les-a1-6-house', 'House', 'Дом', 'haus', 'This house is small.', 'Этот дом маленький.'),
      word('les-a1-6-room', 'Room', 'Комната', 'room', 'My room is clean.', 'Моя комната чистая.'),
      word('les-a1-6-kitchen', 'Kitchen', 'Кухня', 'kich-uhn', 'My mother is in the kitchen.', 'Моя мама на кухне.'),
      word('les-a1-6-bedroom', 'Bedroom', 'Спальня', 'bed-room', 'The bedroom is quiet.', 'Спальня тихая.'),
      word('les-a1-6-bathroom', 'Bathroom', 'Ванная', 'bath-room', 'The bathroom is next to my room.', 'Ванная рядом с моей комнатой.'),
      word('les-a1-6-table', 'Table', 'Стол', 'tay-buhl', 'There is a table in the room.', 'В комнате есть стол.'),
      word('les-a1-6-chair', 'Chair', 'Стул', 'chair', 'The chair is near the table.', 'Стул рядом со столом.'),
      word('les-a1-6-window', 'Window', 'Окно', 'win-doh', 'The window is open.', 'Окно открыто.'),
    ],
    examples: [
      { english: 'There is a table in the kitchen.', russian: 'На кухне есть стол.' },
      { english: 'My bedroom is small but quiet.', russian: 'Моя спальня маленькая, но тихая.' },
      { english: 'The chair is near the window.', russian: 'Стул рядом с окном.' },
      { english: 'This is our house.', russian: 'Это наш дом.' },
      { english: 'The bathroom is next to my room.', russian: 'Ванная рядом с моей комнатой.' },
    ],
    exercises: [
      {
        type: 'fill_blank',
        sentence: 'There is a table in the ___.',
        answer: 'kitchen',
        hint: 'Комната, где готовят еду.',
      },
      {
        type: 'translate',
        russian: 'Моя комната чистая.',
        correctAnswer: 'My room is clean.',
        alternativeAnswers: ['My room is clean'],
      },
      {
        type: 'choose_correct',
        question: 'Как сказать "в комнате есть стол"?',
        options: ['It is a table room.', 'There is a table in the room.', 'The room have table.', 'A table is room.'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'a1-7-weather',
    level: 'A1',
    order: 7,
    title: 'Погода',
    description: 'Говорим о погоде простыми фразами: тепло, холодно, дождливо.',
    theory: {
      explanation:
        'В английском погоду обычно описывают через It is: It is sunny, It is cold. It здесь не переводится как конкретный предмет, оно просто нужно для грамматики.',
      rules: [
        'Для погоды используй It is или It\'s: It is rainy.',
        'Today помогает уточнить, что погода сейчас: It is windy today.',
        'Very усиливает прилагательное: very cold, very hot.',
        'Like можно использовать для предпочтений: I like sunny weather.',
      ],
      tips: [
        'Не говори Weather is cold today, если описываешь обычную погоду. Естественнее: It is cold today.',
        'Sunny, rainy, windy - это прилагательные, они не требуют артикля.',
      ],
    },
    vocabulary: [
      word('les-a1-7-weather', 'Weather', 'Погода', 'weh-thur', 'The weather is nice.', 'Погода хорошая.'),
      word('les-a1-7-sunny', 'Sunny', 'Солнечно', 'sun-ee', 'It is sunny today.', 'Сегодня солнечно.'),
      word('les-a1-7-rainy', 'Rainy', 'Дождливо', 'ray-nee', 'It is rainy in London.', 'В Лондоне дождливо.'),
      word('les-a1-7-windy', 'Windy', 'Ветрено', 'win-dee', 'It is windy outside.', 'На улице ветрено.'),
      word('les-a1-7-cold', 'Cold', 'Холодно', 'kohld', 'It is cold in winter.', 'Зимой холодно.'),
      word('les-a1-7-hot', 'Hot', 'Жарко', 'hot', 'It is hot today.', 'Сегодня жарко.'),
      word('les-a1-7-cloudy', 'Cloudy', 'Облачно', 'klau-dee', 'The sky is cloudy.', 'Небо облачное.'),
      word('les-a1-7-outside', 'Outside', 'Снаружи / на улице', 'aut-said', 'It is cold outside.', 'На улице холодно.'),
    ],
    examples: [
      { english: 'It is sunny today.', russian: 'Сегодня солнечно.' },
      { english: 'It is very cold outside.', russian: 'На улице очень холодно.' },
      { english: 'I like rainy weather.', russian: 'Мне нравится дождливая погода.' },
      { english: 'The sky is cloudy.', russian: 'Небо облачное.' },
      { english: 'Is it hot today?', russian: 'Сегодня жарко?' },
    ],
    exercises: [
      {
        type: 'fill_blank',
        sentence: 'It is ___ today.',
        answer: 'sunny',
        hint: 'Солнечно по-английски.',
      },
      {
        type: 'translate',
        russian: 'На улице холодно.',
        correctAnswer: 'It is cold outside.',
        alternativeAnswers: ['It is cold outside', 'It\'s cold outside.'],
      },
      {
        type: 'choose_correct',
        question: 'Какая фраза естественно описывает погоду?',
        options: ['It is rainy.', 'Rainy is it.', 'The rainy today.', 'I am rainy.'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'a1-8-clothes',
    level: 'A1',
    order: 8,
    title: 'Одежда',
    description: 'Называем одежду и описываем, что на человеке надето.',
    theory: {
      explanation:
        'Для одежды важно различать wear и have. Wear означает "носить на себе", а have - "иметь". Чтобы описать одежду сейчас, используй I am wearing.',
      rules: [
        'I wear jeans обычно значит "я ношу джинсы вообще".',
        'I am wearing jeans значит "я сейчас в джинсах".',
        'Цвет ставится перед одеждой: a black jacket.',
        'Shoes всегда обычно во множественном числе: my shoes are black.',
      ],
      tips: [
        'A shirt, a dress, a jacket - один предмет одежды.',
        'Jeans, trousers, shoes лучше запоминать как plural-слова.',
      ],
    },
    vocabulary: [
      word('les-a1-8-shirt', 'Shirt', 'Рубашка', 'shert', 'He is wearing a white shirt.', 'Он в белой рубашке.'),
      word('les-a1-8-dress', 'Dress', 'Платье', 'dres', 'She likes this dress.', 'Ей нравится это платье.'),
      word('les-a1-8-jeans', 'Jeans', 'Джинсы', 'jeenz', 'My jeans are blue.', 'Мои джинсы синие.'),
      word('les-a1-8-shoes', 'Shoes', 'Обувь / туфли', 'shooz', 'These shoes are new.', 'Эти туфли новые.'),
      word('les-a1-8-jacket', 'Jacket', 'Куртка', 'jak-it', 'Take your jacket.', 'Возьми куртку.'),
      word('les-a1-8-hat', 'Hat', 'Шапка / шляпа', 'hat', 'The hat is red.', 'Шапка красная.'),
      word('les-a1-8-wear', 'Wear', 'Носить', 'wair', 'I wear a coat in winter.', 'Зимой я ношу пальто.'),
      word('les-a1-8-new', 'New', 'Новый', 'noo', 'My new shoes are comfortable.', 'Моя новая обувь удобная.'),
    ],
    examples: [
      { english: 'I am wearing a blue shirt.', russian: 'Я сейчас в синей рубашке.' },
      { english: 'Her shoes are new.', russian: 'Ее туфли новые.' },
      { english: 'He wears a jacket in winter.', russian: 'Зимой он носит куртку.' },
      { english: 'This dress is beautiful.', russian: 'Это платье красивое.' },
      { english: 'My jeans are black.', russian: 'Мои джинсы черные.' },
    ],
    exercises: [
      {
        type: 'fill_blank',
        sentence: 'I am ___ a blue shirt.',
        answer: 'wearing',
        hint: 'Сейчас на мне: am + wearing.',
      },
      {
        type: 'translate',
        russian: 'Мои джинсы черные.',
        correctAnswer: 'My jeans are black.',
        alternativeAnswers: ['My jeans are black'],
      },
      {
        type: 'choose_correct',
        question: 'Что правильно про shoes?',
        options: ['My shoes is new.', 'My shoes are new.', 'My shoe are new.', 'My shoes am new.'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'a2-6-there-is-are',
    level: 'A2',
    order: 6,
    title: 'There is / There are',
    description: 'Говорим, что где-то что-то есть: один предмет или несколько.',
    theory: {
      explanation:
        'There is и There are помогают описывать место. There is используется с одним предметом, There are - с несколькими.',
      rules: [
        'There is a book on the table.',
        'There are two chairs in the room.',
        'В отрицании добавь not: There is not a sofa.',
        'В вопросе поставь is/are вперед: Is there a cafe near here?',
      ],
      tips: [
        'Выбирай is или are по существительному после конструкции.',
        'В разговоре There is часто сокращают до There\'s.',
      ],
    },
    vocabulary: [
      word('les-a2-6-there', 'There', 'Там / конструкция есть', 'thair', 'There is a cafe here.', 'Здесь есть кафе.'),
      word('les-a2-6-map', 'Map', 'Карта', 'map', 'There is a map on the wall.', 'На стене есть карта.'),
      word('les-a2-6-sofa', 'Sofa', 'Диван', 'soh-fuh', 'There is a sofa in the room.', 'В комнате есть диван.'),
      word('les-a2-6-lamp', 'Lamp', 'Лампа', 'lamp', 'There is a lamp near the bed.', 'Рядом с кроватью есть лампа.'),
      word('les-a2-6-cafe', 'Cafe', 'Кафе', 'ka-fay', 'There is a cafe near the station.', 'Рядом со станцией есть кафе.'),
      word('les-a2-6-near', 'Near', 'Рядом', 'neer', 'The cafe is near my house.', 'Кафе рядом с моим домом.'),
      word('les-a2-6-many', 'Many', 'Много', 'men-ee', 'There are many people here.', 'Здесь много людей.'),
      word('les-a2-6-some', 'Some', 'Несколько / немного', 'sum', 'There are some books on the shelf.', 'На полке есть несколько книг.'),
    ],
    examples: [
      { english: 'There is a lamp near the bed.', russian: 'Рядом с кроватью есть лампа.' },
      { english: 'There are three books on the table.', russian: 'На столе три книги.' },
      { english: 'Is there a cafe near here?', russian: 'Рядом есть кафе?' },
      { english: 'There are not many people here.', russian: 'Здесь не много людей.' },
      { english: 'There is no sofa in the room.', russian: 'В комнате нет дивана.' },
    ],
    exercises: [
      {
        type: 'fill_blank',
        sentence: 'There ___ two chairs in the room.',
        answer: 'are',
        hint: 'Two chairs - множественное число.',
      },
      {
        type: 'translate',
        russian: 'Рядом есть кафе?',
        correctAnswer: 'Is there a cafe near here?',
        alternativeAnswers: ['Is there a cafe near here', 'Is there a cafe nearby?'],
      },
      {
        type: 'choose_correct',
        question: 'Выбери правильную фразу.',
        options: ['There is two books.', 'There are two books.', 'There are a book.', 'There be two books.'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'a2-7-countable-uncountable',
    level: 'A2',
    order: 7,
    title: 'Исчисляемое и неисчисляемое',
    description: 'Разбираемся с some, any, much и many.',
    theory: {
      explanation:
        'В английском важно понимать, можно ли считать предметы по одному. Apples - исчисляемое, water - неисчисляемое. От этого зависит выбор many или much.',
      rules: [
        'Many используют с исчисляемыми словами: many apples.',
        'Much используют с неисчисляемыми словами: much water.',
        'Some часто используют в утвердительных предложениях.',
        'Any часто используют в вопросах и отрицаниях.',
      ],
      tips: [
        'Money в английском обычно неисчисляемое: much money.',
        'Advice тоже неисчисляемое: some advice, не advices.',
      ],
    },
    vocabulary: [
      word('les-a2-7-water', 'Water', 'Вода', 'waw-ter', 'I need some water.', 'Мне нужно немного воды.'),
      word('les-a2-7-money', 'Money', 'Деньги', 'mun-ee', 'Do you have any money?', 'У тебя есть деньги?'),
      word('les-a2-7-advice', 'Advice', 'Совет', 'ad-vais', 'She gave me some advice.', 'Она дала мне совет.'),
      word('les-a2-7-apple', 'Apple', 'Яблоко', 'ap-uhl', 'There are many apples.', 'Есть много яблок.'),
      word('les-a2-7-bottle', 'Bottle', 'Бутылка', 'bot-uhl', 'I bought a bottle of water.', 'Я купил бутылку воды.'),
      word('les-a2-7-some', 'Some', 'Немного / несколько', 'sum', 'I have some questions.', 'У меня есть несколько вопросов.'),
      word('les-a2-7-any', 'Any', 'Какой-нибудь / нисколько', 'en-ee', 'Do you have any questions?', 'У тебя есть вопросы?'),
      word('les-a2-7-much', 'Much', 'Много', 'much', 'There is not much time.', 'Времени не много.'),
    ],
    examples: [
      { english: 'I have some apples.', russian: 'У меня есть несколько яблок.' },
      { english: 'Do you have any water?', russian: 'У тебя есть вода?' },
      { english: 'There is not much time.', russian: 'Времени не много.' },
      { english: 'There are many students here.', russian: 'Здесь много студентов.' },
      { english: 'She gave me some advice.', russian: 'Она дала мне совет.' },
    ],
    exercises: [
      {
        type: 'fill_blank',
        sentence: 'There is not ___ time.',
        answer: 'much',
        hint: 'Time обычно неисчисляемое.',
      },
      {
        type: 'translate',
        russian: 'У тебя есть вопросы?',
        correctAnswer: 'Do you have any questions?',
        alternativeAnswers: ['Do you have any questions', 'Have you got any questions?'],
      },
      {
        type: 'choose_correct',
        question: 'Что правильно с advice?',
        options: ['Many advices', 'Some advice', 'An advice', 'A few advice'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'a2-8-polite-requests',
    level: 'A2',
    order: 8,
    title: 'Вежливые просьбы',
    description: 'Просим о помощи и разрешении через can, could и may.',
    theory: {
      explanation:
        'Can подходит для обычной просьбы, could звучит мягче, may - формальнее. После них основной глагол идет без to.',
      rules: [
        'Can you help me? - обычная просьба.',
        'Could you help me? - более вежливо.',
        'May I come in? - формальное разрешение.',
        'После can/could/may глагол идет в базовой форме: help, open, use.',
      ],
      tips: [
        'Добавляй please в конце или начале просьбы.',
        'Could you...? часто звучит лучше в сервисе, офисе и переписке.',
      ],
    },
    vocabulary: [
      word('les-a2-8-can', 'Can', 'Мочь', 'kan', 'Can you help me?', 'Ты можешь мне помочь?'),
      word('les-a2-8-could', 'Could', 'Мог бы', 'kood', 'Could you open the window?', 'Не могли бы вы открыть окно?'),
      word('les-a2-8-may', 'May', 'Можно / могу', 'may', 'May I come in?', 'Можно войти?'),
      word('les-a2-8-help', 'Help', 'Помогать', 'help', 'Please help me.', 'Пожалуйста, помоги мне.'),
      word('les-a2-8-open', 'Open', 'Открывать', 'oh-puhn', 'Could you open the door?', 'Не могли бы вы открыть дверь?'),
      word('les-a2-8-close', 'Close', 'Закрывать', 'klohz', 'Can you close the window?', 'Можешь закрыть окно?'),
      word('les-a2-8-borrow', 'Borrow', 'Одолжить', 'bor-oh', 'May I borrow your pen?', 'Можно одолжить твою ручку?'),
      word('les-a2-8-minute', 'Minute', 'Минута', 'min-it', 'Could you wait a minute?', 'Не могли бы вы подождать минуту?'),
    ],
    examples: [
      { english: 'Could you help me, please?', russian: 'Не могли бы вы мне помочь?' },
      { english: 'Can I use your phone?', russian: 'Можно мне воспользоваться твоим телефоном?' },
      { english: 'May I come in?', russian: 'Можно войти?' },
      { english: 'Could you wait a minute?', russian: 'Не могли бы вы подождать минуту?' },
      { english: 'Can you close the window?', russian: 'Можешь закрыть окно?' },
    ],
    exercises: [
      {
        type: 'fill_blank',
        sentence: 'Could you ___ me, please?',
        answer: 'help',
        hint: 'После could нужен базовый глагол.',
      },
      {
        type: 'translate',
        russian: 'Можно войти?',
        correctAnswer: 'May I come in?',
        alternativeAnswers: ['May I come in', 'Can I come in?'],
      },
      {
        type: 'choose_correct',
        question: 'Какая просьба звучит вежливее?',
        options: ['Open window.', 'Could you open the window?', 'You open window?', 'Opening the window?'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'b1-6-gerund-infinitive',
    level: 'B1',
    order: 6,
    title: 'Gerund и Infinitive',
    description: 'Выбираем между doing и to do после частых глаголов.',
    theory: {
      explanation:
        'После одних глаголов нужен герундий с -ing, после других - инфинитив с to. Это лучше запоминать вместе с глаголом: enjoy doing, want to do.',
      rules: [
        'Enjoy, avoid, finish часто требуют -ing: I enjoy reading.',
        'Want, decide, plan часто требуют to + verb: I want to travel.',
        'После would like ставим to: I would like to order.',
        'После prepositions обычно нужен -ing: after working, without asking.',
      ],
      tips: [
        'Запоминай связки, а не отдельные слова: decide to, enjoy doing.',
        'Like может работать с обеими формами, но смысл иногда меняется.',
      ],
    },
    vocabulary: [
      word('les-b1-6-enjoy', 'Enjoy', 'Наслаждаться / любить', 'en-joi', 'I enjoy reading.', 'Мне нравится читать.'),
      word('les-b1-6-avoid', 'Avoid', 'Избегать', 'uh-void', 'Avoid making the same mistake.', 'Избегай той же ошибки.'),
      word('les-b1-6-finish', 'Finish', 'Заканчивать', 'fin-ish', 'She finished writing the report.', 'Она закончила писать отчет.'),
      word('les-b1-6-decide', 'Decide', 'Решать', 'di-said', 'We decided to stay.', 'Мы решили остаться.'),
      word('les-b1-6-plan', 'Plan', 'Планировать', 'plan', 'They plan to move soon.', 'Они планируют скоро переехать.'),
      word('les-b1-6-want', 'Want', 'Хотеть', 'wont', 'I want to improve my English.', 'Я хочу улучшить английский.'),
      word('les-b1-6-practice', 'Practice', 'Практиковать', 'prak-tis', 'Practice speaking every day.', 'Практикуй говорение каждый день.'),
      word('les-b1-6-without', 'Without', 'Без', 'with-out', 'He left without saying goodbye.', 'Он ушел, не попрощавшись.'),
    ],
    examples: [
      { english: 'I enjoy learning new words.', russian: 'Мне нравится учить новые слова.' },
      { english: 'She decided to change her job.', russian: 'Она решила сменить работу.' },
      { english: 'We finished watching the film.', russian: 'Мы закончили смотреть фильм.' },
      { english: 'He wants to speak better.', russian: 'Он хочет говорить лучше.' },
      { english: 'They left without saying goodbye.', russian: 'Они ушли, не попрощавшись.' },
    ],
    exercises: [
      {
        type: 'fill_blank',
        sentence: 'I enjoy ___ English.',
        answer: 'learning',
        hint: 'После enjoy нужен глагол с -ing.',
      },
      {
        type: 'translate',
        russian: 'Она решила остаться.',
        correctAnswer: 'She decided to stay.',
        alternativeAnswers: ['She decided to stay'],
      },
      {
        type: 'choose_correct',
        question: 'Что правильно после want?',
        options: ['want improving', 'want to improve', 'want improve', 'want improved'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'b1-7-relative-clauses',
    level: 'B1',
    order: 7,
    title: 'Relative Clauses',
    description: 'Добавляем уточнения через who, which и where.',
    theory: {
      explanation:
        'Relative clauses помогают соединять предложения и уточнять человека, предмет или место. Who - для людей, which - для предметов, where - для мест.',
      rules: [
        'Who используют для людей: The teacher who helped me.',
        'Which используют для вещей и идей: The book which I bought.',
        'Where используют для мест: The cafe where we met.',
        'Уточняющая часть стоит сразу после слова, которое объясняет.',
      ],
      tips: [
        'That часто может заменить who или which в разговорной речи.',
        'Не повторяй местоимение внутри clause: The book which I bought it - ошибка.',
      ],
    },
    vocabulary: [
      word('les-b1-7-who', 'Who', 'Который / кто', 'hoo', 'The woman who called is my manager.', 'Женщина, которая звонила, мой менеджер.'),
      word('les-b1-7-which', 'Which', 'Который / какой', 'wich', 'The book which I bought is useful.', 'Книга, которую я купил, полезная.'),
      word('les-b1-7-where', 'Where', 'Где / в котором', 'wair', 'This is the cafe where we met.', 'Это кафе, где мы встретились.'),
      word('les-b1-7-that', 'That', 'Который', 'that', 'The film that we watched was funny.', 'Фильм, который мы смотрели, был смешным.'),
      word('les-b1-7-teacher', 'Teacher', 'Учитель', 'tee-chur', 'The teacher who helped me is kind.', 'Учитель, который помог мне, добрый.'),
      word('les-b1-7-place', 'Place', 'Место', 'plays', 'This is the place where I work.', 'Это место, где я работаю.'),
      word('les-b1-7-useful', 'Useful', 'Полезный', 'yoos-fuhl', 'This app is useful.', 'Это приложение полезное.'),
      word('les-b1-7-met', 'Met', 'Встретил / встретились', 'met', 'We met in this cafe.', 'Мы встретились в этом кафе.'),
    ],
    examples: [
      { english: 'The teacher who helped me is kind.', russian: 'Учитель, который помог мне, добрый.' },
      { english: 'The book which I bought is useful.', russian: 'Книга, которую я купил, полезная.' },
      { english: 'This is the cafe where we met.', russian: 'Это кафе, где мы встретились.' },
      { english: 'The film that we watched was funny.', russian: 'Фильм, который мы смотрели, был смешным.' },
      { english: 'I know a person who speaks five languages.', russian: 'Я знаю человека, который говорит на пяти языках.' },
    ],
    exercises: [
      {
        type: 'fill_blank',
        sentence: 'This is the cafe ___ we met.',
        answer: 'where',
        hint: 'Для места используем where.',
      },
      {
        type: 'translate',
        russian: 'Я знаю человека, который говорит по-английски.',
        correctAnswer: 'I know a person who speaks English.',
        alternativeAnswers: ['I know a person who speaks English', 'I know someone who speaks English.'],
      },
      {
        type: 'choose_correct',
        question: 'Что правильно для предмета?',
        options: ['The book who I bought', 'The book which I bought', 'The book where I bought', 'The book what I bought'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'b1-8-phrasal-verbs',
    level: 'B1',
    order: 8,
    title: 'Фразовые глаголы',
    description: 'Разбираем частые глаголы с up, on, off и out.',
    theory: {
      explanation:
        'Фразовый глагол состоит из глагола и маленького слова, которое меняет смысл: get up, turn on, find out. Их лучше учить в контексте.',
      rules: [
        'Get up означает вставать с кровати.',
        'Turn on - включить, turn off - выключить.',
        'Find out означает узнать информацию.',
        'Look after означает заботиться о ком-то.',
      ],
      tips: [
        'Не пытайся всегда переводить части отдельно: значение часто новое.',
        'Записывай фразовый глагол с примером, а не как отдельный перевод.',
      ],
    },
    vocabulary: [
      word('les-b1-8-get-up', 'Get up', 'Вставать', 'get up', 'I get up at seven.', 'Я встаю в семь.'),
      word('les-b1-8-turn-on', 'Turn on', 'Включать', 'turn on', 'Turn on the light, please.', 'Включи свет, пожалуйста.'),
      word('les-b1-8-turn-off', 'Turn off', 'Выключать', 'turn off', 'Turn off your phone.', 'Выключи телефон.'),
      word('les-b1-8-find-out', 'Find out', 'Узнать', 'faind out', 'I need to find out the price.', 'Мне нужно узнать цену.'),
      word('les-b1-8-look-after', 'Look after', 'Присматривать / заботиться', 'look af-ter', 'She looks after her sister.', 'Она присматривает за сестрой.'),
      word('les-b1-8-give-up', 'Give up', 'Сдаваться / бросать', 'giv up', 'Do not give up.', 'Не сдавайся.'),
      word('les-b1-8-pick-up', 'Pick up', 'Подбирать / забирать', 'pik up', 'Can you pick me up?', 'Можешь меня забрать?'),
      word('les-b1-8-calm-down', 'Calm down', 'Успокоиться', 'kahm down', 'Please calm down.', 'Пожалуйста, успокойся.'),
    ],
    examples: [
      { english: 'I get up early on weekdays.', russian: 'По будням я встаю рано.' },
      { english: 'Please turn off the light.', russian: 'Пожалуйста, выключи свет.' },
      { english: 'We need to find out the address.', russian: 'Нам нужно узнать адрес.' },
      { english: 'She looks after her younger brother.', russian: 'Она присматривает за младшим братом.' },
      { english: 'Do not give up after one mistake.', russian: 'Не сдавайся после одной ошибки.' },
    ],
    exercises: [
      {
        type: 'fill_blank',
        sentence: 'Please turn ___ the light.',
        answer: 'off',
        hint: 'Выключить - turn off.',
      },
      {
        type: 'translate',
        russian: 'Не сдавайся.',
        correctAnswer: 'Do not give up.',
        alternativeAnswers: ['Do not give up', 'Don\'t give up.'],
      },
      {
        type: 'choose_correct',
        question: 'Как сказать "узнать информацию"?',
        options: ['Find out', 'Look after', 'Turn off', 'Get up'],
        correctIndex: 0,
      },
    ],
  },
]

export const lessons: Lesson[] = [...coreLessons, ...expandedLessons]

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

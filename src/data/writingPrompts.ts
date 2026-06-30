import type { WritingPrompt } from '../types/writing'

export const writingPrompts: WritingPrompt[] = [
  {
    id: 'a1-daily-routine',
    level: 'A1',
    prompt: 'Опиши свой обычный день.',
    minWords: 35,
  },
  {
    id: 'a1-family',
    level: 'A1',
    prompt: 'Расскажи о своей семье или близких людях.',
    minWords: 35,
  },
  {
    id: 'a1-favorite-food',
    level: 'A1',
    prompt: 'Расскажи о своём любимом блюде.',
    minWords: 30,
  },
  {
    id: 'a1-room',
    level: 'A1',
    prompt: 'Опиши свою комнату или рабочее место.',
    minWords: 30,
  },
  {
    id: 'a1-weekend',
    level: 'A1',
    prompt: 'Напиши, что ты обычно делаешь в выходные.',
    minWords: 35,
  },
  {
    id: 'a1-best-friend',
    level: 'A1',
    prompt: 'Опиши своего друга: имя, характер и что вы делаете вместе.',
    minWords: 35,
  },
  {
    id: 'a1-my-city',
    level: 'A1',
    prompt: 'Опиши город или место, где ты живёшь.',
    minWords: 35,
  },
  {
    id: 'a1-hobby',
    level: 'A1',
    prompt: 'Расскажи о своём хобби простыми предложениями.',
    minWords: 30,
  },
  {
    id: 'a2-last-weekend',
    level: 'A2',
    prompt: 'Расскажи, как ты провёл прошлые выходные.',
    minWords: 55,
  },
  {
    id: 'a2-next-vacation',
    level: 'A2',
    prompt: 'Опиши планы на следующий отпуск.',
    minWords: 60,
  },
  {
    id: 'a2-favorite-season',
    level: 'A2',
    prompt: 'Расскажи о любимом времени года и объясни почему.',
    minWords: 55,
  },
  {
    id: 'a2-healthy-habits',
    level: 'A2',
    prompt: 'Напиши о полезных привычках, которые помогают тебе чувствовать себя лучше.',
    minWords: 60,
  },
  {
    id: 'a2-shopping',
    level: 'A2',
    prompt: 'Опиши удачную или неудачную покупку.',
    minWords: 55,
  },
  {
    id: 'a2-work-study',
    level: 'A2',
    prompt: 'Расскажи о своей учёбе или работе: что нравится и что сложно.',
    minWords: 60,
  },
  {
    id: 'a2-travel-place',
    level: 'A2',
    prompt: 'Опиши место, которое ты хотел бы посетить.',
    minWords: 60,
  },
  {
    id: 'a2-learning-english',
    level: 'A2',
    prompt: 'Расскажи, зачем ты учишь английский и как практикуешься.',
    minWords: 60,
  },
  {
    id: 'b1-book-movie',
    level: 'B1',
    prompt: 'Расскажи о книге или фильме, который тебе понравился.',
    minWords: 90,
  },
  {
    id: 'b1-important-decision',
    level: 'B1',
    prompt: 'Опиши важное решение, которое ты недавно принял.',
    minWords: 90,
  },
  {
    id: 'b1-technology',
    level: 'B1',
    prompt: 'Как технологии меняют твою повседневную жизнь?',
    minWords: 95,
  },
  {
    id: 'b1-advice',
    level: 'B1',
    prompt: 'Дай совет человеку, который хочет начать учить английский.',
    minWords: 90,
  },
  {
    id: 'b1-memory',
    level: 'B1',
    prompt: 'Опиши приятное воспоминание из детства или недавнего прошлого.',
    minWords: 90,
  },
  {
    id: 'b1-pros-cons',
    level: 'B1',
    prompt: 'Напиши о плюсах и минусах жизни в большом городе.',
    minWords: 100,
  },
  {
    id: 'b1-goal',
    level: 'B1',
    prompt: 'Опиши цель, которой ты хочешь достичь в этом году.',
    minWords: 90,
  },
  {
    id: 'b1-opinion-online-learning',
    level: 'B1',
    prompt: 'Выскажи мнение: онлайн-обучение лучше обычных занятий или нет?',
    minWords: 100,
  },
]

export function getWritingPromptsByLevel(level: WritingPrompt['level']) {
  return writingPrompts.filter((prompt) => prompt.level === level)
}

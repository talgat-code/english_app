import type { LessonLevel } from '../types'

export type AchievementCategory =
  | 'streak'
  | 'words'
  | 'quizzes'
  | 'expressions'
  | 'games'
  | 'lessons'
  | 'special'

export type AchievementCondition =
  | { type: 'streak'; days: number }
  | { type: 'knownWords'; count: number }
  | { type: 'totalQuizzes'; count: number }
  | { type: 'perfectQuiz' }
  | { type: 'perfectQuizStreak'; count: number }
  | { type: 'knownIdioms'; count: number }
  | { type: 'allIdioms' }
  | { type: 'knownPhrasalVerbs'; count: number }
  | { type: 'hangmanWins'; count: number }
  | { type: 'wordBuilderBestScore'; score: number }
  | { type: 'completedLessons'; count: number }
  | { type: 'completedLevel'; level: LessonLevel }
  | { type: 'allLessons' }
  | { type: 'usedAiTutor' }
  | { type: 'studiedOnWeekend' }
  | { type: 'studiedAfter23' }

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: AchievementCategory
  condition: AchievementCondition
}

export const achievementCategoryLabels: Record<AchievementCategory, string> = {
  streak: 'Streak',
  words: 'Слова',
  quizzes: 'Квизы',
  expressions: 'Идиомы/глаголы',
  games: 'Игры',
  lessons: 'Уроки',
  special: 'Особые',
}

export const achievements: Achievement[] = [
  {
    id: 'streak-3-days',
    title: '3 дня подряд',
    description: 'Занимайся 3 дня подряд.',
    icon: '🔥',
    category: 'streak',
    condition: { type: 'streak', days: 3 },
  },
  {
    id: 'streak-7-days',
    title: '7 дней подряд',
    description: 'Поддержи серию занятий 7 дней подряд.',
    icon: '🔥🔥',
    category: 'streak',
    condition: { type: 'streak', days: 7 },
  },
  {
    id: 'streak-30-days',
    title: '30 дней подряд',
    description: 'Учись целый месяц без пропусков.',
    icon: '🏆',
    category: 'streak',
    condition: { type: 'streak', days: 30 },
  },
  {
    id: 'streak-100-days',
    title: '100 дней подряд',
    description: 'Доведи серию до 100 дней.',
    icon: '👑',
    category: 'streak',
    condition: { type: 'streak', days: 100 },
  },
  {
    id: 'words-10-known',
    title: 'Выучил 10 слов',
    description: 'Отметь 10 слов как знакомые.',
    icon: '🌱',
    category: 'words',
    condition: { type: 'knownWords', count: 10 },
  },
  {
    id: 'words-50-known',
    title: 'Выучил 50 слов',
    description: 'Отметь 50 слов как знакомые.',
    icon: '🌿',
    category: 'words',
    condition: { type: 'knownWords', count: 50 },
  },
  {
    id: 'words-100-known',
    title: 'Выучил 100 слов',
    description: 'Отметь 100 слов как знакомые.',
    icon: '🌳',
    category: 'words',
    condition: { type: 'knownWords', count: 100 },
  },
  {
    id: 'words-300-known',
    title: 'Выучил 300 слов',
    description: 'Отметь 300 слов как знакомые.',
    icon: '🎓',
    category: 'words',
    condition: { type: 'knownWords', count: 300 },
  },
  {
    id: 'quizzes-first',
    title: 'Первый квиз пройден',
    description: 'Заверши любой квиз.',
    icon: '✅',
    category: 'quizzes',
    condition: { type: 'totalQuizzes', count: 1 },
  },
  {
    id: 'quizzes-10',
    title: '10 квизов пройдено',
    description: 'Заверши 10 квизов.',
    icon: '📝',
    category: 'quizzes',
    condition: { type: 'totalQuizzes', count: 10 },
  },
  {
    id: 'quizzes-25',
    title: '25 квизов пройдено',
    description: 'Заверши 25 квизов.',
    icon: '📚',
    category: 'quizzes',
    condition: { type: 'totalQuizzes', count: 25 },
  },
  {
    id: 'quizzes-perfect',
    title: 'Идеальный результат 100%',
    description: 'Заверши квиз без ошибок.',
    icon: '⭐',
    category: 'quizzes',
    condition: { type: 'perfectQuiz' },
  },
  {
    id: 'quizzes-perfect-streak-5',
    title: '5 идеальных результатов подряд',
    description: 'Получи 100% в 5 квизах подряд.',
    icon: '🌟',
    category: 'quizzes',
    condition: { type: 'perfectQuizStreak', count: 5 },
  },
  {
    id: 'idioms-10-known',
    title: 'Изучил 10 идиом',
    description: 'Отметь 10 идиом как знакомые.',
    icon: '💬',
    category: 'expressions',
    condition: { type: 'knownIdioms', count: 10 },
  },
  {
    id: 'idioms-all-known',
    title: 'Изучил все идиомы',
    description: 'Отметь все идиомы как знакомые.',
    icon: '🎯',
    category: 'expressions',
    condition: { type: 'allIdioms' },
  },
  {
    id: 'phrasal-verbs-10-known',
    title: 'Изучил 10 фразовых глаголов',
    description: 'Отметь 10 фразовых глаголов как знакомые.',
    icon: '🔤',
    category: 'expressions',
    condition: { type: 'knownPhrasalVerbs', count: 10 },
  },
  {
    id: 'hangman-first-win',
    title: 'Первая победа в виселице',
    description: 'Выиграй первый раунд в виселице.',
    icon: '🎮',
    category: 'games',
    condition: { type: 'hangmanWins', count: 1 },
  },
  {
    id: 'hangman-10-wins',
    title: '10 побед в виселице',
    description: 'Выиграй 10 раундов в виселице.',
    icon: '🏅',
    category: 'games',
    condition: { type: 'hangmanWins', count: 10 },
  },
  {
    id: 'word-builder-100',
    title: '100 очков в составь слово',
    description: 'Набери 100 очков в игре "Составь слово".',
    icon: '🧩',
    category: 'games',
    condition: { type: 'wordBuilderBestScore', score: 100 },
  },
  {
    id: 'word-builder-300',
    title: '300 очков в составь слово',
    description: 'Набери 300 очков в игре "Составь слово".',
    icon: '💎',
    category: 'games',
    condition: { type: 'wordBuilderBestScore', score: 300 },
  },
  {
    id: 'lessons-first',
    title: 'Первый урок пройден',
    description: 'Заверши любой урок.',
    icon: '📖',
    category: 'lessons',
    condition: { type: 'completedLessons', count: 1 },
  },
  {
    id: 'lessons-a1-complete',
    title: 'Уровень A1 завершён',
    description: 'Пройди все уроки уровня A1.',
    icon: '🥉',
    category: 'lessons',
    condition: { type: 'completedLevel', level: 'A1' },
  },
  {
    id: 'lessons-a2-complete',
    title: 'Уровень A2 завершён',
    description: 'Пройди все уроки уровня A2.',
    icon: '🥈',
    category: 'lessons',
    condition: { type: 'completedLevel', level: 'A2' },
  },
  {
    id: 'lessons-b1-complete',
    title: 'Уровень B1 завершён',
    description: 'Пройди все уроки уровня B1.',
    icon: '🥇',
    category: 'lessons',
    condition: { type: 'completedLevel', level: 'B1' },
  },
  {
    id: 'lessons-all-complete',
    title: 'Все уроки завершены',
    description: 'Пройди все уроки в приложении.',
    icon: '🚀',
    category: 'lessons',
    condition: { type: 'allLessons' },
  },
  {
    id: 'special-ai-tutor',
    title: 'Использовал AI-репетитора',
    description: 'Задай вопрос AI-репетитору.',
    icon: '🤖',
    category: 'special',
    condition: { type: 'usedAiTutor' },
  },
  {
    id: 'special-weekend-study',
    title: 'Позанимался в выходные',
    description: 'Открой учебную активность в субботу или воскресенье.',
    icon: '📅',
    category: 'special',
    condition: { type: 'studiedOnWeekend' },
  },
  {
    id: 'special-midnight-study',
    title: 'Полночный учёный',
    description: 'Позанимайся после 23:00.',
    icon: '🌙',
    category: 'special',
    condition: { type: 'studiedAfter23' },
  },
]

export const achievementById = new Map(
  achievements.map((achievement) => [achievement.id, achievement] as const),
)

export function getAchievementById(id: string): Achievement | undefined {
  return achievementById.get(id)
}

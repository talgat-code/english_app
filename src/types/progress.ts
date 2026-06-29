export type WordStatus = 'known' | 'learning'

export interface WordProgress {
  status?: WordStatus
  correct: number
  incorrect: number
  lastReviewed?: string
}

export interface QuizStats {
  totalQuizzes: number
  quizPercentSum: number
}

export interface QuizMilestones {
  bestPercent: number
  perfectStreak: number
}

export interface OverallStats extends QuizStats {
  streak: number
  lastActiveDate?: string
}

export interface GameStats {
  hangmanWins: number
  wordBuilderBestScore: number
}

export interface SpecialStats {
  usedAiTutor: boolean
  studiedOnWeekend: boolean
  studiedAfter23: boolean
}

export interface UnlockedAchievement {
  id: string
  unlockedAt: string
}

export interface ProgressState {
  words: Record<string, WordProgress>
  idiomProgress: Record<string, WordProgress>
  phrasalVerbProgress: Record<string, WordProgress>
  stats: OverallStats
  idiomStats: QuizStats
  phrasalVerbStats: QuizStats
  quizMilestones: QuizMilestones
  gameStats: GameStats
  specialStats: SpecialStats
  completedLessons: string[]
  lessonScores: Record<string, number>
  unlockedAchievements: UnlockedAchievement[]
}

export type UserProgress = ProgressState

export interface QuizAnswer {
  wordId: string
  correct: boolean
}

export interface IdiomQuizAnswer {
  idiomId: string
  correct: boolean
}

export interface PhrasalVerbQuizAnswer {
  phrasalVerbId: string
  correct: boolean
}

export interface DifficultWord {
  wordId: string
  correct: number
  incorrect: number
  percent: number
}

export interface DifficultIdiom {
  idiomId: string
  correct: number
  incorrect: number
  percent: number
}

export interface DifficultPhrasalVerb {
  phrasalVerbId: string
  correct: number
  incorrect: number
  percent: number
}

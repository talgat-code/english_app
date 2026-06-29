import {
  achievements,
  type AchievementCondition,
} from '../data/achievements'
import { totalIdiomCount } from '../data/idioms'
import { getLessonsByLevel, lessons } from '../data/lessons'
import type { UserProgress } from '../types'
import { countKnown } from './progressUtils'

function totalQuizzes(progress: UserProgress): number {
  return (
    progress.stats.totalQuizzes +
    progress.idiomStats.totalQuizzes +
    progress.phrasalVerbStats.totalQuizzes
  )
}

function hasCompletedLevel(progress: UserProgress, level: 'A1' | 'A2' | 'B1') {
  const completed = new Set(progress.completedLessons)
  const levelLessons = getLessonsByLevel(level)

  return (
    levelLessons.length > 0 &&
    levelLessons.every((lesson) => completed.has(lesson.id))
  )
}

function isConditionMet(
  condition: AchievementCondition,
  progress: UserProgress,
): boolean {
  switch (condition.type) {
    case 'streak':
      return progress.stats.streak >= condition.days
    case 'knownWords':
      return countKnown(progress.words) >= condition.count
    case 'totalQuizzes':
      return totalQuizzes(progress) >= condition.count
    case 'perfectQuiz':
      return progress.quizMilestones.bestPercent >= 100
    case 'perfectQuizStreak':
      return progress.quizMilestones.perfectStreak >= condition.count
    case 'knownIdioms':
      return countKnown(progress.idiomProgress) >= condition.count
    case 'allIdioms':
      return (
        totalIdiomCount > 0 &&
        countKnown(progress.idiomProgress) >= totalIdiomCount
      )
    case 'knownPhrasalVerbs':
      return countKnown(progress.phrasalVerbProgress) >= condition.count
    case 'hangmanWins':
      return progress.gameStats.hangmanWins >= condition.count
    case 'wordBuilderBestScore':
      return progress.gameStats.wordBuilderBestScore >= condition.score
    case 'completedLessons':
      return progress.completedLessons.length >= condition.count
    case 'completedLevel':
      return hasCompletedLevel(progress, condition.level)
    case 'allLessons':
      return (
        lessons.length > 0 &&
        progress.completedLessons.length >= lessons.length
      )
    case 'usedAiTutor':
      return progress.specialStats.usedAiTutor
    case 'studiedOnWeekend':
      return progress.specialStats.studiedOnWeekend
    case 'studiedAfter23':
      return progress.specialStats.studiedAfter23
  }
}

export function checkAchievements(progress: UserProgress): string[] {
  const unlocked = new Set(
    progress.unlockedAchievements.map((achievement) => achievement.id),
  )

  return achievements
    .filter(
      (achievement) =>
        !unlocked.has(achievement.id) &&
        isConditionMet(achievement.condition, progress),
    )
    .map((achievement) => achievement.id)
}

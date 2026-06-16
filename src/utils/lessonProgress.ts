import {
  getLessonsByLevel,
  lessonLevels,
  lessons,
  type LessonLevelInfo,
} from '../data/lessons'
import type { ProgressState } from '../hooks/useProgress'
import type { Lesson, LessonLevel } from '../types/lesson'

export function completedLessonCount(
  progress: ProgressState,
  level: LessonLevel,
): number {
  const completed = new Set(progress.completedLessons)
  return getLessonsByLevel(level).filter((lesson) => completed.has(lesson.id))
    .length
}

export function isLevelComplete(
  progress: ProgressState,
  level: LessonLevel,
): boolean {
  return completedLessonCount(progress, level) === getLessonsByLevel(level).length
}

export function previousLevel(level: LessonLevel): LessonLevelInfo | undefined {
  const index = lessonLevels.findIndex((item) => item.id === level)
  return index > 0 ? lessonLevels[index - 1] : undefined
}

export function isLevelUnlocked(
  progress: ProgressState,
  level: LessonLevel,
): boolean {
  const previous = previousLevel(level)
  return !previous || isLevelComplete(progress, previous.id)
}

export function isLessonUnlocked(
  progress: ProgressState,
  lesson: Lesson,
): boolean {
  if (progress.completedLessons.includes(lesson.id)) return true
  if (!isLevelUnlocked(progress, lesson.level)) return false
  if (lesson.order === 1) return true

  const previousLesson = getLessonsByLevel(lesson.level).find(
    (item) => item.order === lesson.order - 1,
  )
  return Boolean(
    previousLesson && progress.completedLessons.includes(previousLesson.id),
  )
}

export function nextAvailableLesson(progress: ProgressState): Lesson | undefined {
  return lessons
    .slice()
    .sort((a, b) => {
      const levelA = lessonLevels.findIndex((level) => level.id === a.level)
      const levelB = lessonLevels.findIndex((level) => level.id === b.level)
      return levelA - levelB || a.order - b.order
    })
    .find(
      (lesson) =>
        !progress.completedLessons.includes(lesson.id) &&
        isLessonUnlocked(progress, lesson),
    )
}


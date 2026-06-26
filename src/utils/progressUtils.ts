import type {
  OverallStats,
  ProgressState,
  QuizStats,
  WordProgress,
} from '../types'

const DAY_MS = 86_400_000

export function createEmptyQuizStats(): QuizStats {
  return {
    totalQuizzes: 0,
    quizPercentSum: 0,
  }
}

export function createEmptyState(): ProgressState {
  return {
    words: {},
    idiomProgress: {},
    phrasalVerbProgress: {},
    stats: {
      ...createEmptyQuizStats(),
      streak: 0,
    },
    idiomStats: createEmptyQuizStats(),
    phrasalVerbStats: createEmptyQuizStats(),
    completedLessons: [],
    lessonScores: {},
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function toNonNegativeInteger(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0
  return Math.max(0, Math.trunc(value))
}

function toNonNegativeNumber(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0
  return Math.max(0, value)
}

function normalizeTimestamp(value: unknown): string | undefined {
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) {
    return undefined
  }

  return value
}

function normalizeDateKey(value: unknown): string | undefined {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return undefined
  }

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))

  const isValid =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day

  return isValid ? value : undefined
}

function normalizeWordProgress(value: Record<string, unknown>): WordProgress {
  const progress: WordProgress = {
    correct: toNonNegativeInteger(value.correct),
    incorrect: toNonNegativeInteger(value.incorrect),
  }

  if (value.status === 'known' || value.status === 'learning') {
    progress.status = value.status
  }

  const lastReviewed = normalizeTimestamp(value.lastReviewed)
  if (lastReviewed) {
    progress.lastReviewed = lastReviewed
  }

  return progress
}

function normalizeQuizStats(value: Record<string, unknown>): QuizStats {
  return {
    totalQuizzes: toNonNegativeInteger(value.totalQuizzes),
    quizPercentSum: toNonNegativeNumber(value.quizPercentSum),
  }
}

function normalizeProgressCollection(value: unknown): Record<string, WordProgress> {
  const collection: Record<string, WordProgress> = {}
  const rawCollection = isRecord(value) ? value : {}

  for (const [rawId, rawProgress] of Object.entries(rawCollection)) {
    const id = rawId.trim()

    if (!id || !isRecord(rawProgress)) continue

    collection[id] = normalizeWordProgress(rawProgress)
  }

  return collection
}

function normalizeState(value: unknown): ProgressState {
  if (!isRecord(value)) {
    return createEmptyState()
  }

  const rawStats = isRecord(value.stats) ? value.stats : {}

  const stats: OverallStats = {
    ...normalizeQuizStats(rawStats),
    streak: toNonNegativeInteger(rawStats.streak),
  }

  const lastActiveDate = normalizeDateKey(rawStats.lastActiveDate)
  if (lastActiveDate) {
    stats.lastActiveDate = lastActiveDate
  }

  const completedLessons = Array.isArray(value.completedLessons)
    ? Array.from(
      new Set(
        value.completedLessons
          .filter((lessonId): lessonId is string => typeof lessonId === 'string')
          .map((lessonId) => lessonId.trim())
          .filter(Boolean),
      ),
    )
    : []

  const lessonScores: Record<string, number> = {}
  const rawLessonScores = isRecord(value.lessonScores) ? value.lessonScores : {}

  for (const [rawId, rawScore] of Object.entries(rawLessonScores)) {
    const id = rawId.trim()

    if (!id || typeof rawScore !== 'number' || !Number.isFinite(rawScore)) {
      continue
    }

    lessonScores[id] = Math.max(0, rawScore)
  }

  return {
    words: normalizeProgressCollection(value.words),
    idiomProgress: normalizeProgressCollection(value.idiomProgress),
    phrasalVerbProgress: normalizeProgressCollection(value.phrasalVerbProgress),
    stats,
    idiomStats: normalizeQuizStats(isRecord(value.idiomStats) ? value.idiomStats : {}),
    phrasalVerbStats: normalizeQuizStats(
      isRecord(value.phrasalVerbStats) ? value.phrasalVerbStats : {},
    ),
    completedLessons,
    lessonScores,
  }
}

export function parseStoredState(raw: string | null): ProgressState {
  if (!raw) return createEmptyState()

  try {
    return normalizeState(JSON.parse(raw))
  } catch {
    return createEmptyState()
  }
}

export function dateKey(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function dateKeyToUtcMs(key: string): number {
  const [year, month, day] = key.split('-').map(Number)

  return Date.UTC(year, month - 1, day)
}

export function diffDays(fromKey: string, toKey: string): number {
  return Math.round((dateKeyToUtcMs(toKey) - dateKeyToUtcMs(fromKey)) / DAY_MS)
}

export function applyActivity(stats: OverallStats): OverallStats {
  const today = dateKey()

  if (stats.lastActiveDate === today) {
    return stats
  }

  const streak =
    stats.lastActiveDate && diffDays(stats.lastActiveDate, today) === 1
      ? Math.max(1, stats.streak + 1)
      : 1

  return {
    ...stats,
    streak,
    lastActiveDate: today,
  }
}

export function getTrackedProgress(
  collection: Record<string, WordProgress>,
  itemId: string,
): WordProgress {
  return collection[itemId] ?? { correct: 0, incorrect: 0 }
}

export function applyQuizAnswers(
  collection: Record<string, WordProgress>,
  answers: Array<{ id: string; correct: boolean }>,
) {
  const nextCollection = { ...collection }
  const now = new Date().toISOString()

  let correctCount = 0
  let answeredCount = 0

  for (const answer of answers) {
    const id = answer.id.trim()

    if (!id) continue

    const previous = getTrackedProgress(nextCollection, id)
    const isCorrect = answer.correct === true

    nextCollection[id] = {
      ...previous,
      correct: previous.correct + (isCorrect ? 1 : 0),
      incorrect: previous.incorrect + (isCorrect ? 0 : 1),
      lastReviewed: now,
    }

    if (isCorrect) {
      correctCount += 1
    }

    answeredCount += 1
  }

  return {
    nextCollection,
    correctCount,
    answeredCount,
  }
}

export function countKnown(collection: Record<string, WordProgress>): number {
  return Object.values(collection).filter((item) => item.status === 'known').length
}

export function countKnownIds(
  collection: Record<string, WordProgress>,
  itemIds: string[],
): number {
  return itemIds.reduce((count, id) => {
    return count + (collection[id]?.status === 'known' ? 1 : 0)
  }, 0)
}

export function averageFromStats(stats: QuizStats): number {
  if (stats.totalQuizzes === 0) return 0

  return Math.round(stats.quizPercentSum / stats.totalQuizzes)
}

export function buildDifficultEntries(
  collection: Record<string, WordProgress>,
  limit = 5,
) {
  const safeLimit = Number.isFinite(limit)
    ? Math.max(0, Math.trunc(limit))
    : Number.MAX_SAFE_INTEGER

  return Object.entries(collection)
    .map(([id, item]) => {
      const attempts = item.correct + item.incorrect

      return {
        id,
        correct: item.correct,
        incorrect: item.incorrect,
        percent: attempts > 0 ? Math.round((item.correct / attempts) * 100) : 0,
        attempts,
      }
    })
    .filter((item) => item.attempts > 0)
    .sort((a, b) => {
      return (
        a.percent - b.percent ||
        b.incorrect - a.incorrect ||
        b.attempts - a.attempts
      )
    })
    .slice(0, safeLimit)
}

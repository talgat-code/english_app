import { useSyncExternalStore } from 'react'
import type { Word } from '../data/words'

const STORAGE_KEY = 'english-app:progress:v1'
const DAY_MS = 86_400_000

export type WordStatus = 'known' | 'learning'

export interface WordProgress {
  status?: WordStatus
  correct: number
  incorrect: number
  lastReviewed?: string
}

export interface OverallStats {
  totalQuizzes: number
  quizPercentSum: number
  streak: number
  lastActiveDate?: string
}

export interface ProgressState {
  words: Record<string, WordProgress>
  stats: OverallStats
  completedLessons: string[]
  lessonScores: Record<string, number>
}

export interface QuizAnswer {
  wordId: string
  correct: boolean
}

export interface DifficultWord {
  wordId: string
  correct: number
  incorrect: number
  percent: number
}

function createEmptyState(): ProgressState {
  return {
    words: {},
    stats: {
      totalQuizzes: 0,
      quizPercentSum: 0,
      streak: 0,
    },
    completedLessons: [],
    lessonScores: {},
  }
}

/**
 * Stable server-side snapshot for SSR/hydration.
 * On Vite this is mostly a safety measure, but it prevents SSR crashes too.
 */
const serverSnapshot = createEmptyState()

function canUseBrowserStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
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

function normalizeState(value: unknown): ProgressState {
  if (!isRecord(value)) {
    return createEmptyState()
  }

  const words: Record<string, WordProgress> = {}
  const rawWords = isRecord(value.words) ? value.words : {}

  for (const [rawId, rawProgress] of Object.entries(rawWords)) {
    const id = rawId.trim()

    if (!id || !isRecord(rawProgress)) continue

    words[id] = normalizeWordProgress(rawProgress)
  }

  const rawStats = isRecord(value.stats) ? value.stats : {}

  const stats: OverallStats = {
    totalQuizzes: toNonNegativeInteger(rawStats.totalQuizzes),
    quizPercentSum: toNonNegativeNumber(rawStats.quizPercentSum),
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
    words,
    stats,
    completedLessons,
    lessonScores,
  }
}

function parseStoredState(raw: string | null): ProgressState {
  if (!raw) return createEmptyState()

  try {
    return normalizeState(JSON.parse(raw))
  } catch {
    return createEmptyState()
  }
}

function loadState(): ProgressState {
  if (!canUseBrowserStorage()) {
    return createEmptyState()
  }

  try {
    return parseStoredState(window.localStorage.getItem(STORAGE_KEY))
  } catch {
    return createEmptyState()
  }
}

// --- date helpers ------------------------------------------------------------

function dateKey(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function dateKeyToUtcMs(key: string): number {
  const [year, month, day] = key.split('-').map(Number)

  return Date.UTC(year, month - 1, day)
}

function diffDays(fromKey: string, toKey: string): number {
  return Math.round((dateKeyToUtcMs(toKey) - dateKeyToUtcMs(fromKey)) / DAY_MS)
}

// --- shared store ------------------------------------------------------------

let state: ProgressState = loadState()
const listeners = new Set<() => void>()

function persist() {
  if (!canUseBrowserStorage()) return

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Private mode, blocked storage or quota exceeded.
    // The app still works during the current browser session.
  }
}

function notify() {
  for (const listener of listeners) {
    listener()
  }
}

function commit(nextState: ProgressState, shouldPersist = true) {
  if (nextState === state) return

  state = nextState

  if (shouldPersist) {
    persist()
  }

  notify()
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot(): ProgressState {
  return state
}

function getServerSnapshot(): ProgressState {
  return serverSnapshot
}

/**
 * Synchronize progress when the user changes it in another browser tab.
 */
if (canUseBrowserStorage()) {
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return

    try {
      if (event.storageArea !== window.localStorage) return

      commit(parseStoredState(event.newValue), false)
    } catch {
      // Ignore inaccessible storage.
    }
  })
}

// --- state helpers -----------------------------------------------------------

function applyActivity(stats: OverallStats): OverallStats {
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

function getWordProgress(
  words: Record<string, WordProgress>,
  wordId: string,
): WordProgress {
  return words[wordId] ?? { correct: 0, incorrect: 0 }
}

// --- actions -----------------------------------------------------------------

export function markWord(wordId: string, status: WordStatus) {
  const id = wordId.trim()

  if (!id) return

  const previous = getWordProgress(state.words, id)

  commit({
    ...state,
    words: {
      ...state.words,
      [id]: {
        ...previous,
        status,
        lastReviewed: new Date().toISOString(),
      },
    },
    stats: applyActivity(state.stats),
  })
}

export function recordCardsViewed() {
  const stats = applyActivity(state.stats)

  // Do not rewrite localStorage and rerender components unnecessarily
  // when activity has already been recorded today.
  if (stats === state.stats) return

  commit({
    ...state,
    stats,
  })
}

export function recordQuizResult(answers: QuizAnswer[]) {
  const words = { ...state.words }
  const now = new Date().toISOString()

  let correctCount = 0
  let answeredCount = 0

  for (const answer of answers) {
    const wordId = answer.wordId?.trim()

    if (!wordId) continue

    const previous = getWordProgress(words, wordId)
    const isCorrect = answer.correct === true

    words[wordId] = {
      ...previous,
      correct: previous.correct + (isCorrect ? 1 : 0),
      incorrect: previous.incorrect + (isCorrect ? 0 : 1),
      lastReviewed: now,
    }

    if (isCorrect) {
      correctCount++
    }

    answeredCount++
  }

  // Do not count an empty or malformed quiz as a completed quiz.
  if (answeredCount === 0) return

  const percent = Math.round((correctCount / answeredCount) * 100)

  const stats = applyActivity({
    ...state.stats,
    totalQuizzes: state.stats.totalQuizzes + 1,
    quizPercentSum: state.stats.quizPercentSum + percent,
  })

  commit({
    ...state,
    words,
    stats,
  })
}

export function completeLesson(
  lessonId: string,
  score: number,
  vocabulary: Word[],
) {
  const id = lessonId.trim()

  if (!id) return

  const words = { ...state.words }
  const now = new Date().toISOString()

  for (const word of vocabulary) {
    const wordId = word.id?.trim()

    if (!wordId) continue

    const previous = getWordProgress(words, wordId)

    words[wordId] = {
      ...previous,
      status: previous.status ?? 'learning',
      lastReviewed: previous.lastReviewed ?? now,
    }
  }

  const normalizedScore =
    typeof score === 'number' && Number.isFinite(score) ? Math.max(0, score) : 0

  commit({
    ...state,
    words,
    stats: applyActivity(state.stats),
    completedLessons: state.completedLessons.includes(id)
      ? state.completedLessons
      : [...state.completedLessons, id],
    lessonScores: {
      ...state.lessonScores,
      [id]: Math.max(state.lessonScores[id] ?? 0, normalizedScore),
    },
  })
}

// --- selectors ---------------------------------------------------------------

export function averageScore(progress: ProgressState): number {
  const { totalQuizzes, quizPercentSum } = progress.stats

  if (totalQuizzes === 0) return 0

  return Math.round(quizPercentSum / totalQuizzes)
}

export function knownWordsCount(progress: ProgressState): number {
  return Object.values(progress.words).filter(
    (word) => word.status === 'known',
  ).length
}

export function knownInCategory(
  progress: ProgressState,
  wordIds: string[],
): number {
  return wordIds.reduce((count, id) => {
    return count + (progress.words[id]?.status === 'known' ? 1 : 0)
  }, 0)
}

export function difficultWords(
  progress: ProgressState,
  limit = 5,
): DifficultWord[] {
  const safeLimit = Number.isFinite(limit)
    ? Math.max(0, Math.trunc(limit))
    : Number.MAX_SAFE_INTEGER

  return Object.entries(progress.words)
    .map(([wordId, word]) => {
      const attempts = word.correct + word.incorrect

      return {
        wordId,
        correct: word.correct,
        incorrect: word.incorrect,
        percent: attempts > 0 ? Math.round((word.correct / attempts) * 100) : 0,
        attempts,
      }
    })
    .filter((word) => word.attempts > 0)
    .sort((a, b) => {
      return (
        a.percent - b.percent ||
        b.incorrect - a.incorrect ||
        b.attempts - a.attempts
      )
    })
    .slice(0, safeLimit)
    .map(({ attempts: _attempts, ...word }) => word)
}

export function reviewWords(progress: ProgressState): DifficultWord[] {
  return difficultWords(progress, Number.MAX_SAFE_INTEGER).filter(
    (word) => word.percent < 60,
  )
}

export function isStreakInterrupted(progress: ProgressState): boolean {
  const { streak, lastActiveDate } = progress.stats

  return Boolean(
    streak > 0 &&
    lastActiveDate &&
    diffDays(lastActiveDate, dateKey()) > 1,
  )
}

// --- hook --------------------------------------------------------------------

export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
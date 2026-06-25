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

export interface QuizStats {
  totalQuizzes: number
  quizPercentSum: number
}

export interface OverallStats extends QuizStats {
  streak: number
  lastActiveDate?: string
}

export interface ProgressState {
  words: Record<string, WordProgress>
  idiomProgress: Record<string, WordProgress>
  phrasalVerbProgress: Record<string, WordProgress>
  stats: OverallStats
  idiomStats: QuizStats
  phrasalVerbStats: QuizStats
  completedLessons: string[]
  lessonScores: Record<string, number>
}

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

function createEmptyQuizStats(): QuizStats {
  return {
    totalQuizzes: 0,
    quizPercentSum: 0,
  }
}

function createEmptyState(): ProgressState {
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

function normalizeQuizStats(value: Record<string, unknown>): QuizStats {
  return {
    totalQuizzes: toNonNegativeInteger(value.totalQuizzes),
    quizPercentSum: toNonNegativeNumber(value.quizPercentSum),
  }
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

  const idiomProgress: Record<string, WordProgress> = {}
  const rawIdiomProgress = isRecord(value.idiomProgress) ? value.idiomProgress : {}

  for (const [rawId, rawProgress] of Object.entries(rawIdiomProgress)) {
    const id = rawId.trim()

    if (!id || !isRecord(rawProgress)) continue

    idiomProgress[id] = normalizeWordProgress(rawProgress)
  }

  const phrasalVerbProgress: Record<string, WordProgress> = {}
  const rawPhrasalVerbProgress = isRecord(value.phrasalVerbProgress)
    ? value.phrasalVerbProgress
    : {}

  for (const [rawId, rawProgress] of Object.entries(rawPhrasalVerbProgress)) {
    const id = rawId.trim()

    if (!id || !isRecord(rawProgress)) continue

    phrasalVerbProgress[id] = normalizeWordProgress(rawProgress)
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

  const rawIdiomStats = isRecord(value.idiomStats) ? value.idiomStats : {}
  const idiomStats = normalizeQuizStats(rawIdiomStats)

  const rawPhrasalVerbStats = isRecord(value.phrasalVerbStats)
    ? value.phrasalVerbStats
    : {}
  const phrasalVerbStats = normalizeQuizStats(rawPhrasalVerbStats)

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
    idiomProgress,
    phrasalVerbProgress,
    stats,
    idiomStats,
    phrasalVerbStats,
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

function getTrackedProgress(
  collection: Record<string, WordProgress>,
  itemId: string,
): WordProgress {
  return collection[itemId] ?? { correct: 0, incorrect: 0 }
}

function markTrackedItem(
  collectionKey: 'words' | 'idiomProgress' | 'phrasalVerbProgress',
  itemId: string,
  status: WordStatus,
) {
  const id = itemId.trim()

  if (!id) return

  const collection = state[collectionKey]
  const previous = getTrackedProgress(collection, id)

  commit({
    ...state,
    [collectionKey]: {
      ...collection,
      [id]: {
        ...previous,
        status,
        lastReviewed: new Date().toISOString(),
      },
    },
    stats: applyActivity(state.stats),
  })
}

function applyQuizAnswers(
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

function countKnown(collection: Record<string, WordProgress>): number {
  return Object.values(collection).filter((item) => item.status === 'known').length
}

function countKnownIds(
  collection: Record<string, WordProgress>,
  itemIds: string[],
): number {
  return itemIds.reduce((count, id) => {
    return count + (collection[id]?.status === 'known' ? 1 : 0)
  }, 0)
}

function averageFromStats(stats: QuizStats): number {
  if (stats.totalQuizzes === 0) return 0

  return Math.round(stats.quizPercentSum / stats.totalQuizzes)
}

function buildDifficultEntries(
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

// --- actions -----------------------------------------------------------------

export function markWord(wordId: string, status: WordStatus) {
  markTrackedItem('words', wordId, status)
}

export function markIdiom(idiomId: string, status: WordStatus) {
  markTrackedItem('idiomProgress', idiomId, status)
}

export function markPhrasalVerb(phrasalVerbId: string, status: WordStatus) {
  markTrackedItem('phrasalVerbProgress', phrasalVerbId, status)
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
  const { nextCollection, correctCount, answeredCount } = applyQuizAnswers(
    state.words,
    answers.map((answer) => ({
      id: answer.wordId,
      correct: answer.correct,
    })),
  )

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
    words: nextCollection,
    stats,
  })
}

export function recordIdiomQuizResult(answers: IdiomQuizAnswer[]) {
  const { nextCollection, correctCount, answeredCount } = applyQuizAnswers(
    state.idiomProgress,
    answers.map((answer) => ({
      id: answer.idiomId,
      correct: answer.correct,
    })),
  )

  if (answeredCount === 0) return

  const percent = Math.round((correctCount / answeredCount) * 100)

  commit({
    ...state,
    idiomProgress: nextCollection,
    idiomStats: {
      totalQuizzes: state.idiomStats.totalQuizzes + 1,
      quizPercentSum: state.idiomStats.quizPercentSum + percent,
    },
    stats: applyActivity(state.stats),
  })
}

export function recordPhrasalVerbQuizResult(answers: PhrasalVerbQuizAnswer[]) {
  const { nextCollection, correctCount, answeredCount } = applyQuizAnswers(
    state.phrasalVerbProgress,
    answers.map((answer) => ({
      id: answer.phrasalVerbId,
      correct: answer.correct,
    })),
  )

  if (answeredCount === 0) return

  const percent = Math.round((correctCount / answeredCount) * 100)

  commit({
    ...state,
    phrasalVerbProgress: nextCollection,
    phrasalVerbStats: {
      totalQuizzes: state.phrasalVerbStats.totalQuizzes + 1,
      quizPercentSum: state.phrasalVerbStats.quizPercentSum + percent,
    },
    stats: applyActivity(state.stats),
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

    const previous = getTrackedProgress(words, wordId)

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
  return averageFromStats(progress.stats)
}

export function averageIdiomScore(progress: ProgressState): number {
  return averageFromStats(progress.idiomStats)
}

export function averagePhrasalVerbScore(progress: ProgressState): number {
  return averageFromStats(progress.phrasalVerbStats)
}

export function knownWordsCount(progress: ProgressState): number {
  return countKnown(progress.words)
}

export function knownIdiomsCount(progress: ProgressState): number {
  return countKnown(progress.idiomProgress)
}

export function knownPhrasalVerbsCount(progress: ProgressState): number {
  return countKnown(progress.phrasalVerbProgress)
}

export function knownInCategory(
  progress: ProgressState,
  wordIds: string[],
): number {
  return countKnownIds(progress.words, wordIds)
}

export function knownInIdiomCategory(
  progress: ProgressState,
  idiomIds: string[],
): number {
  return countKnownIds(progress.idiomProgress, idiomIds)
}

export function knownInPhrasalVerbCategory(
  progress: ProgressState,
  phrasalVerbIds: string[],
): number {
  return countKnownIds(progress.phrasalVerbProgress, phrasalVerbIds)
}

export function difficultWords(
  progress: ProgressState,
  limit = 5,
): DifficultWord[] {
  return buildDifficultEntries(progress.words, limit).map(
    (word) => ({
      wordId: word.id,
      correct: word.correct,
      incorrect: word.incorrect,
      percent: word.percent,
    }),
  )
}

export function difficultIdioms(
  progress: ProgressState,
  limit = 5,
): DifficultIdiom[] {
  return buildDifficultEntries(progress.idiomProgress, limit).map(
    (idiom) => ({
      idiomId: idiom.id,
      correct: idiom.correct,
      incorrect: idiom.incorrect,
      percent: idiom.percent,
    }),
  )
}

export function difficultPhrasalVerbs(
  progress: ProgressState,
  limit = 5,
): DifficultPhrasalVerb[] {
  return buildDifficultEntries(progress.phrasalVerbProgress, limit).map(
    (phrasalVerb) => ({
      phrasalVerbId: phrasalVerb.id,
      correct: phrasalVerb.correct,
      incorrect: phrasalVerb.incorrect,
      percent: phrasalVerb.percent,
    }),
  )
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

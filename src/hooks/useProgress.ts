import { useSyncExternalStore } from 'react'
import type { Word } from '../data/words'

/**
 * Persistent learning progress, backed by localStorage.
 *
 * A single module-level store is shared across the whole app via
 * `useSyncExternalStore`, so flashcards, quiz, categories and the stats
 * screen all read and write the same state and stay in sync. Every mutation
 * is immediately written to localStorage, so progress survives reloads and
 * new browser sessions.
 */

const STORAGE_KEY = 'english-app:progress:v1'

export type WordStatus = 'known' | 'learning'

export interface WordProgress {
  /** Self-assessment from flashcards ("Знаю" / "Учу"). */
  status?: WordStatus
  /** How many times answered correctly in quizzes. */
  correct: number
  /** How many times answered incorrectly in quizzes. */
  incorrect: number
  /** ISO timestamp of the last time this word was reviewed. */
  lastReviewed?: string
}

export interface OverallStats {
  /** Total number of completed quiz rounds. */
  totalQuizzes: number
  /** Sum of per-round percentages — used to derive the average. */
  quizPercentSum: number
  /** Consecutive days with at least one study activity. */
  streak: number
  /** Local date (YYYY-MM-DD) of the last study activity. */
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

const emptyState: ProgressState = {
  words: {},
  stats: { totalQuizzes: 0, quizPercentSum: 0, streak: 0 },
  completedLessons: [],
  lessonScores: {},
}

// --- date helpers ------------------------------------------------------------

/** Local calendar date as YYYY-MM-DD (not UTC, so streaks match the user's day). */
function dateKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Whole-day difference between two YYYY-MM-DD keys (toKey - fromKey). */
function diffDays(fromKey: string, toKey: string): number {
  const a = new Date(`${fromKey}T00:00:00`).getTime()
  const b = new Date(`${toKey}T00:00:00`).getTime()
  return Math.round((b - a) / 86_400_000)
}

// --- store -------------------------------------------------------------------

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState
    const parsed = JSON.parse(raw) as Partial<ProgressState>
    return {
      words: parsed.words ?? {},
      stats: { ...emptyState.stats, ...parsed.stats },
      completedLessons: Array.isArray(parsed.completedLessons)
        ? parsed.completedLessons
        : [],
      lessonScores: parsed.lessonScores ?? {},
    }
  } catch {
    return emptyState
  }
}

let state: ProgressState = load()
const listeners = new Set<() => void>()

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage may be unavailable (private mode, quota); progress stays in
    // memory for the session so the UI still works.
  }
}

function setState(next: ProgressState) {
  state = next
  persist()
  for (const listener of listeners) listener()
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

/**
 * Update the streak for an activity happening "now":
 *   - same day as last activity → unchanged
 *   - the day after → streak + 1
 *   - any longer gap → reset to 1
 */
function applyActivity(stats: OverallStats): OverallStats {
  const today = dateKey()
  if (stats.lastActiveDate === today) return stats

  let streak = 1
  if (stats.lastActiveDate && diffDays(stats.lastActiveDate, today) === 1) {
    streak = stats.streak + 1
  }
  return { ...stats, streak, lastActiveDate: today }
}

function wordOrDefault(id: string): WordProgress {
  return state.words[id] ?? { correct: 0, incorrect: 0 }
}

// --- actions (callable from anywhere, no hook required) ----------------------

/** Record a flashcard self-assessment for a word. Counts as a study activity. */
export function markWord(id: string, status: WordStatus) {
  const prev = wordOrDefault(id)
  setState({
    ...state,
    words: {
      ...state.words,
      [id]: { ...prev, status, lastReviewed: new Date().toISOString() },
    },
    stats: applyActivity(state.stats),
  })
}

/** Record that the user viewed flashcards (keeps the daily streak alive). */
export function recordCardsViewed() {
  setState({ ...state, stats: applyActivity(state.stats) })
}

/** Record the result of one completed quiz round. */
export function recordQuizResult(answers: QuizAnswer[]) {
  const words = { ...state.words }
  let correctCount = 0
  const now = new Date().toISOString()

  for (const answer of answers) {
    const prev = words[answer.wordId] ?? { correct: 0, incorrect: 0 }
    words[answer.wordId] = {
      ...prev,
      correct: prev.correct + (answer.correct ? 1 : 0),
      incorrect: prev.incorrect + (answer.correct ? 0 : 1),
      lastReviewed: now,
    }
    if (answer.correct) correctCount++
  }

  const percent = answers.length ? (correctCount / answers.length) * 100 : 0
  const stats = applyActivity({
    ...state.stats,
    totalQuizzes: state.stats.totalQuizzes + 1,
    quizPercentSum: state.stats.quizPercentSum + percent,
  })

  setState({ ...state, words, stats })
}

/** Mark a lesson as finished and add its vocabulary to the tracked dictionary. */
export function completeLesson(lessonId: string, score: number, vocabulary: Word[]) {
  const now = new Date().toISOString()
  const words = { ...state.words }

  for (const word of vocabulary) {
    const prev = words[word.id] ?? { correct: 0, incorrect: 0 }
    words[word.id] = {
      ...prev,
      status: prev.status ?? 'learning',
      lastReviewed: prev.lastReviewed ?? now,
    }
  }

  setState({
    ...state,
    words,
    stats: applyActivity(state.stats),
    completedLessons: state.completedLessons.includes(lessonId)
      ? state.completedLessons
      : [...state.completedLessons, lessonId],
    lessonScores: {
      ...state.lessonScores,
      [lessonId]: Math.max(state.lessonScores[lessonId] ?? 0, score),
    },
  })
}

// --- selectors ---------------------------------------------------------------

/** Average percentage of correct answers across all quiz rounds (0–100). */
export function averageScore(state: ProgressState): number {
  const { totalQuizzes, quizPercentSum } = state.stats
  return totalQuizzes > 0 ? Math.round(quizPercentSum / totalQuizzes) : 0
}

/** Number of words the user marked as "known". */
export function knownWordsCount(state: ProgressState): number {
  return Object.values(state.words).filter((w) => w.status === 'known').length
}

/** Known-word count for a specific set of word ids (e.g. one category). */
export function knownInCategory(state: ProgressState, ids: string[]): number {
  return ids.reduce(
    (count, id) => count + (state.words[id]?.status === 'known' ? 1 : 0),
    0,
  )
}

export interface DifficultWord {
  wordId: string
  correct: number
  incorrect: number
  /** Accuracy as a percentage (0–100). */
  percent: number
}

/**
 * Words the user struggles with most: lowest quiz accuracy first, limited to
 * `limit`. Only words answered at least once in a quiz are considered.
 */
export function difficultWords(
  state: ProgressState,
  limit = 5,
): DifficultWord[] {
  return Object.entries(state.words)
    .map(([wordId, w]) => {
      const attempts = w.correct + w.incorrect
      return {
        wordId,
        correct: w.correct,
        incorrect: w.incorrect,
        percent: attempts > 0 ? Math.round((w.correct / attempts) * 100) : 0,
        attempts,
      }
    })
    .filter((w) => w.attempts > 0)
    .sort((a, b) => a.percent - b.percent || b.incorrect - a.incorrect)
    .slice(0, limit)
}

/** All quiz-tested words with less than 60% correct answers. */
export function reviewWords(state: ProgressState): DifficultWord[] {
  return difficultWords(state, Number.MAX_SAFE_INTEGER).filter(
    (word) => word.correct / (word.correct + word.incorrect) < 0.6,
  )
}

/** Whether the user had a streak but missed yesterday. */
export function isStreakInterrupted(state: ProgressState): boolean {
  const { lastActiveDate } = state.stats
  return Boolean(lastActiveDate && diffDays(lastActiveDate, dateKey()) > 1)
}

// --- hook --------------------------------------------------------------------

/** Subscribe a component to the shared progress state. */
export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

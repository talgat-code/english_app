import { useSyncExternalStore } from 'react'
import type {
  DifficultIdiom,
  DifficultPhrasalVerb,
  DifficultWord,
  IdiomQuizAnswer,
  PhrasalVerbQuizAnswer,
  ProgressState,
  QuizMilestones,
  QuizAnswer,
  SpecialStats,
  Word,
  WordStatus,
} from '../types'
import { checkAchievements } from '../utils/achievementChecker'
import {
  applyActivity,
  applyQuizAnswers,
  averageFromStats,
  buildDifficultEntries,
  countKnown,
  countKnownIds,
  createEmptyState,
  dateKey,
  diffDays,
  getTrackedProgress,
  parseStoredState,
} from '../utils/progressUtils'

export type {
  DifficultIdiom,
  DifficultPhrasalVerb,
  DifficultWord,
  GameStats,
  IdiomQuizAnswer,
  OverallStats,
  PhrasalVerbQuizAnswer,
  ProgressState,
  QuizMilestones,
  QuizAnswer,
  QuizStats,
  SpecialStats,
  UnlockedAchievement,
  UserProgress,
  WordProgress,
  WordStatus,
} from '../types'

const STORAGE_KEY = 'english-app:progress:v1'

/**
 * Stable server-side snapshot for SSR/hydration.
 * On Vite this is mostly a safety measure, but it prevents SSR crashes too.
 */
const serverSnapshot = createEmptyState()

function canUseBrowserStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
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

// --- shared store ------------------------------------------------------------

let state: ProgressState = loadState()
const listeners = new Set<() => void>()
const achievementListeners = new Set<(achievementIds: string[]) => void>()

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

function notifyAchievements(achievementIds: string[]) {
  if (achievementIds.length === 0) return

  for (const listener of achievementListeners) {
    listener(achievementIds)
  }
}

function withUnlockedAchievements(nextState: ProgressState): {
  nextState: ProgressState
  achievementIds: string[]
} {
  const achievementIds = checkAchievements(nextState)

  if (achievementIds.length === 0) {
    return { nextState, achievementIds }
  }

  const unlockedAt = new Date().toISOString()

  return {
    nextState: {
      ...nextState,
      unlockedAchievements: [
        ...nextState.unlockedAchievements,
        ...achievementIds.map((id) => ({ id, unlockedAt })),
      ],
    },
    achievementIds,
  }
}

function commit(nextState: ProgressState, shouldPersist = true) {
  if (nextState === state) return

  const checked = shouldPersist
    ? withUnlockedAchievements(nextState)
    : { nextState, achievementIds: [] }

  state = checked.nextState

  if (shouldPersist) {
    persist()
  }

  notify()
  notifyAchievements(checked.achievementIds)
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export function subscribeAchievementUnlocks(
  listener: (achievementIds: string[]) => void,
): () => void {
  achievementListeners.add(listener)

  return () => {
    achievementListeners.delete(listener)
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

function applySpecialStudyStats(
  specialStats: SpecialStats,
  date = new Date(),
): SpecialStats {
  const studiedOnWeekend =
    specialStats.studiedOnWeekend || date.getDay() === 0 || date.getDay() === 6
  const studiedAfter23 = specialStats.studiedAfter23 || date.getHours() >= 23

  if (
    studiedOnWeekend === specialStats.studiedOnWeekend &&
    studiedAfter23 === specialStats.studiedAfter23
  ) {
    return specialStats
  }

  return {
    ...specialStats,
    studiedOnWeekend,
    studiedAfter23,
  }
}

function applyStudyActivity(progress: ProgressState): {
  stats: ProgressState['stats']
  specialStats: SpecialStats
} {
  const now = new Date()

  return {
    stats: applyActivity(progress.stats),
    specialStats: applySpecialStudyStats(progress.specialStats, now),
  }
}

function applyQuizMilestones(
  milestones: QuizMilestones,
  percent: number,
): QuizMilestones {
  const bestPercent = Math.max(milestones.bestPercent, percent)
  const perfectStreak = percent === 100 ? milestones.perfectStreak + 1 : 0

  if (
    bestPercent === milestones.bestPercent &&
    perfectStreak === milestones.perfectStreak
  ) {
    return milestones
  }

  return {
    bestPercent,
    perfectStreak,
  }
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
  const { stats, specialStats } = applyStudyActivity(state)

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
    stats,
    specialStats,
  })
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
  const { stats, specialStats } = applyStudyActivity(state)

  // Do not rewrite localStorage and rerender components unnecessarily
  // when activity has already been recorded today.
  if (stats === state.stats && specialStats === state.specialStats) return

  commit({
    ...state,
    stats,
    specialStats,
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

  const { stats, specialStats } = applyStudyActivity({
    ...state,
    stats: {
      ...state.stats,
      totalQuizzes: state.stats.totalQuizzes + 1,
      quizPercentSum: state.stats.quizPercentSum + percent,
    },
  })

  commit({
    ...state,
    words: nextCollection,
    stats,
    specialStats,
    quizMilestones: applyQuizMilestones(state.quizMilestones, percent),
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
  const { stats, specialStats } = applyStudyActivity(state)

  commit({
    ...state,
    idiomProgress: nextCollection,
    idiomStats: {
      totalQuizzes: state.idiomStats.totalQuizzes + 1,
      quizPercentSum: state.idiomStats.quizPercentSum + percent,
    },
    stats,
    specialStats,
    quizMilestones: applyQuizMilestones(state.quizMilestones, percent),
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
  const { stats, specialStats } = applyStudyActivity(state)

  commit({
    ...state,
    phrasalVerbProgress: nextCollection,
    phrasalVerbStats: {
      totalQuizzes: state.phrasalVerbStats.totalQuizzes + 1,
      quizPercentSum: state.phrasalVerbStats.quizPercentSum + percent,
    },
    stats,
    specialStats,
    quizMilestones: applyQuizMilestones(state.quizMilestones, percent),
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
  const { stats, specialStats } = applyStudyActivity(state)

  commit({
    ...state,
    words,
    stats,
    specialStats,
    completedLessons: state.completedLessons.includes(id)
      ? state.completedLessons
      : [...state.completedLessons, id],
    lessonScores: {
      ...state.lessonScores,
      [id]: Math.max(state.lessonScores[id] ?? 0, normalizedScore),
    },
  })
}

export function recordAITutorUsed() {
  const nextSpecialStats = state.specialStats.usedAiTutor
    ? state.specialStats
    : {
        ...state.specialStats,
        usedAiTutor: true,
      }
  const { stats, specialStats } = applyStudyActivity({
    ...state,
    specialStats: nextSpecialStats,
  })

  if (stats === state.stats && specialStats === state.specialStats) return

  commit({
    ...state,
    stats,
    specialStats,
  })
}

export function recordHangmanWin() {
  const { stats, specialStats } = applyStudyActivity(state)

  commit({
    ...state,
    stats,
    specialStats,
    gameStats: {
      ...state.gameStats,
      hangmanWins: state.gameStats.hangmanWins + 1,
    },
  })
}

export function recordWordBuilderScore(score: number) {
  if (typeof score !== 'number' || !Number.isFinite(score)) return

  const normalizedScore = Math.max(0, Math.trunc(score))
  const nextBestScore = Math.max(
    state.gameStats.wordBuilderBestScore,
    normalizedScore,
  )
  const { stats, specialStats } = applyStudyActivity(state)

  if (
    nextBestScore === state.gameStats.wordBuilderBestScore &&
    stats === state.stats &&
    specialStats === state.specialStats
  ) {
    return
  }

  commit({
    ...state,
    stats,
    specialStats,
    gameStats: {
      ...state.gameStats,
      wordBuilderBestScore: nextBestScore,
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

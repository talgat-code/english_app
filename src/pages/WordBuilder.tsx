import { useState } from 'react'
import { getCategoryById } from '../data/words'
import { buildLetterTiles, playableWords, type LetterTile } from '../utils/games'
import { EmptyGame, GameResult } from './Hangman'

const BEST_SCORE_PREFIX = 'english-app:word-builder-best:'

interface WordBuilderProps {
  categoryId: string
  onOtherCategory: () => void
  onGamesMenu: () => void
}

function loadBestScore(categoryId: string): number {
  try {
    return Number(localStorage.getItem(`${BEST_SCORE_PREFIX}${categoryId}`)) || 0
  } catch {
    return 0
  }
}

function saveBestScore(categoryId: string, score: number) {
  try {
    localStorage.setItem(`${BEST_SCORE_PREFIX}${categoryId}`, String(score))
  } catch {
    // The game still works when storage is unavailable.
  }
}

function WordBuilder({ categoryId, onOtherCategory, onGamesMenu }: WordBuilderProps) {
  const category = getCategoryById(categoryId)
  const [words, setWords] = useState(() => playableWords(categoryId))
  const [index, setIndex] = useState(0)
  const [tiles, setTiles] = useState<LetterTile[]>(() =>
    words[0] ? buildLetterTiles(words[0]) : [],
  )
  const [answerIds, setAnswerIds] = useState<string[]>([])
  const [lockedIds, setLockedIds] = useState<Set<string>>(() => new Set())
  const [hints, setHints] = useState(0)
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(() => loadBestScore(categoryId))
  const [solved, setSolved] = useState(false)
  const [finished, setFinished] = useState(false)
  const [shake, setShake] = useState(0)

  const word = words[index]
  const target = word?.english.toUpperCase() ?? ''
  const answerTiles = answerIds
    .map((id) => tiles.find((tile) => tile.id === id))
    .filter((tile): tile is LetterTile => Boolean(tile))
  const availableTiles = tiles.filter((tile) => !answerIds.includes(tile.id))

  function resetRound(nextWord = word) {
    setTiles(nextWord ? buildLetterTiles(nextWord) : [])
    setAnswerIds([])
    setLockedIds(new Set())
    setHints(0)
    setSolved(false)
    setShake(0)
  }

  function restartSession() {
    const nextWords = playableWords(categoryId)
    setWords(nextWords)
    setIndex(0)
    setScore(0)
    setFinished(false)
    resetRound(nextWords[0])
  }

  function completeIfCorrect(nextIds: string[], usedHints = hints) {
    if (nextIds.length !== target.length) return

    const attempt = nextIds
      .map((id) => tiles.find((tile) => tile.id === id)?.letter ?? '')
      .join('')

    if (attempt === target) {
      const points = 10 - usedHints
      setScore((current) => current + points)
      setSolved(true)
    } else {
      setShake((current) => current + 1)
    }
  }

  function selectTile(id: string) {
    if (solved) return
    const nextIds = [...answerIds, id]
    setAnswerIds(nextIds)
    completeIfCorrect(nextIds)
  }

  function returnTile(id: string) {
    if (solved || lockedIds.has(id)) return
    setAnswerIds((current) => current.filter((answerId) => answerId !== id))
  }

  function clearAnswer() {
    if (solved) return
    setAnswerIds((current) => current.filter((id) => lockedIds.has(id)))
  }

  function useHint() {
    if (solved || hints >= 2) return

    let prefixLength = 0
    while (
      prefixLength < answerTiles.length &&
      answerTiles[prefixLength].letter === target[prefixLength]
    ) {
      prefixLength += 1
    }

    const correctPrefixIds = answerIds.slice(0, prefixLength)
    const nextLetter = target[prefixLength]
    const hintTile = tiles.find(
      (tile) => !correctPrefixIds.includes(tile.id) && tile.letter === nextLetter,
    )
    if (!hintTile) return

    const nextIds = [...correctPrefixIds, hintTile.id]
    setAnswerIds(nextIds)
    setLockedIds(
      new Set([
        ...correctPrefixIds.filter((id) => lockedIds.has(id)),
        hintTile.id,
      ]),
    )
    setHints((current) => current + 1)
    completeIfCorrect(nextIds, hints + 1)
  }

  function nextWord() {
    if (index >= words.length - 1) {
      const nextBest = Math.max(bestScore, score)
      setBestScore(nextBest)
      saveBestScore(categoryId, nextBest)
      setFinished(true)
      return
    }

    const nextIndex = index + 1
    setIndex(nextIndex)
    resetRound(words[nextIndex])
  }

  if (!category || words.length === 0) {
    return (
      <EmptyGame
        message="В этой категории нет подходящих слов для составления."
        onOtherCategory={onOtherCategory}
        onGamesMenu={onGamesMenu}
      />
    )
  }

  if (finished) {
    return (
      <GameResult
        emoji="🔤"
        title="Все слова собраны"
        result={`${score} очков`}
        detail={`Лучший счёт: ${bestScore}`}
        onRestart={restartSession}
        onOtherCategory={onOtherCategory}
        onGamesMenu={onGamesMenu}
      />
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col px-4 py-6">
      <header className="mb-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onGamesMenu}
            className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            ← Игры
          </button>
          <div className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm">
            {score} очков
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm font-medium text-text-tertiary">
            {index + 1} / {words.length}
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary transition-all duration-entrance"
              style={{ width: `${((index + 1) / words.length) * 100}%` }}
            />
          </div>
          <span className="text-lg">{category.emoji}</span>
        </div>
      </header>

      <section className="rounded-3xl border border-border-subtle bg-surface p-5 text-center shadow-sm">
        <p className="text-sm text-text-tertiary">Составь слово</p>
        <p className="mt-2 text-xl font-bold text-text-primary">{word.russian}</p>
        <p className="mt-1 text-sm text-text-tertiary">[{word.transcription}]</p>
      </section>

      <section className="mt-5">
        <div
          key={shake}
          className={`flex min-h-20 flex-wrap items-center justify-center gap-2 rounded-3xl border-2 border-dashed p-3 ${
            solved
              ? 'game-success-pop border-success-border bg-success-soft'
              : shake > 0
                ? 'game-shake border-error-border bg-error-soft'
                : 'border-border bg-surface/70'
          }`}
        >
          {answerTiles.length === 0 && (
            <span className="text-sm text-text-tertiary">Нажимай буквы по порядку</span>
          )}
          {answerTiles.map((tile) => (
            <button
              key={tile.id}
              type="button"
              onClick={() => returnTile(tile.id)}
              disabled={solved || lockedIds.has(tile.id)}
              className={`flex h-12 min-w-11 items-center justify-center rounded-xl border px-3 text-lg font-bold shadow-sm transition-all ${
                solved
                  ? 'border-success bg-success text-white dark:bg-success-button-dark'
                  : lockedIds.has(tile.id)
                    ? 'border-warning-border bg-warning-soft text-warning'
                    : 'border-primary-border bg-primary text-white active:scale-95'
              }`}
            >
              {tile.letter}
            </button>
          ))}
        </div>

        {solved && (
          <p className="game-success-pop mt-4 text-center text-xl font-bold text-success">
            Отлично! +{10 - hints} очков 🎉
          </p>
        )}
      </section>

      <section className="mt-6 flex flex-1 flex-wrap content-start justify-center gap-3">
        {availableTiles.map((tile) => (
          <button
            key={tile.id}
            type="button"
            onClick={() => selectTile(tile.id)}
            disabled={solved}
            className="flex h-12 min-w-11 items-center justify-center rounded-xl border border-border bg-surface px-3 text-lg font-bold text-text-secondary shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-border active:scale-95 disabled:opacity-40"
          >
            {tile.letter}
          </button>
        ))}
      </section>

      <div className="mt-5 flex flex-col gap-2 pb-2">
        {!solved && (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={clearAnswer}
              disabled={answerIds.length === lockedIds.size}
              className="min-h-12 rounded-2xl border border-border bg-surface px-4 font-semibold text-text-secondary transition-all active:scale-[0.98] disabled:opacity-40"
            >
              Очистить
            </button>
            <button
              type="button"
              onClick={useHint}
              disabled={hints >= 2}
              className="min-h-12 rounded-2xl border border-warning-border bg-warning-soft px-4 font-semibold text-warning transition-all active:scale-[0.98] disabled:opacity-40"
            >
              Подсказка 💡 {2 - hints}
            </button>
          </div>
        )}
        {solved && (
          <button
            type="button"
            onClick={nextWord}
            className="min-h-12 rounded-2xl bg-primary px-5 font-semibold text-white transition-all hover:bg-primary-hover active:scale-[0.98]"
          >
            {index === words.length - 1 ? 'Показать результат' : 'Следующее слово'}
          </button>
        )}
      </div>
    </div>
  )
}

export default WordBuilder

import { useState } from 'react'
import { getCategoryById } from '../data/words'
import { playableWords } from '../utils/games'

const ALPHABET = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
const FACES = ['😊', '😐', '😟', '😨', '😰', '😱', '💀']
const MAX_ERRORS = 6
const CONFETTI_COLORS = [
  'var(--color-primary)',
  'var(--color-success)',
  'var(--color-warning)',
  'var(--color-error)',
]
const CONFETTI_PARTICLES = Array.from({ length: 18 }, (_, index) => ({
  id: `confetti-${index}`,
  left: `${(index * 37) % 100}%`,
  animationDelay: `${(index % 6) * 0.08}s`,
  backgroundColor: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
}))

interface HangmanProps {
  categoryId: string
  onOtherCategory: () => void
  onGamesMenu: () => void
}

type RoundStatus = 'playing' | 'won' | 'lost'

function Hangman({ categoryId, onOtherCategory, onGamesMenu }: HangmanProps) {
  const category = getCategoryById(categoryId)
  const [words, setWords] = useState(() => playableWords(categoryId))
  const [index, setIndex] = useState(0)
  const [guesses, setGuesses] = useState<Set<string>>(() => new Set())
  const [status, setStatus] = useState<RoundStatus>('playing')
  const [wins, setWins] = useState(0)
  const [losses, setLosses] = useState(0)
  const [finished, setFinished] = useState(false)

  const word = words[index]
  const answer = word?.english.toUpperCase() ?? ''
  const wrongGuesses = [...guesses].filter((letter) => !answer.includes(letter))
  const errors = wrongGuesses.length

  function resetRound() {
    setGuesses(new Set())
    setStatus('playing')
  }

  function restartSession() {
    setWords(playableWords(categoryId))
    setIndex(0)
    setWins(0)
    setLosses(0)
    setFinished(false)
    resetRound()
  }

  function guessLetter(letter: string) {
    if (status !== 'playing' || guesses.has(letter)) return

    const nextGuesses = new Set(guesses)
    nextGuesses.add(letter)
    setGuesses(nextGuesses)

    const nextErrors = errors + (answer.includes(letter) ? 0 : 1)
    const isWon = [...answer].every((character) => nextGuesses.has(character))

    if (isWon) {
      setStatus('won')
      setWins((current) => current + 1)
    } else if (nextErrors >= MAX_ERRORS) {
      setStatus('lost')
      setLosses((current) => current + 1)
    }
  }

  function retryWord() {
    if (status === 'lost') {
      setLosses((current) => Math.max(0, current - 1))
    }
    resetRound()
  }

  function nextWord() {
    if (index >= words.length - 1) {
      setFinished(true)
      return
    }

    setIndex((current) => current + 1)
    resetRound()
  }

  if (!category || words.length === 0) {
    return (
      <EmptyGame
        message="В этой категории нет подходящих слов для виселицы."
        onOtherCategory={onOtherCategory}
        onGamesMenu={onGamesMenu}
      />
    )
  }

  if (finished) {
    return (
      <GameResult
        emoji="🎯"
        title="Сессия завершена"
        result={`${wins} побед из ${words.length} раундов`}
        detail={`Поражения: ${losses}`}
        onRestart={restartSession}
        onOtherCategory={onOtherCategory}
        onGamesMenu={onGamesMenu}
      />
    )
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden px-4 py-6">
      {status === 'won' && <Confetti />}

      <header className="mb-5">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onGamesMenu}
            className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            ← Игры
          </button>
          <div className="rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
            <span className="text-success">Победы {wins}</span>
            <span className="mx-2 text-text-tertiary">|</span>
            <span className="text-error">Поражения {losses}</span>
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

      <section className="flex flex-1 flex-col items-center text-center">
        <div className="game-success-pop text-7xl" key={`${index}-${errors}`}>
          {FACES[errors]}
        </div>
        <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-text-tertiary">
          Ошибки: {errors} / {MAX_ERRORS}
        </p>

        <div className="mt-6 w-full rounded-3xl border border-border-subtle bg-surface p-5 shadow-sm">
          <p className="text-sm text-text-tertiary">Подсказка</p>
          <p className="mt-1 text-lg font-semibold text-text-primary">{word.russian}</p>

          <div className="mt-7 flex flex-wrap justify-center gap-2">
            {[...answer].map((letter, letterIndex) => (
              <span
                key={`${letter}-${letterIndex}`}
                className={`flex h-12 min-w-9 items-center justify-center border-b-2 text-2xl font-bold transition-all ${
                  guesses.has(letter) || status !== 'playing'
                    ? 'border-primary text-text-primary'
                    : 'border-border-strong text-transparent'
                }`}
              >
                {letter}
              </span>
            ))}
          </div>

          {status !== 'playing' && (
            <div className="game-success-pop mt-6">
              <p
                className={`text-xl font-bold ${
                  status === 'won' ? 'text-success' : 'text-error'
                }`}
              >
                {status === 'won' ? 'Молодец! 🎉' : 'Раунд проигран 💀'}
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                Правильное слово: <strong className="text-text-primary">{answer}</strong>
              </p>
            </div>
          )}
        </div>

        <div className="mt-5 grid w-full grid-cols-6 gap-2">
          {ALPHABET.map((letter) => {
            const guessed = guesses.has(letter)
            const isCorrect = answer.includes(letter)
            return (
              <button
                key={letter}
                type="button"
                onClick={() => guessLetter(letter)}
                disabled={guessed || status !== 'playing'}
                className={`min-h-11 rounded-xl border text-sm font-bold transition-all active:scale-95 ${
                  guessed
                    ? isCorrect
                      ? 'border-success bg-success-soft text-success'
                      : 'border-error bg-error-soft text-error'
                    : 'border-border bg-surface text-text-secondary hover:border-primary-border hover:bg-primary-soft disabled:opacity-50'
                }`}
              >
                {letter}
              </button>
            )
          })}
        </div>

        {status !== 'playing' && (
          <div className="mt-5 flex w-full flex-col gap-2">
            {status === 'lost' && (
              <button
                type="button"
                onClick={retryWord}
                className="min-h-12 rounded-2xl border border-border bg-surface px-5 font-semibold text-text-secondary transition-all active:scale-[0.98]"
              >
                Попробовать снова
              </button>
            )}
            <button
              type="button"
              onClick={nextWord}
              className="min-h-12 rounded-2xl bg-primary px-5 font-semibold text-white transition-all hover:bg-primary-hover active:scale-[0.98]"
            >
              {index === words.length - 1 ? 'Показать результат' : 'Следующее слово'}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-64 overflow-hidden">
      {CONFETTI_PARTICLES.map((particle) => (
        <span
          key={particle.id}
          className="game-confetti"
          style={{
            left: particle.left,
            animationDelay: particle.animationDelay,
            backgroundColor: particle.backgroundColor,
          }}
        />
      ))}
    </div>
  )
}

interface GameResultProps {
  emoji: string
  title: string
  result: string
  detail: string
  onRestart: () => void
  onOtherCategory: () => void
  onGamesMenu: () => void
}

export function GameResult({
  emoji,
  title,
  result,
  detail,
  onRestart,
  onOtherCategory,
  onGamesMenu,
}: GameResultProps) {
  return (
    <div className="flex min-h-screen flex-col justify-center px-4 py-8 text-center">
      <div className="game-success-pop rounded-3xl border border-border-subtle bg-surface p-8 shadow-xl">
        <span className="text-6xl">{emoji}</span>
        <h1 className="mt-5 text-2xl font-bold text-text-primary">{title}</h1>
        <p className="mt-4 text-3xl font-bold text-primary">{result}</p>
        <p className="mt-2 text-sm text-text-secondary">{detail}</p>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="min-h-12 rounded-2xl bg-primary px-5 font-semibold text-white transition-all active:scale-[0.98]"
        >
          Играть снова
        </button>
        <button
          type="button"
          onClick={onOtherCategory}
          className="min-h-12 rounded-2xl border border-border bg-surface px-5 font-semibold text-text-secondary transition-all active:scale-[0.98]"
        >
          Другая категория
        </button>
        <button
          type="button"
          onClick={onGamesMenu}
          className="min-h-12 px-5 font-medium text-text-tertiary transition-colors hover:text-text-secondary"
        >
          В меню игр
        </button>
      </div>
    </div>
  )
}

interface EmptyGameProps {
  message: string
  onOtherCategory: () => void
  onGamesMenu: () => void
}

export function EmptyGame({ message, onOtherCategory, onGamesMenu }: EmptyGameProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="empty-state w-full">
        <span className="text-6xl">🎮</span>
        <h1 className="mt-4 text-xl font-bold text-text-primary">
          Игра пока недоступна
        </h1>
        <p className="mt-2 text-sm text-text-secondary">{message}</p>
      </div>
      <button
        type="button"
        onClick={onOtherCategory}
        className="mt-5 min-h-12 w-full rounded-2xl bg-primary px-5 font-semibold text-white"
      >
        Другая категория
      </button>
      <button
        type="button"
        onClick={onGamesMenu}
        className="mt-2 min-h-12 w-full px-5 font-medium text-text-tertiary"
      >
        В меню игр
      </button>
    </div>
  )
}

export default Hangman

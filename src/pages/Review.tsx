import { useEffect, useRef, useState } from 'react'
import { getWordById, type Word } from '../data/words'
import {
  recordQuizResult,
  reviewWords,
  useProgress,
  type QuizAnswer,
} from '../hooks/useProgress'
import { useSpeech } from '../hooks/useSpeech'
import { buildQuizForWords, type QuizQuestion } from '../utils/quiz'

function Review() {
  const progressState = useProgress()
  const { speak, isSupported } = useSpeech()
  const hardWords = reviewWords(progressState)
    .map((item) => getWordById(item.wordId))
    .filter((word): word is Word => Boolean(word))

  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    buildQuizForWords(hardWords),
  )
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [improved, setImproved] = useState(0)
  const [finished, setFinished] = useState(false)

  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const answers = useRef<QuizAnswer[]>([])

  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current)
    },
    [],
  )

  function restart() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    answers.current = []
    setQuestions(buildQuizForWords(hardWords))
    setIndex(0)
    setSelected(null)
    setImproved(0)
    setFinished(false)
  }

  if (finished) {
    return (
      <div className="flex min-h-screen w-full flex-col justify-center px-4 py-8">
        <div className="flex flex-col items-center rounded-3xl border border-border-subtle bg-surface p-8 text-center shadow-xl">
          <span className="text-5xl">📈</span>
          <h1 className="mt-4 text-2xl font-bold text-text-primary">
            Повторение завершено
          </h1>
          <p className="mt-3 text-base text-text-secondary">
            Улучшил результат по {improved} из {questions.length} слов
          </p>
        </div>

        {hardWords.length > 0 && (
          <button
            type="button"
            onClick={restart}
            className="mt-6 min-h-12 w-full rounded-2xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover active:bg-primary-active"
          >
            Повторить ещё раз
          </button>
        )}
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="empty-state w-full">
          <span className="text-6xl">🎉</span>
          <h1 className="mt-4 text-xl font-bold text-text-primary">
            Пока сложных слов нет!
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Пройди несколько квизов, и здесь появится повторение.
          </p>
        </div>
      </div>
    )
  }

  const total = questions.length
  const question = questions[index]
  const quizProgress = ((index + 1) / total) * 100
  const answered = selected !== null

  function handleAnswer(option: string) {
    if (answered) return

    setSelected(option)
    const isCorrect = option === question.correct
    answers.current.push({ wordId: question.word.id, correct: isCorrect })

    advanceTimer.current = setTimeout(() => {
      if (index < total - 1) {
        setIndex((current) => current + 1)
        setSelected(null)
      } else {
        setImproved(answers.current.filter((answer) => answer.correct).length)
        recordQuizResult(answers.current)
        setFinished(true)
      }
    }, 1000)
  }

  function optionClasses(option: string): string {
    const base =
      'min-h-14 w-full rounded-2xl border px-5 py-3 text-left text-base font-medium transition-all duration-app'

    if (!answered) {
      return `${base} border-border bg-surface text-text-secondary hover:border-primary-border hover:bg-primary-soft/50 active:scale-[0.98]`
    }
    if (option === question.correct) {
      return `${base} scale-[1.02] border-success bg-success-soft text-success shadow-sm`
    }
    if (option === selected) {
      return `${base} border-error bg-error-soft text-error`
    }
    return `${base} border-border bg-surface text-text-tertiary opacity-60`
  }

  return (
    <div className="flex min-h-screen w-full flex-col px-4 py-6">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-text-primary">🔄 Повторение</h1>
          <span className="text-sm font-medium text-text-secondary">
            Вопрос {index + 1} из {total}
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-all duration-entrance ease-out"
            style={{ width: `${quizProgress}%` }}
          />
        </div>
      </header>

      <div className="flex flex-col items-center py-6 text-center">
        <span className="mb-3 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
          Как переводится?
        </span>
        <div className="flex items-center justify-center gap-3">
          <h2 className="text-4xl font-bold tracking-tight text-text-primary">
            {question.word.english}
          </h2>
          {isSupported && (
            <button
              type="button"
              onClick={() => speak(question.word.english)}
              aria-label={`Произнести ${question.word.english}`}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xl transition-transform hover:scale-105 active:scale-95"
            >
              🔊
            </button>
          )}
        </div>
        <p className="mt-2 text-base text-text-tertiary">
          [{question.word.transcription}]
        </p>
      </div>

      <div className="mt-2 flex flex-1 flex-col justify-center gap-3 pb-6">
        {question.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleAnswer(option)}
            disabled={answered}
            className={optionClasses(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Review

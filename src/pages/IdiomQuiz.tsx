import { useEffect, useRef, useState } from 'react'
import { getIdiomsByCategory, type Idiom, type IdiomFilter } from '../data/idioms'
import {
  recordIdiomQuizResult,
  type IdiomQuizAnswer,
} from '../hooks/useProgress'
import { useSpeech } from '../hooks/useSpeech'
import { buildIdiomQuiz, type IdiomQuizQuestion } from '../utils/idiomQuiz'

interface IdiomQuizProps {
  category?: IdiomFilter
  onBack: () => void
  onHome: () => void
}

interface IdiomMistake {
  idiom: Idiom
  selectedMeaning: string
}

function getResultMessage(percent: number): { title: string; tone: string } {
  if (percent >= 90) return { title: 'Отличный результат', tone: 'text-success' }
  if (percent >= 70) return { title: 'Очень хорошо', tone: 'text-primary' }
  if (percent >= 50) return { title: 'Неплохо, но можно лучше', tone: 'text-warning' }
  return { title: 'Стоит повторить ещё раз', tone: 'text-error' }
}

function IdiomQuiz({ category = 'all', onBack, onHome }: IdiomQuizProps) {
  const { speak, isSupported } = useSpeech()
  const pool = getIdiomsByCategory(category)

  const [questions, setQuestions] = useState<IdiomQuizQuestion[]>(() =>
    buildIdiomQuiz(category),
  )
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [mistakes, setMistakes] = useState<IdiomMistake[]>([])
  const [finished, setFinished] = useState(false)

  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const answers = useRef<IdiomQuizAnswer[]>([])

  useEffect(
    () => () => {
      if (advanceTimer.current) {
        clearTimeout(advanceTimer.current)
      }
    },
    [],
  )

  function restart() {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current)
    }

    answers.current = []
    setQuestions(buildIdiomQuiz(category))
    setIndex(0)
    setSelected(null)
    setScore(0)
    setMistakes([])
    setFinished(false)
  }

  if (pool.length === 0 || questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="empty-state w-full">
          <span className="text-6xl">💬</span>
          <h1 className="mt-4 text-xl font-bold text-text-primary">
            Квиз пока недоступен
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Не удалось собрать вопросы по идиомам.
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 min-h-12 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white"
        >
          ← Назад
        </button>
      </div>
    )
  }

  if (finished) {
    const total = questions.length
    const percent = total > 0 ? Math.round((score / total) * 100) : 0
    const { title, tone } = getResultMessage(percent)

    return (
      <div className="flex min-h-screen w-full flex-col px-4 py-8">
        <div className="rounded-3xl border border-border-subtle bg-surface p-8 text-center shadow-xl">
          <p className={`text-2xl font-bold ${tone}`}>{title}</p>
          <div className="mx-auto mt-6 flex h-32 w-32 flex-col items-center justify-center rounded-full bg-primary-soft">
            <span className="text-4xl font-bold tracking-tight text-primary">
              {score}/{total}
            </span>
            <span className="mt-1 text-sm font-medium text-primary">{percent}%</span>
          </div>
          <p className="mt-5 text-sm text-text-secondary">
            Правильных ответов: {score} из {total}
          </p>
        </div>

        {mistakes.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-tertiary">
              Разбор ошибок
            </h2>
            <ul className="flex flex-col gap-3">
              {mistakes.map(({ idiom, selectedMeaning }) => (
                <li
                  key={idiom.id}
                  className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">{idiom.phrase}</h3>
                      <p className="mt-1 text-sm italic text-text-tertiary">
                        "{idiom.literal}"
                      </p>
                    </div>
                    <span className="rounded-full bg-error-soft px-2.5 py-1 text-xs font-semibold text-error">
                      Ошибка
                    </span>
                  </div>
                  <div className="mt-4 rounded-2xl bg-surface-muted p-4 text-sm leading-relaxed">
                    <p className="text-text-secondary">Ты выбрал: {selectedMeaning}</p>
                    <p className="mt-2 font-medium text-success">
                      Правильный смысл: {idiom.meaning}
                    </p>
                    <p className="mt-3 text-text-secondary">{idiom.example}</p>
                    <p className="mt-1 text-text-secondary">{idiom.exampleTranslation}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={restart}
            className="min-h-12 rounded-2xl bg-primary px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Пройти ещё раз
          </button>
          <button
            type="button"
            onClick={onBack}
            className="min-h-12 rounded-2xl border border-border bg-surface px-6 py-3 text-base font-semibold text-text-secondary transition-colors hover:bg-surface-muted"
          >
            К списку идиом
          </button>
          <button
            type="button"
            onClick={onHome}
            className="min-h-12 px-6 py-3 text-base font-medium text-text-tertiary transition-colors hover:text-text-secondary"
          >
            На главную
          </button>
        </div>
      </div>
    )
  }

  const total = questions.length
  const question = questions[index]
  const progress = ((index + 1) / total) * 100
  const answered = selected !== null

  function advance() {
    if (index < total - 1) {
      setIndex((current) => current + 1)
      setSelected(null)
      return
    }

    recordIdiomQuizResult(answers.current)
    setFinished(true)
  }

  function handleAnswer(option: string) {
    if (answered) return

    const isCorrect = option === question.correct

    setSelected(option)
    answers.current.push({ idiomId: question.idiom.id, correct: isCorrect })

    if (isCorrect) {
      setScore((current) => current + 1)
    } else {
      setMistakes((current) => [
        ...current,
        { idiom: question.idiom, selectedMeaning: option },
      ])
    }

    advanceTimer.current = setTimeout(advance, 1100)
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
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            ← К идиомам
          </button>
          <span className="text-sm font-medium text-text-secondary">
            Вопрос {index + 1} из {total}
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-all duration-entrance ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <div className="flex flex-col items-center py-6 text-center">
        <span className="mb-3 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
          Что это значит?
        </span>
        <div className="flex items-center justify-center gap-3">
          <h2 className="text-4xl font-bold tracking-tight text-text-primary">
            {question.idiom.phrase}
          </h2>
          {isSupported && (
            <button
              type="button"
              onClick={() => speak(question.idiom.phrase)}
              aria-label={`Произнести ${question.idiom.phrase}`}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xl transition-transform hover:scale-105 active:scale-95"
            >
              🔊
            </button>
          )}
        </div>
        <p className="mt-3 text-sm italic text-text-tertiary">
          Буквально: "{question.idiom.literal}"
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

export default IdiomQuiz

import { useEffect, useRef, useState } from 'react'
import {
  getPhrasalVerbsByCategory,
  type PhrasalVerb,
  type PhrasalVerbFilter,
} from '../data/phrasalVerbs'
import {
  recordPhrasalVerbQuizResult,
  type PhrasalVerbQuizAnswer,
} from '../hooks/useProgress'
import { useSpeech } from '../hooks/useSpeech'
import {
  buildPhrasalVerbQuiz,
  type PhrasalVerbQuizQuestion,
} from '../utils/phrasalVerbQuiz'

interface PhrasalVerbQuizProps {
  category?: PhrasalVerbFilter
  onBack: () => void
  onHome: () => void
}

interface PhrasalVerbMistake {
  phrasalVerb: PhrasalVerb
  selectedMeaning: string
}

function getResultMessage(percent: number): { title: string; tone: string } {
  if (percent >= 90) return { title: 'Отличный результат', tone: 'text-emerald-600' }
  if (percent >= 70) return { title: 'Очень хорошо', tone: 'text-indigo-600' }
  if (percent >= 50) return { title: 'Неплохо, но можно лучше', tone: 'text-amber-600' }
  return { title: 'Стоит повторить ещё раз', tone: 'text-rose-600' }
}

function PhrasalVerbQuiz({
  category = 'all',
  onBack,
  onHome,
}: PhrasalVerbQuizProps) {
  const { speak, isSupported } = useSpeech()
  const pool = getPhrasalVerbsByCategory(category)

  const [questions, setQuestions] = useState<PhrasalVerbQuizQuestion[]>(() =>
    buildPhrasalVerbQuiz(category),
  )
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [mistakes, setMistakes] = useState<PhrasalVerbMistake[]>([])
  const [finished, setFinished] = useState(false)

  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const answers = useRef<PhrasalVerbQuizAnswer[]>([])

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
    setQuestions(buildPhrasalVerbQuiz(category))
    setIndex(0)
    setSelected(null)
    setScore(0)
    setMistakes([])
    setFinished(false)
  }

  if (pool.length === 0 || questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-slate-500">
          Не удалось собрать квиз по фразовым глаголам.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 min-h-12 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white"
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
      <div className="flex min-h-screen w-full flex-col px-5 py-8">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-xl">
          <p className={`text-2xl font-bold ${tone}`}>{title}</p>
          <div className="mx-auto mt-6 flex h-32 w-32 flex-col items-center justify-center rounded-full bg-indigo-50">
            <span className="text-4xl font-bold tracking-tight text-indigo-600">
              {score}/{total}
            </span>
            <span className="mt-1 text-sm font-medium text-indigo-400">{percent}%</span>
          </div>
          <p className="mt-5 text-sm text-slate-500">
            Правильных ответов: {score} из {total}
          </p>
        </div>

        {mistakes.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Разбор ошибок
            </h2>
            <ul className="flex flex-col gap-3">
              {mistakes.map(({ phrasalVerb, selectedMeaning }) => {
                const primaryMeaning = phrasalVerb.meanings[0]

                return (
                  <li
                    key={phrasalVerb.id}
                    className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold text-slate-950">
                        {phrasalVerb.phrase}
                      </h3>
                      <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
                        Ошибка
                      </span>
                    </div>
                    <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed">
                      <p className="text-slate-500">Ты выбрал: {selectedMeaning}</p>
                      <p className="mt-2 font-medium text-emerald-700">
                        Правильное значение: {primaryMeaning.russian}
                      </p>
                      <p className="mt-3 text-slate-700">{primaryMeaning.example}</p>
                      <p className="mt-1 text-slate-500">
                        {primaryMeaning.exampleTranslation}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={restart}
            className="min-h-12 rounded-2xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            Пройти ещё раз
          </button>
          <button
            type="button"
            onClick={onBack}
            className="min-h-12 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            К списку фразовых глаголов
          </button>
          <button
            type="button"
            onClick={onHome}
            className="min-h-12 px-6 py-3 text-base font-medium text-slate-400 transition-colors hover:text-slate-600"
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

    recordPhrasalVerbQuizResult(answers.current)
    setFinished(true)
  }

  function handleAnswer(option: string) {
    if (answered) return

    const isCorrect = option === question.correct

    setSelected(option)
    answers.current.push({
      phrasalVerbId: question.phrasalVerb.id,
      correct: isCorrect,
    })

    if (isCorrect) {
      setScore((current) => current + 1)
    } else {
      setMistakes((current) => [
        ...current,
        { phrasalVerb: question.phrasalVerb, selectedMeaning: option },
      ])
    }

    advanceTimer.current = setTimeout(advance, 1100)
  }

  function optionClasses(option: string): string {
    const base =
      'min-h-14 w-full rounded-2xl border px-5 py-3 text-left text-base font-medium transition-all duration-200'

    if (!answered) {
      return `${base} border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50 active:scale-[0.98]`
    }

    if (option === question.correct) {
      return `${base} scale-[1.02] border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm`
    }

    if (option === selected) {
      return `${base} border-rose-400 bg-rose-50 text-rose-700`
    }

    return `${base} border-slate-200 bg-white text-slate-400 opacity-60`
  }

  return (
    <div className="flex min-h-screen w-full flex-col px-5 py-6">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
          >
            ← К фразовым глаголам
          </button>
          <span className="text-sm font-medium text-slate-500">
            Вопрос {index + 1} из {total}
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <div className="flex flex-col items-center py-6 text-center">
        <span className="mb-3 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
          Что это значит?
        </span>
        <div className="flex items-center justify-center gap-3">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900">
            {question.phrasalVerb.phrase}
          </h2>
          {isSupported && (
            <button
              type="button"
              onClick={() => speak(question.phrasalVerb.phrase)}
              aria-label={`Произнести ${question.phrasalVerb.phrase}`}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xl transition-transform hover:scale-105 active:scale-95"
            >
              🔊
            </button>
          )}
        </div>
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

export default PhrasalVerbQuiz

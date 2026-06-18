import { useMemo, useState } from 'react'
import {
  gerundInfinitivePractice,
  gerundInfinitiveRules,
  verbPatternGroups,
} from '../data/gerundInfinitive'

type StudyTab = 'rules' | 'verbs' | 'practice'

function GerundInfinitive() {
  const [activeTab, setActiveTab] = useState<StudyTab>('rules')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<boolean[]>([])

  const question = gerundInfinitivePractice[questionIndex]
  const answered = selected !== null
  const correctCount = answers.filter(Boolean).length
  const progress = useMemo(
    () => Math.round((answers.length / gerundInfinitivePractice.length) * 100),
    [answers.length],
  )

  function chooseAnswer(optionIndex: number) {
    if (answered) return
    setSelected(optionIndex)
    setAnswers((current) => [
      ...current,
      optionIndex === question.correctIndex,
    ])
  }

  function nextQuestion() {
    if (questionIndex < gerundInfinitivePractice.length - 1) {
      setQuestionIndex((index) => index + 1)
      setSelected(null)
    }
  }

  function restartPractice() {
    setQuestionIndex(0)
    setSelected(null)
    setAnswers([])
  }

  function optionClass(optionIndex: number): string {
    const base =
      'min-h-12 w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors'

    if (!answered) {
      return `${base} border-slate-200 bg-white text-slate-700 hover:bg-slate-50`
    }
    if (optionIndex === question.correctIndex) {
      return `${base} border-emerald-300 bg-emerald-50 text-emerald-800`
    }
    if (optionIndex === selected) {
      return `${base} border-rose-300 bg-rose-50 text-rose-800`
    }
    return `${base} border-slate-200 bg-white text-slate-400`
  }

  const tabs: { id: StudyTab; label: string }[] = [
    { id: 'rules', label: 'Правила' },
    { id: 'verbs', label: 'Глаголы' },
    { id: 'practice', label: 'Практика' },
  ]

  return (
    <section className="mt-5">
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Gerund / Infinitive
        </p>
        <h2 className="mt-2 text-xl font-semibold text-slate-950">
          Когда говорить doing, а когда to do
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Отдельный тренажер для одной из самых частых ошибок: выбор формы
          глагола после другого глагола, предлога или цели действия.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-3 rounded-lg border border-slate-200 bg-white p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`min-h-10 rounded-md text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? 'bg-slate-950 text-white'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'rules' && (
        <ul className="mt-4 flex flex-col gap-3">
          {gerundInfinitiveRules.map((rule) => (
            <li
              key={rule.id}
              className="rounded-lg border border-slate-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-950">
                    {rule.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {rule.explanation}
                  </p>
                </div>
                <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-600">
                  {rule.pattern}
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {rule.examples.map((example) => (
                  <div
                    key={example.english}
                    className="rounded-md bg-slate-50 px-3 py-2"
                  >
                    <p className="text-sm font-semibold text-slate-900">
                      {example.english}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {example.russian}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                  Не путай
                </p>
                <p className="mt-1 text-sm text-amber-900">
                  {rule.commonMistake}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {activeTab === 'verbs' && (
        <ul className="mt-4 flex flex-col gap-3">
          {verbPatternGroups.map((group) => (
            <li
              key={group.id}
              className="rounded-lg border border-slate-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-950">
                    {group.title}
                  </h3>
                  <p className="mt-1 font-mono text-sm text-slate-500">
                    {group.pattern}
                  </p>
                </div>
                <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                  {group.verbs.length}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {group.verbs.map((verb) => (
                  <span
                    key={verb}
                    className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-xs font-semibold text-slate-700"
                  >
                    {verb}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {group.examples.map((example) => (
                  <div
                    key={example.english}
                    className="rounded-md bg-slate-50 px-3 py-2"
                  >
                    <p className="text-sm font-semibold text-slate-900">
                      {example.english}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {example.russian}
                    </p>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}

      {activeTab === 'practice' && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Практика
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-950">
                Выбери правильную форму
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {questionIndex + 1}/{gerundInfinitivePractice.length}
            </span>
          </div>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-slate-950 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-5 text-xl font-semibold leading-snug text-slate-950">
            {question.sentence}
          </p>

          <div className="mt-5 flex flex-col gap-2">
            {question.options.map((option, index) => (
              <button
                key={option}
                type="button"
                onClick={() => chooseAnswer(index)}
                disabled={answered}
                className={optionClass(index)}
              >
                {option}
              </button>
            ))}
          </div>

          {answered && (
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-sm font-semibold text-slate-950">
                {selected === question.correctIndex ? 'Верно' : 'Правильный ответ'}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                {question.explanation}
              </p>
              {questionIndex < gerundInfinitivePractice.length - 1 ? (
                <button
                  type="button"
                  onClick={nextQuestion}
                  className="mt-3 min-h-10 w-full rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  Следующий вопрос
                </button>
              ) : (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-slate-900">
                    Результат: {correctCount} из {gerundInfinitivePractice.length}
                  </p>
                  <button
                    type="button"
                    onClick={restartPractice}
                    className="mt-3 min-h-10 w-full rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    Пройти заново
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default GerundInfinitive

import { useMemo, useState } from 'react'
import { irregularVerbs, type IrregularVerb } from '../data/irregularVerbs'

const LEARNED_KEY = 'english-app:irregular-verbs-learned:v1'
const HARD_KEY = 'english-app:irregular-verbs-hard:v1'

interface IrregularVerbsProps {
  onBack: () => void
}

function loadSet(key: string): Set<string> {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? '[]')
    return new Set(Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [])
  } catch {
    return new Set()
  }
}

function saveSet(key: string, value: Set<string>) {
  try {
    localStorage.setItem(key, JSON.stringify([...value]))
  } catch {
    // Progress remains available until the page is reloaded.
  }
}

function includesQuery(verb: IrregularVerb, query: string): boolean {
  const haystack = [
    verb.base,
    verb.pastSimple,
    verb.pastParticiple,
    verb.russian,
    verb.example,
  ].join(' ')
  return haystack.toLowerCase().includes(query.toLowerCase())
}

function IrregularVerbs({ onBack }: IrregularVerbsProps) {
  const [learnedIds, setLearnedIds] = useState(() => loadSet(LEARNED_KEY))
  const [hardIds, setHardIds] = useState(() => loadSet(HARD_KEY))
  const [query, setQuery] = useState('')
  const [cardIndex, setCardIndex] = useState(0)
  const [showForms, setShowForms] = useState(false)

  const learnedCount = learnedIds.size
  const hardCount = hardIds.size
  const progress = Math.round((learnedCount / irregularVerbs.length) * 100)

  const learningQueue = useMemo(() => {
    const hard = irregularVerbs.filter((verb) => hardIds.has(verb.id) && !learnedIds.has(verb.id))
    const fresh = irregularVerbs.filter(
      (verb) => !learnedIds.has(verb.id) && !hardIds.has(verb.id),
    )
    const known = irregularVerbs.filter((verb) => learnedIds.has(verb.id))
    return [...hard, ...fresh, ...known]
  }, [hardIds, learnedIds])

  const currentVerb = learningQueue[cardIndex % learningQueue.length] ?? irregularVerbs[0]
  const filteredVerbs = irregularVerbs.filter((verb) => includesQuery(verb, query.trim()))

  function moveNext() {
    setShowForms(false)
    setCardIndex((current) => current + 1)
  }

  function markKnown() {
    const nextLearned = new Set(learnedIds)
    const nextHard = new Set(hardIds)
    nextLearned.add(currentVerb.id)
    nextHard.delete(currentVerb.id)
    setLearnedIds(nextLearned)
    setHardIds(nextHard)
    saveSet(LEARNED_KEY, nextLearned)
    saveSet(HARD_KEY, nextHard)
    moveNext()
  }

  function markForReview() {
    const nextHard = new Set(hardIds)
    nextHard.add(currentVerb.id)
    setHardIds(nextHard)
    saveSet(HARD_KEY, nextHard)
    moveNext()
  }

  function resetProgress() {
    const empty = new Set<string>()
    setLearnedIds(empty)
    setHardIds(empty)
    saveSet(LEARNED_KEY, empty)
    saveSet(HARD_KEY, empty)
    setCardIndex(0)
    setShowForms(false)
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 px-5 py-6">
      <header className="rounded-3xl bg-slate-950 p-5 text-white shadow-sm">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-semibold text-slate-300 transition-colors hover:text-white"
        >
          ← Главная
        </button>
        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-emerald-300">
          Быстрое изучение
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Неправильные глаголы</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          V1, V2, V3 и перевод собраны в быстрые карточки для ежедневной практики.
        </p>
      </header>

      <section className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm">
          <p className="text-2xl font-bold text-slate-950">{irregularVerbs.length}</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            всего
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-center shadow-sm">
          <p className="text-2xl font-bold text-emerald-700">{learnedCount}</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-600">
            знаю
          </p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3 text-center shadow-sm">
          <p className="text-2xl font-bold text-amber-700">{hardCount}</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-amber-600">
            повторить
          </p>
        </div>
      </section>

      <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Раунд
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {progress}% освоено
            </p>
          </div>
          <button
            type="button"
            onClick={resetProgress}
            disabled={learnedCount === 0 && hardCount === 0}
            className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-40"
          >
            Сбросить
          </button>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <article className="mt-5 overflow-hidden rounded-3xl border border-slate-100 bg-slate-950 text-white">
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                  V1
                </p>
                <h2 className="mt-2 text-5xl font-bold tracking-tight">{currentVerb.base}</h2>
                <p className="mt-3 text-base font-semibold text-slate-200">
                  {currentVerb.russian}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  learnedIds.has(currentVerb.id)
                    ? 'bg-emerald-400 text-emerald-950'
                    : hardIds.has(currentVerb.id)
                      ? 'bg-amber-300 text-amber-950'
                      : 'bg-white/10 text-slate-200'
                }`}
              >
                {learnedIds.has(currentVerb.id)
                  ? 'знаю'
                  : hardIds.has(currentVerb.id)
                    ? 'повтор'
                    : 'новый'}
              </span>
            </div>

            <div className="mt-5 rounded-2xl bg-white/10 p-4">
              {showForms ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      V2
                    </p>
                    <p className="mt-1 text-xl font-bold">{currentVerb.pastSimple}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      V3
                    </p>
                    <p className="mt-1 text-xl font-bold">{currentVerb.pastParticiple}</p>
                  </div>
                  <p className="col-span-2 mt-2 text-sm leading-relaxed text-slate-300">
                    {currentVerb.example}
                  </p>
                </div>
              ) : (
                <div className="flex min-h-24 items-center justify-center text-center">
                  <p className="text-sm font-semibold text-slate-300">
                    Формы закрыты
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-white p-3">
            <button
              type="button"
              onClick={() => setShowForms((current) => !current)}
              className="min-h-11 rounded-2xl bg-slate-100 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-200"
            >
              {showForms ? 'Скрыть' : 'Показать'}
            </button>
            <button
              type="button"
              onClick={markForReview}
              className="min-h-11 rounded-2xl bg-amber-100 px-3 text-xs font-bold text-amber-800 transition-colors hover:bg-amber-200"
            >
              Повторить
            </button>
            <button
              type="button"
              onClick={markKnown}
              className="min-h-11 rounded-2xl bg-emerald-600 px-3 text-xs font-bold text-white transition-colors hover:bg-emerald-700"
            >
              Знаю
            </button>
          </div>
        </article>
      </section>

      <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Список глаголов</h2>
            <p className="mt-1 text-xs text-slate-500">
              {filteredVerbs.length} из {irregularVerbs.length}
            </p>
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="поиск"
            className="min-h-10 w-32 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-emerald-400"
          />
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {filteredVerbs.map((verb) => (
            <article
              key={verb.id}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-base font-bold text-slate-950">
                    {verb.base}
                    <span className="font-medium text-slate-400"> · {verb.russian}</span>
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    {verb.pastSimple} · {verb.pastParticiple}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    learnedIds.has(verb.id)
                      ? 'bg-emerald-100 text-emerald-700'
                      : hardIds.has(verb.id)
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-white text-slate-400'
                  }`}
                >
                  {learnedIds.has(verb.id) ? 'знаю' : hardIds.has(verb.id) ? 'повтор' : 'новый'}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default IrregularVerbs

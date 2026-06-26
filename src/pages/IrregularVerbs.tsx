import { type FormEvent, useMemo, useState } from 'react'
import { irregularVerbs } from '../data/irregularVerbs'
import type { IrregularVerb } from '../types'

const LEARNED_KEY = 'english-app:irregular-verbs-learned:v1'
const HARD_KEY = 'english-app:irregular-verbs-hard:v1'

type PracticeMode = 'cards' | 'write' | 'test'
type VerbForm = 'pastSimple' | 'pastParticiple'

interface IrregularVerbsProps {
  onBack: () => void
}

interface WritingResult {
  pastSimple: boolean
  pastParticiple: boolean
}

const MODES: { id: PracticeMode; label: string }[] = [
  { id: 'cards', label: 'Карточки' },
  { id: 'write', label: 'Письмо' },
  { id: 'test', label: 'Тест' },
]

const FORM_LABELS: Record<VerbForm, string> = {
  pastSimple: 'V2',
  pastParticiple: 'V3',
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

function normalizeAnswer(value: string): string {
  return value
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function acceptedForms(value: string): string[] {
  const parts = value
    .split(/\s*(?:\/|,|\bor\b)\s*/i)
    .map(normalizeAnswer)
    .filter(Boolean)

  return [...new Set([normalizeAnswer(value), ...parts])]
}

function isCorrectForm(input: string, expected: string): boolean {
  const answer = normalizeAnswer(input)
  return answer.length > 0 && acceptedForms(expected).includes(answer)
}

function uniqueForms(values: string[]): string[] {
  const seen = new Set<string>()
  return values.filter((value) => {
    const key = normalizeAnswer(value)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function buildOptions(verb: IrregularVerb, form: VerbForm, seed: number): string[] {
  const correct = verb[form]
  const pool = uniqueForms(
    irregularVerbs.filter((item) => item.id !== verb.id).map((item) => item[form]),
  )
  const start = pool.length > 0 ? (seed * 3) % pool.length : 0
  const distractors = [...pool.slice(start), ...pool.slice(0, start)].slice(0, 3)
  const options = uniqueForms([correct, ...distractors]).slice(0, 4)
  const shift = seed % options.length
  return [...options.slice(shift), ...options.slice(0, shift)]
}

function resultInputClass(result?: boolean): string {
  const base =
    'min-h-12 w-full rounded-2xl border bg-surface px-4 text-base font-semibold outline-none transition-colors'

  if (result === true) return `${base} border-success-border text-success`
  if (result === false) return `${base} border-error-border text-error`
  return `${base} border-border text-text-primary focus:border-success`
}

function IrregularVerbs({ onBack }: IrregularVerbsProps) {
  const [learnedIds, setLearnedIds] = useState(() => loadSet(LEARNED_KEY))
  const [hardIds, setHardIds] = useState(() => loadSet(HARD_KEY))
  const [query, setQuery] = useState('')
  const [cardIndex, setCardIndex] = useState(0)
  const [showForms, setShowForms] = useState(false)
  const [mode, setMode] = useState<PracticeMode>('cards')
  const [pastSimpleInput, setPastSimpleInput] = useState('')
  const [pastParticipleInput, setPastParticipleInput] = useState('')
  const [writingResult, setWritingResult] = useState<WritingResult | null>(null)
  const [selectedOption, setSelectedOption] = useState('')
  const [testResult, setTestResult] = useState<'correct' | 'wrong' | null>(null)

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
  const testForm: VerbForm = cardIndex % 2 === 0 ? 'pastSimple' : 'pastParticiple'
  const testAnswer = currentVerb[testForm]
  const testOptions = useMemo(
    () => buildOptions(currentVerb, testForm, cardIndex),
    [cardIndex, currentVerb, testForm],
  )

  function clearRoundState() {
    setShowForms(false)
    setPastSimpleInput('')
    setPastParticipleInput('')
    setWritingResult(null)
    setSelectedOption('')
    setTestResult(null)
  }

  function saveProgress(nextLearned: Set<string>, nextHard: Set<string>) {
    setLearnedIds(nextLearned)
    setHardIds(nextHard)
    saveSet(LEARNED_KEY, nextLearned)
    saveSet(HARD_KEY, nextHard)
  }

  function updateVerbStatus(verbId: string, status: 'known' | 'hard') {
    const nextLearned = new Set(learnedIds)
    const nextHard = new Set(hardIds)

    if (status === 'known') {
      nextLearned.add(verbId)
      nextHard.delete(verbId)
    } else {
      nextHard.add(verbId)
      nextLearned.delete(verbId)
    }

    saveProgress(nextLearned, nextHard)
  }

  function moveNext() {
    clearRoundState()
    setCardIndex((current) => current + 1)
  }

  function switchMode(nextMode: PracticeMode) {
    setMode(nextMode)
    clearRoundState()
  }

  function markKnown() {
    updateVerbStatus(currentVerb.id, 'known')
    moveNext()
  }

  function markForReview() {
    updateVerbStatus(currentVerb.id, 'hard')
    moveNext()
  }

  function checkWriting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = {
      pastSimple: isCorrectForm(pastSimpleInput, currentVerb.pastSimple),
      pastParticiple: isCorrectForm(pastParticipleInput, currentVerb.pastParticiple),
    }
    setWritingResult(result)
    updateVerbStatus(
      currentVerb.id,
      result.pastSimple && result.pastParticiple ? 'known' : 'hard',
    )
  }

  function chooseTestOption(option: string) {
    if (testResult) return

    const isCorrect = normalizeAnswer(option) === normalizeAnswer(testAnswer)
    setSelectedOption(option)
    setTestResult(isCorrect ? 'correct' : 'wrong')
    updateVerbStatus(currentVerb.id, isCorrect ? 'known' : 'hard')
  }

  function practiceVerb(verbId: string) {
    const targetIndex = learningQueue.findIndex((verb) => verb.id === verbId)
    if (targetIndex >= 0) setCardIndex(targetIndex)
    clearRoundState()
  }

  function resetProgress() {
    const empty = new Set<string>()
    saveProgress(empty, empty)
    setCardIndex(0)
    clearRoundState()
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-surface-muted px-4 py-6">
      <header className="rounded-3xl bg-primary p-5 text-white shadow-sm">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-semibold text-white/70 transition-colors hover:text-white"
        >
          ← Главная
        </button>
        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-white/70">
          Быстрое изучение
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Неправильные глаголы</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/75">
          V1, V2, V3 и перевод собраны в быстрые карточки для ежедневной практики.
        </p>
      </header>

      <section className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-2xl border border-border bg-surface p-3 text-center shadow-sm">
          <p className="text-2xl font-bold text-text-primary">{irregularVerbs.length}</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
            всего
          </p>
        </div>
        <div className="rounded-2xl border border-success-border bg-success-soft p-3 text-center shadow-sm">
          <p className="text-2xl font-bold text-success">{learnedCount}</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-success">
            знаю
          </p>
        </div>
        <div className="rounded-2xl border border-warning-border bg-warning-soft p-3 text-center shadow-sm">
          <p className="text-2xl font-bold text-warning">{hardCount}</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-warning">
            повторить
          </p>
        </div>
      </section>

      <section className="mt-4 rounded-3xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              Раунд
            </p>
            <p className="mt-1 text-sm font-semibold text-text-primary">
              {progress}% освоено
            </p>
          </div>
          <button
            type="button"
            onClick={resetProgress}
            disabled={learnedCount === 0 && hardCount === 0}
            className="rounded-full border border-border px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:bg-surface-muted disabled:opacity-40"
          >
            Сбросить
          </button>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-entrance"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-1 rounded-2xl bg-surface-muted p-1">
          {MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => switchMode(item.id)}
              className={`min-h-10 rounded-xl px-2 text-xs font-bold transition-colors ${
                mode === item.id
                  ? 'bg-surface text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {mode === 'cards' && (
          <article className="mt-5 overflow-hidden rounded-3xl border border-border-subtle bg-primary text-white">
            <div className="bg-gradient-to-br from-primary-active via-primary-active to-secondary-hover p-5 dark:from-primary-active-dark dark:via-primary-active-dark dark:to-secondary-button-dark">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                    V1
                  </p>
                  <h2 className="mt-2 text-5xl font-bold tracking-tight">{currentVerb.base}</h2>
                  <p className="mt-3 text-base font-semibold text-white/85">
                    {currentVerb.russian}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    learnedIds.has(currentVerb.id)
                      ? 'bg-success-soft text-success'
                      : hardIds.has(currentVerb.id)
                        ? 'bg-warning-soft text-warning'
                        : 'bg-white/10 text-white/85'
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
                      <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                        V2
                      </p>
                      <p className="mt-1 text-xl font-bold">{currentVerb.pastSimple}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                        V3
                      </p>
                      <p className="mt-1 text-xl font-bold">{currentVerb.pastParticiple}</p>
                    </div>
                    <p className="col-span-2 mt-2 text-sm leading-relaxed text-white/70">
                      {currentVerb.example}
                    </p>
                  </div>
                ) : (
                  <div className="flex min-h-24 items-center justify-center text-center">
                    <p className="text-sm font-semibold text-white/70">
                      Формы закрыты
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-surface p-3">
              <button
                type="button"
                onClick={() => setShowForms((current) => !current)}
                className="min-h-11 rounded-2xl bg-surface-muted px-3 text-xs font-bold text-text-secondary transition-colors hover:bg-border"
              >
                {showForms ? 'Скрыть' : 'Показать'}
              </button>
              <button
                type="button"
                onClick={markForReview}
                className="min-h-11 rounded-2xl bg-warning-soft px-3 text-xs font-bold text-warning transition-colors hover:bg-warning-border"
              >
                Повторить
              </button>
              <button
                type="button"
                onClick={markKnown}
                className="min-h-11 rounded-2xl bg-success px-3 text-xs font-bold text-white transition-colors hover:bg-success-hover dark:bg-success-button-dark dark:hover:bg-success-button-hover-dark"
              >
                Знаю
              </button>
            </div>
          </article>
        )}

        {mode === 'write' && (
          <form
            onSubmit={checkWriting}
            className="mt-5 rounded-3xl border border-border-subtle bg-primary p-5 text-white"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
              Напиши формы
            </p>
            <div className="mt-3 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-5xl font-bold tracking-tight">{currentVerb.base}</h2>
                <p className="mt-2 text-base font-semibold text-white/75">
                  {currentVerb.russian}
                </p>
              </div>
              <button
                type="button"
                onClick={moveNext}
                className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold text-white/85"
              >
                Дальше
              </button>
            </div>

            <div className="mt-5 grid gap-3">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white/70">
                  V2 Past Simple
                </span>
                <input
                  value={pastSimpleInput}
                  onChange={(event) => setPastSimpleInput(event.target.value)}
                  placeholder="например: went"
                  className={resultInputClass(writingResult?.pastSimple)}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white/70">
                  V3 Past Participle
                </span>
                <input
                  value={pastParticipleInput}
                  onChange={(event) => setPastParticipleInput(event.target.value)}
                  placeholder="например: gone"
                  className={resultInputClass(writingResult?.pastParticiple)}
                />
              </label>
            </div>

            {writingResult && (
              <div
                className={`mt-4 rounded-2xl p-4 text-sm font-semibold ${
                  writingResult.pastSimple && writingResult.pastParticiple
                    ? 'bg-success-soft text-success'
                    : 'bg-error-soft text-error'
                }`}
              >
                {writingResult.pastSimple && writingResult.pastParticiple
                  ? 'Верно. Глагол отмечен как изученный.'
                  : `Правильно: ${currentVerb.pastSimple} · ${currentVerb.pastParticiple}`}
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="submit"
                disabled={!pastSimpleInput.trim() && !pastParticipleInput.trim()}
                className="min-h-12 rounded-2xl bg-white px-4 text-sm font-bold text-primary transition-colors hover:bg-primary-soft disabled:opacity-40 dark:bg-text-primary dark:text-background dark:hover:bg-white"
              >
                Проверить
              </button>
              <button
                type="button"
                onClick={markForReview}
                className="min-h-12 rounded-2xl bg-white/10 px-4 text-sm font-bold text-white/85 transition-colors hover:bg-white/15"
              >
                Повторить
              </button>
            </div>
          </form>
        )}

        {mode === 'test' && (
          <article className="mt-5 rounded-3xl border border-border-subtle bg-surface p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              {FORM_LABELS[testForm]} для
            </p>
            <div className="mt-3 rounded-3xl bg-gradient-to-br from-primary to-primary-hover p-5 text-white">
              <h2 className="text-5xl font-bold tracking-tight">{currentVerb.base}</h2>
              <p className="mt-2 text-base font-semibold text-white/85">
                {currentVerb.russian}
              </p>
            </div>

            <div className="mt-4 grid gap-2">
              {testOptions.map((option) => {
                const isSelected = selectedOption === option
                const isCorrect = normalizeAnswer(option) === normalizeAnswer(testAnswer)
                const answered = testResult !== null

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => chooseTestOption(option)}
                    disabled={answered}
                    className={`min-h-12 rounded-2xl border px-4 text-left text-base font-bold transition-colors ${
                      answered && isCorrect
                        ? 'border-success-border bg-success-soft text-success'
                        : answered && isSelected
                          ? 'border-error-border bg-error-soft text-error'
                          : 'border-border bg-surface-muted text-text-primary hover:border-primary-border hover:bg-primary-soft'
                    }`}
                  >
                    {option}
                  </button>
                )
              })}
            </div>

            {testResult && (
              <div
                className={`mt-4 rounded-2xl p-4 text-sm font-semibold ${
                  testResult === 'correct'
                    ? 'bg-success-soft text-success'
                    : 'bg-error-soft text-error'
                }`}
              >
                {testResult === 'correct'
                  ? 'Верно. Глагол отмечен как изученный.'
                  : `Правильный ответ: ${testAnswer}`}
              </div>
            )}

            <button
              type="button"
              onClick={moveNext}
              className="mt-4 min-h-12 w-full rounded-2xl bg-primary px-4 text-sm font-bold text-white transition-colors hover:bg-primary-hover"
            >
              Следующий
            </button>
          </article>
        )}
      </section>

      <section className="mt-4 rounded-3xl border border-border bg-surface p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Список глаголов</h2>
            <p className="mt-1 text-xs text-text-secondary">
              {filteredVerbs.length} из {irregularVerbs.length}
            </p>
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="поиск"
            className="min-h-10 w-32 rounded-2xl border border-border bg-surface-muted px-3 text-sm outline-none focus:border-success"
          />
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {filteredVerbs.map((verb) => (
            <article
              key={verb.id}
              className="rounded-2xl border border-border-subtle bg-surface-muted p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => practiceVerb(verb.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="block text-base font-bold text-text-primary">
                    {verb.base}
                    <span className="font-medium text-text-tertiary"> · {verb.russian}</span>
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-text-secondary">
                    {verb.pastSimple} · {verb.pastParticiple}
                  </span>
                </button>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    learnedIds.has(verb.id)
                      ? 'bg-success-soft text-success'
                      : hardIds.has(verb.id)
                        ? 'bg-warning-soft text-warning'
                        : 'bg-surface text-text-tertiary'
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

import { useEffect, useState } from 'react'
import CategoryChips from '../components/CategoryChips'
import VocabularyTabs from '../components/VocabularyTabs'
import {
  getPhrasalVerbsByCategory,
  phrasalVerbCategories,
  type PhrasalVerb,
  type PhrasalVerbFilter,
} from '../data/phrasalVerbs'
import {
  knownInPhrasalVerbCategory,
  knownPhrasalVerbsCount,
  markPhrasalVerb,
  recordCardsViewed,
  useProgress,
} from '../hooks/useProgress'
import { useSpeech } from '../hooks/useSpeech'

interface PhrasalVerbsProps {
  initialCategory?: PhrasalVerbFilter
  onBack: () => void
  onWords: () => void
  onIdioms: () => void
  onStartQuiz: (category: PhrasalVerbFilter) => void
}

function PhrasalVerbs({
  initialCategory = 'all',
  onBack,
  onWords,
  onIdioms,
  onStartQuiz,
}: PhrasalVerbsProps) {
  const progress = useProgress()
  const { speak, isSupported } = useSpeech()

  const [activeCategory, setActiveCategory] =
    useState<PhrasalVerbFilter>(initialCategory)
  const [expandedPhrasalVerbId, setExpandedPhrasalVerbId] = useState<
    string | null
  >(null)

  useEffect(() => {
    recordCardsViewed()
  }, [])

  const visiblePhrasalVerbs = getPhrasalVerbsByCategory(activeCategory)
  const visibleKnown = knownInPhrasalVerbCategory(
    progress,
    visiblePhrasalVerbs.map((phrasalVerb) => phrasalVerb.id),
  )
  const totalKnown = knownPhrasalVerbsCount(progress)

  function handleCategoryChange(category: PhrasalVerbFilter) {
    setActiveCategory(category)
    setExpandedPhrasalVerbId(null)
  }

  function toggleExpanded(phrasalVerbId: string) {
    setExpandedPhrasalVerbId((current) =>
      current === phrasalVerbId ? null : phrasalVerbId,
    )
  }

  function renderMeanings(phrasalVerb: PhrasalVerb) {
    if (phrasalVerb.meanings.length === 1) {
      const meaning = phrasalVerb.meanings[0]

      return (
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-800">{meaning.example}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            {meaning.exampleTranslation}
          </p>
        </div>
      )
    }

    return (
      <ol className="flex list-decimal flex-col gap-3 pl-5">
        {phrasalVerb.meanings.map((meaning) => (
          <li key={`${phrasalVerb.id}:${meaning.russian}`} className="pl-1">
            <p className="text-sm font-semibold text-slate-900">{meaning.russian}</p>
            <div className="mt-2 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-800">
                {meaning.example}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {meaning.exampleTranslation}
              </p>
            </div>
          </li>
        ))}
      </ol>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col px-5 py-8">
      <header className="mb-6">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
        >
          ← На главную
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Фразовые глаголы
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Частые сочетания с несколькими живыми значениями
            </p>
          </div>
          <button
            type="button"
            onClick={() => onStartQuiz(activeCategory)}
            className="shrink-0 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            🎯 Квиз
          </button>
        </div>
      </header>

      <VocabularyTabs
        active="phrasal-verbs"
        onWords={onWords}
        onIdioms={onIdioms}
        onPhrasalVerbs={() => undefined}
      />

      <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Прогресс по фразовым глаголам
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {activeCategory === 'all'
                ? `${totalKnown} из ${visiblePhrasalVerbs.length} отмечено как "Знаю"`
                : `${visibleKnown} из ${visiblePhrasalVerbs.length} в этой категории`}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-3 py-2 text-right">
            <p className="text-xs text-slate-400">Всего</p>
            <p className="text-lg font-semibold text-slate-900">
              {visiblePhrasalVerbs.length}
            </p>
          </div>
        </div>
      </section>

      <CategoryChips
        active={activeCategory}
        categories={phrasalVerbCategories}
        onChange={handleCategoryChange}
      />

      <ul className="flex flex-col gap-3">
        {visiblePhrasalVerbs.map((phrasalVerb) => {
          const isExpanded = expandedPhrasalVerbId === phrasalVerb.id
          const hasMultipleMeanings = phrasalVerb.meanings.length > 1
          const showDetails = !hasMultipleMeanings || isExpanded
          const primaryMeaning = phrasalVerb.meanings[0]
          const status = progress.phrasalVerbProgress[phrasalVerb.id]?.status
          const heading = (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                  {phrasalVerb.phrase}
                </h2>
                {status === 'known' && (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    Знаю
                  </span>
                )}
                {status === 'learning' && (
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    Учу
                  </span>
                )}
                {hasMultipleMeanings && (
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                    {phrasalVerb.meanings.length} значения
                  </span>
                )}
              </div>
              {!hasMultipleMeanings && (
                <p className="mt-3 text-sm leading-relaxed text-slate-700">
                  {primaryMeaning.russian}
                </p>
              )}
            </>
          )

          return (
            <li
              key={phrasalVerb.id}
              className={`rounded-2xl border bg-white p-4 shadow-sm transition-colors ${
                isExpanded
                  ? 'border-indigo-200 shadow-md'
                  : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {hasMultipleMeanings ? (
                  <button
                    type="button"
                    onClick={() => toggleExpanded(phrasalVerb.id)}
                    aria-expanded={isExpanded}
                    className="flex-1 text-left"
                  >
                    {heading}
                  </button>
                ) : (
                  <div className="flex-1 text-left">{heading}</div>
                )}

                {isSupported && (
                  <button
                    type="button"
                    onClick={() => speak(phrasalVerb.phrase)}
                    aria-label={`Произнести ${phrasalVerb.phrase}`}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xl transition-transform hover:scale-105 active:scale-95"
                  >
                    🔊
                  </button>
                )}
              </div>

              {showDetails && (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  {renderMeanings(phrasalVerb)}

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => markPhrasalVerb(phrasalVerb.id, 'learning')}
                      className={`min-h-11 flex-1 rounded-xl border px-4 text-sm font-semibold transition-colors ${
                        status === 'learning'
                          ? 'border-amber-400 bg-amber-50 text-amber-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-amber-300'
                      }`}
                    >
                      📘 Учу
                    </button>
                    <button
                      type="button"
                      onClick={() => markPhrasalVerb(phrasalVerb.id, 'known')}
                      className={`min-h-11 flex-1 rounded-xl border px-4 text-sm font-semibold transition-colors ${
                        status === 'known'
                          ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300'
                      }`}
                    >
                      ✓ Знаю
                    </button>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default PhrasalVerbs

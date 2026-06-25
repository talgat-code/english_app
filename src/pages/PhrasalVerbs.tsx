import { useEffect, useState } from 'react'
import CategoryChips from '../components/CategoryChips'
import VocabularyTabs from '../components/VocabularyTabs'
import {
  getPhrasalVerbById,
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
  initialExpandedPhrasalVerbId?: string
  onBack: () => void
  onSearch: () => void
  onWords: () => void
  onIdioms: () => void
  onStartQuiz: (category: PhrasalVerbFilter) => void
}

function PhrasalVerbs({
  initialCategory = 'all',
  initialExpandedPhrasalVerbId,
  onBack,
  onSearch,
  onWords,
  onIdioms,
  onStartQuiz,
}: PhrasalVerbsProps) {
  const initialExpandedPhrasalVerb = initialExpandedPhrasalVerbId
    ? getPhrasalVerbById(initialExpandedPhrasalVerbId)
    : undefined
  const progress = useProgress()
  const { speak, isSupported } = useSpeech()

  const [activeCategory, setActiveCategory] = useState<PhrasalVerbFilter>(
    initialExpandedPhrasalVerb?.category ?? initialCategory,
  )
  const [expandedPhrasalVerbId, setExpandedPhrasalVerbId] = useState<
    string | null
  >(initialExpandedPhrasalVerb?.id ?? null)

  useEffect(() => {
    recordCardsViewed()
  }, [])

  useEffect(() => {
    if (!initialExpandedPhrasalVerb) return

    requestAnimationFrame(() => {
      document
        .getElementById(`phrasal-verb-card-${initialExpandedPhrasalVerb.id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }, [initialExpandedPhrasalVerb])

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
        <div className="rounded-2xl bg-surface-muted p-4">
          <p className="text-sm font-medium text-text-primary">{meaning.example}</p>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            {meaning.exampleTranslation}
          </p>
        </div>
      )
    }

    return (
      <ol className="flex list-decimal flex-col gap-3 pl-5">
        {phrasalVerb.meanings.map((meaning) => (
          <li key={`${phrasalVerb.id}:${meaning.russian}`} className="pl-1">
            <p className="text-sm font-semibold text-text-primary">{meaning.russian}</p>
            <div className="mt-2 rounded-2xl bg-surface-muted p-4">
              <p className="text-sm font-medium text-text-primary">
                {meaning.example}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {meaning.exampleTranslation}
              </p>
            </div>
          </li>
        ))}
      </ol>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col px-4 py-8">
      <header className="mb-6">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          ← На главную
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Фразовые глаголы
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Частые сочетания с несколькими живыми значениями
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onSearch}
              aria-label="Открыть поиск"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-lg shadow-sm transition-colors hover:bg-surface-muted"
            >
              🔍
            </button>
            <button
              type="button"
              onClick={() => onStartQuiz(activeCategory)}
              className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              🎯 Квиз
            </button>
          </div>
        </div>
      </header>

      <VocabularyTabs
        active="phrasal-verbs"
        onWords={onWords}
        onIdioms={onIdioms}
        onPhrasalVerbs={() => undefined}
      />

      <section className="mb-5 rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              Прогресс по фразовым глаголам
            </p>
            <p className="mt-2 text-lg font-semibold text-text-primary">
              {activeCategory === 'all'
                ? `${totalKnown} из ${visiblePhrasalVerbs.length} отмечено как "Знаю"`
                : `${visibleKnown} из ${visiblePhrasalVerbs.length} в этой категории`}
            </p>
          </div>
          <div className="rounded-2xl bg-surface-muted px-3 py-2 text-right">
            <p className="text-xs text-text-tertiary">Всего</p>
            <p className="text-lg font-semibold text-text-primary">
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
                <h2 className="text-xl font-semibold tracking-tight text-text-primary">
                  {phrasalVerb.phrase}
                </h2>
                {status === 'known' && (
                  <span className="rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">
                    Знаю
                  </span>
                )}
                {status === 'learning' && (
                  <span className="rounded-full bg-warning-soft px-2.5 py-1 text-xs font-semibold text-warning">
                    Учу
                  </span>
                )}
                {hasMultipleMeanings && (
                  <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary dark:text-text-primary">
                    {phrasalVerb.meanings.length} значения
                  </span>
                )}
              </div>
              {!hasMultipleMeanings && (
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {primaryMeaning.russian}
                </p>
              )}
            </>
          )

          return (
            <li
              key={phrasalVerb.id}
              id={`phrasal-verb-card-${phrasalVerb.id}`}
              className={`rounded-2xl border bg-surface p-4 shadow-sm transition-colors ${
                isExpanded
                  ? 'border-primary-border shadow-md'
                  : 'border-border-subtle hover:border-border'
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
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xl transition-transform hover:scale-105 active:scale-95"
                  >
                    🔊
                  </button>
                )}
              </div>

              {showDetails && (
                <div className="mt-4 border-t border-border-subtle pt-4">
                  {renderMeanings(phrasalVerb)}

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => markPhrasalVerb(phrasalVerb.id, 'learning')}
                      className={`min-h-11 flex-1 rounded-xl border px-4 text-sm font-semibold transition-colors ${
                        status === 'learning'
                          ? 'border-warning bg-warning-soft text-warning'
                          : 'border-border bg-surface text-text-secondary hover:border-warning-border'
                      }`}
                    >
                      📘 Учу
                    </button>
                    <button
                      type="button"
                      onClick={() => markPhrasalVerb(phrasalVerb.id, 'known')}
                      className={`min-h-11 flex-1 rounded-xl border px-4 text-sm font-semibold transition-colors ${
                        status === 'known'
                          ? 'border-success bg-success-soft text-success'
                          : 'border-border bg-surface text-text-secondary hover:border-success-border'
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

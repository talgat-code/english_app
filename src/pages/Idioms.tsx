import { useEffect, useState } from 'react'
import CategoryChips from '../components/CategoryChips'
import ExpressionCard from '../components/ExpressionCard'
import VocabularyTabs from '../components/VocabularyTabs'
import {
  getIdiomById,
  getIdiomsByCategory,
  idiomCategories,
} from '../data/idioms'
import {
  knownIdiomsCount,
  knownInIdiomCategory,
  markIdiom,
  recordCardsViewed,
  useProgress,
} from '../hooks/useProgress'
import { useSpeech } from '../hooks/useSpeech'
import type { IdiomFilter } from '../types'

interface IdiomsProps {
  initialCategory?: IdiomFilter
  initialExpandedIdiomId?: string
  onBack: () => void
  onSearch: () => void
  onWords: () => void
  onPhrasalVerbs: () => void
  onStartQuiz: (category: IdiomFilter) => void
}

function Idioms({
  initialCategory = 'all',
  initialExpandedIdiomId,
  onBack,
  onSearch,
  onWords,
  onPhrasalVerbs,
  onStartQuiz,
}: IdiomsProps) {
  const initialExpandedIdiom = initialExpandedIdiomId
    ? getIdiomById(initialExpandedIdiomId)
    : undefined
  const progress = useProgress()
  const { speak, isSupported } = useSpeech()

  const [activeCategory, setActiveCategory] = useState<IdiomFilter>(
    initialExpandedIdiom?.category ?? initialCategory,
  )
  const [expandedIdiomId, setExpandedIdiomId] = useState<string | null>(
    initialExpandedIdiom?.id ?? null,
  )

  useEffect(() => {
    recordCardsViewed()
  }, [])

  useEffect(() => {
    if (!initialExpandedIdiom) return

    requestAnimationFrame(() => {
      document
        .getElementById(`idiom-card-${initialExpandedIdiom.id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }, [initialExpandedIdiom])

  const visibleIdioms = getIdiomsByCategory(activeCategory)
  const visibleKnown = knownInIdiomCategory(
    progress,
    visibleIdioms.map((idiom) => idiom.id),
  )
  const totalKnown = knownIdiomsCount(progress)

  function handleCategoryChange(category: IdiomFilter) {
    setActiveCategory(category)
    setExpandedIdiomId(null)
  }

  function toggleExpanded(idiomId: string) {
    setExpandedIdiomId((current) => (current === idiomId ? null : idiomId))
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
              Идиомы и разговорные выражения
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Частые фразы, которые реально звучат в живой речи
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
        active="idioms"
        onWords={onWords}
        onIdioms={() => undefined}
        onPhrasalVerbs={onPhrasalVerbs}
      />

      <section className="mb-5 rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              Прогресс по идиомам
            </p>
            <p className="mt-2 text-lg font-semibold text-text-primary">
              {activeCategory === 'all'
                ? `${totalKnown} из ${visibleIdioms.length} отмечено как "Знаю"`
                : `${visibleKnown} из ${visibleIdioms.length} в этой категории`}
            </p>
          </div>
          <div className="rounded-2xl bg-surface-muted px-3 py-2 text-right">
            <p className="text-xs text-text-tertiary">Всего</p>
            <p className="text-lg font-semibold text-text-primary">{visibleIdioms.length}</p>
          </div>
        </div>
      </section>

      <CategoryChips
        active={activeCategory}
        categories={idiomCategories}
        onChange={handleCategoryChange}
      />

      <ul className="flex flex-col gap-3">
        {visibleIdioms.map((idiom) => {
          const isExpanded = expandedIdiomId === idiom.id
          const status = progress.idiomProgress[idiom.id]?.status

          return (
            <ExpressionCard
              key={idiom.id}
              cardId={`idiom-card-${idiom.id}`}
              title={idiom.phrase}
              status={status}
              isHighlighted={isExpanded}
              onToggle={() => toggleExpanded(idiom.id)}
              onSpeak={isSupported ? () => speak(idiom.phrase) : undefined}
              speakLabel={`Произнести ${idiom.phrase}`}
              subtitle={
                <p className="mt-1 text-sm italic text-text-tertiary">
                  "{idiom.literal}" 💬
                </p>
              }
              summary={
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {idiom.meaning}
                </p>
              }
            >
              {isExpanded && (
                <>
                  <div className="rounded-2xl bg-surface-muted p-4">
                    <p className="text-sm font-medium text-text-primary">{idiom.example}</p>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {idiom.exampleTranslation}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => markIdiom(idiom.id, 'learning')}
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
                      onClick={() => markIdiom(idiom.id, 'known')}
                      className={`min-h-11 flex-1 rounded-xl border px-4 text-sm font-semibold transition-colors ${
                        status === 'known'
                          ? 'border-success bg-success-soft text-success'
                          : 'border-border bg-surface text-text-secondary hover:border-success-border'
                      }`}
                    >
                      ✓ Знаю
                    </button>
                  </div>
                </>
              )}
            </ExpressionCard>
          )
        })}
      </ul>
    </div>
  )
}

export default Idioms

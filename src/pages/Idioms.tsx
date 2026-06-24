import { useEffect, useState } from 'react'
import CategoryChips from '../components/CategoryChips'
import VocabularyTabs from '../components/VocabularyTabs'
import {
  getIdiomById,
  getIdiomsByCategory,
  idiomCategories,
  type IdiomFilter,
} from '../data/idioms'
import {
  knownIdiomsCount,
  knownInIdiomCategory,
  markIdiom,
  recordCardsViewed,
  useProgress,
} from '../hooks/useProgress'
import { useSpeech } from '../hooks/useSpeech'

interface IdiomsProps {
  initialCategory?: IdiomFilter
  initialExpandedIdiomId?: string
  onBack: () => void
  onWords: () => void
  onPhrasalVerbs: () => void
  onStartQuiz: (category: IdiomFilter) => void
}

function Idioms({
  initialCategory = 'all',
  initialExpandedIdiomId,
  onBack,
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
              Идиомы и разговорные выражения
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Частые фразы, которые реально звучат в живой речи
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
        active="idioms"
        onWords={onWords}
        onIdioms={() => undefined}
        onPhrasalVerbs={onPhrasalVerbs}
      />

      <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Прогресс по идиомам
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {activeCategory === 'all'
                ? `${totalKnown} из ${visibleIdioms.length} отмечено как "Знаю"`
                : `${visibleKnown} из ${visibleIdioms.length} в этой категории`}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-3 py-2 text-right">
            <p className="text-xs text-slate-400">Всего</p>
            <p className="text-lg font-semibold text-slate-900">{visibleIdioms.length}</p>
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
            <li
              key={idiom.id}
              id={`idiom-card-${idiom.id}`}
              className={`rounded-2xl border bg-white p-4 shadow-sm transition-colors ${
                isExpanded
                  ? 'border-indigo-200 shadow-md'
                  : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => toggleExpanded(idiom.id)}
                  className="flex-1 text-left"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                      {idiom.phrase}
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
                  </div>
                  <p className="mt-1 text-sm italic text-slate-400">
                    "{idiom.literal}" 💬
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">
                    {idiom.meaning}
                  </p>
                </button>

                {isSupported && (
                  <button
                    type="button"
                    onClick={() => speak(idiom.phrase)}
                    aria-label={`Произнести ${idiom.phrase}`}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xl transition-transform hover:scale-105 active:scale-95"
                  >
                    🔊
                  </button>
                )}
              </div>

              {isExpanded && (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-800">{idiom.example}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      {idiom.exampleTranslation}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => markIdiom(idiom.id, 'learning')}
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
                      onClick={() => markIdiom(idiom.id, 'known')}
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

export default Idioms

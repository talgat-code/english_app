import VocabularyTabs from '../components/VocabularyTabs'
import { categories } from '../data/words'
import { knownInCategory, useProgress } from '../hooks/useProgress'

export type StudyMode = 'flashcards' | 'quiz'

interface CategoriesProps {
  onSelectCategory: (categoryId: string, mode: StudyMode) => void
  onBack: () => void
  onSearch: () => void
  onIdioms: () => void
  onPhrasalVerbs: () => void
}

function Categories({
  onSelectCategory,
  onBack,
  onSearch,
  onIdioms,
  onPhrasalVerbs,
}: CategoriesProps) {
  const progress = useProgress()

  return (
    <div className="flex min-h-screen w-full flex-col px-4 py-8">
      <header className="mb-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            ← На главную
          </button>
          <button
            type="button"
            onClick={onSearch}
            aria-label="Открыть поиск"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-lg shadow-sm transition-colors hover:bg-surface-muted"
          >
            🔍
          </button>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Выбери категорию
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Учи слова карточками или проверяй себя квизом
        </p>
      </header>

      <VocabularyTabs
        active="words"
        onWords={() => undefined}
        onIdioms={onIdioms}
        onPhrasalVerbs={onPhrasalVerbs}
      />

      <ul className="flex flex-col gap-3">
        {categories.map((category) => {
          const total = category.words.length
          const learned = knownInCategory(
            progress,
            category.words.map((w) => w.id),
          )
          const percent = total > 0 ? Math.round((learned / total) * 100) : 0
          return (
          <li
            key={category.id}
            className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-2xl">
                {category.emoji}
              </span>
              <span className="flex flex-col">
                <span className="text-base font-semibold text-text-primary">
                  {category.title}
                </span>
                <span className="text-sm text-text-secondary">
                  {category.words.length} слов
                </span>
              </span>
            </div>

            {/* Mini progress: known words in this category */}
            <div className="mt-3 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-entrance ease-out"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="shrink-0 text-xs font-medium text-text-tertiary">
                {learned} / {total}
              </span>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => onSelectCategory(category.id, 'flashcards')}
                className="min-h-12 flex-1 rounded-xl border border-border bg-surface text-sm font-semibold text-text-secondary transition-all hover:border-primary-border hover:bg-primary-soft/50 active:scale-[0.98]"
              >
                🃏 Карточки
              </button>
              <button
                type="button"
                onClick={() => onSelectCategory(category.id, 'quiz')}
                className="min-h-12 flex-1 rounded-xl bg-primary text-sm font-semibold text-white transition-all hover:bg-primary-hover active:scale-[0.98]"
              >
                🎯 Квиз
              </button>
            </div>
          </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Categories

import { categories } from '../data/words'

export type StudyMode = 'flashcards' | 'quiz'

interface CategoriesProps {
  onSelectCategory: (categoryId: string, mode: StudyMode) => void
  onBack: () => void
}

function Categories({ onSelectCategory, onBack }: CategoriesProps) {
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
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Выбери категорию
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Учи слова карточками или проверяй себя квизом
        </p>
      </header>

      <ul className="flex flex-col gap-3">
        {categories.map((category) => (
          <li
            key={category.id}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
                {category.emoji}
              </span>
              <span className="flex flex-col">
                <span className="text-base font-semibold text-slate-900">
                  {category.title}
                </span>
                <span className="text-sm text-slate-500">
                  {category.words.length} слов
                </span>
              </span>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => onSelectCategory(category.id, 'flashcards')}
                className="min-h-12 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition-all hover:border-indigo-300 hover:bg-indigo-50/50 active:scale-[0.98]"
              >
                🃏 Карточки
              </button>
              <button
                type="button"
                onClick={() => onSelectCategory(category.id, 'quiz')}
                className="min-h-12 flex-1 rounded-xl bg-indigo-600 text-sm font-semibold text-white transition-all hover:bg-indigo-700 active:scale-[0.98]"
              >
                🎯 Квиз
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Categories

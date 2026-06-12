import { categories } from '../data/words'

interface CategoriesProps {
  onSelectCategory: (categoryId: string) => void
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
          Учи слова по темам с карточками
        </p>
      </header>

      <ul className="flex flex-col gap-3">
        {categories.map((category) => (
          <li key={category.id}>
            <button
              type="button"
              onClick={() => onSelectCategory(category.id)}
              className="flex w-full items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm"
            >
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
              <span className="ml-auto text-slate-300">›</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Categories

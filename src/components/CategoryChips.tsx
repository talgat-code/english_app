interface CategoryChip<Option extends string> {
  id: Option
  label: string
}

interface CategoryChipsProps<Option extends string> {
  active: Option | 'all'
  categories: readonly CategoryChip<Option>[]
  onChange: (category: Option | 'all') => void
  allLabel?: string
}

function chipClasses(active: boolean): string {
  return `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
    active
      ? 'bg-slate-950 text-white'
      : 'bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50'
  }`
}

function CategoryChips<Option extends string>({
  active,
  categories,
  onChange,
  allLabel = 'Все',
}: CategoryChipsProps<Option>) {
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange('all')}
        className={chipClasses(active === 'all')}
      >
        {allLabel}
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onChange(category.id)}
          className={chipClasses(category.id === active)}
        >
          {category.label}
        </button>
      ))}
    </div>
  )
}

export default CategoryChips

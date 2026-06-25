import { useState } from 'react'
import {
  prepositionCategories,
  type PrepositionCategoryId,
} from '../data/prepositions'

function Prepositions() {
  const [activeId, setActiveId] = useState<PrepositionCategoryId>('place')
  const active =
    prepositionCategories.find((category) => category.id === activeId) ??
    prepositionCategories[0]

  return (
    <section className="mt-5">
      <div className="rounded-lg border border-border bg-surface p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          Предлоги
        </p>
        <h2 className="mt-2 text-xl font-semibold text-text-primary">
          Где, когда и как использовать
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          Раздел разбит по смыслу, чтобы выбирать предлог не переводом, а
          ситуацией.
        </p>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {prepositionCategories.map((category) => {
          const isActive = category.id === active.id
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveId(category.id)}
              className={`shrink-0 rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-surface text-text-secondary hover:bg-surface-muted'
              }`}
            >
              {category.title}
            </button>
          )
        })}
      </div>

      <div className="mt-4 rounded-lg border border-border bg-surface p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              {active.question}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-text-primary">
              {active.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">
              {active.description}
            </p>
          </div>
          <span className="rounded-md bg-surface-muted px-2 py-1 text-xs font-semibold text-text-secondary">
            {active.items.length}
          </span>
        </div>
      </div>

      <ul className="mt-3 flex flex-col gap-3">
        {active.items.map((item) => (
          <li
            key={item.id}
            className="rounded-lg border border-border bg-surface p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-lg font-semibold text-text-primary">
                  {item.preposition}
                </p>
                <p className="mt-1 text-sm font-medium text-text-secondary">
                  {item.meaning}
                </p>
              </div>
              <span className="rounded-md bg-surface-muted px-2 py-1 text-xs font-semibold text-text-secondary">
                {item.pattern}
              </span>
            </div>

            <div className="mt-4 border-t border-border-subtle pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                Когда использовать
              </p>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                {item.use}
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {item.examples.map((example) => (
                <div
                  key={example.english}
                  className="rounded-md bg-surface-muted px-3 py-2"
                >
                  <p className="text-sm font-semibold text-text-primary">
                    {example.english}
                  </p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {example.russian}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-md border border-warning-border bg-warning-soft px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-warning">
                Частая ошибка
              </p>
              <p className="mt-1 text-sm leading-relaxed text-warning">
                {item.commonMistake}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Prepositions

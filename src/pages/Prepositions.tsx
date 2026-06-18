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
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Предлоги
        </p>
        <h2 className="mt-2 text-xl font-semibold text-slate-950">
          Где, когда и как использовать
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
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
                  ? 'border-slate-950 bg-slate-950 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {category.title}
            </button>
          )
        })}
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {active.question}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-950">
              {active.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              {active.description}
            </p>
          </div>
          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
            {active.items.length}
          </span>
        </div>
      </div>

      <ul className="mt-3 flex flex-col gap-3">
        {active.items.map((item) => (
          <li
            key={item.id}
            className="rounded-lg border border-slate-200 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-lg font-semibold text-slate-950">
                  {item.preposition}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-600">
                  {item.meaning}
                </p>
              </div>
              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                {item.pattern}
              </span>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Когда использовать
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">
                {item.use}
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {item.examples.map((example) => (
                <div
                  key={example.english}
                  className="rounded-md bg-slate-50 px-3 py-2"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {example.english}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {example.russian}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                Частая ошибка
              </p>
              <p className="mt-1 text-sm leading-relaxed text-amber-900">
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

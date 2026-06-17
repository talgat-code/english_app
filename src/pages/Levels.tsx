import { useState } from 'react'
import { getLessonsByLevel, lessonLevels } from '../data/lessons'
import { useProgress } from '../hooks/useProgress'
import type { LessonLevel } from '../types/lesson'
import {
  completedLessonCount,
  isLevelComplete,
  isLevelUnlocked,
} from '../utils/lessonProgress'
import GerundInfinitive from './GerundInfinitive'
import Prepositions from './Prepositions'

interface LevelsProps {
  onSelectLevel: (level: LessonLevel) => void
}

function Levels({ onSelectLevel }: LevelsProps) {
  const progress = useProgress()
  const [activeTab, setActiveTab] = useState<
    'levels' | 'prepositions' | 'gerund'
  >('levels')

  return (
    <div className="flex min-h-screen w-full flex-col px-5 py-6">
      <header className="border-b border-slate-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Учебный план
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Уровни
        </h1>
      </header>

      <div className="mt-5 grid grid-cols-3 rounded-lg border border-slate-200 bg-white p-1">
        <button
          type="button"
          onClick={() => setActiveTab('levels')}
          className={`min-h-10 rounded-md text-xs font-semibold transition-colors ${
            activeTab === 'levels'
              ? 'bg-slate-950 text-white'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          Уровни
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('prepositions')}
          className={`min-h-10 rounded-md text-xs font-semibold transition-colors ${
            activeTab === 'prepositions'
              ? 'bg-slate-950 text-white'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          Предлоги
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('gerund')}
          className={`min-h-10 rounded-md text-xs font-semibold transition-colors ${
            activeTab === 'gerund'
              ? 'bg-slate-950 text-white'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          Gerund
        </button>
      </div>

      {activeTab === 'levels' ? (
        <ul className="mt-5 flex flex-col gap-3">
          {lessonLevels.map((level) => {
            const total = getLessonsByLevel(level.id).length
            const completed = completedLessonCount(progress, level.id)
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0
            const locked = !isLevelUnlocked(progress, level.id)
            const complete = isLevelComplete(progress, level.id)
            const status = locked ? 'Закрыт' : complete ? 'Завершен' : 'Доступен'

            return (
              <li key={level.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (!locked) onSelectLevel(level.id)
                  }}
                  disabled={locked}
                  className={`w-full rounded-lg border p-4 text-left transition-colors ${
                    locked
                      ? 'border-slate-200 bg-slate-100 text-slate-400'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md border text-sm font-semibold ${
                      locked
                        ? 'border-slate-200 bg-white text-slate-400'
                        : 'border-slate-300 bg-slate-50 text-slate-900'
                      }`}
                    >
                      {level.id}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-base font-semibold text-slate-950">
                          {level.name}
                        </span>
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-semibold ${
                            complete
                              ? 'bg-emerald-50 text-emerald-700'
                              : locked
                                ? 'bg-slate-200 text-slate-500'
                                : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {status}
                        </span>
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-slate-500">
                        {level.description}
                      </span>
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-slate-900 transition-all duration-500 ease-out"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-slate-500">
                      {completed}/{total}
                    </span>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      ) : activeTab === 'prepositions' ? (
        <Prepositions />
      ) : (
        <GerundInfinitive />
      )}
    </div>
  )
}

export default Levels

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
    <div className="flex min-h-screen w-full flex-col px-4 py-6">
      <header className="border-b border-border pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          Учебный план
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">
          Уровни
        </h1>
      </header>

      <div className="mt-5 grid grid-cols-3 rounded-lg border border-border bg-surface p-1">
        <button
          type="button"
          onClick={() => setActiveTab('levels')}
          className={`min-h-10 rounded-md text-xs font-semibold transition-colors ${
            activeTab === 'levels'
              ? 'bg-primary text-white'
              : 'text-text-secondary hover:bg-surface-muted'
          }`}
        >
          Уровни
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('prepositions')}
          className={`min-h-10 rounded-md text-xs font-semibold transition-colors ${
            activeTab === 'prepositions'
              ? 'bg-primary text-white'
              : 'text-text-secondary hover:bg-surface-muted'
          }`}
        >
          Предлоги
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('gerund')}
          className={`min-h-10 rounded-md text-xs font-semibold transition-colors ${
            activeTab === 'gerund'
              ? 'bg-primary text-white'
              : 'text-text-secondary hover:bg-surface-muted'
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
                      ? 'border-border bg-surface-muted text-text-tertiary'
                      : 'border-border bg-surface hover:border-border-strong hover:bg-surface-muted'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md border text-sm font-semibold ${
                      locked
                        ? 'border-border bg-surface text-text-tertiary'
                        : 'border-border-strong bg-surface-muted text-text-primary'
                      }`}
                    >
                      {level.id}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-base font-semibold text-text-primary">
                          {level.name}
                        </span>
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-semibold ${
                            complete
                              ? 'bg-success-soft text-success'
                              : locked
                                ? 'bg-border text-text-secondary'
                                : 'bg-surface-muted text-text-secondary'
                          }`}
                        >
                          {status}
                        </span>
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-text-secondary">
                        {level.description}
                      </span>
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-entrance ease-out"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-text-secondary">
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

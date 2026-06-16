import { getLessonsByLevel, lessonLevels } from '../data/lessons'
import { useProgress } from '../hooks/useProgress'
import type { LessonLevel } from '../types/lesson'
import {
  completedLessonCount,
  isLevelComplete,
  isLevelUnlocked,
} from '../utils/lessonProgress'

interface LevelsProps {
  onSelectLevel: (level: LessonLevel) => void
}

function Levels({ onSelectLevel }: LevelsProps) {
  const progress = useProgress()

  return (
    <div className="flex min-h-screen w-full flex-col px-5 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Уроки
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Двигайся по уровням от A1 к B1
        </p>
      </header>

      <ul className="flex flex-col gap-4">
        {lessonLevels.map((level) => {
          const total = getLessonsByLevel(level.id).length
          const completed = completedLessonCount(progress, level.id)
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0
          const locked = !isLevelUnlocked(progress, level.id)
          const complete = isLevelComplete(progress, level.id)

          return (
            <li key={level.id}>
              <button
                type="button"
                onClick={() => {
                  if (!locked) onSelectLevel(level.id)
                }}
                disabled={locked}
                className={`w-full rounded-2xl border p-5 text-left shadow-sm transition-all active:scale-[0.99] ${
                  locked
                    ? 'border-slate-100 bg-slate-100 text-slate-400'
                    : 'border-slate-100 bg-white text-slate-900 hover:border-indigo-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-indigo-500">
                      {level.id} · {level.name}
                    </p>
                    <h2 className="mt-1 text-xl font-bold tracking-tight">
                      {level.title}
                    </h2>
                  </div>
                  <span className="text-2xl">
                    {locked ? '🔒' : complete ? '🏆' : '📖'}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  {level.description}
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all duration-500 ease-out"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-slate-500">
                    {completed} из {total}
                  </span>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Levels


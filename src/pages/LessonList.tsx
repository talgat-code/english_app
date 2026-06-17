import { getLevelInfo, getLessonsByLevel } from '../data/lessons'
import { useProgress } from '../hooks/useProgress'
import type { LessonLevel } from '../types/lesson'
import { isLessonUnlocked } from '../utils/lessonProgress'

interface LessonListProps {
  level: LessonLevel
  onBack: () => void
  onSelectLesson: (lessonId: string) => void
}

function LessonList({ level, onBack, onSelectLesson }: LessonListProps) {
  const progress = useProgress()
  const lessons = getLessonsByLevel(level)
  const levelInfo = getLevelInfo(level)

  return (
    <div className="flex min-h-screen w-full flex-col px-5 py-6">
      <header className="border-b border-slate-200 pb-5">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-semibold text-slate-500 hover:text-slate-900"
        >
          ← Уровни
        </button>
        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">
          {level} · {levelInfo?.name}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Уроки уровня
        </h1>
      </header>

      <ul className="mt-5 flex flex-col gap-2">
        {lessons.map((lesson) => {
          const completed = progress.completedLessons.includes(lesson.id)
          const unlocked = isLessonUnlocked(progress, lesson)
          const score = progress.lessonScores[lesson.id]
          const status = completed
            ? 'Пройден'
            : unlocked
              ? 'Доступен'
              : 'Закрыт'

          return (
            <li key={lesson.id}>
              <button
                type="button"
                onClick={() => {
                  if (unlocked) onSelectLesson(lesson.id)
                }}
                disabled={!unlocked}
                className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
                  unlocked
                    ? 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    : 'border-slate-200 bg-slate-100 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border text-sm font-semibold ${
                      completed
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : unlocked
                          ? 'border-slate-300 bg-slate-50 text-slate-900'
                          : 'border-slate-200 bg-white text-slate-400'
                    }`}
                  >
                    {lesson.order}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-950">
                      {lesson.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      {status}
                      {completed && typeof score === 'number'
                        ? ` · ${score}%`
                        : ''}
                    </span>
                  </span>
                  <span className="text-sm text-slate-400">
                    {unlocked ? '→' : '—'}
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

export default LessonList

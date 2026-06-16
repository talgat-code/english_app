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
      <header className="mb-5">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          ← Уровни
        </button>
        <p className="mt-5 text-xs font-bold uppercase tracking-wide text-indigo-500">
          {levelInfo?.name}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          {level} уроки
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Проходи уроки по порядку, чтобы открыть следующий.
        </p>
      </header>

      <ul className="flex flex-col gap-3">
        {lessons.map((lesson) => {
          const completed = progress.completedLessons.includes(lesson.id)
          const unlocked = isLessonUnlocked(progress, lesson)
          const score = progress.lessonScores[lesson.id]
          const status = completed
            ? '✅ Пройден'
            : unlocked
              ? '🔓 Доступен'
              : '🔒 Заблокирован'

          return (
            <li key={lesson.id}>
              <button
                type="button"
                onClick={() => {
                  if (unlocked) onSelectLesson(lesson.id)
                }}
                disabled={!unlocked}
                className={`w-full rounded-2xl border p-4 text-left shadow-sm transition-all active:scale-[0.99] ${
                  unlocked
                    ? 'border-slate-100 bg-white hover:border-indigo-200 hover:shadow-md'
                    : 'border-slate-100 bg-slate-100 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                      completed
                        ? 'bg-emerald-50 text-emerald-600'
                        : unlocked
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'bg-white/70 text-slate-400'
                    }`}
                  >
                    {lesson.order}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-slate-900">
                      {lesson.title}
                    </span>
                    <span className="mt-0.5 block text-sm text-slate-500">
                      {status}
                      {completed && typeof score === 'number'
                        ? ` · лучший результат ${score}%`
                        : ''}
                    </span>
                  </span>
                </div>
                {!unlocked && (
                  <p className="mt-3 text-xs text-slate-400">
                    Нужно пройти предыдущий урок.
                  </p>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default LessonList


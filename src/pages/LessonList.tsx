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
    <div className="flex min-h-screen w-full flex-col px-4 py-6">
      <header className="border-b border-border pb-5">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-semibold text-text-secondary hover:text-text-primary"
        >
          ← Уровни
        </button>
        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          {level} · {levelInfo?.name}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">
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
                    ? 'border-border bg-surface hover:border-border-strong hover:bg-surface-muted'
                    : 'border-border bg-surface-muted text-text-tertiary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border text-sm font-semibold ${
                      completed
                        ? 'border-success-border bg-success-soft text-success'
                        : unlocked
                          ? 'border-border-strong bg-surface-muted text-text-primary'
                          : 'border-border bg-surface text-text-tertiary'
                    }`}
                  >
                    {lesson.order}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-text-primary">
                      {lesson.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-text-secondary">
                      {status}
                      {completed && typeof score === 'number'
                        ? ` · ${score}%`
                        : ''}
                    </span>
                  </span>
                  <span className="text-sm text-text-tertiary">
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

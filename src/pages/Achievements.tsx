import { useMemo, useState } from 'react'
import {
  achievements,
  achievementCategoryLabels,
  type AchievementCategory,
} from '../data/achievements'
import { useProgress } from '../hooks/useProgress'

type Filter = 'all' | AchievementCategory

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'streak', label: achievementCategoryLabels.streak },
  { id: 'words', label: achievementCategoryLabels.words },
  { id: 'quizzes', label: achievementCategoryLabels.quizzes },
  { id: 'expressions', label: achievementCategoryLabels.expressions },
  { id: 'games', label: achievementCategoryLabels.games },
  { id: 'lessons', label: achievementCategoryLabels.lessons },
  { id: 'special', label: achievementCategoryLabels.special },
]

interface AchievementsProps {
  onBack: () => void
}

function formatDate(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function Achievements({ onBack }: AchievementsProps) {
  const progress = useProgress()
  const [filter, setFilter] = useState<Filter>('all')

  const unlockedById = useMemo(
    () =>
      new Map(
        progress.unlockedAchievements.map((achievement) => [
          achievement.id,
          achievement,
        ]),
      ),
    [progress.unlockedAchievements],
  )
  const visibleAchievements = useMemo(
    () =>
      filter === 'all'
        ? achievements
        : achievements.filter((achievement) => achievement.category === filter),
    [filter],
  )
  const unlockedCount = progress.unlockedAchievements.length

  return (
    <div className="flex min-h-screen w-full flex-col px-4 py-6">
      <header className="mb-5">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          ← Назад
        </button>

        <div className="rounded-2xl border border-warning-border bg-warning-soft p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-warning">
            Достижения
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
            Получено {unlockedCount} из {achievements.length} 🏆
          </h1>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface">
            <div
              className="h-full rounded-full bg-warning transition-all duration-entrance ease-out"
              style={{
                width: `${Math.round((unlockedCount / achievements.length) * 100)}%`,
              }}
            />
          </div>
        </div>
      </header>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((item) => {
          const isActive = item.id === filter

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`shrink-0 rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
                isActive
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-surface text-text-secondary hover:bg-surface-muted'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      <ul className="grid grid-cols-2 gap-3 min-[420px]:grid-cols-3">
        {visibleAchievements.map((achievement) => {
          const unlocked = unlockedById.get(achievement.id)
          const unlockedDate = unlocked ? formatDate(unlocked.unlockedAt) : ''

          return (
            <li
              key={achievement.id}
              className={`min-h-40 rounded-2xl border p-4 shadow-sm transition-colors ${
                unlocked
                  ? 'border-warning-border bg-surface'
                  : 'border-border-subtle bg-surface-muted/70 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-2xl ${
                    unlocked
                      ? 'bg-warning-soft'
                      : 'bg-border text-text-tertiary grayscale'
                  }`}
                >
                  {achievement.icon}
                </span>
                <span
                  className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
                    unlocked
                      ? 'bg-success-soft text-success'
                      : 'bg-border text-text-tertiary'
                  }`}
                >
                  {unlocked ? 'Есть' : 'Скрыто'}
                </span>
              </div>
              <h2 className="mt-4 text-sm font-bold leading-tight text-text-primary">
                {achievement.title}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                {achievement.description}
              </p>
              {unlockedDate && (
                <p className="mt-3 text-[11px] font-semibold text-warning">
                  Получено {unlockedDate}
                </p>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Achievements

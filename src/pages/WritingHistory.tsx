import { useMemo, useState } from 'react'
import WritingFeedback from '../components/WritingFeedback'
import type { WritingHistoryItem } from '../types'
import { loadWritingHistory } from '../utils/writingHistory'

interface WritingHistoryProps {
  onBack: () => void
}

const MODE_LABELS: Record<WritingHistoryItem['mode'], string> = {
  free: 'Свободное письмо',
  topic: 'По теме',
  translation: 'Перевод',
}

function formatDate(date: string): string {
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  } catch {
    return date
  }
}

function scoreClass(score: number): string {
  if (score >= 8) return 'bg-success-soft text-success'
  if (score >= 5) return 'bg-warning-soft text-warning'
  return 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
}

function getWeekStart(date: Date): Date {
  const copy = new Date(date)
  const day = (copy.getDay() + 6) % 7
  copy.setDate(copy.getDate() - day)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function buildWeeklyAverages(items: WritingHistoryItem[]) {
  const groups = new Map<string, { date: Date; total: number; count: number }>()

  for (const item of items) {
    const weekStart = getWeekStart(new Date(item.date))
    const key = weekStart.toISOString().slice(0, 10)
    const current = groups.get(key) ?? { date: weekStart, total: 0, count: 0 }
    current.total += item.score
    current.count += 1
    groups.set(key, current)
  }

  return [...groups.entries()]
    .map(([key, group]) => ({
      key,
      label: new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'short',
      }).format(group.date),
      average: Math.round((group.total / group.count) * 10) / 10,
      count: group.count,
    }))
    .sort((a, b) => a.key.localeCompare(b.key))
}

function WritingHistory({ onBack }: WritingHistoryProps) {
  const [items] = useState(loadWritingHistory)
  const [selected, setSelected] = useState<WritingHistoryItem | null>(null)
  const weeklyAverages = useMemo(() => buildWeeklyAverages(items), [items])

  if (selected) {
    return (
      <WritingFeedback
        feedback={selected.feedback}
        text={selected.text}
        prompt={selected.prompt}
        onRetry={() => setSelected(null)}
        primaryLabel="К истории"
      />
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col px-4 py-6">
      <header className="mb-5 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          ← Письмо
        </button>
      </header>

      <section className="border-b border-border pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          Writing history
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">
          История работ
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          Здесь хранятся последние 20 проверенных текстов.
        </p>
      </section>

      {items.length === 0 ? (
        <div className="empty-state mt-6">
          <h2 className="text-lg font-semibold text-text-primary">
            История пока пустая
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Сохрани результат после проверки, и он появится здесь.
          </p>
        </div>
      ) : (
        <>
          {weeklyAverages.length >= 2 && (
            <section className="mt-5 rounded-lg border border-border bg-surface p-4">
              <h2 className="text-base font-semibold text-text-primary">
                Средняя оценка по неделям
              </h2>
              <div className="mt-4 flex flex-col gap-3">
                {weeklyAverages.map((week) => (
                  <div key={week.key}>
                    <div className="mb-1 flex items-center justify-between text-xs text-text-secondary">
                      <span>{week.label}</span>
                      <span>
                        {week.average}/10 · {week.count}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.min(100, week.average * 10)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <ul className="mt-5 flex flex-col gap-3">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setSelected(item)}
                  className="w-full rounded-lg border border-border bg-surface p-4 text-left transition-colors hover:bg-surface-muted"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-surface-muted px-2 py-1 text-xs font-semibold text-text-secondary">
                          {item.level}
                        </span>
                        <span className="text-xs font-semibold text-text-tertiary">
                          {MODE_LABELS[item.mode]}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-semibold leading-relaxed text-text-primary">
                        {item.prompt}
                      </p>
                      <p className="mt-2 text-xs text-text-tertiary">
                        {formatDate(item.date)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-md px-3 py-2 text-sm font-bold ${scoreClass(
                        item.score,
                      )}`}
                    >
                      {item.score}/10
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default WritingHistory

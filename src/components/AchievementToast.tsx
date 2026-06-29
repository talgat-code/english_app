import { useEffect, useState } from 'react'
import { getAchievementById, type Achievement } from '../data/achievements'
import { subscribeAchievementUnlocks } from '../hooks/useProgress'

interface QueuedAchievement extends Achievement {
  queueId: string
}

function vibrateBriefly() {
  if (typeof navigator === 'undefined') return

  const maybeNavigator = navigator as Navigator & {
    vibrate?: (pattern: number | number[]) => boolean
  }

  maybeNavigator.vibrate?.(45)
}

function AchievementToast() {
  const [queue, setQueue] = useState<QueuedAchievement[]>([])
  const [active, setActive] = useState<QueuedAchievement | null>(null)

  useEffect(
    () =>
      subscribeAchievementUnlocks((achievementIds) => {
        const queued = achievementIds
          .map(getAchievementById)
          .filter((achievement): achievement is Achievement => Boolean(achievement))
          .map((achievement, index) => ({
            ...achievement,
            queueId: `${Date.now()}-${index}-${achievement.id}`,
          }))

        if (queued.length > 0) {
          setQueue((current) => [...current, ...queued])
        }
      }),
    [],
  )

  useEffect(() => {
    if (active || queue.length === 0) return

    const timer = window.setTimeout(() => {
      setActive(queue[0])
      setQueue((current) => current.slice(1))
    }, 250)

    return () => window.clearTimeout(timer)
  }, [active, queue])

  useEffect(() => {
    if (!active) return

    vibrateBriefly()

    const timer = window.setTimeout(() => {
      setActive(null)
    }, 4000)

    return () => window.clearTimeout(timer)
  }, [active])

  if (!active) return null

  return (
    <button
      key={active.queueId}
      type="button"
      onClick={() => setActive(null)}
      className="achievement-toast-enter fixed left-1/2 top-4 z-50 flex w-[calc(100%-2rem)] max-w-[440px] -translate-x-1/2 items-center gap-3 rounded-2xl border border-warning-border bg-surface p-4 text-left shadow-[0_0_32px_rgba(245,158,11,0.32)]"
      aria-live="polite"
    >
      <span className="achievement-toast-glow flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-warning-border bg-warning-soft text-2xl">
        {active.icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-bold uppercase tracking-wide text-warning">
          Новое достижение
        </span>
        <span className="mt-1 block text-sm font-bold text-text-primary">
          {active.title}
        </span>
        <span className="mt-0.5 block text-xs leading-snug text-text-secondary">
          {active.description}
        </span>
      </span>
    </button>
  )
}

export default AchievementToast

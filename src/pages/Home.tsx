import { useEffect, useState } from 'react'
import type { Achievement } from '../data/achievements'
import type { LessonLevelInfo } from '../data/lessons'
import type { Idiom } from '../types'
import type { Lesson } from '../types/lesson'

interface HomeProps {
  hardWordCount: number
  streakInterrupted: boolean
  nextLesson?: Lesson
  currentLevel?: LessonLevelInfo
  onContinueLesson: () => void
  onLessons: () => void
  onVocabulary: () => void
  onIdioms: () => void
  onPhrasalVerbs: () => void
  onOpenIdiomOfDay: () => void
  onReview: () => void
  onAITutor: () => void
  onAIWords: () => void
  onIrregularVerbs: () => void
  onAchievements: () => void
  achievementTotal: number
  achievementUnlocked: number
  lastAchievement?: Achievement
  idiomOfDay: Idiom
}

function Home({
  hardWordCount,
  streakInterrupted,
  nextLesson,
  currentLevel,
  onContinueLesson,
  onLessons,
  onVocabulary,
  onIdioms,
  onPhrasalVerbs,
  onOpenIdiomOfDay,
  onReview,
  onAITutor,
  onAIWords,
  onIrregularVerbs,
  onAchievements,
  achievementTotal,
  achievementUnlocked,
  lastAchievement,
  idiomOfDay,
}: HomeProps) {
  const banners = [
    ...(hardWordCount > 3
      ? [
          {
            id: 'review',
            text: `К повторению: ${hardWordCount} слов`,
            action: onReview,
          },
        ]
      : []),
    ...(streakInterrupted
      ? [
          {
            id: 'streak',
            text: 'Серия прервалась. Сегодня можно спокойно вернуться в ритм.',
          },
        ]
      : []),
  ]
  const [bannerIndex, setBannerIndex] = useState(0)

  useEffect(() => {
    if (banners.length < 2) return

    const timer = setInterval(() => {
      setBannerIndex((current) => (current + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners.length])

  const banner = banners[bannerIndex % banners.length]

  return (
    <div className="flex min-h-screen flex-col px-4 py-6">
      <header className="border-b border-border pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          English App
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">
          Сегодняшнее обучение
        </h1>
      </header>

      {banner && (
        <div className="mt-5 rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-text-primary">{banner.text}</p>
            {'action' in banner && banner.action && (
              <button
                type="button"
                onClick={banner.action}
                className="shrink-0 rounded-md border border-border-strong px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:bg-surface-muted"
              >
                Повторить
              </button>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onAchievements}
        className="mt-5 rounded-lg border border-warning-border bg-warning-soft p-4 text-left transition-colors hover:bg-warning-soft/70"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-bold text-text-primary">
              Достижения: {achievementUnlocked}/{achievementTotal} 🏆
            </p>
            <p className="mt-1 truncate text-xs text-text-secondary">
              {lastAchievement
                ? `Последнее: ${lastAchievement.icon} ${lastAchievement.title}`
                : 'Первые награды ждут тебя'}
            </p>
          </div>
          <span className="text-sm font-semibold text-warning">→</span>
        </div>
      </button>

      <section className="mt-5 rounded-lg border border-border bg-surface p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              Продолжить
            </p>
            {nextLesson ? (
              <>
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-text-secondary">
                  <span className="rounded-md bg-surface-muted px-2 py-1 text-text-secondary">
                    {currentLevel?.id}
                  </span>
                  <span>Урок {nextLesson.order}</span>
                </div>
                <h2 className="mt-3 text-xl font-semibold leading-tight text-text-primary">
                  {nextLesson.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {nextLesson.description}
                </p>
              </>
            ) : (
              <>
                <h2 className="mt-3 text-xl font-semibold text-text-primary">
                  Все уроки пройдены
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  Можно закрепить слова или вернуться к любому уровню.
                </p>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={nextLesson ? onContinueLesson : onLessons}
          className="mt-5 min-h-11 w-full rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover active:bg-primary"
        >
          {nextLesson ? 'Продолжить урок' : 'Открыть уровни'}
        </button>
      </section>

      <button
        type="button"
        onClick={onOpenIdiomOfDay}
        className="mt-4 rounded-lg border border-warning-border bg-warning-soft p-4 text-left transition-colors hover:bg-warning-soft/70"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-warning">
              Идиома дня 💡
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary">
              {idiomOfDay.phrase}
            </h2>
            <p className="mt-1 text-sm italic text-text-tertiary">
              "{idiomOfDay.literal}"
            </p>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              {idiomOfDay.meaning}
            </p>
          </div>
          <span className="text-sm text-warning">→</span>
        </div>
      </button>

      <section className="mt-4 overflow-hidden rounded-lg border border-border bg-surface">
        <button
          type="button"
          onClick={onLessons}
          className="flex min-h-16 w-full items-center justify-between border-b border-border-subtle px-4 text-left transition-colors hover:bg-surface-muted"
        >
          <span>
            <span className="block text-sm font-semibold text-text-primary">Уроки</span>
            <span className="mt-0.5 block text-xs text-text-secondary">
              A1, A2, B1, предлоги и gerund
            </span>
          </span>
          <span className="text-sm text-text-tertiary">→</span>
        </button>
        <button
          type="button"
          onClick={onVocabulary}
          className="flex min-h-16 w-full items-center justify-between border-b border-border-subtle px-4 text-left transition-colors hover:bg-surface-muted"
        >
          <span>
            <span className="block text-sm font-semibold text-text-primary">
              Словарь
            </span>
            <span className="mt-0.5 block text-xs text-text-secondary">
              Карточки и квизы
            </span>
          </span>
          <span className="text-sm text-text-tertiary">→</span>
        </button>
        <button
          type="button"
          onClick={onIdioms}
          className="flex min-h-16 w-full items-center justify-between border-b border-border-subtle px-4 text-left transition-colors hover:bg-surface-muted"
        >
          <span>
            <span className="block text-sm font-semibold text-text-primary">
              Идиомы
            </span>
            <span className="mt-0.5 block text-xs text-text-secondary">
              Живая речь, выражения и квиз по значениям
            </span>
          </span>
          <span className="text-sm text-text-tertiary">→</span>
        </button>
        <button
          type="button"
          onClick={onPhrasalVerbs}
          className="flex min-h-16 w-full items-center justify-between border-b border-border-subtle px-4 text-left transition-colors hover:bg-surface-muted"
        >
          <span>
            <span className="block text-sm font-semibold text-text-primary">
              Фразовые глаголы
            </span>
            <span className="mt-0.5 block text-xs text-text-secondary">
              Give up, look for, get over и квиз по значениям
            </span>
          </span>
          <span className="text-sm text-text-tertiary">→</span>
        </button>
        <button
          type="button"
          onClick={onIrregularVerbs}
          className="flex min-h-16 w-full items-center justify-between px-4 text-left transition-colors hover:bg-surface-muted"
        >
          <span>
            <span className="block text-sm font-semibold text-text-primary">
              Неправильные глаголы
            </span>
            <span className="mt-0.5 block text-xs text-text-secondary">
              V1, V2, V3 и быстрые карточки
            </span>
          </span>
          <span className="text-sm text-text-tertiary">→</span>
        </button>
      </section>

      <section className="mt-4 rounded-lg border border-border bg-surface p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-text-primary">
              AI-помощник
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">
              Вопросы по теме и подбор новых слов.
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onAITutor}
            className="min-h-10 rounded-md border border-border-strong px-3 text-xs font-semibold text-text-secondary transition-colors hover:bg-surface-muted"
          >
            Спросить
          </button>
          <button
            type="button"
            onClick={onAIWords}
            className="min-h-10 rounded-md bg-surface-muted px-3 text-xs font-semibold text-text-secondary transition-colors hover:bg-border"
          >
            Новые слова
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home

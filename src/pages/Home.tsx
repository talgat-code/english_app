import { useEffect, useState } from 'react'
import type { LessonLevelInfo } from '../data/lessons'
import type { Lesson } from '../types/lesson'

interface HomeProps {
  hardWordCount: number
  streakInterrupted: boolean
  nextLesson?: Lesson
  currentLevel?: LessonLevelInfo
  onContinueLesson: () => void
  onLessons: () => void
  onVocabulary: () => void
  onReview: () => void
  onAITutor: () => void
  onAIWords: () => void
}

function Home({
  hardWordCount,
  streakInterrupted,
  nextLesson,
  currentLevel,
  onContinueLesson,
  onLessons,
  onVocabulary,
  onReview,
  onAITutor,
  onAIWords,
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
    <div className="flex min-h-screen flex-col px-5 py-6">
      <header className="border-b border-slate-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          English App
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Сегодняшнее обучение
        </h1>
      </header>

      {banner && (
        <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-800">{banner.text}</p>
            {'action' in banner && banner.action && (
              <button
                type="button"
                onClick={banner.action}
                className="shrink-0 rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Повторить
              </button>
            )}
          </div>
        </div>
      )}

      <section className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Продолжить
            </p>
            {nextLesson ? (
              <>
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-700">
                    {currentLevel?.id}
                  </span>
                  <span>Урок {nextLesson.order}</span>
                </div>
                <h2 className="mt-3 text-xl font-semibold leading-tight text-slate-950">
                  {nextLesson.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {nextLesson.description}
                </p>
              </>
            ) : (
              <>
                <h2 className="mt-3 text-xl font-semibold text-slate-950">
                  Все уроки пройдены
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Можно закрепить слова или вернуться к любому уровню.
                </p>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={nextLesson ? onContinueLesson : onLessons}
          className="mt-5 min-h-11 w-full rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 active:bg-slate-900"
        >
          {nextLesson ? 'Продолжить урок' : 'Открыть уровни'}
        </button>
      </section>

      <section className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <button
          type="button"
          onClick={onLessons}
          className="flex min-h-16 w-full items-center justify-between border-b border-slate-100 px-4 text-left transition-colors hover:bg-slate-50"
        >
          <span>
            <span className="block text-sm font-semibold text-slate-950">Уроки</span>
            <span className="mt-0.5 block text-xs text-slate-500">
              A1, A2, B1 и предлоги
            </span>
          </span>
          <span className="text-sm text-slate-400">→</span>
        </button>
        <button
          type="button"
          onClick={onVocabulary}
          className="flex min-h-16 w-full items-center justify-between px-4 text-left transition-colors hover:bg-slate-50"
        >
          <span>
            <span className="block text-sm font-semibold text-slate-950">
              Словарь
            </span>
            <span className="mt-0.5 block text-xs text-slate-500">
              Карточки и квизы
            </span>
          </span>
          <span className="text-sm text-slate-400">→</span>
        </button>
      </section>

      <section className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-950">
              AI-помощник
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              Вопросы по теме и подбор новых слов.
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onAITutor}
            className="min-h-10 rounded-md border border-slate-300 px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Спросить
          </button>
          <button
            type="button"
            onClick={onAIWords}
            className="min-h-10 rounded-md bg-slate-100 px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200"
          >
            Новые слова
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home

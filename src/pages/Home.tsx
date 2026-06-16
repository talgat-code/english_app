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
            text: `У тебя ${hardWordCount} слов для повторения 📖`,
            action: onReview,
          },
        ]
      : []),
    ...(streakInterrupted
      ? [
          {
            id: 'streak',
            text: 'Не теряй серию! Займись английским сегодня 🔥',
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
    <div className="flex min-h-screen flex-col px-6 py-8">
      {banner && (
        <div className="mb-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-left shadow-sm">
          <p className="font-semibold text-indigo-950">{banner.text}</p>
          {'action' in banner && banner.action && (
            <button
              type="button"
              onClick={banner.action}
              className="mt-3 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Повторить сейчас
            </button>
          )}
        </div>
      )}

      <header className="pt-2 text-center">
        <span className="text-5xl">📚</span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
          English App
        </h1>
        <p className="mt-3 text-base text-slate-500">
          Короткие уроки, слова и практика каждый день.
        </p>
      </header>

      <section className="mt-8 rounded-3xl border border-slate-100 bg-white p-5 text-left shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-indigo-500">
              Продолжить обучение
            </p>
            {nextLesson ? (
              <>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                  {currentLevel?.id} · урок {nextLesson.order}
                </h2>
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {nextLesson.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {nextLesson.description}
                </p>
              </>
            ) : (
              <>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                  Поздравляем!
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Ты прошел все уроки 🏆
                </p>
              </>
            )}
          </div>
          <span className="text-3xl">{nextLesson ? '🚀' : '🏆'}</span>
        </div>

        {nextLesson ? (
          <button
            type="button"
            onClick={onContinueLesson}
            className="mt-5 min-h-12 w-full rounded-2xl bg-indigo-600 px-5 font-semibold text-white transition-all hover:bg-indigo-700 active:scale-[0.98]"
          >
            Продолжить
          </button>
        ) : (
          <button
            type="button"
            onClick={onLessons}
            className="mt-5 min-h-12 w-full rounded-2xl bg-slate-900 px-5 font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.98]"
          >
            Посмотреть уровни
          </button>
        )}
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onLessons}
          className="min-h-24 rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition-all hover:border-indigo-200 active:scale-[0.98]"
        >
          <span className="text-2xl">📖</span>
          <span className="mt-2 block text-sm font-bold text-slate-900">
            Уроки
          </span>
          <span className="mt-1 block text-xs text-slate-500">A1 → B1</span>
        </button>
        <button
          type="button"
          onClick={onVocabulary}
          className="min-h-24 rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition-all hover:border-indigo-200 active:scale-[0.98]"
        >
          <span className="text-2xl">🗂️</span>
          <span className="mt-2 block text-sm font-bold text-slate-900">
            Словарь
          </span>
          <span className="mt-1 block text-xs text-slate-500">Карточки и квизы</span>
        </button>
      </section>

      <section className="mt-5 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 p-5 text-left text-white shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🤖</span>
          <div>
            <h2 className="font-bold">AI-репетитор</h2>
            <p className="text-xs text-white/75">Спроси или найди новые слова</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onAITutor}
            className="min-h-11 rounded-xl bg-white px-3 text-xs font-semibold text-indigo-700 transition-all active:scale-[0.98]"
          >
            Спросить репетитора
          </button>
          <button
            type="button"
            onClick={onAIWords}
            className="min-h-11 rounded-xl bg-white/15 px-3 text-xs font-semibold text-white ring-1 ring-white/30 transition-all active:scale-[0.98]"
          >
            Найти новые слова
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home


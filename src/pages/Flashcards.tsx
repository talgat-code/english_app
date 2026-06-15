import { useEffect, useRef, useState } from 'react'
import { getCategoryById, type Word } from '../data/words'
import {
  markWord,
  recordCardsViewed,
  useProgress,
  type WordStatus,
} from '../hooks/useProgress'
import { useSpeech } from '../hooks/useSpeech'

const AUTO_SPEECH_KEY = 'english-app:auto-speech'
const EMPTY_WORDS: Word[] = []

function loadAutoSpeech(): boolean {
  try {
    const saved = localStorage.getItem(AUTO_SPEECH_KEY)
    return saved === null ? true : saved === 'true'
  } catch {
    return true
  }
}

interface FlashcardsProps {
  categoryId?: string
  customWords?: Word[]
  categoryTitle?: string
  categoryEmoji?: string
  onBack: () => void
}

function Flashcards({
  categoryId,
  customWords,
  categoryTitle,
  categoryEmoji,
  onBack,
}: FlashcardsProps) {
  const category = categoryId ? getCategoryById(categoryId) : undefined
  const words = customWords ?? category?.words ?? EMPTY_WORDS
  const title = categoryTitle ?? category?.title ?? 'Мои слова'
  const emoji = categoryEmoji ?? category?.emoji ?? '💾'
  const saved = useProgress()
  const { speak, isSupported } = useSpeech()

  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [autoSpeech, setAutoSpeech] = useState(loadAutoSpeech)

  const touchStartX = useRef<number | null>(null)
  const lastAutoSpoken = useRef<string | null>(null)

  // Opening flashcards counts as a study activity (keeps the daily streak).
  useEffect(() => {
    recordCardsViewed()
  }, [])

  useEffect(() => {
    if (!autoSpeech || !isSupported) return
    const word = words[index]
    if (!word || lastAutoSpoken.current === word.id) return

    lastAutoSpoken.current = word.id
    speak(word.english)
  }, [autoSpeech, index, isSupported, speak, words])

  if (words.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-slate-500">Нет слов для флешкарт.</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white"
        >
          ← Назад
        </button>
      </div>
    )
  }

  const total = words.length
  const word = words[index]
  const progress = ((index + 1) / total) * 100

  function goTo(next: number) {
    if (next < 0 || next >= total) return
    setFlipped(false)
    setIndex(next)
  }

  function handlePrev() {
    goTo(index - 1)
  }

  function handleNext() {
    goTo(index + 1)
  }

  function toggleAutoSpeech() {
    const next = !autoSpeech
    setAutoSpeech(next)
    try {
      localStorage.setItem(AUTO_SPEECH_KEY, String(next))
    } catch {
      // The setting still works for the current session.
    }
  }

  function setStatus(status: WordStatus) {
    markWord(word.id, status)
    // Auto-advance to the next card if there is one.
    if (index < total - 1) {
      setTimeout(() => goTo(index + 1), 180)
    }
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    const threshold = 50
    if (deltaX > threshold) handlePrev()
    else if (deltaX < -threshold) handleNext()
    touchStartX.current = null
  }

  const currentStatus = saved.words[word.id]?.status

  return (
    <div className="flex min-h-screen w-full flex-col px-5 py-6">
      {/* Header: back + progress */}
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
          >
            ← Категории
          </button>
          <div className="flex items-center gap-3">
            {isSupported && (
              <button
                type="button"
                onClick={toggleAutoSpeech}
                aria-pressed={autoSpeech}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  autoSpeech
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                🔊 Авто
              </button>
            )}
            <span className="text-sm font-medium text-slate-500">
              {index + 1} из {total}
            </span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-lg">{emoji}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Card */}
      <div className="flex flex-1 items-center justify-center">
        <div
          className="relative w-full [perspective:1200px]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {isSupported && (
            <button
              type="button"
              onClick={() => speak(word.english)}
              aria-label={`Произнести ${word.english}`}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-xl shadow-sm transition-transform hover:scale-105 active:scale-95"
            >
              🔊
            </button>
          )}
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            aria-label="Перевернуть карточку"
            className="relative block h-80 w-full cursor-pointer transition-transform duration-500 [transform-style:preserve-3d]"
            style={{
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Front */}
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-xl [backface-visibility:hidden]">
              <span className="mb-3 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                {title}
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                {word.english}
              </h2>
              <p className="mt-2 text-lg text-slate-400">[{word.transcription}]</p>
              <p className="mt-6 text-xs text-slate-400">Нажми, чтобы перевернуть</p>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-indigo-100 bg-indigo-600 p-6 text-center text-white shadow-xl [backface-visibility:hidden]"
              style={{ transform: 'rotateY(180deg)' }}
            >
              <h2 className="text-2xl font-bold tracking-tight">
                {word.russian}
              </h2>
              <div className="mt-5 w-full rounded-2xl bg-white/10 p-4">
                <p className="text-sm font-medium text-indigo-50">
                  {word.example}
                </p>
                <p className="mt-1.5 text-sm text-indigo-200">
                  {word.exampleRu}
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Know / Learn buttons */}
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => setStatus('learning')}
          className={`flex-1 rounded-2xl border px-4 py-3 text-base font-semibold transition-all active:scale-95 ${
            currentStatus === 'learning'
              ? 'border-amber-400 bg-amber-50 text-amber-700'
              : 'border-slate-200 bg-white text-slate-600 hover:border-amber-300'
          }`}
        >
          📖 Учу
        </button>
        <button
          type="button"
          onClick={() => setStatus('known')}
          className={`flex-1 rounded-2xl border px-4 py-3 text-base font-semibold transition-all active:scale-95 ${
            currentStatus === 'known'
              ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
              : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300'
          }`}
        >
          ✓ Знаю
        </button>
      </div>

      {/* Navigation arrows */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handlePrev}
          disabled={index === 0}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
        >
          ‹
        </button>
        <span className="text-xs text-slate-400">Свайпни или используй стрелки</span>
        <button
          type="button"
          onClick={handleNext}
          disabled={index === total - 1}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
        >
          ›
        </button>
      </div>
    </div>
  )
}

export default Flashcards

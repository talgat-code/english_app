import { useState } from 'react'
import { getMyWords, removeMyWord } from '../utils/myWords'

interface MyWordsProps {
  onBack: () => void
  onFlashcards: () => void
  onQuiz: () => void
  onGenerate: () => void
}

function MyWords({ onBack, onFlashcards, onQuiz, onGenerate }: MyWordsProps) {
  const [words, setWords] = useState(getMyWords)

  return (
    <div className="flex min-h-screen w-full flex-col px-5 py-6">
      <header className="mb-5">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          ← AI
        </button>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
          Мои слова 💾
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Сохранено слов: {words.length}
        </p>
      </header>

      {words.length > 0 && (
        <div className="mb-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onFlashcards}
            className="min-h-12 rounded-2xl bg-indigo-600 px-4 text-sm font-semibold text-white"
          >
            🃏 Флешкарты
          </button>
          <button
            type="button"
            onClick={onQuiz}
            className="min-h-12 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white"
          >
            🎯 Квиз
          </button>
        </div>
      )}

      {words.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <span className="text-6xl">📭</span>
          <h2 className="mt-4 text-xl font-bold text-slate-900">Здесь пока пусто</h2>
          <p className="mt-2 max-w-xs text-sm text-slate-500">
            Сгенерируй слова по интересной теме и добавь их в избранное.
          </p>
          <button
            type="button"
            onClick={onGenerate}
            className="mt-5 min-h-12 w-full rounded-2xl bg-indigo-600 px-5 font-semibold text-white"
          >
            Найти новые слова
          </button>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {words.map((word) => (
            <li
              key={word.id}
              className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900">{word.english}</p>
                <p className="mt-0.5 text-sm text-slate-500">{word.russian}</p>
                <p className="mt-1 truncate text-xs text-slate-400">
                  [{word.transcription}]
                </p>
              </div>
              <button
                type="button"
                onClick={() => setWords(removeMyWord(word.id))}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-lg text-rose-500 transition-all active:scale-95"
                aria-label={`Удалить ${word.english}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MyWords

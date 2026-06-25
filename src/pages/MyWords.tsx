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
    <div className="flex min-h-screen w-full flex-col px-4 py-6">
      <header className="mb-5">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          ← AI
        </button>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-text-primary">
          Мои слова 💾
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Сохранено слов: {words.length}
        </p>
      </header>

      {words.length > 0 && (
        <div className="mb-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onFlashcards}
            className="min-h-12 rounded-2xl bg-primary px-4 text-sm font-semibold text-white"
          >
            🃏 Флешкарты
          </button>
          <button
            type="button"
            onClick={onQuiz}
            className="min-h-12 rounded-2xl bg-primary px-4 text-sm font-semibold text-white"
          >
            🎯 Квиз
          </button>
        </div>
      )}

      {words.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <span className="text-6xl">📭</span>
          <h2 className="mt-4 text-xl font-bold text-text-primary">Здесь пока пусто</h2>
          <p className="mt-2 max-w-xs text-sm text-text-secondary">
            Сгенерируй слова по интересной теме и добавь их в избранное.
          </p>
          <button
            type="button"
            onClick={onGenerate}
            className="mt-5 min-h-12 w-full rounded-2xl bg-primary px-5 font-semibold text-white"
          >
            Найти новые слова
          </button>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {words.map((word) => (
            <li
              key={word.id}
              className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <p className="font-bold text-text-primary">{word.english}</p>
                <p className="mt-0.5 text-sm text-text-secondary">{word.russian}</p>
                <p className="mt-1 truncate text-xs text-text-tertiary">
                  [{word.transcription}]
                </p>
              </div>
              <button
                type="button"
                onClick={() => setWords(removeMyWord(word.id))}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-error-soft text-lg text-error transition-all active:scale-95"
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

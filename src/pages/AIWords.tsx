import { useState } from 'react'
import type { GeneratedWord } from '../types/api'
import { askClaude } from '../utils/claudeApi'
import { addMyWord, getMyWords } from '../utils/myWords'

const POPULAR_TOPICS = ['Спорт', 'Еда', 'Технологии', 'Кино', 'Бизнес', 'Природа']

interface AIWordsProps {
  onBack: () => void
  onMyWords: () => void
}

function isGeneratedWord(value: unknown): value is GeneratedWord {
  if (!value || typeof value !== 'object') return false
  const word = value as Record<string, unknown>
  return ['english', 'russian', 'transcription', 'example', 'exampleTranslation'].every(
    (key) => typeof word[key] === 'string' && word[key].trim().length > 0,
  )
}

function parseWords(text: string): GeneratedWord[] {
  const cleaned = text.replace(/^```(?:json)?\s*|\s*```$/gi, '').trim()
  const parsed = JSON.parse(cleaned) as unknown
  if (!Array.isArray(parsed)) throw new Error('Claude вернул не JSON-массив.')
  const words = parsed.filter(isGeneratedWord)
  if (words.length === 0) throw new Error('В ответе Claude нет подходящих слов.')
  return words.slice(0, 10)
}

function AIWords({ onBack, onMyWords }: AIWordsProps) {
  const [topic, setTopic] = useState('')
  const [lastTopic, setLastTopic] = useState('')
  const [words, setWords] = useState<GeneratedWord[]>([])
  const [saved, setSaved] = useState(
    () => new Set(getMyWords().map((word) => word.english.trim().toLowerCase())),
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function generate(nextTopic = topic) {
    const trimmed = nextTopic.trim()
    if (!trimmed || loading) return

    setTopic(trimmed)
    setLastTopic(trimmed)
    setLoading(true)
    setError('')

    try {
      const response = await askClaude({
        maxTokens: 1800,
        messages: [
          {
            role: 'user',
            content: `Сгенерируй 10 полезных английских слов по теме: ${trimmed}.
Ответь ТОЛЬКО валидным JSON массивом без markdown, без пояснений.
Формат каждого объекта:
{ "english": "...", "russian": "...", "transcription": "...", "example": "...", "exampleTranslation": "..." }
Транскрипция в формате [trænskrɪpʃən]. Пример — простое предложение.`,
          },
        ],
      })
      setWords(parseWords(response))
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Не удалось создать слова.',
      )
    } finally {
      setLoading(false)
    }
  }

  function saveWord(word: GeneratedWord) {
    const next = addMyWord(word)
    setSaved(new Set(next.map((item) => item.english.trim().toLowerCase())))
  }

  return (
    <div className="flex min-h-screen w-full flex-col px-5 py-6">
      <header className="mb-5 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          ← AI
        </button>
        <button
          type="button"
          onClick={onMyWords}
          className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700"
        >
          Мои слова 💾
        </button>
      </header>

      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Новые слова ✨</h1>
      <p className="mt-2 text-sm text-slate-500">
        Введи тему, и Claude соберёт полезную подборку.
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          void generate()
        }}
        className="mt-5 flex gap-2"
      >
        <input
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          placeholder="Например: спорт"
          className="min-h-12 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-indigo-400"
        />
        <button
          type="submit"
          disabled={!topic.trim() || loading}
          className="min-h-12 rounded-2xl bg-indigo-600 px-4 text-sm font-semibold text-white disabled:opacity-40"
        >
          {loading ? 'Создаю...' : 'Сгенерировать'}
        </button>
      </form>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {POPULAR_TOPICS.map((popularTopic) => (
          <button
            key={popularTopic}
            type="button"
            onClick={() => void generate(popularTopic)}
            disabled={loading}
            className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 disabled:opacity-40"
          >
            {popularTopic}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-600">
          {error}
        </p>
      )}

      {loading && (
        <div className="mt-10 flex justify-center">
          <div className="flex items-center gap-1 rounded-full bg-white px-5 py-3 shadow-sm">
            <span className="ai-thinking-dot" />
            <span className="ai-thinking-dot" />
            <span className="ai-thinking-dot" />
          </div>
        </div>
      )}

      {!loading && words.length > 0 && (
        <>
          <div className="mt-6 flex flex-col gap-4">
            {words.map((word, index) => {
              const isSaved = saved.has(word.english.trim().toLowerCase())
              return (
                <article
                  key={`${word.english}-${index}`}
                  className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{word.english}</h2>
                      <p className="mt-1 text-sm text-slate-400">{word.transcription}</p>
                    </div>
                    <span className="rounded-xl bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700">
                      {word.russian}
                    </span>
                  </div>
                  <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm">
                    <p className="font-medium text-slate-700">{word.example}</p>
                    <p className="mt-1 text-slate-400">{word.exampleTranslation}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => saveWord(word)}
                    disabled={isSaved}
                    className="mt-4 min-h-11 w-full rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:bg-emerald-100 disabled:text-emerald-700"
                  >
                    {isSaved ? 'Сохранено ✓' : 'Добавить в избранное 💾'}
                  </button>
                </article>
              )
            })}
          </div>
          <button
            type="button"
            onClick={() => void generate(lastTopic)}
            className="mt-5 min-h-12 rounded-2xl border border-indigo-200 bg-indigo-50 px-5 font-semibold text-indigo-700"
          >
            Сгенерировать ещё
          </button>
        </>
      )}
    </div>
  )
}

export default AIWords

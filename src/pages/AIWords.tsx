import { useState } from 'react'
import type { GeneratedWord, OpenAITextFormat } from '../types'
import { askOpenAI } from '../utils/openaiApi'
import { addMyWord, getMyWords } from '../utils/myWords'

const POPULAR_TOPICS = ['Спорт', 'Еда', 'Технологии', 'Кино', 'Бизнес', 'Природа']

const WORD_LIST_RESPONSE_FORMAT: OpenAITextFormat = {
  type: 'json_schema',
  name: 'generated_words',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      words: {
        type: 'array',
        minItems: 1,
        maxItems: 10,
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            english: { type: 'string' },
            russian: { type: 'string' },
            transcription: { type: 'string' },
            example: { type: 'string' },
            exampleTranslation: { type: 'string' },
          },
          required: ['english', 'russian', 'transcription', 'example', 'exampleTranslation'],
        },
      },
    },
    required: ['words'],
  },
}

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
  const list =
    Array.isArray(parsed) ||
    (parsed &&
      typeof parsed === 'object' &&
      Array.isArray((parsed as { words?: unknown }).words))
      ? Array.isArray(parsed)
        ? parsed
        : (parsed as { words: unknown[] }).words
      : null

  if (!list) throw new Error('GPT вернул неподходящий JSON.')
  const words = list.filter(isGeneratedWord)
  if (words.length === 0) throw new Error('В ответе GPT нет подходящих слов.')
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
      const response = await askOpenAI({
        maxTokens: 1800,
        responseFormat: WORD_LIST_RESPONSE_FORMAT,
        messages: [
          {
            role: 'user',
            content: `Сгенерируй 10 полезных английских слов по теме: ${trimmed}.
Ответь ТОЛЬКО валидным JSON объектом без markdown, без пояснений.
Формат: { "words": [{ "english": "...", "russian": "...", "transcription": "...", "example": "...", "exampleTranslation": "..." }] }
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
    <div className="flex min-h-screen w-full flex-col px-4 py-6">
      <header className="mb-5 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          ← AI
        </button>
        <button
          type="button"
          onClick={onMyWords}
          className="rounded-full bg-success-soft px-3 py-2 text-xs font-semibold text-success"
        >
          Мои слова 💾
        </button>
      </header>

      <h1 className="text-3xl font-bold tracking-tight text-text-primary">Новые слова ✨</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Введи тему, и GPT соберёт полезную подборку.
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
          className="min-h-12 min-w-0 flex-1 rounded-2xl border border-border bg-surface px-4 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={!topic.trim() || loading}
          className="min-h-12 rounded-2xl bg-primary px-4 text-sm font-semibold text-white disabled:opacity-40"
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
            className="shrink-0 rounded-full border border-border bg-surface px-3 py-2 text-xs font-medium text-text-secondary disabled:opacity-40"
          >
            {popularTopic}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-2xl border border-error-border bg-error-soft p-3 text-sm text-error">
          {error}
        </p>
      )}

      {loading && (
        <div className="mt-10 flex justify-center">
          <div className="flex items-center gap-1 rounded-full bg-surface px-5 py-3 shadow-sm">
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
                  className="rounded-3xl border border-border-subtle bg-surface p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-bold text-text-primary">{word.english}</h2>
                      <p className="mt-1 text-sm text-text-tertiary">{word.transcription}</p>
                    </div>
                    <span className="rounded-xl bg-primary-soft px-3 py-2 text-sm font-semibold text-primary dark:text-text-primary">
                      {word.russian}
                    </span>
                  </div>
                  <div className="mt-4 rounded-2xl bg-surface-muted p-4 text-sm">
                    <p className="font-medium text-text-secondary">{word.example}</p>
                    <p className="mt-1 text-text-tertiary">{word.exampleTranslation}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => saveWord(word)}
                    disabled={isSaved}
                    className="mt-4 min-h-11 w-full rounded-xl bg-success px-4 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:bg-success-soft disabled:text-success dark:bg-success-button-dark"
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
            className="mt-5 min-h-12 rounded-2xl border border-primary-border bg-primary-soft px-5 font-semibold text-primary dark:text-text-primary"
          >
            Сгенерировать ещё
          </button>
        </>
      )}
    </div>
  )
}

export default AIWords

import { type FormEvent, useState } from 'react'
import {
  hasBundledOpenAIApiKey,
  hasStoredOpenAIApiKey,
  saveOpenAIApiKey,
} from '../utils/openaiSettings'
import {
  hasBundledClaudeApiKey,
  hasStoredClaudeApiKey,
  saveClaudeApiKey,
} from '../utils/claudeSettings'

interface AIHomeProps {
  onTutor: () => void
  onWords: () => void
  onWriting: () => void
  onMyWords: () => void
}

const AI_TOOLS = [
  {
    id: 'tutor',
    emoji: '💬',
    title: 'AI-репетитор',
    description: 'Спроси о грамматике, словах или английских выражениях.',
    color: 'from-secondary to-primary dark:from-secondary-button-dark dark:to-primary-active-dark',
  },
  {
    id: 'words',
    emoji: '✨',
    title: 'Новые слова',
    description: 'Создай персональную подборку слов по любой теме.',
    color: 'from-secondary to-primary dark:from-secondary-button-dark dark:to-primary-active-dark',
  },
  {
    id: 'writing',
    emoji: '✍️',
    title: 'Письмо',
    description: 'Напиши текст на английском и получи проверку от Claude.',
    color: 'from-success to-secondary-hover dark:from-success-button-dark dark:to-secondary-button-dark',
  },
  {
    id: 'my-words',
    emoji: '💾',
    title: 'Мои слова',
    description: 'Повторяй сохранённые слова карточками или квизом.',
    color: 'from-success to-secondary-hover dark:from-success-button-dark dark:to-secondary-button-dark',
  },
] as const

function AIHome({ onTutor, onWords, onWriting, onMyWords }: AIHomeProps) {
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [hasSavedApiKey, setHasSavedApiKey] = useState(hasStoredOpenAIApiKey)
  const [claudeApiKeyInput, setClaudeApiKeyInput] = useState('')
  const [hasSavedClaudeApiKey, setHasSavedClaudeApiKey] = useState(
    hasStoredClaudeApiKey,
  )
  const hasEnvApiKey = hasBundledOpenAIApiKey()
  const hasEnvClaudeApiKey = hasBundledClaudeApiKey()

  function openTool(id: (typeof AI_TOOLS)[number]['id']) {
    if (id === 'tutor') onTutor()
    else if (id === 'words') onWords()
    else if (id === 'writing') onWriting()
    else onMyWords()
  }

  function saveApiKey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    saveOpenAIApiKey(apiKeyInput)
    setHasSavedApiKey(hasStoredOpenAIApiKey())
    setApiKeyInput('')
  }

  function saveClaudeKey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    saveClaudeApiKey(claudeApiKeyInput)
    setHasSavedClaudeApiKey(hasStoredClaudeApiKey())
    setClaudeApiKeyInput('')
  }

  function clearClaudeKey() {
    saveClaudeApiKey('')
    setHasSavedClaudeApiKey(false)
    setClaudeApiKeyInput('')
  }

  function clearApiKey() {
    saveOpenAIApiKey('')
    setHasSavedApiKey(false)
    setApiKeyInput('')
  }

  return (
    <div className="flex min-h-screen w-full flex-col px-4 py-8">
      <header className="mb-6">
        <span className="text-4xl">🤖</span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-text-primary">
          AI-помощник
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Репетитор и персональный словарь внутри приложения.
        </p>
      </header>

      {!hasEnvApiKey && (
        <form
          onSubmit={saveApiKey}
          className="mb-5 rounded-3xl border border-primary-border bg-surface p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-text-primary">GPT ключ</p>
              <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                {hasSavedApiKey
                  ? 'Ключ сохранён в этом браузере.'
                  : 'Вставь OpenAI API ключ, чтобы AI отвечал через GPT.'}
              </p>
            </div>
            {hasSavedApiKey && (
              <button
                type="button"
                onClick={clearApiKey}
                className="shrink-0 text-xs font-semibold text-error"
              >
                Удалить
              </button>
            )}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(event) => setApiKeyInput(event.target.value)}
              placeholder="sk-..."
              className="min-h-11 min-w-0 flex-1 rounded-2xl border border-border bg-surface-muted px-4 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={!apiKeyInput.trim()}
              className="min-h-11 rounded-2xl bg-primary px-4 text-sm font-semibold text-white disabled:opacity-40"
            >
              {hasSavedApiKey ? 'Обновить' : 'Сохранить'}
            </button>
          </div>
        </form>
      )}

      {!hasEnvClaudeApiKey && (
        <form
          onSubmit={saveClaudeKey}
          className="mb-5 rounded-3xl border border-secondary-border bg-surface p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-text-primary">Claude ключ</p>
              <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                {hasSavedClaudeApiKey
                  ? 'Ключ сохранён в этом браузере.'
                  : 'Вставь Claude API ключ, чтобы проверять письмо через Claude.'}
              </p>
            </div>
            {hasSavedClaudeApiKey && (
              <button
                type="button"
                onClick={clearClaudeKey}
                className="shrink-0 text-xs font-semibold text-error"
              >
                Удалить
              </button>
            )}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              type="password"
              value={claudeApiKeyInput}
              onChange={(event) => setClaudeApiKeyInput(event.target.value)}
              placeholder="sk-ant-..."
              className="min-h-11 min-w-0 flex-1 rounded-2xl border border-border bg-surface-muted px-4 text-sm outline-none focus:border-secondary"
            />
            <button
              type="submit"
              disabled={!claudeApiKeyInput.trim()}
              className="min-h-11 rounded-2xl bg-secondary px-4 text-sm font-semibold text-white disabled:opacity-40"
            >
              {hasSavedClaudeApiKey ? 'Обновить' : 'Сохранить'}
            </button>
          </div>
        </form>
      )}

      {hasEnvApiKey && (
        <p className="mb-5 rounded-3xl border border-success-border bg-success-soft px-4 py-3 text-sm font-semibold text-success">
          GPT подключён через .env
        </p>
      )}

      {hasEnvClaudeApiKey && (
        <p className="mb-5 rounded-3xl border border-success-border bg-success-soft px-4 py-3 text-sm font-semibold text-success">
          Claude подключён через .env
        </p>
      )}

      <div className="flex flex-col gap-4">
        {AI_TOOLS.map((tool) => (
          <button
            key={tool.id}
            type="button"
            onClick={() => openTool(tool.id)}
            className="overflow-hidden rounded-3xl bg-surface text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
          >
            <div className={`bg-gradient-to-br ${tool.color} p-5 text-white`}>
              <span className="text-4xl">{tool.emoji}</span>
              <h2 className="mt-3 text-xl font-bold">{tool.title}</h2>
              <p className="mt-1 text-sm text-white/80">{tool.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default AIHome

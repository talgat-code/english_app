import { useEffect, useRef, useState } from 'react'
import type { AiMessage } from '../types'
import { askOpenAI } from '../utils/openaiApi'

const CHAT_KEY = 'english-app:ai-tutor-chat:v1'
const SYSTEM_PROMPT =
  'Ты дружелюбный репетитор английского языка. Отвечай на русском, если пользователь пишет по-русски. Объясняй грамматику простым языком с примерами. Если показываешь английские примеры — добавляй перевод. Отвечай кратко и по делу, без лишних слов.'

const QUICK_QUESTIONS = [
  'Объясни Present Perfect',
  'В чём разница между do и make?',
  'Когда использовать артикль the?',
  'Объясни условные предложения',
]

interface ChatItem extends AiMessage {
  id: string
}

interface AITutorProps {
  onBack: () => void
}

function loadChat(): ChatItem[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(CHAT_KEY) ?? '[]')
    return Array.isArray(parsed) ? (parsed as ChatItem[]).slice(-20) : []
  } catch {
    return []
  }
}

function makeChatItem(role: AiMessage['role'], content: string): ChatItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
  }
}

function AITutor({ onBack }: AITutorProps) {
  const [messages, setMessages] = useState<ChatItem[]>(loadChat)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_KEY, JSON.stringify(messages.slice(-20)))
    } catch {
      // Chat remains available for the current session.
    }
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(question: string) {
    const trimmed = question.trim()
    if (!trimmed || loading) return

    const userMessage = makeChatItem('user', trimmed)
    const nextMessages = [...messages, userMessage].slice(-19)
    setMessages(nextMessages)
    setInput('')
    setError('')
    setLoading(true)

    try {
      const answer = await askOpenAI({
        instructions: SYSTEM_PROMPT,
        messages: nextMessages.map(({ role, content }) => ({ role, content })),
      })
      setMessages((current) => [...current, makeChatItem('assistant', answer)].slice(-20))
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Не удалось получить ответ.',
      )
    } finally {
      setLoading(false)
    }
  }

  function clearChat() {
    setMessages([])
    setError('')
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface/95 px-5 py-4 backdrop-blur">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          ← AI
        </button>
        <div className="text-center">
          <h1 className="font-bold text-text-primary">AI-репетитор 🤖</h1>
          <p className="text-xs text-success">GPT</p>
        </div>
        <button
          type="button"
          onClick={clearChat}
          disabled={messages.length === 0 || loading}
          className="text-xs font-semibold text-text-tertiary hover:text-error disabled:opacity-40"
        >
          Очистить
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-3 px-5 py-5">
        {messages.length === 0 && (
          <div className="mx-auto mt-16 max-w-xs text-center">
            <span className="text-5xl">👋</span>
            <h2 className="mt-4 text-xl font-bold text-text-primary">Задай вопрос</h2>
            <p className="mt-2 text-sm text-text-secondary">
              Я объясню грамматику и помогу разобраться с английским.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
              message.role === 'user'
                ? 'ml-auto rounded-br-md bg-primary text-white'
                : 'mr-auto rounded-bl-md border border-border-subtle bg-surface text-text-secondary'
            }`}
          >
            {message.content}
          </div>
        ))}

        {loading && (
          <div className="mr-auto flex h-11 items-center gap-1 rounded-2xl rounded-bl-md border border-border-subtle bg-surface px-4 shadow-sm">
            <span className="ai-thinking-dot" />
            <span className="ai-thinking-dot" />
            <span className="ai-thinking-dot" />
          </div>
        )}

        {error && (
          <p className="rounded-2xl border border-error-border bg-error-soft p-3 text-sm text-error">
            {error}
          </p>
        )}
        <div ref={endRef} />
      </div>

      <footer className="sticky bottom-0 border-t border-border bg-surface px-4 py-3">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void sendMessage(input)
          }}
          className="flex gap-2"
        >
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                void sendMessage(input)
              }
            }}
            rows={1}
            placeholder="Спроси про английский..."
            className="min-h-12 flex-1 resize-none rounded-2xl border border-border bg-surface-muted px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="h-12 min-w-12 rounded-2xl bg-primary px-4 font-bold text-white transition-all active:scale-95 disabled:opacity-40"
            aria-label="Отправить"
          >
            ↑
          </button>
        </form>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {QUICK_QUESTIONS.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => void sendMessage(question)}
              disabled={loading}
              className="shrink-0 rounded-full border border-primary-border bg-primary-soft px-3 py-2 text-xs font-medium text-primary disabled:opacity-40 dark:text-text-primary"
            >
              {question}
            </button>
          ))}
        </div>
      </footer>
    </div>
  )
}

export default AITutor

import type {
  ClaudeMessage,
  ClaudeRequest,
  ClaudeResponse,
} from '../types/api'

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const CLAUDE_MODEL = 'claude-sonnet-4-6'
const PLACEHOLDER_KEY = 'твой_ключ_сюда'

interface ClaudeOptions {
  messages: ClaudeMessage[]
  system?: string
  maxTokens?: number
}

export async function askClaude({
  messages,
  system,
  maxTokens = 1000,
}: ClaudeOptions): Promise<string> {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY?.trim()

  if (!apiKey || apiKey === PLACEHOLDER_KEY) {
    throw new Error('Добавь Claude API ключ в файл .env и перезапусти приложение.')
  }

  const body: ClaudeRequest = {
    model: CLAUDE_MODEL,
    max_tokens: maxTokens,
    system,
    messages,
  }

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    let detail = response.statusText
    try {
      const payload = (await response.json()) as {
        error?: { message?: string }
      }
      detail = payload.error?.message ?? detail
    } catch {
      // Use the HTTP status text when the response is not JSON.
    }
    throw new Error(`Claude API: ${detail}`)
  }

  const payload = (await response.json()) as ClaudeResponse
  const text = payload.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n')
    .trim()

  if (!text) throw new Error('Claude вернул пустой ответ.')
  return text
}

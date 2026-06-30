import type { AiMessage } from '../types'
import { getClaudeApiKey } from './claudeSettings'

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_CLAUDE_MODEL = 'claude-3-5-sonnet-latest'

interface ClaudeOptions {
  messages: AiMessage[]
  system?: string
  maxTokens?: number
  temperature?: number
}

interface ClaudeTextBlock {
  type: 'text'
  text: string
}

interface ClaudeResponse {
  content?: ClaudeTextBlock[]
}

function extractText(payload: ClaudeResponse): string {
  const text = payload.content
    ?.filter((block) => block.type === 'text' && typeof block.text === 'string')
    .map((block) => block.text)
    .join('\n')
    .trim()

  if (!text) throw new Error('Claude вернул пустой ответ.')
  return text
}

async function readError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as {
      error?: { message?: string }
    }
    return payload.error?.message ?? response.statusText
  } catch {
    return response.statusText
  }
}

export async function askClaude({
  messages,
  system,
  maxTokens = 1400,
  temperature = 0.2,
}: ClaudeOptions): Promise<string> {
  const apiKey = getClaudeApiKey()
  const model = import.meta.env.VITE_CLAUDE_MODEL?.trim() || DEFAULT_CLAUDE_MODEL

  if (!apiKey) {
    throw new Error(
      'Добавь Claude API ключ в AI-разделе или в .env.local: VITE_CLAUDE_API_KEY=sk-ant-...',
    )
  }

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'anthropic-dangerous-direct-browser-access': 'true',
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature,
      system,
      messages,
    }),
  })

  if (!response.ok) {
    const detail = await readError(response)
    throw new Error(`Claude API: ${detail}`)
  }

  return extractText((await response.json()) as ClaudeResponse)
}

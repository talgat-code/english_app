import type {
  AiMessage,
  OpenAIRequest,
  OpenAIResponse,
  OpenAITextFormat,
} from '../types/api'
import { getOpenAIApiKey } from './openaiSettings'

const OPENAI_API_URL = 'https://api.openai.com/v1/responses'
const DEFAULT_OPENAI_MODEL = 'gpt-5.5'

interface OpenAIOptions {
  messages: AiMessage[]
  instructions?: string
  maxTokens?: number
  responseFormat?: OpenAITextFormat
}

function extractText(payload: OpenAIResponse): string {
  if (typeof payload.output_text === 'string' && payload.output_text.trim()) {
    return payload.output_text.trim()
  }

  const text = payload.output
    ?.flatMap((item) => item.content ?? [])
    .filter((block) => block.type === 'output_text' && typeof block.text === 'string')
    .map((block) => block.text)
    .join('\n')
    .trim()

  if (!text) throw new Error('OpenAI вернул пустой ответ.')
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

export async function askOpenAI({
  messages,
  instructions,
  maxTokens = 1000,
  responseFormat,
}: OpenAIOptions): Promise<string> {
  const apiKey = getOpenAIApiKey()
  const model = import.meta.env.VITE_OPENAI_MODEL?.trim() || DEFAULT_OPENAI_MODEL

  if (!apiKey) {
    throw new Error(
      'Добавь OpenAI API ключ в AI-разделе или в .env.local: VITE_OPENAI_API_KEY=sk-...',
    )
  }

  const body: OpenAIRequest = {
    model,
    input: messages,
    instructions,
    max_output_tokens: maxTokens,
    reasoning: { effort: 'low' },
    store: false,
  }

  if (responseFormat) {
    body.text = { format: responseFormat }
  }

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const detail = await readError(response)
    throw new Error(`OpenAI API: ${detail}`)
  }

  return extractText((await response.json()) as OpenAIResponse)
}

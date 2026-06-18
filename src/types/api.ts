export type AiRole = 'user' | 'assistant'

export interface AiMessage {
  role: AiRole
  content: string
}

export interface OpenAITextFormat {
  type: 'json_schema'
  name: string
  strict?: boolean
  schema: Record<string, unknown>
}

export interface OpenAIRequest {
  model: string
  input: AiMessage[]
  instructions?: string
  max_output_tokens: number
  store?: boolean
  reasoning?: {
    effort: 'minimal' | 'low' | 'medium' | 'high'
  }
  text?: {
    format?: OpenAITextFormat
  }
}

export interface OpenAIContentBlock {
  type: string
  text: string
}

export interface OpenAIOutputItem {
  id: string
  type: string
  role?: 'assistant'
  content?: OpenAIContentBlock[]
}

export interface OpenAIResponse {
  id: string
  output_text?: string
  output?: OpenAIOutputItem[]
}

export interface GeneratedWord {
  english: string
  russian: string
  transcription: string
  example: string
  exampleTranslation: string
}

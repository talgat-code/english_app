export type ClaudeRole = 'user' | 'assistant'

export interface ClaudeMessage {
  role: ClaudeRole
  content: string
}

export interface ClaudeRequest {
  model: string
  max_tokens: number
  system?: string
  messages: ClaudeMessage[]
}

export interface ClaudeTextBlock {
  type: 'text'
  text: string
}

export interface ClaudeResponse {
  id: string
  type: 'message'
  role: 'assistant'
  content: ClaudeTextBlock[]
  stop_reason: string | null
}

export interface GeneratedWord {
  english: string
  russian: string
  transcription: string
  example: string
  exampleTranslation: string
}

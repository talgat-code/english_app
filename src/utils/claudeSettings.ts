import {
  readStorageItem,
  removeStorageItem,
  writeStorageItem,
} from './storage'

const CLAUDE_API_KEY_STORAGE_KEY = 'english-app:claude-api-key:v1'
const PLACEHOLDER_KEY = 'your_claude_api_key_here'

function readEnvKey(): string {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY?.trim() ?? ''
  return apiKey && apiKey !== PLACEHOLDER_KEY ? apiKey : ''
}

export function hasBundledClaudeApiKey(): boolean {
  return readEnvKey().length > 0
}

export function getClaudeApiKey(): string {
  const envKey = readEnvKey()
  if (envKey) return envKey

  return readStorageItem(CLAUDE_API_KEY_STORAGE_KEY)?.trim() ?? ''
}

export function hasStoredClaudeApiKey(): boolean {
  return getClaudeApiKey().length > 0
}

export function saveClaudeApiKey(apiKey: string): void {
  const trimmed = apiKey.trim()
  if (trimmed) writeStorageItem(CLAUDE_API_KEY_STORAGE_KEY, trimmed)
  else removeStorageItem(CLAUDE_API_KEY_STORAGE_KEY)
}

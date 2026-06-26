import {
  readStorageItem,
  removeStorageItem,
  writeStorageItem,
} from './storage'

const OPENAI_API_KEY_STORAGE_KEY = 'english-app:openai-api-key:v1'
const PLACEHOLDER_KEY = 'your_openai_api_key_here'

function readEnvKey(): string {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY?.trim() ?? ''
  return apiKey && apiKey !== PLACEHOLDER_KEY ? apiKey : ''
}

export function hasBundledOpenAIApiKey(): boolean {
  return readEnvKey().length > 0
}

export function getOpenAIApiKey(): string {
  const envKey = readEnvKey()
  if (envKey) return envKey

  return readStorageItem(OPENAI_API_KEY_STORAGE_KEY)?.trim() ?? ''
}

export function hasStoredOpenAIApiKey(): boolean {
  return getOpenAIApiKey().length > 0
}

export function saveOpenAIApiKey(apiKey: string): void {
  const trimmed = apiKey.trim()
  if (trimmed) writeStorageItem(OPENAI_API_KEY_STORAGE_KEY, trimmed)
  else removeStorageItem(OPENAI_API_KEY_STORAGE_KEY)
}

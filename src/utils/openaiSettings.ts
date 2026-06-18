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

  try {
    return localStorage.getItem(OPENAI_API_KEY_STORAGE_KEY)?.trim() ?? ''
  } catch {
    return ''
  }
}

export function hasStoredOpenAIApiKey(): boolean {
  return getOpenAIApiKey().length > 0
}

export function saveOpenAIApiKey(apiKey: string): void {
  try {
    const trimmed = apiKey.trim()
    if (trimmed) localStorage.setItem(OPENAI_API_KEY_STORAGE_KEY, trimmed)
    else localStorage.removeItem(OPENAI_API_KEY_STORAGE_KEY)
  } catch {
    // Ignore storage errors; API calls will surface a clear missing-key message.
  }
}

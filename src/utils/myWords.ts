import type { Word } from '../data/words'
import type { GeneratedWord } from '../types/api'

const MY_WORDS_KEY = 'english-app:my-words:v1'

export function getMyWords(): Word[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(MY_WORDS_KEY) ?? '[]')
    return Array.isArray(parsed) ? (parsed as Word[]) : []
  } catch {
    return []
  }
}

function saveMyWords(words: Word[]) {
  try {
    localStorage.setItem(MY_WORDS_KEY, JSON.stringify(words))
  } catch {
    // Keep the current screen usable when storage is unavailable.
  }
}

export function addMyWord(generated: GeneratedWord): Word[] {
  const words = getMyWords()
  const normalized = generated.english.trim().toLowerCase()
  if (words.some((word) => word.english.trim().toLowerCase() === normalized)) {
    return words
  }

  const id =
    typeof crypto.randomUUID === 'function'
      ? `ai-${crypto.randomUUID()}`
      : `ai-${Date.now()}-${Math.random().toString(36).slice(2)}`
  const word: Word = {
    id,
    english: generated.english.trim(),
    russian: generated.russian.trim(),
    transcription: generated.transcription.replace(/^\[|\]$/g, '').trim(),
    example: generated.example.trim(),
    exampleRu: generated.exampleTranslation.trim(),
  }
  const next = [word, ...words]
  saveMyWords(next)
  return next
}

export function removeMyWord(id: string): Word[] {
  const next = getMyWords().filter((word) => word.id !== id)
  saveMyWords(next)
  return next
}

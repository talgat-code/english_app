import type { GeneratedWord, Word } from '../types'
import { readJsonStorage, writeJsonStorage } from './storage'

const MY_WORDS_KEY = 'english-app:my-words:v1'

export function getMyWords(): Word[] {
  return readJsonStorage(MY_WORDS_KEY, [], (value) =>
    Array.isArray(value) ? (value as Word[]) : [],
  )
}

function saveMyWords(words: Word[]) {
  writeJsonStorage(MY_WORDS_KEY, words)
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
    difficulty: 'medium',
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

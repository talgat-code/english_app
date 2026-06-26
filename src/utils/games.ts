import { getCategoryById } from '../data/words'
import type { Word } from '../types'

export type GameType = 'hangman' | 'word-builder'

export interface LetterTile {
  id: string
  letter: string
}

export function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function playableWords(categoryId: string): Word[] {
  const category = getCategoryById(categoryId)
  if (!category) return []

  return shuffle(
    category.words.filter(
      (word) => word.english.length >= 4 && /^[a-z]+$/i.test(word.english),
    ),
  )
}

export function buildLetterTiles(word: Word): LetterTile[] {
  return shuffle(
    [...word.english.toUpperCase()].map((letter, index) => ({
      id: `${word.id}-${index}`,
      letter,
    })),
  )
}

import {
  getIdiomsByCategory,
  idioms,
} from '../data/idioms'
import type { Idiom, IdiomFilter, IdiomQuizQuestion } from '../types'
import { QUESTIONS_PER_ROUND } from './quiz'

export type { IdiomQuizQuestion } from '../types'

function shuffle<T>(items: T[]): T[] {
  const result = [...items]

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }

  return result
}

function pickDistractors(answer: Idiom, pool: Idiom[]): string[] {
  const distractors = new Set<string>()

  const add = (source: Idiom[]) => {
    for (const idiom of shuffle(source)) {
      if (distractors.size >= 3) break
      if (idiom.meaning !== answer.meaning) {
        distractors.add(idiom.meaning)
      }
    }
  }

  add(pool)

  if (distractors.size < 3) {
    add(idioms)
  }

  return [...distractors].slice(0, 3)
}

export function buildIdiomQuiz(
  category: IdiomFilter = 'all',
  limit = QUESTIONS_PER_ROUND,
): IdiomQuizQuestion[] {
  const pool = getIdiomsByCategory(category)
  const chosen = shuffle(pool).slice(0, limit)

  return chosen.map((idiom) => {
    const options = shuffle([idiom.meaning, ...pickDistractors(idiom, pool)])
    return {
      idiom,
      options,
      correct: idiom.meaning,
    }
  })
}

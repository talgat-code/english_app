import {
  getPhrasalVerbsByCategory,
  phrasalVerbs,
  type PhrasalVerb,
  type PhrasalVerbFilter,
} from '../data/phrasalVerbs'
import { QUESTIONS_PER_ROUND } from './quiz'

export interface PhrasalVerbQuizQuestion {
  phrasalVerb: PhrasalVerb
  options: string[]
  correct: string
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items]

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }

  return result
}

function primaryMeaning(phrasalVerb: PhrasalVerb): string {
  return phrasalVerb.meanings[0]?.russian ?? ''
}

function pickDistractors(answer: PhrasalVerb, pool: PhrasalVerb[]): string[] {
  const correct = primaryMeaning(answer)
  const distractors = new Set<string>()

  const add = (source: PhrasalVerb[]) => {
    for (const phrasalVerb of shuffle(source)) {
      const meaning = primaryMeaning(phrasalVerb)

      if (distractors.size >= 3) break
      if (meaning && meaning !== correct) {
        distractors.add(meaning)
      }
    }
  }

  add(pool)

  if (distractors.size < 3) {
    add(phrasalVerbs)
  }

  return [...distractors].slice(0, 3)
}

export function buildPhrasalVerbQuiz(
  category: PhrasalVerbFilter = 'all',
  limit = QUESTIONS_PER_ROUND,
): PhrasalVerbQuizQuestion[] {
  const pool = getPhrasalVerbsByCategory(category)
  const chosen = shuffle(pool).slice(0, limit)

  return chosen.map((phrasalVerb) => {
    const correct = primaryMeaning(phrasalVerb)
    const options = shuffle([correct, ...pickDistractors(phrasalVerb, pool)])

    return {
      phrasalVerb,
      options,
      correct,
    }
  })
}

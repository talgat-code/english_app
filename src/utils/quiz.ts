import { categories, getCategoryById, type Word } from '../data/words'

export interface QuizQuestion {
  word: Word
  /** Four russian-translation options, already shuffled. */
  options: string[]
  /** The correct option (equals word.russian). */
  correct: string
}

export const QUESTIONS_PER_ROUND = 10

function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

const allWords: Word[] = categories.flatMap((category) => category.words)

/** Pick 3 wrong russian translations, preferring the same category. */
function pickDistractors(answer: Word, pool: Word[]): string[] {
  const distractors = new Set<string>()

  const add = (words: Word[]) => {
    for (const w of shuffle(words)) {
      if (distractors.size >= 3) break
      if (w.russian !== answer.russian) distractors.add(w.russian)
    }
  }

  add(pool)
  // Fall back to the whole database if the category is too small.
  if (distractors.size < 3) add(allWords)

  return [...distractors].slice(0, 3)
}

/** Build a shuffled round of quiz questions for a category. */
export function buildQuiz(categoryId: string): QuizQuestion[] {
  const category = getCategoryById(categoryId)
  if (!category) return []

  const chosen = shuffle(category.words).slice(0, QUESTIONS_PER_ROUND)

  return chosen.map((word) => {
    const distractors = pickDistractors(word, category.words)
    const options = shuffle([word.russian, ...distractors])
    return { word, options, correct: word.russian }
  })
}

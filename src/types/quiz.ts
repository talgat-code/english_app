import type { Idiom, PhrasalVerb, Word } from './vocabulary'

export interface QuizQuestion {
  word: Word
  options: string[]
  correct: string
}

export interface IdiomQuizQuestion {
  idiom: Idiom
  options: string[]
  correct: string
}

export interface PhrasalVerbQuizQuestion {
  phrasalVerb: PhrasalVerb
  options: string[]
  correct: string
}

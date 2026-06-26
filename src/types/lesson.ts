import type { Word } from './vocabulary'

export type LessonLevel = 'A1' | 'A2' | 'B1'

export interface FillBlankExercise {
  type: 'fill_blank'
  sentence: string
  answer: string
  hint: string
}

export interface TranslateExercise {
  type: 'translate'
  russian: string
  correctAnswer: string
  alternativeAnswers: string[]
}

export interface ChooseCorrectExercise {
  type: 'choose_correct'
  question: string
  options: string[]
  correctIndex: number
}

export type Exercise =
  | FillBlankExercise
  | TranslateExercise
  | ChooseCorrectExercise

export interface LessonTheory {
  explanation: string
  rules: string[]
  tips: string[]
}

export interface LessonExample {
  english: string
  russian: string
}

export interface Lesson {
  id: string
  level: LessonLevel
  order: number
  title: string
  description: string
  theory: LessonTheory
  vocabulary: Word[]
  examples: LessonExample[]
  exercises: Exercise[]
}

import type { LessonLevel } from './lesson'

export type WritingMode = 'free' | 'topic' | 'translation'

export interface WritingPrompt {
  id: string
  level: LessonLevel
  prompt: string
  minWords: number
}

export interface TranslationPrompt {
  id: string
  level: LessonLevel
  russian: string
  sampleAnswer: string
}

export interface WritingCorrection {
  original: string
  corrected: string
  explanation: string
}

export interface WritingFeedbackResult {
  overallFeedback: string
  score: number
  corrections: WritingCorrection[]
  strengths: string
}

export interface WritingHistoryItem {
  id: string
  date: string
  mode: WritingMode
  level: LessonLevel
  prompt: string
  text: string
  score: number
  feedback: WritingFeedbackResult
}

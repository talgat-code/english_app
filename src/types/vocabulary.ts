export type WordDifficulty = 'easy' | 'medium' | 'hard'

export interface Word {
  id: string
  english: string
  russian: string
  transcription: string
  example: string
  exampleRu: string
  difficulty: WordDifficulty
}

export interface Category {
  id: string
  title: string
  emoji: string
  words: Word[]
}

export type IdiomCategory =
  | 'повседневные'
  | 'эмоции'
  | 'работа'
  | 'отношения'
  | 'разговорные'

export type IdiomFilter = IdiomCategory | 'all'

export interface Idiom {
  id: string
  phrase: string
  literal: string
  meaning: string
  example: string
  exampleTranslation: string
  category: IdiomCategory
}

export type PhrasalVerbCategory =
  | 'повседневные'
  | 'работа'
  | 'движение'
  | 'отношения'
  | 'разное'

export type PhrasalVerbFilter = PhrasalVerbCategory | 'all'

export interface PhrasalVerbMeaning {
  russian: string
  example: string
  exampleTranslation: string
}

export interface PhrasalVerb {
  id: string
  phrase: string
  meanings: PhrasalVerbMeaning[]
  category: PhrasalVerbCategory
}

export interface IrregularVerb {
  id: string
  base: string
  pastSimple: string
  pastParticiple: string
  russian: string
  example: string
  exampleTranslation?: string
  note?: string
}

import { categories, type Category, type Word } from '../data/words'
import { idioms, type Idiom } from '../data/idioms'
import { phrasalVerbs, type PhrasalVerb } from '../data/phrasalVerbs'

export type SearchResultType = 'word' | 'idiom' | 'phrasalVerb'
export type SearchMatchedField = 'english' | 'russian' | 'phrase' | 'meaning'

export type SearchResult =
  | {
      type: 'word'
      item: Word
      matchedField: 'english' | 'russian'
    }
  | {
      type: 'idiom'
      item: Idiom
      matchedField: 'phrase' | 'meaning'
    }
  | {
      type: 'phrasalVerb'
      item: PhrasalVerb
      matchedField: 'phrase' | 'meaning'
    }

interface RankedResult {
  result: SearchResult
  rank: number
  index: number
}

interface SearchField<TField extends SearchMatchedField> {
  field: TField
  value: string
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

function wordStartsWith(value: string, query: string): boolean {
  return value
    .split(/[\s/.,;:!?()[\]{}"']+/)
    .some((word) => word.startsWith(query))
}

function bestMatch<TField extends SearchMatchedField>(
  query: string,
  fields: SearchField<TField>[],
): { field: TField; rank: number; index: number } | null {
  let best: { field: TField; rank: number; index: number } | null = null

  for (const { field, value } of fields) {
    const normalized = normalize(value)
    const index = normalized.indexOf(query)
    if (index === -1) continue

    const rank = normalized.startsWith(query) || wordStartsWith(normalized, query) ? 0 : 1
    if (!best || rank < best.rank || (rank === best.rank && index < best.index)) {
      best = { field, rank, index }
    }
  }

  return best
}

function typeRank(type: SearchResultType): number {
  if (type === 'word') return 0
  if (type === 'idiom') return 1
  return 2
}

export function getWordCategory(wordId: string): Category | undefined {
  return categories.find((category) =>
    category.words.some((word) => word.id === wordId),
  )
}

export function searchAll(query: string): SearchResult[] {
  const normalizedQuery = normalize(query)
  if (!normalizedQuery) return []

  const results: RankedResult[] = []

  for (const category of categories) {
    for (const word of category.words) {
      const match = bestMatch(normalizedQuery, [
        { field: 'english', value: word.english },
        { field: 'russian', value: word.russian },
      ])

      if (match) {
        results.push({
          result: {
            type: 'word',
            item: word,
            matchedField: match.field,
          },
          rank: match.rank,
          index: match.index,
        })
      }
    }
  }

  for (const idiom of idioms) {
    const match = bestMatch(normalizedQuery, [
      { field: 'phrase', value: idiom.phrase },
      { field: 'meaning', value: idiom.meaning },
    ])

    if (match) {
      results.push({
        result: {
          type: 'idiom',
          item: idiom,
          matchedField: match.field,
        },
        rank: match.rank,
        index: match.index,
      })
    }
  }

  for (const phrasalVerb of phrasalVerbs) {
    const match = bestMatch(normalizedQuery, [
      { field: 'phrase', value: phrasalVerb.phrase },
      {
        field: 'meaning',
        value: phrasalVerb.meanings.map((meaning) => meaning.russian).join(' '),
      },
    ])

    if (match) {
      results.push({
        result: {
          type: 'phrasalVerb',
          item: phrasalVerb,
          matchedField: match.field,
        },
        rank: match.rank,
        index: match.index,
      })
    }
  }

  return results
    .sort((left, right) => {
      if (left.rank !== right.rank) return left.rank - right.rank
      if (left.index !== right.index) return left.index - right.index

      const typeDelta = typeRank(left.result.type) - typeRank(right.result.type)
      if (typeDelta !== 0) return typeDelta

      return getResultTitle(left.result).localeCompare(getResultTitle(right.result))
    })
    .map(({ result }) => result)
}

export function getResultTitle(result: SearchResult): string {
  if (result.type === 'word') return result.item.english
  return result.item.phrase
}

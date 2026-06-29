import { useEffect, useMemo, useRef, useState } from 'react'
import type { IdiomFilter, PhrasalVerbFilter } from '../types'
import {
  getWordCategory,
  searchAll,
  type SearchMatchedField,
  type SearchResult,
} from '../utils/search'
import {
  readJsonStorage,
  removeStorageItem,
  writeJsonStorage,
} from '../utils/storage'

const SEARCH_HISTORY_KEY = 'english-app:search-history:v1'
const HISTORY_LIMIT = 5
const POPULAR_QUERIES = ['hello', 'work', 'look', 'time', 'break']

interface SearchProps {
  onBack: () => void
  onSelectWord: (categoryId: string, wordId: string) => void
  onSelectIdiom: (category: IdiomFilter, idiomId: string) => void
  onSelectPhrasalVerb: (
    category: PhrasalVerbFilter,
    phrasalVerbId: string,
  ) => void
}

function normalizeQuery(query: string): string {
  return query.trim().replace(/\s+/g, ' ')
}

function loadSearchHistory(): string[] {
  return readJsonStorage(SEARCH_HISTORY_KEY, [], (value) =>
    Array.isArray(value)
      ? value.filter((item): item is string => typeof item === 'string').slice(0, HISTORY_LIMIT)
      : [],
  )
}

function saveSearchHistory(query: string): string[] {
  const normalized = normalizeQuery(query)
  if (!normalized) return loadSearchHistory()

  const lower = normalized.toLowerCase()
  const next = [
    normalized,
    ...loadSearchHistory().filter((item) => item.toLowerCase() !== lower),
  ].slice(0, HISTORY_LIMIT)

  writeJsonStorage(SEARCH_HISTORY_KEY, next)

  return next
}

function clearSearchHistory(): string[] {
  removeStorageItem(SEARCH_HISTORY_KEY)
  return []
}

function matchedFieldLabel(field: SearchMatchedField): string {
  if (field === 'english' || field === 'phrase') return 'английский'
  if (field === 'russian') return 'перевод'
  return 'значение'
}

function Search({
  onBack,
  onSelectWord,
  onSelectIdiom,
  onSelectPhrasalVerb,
}: SearchProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [history, setHistory] = useState(loadSearchHistory)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(normalizeQuery(query))
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [query])

  const results = useMemo(() => searchAll(debouncedQuery), [debouncedQuery])
  const grouped = useMemo(
    () => ({
      words: results.filter((result) => result.type === 'word'),
      idioms: results.filter((result) => result.type === 'idiom'),
      phrasalVerbs: results.filter((result) => result.type === 'phrasalVerb'),
    }),
    [results],
  )

  const hasQuery = normalizeQuery(query).length > 0
  const isSettled = normalizeQuery(query) === debouncedQuery
  const promptQueries = history.length > 0 ? history : POPULAR_QUERIES

  function applyQuery(nextQuery: string) {
    setQuery(nextQuery)
    setDebouncedQuery(normalizeQuery(nextQuery))
  }

  function rememberCurrentQuery() {
    setHistory(saveSearchHistory(query))
  }

  function openResult(result: SearchResult) {
    rememberCurrentQuery()

    if (result.type === 'word') {
      const category = getWordCategory(result.item.id)
      if (category) onSelectWord(category.id, result.item.id)
      return
    }

    if (result.type === 'idiom') {
      onSelectIdiom(result.item.category, result.item.id)
      return
    }

    onSelectPhrasalVerb(result.item.category, result.item.id)
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const firstResult = results[0]
    if (firstResult) {
      openResult(firstResult)
    } else {
      setHistory(saveSearchHistory(query))
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col px-4 py-6">
      <header className="mb-5">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          ← Назад
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Поиск
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="sticky top-0 z-10 bg-background pb-4">
        <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-border bg-surface px-4 shadow-sm transition-colors focus-within:border-primary">
          <span className="text-lg" aria-hidden="true">
            🔍
          </span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Слово, идиома или фразовый глагол"
            className="min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => applyQuery('')}
              aria-label="Очистить поиск"
              className="rounded-full px-2 text-sm font-semibold text-text-tertiary transition-colors hover:text-text-secondary"
            >
              ×
            </button>
          )}
        </label>
      </form>

      {!hasQuery && (
        <section className="rounded-3xl border border-border-subtle bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-text-primary">
              {history.length > 0 ? 'История поиска' : 'Популярные запросы'}
            </h2>
            {history.length > 0 && (
              <button
                type="button"
                onClick={() => setHistory(clearSearchHistory())}
                className="text-xs font-semibold text-text-tertiary transition-colors hover:text-text-secondary"
              >
                Очистить историю
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {promptQueries.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => applyQuery(item)}
                className="rounded-full border border-border bg-surface-muted px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-primary-border hover:bg-primary-soft hover:text-text-primary"
              >
                {item}
              </button>
            ))}
          </div>
        </section>
      )}

      {hasQuery && isSettled && results.length === 0 && (
        <div className="empty-state mt-2">
          <span className="text-5xl">🔍</span>
          <h2 className="mt-4 text-xl font-bold text-text-primary">
            Ничего не найдено
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Проверь написание или попробуй другой запрос.
          </p>
        </div>
      )}

      {hasQuery && results.length > 0 && (
        <div className="flex flex-col gap-6">
          <ResultSection title="Слова" results={grouped.words} onOpen={openResult} />
          <ResultSection title="Идиомы" results={grouped.idioms} onOpen={openResult} />
          <ResultSection
            title="Фразовые глаголы"
            results={grouped.phrasalVerbs}
            onOpen={openResult}
          />
        </div>
      )}
    </div>
  )
}

interface ResultSectionProps {
  title: string
  results: SearchResult[]
  onOpen: (result: SearchResult) => void
}

function ResultSection({ title, results, onOpen }: ResultSectionProps) {
  if (results.length === 0) return null

  return (
    <section>
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-text-tertiary">
        {title}
      </h2>
      <ul className="flex flex-col gap-3">
        {results.map((result) => (
          <li key={`${result.type}:${result.item.id}`}>
            <SearchResultCard result={result} onOpen={onOpen} />
          </li>
        ))}
      </ul>
    </section>
  )
}

interface SearchResultCardProps {
  result: SearchResult
  onOpen: (result: SearchResult) => void
}

function SearchResultCard({ result, onOpen }: SearchResultCardProps) {
  if (result.type === 'word') {
    const category = getWordCategory(result.item.id)

    return (
      <button
        type="button"
        onClick={() => onOpen(result)}
        className="w-full rounded-2xl border border-border-subtle bg-surface p-4 text-left shadow-sm transition-colors hover:border-primary-border"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-text-primary">{result.item.english}</p>
            <p className="mt-1 text-sm text-text-secondary">{result.item.russian}</p>
            <p className="mt-3 text-sm font-medium text-text-tertiary">
              [{result.item.transcription}]
            </p>
          </div>
          <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary dark:text-text-primary">
            {category?.title ?? 'Слово'}
          </span>
        </div>
        <p className="mt-3 text-xs font-medium text-text-tertiary">
          Совпадение: {matchedFieldLabel(result.matchedField)}
        </p>
      </button>
    )
  }

  if (result.type === 'idiom') {
    return (
      <button
        type="button"
        onClick={() => onOpen(result)}
        className="w-full rounded-2xl border border-border-subtle bg-surface p-4 text-left shadow-sm transition-colors hover:border-primary-border"
      >
        <h3 className="text-lg font-semibold tracking-tight text-text-primary">
          {result.item.phrase}
        </h3>
        <p className="mt-1 text-sm italic text-text-tertiary">"{result.item.literal}"</p>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          {result.item.meaning}
        </p>
        <p className="mt-3 text-xs font-medium text-text-tertiary">
          Совпадение: {matchedFieldLabel(result.matchedField)}
        </p>
      </button>
    )
  }

  const primaryMeaning = result.item.meanings[0]

  return (
    <button
      type="button"
      onClick={() => onOpen(result)}
      className="w-full rounded-2xl border border-border-subtle bg-surface p-4 text-left shadow-sm transition-colors hover:border-primary-border"
    >
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-semibold tracking-tight text-text-primary">
          {result.item.phrase}
        </h3>
        {result.item.meanings.length > 1 && (
          <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary dark:text-text-primary">
            {result.item.meanings.length} значения
          </span>
        )}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary">
        {primaryMeaning.russian}
      </p>
      <p className="mt-3 text-xs font-medium text-text-tertiary">
        Совпадение: {matchedFieldLabel(result.matchedField)}
      </p>
    </button>
  )
}

export default Search

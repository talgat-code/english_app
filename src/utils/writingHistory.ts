import type { WritingFeedbackResult, WritingHistoryItem } from '../types/writing'
import { readJsonStorage, writeJsonStorage } from './storage'

const STORAGE_KEY = 'english-app:writing-history:v1'
const MAX_ITEMS = 20

function isCorrection(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const correction = value as Record<string, unknown>
  return (
    typeof correction.original === 'string' &&
    typeof correction.corrected === 'string' &&
    typeof correction.explanation === 'string'
  )
}

function isFeedback(value: unknown): value is WritingFeedbackResult {
  if (!value || typeof value !== 'object') return false
  const feedback = value as Record<string, unknown>
  return (
    typeof feedback.overallFeedback === 'string' &&
    typeof feedback.score === 'number' &&
    Array.isArray(feedback.corrections) &&
    feedback.corrections.every(isCorrection) &&
    typeof feedback.strengths === 'string'
  )
}

function isHistoryItem(value: unknown): value is WritingHistoryItem {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  return (
    typeof item.id === 'string' &&
    typeof item.date === 'string' &&
    (item.mode === 'free' || item.mode === 'topic' || item.mode === 'translation') &&
    (item.level === 'A1' || item.level === 'A2' || item.level === 'B1') &&
    typeof item.prompt === 'string' &&
    typeof item.text === 'string' &&
    typeof item.score === 'number' &&
    isFeedback(item.feedback)
  )
}

export function loadWritingHistory(): WritingHistoryItem[] {
  return readJsonStorage(STORAGE_KEY, [], (value) =>
    Array.isArray(value)
      ? value
          .filter(isHistoryItem)
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, MAX_ITEMS)
      : [],
  )
}

export function saveWritingHistoryItem(item: WritingHistoryItem): WritingHistoryItem[] {
  const next = [
    item,
    ...loadWritingHistory().filter((historyItem) => historyItem.id !== item.id),
  ].slice(0, MAX_ITEMS)

  writeJsonStorage(STORAGE_KEY, next)
  return next
}

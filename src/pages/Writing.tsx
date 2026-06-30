import { useEffect, useMemo, useRef, useState } from 'react'
import WritingFeedback from '../components/WritingFeedback'
import {
  getTranslationPromptsByLevel,
  translationPrompts,
} from '../data/translationPrompts'
import { getWritingPromptsByLevel, writingPrompts } from '../data/writingPrompts'
import { useProgress } from '../hooks/useProgress'
import type {
  LessonLevel,
  ProgressState,
  TranslationPrompt,
  WritingFeedbackResult,
  WritingMode,
  WritingPrompt,
} from '../types'
import { askClaude } from '../utils/claudeApi'
import { nextAvailableLesson } from '../utils/lessonProgress'
import { saveWritingHistoryItem } from '../utils/writingHistory'

const FORMAT_OPTIONS: {
  id: WritingMode
  label: string
  description: string
}[] = [
  {
    id: 'free',
    label: 'Свободное письмо',
    description: 'Пиши о чём хочешь',
  },
  {
    id: 'topic',
    label: 'По теме',
    description: 'Тема для небольшого текста',
  },
  {
    id: 'translation',
    label: 'Переведи предложение',
    description: 'Перевод с русского на английский',
  },
]

const LEVELS: LessonLevel[] = ['A1', 'A2', 'B1']

interface WritingProps {
  onBack: () => void
  onHistory: () => void
}

function inferUserLevel(progress: ProgressState): LessonLevel {
  return nextAvailableLesson(progress)?.level ?? 'B1'
}

function wordCount(text: string): number {
  const words = text.trim().match(/[A-Za-zА-Яа-яЁё0-9'-]+/g)
  return words?.length ?? 0
}

function pickRandom<T extends { id: string }>(items: T[], currentId?: string): T {
  const candidates = items.filter((item) => item.id !== currentId)
  const source = candidates.length > 0 ? candidates : items
  return source[Math.floor(Math.random() * source.length)] ?? items[0]
}

function firstWritingPromptForLevel(level: LessonLevel): WritingPrompt {
  return getWritingPromptsByLevel(level)[0] ?? writingPrompts[0]
}

function firstTranslationPromptForLevel(level: LessonLevel): TranslationPrompt {
  return getTranslationPromptsByLevel(level)[0] ?? translationPrompts[0]
}

function getSystemPrompt(userLevel: LessonLevel): string {
  return `Ты преподаватель английского. Проверь текст ученика уровня ${userLevel}. Ответь в формате JSON:
{
  "overallFeedback": "краткий комментарий на русском (1-2 предложения, дружелюбный тон)",
  "score": 7,
  "corrections": [
    {
      "original": "фрагмент с ошибкой",
      "corrected": "исправленный вариант",
      "explanation": "краткое объяснение на русском"
    }
  ],
  "strengths": "что хорошо получилось (1 пункт на русском)"
}
Ответь ТОЛЬКО валидным JSON без markdown.`
}

function cleanJson(text: string): string {
  const withoutFence = text.replace(/^```(?:json)?\s*|\s*```$/gi, '').trim()
  const start = withoutFence.indexOf('{')
  const end = withoutFence.lastIndexOf('}')
  return start >= 0 && end > start ? withoutFence.slice(start, end + 1) : withoutFence
}

function isCorrection(value: unknown): value is {
  original: string
  corrected: string
  explanation: string
} {
  if (!value || typeof value !== 'object') return false
  const correction = value as Record<string, unknown>
  return (
    typeof correction.original === 'string' &&
    typeof correction.corrected === 'string' &&
    typeof correction.explanation === 'string'
  )
}

function parseFeedback(response: string): WritingFeedbackResult {
  const parsed = JSON.parse(cleanJson(response)) as Record<string, unknown>
  const score = Number(parsed.score)

  if (
    typeof parsed.overallFeedback !== 'string' ||
    !Number.isFinite(score) ||
    typeof parsed.strengths !== 'string'
  ) {
    throw new Error('Claude вернул ответ в неподходящем формате.')
  }

  return {
    overallFeedback: parsed.overallFeedback,
    score: Math.max(1, Math.min(10, Math.round(score))),
    corrections: Array.isArray(parsed.corrections)
      ? parsed.corrections.filter(isCorrection)
      : [],
    strengths: parsed.strengths,
  }
}

function Writing({ onBack, onHistory }: WritingProps) {
  const progress = useProgress()
  const inferredLevel = useMemo(() => inferUserLevel(progress), [progress])
  const [selectedLevel, setSelectedLevel] = useState<LessonLevel | null>(null)
  const userLevel = selectedLevel ?? inferredLevel
  const [mode, setMode] = useState<WritingMode>('free')
  const [topicPrompt, setTopicPrompt] = useState<WritingPrompt>(() =>
    pickRandom(getWritingPromptsByLevel(userLevel)),
  )
  const [translationPrompt, setTranslationPrompt] = useState<TranslationPrompt>(() =>
    pickRandom(getTranslationPromptsByLevel(userLevel)),
  )
  const [text, setText] = useState('')
  const [feedback, setFeedback] = useState<WritingFeedbackResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [text, feedback])

  const activeTopicPrompt =
    topicPrompt.level === userLevel
      ? topicPrompt
      : firstWritingPromptForLevel(userLevel)
  const activeTranslationPrompt =
    translationPrompt.level === userLevel
      ? translationPrompt
      : firstTranslationPromptForLevel(userLevel)
  const count = wordCount(text)
  const activePrompt =
    mode === 'topic'
      ? activeTopicPrompt.prompt
      : mode === 'translation'
        ? activeTranslationPrompt.russian
        : 'Свободное письмо: пиши о чём хочешь.'
  const minWords = mode === 'topic' ? activeTopicPrompt.minWords : undefined
  const selectedFormat = FORMAT_OPTIONS.find((option) => option.id === mode)

  function changeMode(nextMode: WritingMode) {
    setMode(nextMode)
    setText('')
    setFeedback(null)
    setError('')
    setSaved(false)
  }

  function randomizeTopic() {
    setTopicPrompt(pickRandom(getWritingPromptsByLevel(userLevel), activeTopicPrompt.id))
  }

  function randomizeTranslation() {
    setTranslationPrompt(
      pickRandom(
        getTranslationPromptsByLevel(userLevel),
        activeTranslationPrompt.id,
      ),
    )
  }

  function buildUserMessage(trimmedText: string): string {
    const contextLines =
      mode === 'topic'
        ? [
            `Тема: ${activeTopicPrompt.prompt}`,
            `Минимум слов как ориентир: ${activeTopicPrompt.minWords}`,
          ]
        : mode === 'translation'
          ? [
              `Русское предложение: ${activeTranslationPrompt.russian}`,
              `Пример эталонного перевода: ${activeTranslationPrompt.sampleAnswer}`,
            ]
          : ['Контекст: свободное письмо без заданной темы.']

    return [
      `Режим: ${selectedFormat?.label ?? 'Письмо'}`,
      `Уровень ученика: ${userLevel}`,
      ...contextLines,
      'Текст ученика:',
      trimmedText,
    ].join('\n')
  }

  async function checkWriting() {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    setLoading(true)
    setError('')
    setSaved(false)

    try {
      const response = await askClaude({
        system: getSystemPrompt(userLevel),
        maxTokens: 1800,
        messages: [
          {
            role: 'user',
            content: buildUserMessage(trimmed),
          },
        ],
      })
      setFeedback(parseFeedback(response))
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Не удалось проверить текст.',
      )
    } finally {
      setLoading(false)
    }
  }

  function startAgain() {
    setFeedback(null)
    setError('')
    setSaved(false)
  }

  function newPrompt() {
    if (mode === 'topic') randomizeTopic()
    if (mode === 'translation') randomizeTranslation()
    setText('')
    setFeedback(null)
    setError('')
    setSaved(false)
  }

  function saveResult() {
    if (!feedback) return

    saveWritingHistoryItem({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      date: new Date().toISOString(),
      mode,
      level: userLevel,
      prompt: activePrompt,
      text,
      score: feedback.score,
      feedback,
    })
    setSaved(true)
  }

  if (feedback) {
    return (
      <WritingFeedback
        feedback={feedback}
        text={text}
        prompt={activePrompt}
        onRetry={startAgain}
        onNewPrompt={newPrompt}
        onSave={saveResult}
        saveDisabled={saved}
        saveLabel={saved ? 'Сохранено' : 'Сохранить в историю'}
      />
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col px-4 py-6">
      <header className="mb-5 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          ← AI
        </button>
        <button
          type="button"
          onClick={onHistory}
          className="rounded-md border border-border-strong px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-muted"
        >
          История
        </button>
      </header>

      <section className="border-b border-border pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          Claude feedback
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">
          Практика письма
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          Напиши текст на английском, а Claude проверит ошибки и даст короткую
          обратную связь.
        </p>
      </section>

      <section className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          Формат
        </p>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {FORMAT_OPTIONS.map((option) => {
            const active = option.id === mode
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => changeMode(option.id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                  active
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-surface text-text-secondary hover:bg-surface-muted'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
        <p className="mt-2 text-xs text-text-tertiary">
          {selectedFormat?.description}
        </p>
      </section>

      <section className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          Уровень
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {LEVELS.map((level) => {
            const active = level === userLevel
            return (
              <button
                key={level}
                type="button"
                onClick={() => setSelectedLevel(level)}
                className={`min-h-10 rounded-md border text-sm font-semibold transition-colors ${
                  active
                    ? 'border-primary bg-primary-soft text-primary dark:text-text-primary'
                    : 'border-border bg-surface text-text-secondary hover:bg-surface-muted'
                }`}
              >
                {level}
              </button>
            )
          })}
        </div>
      </section>

      {mode === 'topic' && (
        <section className="mt-5 rounded-lg border border-primary-border bg-primary-soft p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Тема
              </p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-text-primary">
                {activeTopicPrompt.prompt}
              </p>
              <p className="mt-2 text-xs text-text-secondary">
                Ориентир: минимум {activeTopicPrompt.minWords} слов.
              </p>
            </div>
            <button
              type="button"
              onClick={randomizeTopic}
              className="shrink-0 rounded-md bg-surface px-3 py-2 text-xs font-semibold text-primary"
            >
              Новая
            </button>
          </div>
          <select
            value={activeTopicPrompt.id}
            onChange={(event) => {
              const nextPrompt = writingPrompts.find(
                (prompt) => prompt.id === event.target.value,
              )
              if (nextPrompt) {
                setTopicPrompt(nextPrompt)
                setSelectedLevel(nextPrompt.level)
              }
            }}
            className="mt-3 min-h-11 w-full rounded-md border border-primary-border bg-surface px-3 text-sm text-text-secondary outline-none focus:border-primary"
          >
            {writingPrompts.map((prompt) => (
              <option key={prompt.id} value={prompt.id}>
                {prompt.level}: {prompt.prompt}
              </option>
            ))}
          </select>
        </section>
      )}

      {mode === 'translation' && (
        <section className="mt-5 rounded-lg border border-secondary-border bg-secondary-soft p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                Переведи
              </p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-text-primary">
                {activeTranslationPrompt.russian}
              </p>
            </div>
            <button
              type="button"
              onClick={randomizeTranslation}
              className="shrink-0 rounded-md bg-surface px-3 py-2 text-xs font-semibold text-secondary"
            >
              Новое
            </button>
          </div>
          <select
            value={activeTranslationPrompt.id}
            onChange={(event) => {
              const nextPrompt = translationPrompts.find(
                (prompt) => prompt.id === event.target.value,
              )
              if (nextPrompt) {
                setTranslationPrompt(nextPrompt)
                setSelectedLevel(nextPrompt.level)
              }
            }}
            className="mt-3 min-h-11 w-full rounded-md border border-secondary-border bg-surface px-3 text-sm text-text-secondary outline-none focus:border-secondary"
          >
            {translationPrompts.map((prompt) => (
              <option key={prompt.id} value={prompt.id}>
                {prompt.level}: {prompt.russian}
              </option>
            ))}
          </select>
        </section>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault()
          void checkWriting()
        }}
        className="mt-5"
      >
        <label className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          Текст на английском
        </label>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={5}
          placeholder={
            mode === 'translation'
              ? 'Write your translation in English...'
              : 'Write your text in English...'
          }
          className="mt-3 min-h-36 w-full resize-none overflow-hidden rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text-primary outline-none transition-colors focus:border-primary"
        />
        <div className="mt-2 flex items-center justify-between gap-3 text-xs text-text-tertiary">
          <span>
            {count} слов · {text.length} символов
          </span>
          {minWords && (
            <span
              className={
                count >= minWords ? 'font-semibold text-success' : 'text-text-tertiary'
              }
            >
              цель {minWords}
            </span>
          )}
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-error-border bg-error-soft p-3 text-sm text-error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!text.trim() || loading}
          className="mt-5 min-h-12 w-full rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-40"
        >
          {loading ? 'Проверяю...' : 'Проверить'}
        </button>
      </form>
    </div>
  )
}

export default Writing

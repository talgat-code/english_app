import { useEffect, useRef, useState } from 'react'
import { getCategoryById, type Word } from '../data/words'
import { recordQuizResult, type QuizAnswer } from '../hooks/useProgress'
import { useSpeech } from '../hooks/useSpeech'
import { askOpenAI } from '../utils/openaiApi'
import { buildQuiz, buildQuizForWords, type QuizQuestion } from '../utils/quiz'
import QuizResult from './QuizResult'

interface QuizProps {
  categoryId?: string
  customWords?: Word[]
  categoryEmoji?: string
  onExitToCategories: () => void
  onExitToHome: () => void
}

function Quiz({
  categoryId,
  customWords,
  categoryEmoji,
  onExitToCategories,
  onExitToHome,
}: QuizProps) {
  const category = categoryId ? getCategoryById(categoryId) : undefined
  const words = customWords ?? category?.words ?? []
  const emoji = categoryEmoji ?? category?.emoji ?? '💾'
  const { speak, isSupported } = useSpeech()

  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    customWords ? buildQuizForWords(customWords) : buildQuiz(categoryId ?? ''),
  )
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [mistakes, setMistakes] = useState<Word[]>([])
  const [finished, setFinished] = useState(false)
  const [explanation, setExplanation] = useState('')
  const [explanationError, setExplanationError] = useState('')
  const [explanationLoading, setExplanationLoading] = useState(false)

  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Per-round answers, accumulated synchronously so the final result can be
  // written to progress as soon as the last question is answered.
  const answers = useRef<QuizAnswer[]>([])

  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current)
    },
    [],
  )

  function restart() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    answers.current = []
    setQuestions(customWords ? buildQuizForWords(customWords) : buildQuiz(categoryId ?? ''))
    setIndex(0)
    setSelected(null)
    setScore(0)
    setMistakes([])
    setFinished(false)
    setExplanation('')
    setExplanationError('')
    setExplanationLoading(false)
  }

  if (words.length === 0 || questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="empty-state w-full">
          <span className="text-6xl">🎯</span>
          <h1 className="mt-4 text-xl font-bold text-text-primary">
            Квиз пока недоступен
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Не удалось собрать вопросы для этих слов.
          </p>
        </div>
        <button
          type="button"
          onClick={onExitToCategories}
          className="mt-4 min-h-12 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white"
        >
          ← Назад
        </button>
      </div>
    )
  }

  if (finished) {
    return (
      <QuizResult
        score={score}
        total={questions.length}
        mistakes={mistakes}
        onRetry={restart}
        onOtherCategory={onExitToCategories}
        onHome={onExitToHome}
      />
    )
  }

  const total = questions.length
  const question = questions[index]
  const progress = ((index + 1) / total) * 100
  const answered = selected !== null
  const isWrong = selected !== null && selected !== question.correct

  function advance() {
    setExplanation('')
    setExplanationError('')
    setExplanationLoading(false)
    if (index < total - 1) {
      setIndex((i) => i + 1)
      setSelected(null)
    } else {
      recordQuizResult(answers.current)
      setFinished(true)
    }
  }

  function handleAnswer(option: string) {
    if (answered) return // ignore taps after an answer is locked in

    setSelected(option)
    const isCorrect = option === question.correct
    answers.current.push({ wordId: question.word.id, correct: isCorrect })
    if (isCorrect) {
      setScore((s) => s + 1)
    } else {
      setMistakes((m) => [...m, question.word])
    }

    if (isCorrect) {
      advanceTimer.current = setTimeout(advance, 1000)
    }
  }

  async function explainAnswer() {
    if (!selected || selected === question.correct || explanationLoading) return

    setExplanationLoading(true)
    setExplanationError('')
    try {
      const text = await askOpenAI({
        maxTokens: 250,
        messages: [
          {
            role: 'user',
            content: `Кратко объясни по-русски разницу между '${selected}' и '${question.correct}' в контексте перевода слова '${question.word.english}'. Максимум 2 предложения.`,
          },
        ],
      })
      setExplanation(text)
    } catch (requestError) {
      setExplanationError(
        requestError instanceof Error
          ? requestError.message
          : 'Не удалось получить объяснение.',
      )
    } finally {
      setExplanationLoading(false)
    }
  }

  function optionClasses(option: string): string {
    const base =
      'min-h-14 w-full rounded-2xl border px-5 py-3 text-left text-base font-medium transition-all duration-app'

    if (!answered) {
      return `${base} border-border bg-surface text-text-secondary hover:border-primary-border hover:bg-primary-soft/50 active:scale-[0.98]`
    }

    const isCorrect = option === question.correct
    const isSelected = option === selected

    if (isCorrect) {
      return `${base} border-success bg-success-soft text-success scale-[1.02] shadow-sm`
    }
    if (isSelected) {
      return `${base} border-error bg-error-soft text-error`
    }
    return `${base} border-border bg-surface text-text-tertiary opacity-60`
  }

  return (
    <div className="flex min-h-screen w-full flex-col px-4 py-6">
      {/* Header: back + progress */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onExitToCategories}
            className="inline-flex items-center gap-1 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            ← Категории
          </button>
          <span className="text-sm font-medium text-text-secondary">
            Вопрос {index + 1} из {total}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-lg">{emoji}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary transition-all duration-entrance ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Question */}
      <div className="flex flex-col items-center py-6 text-center">
        <span className="mb-3 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
          Как переводится?
        </span>
        <div className="flex items-center justify-center gap-3">
          <h2 className="text-4xl font-bold tracking-tight text-text-primary">
            {question.word.english}
          </h2>
          {isSupported && (
            <button
              type="button"
              onClick={() => speak(question.word.english)}
              aria-label={`Произнести ${question.word.english}`}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xl transition-transform hover:scale-105 active:scale-95"
            >
              🔊
            </button>
          )}
        </div>
        <p className="mt-2 text-base text-text-tertiary">[{question.word.transcription}]</p>
      </div>

      {/* Options */}
      <div className="mt-2 flex flex-1 flex-col justify-center gap-3 pb-6">
        {question.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleAnswer(option)}
            disabled={answered}
            className={optionClasses(option)}
          >
            {option}
          </button>
        ))}

        {isWrong && (
          <div className="mt-2 rounded-2xl border border-secondary-border bg-secondary-soft p-4">
            {!explanation && (
              <button
                type="button"
                onClick={() => void explainAnswer()}
                disabled={explanationLoading}
                className="min-h-11 w-full rounded-xl bg-secondary px-4 text-sm font-semibold text-white disabled:opacity-60"
              >
                {explanationLoading
                  ? 'GPT думает...'
                  : explanationError
                    ? 'Попробовать объяснить снова 🤖'
                    : 'Объясни 🤖'}
              </button>
            )}
            {explanation && (
              <p className="text-sm leading-relaxed text-secondary">{explanation}</p>
            )}
            {explanationError && (
              <p className="text-sm leading-relaxed text-error">{explanationError}</p>
            )}
            <button
              type="button"
              onClick={advance}
              disabled={explanationLoading}
              className="mt-3 min-h-11 w-full rounded-xl border border-secondary-border bg-surface px-4 text-sm font-semibold text-secondary disabled:opacity-40"
            >
              {index === total - 1 ? 'Показать результат' : 'Следующий вопрос'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Quiz

import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useSpeech } from '../hooks/useSpeech'

export interface QuizEngineQuestion {
  options: string[]
  correct: string
}

interface AnswerContext<TQuestion extends QuizEngineQuestion> {
  question: TQuestion
  option: string
  isCorrect: boolean
}

interface QuizResultContext<TMistake> {
  score: number
  total: number
  mistakes: TMistake[]
  restart: () => void
}

interface QuizFeedbackContext<TQuestion extends QuizEngineQuestion> {
  question: TQuestion
  selected: string
  isCorrect: boolean
  isLastQuestion: boolean
  advance: () => void
}

interface QuizEngineProps<
  TQuestion extends QuizEngineQuestion,
  TAnswer,
  TMistake,
> {
  createQuestions: () => TQuestion[]
  renderEmpty: () => ReactNode
  renderResult: (context: QuizResultContext<TMistake>) => ReactNode
  onComplete: (answers: TAnswer[]) => void
  buildAnswer: (context: AnswerContext<TQuestion>) => TAnswer
  buildMistake?: (context: AnswerContext<TQuestion>) => TMistake | null
  autoAdvanceDelay?: number | ((context: AnswerContext<TQuestion>) => number | null)
  onBeforeAdvance?: () => void
  onRestart?: () => void
  onBack: () => void
  backLabel: string
  questionLabel: string
  getQuestionTitle: (question: TQuestion) => string
  getSpeechText?: (question: TQuestion) => string
  progressEmoji?: string
  renderQuestionMeta?: (question: TQuestion) => ReactNode
  renderFeedback?: (context: QuizFeedbackContext<TQuestion>) => ReactNode
}

const OPTION_BASE_CLASS =
  'min-h-14 w-full rounded-2xl border px-5 py-3 text-left text-base font-medium transition-all duration-app'

function getOptionClasses(
  option: string,
  correct: string,
  selected: string | null,
): string {
  if (selected === null) {
    return `${OPTION_BASE_CLASS} border-border bg-surface text-text-secondary hover:border-primary-border hover:bg-primary-soft/50 active:scale-[0.98]`
  }

  if (option === correct) {
    return `${OPTION_BASE_CLASS} scale-[1.02] border-success bg-success-soft text-success shadow-sm`
  }

  if (option === selected) {
    return `${OPTION_BASE_CLASS} border-error bg-error-soft text-error`
  }

  return `${OPTION_BASE_CLASS} border-border bg-surface text-text-tertiary opacity-60`
}

function resolveAutoAdvanceDelay<TQuestion extends QuizEngineQuestion>(
  autoAdvanceDelay: QuizEngineProps<TQuestion, unknown, unknown>['autoAdvanceDelay'],
  context: AnswerContext<TQuestion>,
): number | null {
  if (typeof autoAdvanceDelay === 'function') {
    return autoAdvanceDelay(context)
  }

  return autoAdvanceDelay ?? 1100
}

function QuizEngine<
  TQuestion extends QuizEngineQuestion,
  TAnswer,
  TMistake,
>({
  createQuestions,
  renderEmpty,
  renderResult,
  onComplete,
  buildAnswer,
  buildMistake,
  autoAdvanceDelay,
  onBeforeAdvance,
  onRestart,
  onBack,
  backLabel,
  questionLabel,
  getQuestionTitle,
  getSpeechText,
  progressEmoji,
  renderQuestionMeta,
  renderFeedback,
}: QuizEngineProps<TQuestion, TAnswer, TMistake>) {
  const { speak, isSupported } = useSpeech()

  const [questions, setQuestions] = useState<TQuestion[]>(createQuestions)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [mistakes, setMistakes] = useState<TMistake[]>([])
  const [finished, setFinished] = useState(false)

  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const answers = useRef<TAnswer[]>([])

  useEffect(
    () => () => {
      if (advanceTimer.current) {
        clearTimeout(advanceTimer.current)
      }
    },
    [],
  )

  function clearAdvanceTimer() {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current)
      advanceTimer.current = null
    }
  }

  function restart() {
    clearAdvanceTimer()
    answers.current = []
    onRestart?.()
    setQuestions(createQuestions())
    setIndex(0)
    setSelected(null)
    setScore(0)
    setMistakes([])
    setFinished(false)
  }

  if (questions.length === 0) {
    return renderEmpty()
  }

  if (finished) {
    return renderResult({
      score,
      total: questions.length,
      mistakes,
      restart,
    })
  }

  const total = questions.length
  const question = questions[index]
  const progress = ((index + 1) / total) * 100
  const answered = selected !== null
  const title = getQuestionTitle(question)
  const speechText = getSpeechText?.(question) ?? title

  function advance() {
    onBeforeAdvance?.()

    if (index < total - 1) {
      setIndex((current) => current + 1)
      setSelected(null)
      return
    }

    onComplete(answers.current)
    setFinished(true)
  }

  function handleAnswer(option: string) {
    if (answered) return

    const isCorrect = option === question.correct
    const context = { question, option, isCorrect }

    setSelected(option)
    answers.current.push(buildAnswer(context))

    if (isCorrect) {
      setScore((current) => current + 1)
    } else {
      const mistake = buildMistake?.(context)

      if (mistake) {
        setMistakes((current) => [...current, mistake])
      }
    }

    const delay = resolveAutoAdvanceDelay(autoAdvanceDelay, context)

    if (delay !== null) {
      advanceTimer.current = setTimeout(advance, delay)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col px-4 py-6">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            {backLabel}
          </button>
          <span className="text-sm font-medium text-text-secondary">
            Вопрос {index + 1} из {total}
          </span>
        </div>
        <div className={progressEmoji ? 'mt-3 flex items-center gap-3' : 'mt-3'}>
          {progressEmoji && <span className="text-lg">{progressEmoji}</span>}
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary transition-all duration-entrance ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <div className="flex flex-col items-center py-6 text-center">
        <span className="mb-3 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary dark:text-text-primary">
          {questionLabel}
        </span>
        <div className="flex items-center justify-center gap-3">
          <h2 className="text-4xl font-bold tracking-tight text-text-primary">
            {title}
          </h2>
          {isSupported && (
            <button
              type="button"
              onClick={() => speak(speechText)}
              aria-label={`Произнести ${speechText}`}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xl transition-transform hover:scale-105 active:scale-95"
            >
              🔊
            </button>
          )}
        </div>
        {renderQuestionMeta?.(question)}
      </div>

      <div className="mt-2 flex flex-1 flex-col justify-center gap-3 pb-6">
        {question.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleAnswer(option)}
            disabled={answered}
            className={getOptionClasses(option, question.correct, selected)}
          >
            {option}
          </button>
        ))}

        {selected !== null &&
          renderFeedback?.({
            question,
            selected,
            isCorrect: selected === question.correct,
            isLastQuestion: index === total - 1,
            advance,
          })}
      </div>
    </div>
  )
}

export default QuizEngine

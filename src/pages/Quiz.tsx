import { useRef, useState } from 'react'
import { getCategoryById, type Word } from '../data/words'
import { recordQuizResult, type QuizAnswer } from '../hooks/useProgress'
import { buildQuiz, type QuizQuestion } from '../utils/quiz'
import QuizResult from './QuizResult'

interface QuizProps {
  categoryId: string
  onExitToCategories: () => void
  onExitToHome: () => void
}

function Quiz({ categoryId, onExitToCategories, onExitToHome }: QuizProps) {
  const category = getCategoryById(categoryId)

  const [questions, setQuestions] = useState<QuizQuestion[]>(() => buildQuiz(categoryId))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [mistakes, setMistakes] = useState<Word[]>([])
  const [finished, setFinished] = useState(false)

  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Per-round answers, accumulated synchronously so the final result can be
  // written to progress as soon as the last question is answered.
  const answers = useRef<QuizAnswer[]>([])

  function restart() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    answers.current = []
    setQuestions(buildQuiz(categoryId))
    setIndex(0)
    setSelected(null)
    setScore(0)
    setMistakes([])
    setFinished(false)
  }

  if (!category || questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-slate-500">Не удалось собрать квиз для этой категории.</p>
        <button
          type="button"
          onClick={onExitToCategories}
          className="mt-4 min-h-12 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white"
        >
          ← К категориям
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

    advanceTimer.current = setTimeout(() => {
      if (index < total - 1) {
        setIndex((i) => i + 1)
        setSelected(null)
      } else {
        recordQuizResult(answers.current)
        setFinished(true)
      }
    }, 1000)
  }

  function optionClasses(option: string): string {
    const base =
      'min-h-14 w-full rounded-2xl border px-5 py-3 text-left text-base font-medium transition-all duration-200'

    if (!answered) {
      return `${base} border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50 active:scale-[0.98]`
    }

    const isCorrect = option === question.correct
    const isSelected = option === selected

    if (isCorrect) {
      return `${base} border-emerald-400 bg-emerald-50 text-emerald-700 scale-[1.02] shadow-sm`
    }
    if (isSelected) {
      return `${base} border-rose-400 bg-rose-50 text-rose-700`
    }
    return `${base} border-slate-200 bg-white text-slate-400 opacity-60`
  }

  return (
    <div className="flex min-h-screen w-full flex-col px-5 py-6">
      {/* Header: back + progress */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onExitToCategories}
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
          >
            ← Категории
          </button>
          <span className="text-sm font-medium text-slate-500">
            Вопрос {index + 1} из {total}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-lg">{category.emoji}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Question */}
      <div className="flex flex-col items-center py-6 text-center">
        <span className="mb-3 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
          Как переводится?
        </span>
        <h2 className="text-4xl font-bold tracking-tight text-slate-900">
          {question.word.english}
        </h2>
        <p className="mt-2 text-base text-slate-400">[{question.word.transcription}]</p>
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
      </div>
    </div>
  )
}

export default Quiz

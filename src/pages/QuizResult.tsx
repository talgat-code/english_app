import type { Word } from '../types'

interface QuizResultProps {
  score: number
  total: number
  mistakes: Word[]
  onRetry: () => void
  onOtherCategory: () => void
  onHome: () => void
}

function getMessage(percent: number): { title: string; tone: string } {
  if (percent >= 90) return { title: 'Отлично! 🔥', tone: 'text-success' }
  if (percent >= 70) return { title: 'Хороший результат! 💪', tone: 'text-primary' }
  if (percent >= 50) return { title: 'Неплохо, но стоит повторить 📖', tone: 'text-warning' }
  return { title: 'Давай попробуем ещё раз! 🎯', tone: 'text-error' }
}

function QuizResult({ score, total, mistakes, onRetry, onOtherCategory, onHome }: QuizResultProps) {
  const percent = total > 0 ? Math.round((score / total) * 100) : 0
  const { title, tone } = getMessage(percent)

  return (
    <div className="flex min-h-screen w-full flex-col px-4 py-8">
      {/* Score card */}
      <div className="flex flex-col items-center rounded-3xl border border-border-subtle bg-surface p-8 text-center shadow-xl">
        <p className={`text-2xl font-bold ${tone}`}>{title}</p>

        <div className="mt-6 flex h-32 w-32 flex-col items-center justify-center rounded-full bg-primary-soft">
          <span className="text-4xl font-bold tracking-tight text-primary">
            {score}/{total}
          </span>
          <span className="mt-1 text-sm font-medium text-primary">{percent}%</span>
        </div>

        <p className="mt-5 text-sm text-text-secondary">
          Правильных ответов: {score} из {total}
        </p>
      </div>

      {/* Mistakes */}
      {mistakes.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-tertiary">
            Слова с ошибками
          </h2>
          <ul className="flex flex-col gap-2">
            {mistakes.map((word) => (
              <li
                key={word.id}
                className="flex items-center justify-between rounded-2xl border border-border-subtle bg-surface px-4 py-3 shadow-sm"
              >
                <span className="font-semibold text-text-primary">{word.english}</span>
                <span className="text-sm text-text-secondary">{word.russian}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="min-h-12 w-full rounded-2xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover active:bg-primary-active"
        >
          Пройти ещё раз
        </button>
        <button
          type="button"
          onClick={onOtherCategory}
          className="min-h-12 w-full rounded-2xl border border-border bg-surface px-6 py-3 text-base font-semibold text-text-secondary transition-colors hover:bg-surface-muted active:bg-surface-muted"
        >
          Другая категория
        </button>
        <button
          type="button"
          onClick={onHome}
          className="min-h-12 w-full px-6 py-3 text-base font-medium text-text-tertiary transition-colors hover:text-text-secondary"
        >
          На главную
        </button>
      </div>
    </div>
  )
}

export default QuizResult

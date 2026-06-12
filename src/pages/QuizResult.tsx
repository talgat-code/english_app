import type { Word } from '../data/words'

interface QuizResultProps {
  score: number
  total: number
  mistakes: Word[]
  onRetry: () => void
  onOtherCategory: () => void
  onHome: () => void
}

function getMessage(percent: number): { title: string; tone: string } {
  if (percent >= 90) return { title: 'Отлично! 🔥', tone: 'text-emerald-600' }
  if (percent >= 70) return { title: 'Хороший результат! 💪', tone: 'text-indigo-600' }
  if (percent >= 50) return { title: 'Неплохо, но стоит повторить 📖', tone: 'text-amber-600' }
  return { title: 'Давай попробуем ещё раз! 🎯', tone: 'text-rose-600' }
}

function QuizResult({ score, total, mistakes, onRetry, onOtherCategory, onHome }: QuizResultProps) {
  const percent = total > 0 ? Math.round((score / total) * 100) : 0
  const { title, tone } = getMessage(percent)

  return (
    <div className="flex min-h-screen w-full flex-col px-5 py-8">
      {/* Score card */}
      <div className="flex flex-col items-center rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-xl">
        <p className={`text-2xl font-bold ${tone}`}>{title}</p>

        <div className="mt-6 flex h-32 w-32 flex-col items-center justify-center rounded-full bg-indigo-50">
          <span className="text-4xl font-bold tracking-tight text-indigo-600">
            {score}/{total}
          </span>
          <span className="mt-1 text-sm font-medium text-indigo-400">{percent}%</span>
        </div>

        <p className="mt-5 text-sm text-slate-500">
          Правильных ответов: {score} из {total}
        </p>
      </div>

      {/* Mistakes */}
      {mistakes.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Слова с ошибками
          </h2>
          <ul className="flex flex-col gap-2">
            {mistakes.map((word) => (
              <li
                key={word.id}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
              >
                <span className="font-semibold text-slate-900">{word.english}</span>
                <span className="text-sm text-slate-500">{word.russian}</span>
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
          className="min-h-12 w-full rounded-2xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 active:bg-indigo-800"
        >
          Пройти ещё раз
        </button>
        <button
          type="button"
          onClick={onOtherCategory}
          className="min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50 active:bg-slate-100"
        >
          Другая категория
        </button>
        <button
          type="button"
          onClick={onHome}
          className="min-h-12 w-full px-6 py-3 text-base font-medium text-slate-400 transition-colors hover:text-slate-600"
        >
          На главную
        </button>
      </div>
    </div>
  )
}

export default QuizResult

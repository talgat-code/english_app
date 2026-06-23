import { categories, getWordById, totalWordCount } from '../data/words'
import {
  averageScore,
  difficultWords,
  knownInCategory,
  knownWordsCount,
  useProgress,
} from '../hooks/useProgress'

function dayWord(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'день'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'дня'
  return 'дней'
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-indigo-600 transition-all duration-500 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

interface StatsProps {
  onSettings: () => void
}

function Stats({ onSettings }: StatsProps) {
  const progress = useProgress()

  const known = knownWordsCount(progress)
  const average = averageScore(progress)
  const streak = progress.stats.streak
  const hard = difficultWords(progress, 5)

  return (
    <div className="flex min-h-screen w-full flex-col px-5 py-8">
      <header className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Статистика
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Твой прогресс в изучении английского
          </p>
        </div>
        <button
          type="button"
          onClick={onSettings}
          className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Настройки
        </button>
      </header>

      {/* Streak */}
      <div className="mb-6 flex flex-col items-center rounded-3xl border border-orange-100 bg-gradient-to-b from-orange-50 to-white p-8 text-center shadow-sm">
        <span className="text-6xl">🔥</span>
        <p className="mt-2 text-4xl font-bold tracking-tight text-orange-600">
          {streak}
        </p>
        <p className="mt-1 text-sm font-medium text-slate-500">
          {streak > 0
            ? `${dayWord(streak)} подряд`
            : 'Начни заниматься сегодня!'}
        </p>
      </div>

      {/* Overall progress */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Общий прогресс
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm">
            <span className="text-2xl font-bold text-indigo-600">{known}</span>
            <span className="mt-1 text-xs text-slate-400">из {totalWordCount}</span>
            <span className="mt-1 text-xs font-medium text-slate-500">Слов изучено</span>
          </div>
          <div className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm">
            <span className="text-2xl font-bold text-indigo-600">
              {progress.stats.totalQuizzes}
            </span>
            <span className="mt-1 text-xs text-slate-400">&nbsp;</span>
            <span className="mt-1 text-xs font-medium text-slate-500">Квизов пройдено</span>
          </div>
          <div className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm">
            <span className="text-2xl font-bold text-indigo-600">{average}%</span>
            <span className="mt-1 text-xs text-slate-400">&nbsp;</span>
            <span className="mt-1 text-xs font-medium text-slate-500">Средний результат</span>
          </div>
        </div>
      </section>

      {/* Per-category progress */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Прогресс по категориям
        </h2>
        <ul className="flex flex-col gap-3">
          {categories.map((category) => {
            const ids = category.words.map((w) => w.id)
            const learned = knownInCategory(progress, ids)
            const total = ids.length
            const percent = total > 0 ? Math.round((learned / total) * 100) : 0
            return (
              <li
                key={category.id}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <span className="text-lg">{category.emoji}</span>
                    {category.title}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {learned} / {total}
                  </span>
                </div>
                <ProgressBar value={percent} />
              </li>
            )
          })}
        </ul>
      </section>

      {/* Difficult words */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Сложные слова
        </h2>
        {hard.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-center text-sm text-slate-400">
            Пройди несколько квизов — здесь появятся слова, которые стоит
            повторить.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {hard.map((item) => {
              const word = getWordById(item.wordId)
              if (!word) return null
              return (
                <li
                  key={item.wordId}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
                >
                  <span className="flex flex-col">
                    <span className="font-semibold text-slate-900">
                      {word.english}
                    </span>
                    <span className="text-sm text-slate-500">{word.russian}</span>
                  </span>
                  <span className="flex flex-col items-end">
                    <span className="text-sm font-bold text-rose-600">
                      {item.percent}%
                    </span>
                    <span className="text-xs text-slate-400">
                      верных
                    </span>
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}

export default Stats

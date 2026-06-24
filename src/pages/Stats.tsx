import { getIdiomsByCategory, idiomCategories, totalIdiomCount } from '../data/idioms'
import {
  getPhrasalVerbsByCategory,
  phrasalVerbCategories,
  totalPhrasalVerbCount,
} from '../data/phrasalVerbs'
import { categories, getWordById, totalWordCount } from '../data/words'
import {
  averageIdiomScore,
  averagePhrasalVerbScore,
  averageScore,
  difficultWords,
  knownIdiomsCount,
  knownInCategory,
  knownInIdiomCategory,
  knownInPhrasalVerbCategory,
  knownPhrasalVerbsCount,
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
    <div className="h-2 w-full overflow-hidden rounded-full bg-border">
      <div
        className="h-full rounded-full bg-primary transition-all duration-entrance ease-out"
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
  const knownIdioms = knownIdiomsCount(progress)
  const knownPhrasalVerbs = knownPhrasalVerbsCount(progress)
  const average = averageScore(progress)
  const idiomAverage = averageIdiomScore(progress)
  const phrasalVerbAverage = averagePhrasalVerbScore(progress)
  const streak = progress.stats.streak
  const hard = difficultWords(progress, 5)

  return (
    <div className="flex min-h-screen w-full flex-col px-4 py-8">
      <header className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Статистика
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Твой прогресс в изучении английского
          </p>
        </div>
        <button
          type="button"
          onClick={onSettings}
          className="rounded-2xl border border-border px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:bg-surface-muted"
        >
          Настройки
        </button>
      </header>

      {/* Streak */}
      <div className="mb-6 flex flex-col items-center rounded-3xl border border-warning-border bg-gradient-to-b from-warning-soft to-surface p-8 text-center shadow-sm">
        <span className="text-6xl">🔥</span>
        <p className="mt-2 text-4xl font-bold tracking-tight text-warning">
          {streak}
        </p>
        <p className="mt-1 text-sm font-medium text-text-secondary">
          {streak > 0
            ? `${dayWord(streak)} подряд`
            : 'Начни заниматься сегодня!'}
        </p>
      </div>

      {/* Overall progress */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-tertiary">
          Общий прогресс
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center rounded-2xl border border-border-subtle bg-surface p-4 text-center shadow-sm">
            <span className="text-2xl font-bold text-primary">{known}</span>
            <span className="mt-1 text-xs text-text-tertiary">из {totalWordCount}</span>
            <span className="mt-1 text-xs font-medium text-text-secondary">Слов изучено</span>
          </div>
          <div className="flex flex-col items-center rounded-2xl border border-border-subtle bg-surface p-4 text-center shadow-sm">
            <span className="text-2xl font-bold text-primary">
              {progress.stats.totalQuizzes}
            </span>
            <span className="mt-1 text-xs text-text-tertiary">&nbsp;</span>
            <span className="mt-1 text-xs font-medium text-text-secondary">Квизов пройдено</span>
          </div>
          <div className="flex flex-col items-center rounded-2xl border border-border-subtle bg-surface p-4 text-center shadow-sm">
            <span className="text-2xl font-bold text-primary">{average}%</span>
            <span className="mt-1 text-xs text-text-tertiary">&nbsp;</span>
            <span className="mt-1 text-xs font-medium text-text-secondary">Средний результат</span>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-tertiary">
          Идиомы
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center rounded-2xl border border-border-subtle bg-surface p-4 text-center shadow-sm">
            <span className="text-2xl font-bold text-warning">{knownIdioms}</span>
            <span className="mt-1 text-xs text-text-tertiary">из {totalIdiomCount}</span>
            <span className="mt-1 text-xs font-medium text-text-secondary">Выучено</span>
          </div>
          <div className="flex flex-col items-center rounded-2xl border border-border-subtle bg-surface p-4 text-center shadow-sm">
            <span className="text-2xl font-bold text-warning">
              {progress.idiomStats.totalQuizzes}
            </span>
            <span className="mt-1 text-xs text-text-tertiary">&nbsp;</span>
            <span className="mt-1 text-xs font-medium text-text-secondary">Квизов</span>
          </div>
          <div className="flex flex-col items-center rounded-2xl border border-border-subtle bg-surface p-4 text-center shadow-sm">
            <span className="text-2xl font-bold text-warning">{idiomAverage}%</span>
            <span className="mt-1 text-xs text-text-tertiary">&nbsp;</span>
            <span className="mt-1 text-xs font-medium text-text-secondary">Средний результат</span>
          </div>
        </div>

        <ul className="mt-3 flex flex-col gap-3">
          {idiomCategories.map((category) => {
            const ids = getIdiomsByCategory(category.id).map((idiom) => idiom.id)
            const learned = knownInIdiomCategory(progress, ids)
            const total = ids.length
            const percent = total > 0 ? Math.round((learned / total) * 100) : 0

            return (
              <li
                key={category.id}
                className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                    <span className="text-lg">{category.emoji}</span>
                    {category.label}
                  </span>
                  <span className="text-xs font-medium text-text-secondary">
                    {learned} / {total}
                  </span>
                </div>
                <ProgressBar value={percent} />
              </li>
            )
          })}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-tertiary">
          Фразовые глаголы
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center rounded-2xl border border-border-subtle bg-surface p-4 text-center shadow-sm">
            <span className="text-2xl font-bold text-success">
              {knownPhrasalVerbs}
            </span>
            <span className="mt-1 text-xs text-text-tertiary">
              из {totalPhrasalVerbCount}
            </span>
            <span className="mt-1 text-xs font-medium text-text-secondary">Выучено</span>
          </div>
          <div className="flex flex-col items-center rounded-2xl border border-border-subtle bg-surface p-4 text-center shadow-sm">
            <span className="text-2xl font-bold text-success">
              {progress.phrasalVerbStats.totalQuizzes}
            </span>
            <span className="mt-1 text-xs text-text-tertiary">&nbsp;</span>
            <span className="mt-1 text-xs font-medium text-text-secondary">Квизов</span>
          </div>
          <div className="flex flex-col items-center rounded-2xl border border-border-subtle bg-surface p-4 text-center shadow-sm">
            <span className="text-2xl font-bold text-success">
              {phrasalVerbAverage}%
            </span>
            <span className="mt-1 text-xs text-text-tertiary">&nbsp;</span>
            <span className="mt-1 text-xs font-medium text-text-secondary">
              Средний результат
            </span>
          </div>
        </div>

        <ul className="mt-3 flex flex-col gap-3">
          {phrasalVerbCategories.map((category) => {
            const ids = getPhrasalVerbsByCategory(category.id).map(
              (phrasalVerb) => phrasalVerb.id,
            )
            const learned = knownInPhrasalVerbCategory(progress, ids)
            const total = ids.length
            const percent = total > 0 ? Math.round((learned / total) * 100) : 0

            return (
              <li
                key={category.id}
                className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                    <span className="text-lg">{category.emoji}</span>
                    {category.label}
                  </span>
                  <span className="text-xs font-medium text-text-secondary">
                    {learned} / {total}
                  </span>
                </div>
                <ProgressBar value={percent} />
              </li>
            )
          })}
        </ul>
      </section>

      {/* Per-category progress */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-tertiary">
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
                className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                    <span className="text-lg">{category.emoji}</span>
                    {category.title}
                  </span>
                  <span className="text-xs font-medium text-text-secondary">
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
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-tertiary">
          Сложные слова
        </h2>
        {hard.length === 0 ? (
          <div className="empty-state">
            <span className="text-5xl">🌱</span>
            <h3 className="mt-3 text-base font-bold text-text-primary">
              Сложных слов пока нет
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              Пройди несколько квизов — здесь появятся слова, которые стоит
              повторить.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {hard.map((item) => {
              const word = getWordById(item.wordId)
              if (!word) return null
              return (
                <li
                  key={item.wordId}
                  className="flex items-center justify-between rounded-2xl border border-border-subtle bg-surface px-4 py-3 shadow-sm"
                >
                  <span className="flex flex-col">
                    <span className="font-semibold text-text-primary">
                      {word.english}
                    </span>
                    <span className="text-sm text-text-secondary">{word.russian}</span>
                  </span>
                  <span className="flex flex-col items-end">
                    <span className="text-sm font-bold text-error">
                      {item.percent}%
                    </span>
                    <span className="text-xs text-text-tertiary">
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

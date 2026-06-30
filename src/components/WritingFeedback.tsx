import type { WritingFeedbackResult } from '../types/writing'

interface WritingFeedbackProps {
  feedback: WritingFeedbackResult
  text: string
  prompt: string
  onRetry?: () => void
  onNewPrompt?: () => void
  onSave?: () => void
  primaryLabel?: string
  secondaryLabel?: string
  saveDisabled?: boolean
  saveLabel?: string
}

function scoreClasses(score: number): string {
  if (score >= 8) {
    return 'border-success-border bg-success-soft text-success'
  }

  if (score >= 5) {
    return 'border-warning-border bg-warning-soft text-warning'
  }

  return 'border-orange-200 bg-orange-100 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300'
}

function WritingFeedback({
  feedback,
  text,
  prompt,
  onRetry,
  onNewPrompt,
  onSave,
  primaryLabel = 'Написать ещё раз',
  secondaryLabel = 'Новая тема',
  saveDisabled = false,
  saveLabel = 'Сохранить в историю',
}: WritingFeedbackProps) {
  const normalizedScore = Math.max(1, Math.min(10, Math.round(feedback.score)))
  const hasActions = Boolean(onRetry || onNewPrompt || onSave)

  return (
    <section className="flex min-h-screen w-full flex-col px-4 py-6">
      <header className="border-b border-border pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          Проверка письма
        </p>
        <div className="mt-3 flex items-center justify-between gap-4">
          <div className={`rounded-lg border px-4 py-3 ${scoreClasses(normalizedScore)}`}>
            <p className="text-3xl font-bold leading-none">{normalizedScore}/10</p>
          </div>
          <p className="flex-1 text-sm leading-relaxed text-text-secondary">
            {feedback.overallFeedback}
          </p>
        </div>
      </header>

      <div className="mt-5 rounded-lg border border-border bg-surface p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          Задание
        </p>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-text-primary">
          {prompt}
        </p>
      </div>

      <article className="mt-4 rounded-lg border border-border bg-surface p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          Твой текст
        </p>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
          {text}
        </p>
      </article>

      <section className="mt-4">
        <h2 className="text-base font-semibold text-text-primary">Исправления</h2>
        {feedback.corrections.length === 0 ? (
          <div className="mt-3 rounded-lg border border-success-border bg-success-soft p-4">
            <p className="text-sm font-semibold text-success">
              Явных ошибок не найдено. Отличная работа.
            </p>
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {feedback.corrections.map((correction, index) => (
              <article
                key={`${correction.original}-${index}`}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <div className="grid gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-error">
                      Было
                    </p>
                    <p className="mt-1 rounded-md bg-error-soft px-3 py-2 text-sm text-error">
                      {correction.original}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-success">
                      Стало
                    </p>
                    <p className="mt-1 rounded-md bg-success-soft px-3 py-2 text-sm text-success">
                      {correction.corrected}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {correction.explanation}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-4 rounded-lg border border-success-border bg-success-soft p-4">
        <h2 className="text-base font-semibold text-success">
          Что получилось хорошо ✅
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-success">
          {feedback.strengths}
        </p>
      </section>

      {hasActions && (
        <div className="mt-5 grid gap-2">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="min-h-12 rounded-lg border border-border-strong bg-surface px-4 text-sm font-semibold text-text-secondary transition-colors hover:bg-surface-muted"
            >
              {primaryLabel}
            </button>
          )}
          {onNewPrompt && (
            <button
              type="button"
              onClick={onNewPrompt}
              className="min-h-12 rounded-lg bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              {secondaryLabel}
            </button>
          )}
          {onSave && (
            <button
              type="button"
              onClick={onSave}
              disabled={saveDisabled}
              className="min-h-12 rounded-lg bg-success px-4 text-sm font-semibold text-white transition-colors hover:bg-success-hover disabled:bg-success-soft disabled:text-success"
            >
              {saveLabel}
            </button>
          )}
        </div>
      )}
    </section>
  )
}

export default WritingFeedback

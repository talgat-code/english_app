import type { ReactNode } from 'react'
import type { WordStatus } from '../types'

interface ExpressionCardProps {
  cardId: string
  title: string
  status?: WordStatus
  isHighlighted?: boolean
  onToggle?: () => void
  onSpeak?: () => void
  speakLabel?: string
  subtitle?: ReactNode
  summary?: ReactNode
  extraBadges?: ReactNode
  children?: ReactNode
}

function StatusBadge({ status }: { status?: WordStatus }) {
  if (status === 'known') {
    return (
      <span className="rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">
        Знаю
      </span>
    )
  }

  if (status === 'learning') {
    return (
      <span className="rounded-full bg-warning-soft px-2.5 py-1 text-xs font-semibold text-warning">
        Учу
      </span>
    )
  }

  return null
}

function ExpressionCard({
  cardId,
  title,
  status,
  isHighlighted = false,
  onToggle,
  onSpeak,
  speakLabel,
  subtitle,
  summary,
  extraBadges,
  children,
}: ExpressionCardProps) {
  const heading = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-xl font-semibold tracking-tight text-text-primary">
          {title}
        </h2>
        <StatusBadge status={status} />
        {extraBadges}
      </div>
      {subtitle}
      {summary}
    </>
  )

  return (
    <li
      id={cardId}
      className={`rounded-2xl border bg-surface p-4 shadow-sm transition-colors ${
        isHighlighted
          ? 'border-primary-border shadow-md'
          : 'border-border-subtle hover:border-border'
      }`}
    >
      <div className="flex items-start gap-3">
        {onToggle ? (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isHighlighted}
            className="flex-1 text-left"
          >
            {heading}
          </button>
        ) : (
          <div className="flex-1 text-left">{heading}</div>
        )}

        {onSpeak && (
          <button
            type="button"
            onClick={onSpeak}
            aria-label={speakLabel ?? `Произнести ${title}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xl transition-transform hover:scale-105 active:scale-95"
          >
            🔊
          </button>
        )}
      </div>

      {children && (
        <div className="mt-4 border-t border-border-subtle pt-4">{children}</div>
      )}
    </li>
  )
}

export default ExpressionCard

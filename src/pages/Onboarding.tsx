import { useState } from 'react'
import {
  completeOnboarding,
  getReminderStatus,
  requestPermission,
  scheduleReminder,
  setRemindersEnabled,
  useNotificationSettings,
} from '../hooks/useNotifications'

interface OnboardingProps {
  onDone: () => void
}

function Onboarding({ onDone }: OnboardingProps) {
  const [step, setStep] = useState(0)
  const settings = useNotificationSettings()
  const permission = getReminderStatus()
  const remindersBlocked = permission === 'denied'

  async function handleReminderToggle(enabled: boolean) {
    if (!enabled) {
      setRemindersEnabled(false)
      return
    }

    const nextPermission = await requestPermission()
    if (nextPermission === 'granted') {
      setRemindersEnabled(true)
      return
    }

    setRemindersEnabled(false)
  }

  function finishOnboarding() {
    completeOnboarding()
    onDone()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background px-4 py-8 text-text-primary">
      <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col justify-between">
        <div>
          <div className="mb-6 flex items-center gap-2">
            <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary dark:text-text-primary">
              Шаг {step + 1} из 2
            </span>
          </div>

          {step === 0 ? (
            <section className="rounded-3xl bg-surface p-6 shadow-sm">
              <span className="text-5xl">📚</span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary">
                English App
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                Уроки, карточки, квизы и повторение в одном приложении. Давай быстро настроим ежедневную практику.
              </p>
            </section>
          ) : (
            <section className="rounded-3xl bg-surface p-6 shadow-sm">
              <span className="text-5xl">⏰</span>
              <h1 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
                Ежедневные напоминания
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                Приложение проверит напоминание при открытии, а в некоторых браузерах попробует и фоновую проверку через service worker.
              </p>

              <label className="mt-5 flex items-center justify-between rounded-2xl border border-border px-4 py-3">
                <span>
                  <span className="block text-sm font-semibold text-text-primary">Напоминания</span>
                  <span className="mt-1 block text-xs text-text-secondary">Включить локальные уведомления браузера</span>
                </span>
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-primary"
                  checked={settings.remindersEnabled}
                  onChange={(event) => void handleReminderToggle(event.target.checked)}
                  disabled={remindersBlocked}
                />
              </label>

              <label className="mt-4 block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                  Время напоминания
                </span>
                <input
                  type="time"
                  value={settings.reminderTime}
                  onChange={(event) => scheduleReminder(event.target.value)}
                  className="min-h-11 w-full rounded-2xl border border-border bg-surface-muted px-4 text-sm outline-none focus:border-primary"
                />
              </label>

              {remindersBlocked && (
                <p className="mt-4 rounded-2xl border border-warning-border bg-warning-soft px-4 py-3 text-sm text-warning">
                  Уведомления заблокированы, можно включить в настройках браузера
                </p>
              )}
            </section>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="min-h-11 flex-1 rounded-2xl border border-border-strong px-4 text-sm font-semibold text-text-secondary"
            >
              Назад
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (step === 0) setStep(1)
              else finishOnboarding()
            }}
            className="min-h-11 flex-1 rounded-2xl bg-primary px-4 text-sm font-semibold text-white"
          >
            {step === 0 ? 'Продолжить' : 'Начать обучение'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Onboarding

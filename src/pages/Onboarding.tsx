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
    <div className="flex min-h-screen flex-col bg-zinc-50 px-5 py-8 text-slate-900">
      <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col justify-between">
        <div>
          <div className="mb-6 flex items-center gap-2">
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              Шаг {step + 1} из 2
            </span>
          </div>

          {step === 0 ? (
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <span className="text-5xl">📚</span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
                English App
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Уроки, карточки, квизы и повторение в одном приложении. Давай быстро настроим ежедневную практику.
              </p>
            </section>
          ) : (
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <span className="text-5xl">⏰</span>
              <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
                Ежедневные напоминания
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Приложение проверит напоминание при открытии, а в некоторых браузерах попробует и фоновую проверку через service worker.
              </p>

              <label className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                <span>
                  <span className="block text-sm font-semibold text-slate-900">Напоминания</span>
                  <span className="mt-1 block text-xs text-slate-500">Включить локальные уведомления браузера</span>
                </span>
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-indigo-600"
                  checked={settings.remindersEnabled}
                  onChange={(event) => void handleReminderToggle(event.target.checked)}
                  disabled={remindersBlocked}
                />
              </label>

              <label className="mt-4 block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Время напоминания
                </span>
                <input
                  type="time"
                  value={settings.reminderTime}
                  onChange={(event) => scheduleReminder(event.target.value)}
                  className="min-h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-indigo-400"
                />
              </label>

              {remindersBlocked && (
                <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
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
              className="min-h-11 flex-1 rounded-2xl border border-slate-300 px-4 text-sm font-semibold text-slate-700"
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
            className="min-h-11 flex-1 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white"
          >
            {step === 0 ? 'Продолжить' : 'Начать обучение'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Onboarding

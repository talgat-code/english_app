import {
  getReminderStatus,
  requestPermission,
  scheduleReminder,
  setRemindersEnabled,
  useNotificationSettings,
} from '../hooks/useNotifications'

interface SettingsProps {
  onBack: () => void
}

function permissionLabel(permission: ReturnType<typeof getReminderStatus>): string {
  if (permission === 'granted') return 'Разрешено ✅'
  if (permission === 'denied') return 'Запрещено ❌'
  if (permission === 'unsupported') return 'Не поддерживается'
  return 'Не запрошено'
}

function Settings({ onBack }: SettingsProps) {
  const settings = useNotificationSettings()
  const permission = getReminderStatus()
  const denied = permission === 'denied'

  async function handleEnableReminders() {
    const nextPermission = await requestPermission()
    if (nextPermission === 'granted') {
      setRemindersEnabled(true)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col px-5 py-8">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-semibold text-slate-500"
          >
            ← Назад
          </button>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            Настройки
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Локальные уведомления и ежедневное время напоминания.
          </p>
        </div>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Напоминания</h2>
        <p className="mt-1 text-sm text-slate-500">
          Статус браузерных уведомлений: {permissionLabel(permission)}
        </p>

        {denied ? (
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Уведомления заблокированы, можно включить в настройках браузера
          </p>
        ) : (
          <label className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
            <span>
              <span className="block text-sm font-semibold text-slate-900">Напоминания</span>
              <span className="mt-1 block text-xs text-slate-500">Ежедневная проверка и локальное уведомление</span>
            </span>
            <input
              type="checkbox"
              className="h-5 w-5 accent-indigo-600"
              checked={settings.remindersEnabled}
              onChange={(event) => {
                if (!event.target.checked) {
                  setRemindersEnabled(false)
                } else {
                  void handleEnableReminders()
                }
              }}
            />
          </label>
        )}

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
      </section>
    </div>
  )
}

export default Settings

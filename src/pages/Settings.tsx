import {
  getReminderStatus,
  requestPermission,
  scheduleReminder,
  setRemindersEnabled,
  useNotificationSettings,
} from '../hooks/useNotifications'
import type { Theme } from '../hooks/useTheme'

interface SettingsProps {
  theme: Theme
  onToggleTheme: () => void
  onBack: () => void
}

function permissionLabel(permission: ReturnType<typeof getReminderStatus>): string {
  if (permission === 'granted') return 'Разрешено ✅'
  if (permission === 'denied') return 'Запрещено ❌'
  if (permission === 'unsupported') return 'Не поддерживается'
  return 'Не запрошено'
}

function Settings({ theme, onToggleTheme, onBack }: SettingsProps) {
  const settings = useNotificationSettings()
  const permission = getReminderStatus()
  const denied = permission === 'denied'
  const isDark = theme === 'dark'

  async function handleEnableReminders() {
    const nextPermission = await requestPermission()
    if (nextPermission === 'granted') {
      setRemindersEnabled(true)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col px-4 py-8">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-semibold text-text-secondary"
          >
            ← Назад
          </button>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-text-primary">
            Настройки
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Тема, локальные уведомления и ежедневное время напоминания.
          </p>
        </div>
      </header>

      <section className="mb-4 rounded-3xl border border-border bg-surface p-5 shadow-sm">
        <h2 className="text-base font-semibold text-text-primary">Внешний вид</h2>
        <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface-muted px-4 py-3">
          <span>
            <span className="block text-sm font-semibold text-text-primary">Тёмная тема</span>
            <span className="mt-1 block text-xs text-text-secondary">
              Переключение сохраняется на этом устройстве
            </span>
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isDark}
            aria-label="Тёмная тема"
            onClick={onToggleTheme}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
              isDark ? 'bg-primary' : 'bg-border-strong'
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform dark:bg-text-primary ${
                isDark ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
        <h2 className="text-base font-semibold text-text-primary">Напоминания</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Статус браузерных уведомлений: {permissionLabel(permission)}
        </p>

        {denied ? (
          <p className="mt-4 rounded-2xl border border-warning-border bg-warning-soft px-4 py-3 text-sm text-warning">
            Уведомления заблокированы, можно включить в настройках браузера
          </p>
        ) : (
          <label className="mt-4 flex items-center justify-between rounded-2xl border border-border px-4 py-3">
            <span>
              <span className="block text-sm font-semibold text-text-primary">Напоминания</span>
              <span className="mt-1 block text-xs text-text-secondary">Ежедневная проверка и локальное уведомление</span>
            </span>
            <input
              type="checkbox"
              className="h-5 w-5 accent-primary"
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
      </section>
    </div>
  )
}

export default Settings

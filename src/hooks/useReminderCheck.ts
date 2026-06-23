import { useEffect } from 'react'
import {
  checkAndShowReminder,
  getReminderSettings,
  getReminderStatus,
  hydrateReminderState,
  syncReminderState,
  useNotificationSettings,
} from './useNotifications'

const REMINDER_INTERVAL_MS = 5 * 60 * 1000

interface PeriodicSyncManagerLike {
  register: (tag: string, options: { minInterval: number }) => Promise<void>
}

interface ServiceWorkerRegistrationWithPeriodicSync extends ServiceWorkerRegistration {
  periodicSync?: PeriodicSyncManagerLike
}

export function useReminderCheck(lastActiveDate?: string): void {
  const settings = useNotificationSettings()

  useEffect(() => {
    void hydrateReminderState()
  }, [])

  useEffect(() => {
    void syncReminderState(lastActiveDate)
  }, [lastActiveDate, settings.remindersEnabled, settings.reminderTime])

  useEffect(() => {
    void checkAndShowReminder(lastActiveDate)

    const timer = window.setInterval(() => {
      void checkAndShowReminder(lastActiveDate)
    }, REMINDER_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [lastActiveDate, settings.remindersEnabled, settings.reminderTime])

  useEffect(() => {
    async function registerPeriodicSync() {
      if (!('serviceWorker' in navigator)) return
      if (getReminderStatus() !== 'granted') return
      if (!getReminderSettings().remindersEnabled) return

      try {
        const registration = await navigator.serviceWorker.ready as ServiceWorkerRegistrationWithPeriodicSync
        if (!registration.periodicSync) return

        await syncReminderState(lastActiveDate)

        // Without a backend, closed-app reminders are best-effort only.
        // The reliable fallback is showing the reminder on the next app open.
        await registration.periodicSync.register('english-app-reminder-check', {
          minInterval: 12 * 60 * 60 * 1000,
        })
      } catch {
        // Ignore unsupported background sync registration.
      }
    }

    void registerPeriodicSync()
  }, [lastActiveDate, settings.remindersEnabled, settings.reminderTime])
}

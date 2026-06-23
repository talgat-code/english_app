/// <reference lib="WebWorker" />

import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { readReminderWorkerState, writeReminderWorkerState } from './utils/reminderState'

declare let self: ServiceWorkerGlobalScope

interface PeriodicSyncEventLike extends ExtendableEvent {
  tag: string
}

precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()
self.skipWaiting()
clientsClaim()

function dateKey(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isReminderDue(reminderTime: string, now = new Date()): boolean {
  if (!/^\d{2}:\d{2}$/.test(reminderTime)) return false

  const [hours, minutes] = reminderTime.split(':').map(Number)
  const reminderDate = new Date(now)
  reminderDate.setHours(hours, minutes, 0, 0)
  return now.getTime() >= reminderDate.getTime()
}

async function maybeShowPeriodicReminder(): Promise<void> {
  const state = await readReminderWorkerState()
  if (!state?.remindersEnabled) return

  const today = dateKey()
  if (!isReminderDue(state.reminderTime)) return
  if (state.lastActiveDate === today) return
  if (state.lastNotificationDate === today) return

  // Without a backend or push service, fully closed-app notifications are
  // best-effort only and depend on browser support for periodic background sync.
  await self.registration.showNotification('Время учить английский! 📚', {
    body: 'Не теряй свою серию занятий 🔥',
    icon: `${import.meta.env.BASE_URL}icons/icon-192.png`,
    badge: `${import.meta.env.BASE_URL}icons/icon-192.png`,
    data: {
      url: new URL(import.meta.env.BASE_URL, self.location.origin).toString(),
    },
  })

  await writeReminderWorkerState({
    ...state,
    lastNotificationDate: today,
  })
}

self.addEventListener('periodicsync', (event) => {
  const periodicEvent = event as PeriodicSyncEventLike
  if (periodicEvent.tag !== 'english-app-reminder-check') return
  periodicEvent.waitUntil(maybeShowPeriodicReminder())
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil((async () => {
    const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    const targetUrl = String(
      event.notification.data?.url ?? new URL(import.meta.env.BASE_URL, self.location.origin),
    )

    for (const client of allClients) {
      if ('focus' in client) {
        await client.focus()
        if ('navigate' in client) {
          await client.navigate(targetUrl)
        }
        return
      }
    }

    await self.clients.openWindow(targetUrl)
  })())
})

export interface ReminderWorkerState {
  remindersEnabled: boolean
  reminderTime: string
  lastActiveDate?: string
  lastNotificationDate?: string
}

const REMINDER_CACHE_NAME = 'english-app-reminder-state'
const REMINDER_CACHE_PATH = `${import.meta.env.BASE_URL}__reminder_state__`

function canUseCacheStorage(): boolean {
  return typeof caches !== 'undefined'
}

function getReminderRequest(): Request {
  const origin = typeof self !== 'undefined' && 'location' in self
    ? self.location.origin
    : 'http://localhost'

  return new Request(new URL(REMINDER_CACHE_PATH, origin).toString())
}

export async function readReminderWorkerState(): Promise<ReminderWorkerState | undefined> {
  if (!canUseCacheStorage()) return undefined

  try {
    const cache = await caches.open(REMINDER_CACHE_NAME)
    const response = await cache.match(getReminderRequest())
    if (!response) return undefined
    return (await response.json()) as ReminderWorkerState
  } catch {
    return undefined
  }
}

export async function writeReminderWorkerState(state: ReminderWorkerState): Promise<void> {
  if (!canUseCacheStorage()) return

  try {
    const cache = await caches.open(REMINDER_CACHE_NAME)
    await cache.put(
      getReminderRequest(),
      new Response(JSON.stringify(state), {
        headers: { 'content-type': 'application/json' },
      }),
    )
  } catch {
    // Ignore cache storage errors; the next app open can resync the reminder state.
  }
}

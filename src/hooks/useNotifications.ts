import { useSyncExternalStore } from 'react'
import { readReminderWorkerState, writeReminderWorkerState } from '../utils/reminderState'

const REMINDER_SETTINGS_KEY = 'english-app:reminder-settings:v1'
const LAST_NOTIFICATION_DATE_KEY = 'english-app:last-notification-date:v1'
const DEFAULT_REMINDER_TIME = '19:00'

export type NotificationPermissionState = NotificationPermission | 'unsupported'

export interface ReminderSettings {
  remindersEnabled: boolean
  reminderTime: string
  onboardingCompleted: boolean
}

const serverSnapshot: ReminderSettings = {
  remindersEnabled: false,
  reminderTime: DEFAULT_REMINDER_TIME,
  onboardingCompleted: false,
}

function canUseBrowserStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isValidReminderTime(value: unknown): value is string {
  if (typeof value !== 'string') return false
  if (!/^\d{2}:\d{2}$/.test(value)) return false

  const [hours, minutes] = value.split(':').map(Number)
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59
}

function normalizeSettings(value: unknown): ReminderSettings {
  if (!isRecord(value)) return serverSnapshot

  return {
    remindersEnabled: value.remindersEnabled === true,
    reminderTime: isValidReminderTime(value.reminderTime)
      ? value.reminderTime
      : DEFAULT_REMINDER_TIME,
    onboardingCompleted: value.onboardingCompleted === true,
  }
}

function loadSettings(): ReminderSettings {
  if (!canUseBrowserStorage()) return serverSnapshot

  try {
    return normalizeSettings(JSON.parse(window.localStorage.getItem(REMINDER_SETTINGS_KEY) ?? 'null'))
  } catch {
    return serverSnapshot
  }
}

let settingsState = loadSettings()
const listeners = new Set<() => void>()
let reminderCheckInFlightDate: string | undefined

function notify(): void {
  for (const listener of listeners) {
    listener()
  }
}

function persistSettings(nextState: ReminderSettings): void {
  settingsState = nextState

  if (canUseBrowserStorage()) {
    try {
      window.localStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(nextState))
    } catch {
      // Ignore blocked storage and keep settings for the current browser session.
    }
  }

  notify()
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot(): ReminderSettings {
  return settingsState
}

function getServerSnapshot(): ReminderSettings {
  return serverSnapshot
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== REMINDER_SETTINGS_KEY && event.key !== LAST_NOTIFICATION_DATE_KEY) {
      return
    }

    settingsState = loadSettings()
    notify()
  })
}

function dateKey(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getLastNotificationDate(): string | undefined {
  if (!canUseBrowserStorage()) return undefined

  try {
    return window.localStorage.getItem(LAST_NOTIFICATION_DATE_KEY) ?? undefined
  } catch {
    return undefined
  }
}

function isReminderDue(reminderTime: string, now = new Date()): boolean {
  const [hours, minutes] = reminderTime.split(':').map(Number)
  const reminderDate = new Date(now)
  reminderDate.setHours(hours, minutes, 0, 0)
  return now.getTime() >= reminderDate.getTime()
}

async function syncReminderWorkerSnapshot(lastActiveDate?: string): Promise<void> {
  await writeReminderWorkerState({
    remindersEnabled: settingsState.remindersEnabled,
    reminderTime: settingsState.reminderTime,
    lastActiveDate,
    lastNotificationDate: getLastNotificationDate(),
  })
}

async function markNotificationShown(date: string, lastActiveDate?: string): Promise<void> {
  if (canUseBrowserStorage()) {
    try {
      window.localStorage.setItem(LAST_NOTIFICATION_DATE_KEY, date)
    } catch {
      // Ignore storage errors; the in-memory app session still continues.
    }
  }

  await syncReminderWorkerSnapshot(lastActiveDate)
  notify()
}

export function useNotificationSettings(): ReminderSettings {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function getReminderSettings(): ReminderSettings {
  return settingsState
}

export function getReminderStatus(): NotificationPermissionState {
  if (typeof Notification === 'undefined') return 'unsupported'
  return Notification.permission
}

export function setRemindersEnabled(remindersEnabled: boolean): void {
  persistSettings({
    ...settingsState,
    remindersEnabled,
  })
}

export function scheduleReminder(time: string): void {
  if (!isValidReminderTime(time)) return

  persistSettings({
    ...settingsState,
    reminderTime: time,
  })
}

export function completeOnboarding(): void {
  persistSettings({
    ...settingsState,
    onboardingCompleted: true,
  })
}

export async function requestPermission(): Promise<NotificationPermissionState> {
  if (typeof Notification === 'undefined') return 'unsupported'

  const permission = await Notification.requestPermission()
  notify()
  return permission
}

export async function showNotification(title: string, body: string): Promise<boolean> {
  if (typeof window === 'undefined') return false
  if (getReminderStatus() !== 'granted') return false

  const url = new URL(import.meta.env.BASE_URL, window.location.origin).toString()
  const options: NotificationOptions = {
    body,
    icon: `${import.meta.env.BASE_URL}icons/icon-192.png`,
    badge: `${import.meta.env.BASE_URL}icons/icon-192.png`,
    data: { url },
  }

  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready
      await registration.showNotification(title, options)
      return true
    }

    const notification = new Notification(title, options)
    notification.onclick = () => {
      window.focus()
      window.location.href = url
      notification.close()
    }

    return true
  } catch {
    return false
  }
}

export async function syncReminderState(lastActiveDate?: string): Promise<void> {
  await syncReminderWorkerSnapshot(lastActiveDate)
}

export async function checkAndShowReminder(lastActiveDate?: string): Promise<boolean> {
  if (typeof window === 'undefined') return false

  const today = dateKey()
  if (reminderCheckInFlightDate === today) return false

  const settings = getReminderSettings()
  if (!settings.remindersEnabled) return false
  if (getReminderStatus() !== 'granted') return false
  if (!isReminderDue(settings.reminderTime)) return false
  if (lastActiveDate === today) return false
  if (getLastNotificationDate() === today) return false

  reminderCheckInFlightDate = today

  const shown = await showNotification(
    'Время учить английский! 📚',
    'Не теряй свою серию занятий 🔥',
  )

  if (shown) {
    await markNotificationShown(today, lastActiveDate)
  }

  reminderCheckInFlightDate = undefined
  return shown
}

export async function hydrateReminderState(): Promise<void> {
  const current = await readReminderWorkerState()

  await writeReminderWorkerState({
    remindersEnabled: settingsState.remindersEnabled,
    reminderTime: settingsState.reminderTime,
    lastActiveDate: current?.lastActiveDate,
    lastNotificationDate: getLastNotificationDate() ?? current?.lastNotificationDate,
  })
}

function getBrowserStorage(): Storage | null {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return null
  }

  return window.localStorage
}

export function readStorageItem(key: string): string | null {
  try {
    return getBrowserStorage()?.getItem(key) ?? null
  } catch {
    return null
  }
}

export function writeStorageItem(key: string, value: string): void {
  try {
    getBrowserStorage()?.setItem(key, value)
  } catch {
    // Storage is optional; callers keep in-memory state for the current session.
  }
}

export function removeStorageItem(key: string): void {
  try {
    getBrowserStorage()?.removeItem(key)
  } catch {
    // Ignore inaccessible storage.
  }
}

export function readJsonStorage<T>(
  key: string,
  fallback: T,
  normalize: (value: unknown) => T,
): T {
  const raw = readStorageItem(key)
  if (!raw) return fallback

  try {
    return normalize(JSON.parse(raw))
  } catch {
    return fallback
  }
}

export function writeJsonStorage(key: string, value: unknown): void {
  writeStorageItem(key, JSON.stringify(value))
}

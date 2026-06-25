import { useCallback, useEffect, useMemo, useState } from 'react'

export type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'theme'

const THEME_COLORS: Record<Theme, string> = {
  light: '#f8fafc',
  dark: '#121212',
}

const FALLBACK_MANIFEST = {
  name: 'English App',
  short_name: 'English',
  description: 'Learn English vocabulary with flashcards, quizzes, and review.',
  start_url: './',
  scope: './',
  display: 'standalone',
  icons: [
    {
      src: 'icons/icon-192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: 'icons/icon-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: 'icons/maskable-192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable',
    },
    {
      src: 'icons/maskable-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
}

let manifestSourceHref: string | null = null
let cachedManifest: Record<string, unknown> | null = null
let manifestObjectUrl: string | null = null

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark'
}

function getStoredTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(value) ? value : null
  } catch {
    return null
  }
}

function getSystemTheme(): Theme {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }

  return 'light'
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'

  return getStoredTheme() ?? getSystemTheme()
}

function storeTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Ignore storage failures in private browsing or restricted webviews.
  }
}

function updateThemeColor(theme: Theme) {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (meta) {
    meta.content = THEME_COLORS[theme]
  }
}

async function loadManifest(
  manifestHref: string,
): Promise<Record<string, unknown>> {
  if (cachedManifest) return cachedManifest

  try {
    const response = await fetch(manifestHref)
    if (!response.ok) throw new Error('Manifest request failed')
    cachedManifest = (await response.json()) as Record<string, unknown>
  } catch {
    cachedManifest = FALLBACK_MANIFEST
  }

  return cachedManifest
}

async function updateManifestTheme(theme: Theme) {
  const link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]')
  if (!link) return

  if (!manifestSourceHref) {
    const href = link.getAttribute('href')
    if (href && !href.startsWith('blob:')) {
      manifestSourceHref = href
    }
  }

  if (!manifestSourceHref) return

  const manifest = await loadManifest(manifestSourceHref)
  const themedManifest = {
    ...manifest,
    background_color: THEME_COLORS[theme],
    theme_color: THEME_COLORS[theme],
  }
  const blob = new Blob([JSON.stringify(themedManifest)], {
    type: 'application/manifest+json',
  })
  const nextUrl = URL.createObjectURL(blob)

  if (manifestObjectUrl) {
    URL.revokeObjectURL(manifestObjectUrl)
  }

  manifestObjectUrl = nextUrl
  link.href = nextUrl
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  updateThemeColor(theme)
  void updateManifestTheme(theme)
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const setTheme = useCallback((nextTheme: Theme) => {
    storeTheme(nextTheme)
    setThemeState(nextTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((currentTheme) => {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark'
      storeTheme(nextTheme)
      return nextTheme
    })
  }, [])

  return useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      setTheme,
      toggleTheme,
    }),
    [setTheme, theme, toggleTheme],
  )
}

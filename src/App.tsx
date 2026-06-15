import { useEffect, useState } from 'react'
import {
  isStreakInterrupted,
  reviewWords,
  useProgress,
} from './hooks/useProgress'
import Categories from './pages/Categories'
import Flashcards from './pages/Flashcards'
import Games from './pages/Games'
import Hangman from './pages/Hangman'
import Quiz from './pages/Quiz'
import Review from './pages/Review'
import Stats from './pages/Stats'
import WordBuilder from './pages/WordBuilder'
import type { GameType } from './utils/games'

type Screen =
  | { name: 'home' }
  | { name: 'categories' }
  | { name: 'games'; game?: GameType }
  | { name: 'review' }
  | { name: 'stats' }
  | { name: 'flashcards'; categoryId: string }
  | { name: 'quiz'; categoryId: string }
  | { name: 'hangman'; categoryId: string }
  | { name: 'word-builder'; categoryId: string }

type Tab = 'home' | 'learn' | 'games' | 'review' | 'stats'

function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })
  const progress = useProgress()
  const hardWordCount = reviewWords(progress).length
  const streakInterrupted = isStreakInterrupted(progress)

  // The tab bar is shown on the top-level destinations. It's hidden during the
  // focused study flows (flashcards / quiz), which have their own bottom
  // controls and back navigation.
  const showTabBar =
    screen.name === 'home' ||
    screen.name === 'categories' ||
    screen.name === 'games' ||
    screen.name === 'review' ||
    screen.name === 'stats'

  const activeTab: Tab = screen.name === 'stats'
    ? 'stats'
    : screen.name === 'review'
      ? 'review'
      : screen.name === 'games'
        ? 'games'
        : screen.name === 'home'
          ? 'home'
          : 'learn'

  function goToTab(tab: Tab) {
    if (tab === 'learn') setScreen({ name: 'categories' })
    else if (tab === 'games') setScreen({ name: 'games' })
    else if (tab === 'review') setScreen({ name: 'review' })
    else if (tab === 'stats') setScreen({ name: 'stats' })
    else setScreen({ name: 'home' })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className={`mx-auto w-full max-w-[480px] ${showTabBar ? 'pb-20' : ''}`}>
        {screen.name === 'home' && (
          <Home
            hardWordCount={hardWordCount}
            streakInterrupted={streakInterrupted}
            onStart={() => setScreen({ name: 'categories' })}
            onReview={() => setScreen({ name: 'review' })}
          />
        )}

        {screen.name === 'categories' && (
          <Categories
            onSelectCategory={(categoryId, mode) =>
              setScreen(
                mode === 'quiz'
                  ? { name: 'quiz', categoryId }
                  : { name: 'flashcards', categoryId },
              )
            }
            onBack={() => setScreen({ name: 'home' })}
          />
        )}

        {screen.name === 'stats' && <Stats />}
        {screen.name === 'review' && <Review />}
        {screen.name === 'games' && (
          <Games
            key={screen.game ?? 'menu'}
            initialGame={screen.game}
            onStart={(game, categoryId) => {
              if (!categoryId) {
                setScreen({ name: 'games', game })
              } else if (game === 'hangman') {
                setScreen({ name: 'hangman', categoryId })
              } else {
                setScreen({ name: 'word-builder', categoryId })
              }
            }}
            onGamesMenu={() => setScreen({ name: 'games' })}
          />
        )}

        {screen.name === 'flashcards' && (
          <Flashcards
            categoryId={screen.categoryId}
            onBack={() => setScreen({ name: 'categories' })}
          />
        )}

        {screen.name === 'quiz' && (
          <Quiz
            categoryId={screen.categoryId}
            onExitToCategories={() => setScreen({ name: 'categories' })}
            onExitToHome={() => setScreen({ name: 'home' })}
          />
        )}

        {screen.name === 'hangman' && (
          <Hangman
            categoryId={screen.categoryId}
            onOtherCategory={() => setScreen({ name: 'games', game: 'hangman' })}
            onGamesMenu={() => setScreen({ name: 'games' })}
          />
        )}

        {screen.name === 'word-builder' && (
          <WordBuilder
            categoryId={screen.categoryId}
            onOtherCategory={() =>
              setScreen({ name: 'games', game: 'word-builder' })
            }
            onGamesMenu={() => setScreen({ name: 'games' })}
          />
        )}
      </main>

      {showTabBar && (
        <TabBar
          active={activeTab}
          hasReviewWords={hardWordCount > 0}
          onNavigate={goToTab}
        />
      )}
    </div>
  )
}

interface TabBarProps {
  active: Tab
  hasReviewWords: boolean
  onNavigate: (tab: Tab) => void
}

const TABS: { id: Tab; emoji: string; label: string }[] = [
  { id: 'home', emoji: '🏠', label: 'Главная' },
  { id: 'learn', emoji: '📚', label: 'Учить' },
  { id: 'games', emoji: '🎮', label: 'Игры' },
  { id: 'review', emoji: '🔄', label: 'Повторение' },
  { id: 'stats', emoji: '📊', label: 'Статистика' },
]

function TabBar({ active, hasReviewWords, onNavigate }: TabBarProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[480px] border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex">
        {TABS.map((tab) => {
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onNavigate(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium leading-tight transition-colors ${
                isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="relative text-xl leading-none">
                {tab.emoji}
                {tab.id === 'review' && hasReviewWords && (
                  <span
                    className="absolute -right-1 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500"
                    aria-label="Есть слова для повторения"
                  />
                )}
              </span>
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

interface HomeProps {
  hardWordCount: number
  streakInterrupted: boolean
  onStart: () => void
  onReview: () => void
}

function Home({
  hardWordCount,
  streakInterrupted,
  onStart,
  onReview,
}: HomeProps) {
  const banners = [
    ...(hardWordCount > 3
      ? [
          {
            id: 'review',
            text: `У тебя ${hardWordCount} слов для повторения 📖`,
            action: onReview,
          },
        ]
      : []),
    ...(streakInterrupted
      ? [
          {
            id: 'streak',
            text: 'Не теряй серию! Займись английским сегодня 🔥',
          },
        ]
      : []),
  ]
  const [bannerIndex, setBannerIndex] = useState(0)

  useEffect(() => {
    if (banners.length < 2) return

    const timer = setInterval(() => {
      setBannerIndex((current) => (current + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners.length])

  const banner = banners[bannerIndex % banners.length]

  return (
    <div className="flex min-h-screen flex-col px-6 py-8 text-center">
      {banner && (
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-left shadow-sm">
          <p className="font-semibold text-indigo-950">{banner.text}</p>
          {'action' in banner && banner.action && (
            <button
              type="button"
              onClick={banner.action}
              className="mt-3 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Повторить сейчас
            </button>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col items-center justify-center">
        <span className="mb-4 text-5xl">📚</span>
        <h1 className="text-4xl font-bold tracking-tight">English App</h1>
        <p className="mt-3 text-base text-slate-500">
          Учи английский легко: короткие уроки, слова и практика каждый день.
        </p>
        <button
          type="button"
          onClick={onStart}
          className="mt-8 w-full rounded-xl bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 active:bg-indigo-800"
        >
          Начать
        </button>
      </div>
    </div>
  )
}

export default App

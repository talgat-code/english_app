import { useState } from 'react'
import Categories from './pages/Categories'
import Flashcards from './pages/Flashcards'
import Quiz from './pages/Quiz'
import Stats from './pages/Stats'

type Screen =
  | { name: 'home' }
  | { name: 'categories' }
  | { name: 'stats' }
  | { name: 'flashcards'; categoryId: string }
  | { name: 'quiz'; categoryId: string }

type Tab = 'learn' | 'stats' | 'home'

function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })

  // The tab bar is shown on the top-level destinations. It's hidden during the
  // focused study flows (flashcards / quiz), which have their own bottom
  // controls and back navigation.
  const showTabBar =
    screen.name === 'home' ||
    screen.name === 'categories' ||
    screen.name === 'stats'

  const activeTab: Tab =
    screen.name === 'stats'
      ? 'stats'
      : screen.name === 'home'
        ? 'home'
        : 'learn'

  function goToTab(tab: Tab) {
    if (tab === 'learn') setScreen({ name: 'categories' })
    else if (tab === 'stats') setScreen({ name: 'stats' })
    else setScreen({ name: 'home' })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className={`mx-auto w-full max-w-[480px] ${showTabBar ? 'pb-20' : ''}`}>
        {screen.name === 'home' && (
          <Home onStart={() => setScreen({ name: 'categories' })} />
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
      </main>

      {showTabBar && <TabBar active={activeTab} onNavigate={goToTab} />}
    </div>
  )
}

interface TabBarProps {
  active: Tab
  onNavigate: (tab: Tab) => void
}

const TABS: { id: Tab; emoji: string; label: string }[] = [
  { id: 'learn', emoji: '📚', label: 'Учить' },
  { id: 'stats', emoji: '📊', label: 'Статистика' },
  { id: 'home', emoji: '🏠', label: 'Главная' },
]

function TabBar({ active, onNavigate }: TabBarProps) {
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
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors ${
                isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="text-xl leading-none">{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

interface HomeProps {
  onStart: () => void
}

function Home({ onStart }: HomeProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
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
  )
}

export default App

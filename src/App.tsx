import { useState } from 'react'
import Categories from './pages/Categories'
import Flashcards from './pages/Flashcards'

type Screen =
  | { name: 'home' }
  | { name: 'categories' }
  | { name: 'flashcards'; categoryId: string }

function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto w-full max-w-[480px]">
        {screen.name === 'home' && (
          <Home onStart={() => setScreen({ name: 'categories' })} />
        )}

        {screen.name === 'categories' && (
          <Categories
            onSelectCategory={(categoryId) =>
              setScreen({ name: 'flashcards', categoryId })
            }
            onBack={() => setScreen({ name: 'home' })}
          />
        )}

        {screen.name === 'flashcards' && (
          <Flashcards
            categoryId={screen.categoryId}
            onBack={() => setScreen({ name: 'categories' })}
          />
        )}
      </main>
    </div>
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

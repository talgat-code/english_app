import { useState } from 'react'
import { getLevelInfo } from './data/lessons'
import {
  isStreakInterrupted,
  reviewWords,
  useProgress,
} from './hooks/useProgress'
import AIHome from './pages/AIHome'
import AITutor from './pages/AITutor'
import AIWords from './pages/AIWords'
import Categories from './pages/Categories'
import Flashcards from './pages/Flashcards'
import Games from './pages/Games'
import Hangman from './pages/Hangman'
import Home from './pages/Home'
import IrregularVerbs from './pages/IrregularVerbs'
import Lesson from './pages/Lesson'
import LessonList from './pages/LessonList'
import Levels from './pages/Levels'
import MyWords from './pages/MyWords'
import Quiz from './pages/Quiz'
import Review from './pages/Review'
import Stats from './pages/Stats'
import WordBuilder from './pages/WordBuilder'
import type { LessonLevel } from './types/lesson'
import type { GameType } from './utils/games'
import { nextAvailableLesson } from './utils/lessonProgress'
import { getMyWords } from './utils/myWords'

type Screen =
  | { name: 'home' }
  | { name: 'levels' }
  | { name: 'lesson-list'; level: LessonLevel }
  | { name: 'lesson'; lessonId: string }
  | { name: 'categories' }
  | { name: 'games'; game?: GameType }
  | { name: 'ai' }
  | { name: 'ai-tutor' }
  | { name: 'ai-words' }
  | { name: 'my-words' }
  | { name: 'my-words-flashcards' }
  | { name: 'my-words-quiz' }
  | { name: 'review' }
  | { name: 'stats' }
  | { name: 'irregular-verbs' }
  | { name: 'flashcards'; categoryId: string }
  | { name: 'quiz'; categoryId: string }
  | { name: 'hangman'; categoryId: string }
  | { name: 'word-builder'; categoryId: string }

type Tab = 'home' | 'lessons' | 'games' | 'ai' | 'stats'

function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })
  const progress = useProgress()
  const hardWordCount = reviewWords(progress).length
  const streakInterrupted = isStreakInterrupted(progress)
  const nextLesson = nextAvailableLesson(progress)
  const currentLevel = nextLesson ? getLevelInfo(nextLesson.level) : undefined

  const showTabBar =
    screen.name === 'home' ||
    screen.name === 'levels' ||
    screen.name === 'games' ||
    screen.name === 'ai' ||
    screen.name === 'stats'

  const activeTab: Tab =
    screen.name === 'stats'
      ? 'stats'
      : screen.name === 'ai'
        ? 'ai'
        : screen.name === 'games'
          ? 'games'
          : screen.name === 'levels'
            ? 'lessons'
            : 'home'

  function goToTab(tab: Tab) {
    if (tab === 'lessons') setScreen({ name: 'levels' })
    else if (tab === 'games') setScreen({ name: 'games' })
    else if (tab === 'ai') setScreen({ name: 'ai' })
    else if (tab === 'stats') setScreen({ name: 'stats' })
    else setScreen({ name: 'home' })
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-slate-900">
      <main className={`mx-auto w-full max-w-[480px] ${showTabBar ? 'pb-20' : ''}`}>
        {screen.name === 'home' && (
          <Home
            hardWordCount={hardWordCount}
            streakInterrupted={streakInterrupted}
            nextLesson={nextLesson}
            currentLevel={currentLevel}
            onContinueLesson={() => {
              if (nextLesson) setScreen({ name: 'lesson', lessonId: nextLesson.id })
            }}
            onLessons={() => setScreen({ name: 'levels' })}
            onVocabulary={() => setScreen({ name: 'categories' })}
            onReview={() => setScreen({ name: 'review' })}
            onAITutor={() => setScreen({ name: 'ai-tutor' })}
            onAIWords={() => setScreen({ name: 'ai-words' })}
            onIrregularVerbs={() => setScreen({ name: 'irregular-verbs' })}
          />
        )}

        {screen.name === 'levels' && (
          <Levels
            onSelectLevel={(level) => setScreen({ name: 'lesson-list', level })}
          />
        )}

        {screen.name === 'lesson-list' && (
          <LessonList
            level={screen.level}
            onBack={() => setScreen({ name: 'levels' })}
            onSelectLesson={(lessonId) => setScreen({ name: 'lesson', lessonId })}
          />
        )}

        {screen.name === 'lesson' && (
          <Lesson
            key={screen.lessonId}
            lessonId={screen.lessonId}
            onBack={(level) =>
              level
                ? setScreen({ name: 'lesson-list', level })
                : setScreen({ name: 'levels' })
            }
            onComplete={(level) => setScreen({ name: 'lesson-list', level })}
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
        {screen.name === 'irregular-verbs' && (
          <IrregularVerbs onBack={() => setScreen({ name: 'home' })} />
        )}
        {screen.name === 'ai' && (
          <AIHome
            onTutor={() => setScreen({ name: 'ai-tutor' })}
            onWords={() => setScreen({ name: 'ai-words' })}
            onMyWords={() => setScreen({ name: 'my-words' })}
          />
        )}
        {screen.name === 'ai-tutor' && (
          <AITutor onBack={() => setScreen({ name: 'ai' })} />
        )}
        {screen.name === 'ai-words' && (
          <AIWords
            onBack={() => setScreen({ name: 'ai' })}
            onMyWords={() => setScreen({ name: 'my-words' })}
          />
        )}
        {screen.name === 'my-words' && (
          <MyWords
            onBack={() => setScreen({ name: 'ai' })}
            onFlashcards={() => setScreen({ name: 'my-words-flashcards' })}
            onQuiz={() => setScreen({ name: 'my-words-quiz' })}
            onGenerate={() => setScreen({ name: 'ai-words' })}
          />
        )}
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

        {screen.name === 'my-words-flashcards' && (
          <Flashcards
            customWords={getMyWords()}
            categoryTitle="Мои слова"
            categoryEmoji="💾"
            onBack={() => setScreen({ name: 'my-words' })}
          />
        )}

        {screen.name === 'my-words-quiz' && (
          <Quiz
            customWords={getMyWords()}
            categoryEmoji="💾"
            onExitToCategories={() => setScreen({ name: 'my-words' })}
            onExitToHome={() => setScreen({ name: 'ai' })}
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

const TABS: { id: Tab; label: string }[] = [
  { id: 'home', label: 'Главная' },
  { id: 'lessons', label: 'Уроки' },
  { id: 'games', label: 'Игры' },
  { id: 'ai', label: 'AI' },
  { id: 'stats', label: 'Статистика' },
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
              className={`relative flex min-h-14 min-w-0 flex-1 items-center justify-center px-1 text-[11px] font-semibold leading-tight transition-colors ${
                isActive ? 'text-slate-950' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 h-0.5 w-7 rounded-full bg-slate-950" />
              )}
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default App

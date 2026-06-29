import { useState } from 'react'
import AchievementToast from './components/AchievementToast'
import { achievements, getAchievementById } from './data/achievements'
import { getIdiomOfDay } from './data/idioms'
import { getLevelInfo } from './data/lessons'
import {
  isStreakInterrupted,
  reviewWords,
  useProgress,
} from './hooks/useProgress'
import { useNotificationSettings } from './hooks/useNotifications'
import { useReminderCheck } from './hooks/useReminderCheck'
import { useTheme } from './hooks/useTheme'
import AIHome from './pages/AIHome'
import AITutor from './pages/AITutor'
import AIWords from './pages/AIWords'
import Achievements from './pages/Achievements'
import Categories from './pages/Categories'
import Flashcards from './pages/Flashcards'
import Games from './pages/Games'
import Hangman from './pages/Hangman'
import Home from './pages/Home'
import IdiomQuiz from './pages/IdiomQuiz'
import Idioms from './pages/Idioms'
import IrregularVerbs from './pages/IrregularVerbs'
import Lesson from './pages/Lesson'
import LessonList from './pages/LessonList'
import Levels from './pages/Levels'
import MyWords from './pages/MyWords'
import Onboarding from './pages/Onboarding'
import PhrasalVerbQuiz from './pages/PhrasalVerbQuiz'
import PhrasalVerbs from './pages/PhrasalVerbs'
import Quiz from './pages/Quiz'
import Review from './pages/Review'
import Search from './pages/Search'
import Settings from './pages/Settings'
import Stats from './pages/Stats'
import WordBuilder from './pages/WordBuilder'
import type { IdiomFilter, LessonLevel, PhrasalVerbFilter } from './types'
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
  | { name: 'achievements'; from: 'home' | 'stats' }
  | { name: 'settings' }
  | { name: 'search'; from?: 'categories' | 'idioms' | 'phrasal-verbs' }
  | { name: 'irregular-verbs' }
  | { name: 'idioms'; category?: IdiomFilter; idiomId?: string }
  | { name: 'idiom-quiz'; category?: IdiomFilter }
  | {
      name: 'phrasal-verbs'
      category?: PhrasalVerbFilter
      phrasalVerbId?: string
    }
  | { name: 'phrasal-verb-quiz'; category?: PhrasalVerbFilter }
  | { name: 'flashcards'; categoryId: string; wordId?: string }
  | { name: 'quiz'; categoryId: string }
  | { name: 'hangman'; categoryId: string }
  | { name: 'word-builder'; categoryId: string }

type Tab = 'home' | 'lessons' | 'games' | 'ai' | 'stats'

function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })
  const progress = useProgress()
  const notificationSettings = useNotificationSettings()
  const { theme, toggleTheme } = useTheme()
  const hardWordCount = reviewWords(progress).length
  const streakInterrupted = isStreakInterrupted(progress)
  const nextLesson = nextAvailableLesson(progress)
  const currentLevel = nextLesson ? getLevelInfo(nextLesson.level) : undefined
  const idiomOfDay = getIdiomOfDay()
  const unlockedAchievements = progress.unlockedAchievements.length
  const lastUnlockedAchievementId =
    progress.unlockedAchievements[progress.unlockedAchievements.length - 1]?.id
  const lastUnlockedAchievement = lastUnlockedAchievementId
    ? getAchievementById(lastUnlockedAchievementId)
    : undefined

  useReminderCheck(progress.stats.lastActiveDate)

  const appReady = notificationSettings.onboardingCompleted

  const showTabBar =
    appReady &&
    (screen.name === 'home' ||
      screen.name === 'levels' ||
      screen.name === 'games' ||
      screen.name === 'ai' ||
      screen.name === 'stats')

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

  function backFromSearch(from: Screen & { name: 'search' }) {
    if (from.from === 'idioms') setScreen({ name: 'idioms' })
    else if (from.from === 'phrasal-verbs') setScreen({ name: 'phrasal-verbs' })
    else if (from.from === 'categories') setScreen({ name: 'categories' })
    else setScreen({ name: 'home' })
  }

  const screenKey = Object.values(screen).join(':')

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <main className={`mx-auto w-full max-w-[480px] ${showTabBar ? 'pb-tab-safe' : 'pb-safe'}`}>
        <div key={screenKey} className="page-transition">
        {!appReady && <Onboarding onDone={() => setScreen({ name: 'home' })} />}

        {appReady && screen.name === 'home' && (
          <Home
            hardWordCount={hardWordCount}
            streakInterrupted={streakInterrupted}
            nextLesson={nextLesson}
            currentLevel={currentLevel}
            idiomOfDay={idiomOfDay}
            onContinueLesson={() => {
              if (nextLesson) setScreen({ name: 'lesson', lessonId: nextLesson.id })
            }}
            onLessons={() => setScreen({ name: 'levels' })}
            onVocabulary={() => setScreen({ name: 'categories' })}
            onIdioms={() => setScreen({ name: 'idioms' })}
            onPhrasalVerbs={() => setScreen({ name: 'phrasal-verbs' })}
            onOpenIdiomOfDay={() =>
              setScreen({
                name: 'idioms',
                category: idiomOfDay.category,
                idiomId: idiomOfDay.id,
              })
            }
            onReview={() => setScreen({ name: 'review' })}
            onAITutor={() => setScreen({ name: 'ai-tutor' })}
            onAIWords={() => setScreen({ name: 'ai-words' })}
            onIrregularVerbs={() => setScreen({ name: 'irregular-verbs' })}
            onAchievements={() => setScreen({ name: 'achievements', from: 'home' })}
            achievementTotal={achievements.length}
            achievementUnlocked={unlockedAchievements}
            lastAchievement={lastUnlockedAchievement}
          />
        )}

        {appReady && screen.name === 'levels' && (
          <Levels onSelectLevel={(level) => setScreen({ name: 'lesson-list', level })} />
        )}

        {appReady && screen.name === 'lesson-list' && (
          <LessonList
            level={screen.level}
            onBack={() => setScreen({ name: 'levels' })}
            onSelectLesson={(lessonId) => setScreen({ name: 'lesson', lessonId })}
          />
        )}

        {appReady && screen.name === 'lesson' && (
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

        {appReady && screen.name === 'categories' && (
          <Categories
            onSelectCategory={(categoryId, mode) =>
              setScreen(
                mode === 'quiz'
                  ? { name: 'quiz', categoryId }
                  : { name: 'flashcards', categoryId },
              )
            }
            onBack={() => setScreen({ name: 'home' })}
            onSearch={() => setScreen({ name: 'search', from: 'categories' })}
            onIdioms={() => setScreen({ name: 'idioms' })}
            onPhrasalVerbs={() => setScreen({ name: 'phrasal-verbs' })}
          />
        )}

        {appReady && screen.name === 'stats' && (
          <Stats
            onSettings={() => setScreen({ name: 'settings' })}
            onAchievements={() => setScreen({ name: 'achievements', from: 'stats' })}
          />
        )}

        {appReady && screen.name === 'achievements' && (
          <Achievements
            onBack={() =>
              setScreen(
                screen.from === 'stats' ? { name: 'stats' } : { name: 'home' },
              )
            }
          />
        )}

        {appReady && screen.name === 'settings' && (
          <Settings
            theme={theme}
            onToggleTheme={toggleTheme}
            onBack={() => setScreen({ name: 'stats' })}
          />
        )}

        {appReady && screen.name === 'review' && <Review />}

        {appReady && screen.name === 'irregular-verbs' && (
          <IrregularVerbs onBack={() => setScreen({ name: 'home' })} />
        )}

        {appReady && screen.name === 'idioms' && (
          <Idioms
            key={`${screen.category ?? 'all'}:${screen.idiomId ?? 'list'}`}
            initialCategory={screen.category}
            initialExpandedIdiomId={screen.idiomId}
            onBack={() => setScreen({ name: 'home' })}
            onSearch={() => setScreen({ name: 'search', from: 'idioms' })}
            onWords={() => setScreen({ name: 'categories' })}
            onPhrasalVerbs={() => setScreen({ name: 'phrasal-verbs' })}
            onStartQuiz={(category) => setScreen({ name: 'idiom-quiz', category })}
          />
        )}

        {appReady && screen.name === 'idiom-quiz' && (
          <IdiomQuiz
            category={screen.category}
            onBack={() => setScreen({ name: 'idioms', category: screen.category })}
            onHome={() => setScreen({ name: 'home' })}
          />
        )}

        {appReady && screen.name === 'phrasal-verbs' && (
          <PhrasalVerbs
            key={`${screen.category ?? 'all'}:${screen.phrasalVerbId ?? 'list'}`}
            initialCategory={screen.category}
            initialExpandedPhrasalVerbId={screen.phrasalVerbId}
            onBack={() => setScreen({ name: 'home' })}
            onSearch={() => setScreen({ name: 'search', from: 'phrasal-verbs' })}
            onWords={() => setScreen({ name: 'categories' })}
            onIdioms={() => setScreen({ name: 'idioms' })}
            onStartQuiz={(category) =>
              setScreen({ name: 'phrasal-verb-quiz', category })
            }
          />
        )}

        {appReady && screen.name === 'search' && (
          <Search
            onBack={() => backFromSearch(screen)}
            onSelectWord={(categoryId, wordId) =>
              setScreen({ name: 'flashcards', categoryId, wordId })
            }
            onSelectIdiom={(category, idiomId) =>
              setScreen({ name: 'idioms', category, idiomId })
            }
            onSelectPhrasalVerb={(category, phrasalVerbId) =>
              setScreen({ name: 'phrasal-verbs', category, phrasalVerbId })
            }
          />
        )}

        {appReady && screen.name === 'phrasal-verb-quiz' && (
          <PhrasalVerbQuiz
            category={screen.category}
            onBack={() =>
              setScreen({ name: 'phrasal-verbs', category: screen.category })
            }
            onHome={() => setScreen({ name: 'home' })}
          />
        )}

        {appReady && screen.name === 'ai' && (
          <AIHome
            onTutor={() => setScreen({ name: 'ai-tutor' })}
            onWords={() => setScreen({ name: 'ai-words' })}
            onMyWords={() => setScreen({ name: 'my-words' })}
          />
        )}

        {appReady && screen.name === 'ai-tutor' && (
          <AITutor onBack={() => setScreen({ name: 'ai' })} />
        )}

        {appReady && screen.name === 'ai-words' && (
          <AIWords
            onBack={() => setScreen({ name: 'ai' })}
            onMyWords={() => setScreen({ name: 'my-words' })}
          />
        )}

        {appReady && screen.name === 'my-words' && (
          <MyWords
            onBack={() => setScreen({ name: 'ai' })}
            onFlashcards={() => setScreen({ name: 'my-words-flashcards' })}
            onQuiz={() => setScreen({ name: 'my-words-quiz' })}
            onGenerate={() => setScreen({ name: 'ai-words' })}
          />
        )}

        {appReady && screen.name === 'games' && (
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

        {appReady && screen.name === 'flashcards' && (
          <Flashcards
            categoryId={screen.categoryId}
            initialWordId={screen.wordId}
            onBack={() => setScreen({ name: 'categories' })}
          />
        )}

        {appReady && screen.name === 'quiz' && (
          <Quiz
            categoryId={screen.categoryId}
            onExitToCategories={() => setScreen({ name: 'categories' })}
            onExitToHome={() => setScreen({ name: 'home' })}
          />
        )}

        {appReady && screen.name === 'hangman' && (
          <Hangman
            categoryId={screen.categoryId}
            onOtherCategory={() => setScreen({ name: 'games', game: 'hangman' })}
            onGamesMenu={() => setScreen({ name: 'games' })}
          />
        )}

        {appReady && screen.name === 'word-builder' && (
          <WordBuilder
            categoryId={screen.categoryId}
            onOtherCategory={() => setScreen({ name: 'games', game: 'word-builder' })}
            onGamesMenu={() => setScreen({ name: 'games' })}
          />
        )}

        {appReady && screen.name === 'my-words-flashcards' && (
          <Flashcards
            customWords={getMyWords()}
            categoryTitle="Мои слова"
            categoryEmoji="💾"
            onBack={() => setScreen({ name: 'my-words' })}
          />
        )}

        {appReady && screen.name === 'my-words-quiz' && (
          <Quiz
            customWords={getMyWords()}
            categoryEmoji="💾"
            onExitToCategories={() => setScreen({ name: 'my-words' })}
            onExitToHome={() => setScreen({ name: 'ai' })}
          />
        )}
        </div>
      </main>

      {showTabBar && <TabBar active={activeTab} onNavigate={goToTab} />}
      <AchievementToast />
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
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[480px] border-t border-border bg-surface/95 backdrop-blur">
      <div className="flex gap-1 p-1 pb-[calc(0.25rem+env(safe-area-inset-bottom))]">
        {TABS.map((tab) => {
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onNavigate(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex min-h-14 min-w-0 flex-1 items-center justify-center rounded-2xl px-1 text-[11px] font-semibold leading-tight transition-colors ${
                isActive
                  ? 'bg-primary-soft text-primary dark:text-text-primary'
                  : 'text-text-tertiary hover:bg-surface-muted hover:text-text-secondary'
              }`}
            >
              {isActive && (
                <span className="absolute top-1.5 h-0.5 w-7 rounded-full bg-primary" />
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

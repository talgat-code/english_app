import { categories } from '../data/words'
import type { GameType } from '../utils/games'

interface GamesProps {
  initialGame?: GameType
  onStart: (game: GameType, categoryId: string) => void
  onGamesMenu: () => void
}

const GAME_CARDS: {
  id: GameType
  title: string
  emoji: string
  description: string
  accent: string
}[] = [
  {
    id: 'hangman',
    title: 'Виселица',
    emoji: '🎯',
    description: 'Угадай английское слово по буквам. У тебя есть 6 ошибок.',
    accent: 'from-primary to-primary',
  },
  {
    id: 'word-builder',
    title: 'Составь слово',
    emoji: '🔤',
    description: 'Собери правильное слово из перемешанных букв.',
    accent: 'from-secondary to-primary',
  },
]

function Games({ initialGame, onStart, onGamesMenu }: GamesProps) {
  const selectedGame = initialGame

  if (selectedGame) {
    const game = GAME_CARDS.find((item) => item.id === selectedGame)!

    return (
      <div className="flex min-h-screen w-full flex-col px-4 py-8">
        <header className="mb-6">
          <button
            type="button"
            onClick={onGamesMenu}
            className="mb-4 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            ← Все игры
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            {game.emoji} {game.title}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Выбери категорию. В игру попадут слова из 4 и более букв.
          </p>
        </header>

        <ul className="grid grid-cols-2 gap-3">
          {categories.map((category) => {
            const count = category.words.filter(
              (word) => word.english.length >= 4 && /^[a-z]+$/i.test(word.english),
            ).length

            return (
              <li key={category.id}>
                <button
                  type="button"
                  onClick={() => onStart(selectedGame, category.id)}
                  disabled={count === 0}
                  className="flex min-h-32 w-full flex-col items-start rounded-2xl border border-border-subtle bg-surface p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-border hover:shadow-md active:scale-[0.98] disabled:opacity-40"
                >
                  <span className="text-3xl">{category.emoji}</span>
                  <span className="mt-3 font-semibold text-text-primary">
                    {category.title}
                  </span>
                  <span className="mt-1 text-xs text-text-tertiary">{count} слов</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col px-4 py-8">
      <header className="mb-6">
        <span className="text-4xl">🎮</span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-text-primary">
          Мини-игры
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Тренируй слова играючи и закрепляй знания.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {GAME_CARDS.map((game) => (
          <article
            key={game.id}
            className="overflow-hidden rounded-3xl border border-border-subtle bg-surface shadow-sm"
          >
            <div className={`bg-gradient-to-br ${game.accent} p-6 text-white`}>
              <span className="text-5xl">{game.emoji}</span>
              <h2 className="mt-4 text-2xl font-bold">{game.title}</h2>
              <p className="mt-2 min-h-10 text-sm text-white/80">{game.description}</p>
            </div>
            <div className="p-4">
              <button
                type="button"
                onClick={() => onStart(game.id, '')}
                className="min-h-12 w-full rounded-2xl bg-primary px-5 py-3 font-semibold text-white transition-all hover:bg-primary-hover active:scale-[0.98]"
              >
                Играть
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Games

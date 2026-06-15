interface AIHomeProps {
  onTutor: () => void
  onWords: () => void
  onMyWords: () => void
}

const AI_TOOLS = [
  {
    id: 'tutor',
    emoji: '💬',
    title: 'AI-репетитор',
    description: 'Спроси о грамматике, словах или английских выражениях.',
    color: 'from-violet-500 to-indigo-600',
  },
  {
    id: 'words',
    emoji: '✨',
    title: 'Новые слова',
    description: 'Создай персональную подборку слов по любой теме.',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'my-words',
    emoji: '💾',
    title: 'Мои слова',
    description: 'Повторяй сохранённые слова карточками или квизом.',
    color: 'from-emerald-500 to-teal-600',
  },
] as const

function AIHome({ onTutor, onWords, onMyWords }: AIHomeProps) {
  function openTool(id: (typeof AI_TOOLS)[number]['id']) {
    if (id === 'tutor') onTutor()
    else if (id === 'words') onWords()
    else onMyWords()
  }

  return (
    <div className="flex min-h-screen w-full flex-col px-5 py-8">
      <header className="mb-6">
        <span className="text-4xl">🤖</span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          AI-помощник
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Репетитор и персональный словарь внутри приложения.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {AI_TOOLS.map((tool) => (
          <button
            key={tool.id}
            type="button"
            onClick={() => openTool(tool.id)}
            className="overflow-hidden rounded-3xl bg-white text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
          >
            <div className={`bg-gradient-to-br ${tool.color} p-5 text-white`}>
              <span className="text-4xl">{tool.emoji}</span>
              <h2 className="mt-3 text-xl font-bold">{tool.title}</h2>
              <p className="mt-1 text-sm text-white/80">{tool.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default AIHome

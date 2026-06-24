export type VocabularyTab = 'words' | 'idioms' | 'phrasal-verbs'

interface VocabularyTabsProps {
  active: VocabularyTab
  onWords: () => void
  onIdioms: () => void
  onPhrasalVerbs: () => void
}

const tabs: { id: VocabularyTab; label: string }[] = [
  { id: 'words', label: 'Слова' },
  { id: 'idioms', label: 'Идиомы' },
  { id: 'phrasal-verbs', label: 'Фразовые глаголы' },
]

function VocabularyTabs({
  active,
  onWords,
  onIdioms,
  onPhrasalVerbs,
}: VocabularyTabsProps) {
  const handlers: Record<VocabularyTab, () => void> = {
    words: onWords,
    idioms: onIdioms,
    'phrasal-verbs': onPhrasalVerbs,
  }

  return (
    <nav className="mb-5 grid grid-cols-3 gap-1 rounded-2xl bg-border/70 p-1">
      {tabs.map((tab) => {
        const isActive = tab.id === active

        return (
          <button
            key={tab.id}
            type="button"
            onClick={handlers[tab.id]}
            aria-current={isActive ? 'page' : undefined}
            className={`min-h-10 rounded-xl px-2 text-xs font-semibold leading-tight transition-colors ${
              isActive
                ? 'bg-surface text-text-primary shadow-sm'
                : 'text-text-secondary hover:bg-surface/70 hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}

export default VocabularyTabs

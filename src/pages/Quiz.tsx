import { useState } from 'react'
import QuizEngine from '../components/QuizEngine'
import { getCategoryById } from '../data/words'
import { recordQuizResult, type QuizAnswer } from '../hooks/useProgress'
import type { Word } from '../types'
import { askOpenAI } from '../utils/openaiApi'
import { buildQuiz, buildQuizForWords, type QuizQuestion } from '../utils/quiz'
import QuizResult from './QuizResult'

interface QuizProps {
  categoryId?: string
  customWords?: Word[]
  categoryEmoji?: string
  onExitToCategories: () => void
  onExitToHome: () => void
}

function Quiz({
  categoryId,
  customWords,
  categoryEmoji,
  onExitToCategories,
  onExitToHome,
}: QuizProps) {
  const category = categoryId ? getCategoryById(categoryId) : undefined
  const emoji = categoryEmoji ?? category?.emoji ?? '💾'

  const [explanation, setExplanation] = useState('')
  const [explanationError, setExplanationError] = useState('')
  const [explanationLoading, setExplanationLoading] = useState(false)

  function createQuestions() {
    return customWords ? buildQuizForWords(customWords) : buildQuiz(categoryId ?? '')
  }

  function resetExplanation() {
    setExplanation('')
    setExplanationError('')
    setExplanationLoading(false)
  }

  async function explainAnswer(
    selected: string,
    correct: string,
    wordEnglish: string,
  ) {
    if (selected === correct || explanationLoading) return

    setExplanationLoading(true)
    setExplanationError('')
    try {
      const text = await askOpenAI({
        maxTokens: 250,
        messages: [
          {
            role: 'user',
            content: `Кратко объясни по-русски разницу между '${selected}' и '${correct}' в контексте перевода слова '${wordEnglish}'. Максимум 2 предложения.`,
          },
        ],
      })
      setExplanation(text)
    } catch (requestError) {
      setExplanationError(
        requestError instanceof Error
          ? requestError.message
          : 'Не удалось получить объяснение.',
      )
    } finally {
      setExplanationLoading(false)
    }
  }

  return (
    <QuizEngine<QuizQuestion, QuizAnswer, Word>
      createQuestions={createQuestions}
      renderEmpty={() => (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <div className="empty-state w-full">
            <span className="text-6xl">🎯</span>
            <h1 className="mt-4 text-xl font-bold text-text-primary">
              Квиз пока недоступен
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Не удалось собрать вопросы для этих слов.
            </p>
          </div>
          <button
            type="button"
            onClick={onExitToCategories}
            className="mt-4 min-h-12 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white"
          >
            ← Назад
          </button>
        </div>
      )}
      renderResult={({ score, total, mistakes, restart }) => (
        <QuizResult
          score={score}
          total={total}
          mistakes={mistakes}
          onRetry={restart}
          onOtherCategory={onExitToCategories}
          onHome={onExitToHome}
        />
      )}
      onComplete={recordQuizResult}
      buildAnswer={({ question, isCorrect }) => ({
        wordId: question.word.id,
        correct: isCorrect,
      })}
      buildMistake={({ question }) => question.word}
      autoAdvanceDelay={({ isCorrect }) => (isCorrect ? 1000 : null)}
      onBeforeAdvance={resetExplanation}
      onRestart={resetExplanation}
      onBack={onExitToCategories}
      backLabel="← Категории"
      questionLabel="Как переводится?"
      getQuestionTitle={(question) => question.word.english}
      getSpeechText={(question) => question.word.english}
      progressEmoji={emoji}
      renderQuestionMeta={(question) => (
        <p className="mt-2 text-base text-text-tertiary">
          [{question.word.transcription}]
        </p>
      )}
      renderFeedback={({ question, selected, isCorrect, isLastQuestion, advance }) => {
        if (isCorrect) return null

        return (
          <div className="mt-2 rounded-2xl border border-secondary-border bg-secondary-soft p-4">
            {!explanation && (
              <button
                type="button"
                onClick={() =>
                  void explainAnswer(
                    selected,
                    question.correct,
                    question.word.english,
                  )
                }
                disabled={explanationLoading}
                className="min-h-11 w-full rounded-xl bg-secondary px-4 text-sm font-semibold text-white disabled:opacity-60 dark:bg-secondary-button-dark"
              >
                {explanationLoading
                  ? 'GPT думает...'
                  : explanationError
                    ? 'Попробовать объяснить снова 🤖'
                    : 'Объясни 🤖'}
              </button>
            )}
            {explanation && (
              <p className="text-sm leading-relaxed text-secondary">{explanation}</p>
            )}
            {explanationError && (
              <p className="text-sm leading-relaxed text-error">{explanationError}</p>
            )}
            <button
              type="button"
              onClick={advance}
              disabled={explanationLoading}
              className="mt-3 min-h-11 w-full rounded-xl border border-secondary-border bg-surface px-4 text-sm font-semibold text-secondary disabled:opacity-40"
            >
              {isLastQuestion ? 'Показать результат' : 'Следующий вопрос'}
            </button>
          </div>
        )
      }}
    />
  )
}

export default Quiz

import QuizEngine from '../components/QuizEngine'
import { type Idiom, type IdiomFilter } from '../data/idioms'
import {
  recordIdiomQuizResult,
  type IdiomQuizAnswer,
} from '../hooks/useProgress'
import { buildIdiomQuiz, type IdiomQuizQuestion } from '../utils/idiomQuiz'

interface IdiomQuizProps {
  category?: IdiomFilter
  onBack: () => void
  onHome: () => void
}

interface IdiomMistake {
  idiom: Idiom
  selectedMeaning: string
}

function getResultMessage(percent: number): { title: string; tone: string } {
  if (percent >= 90) return { title: 'Отличный результат', tone: 'text-success' }
  if (percent >= 70) return { title: 'Очень хорошо', tone: 'text-primary' }
  if (percent >= 50) return { title: 'Неплохо, но можно лучше', tone: 'text-warning' }
  return { title: 'Стоит повторить ещё раз', tone: 'text-error' }
}

function IdiomQuiz({ category = 'all', onBack, onHome }: IdiomQuizProps) {
  return (
    <QuizEngine<IdiomQuizQuestion, IdiomQuizAnswer, IdiomMistake>
      createQuestions={() => buildIdiomQuiz(category)}
      renderEmpty={() => (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <div className="empty-state w-full">
            <span className="text-6xl">💬</span>
            <h1 className="mt-4 text-xl font-bold text-text-primary">
              Квиз пока недоступен
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Не удалось собрать вопросы по идиомам.
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="mt-4 min-h-12 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white"
          >
            ← Назад
          </button>
        </div>
      )}
      renderResult={({ score, total, mistakes, restart }) => {
        const percent = total > 0 ? Math.round((score / total) * 100) : 0
        const { title, tone } = getResultMessage(percent)

        return (
          <div className="flex min-h-screen w-full flex-col px-4 py-8">
            <div className="rounded-3xl border border-border-subtle bg-surface p-8 text-center shadow-xl">
              <p className={`text-2xl font-bold ${tone}`}>{title}</p>
              <div className="mx-auto mt-6 flex h-32 w-32 flex-col items-center justify-center rounded-full bg-primary-soft">
                <span className="text-4xl font-bold tracking-tight text-primary">
                  {score}/{total}
                </span>
                <span className="mt-1 text-sm font-medium text-primary">{percent}%</span>
              </div>
              <p className="mt-5 text-sm text-text-secondary">
                Правильных ответов: {score} из {total}
              </p>
            </div>

            {mistakes.length > 0 && (
              <section className="mt-6">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-tertiary">
                  Разбор ошибок
                </h2>
                <ul className="flex flex-col gap-3">
                  {mistakes.map(({ idiom, selectedMeaning }) => (
                    <li
                      key={idiom.id}
                      className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-text-primary">
                            {idiom.phrase}
                          </h3>
                          <p className="mt-1 text-sm italic text-text-tertiary">
                            "{idiom.literal}"
                          </p>
                        </div>
                        <span className="rounded-full bg-error-soft px-2.5 py-1 text-xs font-semibold text-error">
                          Ошибка
                        </span>
                      </div>
                      <div className="mt-4 rounded-2xl bg-surface-muted p-4 text-sm leading-relaxed">
                        <p className="text-text-secondary">Ты выбрал: {selectedMeaning}</p>
                        <p className="mt-2 font-medium text-success">
                          Правильный смысл: {idiom.meaning}
                        </p>
                        <p className="mt-3 text-text-secondary">{idiom.example}</p>
                        <p className="mt-1 text-text-secondary">
                          {idiom.exampleTranslation}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={restart}
                className="min-h-12 rounded-2xl bg-primary px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Пройти ещё раз
              </button>
              <button
                type="button"
                onClick={onBack}
                className="min-h-12 rounded-2xl border border-border bg-surface px-6 py-3 text-base font-semibold text-text-secondary transition-colors hover:bg-surface-muted"
              >
                К списку идиом
              </button>
              <button
                type="button"
                onClick={onHome}
                className="min-h-12 px-6 py-3 text-base font-medium text-text-tertiary transition-colors hover:text-text-secondary"
              >
                На главную
              </button>
            </div>
          </div>
        )
      }}
      onComplete={recordIdiomQuizResult}
      buildAnswer={({ question, isCorrect }) => ({
        idiomId: question.idiom.id,
        correct: isCorrect,
      })}
      buildMistake={({ question, option }) => ({
        idiom: question.idiom,
        selectedMeaning: option,
      })}
      autoAdvanceDelay={1100}
      onBack={onBack}
      backLabel="← К идиомам"
      questionLabel="Что это значит?"
      getQuestionTitle={(question) => question.idiom.phrase}
      getSpeechText={(question) => question.idiom.phrase}
      renderQuestionMeta={(question) => (
        <p className="mt-3 text-sm italic text-text-tertiary">
          Буквально: "{question.idiom.literal}"
        </p>
      )}
    />
  )
}

export default IdiomQuiz

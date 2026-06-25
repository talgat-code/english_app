import { useMemo, useState } from 'react'
import { getLessonById } from '../data/lessons'
import { completeLesson, useProgress } from '../hooks/useProgress'
import { useSpeech } from '../hooks/useSpeech'
import type { Exercise, LessonLevel } from '../types/lesson'
import { isLessonUnlocked } from '../utils/lessonProgress'

type LessonStage = 'theory' | 'vocabulary' | 'exercises' | 'result'

interface LessonMistake {
  question: string
  userAnswer: string
  correctAnswer: string
}

interface LessonProps {
  lessonId: string
  onBack: (level?: LessonLevel) => void
  onComplete: (level: LessonLevel) => void
}

function normalizeAnswer(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[.!?,]/g, '')
    .replace(/\s+/g, ' ')
}

function correctAnswerFor(exercise: Exercise): string {
  if (exercise.type === 'fill_blank') return exercise.answer
  if (exercise.type === 'translate') return exercise.correctAnswer
  return exercise.options[exercise.correctIndex]
}

function promptFor(exercise: Exercise): string {
  if (exercise.type === 'fill_blank') return exercise.sentence
  if (exercise.type === 'translate') return exercise.russian
  return exercise.question
}

function Lesson({ lessonId, onBack, onComplete }: LessonProps) {
  const lesson = useMemo(() => getLessonById(lessonId), [lessonId])
  const progress = useProgress()
  const { speak, isSupported } = useSpeech()

  const firstWordId = lesson?.vocabulary[0]?.id
  const [stage, setStage] = useState<LessonStage>('theory')
  const [cardIndex, setCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [seenWordIds, setSeenWordIds] = useState<Set<string>>(
    () => new Set(firstWordId ? [firstWordId] : []),
  )
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [textAnswer, setTextAnswer] = useState('')
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [exerciseResult, setExerciseResult] = useState<boolean | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [mistakes, setMistakes] = useState<LessonMistake[]>([])

  if (!lesson) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <p className="text-text-secondary">Урок не найден.</p>
        <button
          type="button"
          onClick={() => onBack()}
          className="mt-4 min-h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-white"
        >
          ← Назад
        </button>
      </div>
    )
  }

  const lessonData = lesson
  const unlocked = isLessonUnlocked(progress, lessonData)

  if (!unlocked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="mt-4 text-2xl font-bold text-text-primary">
          Урок пока заблокирован
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Сначала пройди предыдущий урок или уровень.
        </p>
        <button
          type="button"
          onClick={() => onBack(lessonData.level)}
          className="mt-5 min-h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-white"
        >
          ← К списку уроков
        </button>
      </div>
    )
  }

  const totalStages = 4
  const stageNumber =
    stage === 'theory' ? 1 : stage === 'vocabulary' ? 2 : stage === 'exercises' ? 3 : 4
  const stageProgress = (stageNumber / totalStages) * 100
  const currentWord = lessonData.vocabulary[cardIndex]
  const allWordsSeen = seenWordIds.size >= lessonData.vocabulary.length
  const currentExercise = lessonData.exercises[exerciseIndex]
  const exerciseProgress = ((exerciseIndex + 1) / lessonData.exercises.length) * 100
  const scorePercent = lessonData.exercises.length
    ? Math.round((correctCount / lessonData.exercises.length) * 100)
    : 0

  function goToCard(nextIndex: number) {
    if (nextIndex < 0 || nextIndex >= lessonData.vocabulary.length) return
    const nextWord = lessonData.vocabulary[nextIndex]
    setCardIndex(nextIndex)
    setFlipped(false)
    setSeenWordIds((current) => {
      const next = new Set(current)
      next.add(nextWord.id)
      return next
    })
  }

  function recordExercise(correct: boolean, userAnswer: string) {
    setExerciseResult(correct)
    if (correct) {
      setCorrectCount((count) => count + 1)
      return
    }

    setMistakes((current) => [
      ...current,
      {
        question: promptFor(currentExercise),
        userAnswer: userAnswer || 'Нет ответа',
        correctAnswer: correctAnswerFor(currentExercise),
      },
    ])
  }

  function checkTextAnswer() {
    if (exerciseResult !== null) return
    const answers =
      currentExercise.type === 'fill_blank'
        ? [currentExercise.answer]
        : currentExercise.type === 'translate'
          ? [currentExercise.correctAnswer, ...currentExercise.alternativeAnswers]
          : []
    const correct = answers
      .map(normalizeAnswer)
      .includes(normalizeAnswer(textAnswer))
    recordExercise(correct, textAnswer.trim())
  }

  function chooseOption(optionIndex: number) {
    if (exerciseResult !== null || currentExercise.type !== 'choose_correct') {
      return
    }
    setSelectedOption(optionIndex)
    recordExercise(
      optionIndex === currentExercise.correctIndex,
      currentExercise.options[optionIndex],
    )
  }

  function nextExercise() {
    if (exerciseIndex < lessonData.exercises.length - 1) {
      setExerciseIndex((index) => index + 1)
      setTextAnswer('')
      setSelectedOption(null)
      setExerciseResult(null)
    } else {
      setStage('result')
    }
  }

  function retryExercises() {
    setStage('exercises')
    setExerciseIndex(0)
    setTextAnswer('')
    setSelectedOption(null)
    setExerciseResult(null)
    setCorrectCount(0)
    setMistakes([])
  }

  function finishLesson() {
    completeLesson(lessonData.id, scorePercent, lessonData.vocabulary)
    onComplete(lessonData.level)
  }

  function optionClasses(optionIndex: number): string {
    const base =
      'min-h-14 w-full rounded-lg border px-5 py-3 text-left text-base font-medium transition-colors duration-app'

    if (currentExercise.type !== 'choose_correct' || exerciseResult === null) {
      return `${base} border-border bg-surface text-text-secondary hover:border-border-strong hover:bg-surface-muted`
    }

    if (optionIndex === currentExercise.correctIndex) {
      return `${base} border-success bg-success-soft text-success`
    }
    if (optionIndex === selectedOption) {
      return `${base} border-error bg-error-soft text-error`
    }
    return `${base} border-border bg-surface text-text-tertiary opacity-60`
  }

  return (
    <div className="flex min-h-screen w-full flex-col px-4 py-6">
      <header className="mb-5">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onBack(lesson.level)}
            className="text-sm font-medium text-text-secondary hover:text-text-primary"
          >
            ← Уроки {lesson.level}
          </button>
          <span className="text-xs font-semibold text-text-tertiary">
            Этап {stageNumber} из {totalStages}
          </span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-all duration-entrance ease-out"
            style={{ width: `${stageProgress}%` }}
          />
        </div>
      </header>

      {stage === 'theory' && (
        <section className="flex flex-1 flex-col">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
            {lesson.level} · урок {lesson.order}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-text-primary">
            {lesson.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            {lesson.theory.explanation}
          </p>

          <div className="mt-6 rounded-lg border border-border bg-surface p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-text-tertiary">
              Правила
            </h2>
            <ol className="mt-3 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-text-secondary">
              {lesson.theory.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ol>
          </div>

          <div className="mt-4 rounded-lg border border-warning-border bg-warning-soft p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-warning">
              Советы
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-warning">
              {lesson.theory.tips.map((tip) => (
                <li key={tip}>• {tip}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {lesson.examples.map((example) => (
              <div
                key={example.english}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <p className="font-semibold text-text-primary">{example.english}</p>
                <p className="mt-1 text-sm text-text-secondary">{example.russian}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setStage('vocabulary')}
            className="mt-6 min-h-11 w-full rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Понял, дальше →
          </button>
        </section>
      )}

      {stage === 'vocabulary' && currentWord && (
        <section className="flex flex-1 flex-col">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                Новые слова
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-text-primary">
                {cardIndex + 1} из {lesson.vocabulary.length}
              </h1>
            </div>
            <span className="text-sm font-semibold text-text-tertiary">
              {seenWordIds.size}/{lesson.vocabulary.length}
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary transition-all duration-entrance ease-out"
              style={{
                width: `${(seenWordIds.size / lesson.vocabulary.length) * 100}%`,
              }}
            />
          </div>

          <div className="flex flex-1 items-center justify-center py-6">
            <div className="relative w-full [perspective:1200px]">
              {isSupported && (
                <button
                  type="button"
                  onClick={() => speak(currentWord.english)}
                  aria-label={`Произнести ${currentWord.english}`}
                  className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-base shadow-sm transition-colors hover:bg-surface-muted"
                >
                  🔊
                </button>
              )}
              <button
                type="button"
                onClick={() => setFlipped((value) => !value)}
                aria-label="Перевернуть карточку"
                className="relative block h-80 w-full cursor-pointer transition-transform duration-entrance [transform-style:preserve-3d]"
                style={{
                  transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg border border-border bg-surface p-6 text-center shadow-sm [backface-visibility:hidden]">
                  <span className="mb-3 rounded-md bg-surface-muted px-3 py-1 text-xs font-medium text-text-secondary">
                    {lesson.title}
                  </span>
                  <h2 className="text-3xl font-bold tracking-tight text-text-primary">
                    {currentWord.english}
                  </h2>
                  <p className="mt-2 text-lg text-text-tertiary">
                    [{currentWord.transcription}]
                  </p>
                  <p className="mt-6 text-xs text-text-tertiary">
                    Нажми, чтобы перевернуть
                  </p>
                </div>
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-lg border border-primary bg-primary p-6 text-center text-white shadow-sm [backface-visibility:hidden]"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  <h2 className="text-2xl font-bold tracking-tight">
                    {currentWord.russian}
                  </h2>
                  <div className="mt-5 w-full rounded-lg bg-white/10 p-4">
                    <p className="text-sm font-medium text-white">
                      {currentWord.example}
                    </p>
                    <p className="mt-1.5 text-sm text-white/70">
                      {currentWord.exampleRu}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-[44px_1fr_44px] items-center gap-3">
            <button
              type="button"
              onClick={() => goToCard(cardIndex - 1)}
              disabled={cardIndex === 0}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-surface text-lg text-text-secondary disabled:opacity-40"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() =>
                allWordsSeen ? setStage('exercises') : goToCard(cardIndex + 1)
              }
              disabled={!allWordsSeen && cardIndex === lesson.vocabulary.length - 1}
              className="min-h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:bg-border-strong"
            >
              {allWordsSeen ? 'К упражнениям →' : 'Следующее слово'}
            </button>
            <button
              type="button"
              onClick={() => goToCard(cardIndex + 1)}
              disabled={cardIndex === lesson.vocabulary.length - 1}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-surface text-lg text-text-secondary disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </section>
      )}

      {stage === 'exercises' && currentExercise && (
        <section className="flex flex-1 flex-col">
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                Упражнения
              </p>
              <span className="text-sm font-semibold text-text-tertiary">
                {exerciseIndex + 1} из {lesson.exercises.length}
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-primary transition-all duration-entrance ease-out"
                style={{ width: `${exerciseProgress}%` }}
              />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4">
            {currentExercise.type === 'fill_blank' && (
              <>
                <span className="rounded-md bg-surface-muted px-3 py-1 text-xs font-semibold text-text-secondary">
                  Вставь слово
                </span>
                <p className="mt-5 text-2xl font-bold leading-snug text-text-primary">
                  {currentExercise.sentence}
                </p>
                <p className="mt-2 text-sm text-text-secondary">
                  Подсказка: {currentExercise.hint}
                </p>
                <input
                  value={textAnswer}
                  onChange={(event) => setTextAnswer(event.target.value)}
                  disabled={exerciseResult !== null}
                  className={`mt-5 min-h-11 w-full rounded-lg border px-4 text-base outline-none transition-colors ${
                    exerciseResult === null
                      ? 'border-border focus:border-border-strong'
                      : exerciseResult
                        ? 'border-success bg-success-soft text-success'
                        : 'border-error bg-error-soft text-error'
                  }`}
                  placeholder="Ответ"
                />
              </>
            )}

            {currentExercise.type === 'translate' && (
              <>
                <span className="rounded-md bg-surface-muted px-3 py-1 text-xs font-semibold text-text-secondary">
                  Переведи
                </span>
                <p className="mt-5 text-xl font-bold leading-snug text-text-primary">
                  {currentExercise.russian}
                </p>
                <textarea
                  value={textAnswer}
                  onChange={(event) => setTextAnswer(event.target.value)}
                  disabled={exerciseResult !== null}
                  className={`mt-5 min-h-28 w-full resize-none rounded-lg border p-4 text-base outline-none transition-colors ${
                    exerciseResult === null
                      ? 'border-border focus:border-border-strong'
                      : exerciseResult
                        ? 'border-success bg-success-soft text-success'
                        : 'border-error bg-error-soft text-error'
                  }`}
                  placeholder="Напиши по-английски"
                />
              </>
            )}

            {currentExercise.type === 'choose_correct' && (
              <>
                <span className="rounded-md bg-surface-muted px-3 py-1 text-xs font-semibold text-text-secondary">
                  Выбери вариант
                </span>
                <p className="mt-5 text-xl font-bold leading-snug text-text-primary">
                  {currentExercise.question}
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  {currentExercise.options.map((option, optionIndex) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => chooseOption(optionIndex)}
                      disabled={exerciseResult !== null}
                      className={optionClasses(optionIndex)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </>
            )}

            {currentExercise.type !== 'choose_correct' && (
              <button
                type="button"
                onClick={checkTextAnswer}
                disabled={!textAnswer.trim() || exerciseResult !== null}
                className="mt-4 min-h-11 w-full rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:bg-border-strong"
              >
                Проверить
              </button>
            )}

            {exerciseResult !== null && (
              <div
                className={`mt-4 rounded-lg border p-4 ${
                  exerciseResult
                    ? 'border-success-border bg-success-soft text-success'
                    : 'border-error-border bg-error-soft text-error'
                }`}
              >
                <p className="font-semibold">
                  {exerciseResult ? 'Правильно!' : 'Почти. Правильный ответ:'}
                </p>
                {!exerciseResult && (
                  <p className="mt-1 text-sm">{correctAnswerFor(currentExercise)}</p>
                )}
                <button
                  type="button"
                  onClick={nextExercise}
                  className="mt-4 min-h-10 w-full rounded-md bg-surface px-4 text-sm font-semibold text-text-primary"
                >
                  {exerciseIndex === lesson.exercises.length - 1
                    ? 'К результатам →'
                    : 'Следующее упражнение'}
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {stage === 'result' && (
        <section className="flex flex-1 flex-col items-center justify-center text-center">
          {correctCount === lesson.exercises.length && (
            <span className="animate-bounce text-3xl">🎉</span>
          )}
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary">
            Результат урока
          </h1>
          <p className="mt-3 text-lg font-semibold text-text-primary">
            Правильных {correctCount} из {lesson.exercises.length}
          </p>
          <p className="mt-1 text-sm text-text-secondary">Лучший результат сохранится: {scorePercent}%</p>

          {mistakes.length > 0 && (
            <div className="mt-6 w-full text-left">
              <h2 className="text-sm font-bold uppercase tracking-wide text-text-tertiary">
                Ошибки
              </h2>
              <ul className="mt-3 flex flex-col gap-3">
                {mistakes.map((mistake) => (
                  <li
                    key={`${mistake.question}-${mistake.correctAnswer}`}
                    className="rounded-lg border border-error-border bg-error-soft p-4"
                  >
                    <p className="text-sm font-semibold text-error">
                      {mistake.question}
                    </p>
                    <p className="mt-2 text-xs text-error">
                      Твой ответ: {mistake.userAnswer}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-error">
                      Верно: {mistake.correctAnswer}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 w-full space-y-3">
            {scorePercent < 60 && (
              <button
                type="button"
                onClick={retryExercises}
                className="min-h-11 w-full rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Пройти упражнения снова
              </button>
            )}
            <button
              type="button"
              onClick={finishLesson}
              className="min-h-11 w-full rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              Завершить урок
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

export default Lesson

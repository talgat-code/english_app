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
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-slate-500">Урок не найден.</p>
        <button
          type="button"
          onClick={() => onBack()}
          className="mt-4 min-h-12 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white"
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
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <span className="text-5xl">🔒</span>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Урок пока заблокирован
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Сначала пройди предыдущий урок или уровень.
        </p>
        <button
          type="button"
          onClick={() => onBack(lessonData.level)}
          className="mt-5 min-h-12 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white"
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
      'min-h-14 w-full rounded-2xl border px-5 py-3 text-left text-base font-medium transition-all duration-200'

    if (currentExercise.type !== 'choose_correct' || exerciseResult === null) {
      return `${base} border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50 active:scale-[0.98]`
    }

    if (optionIndex === currentExercise.correctIndex) {
      return `${base} scale-[1.02] border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm`
    }
    if (optionIndex === selectedOption) {
      return `${base} border-rose-400 bg-rose-50 text-rose-700`
    }
    return `${base} border-slate-200 bg-white text-slate-400 opacity-60`
  }

  return (
    <div className="flex min-h-screen w-full flex-col px-5 py-6">
      <header className="mb-5">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onBack(lesson.level)}
            className="text-sm font-medium text-slate-500 hover:text-slate-800"
          >
            ← Уроки {lesson.level}
          </button>
          <span className="text-xs font-semibold text-slate-400">
            Этап {stageNumber} из {totalStages}
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${stageProgress}%` }}
          />
        </div>
      </header>

      {stage === 'theory' && (
        <section className="flex flex-1 flex-col">
          <p className="text-xs font-bold uppercase tracking-wide text-indigo-500">
            {lesson.level} · урок {lesson.order}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {lesson.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            {lesson.theory.explanation}
          </p>

          <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">
              Правила
            </h2>
            <ol className="mt-3 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-slate-700">
              {lesson.theory.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ol>
          </div>

          <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-5">
            <h2 className="text-sm font-bold uppercase tracking-wide text-amber-700">
              Советы
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-amber-900">
              {lesson.theory.tips.map((tip) => (
                <li key={tip}>• {tip}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {lesson.examples.map((example) => (
              <div
                key={example.english}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <p className="font-semibold text-slate-900">{example.english}</p>
                <p className="mt-1 text-sm text-slate-500">{example.russian}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setStage('vocabulary')}
            className="mt-6 min-h-12 w-full rounded-2xl bg-indigo-600 px-5 font-semibold text-white transition-all hover:bg-indigo-700 active:scale-[0.98]"
          >
            Понял, дальше →
          </button>
        </section>
      )}

      {stage === 'vocabulary' && currentWord && (
        <section className="flex flex-1 flex-col">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-indigo-500">
                Новые слова
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                {cardIndex + 1} из {lesson.vocabulary.length}
              </h1>
            </div>
            <span className="text-sm font-semibold text-slate-400">
              {seenWordIds.size}/{lesson.vocabulary.length}
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out"
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
                  className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-xl shadow-sm transition-transform hover:scale-105 active:scale-95"
                >
                  🔊
                </button>
              )}
              <button
                type="button"
                onClick={() => setFlipped((value) => !value)}
                aria-label="Перевернуть карточку"
                className="relative block h-80 w-full cursor-pointer transition-transform duration-500 [transform-style:preserve-3d]"
                style={{
                  transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-xl [backface-visibility:hidden]">
                  <span className="mb-3 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                    {lesson.title}
                  </span>
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                    {currentWord.english}
                  </h2>
                  <p className="mt-2 text-lg text-slate-400">
                    [{currentWord.transcription}]
                  </p>
                  <p className="mt-6 text-xs text-slate-400">
                    Нажми, чтобы перевернуть
                  </p>
                </div>
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-indigo-100 bg-indigo-600 p-6 text-center text-white shadow-xl [backface-visibility:hidden]"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  <h2 className="text-2xl font-bold tracking-tight">
                    {currentWord.russian}
                  </h2>
                  <div className="mt-5 w-full rounded-2xl bg-white/10 p-4">
                    <p className="text-sm font-medium text-indigo-50">
                      {currentWord.example}
                    </p>
                    <p className="mt-1.5 text-sm text-indigo-200">
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
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-600 disabled:opacity-40"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() =>
                allWordsSeen ? setStage('exercises') : goToCard(cardIndex + 1)
              }
              disabled={!allWordsSeen && cardIndex === lesson.vocabulary.length - 1}
              className="min-h-12 rounded-2xl bg-indigo-600 px-5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 disabled:bg-slate-300 active:scale-[0.98]"
            >
              {allWordsSeen ? 'К упражнениям →' : 'Следующее слово'}
            </button>
            <button
              type="button"
              onClick={() => goToCard(cardIndex + 1)}
              disabled={cardIndex === lesson.vocabulary.length - 1}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-600 disabled:opacity-40"
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
              <p className="text-xs font-bold uppercase tracking-wide text-indigo-500">
                Упражнения
              </p>
              <span className="text-sm font-semibold text-slate-400">
                {exerciseIndex + 1} из {lesson.exercises.length}
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-500 ease-out"
                style={{ width: `${exerciseProgress}%` }}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            {currentExercise.type === 'fill_blank' && (
              <>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                  Вставь слово
                </span>
                <p className="mt-5 text-2xl font-bold leading-snug text-slate-900">
                  {currentExercise.sentence}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Подсказка: {currentExercise.hint}
                </p>
                <input
                  value={textAnswer}
                  onChange={(event) => setTextAnswer(event.target.value)}
                  disabled={exerciseResult !== null}
                  className={`mt-5 min-h-12 w-full rounded-2xl border px-4 text-base outline-none transition-colors ${
                    exerciseResult === null
                      ? 'border-slate-200 focus:border-indigo-400'
                      : exerciseResult
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                        : 'border-rose-400 bg-rose-50 text-rose-700'
                  }`}
                  placeholder="Ответ"
                />
              </>
            )}

            {currentExercise.type === 'translate' && (
              <>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                  Переведи
                </span>
                <p className="mt-5 text-xl font-bold leading-snug text-slate-900">
                  {currentExercise.russian}
                </p>
                <textarea
                  value={textAnswer}
                  onChange={(event) => setTextAnswer(event.target.value)}
                  disabled={exerciseResult !== null}
                  className={`mt-5 min-h-28 w-full resize-none rounded-2xl border p-4 text-base outline-none transition-colors ${
                    exerciseResult === null
                      ? 'border-slate-200 focus:border-indigo-400'
                      : exerciseResult
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                        : 'border-rose-400 bg-rose-50 text-rose-700'
                  }`}
                  placeholder="Напиши по-английски"
                />
              </>
            )}

            {currentExercise.type === 'choose_correct' && (
              <>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                  Выбери вариант
                </span>
                <p className="mt-5 text-xl font-bold leading-snug text-slate-900">
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
                className="mt-4 min-h-12 w-full rounded-2xl bg-indigo-600 px-5 font-semibold text-white transition-all hover:bg-indigo-700 disabled:bg-slate-300 active:scale-[0.98]"
              >
                Проверить
              </button>
            )}

            {exerciseResult !== null && (
              <div
                className={`mt-4 rounded-2xl border p-4 ${
                  exerciseResult
                    ? 'border-emerald-100 bg-emerald-50 text-emerald-800'
                    : 'border-rose-100 bg-rose-50 text-rose-800'
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
                  className="mt-4 min-h-11 w-full rounded-xl bg-white px-4 text-sm font-semibold text-slate-800"
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
            <span className="animate-bounce text-6xl">🎉</span>
          )}
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
            Результат урока
          </h1>
          <p className="mt-3 text-lg font-semibold text-indigo-600">
            Правильных {correctCount} из {lesson.exercises.length}
          </p>
          <p className="mt-1 text-sm text-slate-500">Лучший результат сохранится: {scorePercent}%</p>

          {mistakes.length > 0 && (
            <div className="mt-6 w-full text-left">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">
                Ошибки
              </h2>
              <ul className="mt-3 flex flex-col gap-3">
                {mistakes.map((mistake) => (
                  <li
                    key={`${mistake.question}-${mistake.correctAnswer}`}
                    className="rounded-2xl border border-rose-100 bg-rose-50 p-4"
                  >
                    <p className="text-sm font-semibold text-rose-950">
                      {mistake.question}
                    </p>
                    <p className="mt-2 text-xs text-rose-700">
                      Твой ответ: {mistake.userAnswer}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-rose-900">
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
                className="min-h-12 w-full rounded-2xl bg-slate-900 px-5 font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.98]"
              >
                Пройти упражнения снова
              </button>
            )}
            <button
              type="button"
              onClick={finishLesson}
              className="min-h-12 w-full rounded-2xl bg-indigo-600 px-5 font-semibold text-white transition-all hover:bg-indigo-700 active:scale-[0.98]"
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

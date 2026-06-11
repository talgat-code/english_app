function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">English App</h1>
        <p className="mt-3 text-base text-slate-500">
          Учи английский легко: короткие уроки, слова и практика каждый день.
        </p>
        <button
          type="button"
          className="mt-8 w-full rounded-xl bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 active:bg-indigo-800"
        >
          Начать
        </button>
      </main>
    </div>
  )
}

export default App

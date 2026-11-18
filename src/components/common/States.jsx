export function Spinner({ label = 'Loading' }) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 py-24 text-slate-500 dark:text-slate-400">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-brand-500 dark:border-slate-600 dark:border-t-brand-500" />
      <p className="text-sm font-medium">{label}…</p>
    </div>
  )
}

export function EmptyState({ title, message, action }) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-600 dark:text-slate-400">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function ErrorState({ message, onRetry, onReset }) {
  return (
    <div role="alert" className="mx-auto mt-16 max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-500/30 dark:bg-red-500/10">
      <h2 className="text-lg font-bold text-red-800 dark:text-red-300">Something went wrong</h2>
      <p className="mt-1 text-sm text-red-700 dark:text-red-200">{message}</p>
      <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
        <button className="btn-secondary" onClick={onRetry}>Try again</button>
        <button className="btn-danger" onClick={onReset}>Reset demo data</button>
      </div>
    </div>
  )
}

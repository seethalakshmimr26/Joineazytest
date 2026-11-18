export default function ProgressBar({ value, label }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label={label}
      className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
    >
      <div
        className={`h-full rounded-full transition-[width] duration-500 ${pct === 100 ? 'bg-emerald-500' : 'bg-brand-500'}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

const STYLES = {
  submitted: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
  pending: 'bg-slate-100 text-slate-700 dark:bg-slate-700/60 dark:text-slate-200',
  overdue: 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300',
}
const LABELS = { submitted: 'Submitted', pending: 'Not submitted', overdue: 'Overdue' }

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${STYLES[status]}`}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {LABELS[status]}
    </span>
  )
}

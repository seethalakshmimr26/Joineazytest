import { useId, useState } from 'react'
import ProgressBar from '../common/ProgressBar'
import StatusBadge from '../common/StatusBadge'
import { formatDateTime, relativeDue } from '../../utils/date'
import { getAssignedStudentIds, getStats, isOverdue } from '../../utils/assignments'

export default function AdminAssignmentCard({ assignment, users, submissions, onEdit, onDelete }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const stats = getStats(assignment, users, submissions)
  const studentIds = getAssignedStudentIds(assignment, users)
  const rows = studentIds.map((id) => users.find((u) => u.id === id)).filter(Boolean)
  const pastDue = isOverdue(assignment.dueDate, false)
  const allDone = stats.total > 0 && stats.done === stats.total

  return (
    <article className={`card border-l-4 p-4 sm:p-5 ${pastDue && !allDone ? 'border-l-red-500' : allDone ? 'border-l-emerald-500' : 'border-l-slate-300 dark:border-l-slate-600'}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-lg font-bold">{assignment.title}</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{assignment.description}</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={onEdit}>Edit <span className="sr-only">{assignment.title}</span></button>
          <button className="btn-secondary text-red-700 dark:text-red-400" onClick={onDelete}>Delete <span className="sr-only">{assignment.title}</span></button>
        </div>
      </div>

      <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
        <div className="flex gap-1.5">
          <dt className="font-semibold">Due</dt>
          <dd>
            {formatDateTime(assignment.dueDate)}
            {!allDone && (
              <span className={`ml-1.5 font-semibold ${pastDue ? 'text-red-600 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'}`}>
                {relativeDue(assignment.dueDate)}
              </span>
            )}
          </dd>
        </div>
        <div className="flex gap-1.5">
          <dt className="font-semibold">Assigned to</dt>
          <dd>{assignment.assignTo === 'all' ? `All students (${stats.total})` : `${stats.total} selected`}</dd>
        </div>
        <div className="flex min-w-0 gap-1.5">
          <dt className="font-semibold">Drive</dt>
          <dd className="truncate">
            <a href={assignment.driveLink} target="_blank" rel="noopener noreferrer" className="text-brand-700 underline dark:text-brand-100">
              {assignment.driveLink}
            </a>
          </dd>
        </div>
      </dl>

      <div className="mt-4">
        <div className="mb-1.5 flex items-baseline justify-between text-sm">
          <span className="font-semibold">Class completion</span>
          <span>{stats.done} of {stats.total} submitted ({stats.pct}%)</span>
        </div>
        <ProgressBar value={stats.pct} label={`${assignment.title} completion rate`} />
      </div>

      <button
        className="btn-ghost mt-3 -ml-2"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? 'Hide student statuses' : 'Show student statuses'}
      </button>

      {open && (
        <ul id={panelId} className="mt-1 divide-y divide-slate-200 rounded-lg border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
          {rows.map((s) => {
            const at = submissions[assignment.id]?.[s.id]
            return (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 text-sm">
                <div>
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{at ? `Submitted ${formatDateTime(at)}` : s.email}</p>
                </div>
                <StatusBadge status={at ? 'submitted' : isOverdue(assignment.dueDate, at) ? 'overdue' : 'pending'} />
              </li>
            )
          })}
          {rows.length === 0 && <li className="px-3 py-3 text-sm">No students are assigned.</li>}
        </ul>
      )}
    </article>
  )
}

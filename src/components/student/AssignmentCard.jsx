import StatusBadge from '../common/StatusBadge'
import { formatDateTime, relativeDue } from '../../utils/date'

export default function AssignmentCard({ assignment, submittedAt, overdue, onStart }) {
  const status = submittedAt ? 'submitted' : overdue ? 'overdue' : 'pending'

  return (
    <article
      className={`card border-l-4 p-4 sm:p-5 ${
        status === 'overdue' ? 'border-l-red-500' : status === 'submitted' ? 'border-l-emerald-500' : 'border-l-slate-300 dark:border-l-slate-600'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-lg font-bold">{assignment.title}</h3>
        <StatusBadge status={status} />
      </div>
      <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{assignment.description}</p>

      <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
        <div className="flex gap-1.5">
          <dt className="font-semibold">Due</dt>
          <dd>
            {formatDateTime(assignment.dueDate)}
            {!submittedAt && (
              <span className={`ml-1.5 font-semibold ${overdue ? 'text-red-600 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'}`}>
                {relativeDue(assignment.dueDate)}
              </span>
            )}
          </dd>
        </div>
        {submittedAt && (
          <div className="flex gap-1.5">
            <dt className="font-semibold">Submitted</dt>
            <dd>{formatDateTime(submittedAt)}</dd>
          </div>
        )}
      </dl>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <a
          href={assignment.driveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
        >
          Open Drive folder{' '}
          <span className="sr-only">for {assignment.title} (opens in a new tab)</span>
        </a>
        {!submittedAt && (
          <button className="btn-primary" onClick={onStart}>
            Yes, I have submitted{' '}
             <span className="sr-only">{assignment.title}</span>
          </button>
        )}
      </div>
    </article>
  )
}

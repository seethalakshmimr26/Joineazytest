import { useMemo, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { isAssignedTo, isOverdue } from '../../utils/assignments'
import ProgressBar from '../common/ProgressBar'
import Toolbar from '../common/Toolbar'
import { EmptyState } from '../common/States'
import AssignmentCard from './AssignmentCard'
import ConfirmSubmitDialog from './ConfirmSubmitDialog'

const STATUS_OPTIONS = [['all', 'All statuses'], ['pending', 'Not submitted'], ['submitted', 'Submitted'], ['overdue', 'Overdue']]

export default function StudentDashboard() {
  const { data, currentUser, markSubmitted } = useApp()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState('soonest')
  const [confirming, setConfirming] = useState(null) // assignment awaiting final confirmation

  // Students only ever see assignments assigned to them.
  const mine = useMemo(
    () => data.assignments.filter((a) => isAssignedTo(a, currentUser.id)),
    [data.assignments, currentUser.id],
  )
  const submittedAt = (a) => data.submissions[a.id]?.[currentUser.id]
  const doneCount = mine.filter(submittedAt).length
  const pct = mine.length ? Math.round((doneCount / mine.length) * 100) : 0

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return mine
      .filter((a) => !q || a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q))
      .filter((a) => {
        const done = data.submissions[a.id]?.[currentUser.id]
        if (status === 'submitted') return !!done
        if (status === 'pending') return !done
        if (status === 'overdue') return isOverdue(a.dueDate, done)
        return true
      })
      .sort((a, b) => (sort === 'soonest' ? 1 : -1) * (new Date(a.dueDate) - new Date(b.dueDate)))
  }, [mine, query, status, sort, data.submissions, currentUser.id])

  return (
    <main className="mx-auto max-w-5xl space-y-5 px-4 py-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Hi, {currentUser.name.split(' ')[0]}</h1>

      <section className="card p-4 sm:p-5" aria-labelledby="progress-h">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 id="progress-h" className="text-base font-bold">Your progress</h2>
          <p className="text-sm font-semibold" aria-live="polite">{doneCount} of {mine.length} submitted</p>
        </div>
        <ProgressBar value={pct} label={`${doneCount} of ${mine.length} assignments submitted`} />
      </section>

      {mine.length === 0 ? (
        <EmptyState title="No assignments yet" message="Nothing has been assigned to you. New assignments will show up here." />
      ) : (
        <>
          <Toolbar
            query={query} onQuery={setQuery} status={status} onStatus={setStatus}
            statusOptions={STATUS_OPTIONS} sort={sort} onSort={setSort}
          />
          {visible.length === 0 ? (
            <EmptyState
              title="No matches"
              message="No assignments fit the current search or filter."
              action={<button className="btn-secondary" onClick={() => { setQuery(''); setStatus('all') }}>Clear filters</button>}
            />
          ) : (
            <ul className="space-y-3">
              {visible.map((a) => (
                <li key={a.id}>
                  <AssignmentCard
                    assignment={a}
                    submittedAt={submittedAt(a)}
                    overdue={isOverdue(a.dueDate, submittedAt(a))}
                    onStart={() => setConfirming(a)}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {confirming && (
        <ConfirmSubmitDialog
          assignment={confirming}
          onCancel={() => setConfirming(null)}
          onConfirm={() => { markSubmitted(confirming.id); setConfirming(null) }}
        />
      )}
    </main>
  )
}

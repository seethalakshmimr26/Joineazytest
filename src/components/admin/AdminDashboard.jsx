import { useMemo, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { getStats } from '../../utils/assignments'
import Modal from '../common/Modal'
import Toolbar from '../common/Toolbar'
import ProgressBar from '../common/ProgressBar'
import { EmptyState } from '../common/States'
import AdminAssignmentCard from './AdminAssignmentCard'
import AssignmentFormModal from './AssignmentFormModal'

const STATUS_OPTIONS = [['all', 'All assignments'], ['incomplete', 'Incomplete'], ['complete', 'Fully submitted'], ['pastdue', 'Past due']]

export default function AdminDashboard() {
  const { data, currentUser, createAssignment, updateAssignment, deleteAssignment } = useApp()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState('soonest')
  const [form, setForm] = useState(null) // null | 'new' | assignment being edited
  const [deleting, setDeleting] = useState(null)

  // Admins only ever see the assignments they created.
  const mine = useMemo(
    () => data.assignments.filter((a) => a.createdBy === currentUser.id),
    [data.assignments, currentUser.id],
  )

  const overall = useMemo(() => {
    const totals = mine.reduce(
      (acc, a) => {
        const s = getStats(a, data.users, data.submissions)
        return { done: acc.done + s.done, total: acc.total + s.total }
      },
      { done: 0, total: 0 },
    )
    return { ...totals, pct: totals.total ? Math.round((totals.done / totals.total) * 100) : 0 }
  }, [mine, data.users, data.submissions])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return mine
      .filter((a) => !q || a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q))
      .filter((a) => {
        const s = getStats(a, data.users, data.submissions)
        const complete = s.total > 0 && s.done === s.total
        if (status === 'complete') return complete
        if (status === 'incomplete') return !complete
        if (status === 'pastdue') return !complete && new Date(a.dueDate) < new Date()
        return true
      })
      .sort((a, b) => (sort === 'soonest' ? 1 : -1) * (new Date(a.dueDate) - new Date(b.dueDate)))
  }, [mine, query, status, sort, data.users, data.submissions])

  const save = (values) => {
    if (form === 'new') createAssignment(values)
    else updateAssignment(form.id, values)
    setForm(null)
  }

  return (
    <main className="mx-auto max-w-5xl space-y-5 px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold sm:text-3xl">Your assignments</h1>
        <button className="btn-primary" onClick={() => setForm('new')}>New assignment</button>
      </div>

      {mine.length > 0 && (
        <section className="card p-4 sm:p-5" aria-labelledby="overall-h">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 id="overall-h" className="text-base font-bold">Overall completion</h2>
            <p className="text-sm font-semibold">{overall.done} of {overall.total} submissions across {mine.length} assignments</p>
          </div>
          <ProgressBar value={overall.pct} label="Overall completion across your assignments" />
        </section>
      )}

      {mine.length === 0 ? (
        <EmptyState
          title="You haven't created any assignments"
          message="Create your first assignment and choose which students receive it."
          action={<button className="btn-primary" onClick={() => setForm('new')}>New assignment</button>}
        />
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
                  <AdminAssignmentCard
                    assignment={a}
                    users={data.users}
                    submissions={data.submissions}
                    onEdit={() => setForm(a)}
                    onDelete={() => setDeleting(a)}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {form && (
        <AssignmentFormModal
          initial={form === 'new' ? null : form}
          users={data.users}
          onClose={() => setForm(null)}
          onSave={save}
        />
      )}

      {deleting && (
        <Modal
          title="Delete this assignment?"
          description={`"${deleting.title}" and every student's submission status for it will be removed. This can't be undone.`}
          onClose={() => setDeleting(null)}
          footer={
            <>
              <button className="btn-secondary" onClick={() => setDeleting(null)} data-autofocus>Keep assignment</button>
              <button className="btn-danger" onClick={() => { deleteAssignment(deleting.id); setDeleting(null) }}>Delete assignment</button>
            </>
          }
        >
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {getStats(deleting, data.users, data.submissions).done} student(s) have already submitted.
          </p>
        </Modal>
      )}
    </main>
  )
}

import { useState } from 'react'
import Modal from '../common/Modal'
import { isStudent, validateAssignment } from '../../utils/assignments'

// Defined at module level so inputs keep focus between keystrokes.
function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {error && <p id={`${id}-err`} className="error-text">{error}</p>}
    </div>
  )
}

export default function AssignmentFormModal({ initial, users, onClose, onSave }) {
  const students = users.filter(isStudent)
  const editing = !!initial
  const [values, setValues] = useState({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    dueDate: initial?.dueDate ?? '',
    driveLink: initial?.driveLink ?? '',
    audience: initial ? (initial.assignTo === 'all' ? 'all' : 'selected') : 'all',
    studentIds: initial && initial.assignTo !== 'all' ? initial.assignTo : [],
  })
  const [errors, setErrors] = useState({})

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }))
  const toggleStudent = (id) =>
    setValues((v) => ({
      ...v,
      studentIds: v.studentIds.includes(id) ? v.studentIds.filter((s) => s !== id) : [...v.studentIds, id],
    }))

  const submit = (e) => {
    e.preventDefault()
    const found = validateAssignment(values)
    setErrors(found)
    if (Object.keys(found).length) return
    onSave({
      title: values.title.trim(),
      description: values.description.trim(),
      dueDate: values.dueDate,
      driveLink: values.driveLink.trim(),
      assignTo: values.audience === 'all' ? 'all' : values.studentIds,
    })
  }

  const a11y = (id) => ({ id, 'aria-invalid': !!errors[id], 'aria-describedby': errors[id] ? `${id}-err` : undefined })

  return (
    <Modal
      wide
      title={editing ? 'Edit assignment' : 'New assignment'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" form="assignment-form" className="btn-primary">{editing ? 'Save changes' : 'Create assignment'}</button>
        </>
      }
    >
      <form id="assignment-form" onSubmit={submit} noValidate className="space-y-4">
        <Field id="title" label="Title" error={errors.title}>
          <input {...a11y('title')} data-autofocus className="field" value={values.title} onChange={set('title')} />
        </Field>
        <Field id="description" label="Description" error={errors.description}>
          <textarea {...a11y('description')} rows={3} className="field" value={values.description} onChange={set('description')} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="dueDate" label="Due date and time" error={errors.dueDate}>
            <input {...a11y('dueDate')} type="datetime-local" className="field" value={values.dueDate} onChange={set('dueDate')} />
          </Field>
          <Field id="driveLink" label="Drive link for submission" error={errors.driveLink}>
            <input {...a11y('driveLink')} type="url" inputMode="url" placeholder="https://drive.google.com/…" className="field" value={values.driveLink} onChange={set('driveLink')} />
          </Field>
        </div>

        <fieldset>
          <legend className="label">Assign to</legend>
          <div className="flex flex-wrap gap-4 text-sm">
            {[['all', 'All students'], ['selected', 'Selected students']].map(([val, text]) => (
              <label key={val} className="flex items-center gap-2">
                <input
                  type="radio" name="audience" value={val}
                  checked={values.audience === val}
                  onChange={set('audience')}
                  className="h-4 w-4 accent-brand-600"
                />
                {text}
              </label>
            ))}
          </div>
          {values.audience === 'selected' && (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {students.map((s) => (
                <label key={s.id} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">
                  <input
                    type="checkbox"
                    checked={values.studentIds.includes(s.id)}
                    onChange={() => toggleStudent(s.id)}
                    className="h-4 w-4 accent-brand-600"
                  />
                  {s.name}
                </label>
              ))}
            </div>
          )}
          {errors.studentIds && <p className="error-text" role="alert">{errors.studentIds}</p>}
        </fieldset>
      </form>
    </Modal>
  )
}

export const isStudent = (u) => u?.role === 'student'

/** Student ids an assignment applies to. */
export function getAssignedStudentIds(assignment, users) {
  const students = users.filter(isStudent).map((u) => u.id)
  return assignment.assignTo === 'all'
    ? students
    : assignment.assignTo.filter((id) => students.includes(id))
}

export const isAssignedTo = (assignment, studentId) =>
  assignment.assignTo === 'all' || assignment.assignTo.includes(studentId)

/** Completion numbers for one assignment. */
export function getStats(assignment, users, submissions) {
  const ids = getAssignedStudentIds(assignment, users)
  const done = ids.filter((id) => submissions[assignment.id]?.[id]).length
  const total = ids.length
  return { total, done, pct: total === 0 ? 0 : Math.round((done / total) * 100) }
}

export const isOverdue = (dueDate, submitted, now = Date.now()) =>
  !submitted && new Date(dueDate).getTime() < now

export function validateAssignment(values) {
  const errors = {}
  if (!values.title.trim()) errors.title = 'Enter a title.'
  if (!values.description.trim()) errors.description = 'Enter a short description.'
  if (!values.dueDate) errors.dueDate = 'Pick a due date and time.'
  if (!values.driveLink.trim()) errors.driveLink = 'Add the Drive link where students submit.'
  else {
    try {
      const url = new URL(values.driveLink.trim())
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error()
    } catch {
      errors.driveLink = 'Enter a full link that starts with https://'
    }
  }
  if (values.audience === 'selected' && values.studentIds.length === 0) {
    errors.studentIds = 'Select at least one student.'
  }
  return errors
}

const fmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })

export const formatDateTime = (value) => fmt.format(new Date(value))

/** "Due in 2 days", "Overdue by 1 day". */
export function relativeDue(dueDate, now = Date.now()) {
  const diff = new Date(dueDate).getTime() - now
  const days = Math.floor(Math.abs(diff) / 86400000)
  const hours = Math.floor(Math.abs(diff) / 3600000)
  const unit = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`
  if (diff < 0) return days >= 1 ? `Overdue by ${unit(days, 'day')}` : `Overdue by ${unit(Math.max(hours, 1), 'hour')}`
  return days >= 1 ? `Due in ${unit(days, 'day')}` : `Due in ${unit(Math.max(hours, 1), 'hour')}`
}

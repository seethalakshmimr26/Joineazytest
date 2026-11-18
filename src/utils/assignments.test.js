import { describe, it, expect } from 'vitest'
import { buildSeed } from '../data/seed'
import { getStats, isOverdue, validateAssignment, isAssignedTo } from './assignments'

const { users, assignments, submissions } = buildSeed(Date.UTC(2026, 10, 18))

describe('getStats', () => {
  it('counts submissions only for assigned students', () => {
    const a = assignments.find((x) => x.id === 'as3')
    expect(getStats(a, users, submissions)).toEqual({ total: 3, done: 1, pct: 33 })
  })
  it('handles "all students"', () => {
    const a = assignments.find((x) => x.id === 'as1')
    expect(getStats(a, users, submissions)).toEqual({ total: 5, done: 3, pct: 60 })
  })
})

describe('isAssignedTo', () => {
  it('respects selected students', () => {
    const a = assignments.find((x) => x.id === 'as5')
    expect(isAssignedTo(a, 's1')).toBe(false)
    expect(isAssignedTo(a, 's2')).toBe(true)
  })
})

describe('isOverdue', () => {
  it('is false once submitted', () => {
    expect(isOverdue('2020-01-01T10:00', '2020-01-01')).toBe(false)
  })
  it('is true for past due, unsubmitted work', () => {
    expect(isOverdue('2020-01-01T10:00', undefined)).toBe(true)
  })
})

describe('validateAssignment', () => {
  const base = { title: 'T', description: 'D', dueDate: '2026-12-01T10:00', driveLink: 'https://drive.google.com/x', audience: 'all', studentIds: [] }
  it('accepts a valid form', () => expect(validateAssignment(base)).toEqual({}))
  it('rejects a bad link', () => expect(validateAssignment({ ...base, driveLink: 'nope' }).driveLink).toBeTruthy())
  it('requires students when audience is selected', () =>
    expect(validateAssignment({ ...base, audience: 'selected' }).studentIds).toBeTruthy())
})

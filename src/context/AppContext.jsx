import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { buildSeed } from '../data/seed'

const DATA_KEY = 'handin.data.v1'
const SESSION_KEY = 'handin.session.v1'
const FAKE_LATENCY_MS = 600 // mimics a network call so the loading state is real

const AppContext = createContext(null)

function loadData() {
  const raw = localStorage.getItem(DATA_KEY)
  if (!raw) return buildSeed()
  const parsed = JSON.parse(raw)
  if (!Array.isArray(parsed.users) || !Array.isArray(parsed.assignments) || typeof parsed.submissions !== 'object') {
    throw new Error('Saved data has an unexpected shape.')
  }
  return parsed
}

export function AppProvider({ children }) {
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [error, setError] = useState('')
  const [data, setData] = useState(null)
  const [currentUserId, setCurrentUserId] = useState(() => localStorage.getItem(SESSION_KEY))

  // Starts the (simulated) fetch. Callers set status to 'loading' first when re-running it.
  const load = useCallback(() => {
    const timer = setTimeout(() => {
      try {
        setData(loadData())
        setStatus('ready')
      } catch (e) {
        setError(e.message || 'Could not read saved data.')
        setStatus('error')
      }
    }, FAKE_LATENCY_MS)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => load(), [load])

  // Persist every change once data has loaded successfully.
  useEffect(() => {
    if (status !== 'ready' || !data) return
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify(data))
    } catch {
      setError('Your changes could not be saved. Browser storage may be full or blocked.')
      setStatus('error')
    }
  }, [data, status])

  useEffect(() => {
    if (currentUserId) localStorage.setItem(SESSION_KEY, currentUserId)
    else localStorage.removeItem(SESSION_KEY)
  }, [currentUserId])

  const currentUser = useMemo(
    () => data?.users.find((u) => u.id === currentUserId) ?? null,
    [data, currentUserId],
  )

  const actions = useMemo(
    () => ({
      login: (id) => setCurrentUserId(id),
      logout: () => setCurrentUserId(null),

      createAssignment: (values) =>
        setData((d) => ({
          ...d,
          assignments: [...d.assignments, { ...values, id: `as${Date.now()}`, createdBy: currentUserId }],
        })),

      updateAssignment: (id, values) =>
        setData((d) => ({
          ...d,
          assignments: d.assignments.map((a) => (a.id === id ? { ...a, ...values } : a)),
        })),

      deleteAssignment: (id) =>
        setData((d) => {
          const { [id]: _removed, ...rest } = d.submissions
          return { ...d, assignments: d.assignments.filter((a) => a.id !== id), submissions: rest }
        }),

      markSubmitted: (assignmentId) =>
        setData((d) => ({
          ...d,
          submissions: {
            ...d.submissions,
            [assignmentId]: { ...d.submissions[assignmentId], [currentUserId]: new Date().toISOString() },
          },
        })),

      resetData: () => {
        localStorage.removeItem(DATA_KEY)
        localStorage.removeItem(SESSION_KEY)
        setCurrentUserId(null)
        setStatus('loading')
        load()
      },
      retry: () => {
        setStatus('loading')
        load()
      },
    }),
    [currentUserId, load],
  )

  const value = { status, error, data, currentUser, ...actions }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}

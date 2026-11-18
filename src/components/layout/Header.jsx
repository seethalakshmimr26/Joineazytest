import { useApp } from '../../context/AppContext'
import { useTheme } from '../../hooks/useTheme'

export default function Header() {
  const { currentUser, logout } = useApp()
  const [dark, toggleTheme] = useTheme()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700/70 dark:bg-slate2-850/90">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 font-display text-lg font-bold text-white">H</span>
          <span className="font-display text-lg font-bold">Handin</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn-ghost px-2.5"
            onClick={toggleTheme}
            aria-pressed={dark}
            aria-label="Dark mode"
            title="Toggle dark mode"
          >
            {dark ? 'Light' : 'Dark'}
          </button>
          {currentUser && (
            <>
              <div className="hidden text-right leading-tight sm:block">
                <p className="text-sm font-semibold">{currentUser.name}</p>
                <p className="text-xs capitalize text-slate-500 dark:text-slate-400">{currentUser.role === 'admin' ? 'Professor' : 'Student'}</p>
              </div>
              <button className="btn-secondary" onClick={logout}>Switch user</button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

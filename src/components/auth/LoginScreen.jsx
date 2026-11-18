import { useApp } from '../../context/AppContext'

function UserButton({ user, onPick }) {
  return (
    <li>
      <button
        onClick={() => onPick(user.id)}
        className="card flex w-full items-center gap-3 p-3 text-left transition-colors hover:border-brand-500 dark:hover:border-brand-500"
      >
        <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-100 font-bold text-brand-700 dark:bg-brand-900 dark:text-brand-100">
          {user.name.replace('Prof. ', '').charAt(0)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{user.name}</span>
          <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</span>
        </span>
      </button>
    </li>
  )
}

export default function LoginScreen() {
  const { data, login } = useApp()
  const admins = data.users.filter((u) => u.role === 'admin')
  const students = data.users.filter((u) => u.role === 'student')

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
      <h1 className="text-3xl font-bold sm:text-4xl">Pick who you want to be</h1>
      <p className="mt-2 max-w-xl text-slate-600 dark:text-slate-400">
        This is a demo with sample accounts and no passwords. Choose a professor to manage assignments, or a student to submit them.
      </p>
      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <section aria-labelledby="admins-h">
          <h2 id="admins-h" className="mb-3 text-lg font-bold">Professors</h2>
          <ul className="space-y-2">{admins.map((u) => <UserButton key={u.id} user={u} onPick={login} />)}</ul>
        </section>
        <section aria-labelledby="students-h">
          <h2 id="students-h" className="mb-3 text-lg font-bold">Students</h2>
          <ul className="space-y-2">{students.map((u) => <UserButton key={u.id} user={u} onPick={login} />)}</ul>
        </section>
      </div>
    </main>
  )
}

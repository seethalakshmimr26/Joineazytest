import { useEffect, useState } from 'react'

const KEY = 'handin.theme'

export function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try {
      localStorage.setItem(KEY, dark ? 'dark' : 'light')
    } catch {
      /* storage unavailable: theme just won't persist */
    }
  }, [dark])

  return [dark, () => setDark((d) => !d)]
}

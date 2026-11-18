import { useEffect, useId, useRef } from 'react'

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])'

/** Accessible dialog: Esc closes, focus is trapped and restored, background scroll locked. */
export default function Modal({ title, description, onClose, children, footer, wide = false }) {
  const panelRef = useRef(null)
  const closeRef = useRef(onClose)
  const titleId = useId()
  useEffect(() => {
    closeRef.current = onClose
  })

  useEffect(() => {
    const previous = document.activeElement
    const panel = panelRef.current
    ;(panel.querySelector('[data-autofocus]') || panel.querySelector(FOCUSABLE))?.focus()
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e) => {
      if (e.key === 'Escape') return closeRef.current()
      if (e.key !== 'Tab') return
      const items = [...panel.querySelectorAll(FOCUSABLE)]
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = originalOverflow
      previous?.focus?.()
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-0 animate-fade sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`card flex max-h-[92vh] w-full flex-col rounded-b-none shadow-xl animate-pop sm:rounded-b-xl ${wide ? 'sm:max-w-xl' : 'sm:max-w-md'}`}
      >
        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700/70">
          <h2 id={titleId} className="text-lg font-bold">{title}</h2>
          {description && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>}
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="flex flex-col-reverse gap-2 border-t border-slate-200 px-5 py-3 dark:border-slate-700/70 sm:flex-row sm:justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

import { useEffect, useRef, type ReactNode } from 'react'

type ModalProps = {
  open: boolean
  onClose: () => void
  titleId: string
  closeLabel?: string
  children: ReactNode
}

export function Modal({ open, onClose, titleId, children, closeLabel = "Anleitung schließen" }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!open || !dialog) return
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    dialog.querySelector<HTMLElement>('[data-modal-title]')?.focus()
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      if (previousFocus instanceof HTMLElement && previousFocus !== document.body && previousFocus.isConnected && !previousFocus.matches(':disabled')) previousFocus.focus()
      else document.getElementById('instructions-button')?.focus()
    }
  }, [open])

  return (
    <dialog ref={ref} className="modal-card" aria-modal="true" aria-labelledby={titleId} lang="de"
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return
        const dialog = event.currentTarget
        const controls = Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]'))
        const first = controls[0]
        const last = controls.at(-1)
        if (!first) { event.preventDefault(); return }
        if (event.shiftKey && (document.activeElement === first || !controls.includes(document.activeElement as HTMLElement))) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }}
      onCancel={(event) => { event.preventDefault(); onClose() }}>
      <button type="button" className="modal-close" aria-label={closeLabel} onClick={onClose}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>
      {children}
    </dialog>
  )
}

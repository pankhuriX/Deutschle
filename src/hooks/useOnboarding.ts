import { useState } from 'react'

const STORAGE_KEY = 'deutschle:onboarding-dismissed'

export function useOnboarding() {
  const [isOpen, setIsOpen] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== 'true'
    } catch {
      return true
    }
  })

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      // Storage may be unavailable; dismissal still works for this visit.
    }
    setIsOpen(false)
  }

  return { isOpen, dismiss, reopen: () => setIsOpen(true) }
}

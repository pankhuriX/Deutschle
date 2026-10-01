import { letterFeedback } from '../game/letterFeedback'
import type { LetterState } from '../game/evaluateGuess'

type KeyProps = {
  state?: LetterState
  disabled?: boolean
  value: string
  onPress: (value: string) => void
}

export function Key({ value, onPress, state, disabled = false }: KeyProps) {
  const isAction = value === 'Enter' || value === 'Backspace'

  return (
    <button
      className={`keyboard-key${isAction ? ' keyboard-key--wide' : ''}`}
      type="button"
      disabled={disabled}
      aria-label={value}
      aria-description={state ? letterFeedback[state].label : undefined}
      data-state={state}
      onClick={() => onPress(value)}
    >
      {value === 'Backspace' ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M9 5h12v14H9l-7-7 7-7Z" />
          <path d="m12 9 6 6m0-6-6 6" />
        </svg>
      ) : value === 'Enter' ? 'ENTER' : value}
      {state && <span className="state-symbol" aria-hidden="true">{letterFeedback[state].symbol}</span>}
    </button>
  )
}

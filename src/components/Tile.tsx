import { useEffect, type CSSProperties } from 'react'
import { letterFeedback } from '../game/letterFeedback'
import type { LetterState } from '../game/evaluateGuess'

type TileProps = {
  letter?: string
  state?: LetterState
  column?: number
  onRevealComplete?: () => void
}

export function Tile({ letter = '', state, column = 0, onRevealComplete }: TileProps) {
  useEffect(() => {
    if (!state || !onRevealComplete) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finishWithoutMotion = () => { if (motion.matches) onRevealComplete() }
    finishWithoutMotion()
    motion.addEventListener('change', finishWithoutMotion)
    return () => motion.removeEventListener('change', finishWithoutMotion)
  }, [state, onRevealComplete])

  return (
    <div
      className="letter-tile"
      role="img"
      aria-label={letter ? `${letter}${state ? ", " + letterFeedback[state].label : ", not submitted"}` : "Empty tile"}
      onAnimationEnd={(event) => {
        if (event.animationName === 'tile-reveal') onRevealComplete?.()
      }}
      data-filled={Boolean(letter)}
      data-state={state}
      style={{ '--reveal-delay': `${column * 100}ms` } as CSSProperties}
    >
      <span aria-hidden="true">{letter}</span>
      {state && <span className="state-symbol" aria-hidden="true">{letterFeedback[state].symbol}</span>}
    </div>
  )
}

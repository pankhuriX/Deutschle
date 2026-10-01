import type { LetterState } from './evaluateGuess'

export const letterFeedback: Record<LetterState, { label: string; symbol: string }> = {
  correct: { label: 'correct position', symbol: '✓' },
  present: { label: 'present in another position', symbol: '↔' },
  absent: { label: 'not in word', symbol: '×' },
}

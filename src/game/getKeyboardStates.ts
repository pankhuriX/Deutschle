import type { EvaluatedGuess, LetterState } from './evaluateGuess'

export type KeyboardStates = Partial<Record<string, LetterState>>
const priority: Record<LetterState, number> = { absent: 1, present: 2, correct: 3 }

/** Derive accumulated knowledge from submissions; unused letters have no entry. */
export function getKeyboardStates(guesses: readonly EvaluatedGuess[]): KeyboardStates {
  const states: KeyboardStates = {}
  for (const guess of guesses) {
    Array.from(guess.word).forEach((letter, index) => {
      const discovered = guess.states[index]
      const previous = states[letter]
      if (!previous || priority[discovered] > priority[previous]) {
        states[letter] = discovered
      }
    })
  }
  return states
}

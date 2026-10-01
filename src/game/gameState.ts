import { evaluateGuess, type EvaluatedGuess } from './evaluateGuess'
import { isSupportedLetter, MAX_GUESSES, normalizeWord, WORD_LENGTH } from './rules'
import { validateGuess } from './validateGuess'

export type GameState = {
  guesses: EvaluatedGuess[]
  currentGuess: string
  invalidAttempts: number
  message: string | null
}

export function createGameState(): GameState {
  return { guesses: [], currentGuess: '', invalidAttempts: 0, message: null }
}

export function hasWonGame(state: GameState, target: string): boolean {
  return state.guesses.some((guess) => guess.word === target)
}

/** Shared, atomic transition for physical and virtual input. */
export function applyGameInput(previous: GameState, key: string, target: string, acceptedWords: ReadonlySet<string>): GameState {
  if (previous.guesses.length >= MAX_GUESSES || hasWonGame(previous, target)) return previous
  if (key === 'Enter') {
    const message = validateGuess(previous.currentGuess, acceptedWords)
    if (message) return { ...previous, invalidAttempts: previous.invalidAttempts + 1, message }
    return {
      ...previous,
      message: null,
      guesses: [...previous.guesses, {
        word: previous.currentGuess,
        states: evaluateGuess(previous.currentGuess, target),
      }],
      currentGuess: '',
    }
  }
  if (key === 'Backspace') {
    return { ...previous, message: null, currentGuess: previous.currentGuess.slice(0, -1) }
  }
  if (!isSupportedLetter(key) || previous.currentGuess.length >= WORD_LENGTH) return previous
  return { ...previous, message: null, currentGuess: previous.currentGuess + normalizeWord(key) }
}

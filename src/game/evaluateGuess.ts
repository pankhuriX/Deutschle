import { isSupportedLetter, normalizeWord, WORD_LENGTH } from './rules'

export type LetterState = 'correct' | 'present' | 'absent'

export type EvaluatedGuess = {
  word: string
  states: LetterState[]
}

/** Exact matches consume letters before misplaced matches, including duplicates. */
export function evaluateGuess(guess: string, target: string): LetterState[] {
  if (![guess, target].every((word) => {
    const letters = Array.from(word.normalize('NFC'))
    return letters.length === WORD_LENGTH && letters.every(isSupportedLetter)
  })) {
    throw new Error('Guess and target must each contain five supported German letters.')
  }
  const letters = [...normalizeWord(guess)]
  const solution = [...normalizeWord(target)]
  const states: LetterState[] = Array(WORD_LENGTH).fill('absent')
  const remaining = new Map<string, number>()

  for (let index = 0; index < letters.length; index++) {
    if (letters[index] === solution[index]) {
      states[index] = 'correct'
    } else {
      const letter = solution[index]
      remaining.set(letter, (remaining.get(letter) ?? 0) + 1)
    }
  }

  for (let index = 0; index < letters.length; index++) {
    if (states[index] === 'correct') continue
    const count = remaining.get(letters[index]) ?? 0
    if (count > 0) {
      states[index] = 'present'
      remaining.set(letters[index], count - 1)
    }
  }
  return states
}

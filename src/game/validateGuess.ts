import { WORD_LENGTH } from './rules'

/** Input is already normalized to uppercase by useGame. */
export function validateGuess(guess: string, acceptedWords: ReadonlySet<string>): string | null {
  if (Array.from(guess).length !== WORD_LENGTH) return 'Nicht genug Buchstaben'
  if (!acceptedWords.has(guess)) return 'Wort nicht gefunden'
  return null
}

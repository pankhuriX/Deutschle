export const WORD_LENGTH = 5
export const MAX_GUESSES = 6
export const MESSAGE_DURATION_MS = 2400

export function normalizeWord(word: string): string {
  return word.normalize('NFC').toUpperCase()
}

export function isSupportedLetter(key: string): boolean {
  return /^[a-zäöü]$/i.test(key.normalize('NFC'))
}

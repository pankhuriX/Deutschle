/** Select uniformly from every index except the current word, without retries. */
export function pickNextWordIndex(currentIndex: number, wordCount: number, random = Math.random): number {
  if (!Number.isInteger(wordCount) || wordCount < 2) {
    throw new Error('At least two solutions are required to choose a different word.')
  }
  if (!Number.isInteger(currentIndex) || currentIndex < 0 || currentIndex >= wordCount) {
    throw new Error('Current word index is outside the solution list.')
  }
  const candidate = Math.floor(random() * (wordCount - 1))
  return candidate >= currentIndex ? candidate + 1 : candidate
}

import { useState } from 'react'
import type { VocabularyWord } from '../data/vocabularyTypes'
import { getWordHints, HINT_COUNT } from '../game/hints'

// Owned by the keyed game screen, so every new game starts with zero hints.
export function useHints(word: VocabularyWord) {
  const [count, setCount] = useState(0)
  return {
    count,
    total: HINT_COUNT,
    hints: getWordHints(word).slice(0, count),
    revealNext: () => setCount((previous) => Math.min(previous + 1, HINT_COUNT)),
  }
}

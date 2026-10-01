import data from './solutions.json'
import { isLanguageLevel, isWordType, type VocabularyWord } from './vocabularyTypes'

export type { VocabularyWord } from './vocabularyTypes'

// Validate literal unions at the JSON boundary; the build checks the complete schema.
export const solutionWords: VocabularyWord[] = data.map((entry) => {
  const { type, level, article } = entry
  if (!isWordType(type) || !isLanguageLevel(level) ||
      (article !== null && article !== 'der' && article !== 'die' && article !== 'das')) {
    throw new Error(`Invalid vocabulary metadata: ${entry.word}`)
  }
  return { ...entry, type, level, article }
})

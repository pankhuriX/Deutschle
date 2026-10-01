export const LEVELS = ['A1', 'A2', 'B1', 'B2'] as const
export type LanguageLevel = (typeof LEVELS)[number]
export type WordType = 'noun' | 'verb' | 'adjective' | 'other'
export type Article = 'der' | 'die' | 'das'

export type VocabularyWord = {
  word: string
  displayWord: string
  length: number
  type: WordType
  article: Article | null
  meaning: string
  plural: string | null
  level: LanguageLevel
  category: string
  hint: string
  example: string
}

export const WORD_TYPE_LABELS: Record<WordType, string> = {
  noun: 'Nomen', verb: 'Verb', adjective: 'Adjektiv', other: 'Sonstiges',
}

export function isLanguageLevel(value: unknown): value is LanguageLevel {
  return LEVELS.some((level) => level === value)
}

export function isWordType(value: unknown): value is WordType {
  return value === 'noun' || value === 'verb' || value === 'adjective' || value === 'other'
}

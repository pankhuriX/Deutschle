import { WORD_TYPE_LABELS, type VocabularyWord } from '../data/vocabularyTypes'

export type WordHint = { label: string; value: string; lang: 'de' | 'en' }
export const HINT_COUNT = 3

/** Only approved clue fields leave this function; no answer or translation. */
export function getWordHints(word: VocabularyWord): WordHint[] {
  return [
    { label: 'Kategorie', value: word.category, lang: 'de' },
    word.type === 'noun'
      ? { label: 'Artikel', value: word.article ?? '—', lang: 'de' }
      : { label: 'Wortart', value: WORD_TYPE_LABELS[word.type], lang: 'de' },
    { label: 'Tipp', value: word.hint, lang: 'en' },
  ]
}

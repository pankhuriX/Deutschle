import { LEVELS, type LanguageLevel, type VocabularyWord } from '../data/vocabularyTypes'
import { pickNextWordIndex } from './pickNextWordIndex'
import { WORD_LENGTH } from './rules'

export function selectWord(words: readonly VocabularyWord[], level: LanguageLevel, previousWord?: string, random = Math.random): VocabularyWord {
  const eligibleWords = words.filter((word) => LEVELS.indexOf(word.level) <= LEVELS.indexOf(level) && word.length === WORD_LENGTH)
  if (eligibleWords.length === 0) throw new Error(`No five-letter solutions available for ${level}`)
  const previousIndex = eligibleWords.findIndex((word) => word.word === previousWord)
  const index = previousIndex >= 0 && eligibleWords.length > 1
    ? pickNextWordIndex(previousIndex, eligibleWords.length, random)
    : Math.floor(random() * eligibleWords.length)
  return eligibleWords[index]
}

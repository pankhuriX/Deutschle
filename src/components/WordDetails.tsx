import type { VocabularyWord } from '../data/vocabulary'
import { WORD_TYPE_LABELS } from '../data/vocabularyTypes'

export function WordDetails({ word }: { word: VocabularyWord }) {
  const isNoun = word.type === 'noun'
  return (
    <div className="word-details">
      <p className="result-word">{word.word}</p>
      <p className="word-summary"><span className="word-type">{isNoun && word.article ? `${word.article} · ` : ''}{WORD_TYPE_LABELS[word.type]}</span>
        <span className="word-divider" aria-hidden="true"> · </span>
        <span className="word-meaning" lang="en">{word.meaning}</span>
      </p>
      <blockquote className="word-example">„{word.example}“</blockquote>
      {isNoun && word.plural && <dl className="word-plural"><dt>Plural</dt><dd>{word.plural}</dd></dl>}
    </div>
  )
}

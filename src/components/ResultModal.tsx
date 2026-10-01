import { Modal } from './Modal'
import { WordDetails } from './WordDetails'
import type { VocabularyWord } from '../data/vocabulary'

type ResultModalProps = {
  open: boolean
  outcome: 'won' | 'lost'
  word: VocabularyWord
  onClose: () => void
  onNext: () => void
}

export function ResultModal({ open, outcome, word, onClose, onNext }: ResultModalProps) {
  const won = outcome === 'won'
  return (
    <Modal open={open} onClose={onClose} titleId="result-title" closeLabel="Ergebnis schließen">
      <div className="result-content" data-outcome={outcome}>
        <h2 id="result-title" className="result-title" tabIndex={-1} data-modal-title>
          {won ? <>Richtig! <span aria-hidden="true">🎉</span></> : 'Fast geschafft.'}
        </h2>
        {!won && <p className="result-intro">Das Wort war</p>}
        <WordDetails word={word} />
        <button type="button" className="primary-button" onClick={onNext}>Nächstes Wort</button>
      </div>
    </Modal>
  )
}

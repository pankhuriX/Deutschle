import { Modal } from './Modal'
import { Tile } from './Tile'

const rules = [
  { state: 'correct', letter: 'W', text: 'Richtiger Buchstabe, richtige Position.' },
  { state: 'present', letter: 'O', text: 'Richtiger Buchstabe, falsche Position.' },
  { state: 'absent', letter: 'R', text: 'Der Buchstabe kommt nicht im Wort vor.' },
] as const

type HowToPlayModalProps = { open: boolean; onClose: () => void }

export function HowToPlayModal({ open, onClose }: HowToPlayModalProps) {
  return (
    <Modal open={open} onClose={onClose} titleId="instructions-title">
      <h2 id="instructions-title" className="modal-title onboarding-title" tabIndex={-1} data-modal-title>
        Willkommen bei <span>Deutschle</span>
      </h2>
      <p className="modal-intro">Errate das deutsche Wort in sechs Versuchen.</p>
      <ul className="instruction-rules">
        {rules.map(({ state, letter, text }) => (
          <li key={state}>
            <span className="example-tile" aria-hidden="true"><Tile letter={letter} state={state} /></span>
            <p>{text}</p>
          </li>
        ))}
      </ul>
      <p className="word-length-note">Alle Wörter haben <strong>5 Buchstaben.</strong></p>
      <button className="primary-button" type="button" onClick={onClose}>Los geht&apos;s</button>
    </Modal>
  )
}

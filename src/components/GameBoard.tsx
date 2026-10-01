import { MAX_GUESSES, WORD_LENGTH } from '../game/rules'
import { letterFeedback } from '../game/letterFeedback'
import type { EvaluatedGuess } from '../game/evaluateGuess'
import { Toast } from './Toast'
import { Tile } from './Tile'

type GameBoardProps = {
  guesses: EvaluatedGuess[]
  currentGuess: string
  invalidAttempts: number
  message: string | null
  onResultReveal?: () => void
}

export function GameBoard({ guesses, currentGuess, invalidAttempts, message, onResultReveal }: GameBoardProps) {
  const lastGuess = guesses.at(-1)
  const won = lastGuess?.states.every((state) => state === 'correct')
  const feedback = lastGuess?.states.map((state, index) => `${lastGuess.word[index]}, ${letterFeedback[state].label}`).join('; ')
  const progress = won
    ? 'Richtig! Wort erraten.'
    : guesses.length === MAX_GUESSES
      ? 'All six attempts submitted.'
      : `Attempt ${guesses.length + 1}: ${currentGuess ? currentGuess.split('').join(' ') : 'empty'}. ${currentGuess.length} of ${WORD_LENGTH} letters.`

  return (
    <section className="game-board" tabIndex={0} aria-describedby="game-keyboard-help" aria-label="Word board: six attempts, five letters each">
      <Toast message={message} messageId={invalidAttempts} />
      {Array.from({ length: MAX_GUESSES }, (_, row) => {
        const submitted = guesses[row]
        const word = submitted?.word ?? (row === guesses.length ? currentGuess : '')
        const isFinalRow = Boolean(submitted && (row === MAX_GUESSES - 1 || submitted.states.every((state) => state === 'correct')))
        const shake = row === guesses.length && message ? (invalidAttempts % 2 ? 'odd' : 'even') : undefined
        const rowDescription = submitted ? 'submitted' : word ? word.split('').join(' ') : 'empty'
        return (
          <div className="board-row" data-shake={shake} key={row} role="group" aria-label={`Attempt ${row + 1}: ${rowDescription}`}>
            {Array.from({ length: WORD_LENGTH }, (_, column) => (
              <Tile
                key={column}
                letter={word[column]}
                state={submitted?.states[column]}
                column={column}
                onRevealComplete={isFinalRow && column === WORD_LENGTH - 1 ? onResultReveal : undefined}
              />
            ))}
          </div>
        )
      })}
      <p className="sr-only" role="status" aria-live="polite">
        {lastGuess && `Submitted ${lastGuess.word}: ${feedback}. `}
        {progress}
      </p>
    </section>
  )
}

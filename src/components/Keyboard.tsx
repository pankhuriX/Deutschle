import type { KeyboardStates } from '../game/getKeyboardStates'
import { Key } from './Key'

const rows = [[...'QWERTZUIOPÜ'], [...'ASDFGHJKLÖÄ'], ['Enter', ...'YXCVBNM', 'Backspace']]

type KeyboardProps = {
  states: KeyboardStates
  disabled?: boolean
  onKeyPress: (value: string) => void
}

export function Keyboard({ onKeyPress, states, disabled = false }: KeyboardProps) {
  return (
    <section className="keyboard" aria-label="German keyboard" aria-describedby="game-keyboard-help">
      <p id="game-keyboard-help" className="sr-only">Type letters to enter a word. Enter submits your guess; Backspace deletes. Tab through virtual keys and press Space to activate them. Symbols: check mark means correct position; arrows mean another position; cross means not in word.</p>
      {rows.map((row, index) => (
        <div className="keyboard-row" key={index}>
          {row.map((key) => <Key key={key} value={key} state={states[key]} onPress={onKeyPress} disabled={disabled} />)}
        </div>
      ))}
    </section>
  )
}

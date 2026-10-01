import assert from 'node:assert/strict'
import test from 'node:test'
import { loadTypeScript } from './helpers/loadTypeScript.mjs'

const { validateGuess } = await loadTypeScript('game/validateGuess.ts')
const { acceptedWords: accepted } = await loadTypeScript('data/acceptedWords.ts')

test('short guesses report insufficient letters before dictionary lookup', () => {
  for (const guess of ['', 'A', 'AB', 'ABC', 'ABCD']) assert.equal(validateGuess(guess, accepted), 'Nicht genug Buchstaben')
})
test('unknown five-letter guesses report dictionary failure', () => {
  assert.equal(validateGuess('ZXQTR', accepted), 'Wort nicht gefunden')
})
test('accepted words including umlauts pass', () => {
  for (const word of accepted) assert.equal(validateGuess(word, accepted), null)
})
test('accepted guesses need not be solutions', () => {
  assert.equal(validateGuess('WENIG', accepted), null)
})

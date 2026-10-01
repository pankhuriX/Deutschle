import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeDictionaryWord } from '../scripts/generateGermanWords.mjs'
import { readAcceptedWords } from '../scripts/lib/readAcceptedWords.mjs'
import { loadTypeScript } from './helpers/loadTypeScript.mjs'

const words = await readAcceptedWords()
const accepted = new Set(words)
const { applyGameInput, createGameState } = await loadTypeScript('game/gameState.ts')

test('dictionary is large, unique, sorted and limited to five supported letters', () => {
  assert.ok(words.length > 5000)
  assert.equal(accepted.size, words.length)
  assert.deepEqual(words, [...words].sort())
  for (const word of words) assert.match(word, /^[A-ZÄÖÜ]{5}$/)
})
test('normalization preserves umlauts and rejects sharp S before uppercasing', () => {
  assert.equal(normalizeDictionaryWord('mütze'), 'MÜTZE')
  assert.equal(normalizeDictionaryWord('Mu\u0308tze'), 'MÜTZE')
  for (const word of ['Maße', 'Straße', 'AB-CD', '12345', 'Wort/AB', 'Haus']) {
    assert.equal(normalizeDictionaryWord(word), null)
  }
})
test('dictionary includes ordinary words and expanded inflected forms', () => {
  for (const word of ['WENIG', 'MÜTZE', 'HÄNDE', 'GEHST', 'SAGTE']) assert.ok(accepted.has(word), word)
  assert.equal(accepted.has('ZXQTR'), false)
})
test('A1 target accepts a dictionary guess outside curated solutions', () => {
  let state = createGameState()
  for (const key of 'WENIG') state = applyGameInput(state, key, 'TISCH', accepted)
  state = applyGameInput(state, 'Enter', 'TISCH', accepted)
  assert.equal(state.guesses.length, 1)
})

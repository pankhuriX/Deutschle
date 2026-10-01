import assert from 'node:assert/strict'
import test from 'node:test'
import { loadTypeScript } from './helpers/loadTypeScript.mjs'

const { createGameState, applyGameInput, hasWonGame } = await loadTypeScript('game/gameState.ts')
const accepted = new Set(['TISCH', 'APFEL', 'MÜTZE'])
const input = (state, key) => applyGameInput(state, key, 'TISCH', accepted)
const type = (state, word) => Array.from(word).reduce(input, state)

test('caps uppercase input at five letters and ignores unsupported keys', () => {
  let state = type(createGameState(), 'mütze')
  assert.equal(state.currentGuess, 'MÜTZE')
  for (const key of ['x', 'ß', '1', 'ArrowLeft', ' ']) assert.equal(input(state, key), state)
  state = input(state, 'Backspace')
  assert.equal(state.currentGuess, 'MÜTZ')
})
test('invalid submissions preserve input and attempts and retrigger feedback', () => {
  let state = input(createGameState(), 'Enter')
  assert.equal(state.message, 'Nicht genug Buchstaben')
  state = type(state, 'ZZZZZ')
  state = input(state, 'Enter')
  assert.equal(state.message, 'Wort nicht gefunden')
  assert.equal(state.currentGuess, 'ZZZZZ')
  assert.equal(state.guesses.length, 0)
  assert.equal(input(state, 'Enter').invalidAttempts, 3)
})
test('submitted rows are immutable while editing the next row', () => {
  const before = type(createGameState(), 'APFEL')
  const submitted = input(before, 'Enter')
  const edited = input(input(submitted, 'A'), 'Backspace')
  assert.equal(before.guesses.length, 0)
  assert.equal(edited.guesses[0].word, 'APFEL')
  assert.equal(edited.currentGuess, '')
  assert.equal(edited.guesses, submitted.guesses)
})
test('wins lock input immediately, including before the result reveal', () => {
  const won = input(type(createGameState(), 'TISCH'), 'Enter')
  assert.ok(hasWonGame(won, 'TISCH'))
  for (const key of ['A', 'Backspace', 'Enter']) assert.equal(input(won, key), won)
})
test('six incorrect guesses lock input; a fresh game clears all state', () => {
  let state = createGameState()
  for (let i = 0; i < 6; i++) state = input(type(state, 'APFEL'), 'Enter')
  assert.equal(state.guesses.length, 6)
  assert.equal(hasWonGame(state, 'TISCH'), false)
  assert.equal(input(state, 'Backspace'), state)
  assert.deepEqual(createGameState(), { guesses: [], currentGuess: '', message: null, invalidAttempts: 0 })
})
test('a sixth-guess win is still a win', () => {
  let state = createGameState()
  for (let i = 0; i < 5; i++) state = input(type(state, 'APFEL'), 'Enter')
  state = input(type(state, 'TISCH'), 'Enter')
  assert.ok(hasWonGame(state, 'TISCH'))
  assert.equal(state.guesses.length, 6)
})

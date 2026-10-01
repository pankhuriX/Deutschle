import assert from 'node:assert/strict'
import test from 'node:test'
import { loadTypeScript } from './helpers/loadTypeScript.mjs'

const { evaluateGuess } = await loadTypeScript('game/evaluateGuess.ts')

const cases = [
  ['exact match', 'TISCH', 'TISCH', ['correct', 'correct', 'correct', 'correct', 'correct']],
  ['no matches', 'BLUME', 'TISCH', ['absent', 'absent', 'absent', 'absent', 'absent']],
  ['mixed positions', 'STICH', 'TISCH', ['present', 'present', 'present', 'correct', 'correct']],
  ['exact matches reserve both target Es', 'LEERE', 'REISE', ['absent', 'correct', 'absent', 'present', 'correct']],
  ['only one guessed A can match', 'AAAAA', 'APFEL', ['correct', 'absent', 'absent', 'absent', 'absent']],
  ['misplaced duplicates consume remaining counts', 'EELLL', 'LESEN', ['present', 'correct', 'present', 'absent', 'absent']],
  ['later exact match takes priority', 'ETEEE', 'TASSE', ['absent', 'present', 'absent', 'absent', 'correct']],
  ['umlauts and lowercase', 'mütze', 'MÜTZE', ['correct', 'correct', 'correct', 'correct', 'correct']],
  ['normalized umlaut', 'MU\u0308TZE', 'MÜTZE', ['correct', 'correct', 'correct', 'correct', 'correct']],
]
for (const [name, guess, target, expected] of cases) {
  test(name, () => assert.deepEqual(evaluateGuess(guess, target), expected))
}
test('rejects invalid lengths and unsupported letters before uppercase expansion', () => {
  for (const guess of ['HAUS', 'BLUMEN', '12345', 'AßBC', 'AB-CD']) {
    assert.throws(() => evaluateGuess(guess, 'TISCH'))
  }
  assert.throws(() => evaluateGuess('TISCH', 'HAUS'))
})

test('exhaustive repeated-letter counts never over-credit a target letter', () => {
  const words = Array.from({ length: 3 ** 5 }, (_, value) => value.toString(3).padStart(5, '0').replace(/[012]/g, (digit) => 'ABC'[Number(digit)]))
  for (const target of words) {
    for (const guess of words) {
      const states = evaluateGuess(guess, target)
      for (let i = 0; i < 5; i++) assert.equal(states[i] === 'correct', guess[i] === target[i])
      for (const letter of 'ABC') {
        const credited = [...guess].filter((value, i) => value === letter && states[i] !== 'absent').length
        assert.equal(credited, Math.min([...guess].filter((value) => value === letter).length, [...target].filter((value) => value === letter).length))
      }
    }
  }
})

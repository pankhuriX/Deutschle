import assert from 'node:assert/strict'
import test from 'node:test'
import { loadTypeScript } from './helpers/loadTypeScript.mjs'

const { getKeyboardStates } = await loadTypeScript('game/getKeyboardStates.ts')
const guess = (state) => ({ word: 'ABCDE', states: Array(5).fill(state) })
const priority = ['absent', 'present', 'correct']

for (const first of priority) {
  for (const next of priority) {
    test(`retains strongest state: ${first} then ${next}`, () => {
      const states = getKeyboardStates([guess(first), guess(next)])
      assert.equal(states.A, priority[Math.max(priority.indexOf(first), priority.indexOf(next))])
      assert.equal(states.Z, undefined)
    })
  }
}
test('duplicate letters retain strongest state within a single guess', () => {
  assert.deepEqual(getKeyboardStates([{ word: 'AAAAA', states: ['absent', 'present', 'correct', 'absent', 'present'] }]), { A: 'correct' })
})
test('supports umlauts, leaves unused keys unset, and resets for a new game', () => {
  assert.deepEqual(getKeyboardStates([{ word: 'ÄÖÜAB', states: ['correct', 'present', 'absent', 'absent', 'correct'] }]), {
    Ä: 'correct', Ö: 'present', Ü: 'absent', A: 'absent', B: 'correct',
  })
  assert.deepEqual(getKeyboardStates([]), {})
})

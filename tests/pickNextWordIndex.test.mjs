import assert from 'node:assert/strict'
import test from 'node:test'
import { loadTypeScript } from './helpers/loadTypeScript.mjs'

const { pickNextWordIndex } = await loadTypeScript('game/pickNextWordIndex.ts')

test('every other word is reachable exactly once, with no immediate repeats', () => {
  const count = 40
  for (let current = 0; current < count; current++) {
    const selected = Array.from({ length: count - 1 }, (_, bucket) =>
      pickNextWordIndex(current, count, () => (bucket + 0.5) / (count - 1)))
    assert.deepEqual(selected, Array.from({ length: count }, (_, i) => i).filter((i) => i !== current))
  }
})
test('handles random range boundaries and a two-word dataset', () => {
  assert.equal(pickNextWordIndex(0, 40, () => 0), 1)
  assert.equal(pickNextWordIndex(39, 40, () => 0.999999), 38)
  assert.equal(pickNextWordIndex(0, 2, () => 0.5), 1)
  assert.equal(pickNextWordIndex(1, 2, () => 0.5), 0)
})
test('rejects datasets where a different word cannot be selected', () => {
  assert.throws(() => pickNextWordIndex(0, 1))
  assert.throws(() => pickNextWordIndex(0, 0))
  assert.throws(() => pickNextWordIndex(40, 40))
})

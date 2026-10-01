import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { loadTypeScript } from './helpers/loadTypeScript.mjs'

const words = JSON.parse(await readFile(new URL('../src/data/solutions.json', import.meta.url), 'utf8'))
const { selectWord } = await loadTypeScript('game/selectWord.ts')
const { getWordHints, HINT_COUNT } = await loadTypeScript('game/hints.ts')
const { isLanguageLevel, LEVELS } = await loadTypeScript('data/vocabularyTypes.ts')

for (const level of ['A1', 'A2', 'B1', 'B2']) {
  test(`${level}: every choice stays in the cumulative level pool and avoids its predecessor`, () => {
    const eligible = words.filter((word) => LEVELS.indexOf(word.level) <= LEVELS.indexOf(level) && word.length === 5)
    assert.equal(eligible.length, (LEVELS.indexOf(level) + 1) * 30)
    for (const previous of eligible) {
      const selected = new Set()
      for (let bucket = 0; bucket < eligible.length - 1; bucket++) {
        const next = selectWord(words, level, previous.word, () => (bucket + 0.5) / (eligible.length - 1))
        assert.ok(LEVELS.indexOf(next.level) <= LEVELS.indexOf(level))
        assert.equal(next.length, 5)
        assert.notEqual(next.word, previous.word)
        selected.add(next.word)
      }
      assert.equal(selected.size, eligible.length - 1)
    }
  })
}
test('switching levels selects from the new pool and excludes wrong lengths', () => {
  const withInvalid = [...words, { ...words[0], word: 'HAUS', length: 4, level: 'B2' }]
  for (const random of [0, 0.5, 0.999999]) {
    const next = selectWord(withInvalid, 'B2', words[0].word, () => random)
    assert.ok(LEVELS.includes(next.level))
    assert.equal(next.length, 5)
  }
})
test('selection handles one eligible word and rejects empty pools', () => {
  const single = words[0]
  assert.equal(selectWord([single], single.level, single.word), single)
  assert.throws(() => selectWord([], 'A1'))
})
test('invalid stored levels are distinguishable from supported choices', () => {
  for (const level of ['A1', 'A2', 'B1', 'B2']) assert.ok(isLanguageLevel(level))
  for (const value of [null, '', 'C1', 'a1', 'undefined', 1]) assert.equal(isLanguageLevel(value), false)
})
test('three hints use only category, article/type, and descriptive clue', () => {
  assert.equal(HINT_COUNT, 3)
  for (const word of words) {
    const hints = getWordHints(word)
    assert.equal(hints.length, 3)
    assert.equal(hints[0].value, word.category)
    assert.equal(hints[1].label, word.type === 'noun' ? 'Artikel' : 'Wortart')
    if (word.type === 'noun') assert.equal(hints[1].value, word.article)
    assert.equal(hints[2].value, word.hint)
    for (const hint of hints) {
      assert.notEqual(hint.value, word.word)
      assert.notEqual(hint.value, word.displayWord)
      assert.notEqual(hint.value, word.meaning)
      assert.notEqual(hint.value, word.example)
    }
  }
})

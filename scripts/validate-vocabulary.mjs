import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { readAcceptedWords } from './lib/readAcceptedWords.mjs'

const readData = async (name) => JSON.parse(await readFile(new URL(`../src/data/${name}.json`, import.meta.url), 'utf8'))
const solutions = await readData('solutions')
const acceptedGuesses = await readAcceptedWords()
const fields = ['word', 'displayWord', 'type', 'article', 'meaning', 'plural', 'example', 'length', 'level', 'category', 'hint'].sort()

function validateWord(word) {
  assert.equal(typeof word, 'string', 'Words must be strings')
  assert.equal(word, word.normalize('NFC'), `${word}: use normalized Unicode`)
  assert.equal([...word].length, 5, `${word}: must contain exactly five letters`)
  assert.match(word, /^[A-ZÄÖÜ]{5}$/, `${word}: only uppercase A–Z, Ä, Ö, Ü are supported`)
}

assert.ok(Array.isArray(solutions) && solutions.length > 0, 'Solutions must be a nonempty array')
assert.ok(Array.isArray(acceptedGuesses) && acceptedGuesses.length > 0, 'Accepted guesses must be a nonempty array')
const seen = new Set()
for (const entry of solutions) {
  validateWord(entry.word)
  assert.equal(entry.length, 5, `${entry.word}: incorrect length metadata`)
  assert.ok(['A1', 'A2', 'B1', 'B2'].includes(entry.level), `${entry.word}: invalid level`)
  assert.deepEqual(Object.keys(entry).sort(), fields, `${entry.word}: unexpected entry structure`)
  assert.ok(!seen.has(entry.word), `${entry.word}: duplicate solution`)
  seen.add(entry.word)
  for (const field of ['displayWord', 'meaning', 'example', 'category', 'hint']) {
    assert.ok(typeof entry[field] === 'string' && entry[field].trim().length > 0, `${entry.word}: missing ${field}`)
  }
  for (const field of ['hint', 'category']) {
    assert.ok(!(entry[field].toLocaleLowerCase('de').match(/[a-zäöüß]+/g) ?? []).includes(entry.word.toLocaleLowerCase('de')), `${entry.word}: ${field} reveals the answer`)
  }
  assert.equal(entry.displayWord.normalize('NFC').toUpperCase(), entry.word, `${entry.word}: displayWord mismatch`)
  assert.ok(['noun', 'verb', 'adjective', 'other'].includes(entry.type), `${entry.word}: unsupported word type`)
  if (entry.type === 'noun') {
    assert.ok(['der', 'die', 'das'].includes(entry.article), `${entry.word}: missing noun article`)
    assert.ok(entry.plural === null || (typeof entry.plural === 'string' && entry.plural.trim().length > 0), `${entry.word}: missing noun plural`)
  } else {
    assert.equal(entry.article, null, `${entry.word}: non-noun article must be null`)
    assert.equal(entry.plural, null, `${entry.word}: non-noun plural must be null`)
  }
}
for (const level of ['A1', 'A2', 'B1', 'B2']) {
  const count = solutions.filter((entry) => entry.level === level).length
  assert.ok(count >= 30, `${level}: keep at least 30 solutions`)
  console.log(`${level}: ${count} five-letter solutions`)
}
acceptedGuesses.forEach(validateWord)
const accepted = new Set(acceptedGuesses)
assert.equal(accepted.size, acceptedGuesses.length, 'Duplicate accepted guesses')
for (const word of seen) assert.ok(accepted.has(word), `${word}: solution must also be an accepted guess`)
console.log(`Validated ${solutions.length} solutions and ${accepted.size} accepted guesses: five letters, supported characters, unique entries, and complete metadata.`)

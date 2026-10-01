import { readFile } from 'node:fs/promises'

// Read the generator's JSON array without requiring Node to execute TypeScript.
export async function readAcceptedWords() {
  const source = await readFile(new URL('../../src/data/acceptedWords.ts', import.meta.url), 'utf8')
  const match = source.match(/new Set<string>\((\[[\s\S]*\])\);/)
  if (!match) throw new Error('Invalid generated dictionary; run npm run generate:words')
  return JSON.parse(match[1])
}

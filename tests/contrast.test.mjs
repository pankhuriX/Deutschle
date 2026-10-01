import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const css = await readFile(new URL('../src/index.css', import.meta.url), 'utf8')
const colors = Object.fromEntries([...css.matchAll(/--color-([\w-]+):\s*(#[\da-f]{6});/gi)].map((match) => [match[1], match[2]]))
function luminance(hex) {
  const rgb = hex.slice(1).match(/../g).map((value) => parseInt(value, 16) / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722
}
for (const [foreground, background] of [
  ['text', 'background'], ['text', 'surface'], ['text', 'border'],
  ['text-secondary', 'background'], ['text-secondary', 'surface'],
  ['background', 'lime'], ['background', 'purple'], ['background', 'text'],
  ['lime', 'background'], ['purple', 'background'],
]) {
  test(`AA text contrast: ${foreground} on ${background}`, () => {
    const values = [luminance(colors[foreground]), luminance(colors[background])].sort((a, b) => a - b)
    const ratio = (values[1] + 0.05) / (values[0] + 0.05)
    assert.ok(ratio >= 4.5, `${ratio.toFixed(2)}:1 is below 4.5:1`)
  })
}

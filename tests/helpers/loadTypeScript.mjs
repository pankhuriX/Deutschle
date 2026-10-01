import { readFile } from 'node:fs/promises'
import ts from 'typescript'

// Execute real source modules with the existing compiler, without another test dependency.
async function moduleUrl(url) {
  const source = await readFile(url, 'utf8')
  let { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2023 },
  })
  for (const match of [...outputText.matchAll(/from (['"])(\.\.?\/[^'"]+)\1/g)]) {
    const dependency = await moduleUrl(new URL(`${match[2]}.ts`, url))
    outputText = outputText.replace(match[0], `from '${dependency}'`)
  }
  return `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
}

export async function loadTypeScript(relativePath) {
  return import(await moduleUrl(new URL(`../../src/${relativePath}`, import.meta.url)))
}

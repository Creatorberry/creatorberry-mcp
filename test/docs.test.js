import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const readDoc = (name) => readFile(new URL(`../docs/${name}.md`, import.meta.url), 'utf8')

test('Claude setup documents registration, interactive OAuth, and verification', async () => {
  const doc = await readDoc('claude')
  assert.match(doc, /claude mcp add --transport http --scope user creatorberry/)
  assert.match(doc, /claude \/mcp/)
  assert.match(doc, /integrated terminal/)
  assert.match(doc, /Never enter credentials or approve access for the user/)
  assert.match(doc, /confirm that \*\*creatorberry\*\* is connected/i)
})

test('Codex setup documents registration, OAuth login, and verification', async () => {
  const doc = await readDoc('codex')
  assert.match(doc, /codex mcp add creatorberry --url/)
  assert.match(doc, /codex mcp login creatorberry/)
  assert.match(doc, /codex mcp list/)
  assert.match(doc, /Never enter credentials or approve access for the user/)
  assert.match(doc, /confirm that \*\*creatorberry\*\* is connected/i)
})

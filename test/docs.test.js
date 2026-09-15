import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const readDoc = (name) => readFile(new URL(`../docs/${name}.md`, import.meta.url), 'utf8')

test('MCP overview documents endpoint, OAuth, permissions, and a safe first request', async () => {
  const doc = await readDoc('mcp')
  assert.match(doc, /https:\/\/www\.creatorberry\.com\/api\/mcp/)
  assert.match(doc, /browser-based OAuth/)
  assert.match(doc, /creatorberry:read/)
  assert.match(doc, /creatorberry:analyze/)
  assert.match(doc, /list my automation filters/i)
})

test('setup documents accurate Claude Code registration and interactive OAuth', async () => {
  const doc = await readDoc('setup')
  assert.match(doc, /claude mcp add --transport http --scope user creatorberry/)
  assert.match(doc, /type `claude` and press \*\*Enter\*\*/i)
  assert.match(doc, /type `\/mcp` and press \*\*Enter\*\*/i)
  assert.doesNotMatch(doc, /claude \/mcp/)
  assert.match(doc, /Never enter credentials or approve access for the user/)
  assert.match(doc, /confirm that \*\*creatorberry\*\* is connected/i)
})

test('setup documents Codex registration, OAuth login, and verification', async () => {
  const doc = await readDoc('setup')
  assert.match(doc, /codex mcp add creatorberry --url/)
  assert.match(doc, /codex mcp login creatorberry/)
  assert.match(doc, /codex mcp list/)
  assert.match(doc, /Never enter credentials or approve access for the user/)
})

test('tool reference documents exactly the five public tools and charging', async () => {
  const doc = await readDoc('tools')
  for (const name of ['filters', 'videos-watchlist', 'video-global', 'analyze', 'analysis-result']) {
    assert.ok(doc.includes(`## \`${name}\``), `missing ${name} heading`)
  }
  assert.match(doc, /successful new workspace unlock/)
  assert.match(doc, /maximum result limit is 50/i)
})

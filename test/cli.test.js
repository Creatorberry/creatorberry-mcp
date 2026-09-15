import assert from 'node:assert/strict'
import test from 'node:test'
import { PassThrough } from 'node:stream'
import { runCli } from '../src/cli.js'

function harness({ argv, configured = false, configuredUrl, fetchStatus = 401, clientFound = true, addFailure = null }) {
  const calls = []
  let exists = configured
  let url = configuredUrl
  const output = new PassThrough()
  const errorOutput = new PassThrough()
  let stdout = ''
  let stderr = ''
  output.on('data', (chunk) => { stdout += chunk })
  errorOutput.on('data', (chunk) => { stderr += chunk })
  const input = new PassThrough()
  input.isTTY = false

  const runner = {
    find: (command) => clientFound ? `/bin/${command}` : null,
    run: (_executable, args) => {
      calls.push(args)
      if (args[1] === 'get') {
        return exists
          ? { code: 0, stdout: `url: ${url}`, stderr: '' }
          : { code: 1, stdout: '', stderr: 'not found' }
      }
      if (args[1] === 'add') {
        if (addFailure) return addFailure
        exists = true
        url = args.find((part) => /^https?:/.test(part))
      }
      if (args[1] === 'remove') exists = false
      return { code: 0, stdout: '', stderr: '' }
    },
  }
  const fetchImpl = async () => ({ status: fetchStatus })
  return {
    calls,
    run: async () => {
      const code = await runCli({ argv, runner, fetchImpl, input, output, errorOutput })
      return { code, stdout, stderr }
    },
  }
}

test('requires an explicit client', async () => {
  const result = await harness({ argv: ['install'] }).run()
  assert.equal(result.code, 2)
  assert.match(result.stderr, /--client codex or --client claude/)
})

test('global help works without a command or installed client', async () => {
  const result = await harness({ argv: ['--help'], clientFound: false }).run()
  assert.equal(result.code, 0)
  assert.match(result.stdout, /CreatorBerry MCP CLI/)
})

test('Codex dry-run shows the command without changing configuration', async () => {
  const testRun = harness({ argv: ['install', '--client', 'codex', '--dry-run'] })
  const result = await testRun.run()
  assert.equal(result.code, 0)
  assert.match(result.stdout, /codex mcp add creatorberry --url/)
  assert.equal(testRun.calls.length, 0)
})

test('dry-run works when the selected client is not installed', async () => {
  const result = await harness({
    argv: ['install', '--client', 'claude', '--dry-run'],
    clientFound: false,
  }).run()
  assert.equal(result.code, 0)
  assert.match(result.stdout, /No client lookup or changes were performed/)
})

test('installs Codex and verifies the result', async () => {
  const testRun = harness({ argv: ['install', '--client', 'codex', '--yes'] })
  const result = await testRun.run()
  assert.equal(result.code, 0)
  assert.deepEqual(testRun.calls[1], ['mcp', 'add', 'creatorberry', '--url', 'https://www.creatorberry.com/api/mcp'])
  assert.match(result.stdout, /OAuth authentication is still required/)
  assert.match(result.stdout, /Next command: codex mcp login creatorberry/)
  assert.match(result.stdout, /After sign-in, run: codex mcp list/)
  assert.match(result.stdout, /Do not claim setup is complete/)
})

test('installs Claude in user scope and verifies the result', async () => {
  const testRun = harness({ argv: ['install', '--client', 'claude', '--yes'] })
  const result = await testRun.run()
  assert.equal(result.code, 0)
  assert.deepEqual(testRun.calls[1], [
    'mcp', 'add', '--transport', 'http', '--scope', 'user',
    'creatorberry', 'https://www.creatorberry.com/api/mcp',
  ])
  assert.match(result.stdout, /OAuth authentication is still required/)
  assert.match(result.stdout, /open PowerShell, type claude, and press Enter/)
  assert.match(result.stdout, /Inside Claude Code, type \/mcp and press Enter/)
  assert.doesNotMatch(result.stdout, /claude \/mcp/)
  assert.match(result.stdout, /complete the browser sign-in yourself/)
  assert.match(result.stdout, /do not claim setup is complete/)
})

test('installation failure includes the underlying launcher error', async () => {
  const result = await harness({
    argv: ['install', '--client', 'claude', '--yes'],
    addFailure: { code: 1, stdout: '', stderr: 'spawnSync claude ENOENT' },
  }).run()
  assert.equal(result.code, 5)
  assert.match(result.stderr, /spawnSync claude ENOENT/)
})

test('install is idempotent when the same URL exists', async () => {
  const testRun = harness({
    argv: ['install', '--client', 'claude', '--yes'],
    configured: true,
    configuredUrl: 'https://www.creatorberry.com/api/mcp',
  })
  const result = await testRun.run()
  assert.equal(result.code, 0)
  assert.equal(testRun.calls.length, 1)
  assert.match(result.stdout, /already configured/)
})

test('install refuses to overwrite a different same-name entry', async () => {
  const result = await harness({
    argv: ['install', '--client', 'codex', '--yes'],
    configured: true,
    configuredUrl: 'https://example.com/mcp',
  }).run()
  assert.equal(result.code, 4)
  assert.match(result.stderr, /different settings/)
})

test('allows HTTP only for local testing', async () => {
  const local = await harness({ argv: ['install', '--client', 'codex', '--url', 'http://localhost:3100/api/mcp', '--dry-run'] }).run()
  const remote = await harness({ argv: ['install', '--client', 'codex', '--url', 'http://example.com/mcp', '--dry-run'] }).run()
  assert.equal(local.code, 0)
  assert.equal(remote.code, 2)
  assert.match(remote.stderr, /must use HTTPS/)
})

test('status reports a reachable OAuth challenge', async () => {
  const result = await harness({
    argv: ['status', '--client', 'claude'],
    configured: true,
    configuredUrl: 'https://www.creatorberry.com/api/mcp',
    fetchStatus: 401,
  }).run()
  assert.equal(result.code, 0)
  assert.match(result.stdout, /reachable \(HTTP 401\)/)
  assert.match(result.stdout, /does not send user credentials/)
  assert.match(result.stdout, /not the user login/)
})

test('reports a missing client clearly', async () => {
  const result = await harness({ argv: ['status', '--client', 'codex'], clientFound: false }).run()
  assert.equal(result.code, 3)
  assert.match(result.stderr, /not found on PATH/)
})

test('non-interactive install requires --yes', async () => {
  const testRun = harness({ argv: ['install', '--client', 'claude'] })
  const result = await testRun.run()
  assert.equal(result.code, 0)
  assert.equal(testRun.calls.length, 1)
  assert.match(result.stdout, /Cancelled/)
})

test('rejects credentials embedded in the MCP URL', async () => {
  const result = await harness({
    argv: ['install', '--client', 'codex', '--url', 'https://user:secret@example.com/mcp', '--dry-run'],
  }).run()
  assert.equal(result.code, 2)
  assert.match(result.stderr, /cannot contain credentials/)
})

test('remove changes only the named MCP entry', async () => {
  const testRun = harness({
    argv: ['remove', '--client', 'codex', '--yes'],
    configured: true,
    configuredUrl: 'https://www.creatorberry.com/api/mcp',
  })
  const result = await testRun.run()
  assert.equal(result.code, 0)
  assert.deepEqual(testRun.calls[1], ['mcp', 'remove', 'creatorberry'])
  assert.match(result.stdout, /Other MCP configurations were not touched/)
})

test('remove is harmless when CreatorBerry is absent', async () => {
  const result = await harness({ argv: ['remove', '--client', 'claude', '--yes'] }).run()
  assert.equal(result.code, 0)
  assert.match(result.stdout, /not configured/)
})

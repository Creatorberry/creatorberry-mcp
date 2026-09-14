import assert from 'node:assert/strict'
import test from 'node:test'
import { selectExecutable } from '../src/system-runner.js'

test('Windows prefers a launchable command shim over an extensionless sibling', () => {
  const selected = selectExecutable([
    'C:\\Users\\test\\AppData\\Roaming\\npm\\claude',
    'C:\\Users\\test\\AppData\\Roaming\\npm\\claude.cmd',
  ], 'win32')

  assert.equal(selected, 'C:\\Users\\test\\AppData\\Roaming\\npm\\claude.cmd')
})

test('Windows prefers native executables before command wrappers', () => {
  const selected = selectExecutable([
    'C:\\tools\\codex.cmd',
    'C:\\tools\\codex.exe',
  ], 'win32')

  assert.equal(selected, 'C:\\tools\\codex.exe')
})

test('non-Windows platforms preserve the first PATH match', () => {
  assert.equal(selectExecutable(['/usr/local/bin/claude', '/usr/bin/claude'], 'linux'), '/usr/local/bin/claude')
})

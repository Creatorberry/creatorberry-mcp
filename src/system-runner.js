import { spawnSync } from 'node:child_process'
import path from 'node:path'

function safeCmdArgument(value) {
  if (/[\r\n\0"&|<>^%!]/.test(value)) {
    throw new Error('An argument contains characters that are unsafe for a Windows command wrapper.')
  }
  return `"${value}"`
}

function findOnPath(command, platform) {
  const locator = platform === 'win32' ? 'where.exe' : 'which'
  const result = spawnSync(locator, [command], { encoding: 'utf8', windowsHide: true })
  if (result.status !== 0) return null
  return result.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean) ?? null
}

function execute(executable, args, options, platform) {
  if (platform === 'win32' && ['.cmd', '.bat'].includes(path.extname(executable).toLowerCase())) {
    const commandLine = [executable, ...args].map(safeCmdArgument).join(' ')
    return spawnSync(commandLine, { ...options, shell: true })
  }
  return spawnSync(executable, args, options)
}

export function createSystemRunner({ platform = process.platform } = {}) {
  return {
    find(command) {
      return findOnPath(command, platform)
    },
    run(executable, args, { inherit = false } = {}) {
      const result = execute(executable, args, {
        encoding: 'utf8',
        stdio: inherit ? 'inherit' : ['ignore', 'pipe', 'pipe'],
        windowsHide: true,
      }, platform)

      if (result.error) {
        return { code: 1, stdout: '', stderr: result.error.message }
      }
      return {
        code: result.status ?? 1,
        stdout: inherit ? '' : result.stdout || '',
        stderr: inherit ? '' : result.stderr || '',
      }
    },
  }
}

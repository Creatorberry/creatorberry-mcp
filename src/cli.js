import readline from 'node:readline/promises'

export const DEFAULT_MCP_NAME = 'creatorberry'
export const DEFAULT_MCP_URL = 'https://www.creatorberry.com/api/mcp'

const clients = {
  codex: {
    command: 'codex',
    addArgs: ({ name, url }) => ['mcp', 'add', name, '--url', url],
    getArgs: ({ name }) => ['mcp', 'get', name, '--json'],
    removeArgs: ({ name }) => ['mcp', 'remove', name],
    authHelp: 'Open Codex, select the CreatorBerry MCP, and choose Authenticate.',
    installedMessage: 'Codex may complete OAuth during installation. Open Codex and check that the CreatorBerry MCP shows as connected.',
  },
  claude: {
    command: 'claude',
    addArgs: ({ name, url, scope }) => ['mcp', 'add', '--transport', 'http', '--scope', scope, name, url],
    getArgs: ({ name }) => ['mcp', 'get', name],
    removeArgs: ({ name }) => ['mcp', 'remove', name],
    authHelp: 'Open Claude Code, run /mcp, select CreatorBerry, and choose Authenticate.',
    installedMessage: 'Configuration is complete; OAuth authentication is still required.',
  },
}

function write(stream, message = '') {
  stream.write(`${message}\n`)
}

function usage() {
  return `CreatorBerry MCP CLI

Usage:
  creatorberry install --client <codex|claude> [options]
  creatorberry status  --client <codex|claude> [options]
  creatorberry remove  --client <codex|claude> [options]

Options:
  --client <name>   Required in Phase 3: codex or claude
  --url <url>       MCP URL (default: ${DEFAULT_MCP_URL})
  --name <name>     MCP configuration name (default: ${DEFAULT_MCP_NAME})
  --scope <scope>   Claude scope: user, local, or project (default: user)
  --dry-run         Show the change without making it
  --yes, -y         Skip the confirmation prompt
  --help, -h        Show this help

Examples:
  creatorberry install --client claude
  creatorberry install --client codex --dry-run
  creatorberry status --client claude
  creatorberry remove --client codex --yes`
}

export function parseArgs(argv) {
  const options = {
    command: argv[0],
    client: null,
    url: DEFAULT_MCP_URL,
    name: DEFAULT_MCP_NAME,
    scope: 'user',
    dryRun: false,
    yes: false,
    help: argv[0] === '--help' || argv[0] === '-h',
  }

  for (let index = 1; index < argv.length; index += 1) {
    const token = argv[index]
    if (token === '--dry-run') options.dryRun = true
    else if (token === '--yes' || token === '-y') options.yes = true
    else if (token === '--help' || token === '-h') options.help = true
    else if (['--client', '--url', '--name', '--scope'].includes(token)) {
      const value = argv[index + 1]
      if (!value || value.startsWith('-')) throw new Error(`${token} requires a value.`)
      options[token.slice(2)] = value
      index += 1
    } else {
      throw new Error(`Unknown option: ${token}`)
    }
  }
  return options
}

function validate(options) {
  if (!['install', 'status', 'remove'].includes(options.command)) {
    throw new Error('Choose a command: install, status, or remove.')
  }
  if (!clients[options.client]) {
    throw new Error('Choose a client with --client codex or --client claude.')
  }
  if (!/^[a-z0-9][a-z0-9_-]{0,63}$/i.test(options.name)) {
    throw new Error('--name must use only letters, numbers, hyphens, or underscores.')
  }
  if (!['user', 'local', 'project'].includes(options.scope)) {
    throw new Error('--scope must be user, local, or project.')
  }
  if (options.client === 'codex' && options.scope !== 'user') {
    throw new Error('--scope applies only to Claude Code.')
  }

  let url
  try {
    url = new URL(options.url)
  } catch {
    throw new Error('--url must be a valid URL.')
  }
  const loopback = ['localhost', '127.0.0.1', '::1'].includes(url.hostname)
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback)) {
    throw new Error('--url must use HTTPS. HTTP is allowed only for local testing.')
  }
  if (url.username || url.password || url.hash) {
    throw new Error('--url cannot contain credentials or a fragment.')
  }
}

function commandPreview(executable, args) {
  return [executable, ...args].map((part) => /\s/.test(part) ? JSON.stringify(part) : part).join(' ')
}

async function confirm(message, { input, output }) {
  if (!input.isTTY) return false
  const prompt = readline.createInterface({ input, output })
  try {
    const answer = await prompt.question(`${message} [y/N] `)
    return /^y(es)?$/i.test(answer.trim())
  } finally {
    prompt.close()
  }
}

function inspectConfiguration(runner, executable, client, options) {
  const result = runner.run(executable, client.getArgs(options))
  const combined = `${result.stdout}\n${result.stderr}`
  return {
    exists: result.code === 0,
    matchesUrl: result.code === 0 && combined.includes(options.url),
    output: combined.trim(),
  }
}

async function endpointStatus(url, fetchImpl) {
  if (!fetchImpl) return { reachable: null }
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 5000)
  try {
    const response = await fetchImpl(url, {
      method: 'GET',
      redirect: 'manual',
      signal: controller.signal,
      headers: { accept: 'application/json' },
    })
    return { reachable: true, status: response.status }
  } catch (error) {
    return { reachable: false, error: error.name === 'AbortError' ? 'timed out' : error.message }
  } finally {
    clearTimeout(timer)
  }
}

export async function runCli({ argv, runner, fetchImpl, input, output, errorOutput }) {
  let options
  try {
    options = parseArgs(argv)
    if (options.help || argv.length === 0) {
      write(output, usage())
      return 0
    }
    validate(options)
  } catch (error) {
    write(errorOutput, `Error: ${error.message}`)
    write(errorOutput, 'Run creatorberry --help for usage.')
    return 2
  }

  const client = clients[options.client]

  if (options.dryRun && ['install', 'remove'].includes(options.command)) {
    const args = options.command === 'install' ? client.addArgs(options) : client.removeArgs(options)
    if (options.command === 'install') {
      write(output, `Client: ${options.client}`)
      write(output, `MCP URL: ${options.url}`)
      write(output, `Change: add the "${options.name}" MCP configuration`)
    } else {
      write(output, `Change: remove only the "${options.name}" MCP configuration from ${options.client}.`)
    }
    write(output, `Command: ${commandPreview(client.command, args)}`)
    write(output, 'Dry run complete. No client lookup or changes were performed.')
    return 0
  }

  const executable = runner.find(client.command)
  if (!executable) {
    write(errorOutput, `${client.command} was not found on PATH.`)
    write(errorOutput, `Install ${options.client === 'codex' ? 'Codex' : 'Claude Code'} or open a new terminal after installing it.`)
    return 3
  }

  const current = inspectConfiguration(runner, executable, client, options)

  if (options.command === 'install') {
    if (current.exists && current.matchesUrl) {
      write(output, `CreatorBerry is already configured for ${options.client}. No changes made.`)
      write(output, client.authHelp)
      return 0
    }
    if (current.exists) {
      write(errorOutput, `An MCP configuration named "${options.name}" already exists with different settings.`)
      write(errorOutput, `Remove or rename it before installing CreatorBerry. No changes made.`)
      return 4
    }

    const args = client.addArgs(options)
    write(output, `Client: ${options.client}`)
    write(output, `MCP URL: ${options.url}`)
    write(output, `Change: add the "${options.name}" MCP configuration`)
    write(output, `Command: ${commandPreview(client.command, args)}`)
    if (!options.yes && !await confirm('Continue?', { input, output })) {
      write(output, 'Cancelled. No changes made.')
      return 0
    }

    const result = runner.run(executable, args, { inherit: true })
    if (result.code !== 0) {
      write(errorOutput, `Installation failed. ${client.command} exited with code ${result.code}.`)
      return 5
    }
    const after = inspectConfiguration(runner, executable, client, options)
    if (!after.exists || !after.matchesUrl) {
      write(errorOutput, 'The client command finished, but the CreatorBerry configuration could not be verified.')
      return 6
    }
    write(output, `CreatorBerry was added to ${options.client}.`)
    write(output, client.installedMessage)
    write(output, client.authHelp)
    return 0
  }

  if (options.command === 'status') {
    if (!current.exists) {
      write(output, `CreatorBerry is not configured for ${options.client}.`)
      return 1
    }
    write(output, `CreatorBerry is configured for ${options.client}.`)
    if (!current.matchesUrl) {
      write(output, `Warning: the existing "${options.name}" entry does not use ${options.url}.`)
    }
    const endpoint = await endpointStatus(options.url, fetchImpl)
    if (endpoint.reachable) {
      write(output, `MCP endpoint is reachable (HTTP ${endpoint.status}).`)
      if (endpoint.status === 401) write(output, 'HTTP 401 is expected because the reachability check does not send user credentials.')
    } else if (endpoint.reachable === false) {
      write(output, `MCP endpoint could not be reached: ${endpoint.error}.`)
      return 7
    }
    write(output, 'This command verifies configuration and reachability, not the user login.')
    return 0
  }

  if (!current.exists) {
    write(output, `CreatorBerry is not configured for ${options.client}. No changes made.`)
    return 0
  }
  const args = client.removeArgs(options)
  write(output, `Change: remove only the "${options.name}" MCP configuration from ${options.client}.`)
  write(output, `Command: ${commandPreview(client.command, args)}`)
  if (!options.yes && !await confirm('Continue?', { input, output })) {
    write(output, 'Cancelled. No changes made.')
    return 0
  }
  const result = runner.run(executable, args, { inherit: true })
  if (result.code !== 0) {
    write(errorOutput, `Removal failed. ${client.command} exited with code ${result.code}.`)
    return 5
  }
  const after = inspectConfiguration(runner, executable, client, options)
  if (after.exists) {
    write(errorOutput, 'The removal command finished, but the configuration still exists.')
    return 6
  }
  write(output, `CreatorBerry was removed from ${options.client}. Other MCP configurations were not touched.`)
  return 0
}

#!/usr/bin/env node

import { runCli } from '../src/cli.js'
import { createSystemRunner } from '../src/system-runner.js'

const exitCode = await runCli({
  argv: process.argv.slice(2),
  runner: createSystemRunner(),
  fetchImpl: globalThis.fetch,
  input: process.stdin,
  output: process.stdout,
  errorOutput: process.stderr,
})

process.exitCode = exitCode

# CreatorBerry MCP

Connect CreatorBerry to Claude Code or Codex through CreatorBerry's hosted MCP server.

## Start here

- [MCP overview](docs/mcp.md)
- [Claude Code and Codex setup](docs/setup.md)
- [Tool reference](docs/tools.md)

Give this repository to Claude Code or Codex:

```text
https://github.com/Creatorberry/creatorberry-mcp

Connect CreatorBerry using the instructions in this repository. Read docs/setup.md completely, show me every command before running it, wait for my approval, preserve my other MCP connections, and verify the connection before claiming success.
```

The recommended path uses the official command provided by Claude Code or Codex. The agent can prepare the command, but you review and approve it. You personally complete CreatorBerry sign-in and consent.

## Hosted MCP endpoint

```text
https://www.creatorberry.com/api/mcp
```

No CreatorBerry API key or `Authorization` header is required during setup. The client discovers CreatorBerry's OAuth flow from the endpoint and stores its own authentication securely.

## Optional CLI fallback

The dependency-free CLI is available for diagnostics, removal, or environments where the direct setup instructions cannot be used.

Claude Code:

```powershell
npx --yes github:Creatorberry/creatorberry-mcp install --client claude
```

Codex:

```powershell
npx --yes github:Creatorberry/creatorberry-mcp install --client codex
```

The installer shows the exact configuration change and asks for confirmation. Add the installer's `--yes` option only when you deliberately want to skip that confirmation.

### CLI commands

```powershell
# Preview without changing configuration
npx --yes github:Creatorberry/creatorberry-mcp install --client claude --dry-run

# Check configuration and endpoint reachability
npx --yes github:Creatorberry/creatorberry-mcp status --client claude

# Remove only the CreatorBerry entry
npx --yes github:Creatorberry/creatorberry-mcp remove --client claude
```

Replace `claude` with `codex` when using Codex.

## Safety

- The default MCP name is `creatorberry`.
- The CLI refuses to overwrite a different MCP entry with the same name.
- Production endpoints must use HTTPS.
- Plain HTTP is accepted only for `localhost`, `127.0.0.1`, or `::1` testing.
- Do not give an agent your CreatorBerry password, OAuth token, or browser session.

## Development

```powershell
git clone https://github.com/Creatorberry/creatorberry-mcp.git
cd creatorberry-mcp
npm test
npm run check
```

The CLI requires Node.js 18 or newer and has no runtime dependencies.

## License

MIT © 2026 Creatorberry. See [LICENSE](LICENSE).

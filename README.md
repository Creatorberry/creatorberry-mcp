# CreatorBerry MCP

Connect CreatorBerry to Claude Code or Codex. The recommended setup lets the AI client register the hosted MCP endpoint with its official command; a small dependency-free installer remains available as a fallback.

## Give CreatorBerry to your AI agent

Choose your client and give it the matching setup page:

- [Claude Code setup](docs/claude.md)
- [Codex setup](docs/codex.md)

Example request:

```text
Read this setup page completely and connect CreatorBerry. Show me every command before running it, wait for my approval, and do not claim success until the connection is verified.
```

The agent prepares the installation command inside Claude Code Desktop or Codex Desktop. You review it and click **Run** or approve it. You personally complete the browser login and consent screen.

## What it does

The CLI adds the hosted CreatorBerry MCP endpoint to your AI client. Your client owns the OAuth sign-in flow; this installer never asks for or stores your CreatorBerry password or OAuth tokens.

The only client configuration it manages is the MCP entry named `creatorberry` unless you deliberately provide another name with `--name`.

## Requirements

- Node.js 18 or newer
- Codex or Claude Code installed and available on `PATH`

## Optional npm installer

Use the npm installer for private development, diagnostics, removal, or when the direct client instructions cannot be used.

For Claude Code:

```powershell
npx --yes github:Creatorberry/creatorberry-mcp install --client claude
```

For Codex:

```powershell
npx --yes github:Creatorberry/creatorberry-mcp install --client codex
```

The installer shows the exact change and asks for confirmation. Add `--yes` only when you intentionally want a non-interactive installation.

After installation:

- Claude Code Desktop: approve `claude /mcp`, select **creatorberry** in the interactive MCP screen in the integrated PowerShell sidebar, and complete the browser login.
- Codex Desktop: approve `codex mcp login creatorberry` and complete the browser login.

Authenticate personally. The agent must not enter your credentials or approve access for you.

## Give the repository to an AI agent

You can give an agent this repository URL:

```text
https://github.com/Creatorberry/creatorberry-mcp
```

Example request:

```text
Connect CreatorBerry to Claude Code using the Claude setup page in this repository. Read it completely, show me every command before running it, wait for my approval, preserve my other MCP entries, and verify the connection before claiming success.
```

Choose the client explicitly with `--client claude` or `--client codex`.

### Instructions for AI agents

When a user gives you this repository and asks you to install CreatorBerry:

1. Read this README before changing configuration.
2. Confirm whether the target is Claude Code or Codex.
3. Open the matching client setup page in `docs/`.
4. Show the exact client command and ask for approval.
5. Preserve every unrelated MCP entry.
6. For Claude Code Desktop, run `claude /mcp` with approval and let the user select **creatorberry** in the integrated PowerShell sidebar.
7. For Codex, run `codex mcp login creatorberry` with approval.
8. Let the user complete OAuth personally, then verify the connection before claiming success.

## Commands

```powershell
# Preview installation without changing anything
npx --yes github:Creatorberry/creatorberry-mcp install --client claude --dry-run

# Check configuration and endpoint reachability
npx --yes github:Creatorberry/creatorberry-mcp status --client claude

# Remove only the CreatorBerry MCP entry
npx --yes github:Creatorberry/creatorberry-mcp remove --client claude
```

Replace `claude` with `codex` when using Codex.

### Options

| Option | Meaning |
|---|---|
| `--client <codex\|claude>` | Client to configure; currently required |
| `--url <url>` | MCP endpoint; defaults to `https://www.creatorberry.com/api/mcp` |
| `--name <name>` | Configuration name; defaults to `creatorberry` |
| `--scope <user\|local\|project>` | Claude Code scope; defaults to `user` |
| `--dry-run` | Show the command without looking up the client or changing configuration |
| `--yes`, `-y` | Skip the confirmation prompt |

Production URLs must use HTTPS. Plain HTTP is accepted only for `localhost`, `127.0.0.1`, and `::1` development endpoints.

## Local development

```powershell
git clone https://github.com/Creatorberry/creatorberry-mcp.git
cd creatorberry-mcp
npm test
npm run check
node bin/creatorberry.js install --client claude --dry-run
```

The CLI has no runtime dependencies.

## What status means

`status` verifies that the named MCP entry exists and checks whether the endpoint responds. It does not claim that the user is authenticated. An HTTP `401` can be a healthy OAuth challenge because the reachability check intentionally sends no credentials.

## Security

Please report security issues privately as described in [SECURITY.md](SECURITY.md). Do not place secrets, OAuth tokens, or private account information in a public issue.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT © 2026 Creatorberry. See [LICENSE](LICENSE).

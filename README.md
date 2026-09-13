# CreatorBerry MCP

Connect CreatorBerry to Codex or Claude Code with a small, dependency-free installer.

## What it does

The CLI adds the hosted CreatorBerry MCP endpoint to your AI client. Your client owns the OAuth sign-in flow; this installer never asks for or stores your CreatorBerry password or OAuth tokens.

The only client configuration it manages is the MCP entry named `creatorberry` unless you deliberately provide another name with `--name`.

## Requirements

- Node.js 18 or newer
- Codex or Claude Code installed and available on `PATH`

## Install directly from GitHub

For Claude Code:

```powershell
npx --yes github:Creatorberry/creatorberry-mcp install --client claude
```

For Codex:

```powershell
npx --yes github:Creatorberry/creatorberry-mcp install --client codex
```

The installer shows the exact change and asks for confirmation. Add `--yes` only when you intentionally want a non-interactive installation.

After installation, authenticate inside your client:

- Claude Code: run `/mcp`, select CreatorBerry, and choose **Authenticate**.
- Codex: open the CreatorBerry MCP entry and choose **Authenticate**. Codex may begin OAuth during installation.

## Give the repository to an AI agent

You can give an agent this repository URL:

```text
https://github.com/Creatorberry/creatorberry-mcp
```

Example request:

```text
Install the CreatorBerry MCP from this repository for Claude Code. Read the README first, show me the planned command, and ask before changing my MCP configuration.
```

Choose the client explicitly with `--client claude` or `--client codex`.

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

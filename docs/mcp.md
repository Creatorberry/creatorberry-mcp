# CreatorBerry MCP

CreatorBerry MCP lets Claude Code and Codex use CreatorBerry through natural-language requests.

## Endpoint

```text
https://www.creatorberry.com/api/mcp
```

The endpoint uses Streamable HTTP and browser-based OAuth. Claude Code or Codex registers the endpoint, discovers the authorization service, and opens the CreatorBerry sign-in flow. You choose the workspace and approve the requested permissions.

The setup does not require copying a CreatorBerry API key into the client.

## What it can do

The public MCP surface contains five tools:

- List videos from channels tracked by your workspace.
- Search the global CreatorBerry video database.
- Start or reuse a video analysis.
- Retrieve an analysis result.
- List your workspace's automation filters.

See the [tool reference](tools.md) for exact inputs and behaviour.

## Permissions

CreatorBerry requests separate permissions for:

- `creatorberry:read`: read videos, analysis results, and automation filters.
- `creatorberry:analyze`: start a video analysis that may use a credit.

The selected workspace is attached to the connection. CreatorBerry checks that the connected user still belongs to that workspace on every MCP request.

## Analysis credits

An analysis that is already unlocked for the selected workspace is reused without starting a new charge. A successful new workspace unlock costs one credit. Failed analysis does not complete the charge.

## First safe request

After connecting, ask:

```text
Use CreatorBerry to list my automation filters. Return only the filter names.
```

This calls the read-only `filters` tool and does not start an analysis.

## Next steps

- [Connect Claude Code or Codex](setup.md)
- [Read the five-tool reference](tools.md)

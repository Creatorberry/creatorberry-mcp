# Connect CreatorBerry

These instructions cover Claude Code and Codex. Both connect to the same hosted CreatorBerry MCP endpoint and use browser-based OAuth.

## Instructions for an AI agent

When a user asks you to connect CreatorBerry:

1. Determine whether you are configuring Claude Code or Codex.
2. Read only the matching client section below.
3. Show the exact command before running it and wait for approval.
4. Do not add an API key or `Authorization` header.
5. Preserve every unrelated MCP entry.
6. Let the user enter credentials, choose a workspace, and approve consent personally.
7. Verify the connection before claiming setup is complete.

## Claude Code

### 1. Register CreatorBerry

Show this command and wait for approval:

```powershell
claude mcp add --transport http --scope user creatorberry https://www.creatorberry.com/api/mcp
```

Run it only after approval. A successful command registers the hosted endpoint at user scope. It does not complete the interactive browser login.

### 2. Authenticate

Show this separate command and wait for approval:

```powershell
claude mcp login creatorberry
```

Run it in a terminal that can stay open during browser sign-in. The user completes CreatorBerry sign-in, workspace selection, and consent. If the command runner cannot keep the login process open, the user can use `/mcp` in an interactive Claude Code session, select **creatorberry**, and choose **Authenticate**. Do not direct the user to a separate PowerShell window by default.

Never enter credentials or approve access for the user.

### 3. Verify Claude Code

After the user finishes authentication, confirm that **creatorberry** is connected. If the new tools are not visible, start a fresh Claude Code session.

Then make this safe read-only request:

```text
Use CreatorBerry to list my automation filters. Return only the filter names.
```

Do not claim setup is complete unless the `creatorberry` server is connected and the request uses its `filters` tool.

## Codex

### 1. Register CreatorBerry

Show this command and wait for approval:

```powershell
codex mcp add creatorberry --url https://www.creatorberry.com/api/mcp
```

Run it only after approval.

### 2. Authenticate

Show this command and wait for approval:

```powershell
codex mcp login creatorberry
```

Let the user complete CreatorBerry sign-in, workspace selection, and consent in the browser. Never enter credentials or approve access for the user.

### 3. Verify Codex

Run:

```powershell
codex mcp list
```

Confirm that **creatorberry** is connected. If the new tools are not visible, start a fresh Codex task.

Then make this safe read-only request:

```text
Use CreatorBerry to list my automation filters. Return only the filter names.
```

Do not claim setup is complete unless the `creatorberry` server is connected and the request uses its `filters` tool.

## Troubleshooting

### Client command not found

Claude Code or Codex is not installed or is not available on `PATH`. Report the exact error. Do not edit a client configuration file directly without the user's approval.

### CreatorBerry already exists

Inspect the existing entry before changing anything. Do not overwrite an entry with a different URL. Preserve all other MCP servers.

### Authentication does not start

- Claude Code: run `claude mcp login creatorberry` in a terminal that can stay open during sign-in, or use `/mcp` in an interactive session.
- Codex: run `codex mcp login creatorberry`.

### Tools are missing after authentication

Start a fresh Claude Code session or Codex task so the client reloads the tool catalogue.

### Connection fails

Report the complete error, the configured MCP name, and the configured endpoint. Do not claim success based only on the add command.

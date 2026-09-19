# Connect CreatorBerry to Claude Code

CreatorBerry's hosted MCP endpoint is `https://www.creatorberry.com/api/mcp`.

Ask Claude Code to set it up from this page, or show the following command for approval and run it using Claude Code's command runner:

```powershell
claude mcp add --transport http --scope user creatorberry https://www.creatorberry.com/api/mcp
```

This registers the connection. It does not sign the user in.

Next, show this separate command for approval and run it in a terminal that can stay open during browser sign-in:

```powershell
claude mcp login creatorberry
```

The user signs in to CreatorBerry, chooses a workspace, and approves access in the browser. Do not enter credentials or approve consent on their behalf. If the command runner cannot keep the login process open, the user can use `/mcp` in an interactive Claude Code session, select **creatorberry**, and choose **Authenticate**. Do not tell the user to open a separate PowerShell window as the default path.

After sign-in, ask Claude Code:

```text
Use only the creatorberry MCP to list my automation filters. Return only the filter names.
```

Setup is complete only when the `filters` tool responds. If the connection was just added but its tools are not visible, start a fresh Claude Code session.

If a connection named `creatorberry` already exists, inspect it before changing anything. Preserve other MCP connections. Do not add an API key or an `Authorization` header.

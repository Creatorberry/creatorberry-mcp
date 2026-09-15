# Connect CreatorBerry to Codex

Give this page to Codex Desktop and ask it to set up CreatorBerry. Codex can prepare the commands in the task; review and approve them when prompted.

## Instructions for Codex

You are reading the official CreatorBerry MCP setup instructions for Codex. Follow every step below.

1. Use `https://www.creatorberry.com/api/mcp` as the MCP URL unless the user explicitly supplied a different CreatorBerry URL for testing.
2. Before changing anything, show the user the exact command you intend to run and ask for approval.
3. Register the server with:

   ```powershell
   codex mcp add creatorberry --url https://www.creatorberry.com/api/mcp
   ```

   If the user explicitly supplied a different test URL, replace only the URL. Do not add an API key or an `Authorization` header. Preserve every unrelated MCP entry.
4. After registration succeeds, prepare and run this command with the user's approval:

   ```powershell
   codex mcp login creatorberry
   ```

   Stop and let the user complete the browser sign-in and consent flow. Never enter credentials or approve access for the user.
5. After the user finishes signing in, verify the connection with:

   ```powershell
   codex mcp list
   ```

   Confirm that **creatorberry** is connected. If it is not connected, stop and report the exact failure. Do not claim setup is complete.
6. Start a fresh Codex task if the newly connected tools are not visible. Verify the connection with a safe, read-only request such as: `Use CreatorBerry to list my automation filters. Return only the filter names.`

## Local testing

For the approved local test environment, use this registration command instead:

```powershell
codex mcp add creatorberry --url http://localhost:3100/api/mcp
```

The CreatorBerry app must already be running on port 3100. Do not substitute the local URL unless the user explicitly asks for local testing.

## If registration fails

Report the complete command output. Do not remove or overwrite another MCP entry, and do not fall back to a direct configuration-file edit without the user's approval.

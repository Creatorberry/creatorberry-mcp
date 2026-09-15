# Connect CreatorBerry to Claude Code

Give this page to Claude Code Desktop and ask it to set up CreatorBerry. Claude can prepare the commands in its integrated PowerShell sidebar; review each command and click **Run** when you approve it.

## Instructions for Claude Code

You are reading the official CreatorBerry MCP setup instructions for Claude Code. Follow every step below.

1. Use `https://www.creatorberry.com/api/mcp` as the MCP URL unless the user explicitly supplied a different CreatorBerry URL for testing.
2. Before changing anything, show the user the exact command you intend to run and ask for approval.
3. Register the server with:

   ```powershell
   claude mcp add --transport http --scope user creatorberry https://www.creatorberry.com/api/mcp
   ```

   If the user explicitly supplied a different test URL, replace only the URL. Do not add an API key or an `Authorization` header. Preserve every unrelated MCP entry.
4. After registration succeeds, prepare and run this command with the user's approval:

   ```powershell
   claude /mcp
   ```

   In Claude Code Desktop, this opens the interactive MCP screen in the integrated terminal. Stop and let the user select **creatorberry** and complete the browser sign-in and consent flow. Never enter credentials or approve access for the user.
5. After the user finishes signing in, run `claude /mcp` again and confirm that **creatorberry** is connected. If it is not connected, stop and report the exact failure. Do not claim setup is complete.
6. Start a fresh Claude Code session if the newly connected tools are not visible. Verify the connection with a safe, read-only request such as: `Use CreatorBerry to list my automation filters. Return only the filter names.`

## Local testing

For the approved local test environment, use this registration command instead:

```powershell
claude mcp add --transport http --scope user creatorberry http://localhost:3100/api/mcp
```

The CreatorBerry app must already be running on port 3100. Do not substitute the local URL unless the user explicitly asks for local testing.

## If registration fails

Report the complete command output. Do not remove or overwrite another MCP entry, and do not fall back to a direct configuration-file edit without the user's approval.

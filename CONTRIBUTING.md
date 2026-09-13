# Contributing

Thanks for helping improve the CreatorBerry MCP installer.

## Before opening a pull request

1. Keep changes focused on the standalone installer.
2. Do not commit credentials, OAuth tokens, user data, or local client configuration.
3. Add or update tests for behavior changes.
4. Run:

```powershell
npm test
npm run check
npm pack --dry-run
```

## Safety expectations

- Preserve confirmation and dry-run behavior for configuration changes.
- Never overwrite an existing same-name MCP entry with different settings.
- Never store CreatorBerry passwords or OAuth tokens.
- Require HTTPS except for explicit loopback development URLs.

By contributing, you agree that your contribution is licensed under the repository's MIT License.

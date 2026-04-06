---
applyTo: "package.json,.codex/**/*.toml,.github/hooks/scripts/**/*.mjs,scripts/**/*.mjs"
---

# Starter TypeScript and script instructions

- Keep starter maintenance scripts dependency-light and runnable with plain Node.
- Prefer stable filesystem operations and explicit paths over clever abstractions.
- If install, doctor, or verify behavior changes, keep README install instructions aligned.
- Preserve compatibility with repo-local execution from `portable-codex-starter/`.

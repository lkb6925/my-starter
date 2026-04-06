---
applyTo: "AGENTS.md,docs/**/*.md,prompts/**/*.md,skills/**/*.md,templates/**/*.md"
---

# Guidance and prompt instructions

- `AGENTS.md` is the root operating contract. Role prompts and skills should narrow or operationalize that contract, not override it.
- Preserve OMX runtime markers and schema markers exactly when editing guidance files.
- Keep the canonical workflow vocabulary aligned across docs and prompts: `$deep-interview`, `$ralplan`, `$team`, and `$ralph`.
- When documentation claims a command or capability exists, verify the implementation in `src/cli/`, `src/hooks/`, `src/team/`, or the matching crate before finalizing the change.
- Avoid broad documentation churn for small implementation changes; update the most relevant user-facing file instead.

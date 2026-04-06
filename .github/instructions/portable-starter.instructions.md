---
applyTo: "portable-codex-starter/**"
---

# Portable starter instructions

- Treat `portable-codex-starter/` as the canonical repo-local pack for GitHub Codespaces + VS Code + Codex without the OMX launcher.
- Keep `portable-codex-starter/README.md` self-sufficient. A user should be able to understand install, copy targets, included assets, and risks from that file alone.
- `portable-codex-starter/scripts/generate-agents.mjs` is the source of truth for generated `.codex/agents/*.toml` files in the starter.
- `portable-codex-starter/scripts/install.mjs`, `doctor.mjs`, and `verify.mjs` should stay dependency-light and runnable with plain Node.
- If you change the starter's prompts, agent generation, install flow, or verification flow, verify from `portable-codex-starter/` with `npm run verify:kit`.

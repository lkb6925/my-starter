# Repository-wide Copilot instructions

This repository is `oh-my-codex` (OMX), a workflow and orchestration layer around OpenAI Codex CLI. Preserve Codex as the execution engine and OMX as the coordination layer.

## Ground work in repo contracts

- Read `AGENTS.md` before any non-trivial change. It is the primary operating contract for this repository.
- Treat `prompts/*.md`, `skills/*/SKILL.md`, and `templates/AGENTS.md` as steering surfaces. Do not casually rewrite them without checking the surrounding guidance and runtime assumptions.
- If you edit `AGENTS.md`, preserve all OMX runtime marker contracts exactly.

## Repo shape

- `src/` is the main TypeScript and Node.js implementation.
- `crates/` contains Rust helpers and native-side binaries.
- `docs/`, `prompts/`, `skills/`, and `templates/` are user-facing guidance assets and should stay aligned with implementation.
- `portable-codex-starter/` is the repo-local portable pack for GitHub Codespaces + VS Code + Codex without the OMX launcher.
- Shared portable `.devcontainer` and `.github` companion files are sourced from `portable-codex-starter/`; repo-specific root-level Copilot instructions and custom agents are overlays for this source repository itself.

## Build and verification expectations

- Use `npm`, not `pnpm` or `yarn`. The lockfile is `package-lock.json`.
- Node tests run against built output in `dist/`, so build before trusting Node test results.
- Prefer the smallest verification set that proves the change:
  - `npm run lint`
  - `npx tsc --noEmit`
  - `npm run check:no-unused`
  - `npm test`
  - `cargo fmt --all --check`
  - `cargo clippy --workspace --all-targets -- -D warnings`

## Change discipline

- Keep diffs narrow and reversible.
- Reuse existing helpers and patterns before creating new abstractions.
- Do not add dependencies unless the task clearly requires them.
- Preserve public CLI behavior and existing command names unless the task explicitly asks for a breaking change.
- Workflow, hook, and automation changes are security-sensitive. Default to least privilege and deterministic setup.

## Portable starter discipline

- If you change files under `portable-codex-starter/`, keep `portable-codex-starter/README.md` self-sufficient and current.
- When changing the portable starter's generated agents, install flow, or verification flow, verify from that directory with `npm run verify:kit`.

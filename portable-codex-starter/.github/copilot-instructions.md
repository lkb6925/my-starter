# Repository-wide Copilot instructions

This repository is using the Portable Codex Starter personal-use pack derived from `oh-my-codex`. Preserve Codex as the main execution engine and treat this repo as a repo-local agent workspace, not as a generic app project.

## Ground work in repo contracts

- Read `AGENTS.md` before any non-trivial change. It is the primary operating contract for the repository.
- Treat `.codex/agents/`, `.agents/skills/`, and `.github/` automation files as intentional steering layers, not as disposable scaffolding.
- If you edit `AGENTS.md`, preserve its structure and keep the instructions self-sufficient for future reuse.

## Repo shape

- `AGENTS.md` sets Codex behavior for the repository.
- `.codex/agents/` contains Codex-native specialist roles.
- `.agents/skills/` contains portable skill workflows.
- `.github/skills/` contains GitHub Copilot skill playbooks for repeated operational procedures.
- `.devcontainer/` configures GitHub Codespaces startup.
- `.github/copilot-instructions.md`, `.github/instructions/`, and `.github/agents/` shape GitHub Copilot behavior.
- `.github/hooks/` and `.github/workflows/copilot-setup-steps.yml` are automation-sensitive.

## Change discipline

- Keep changes narrow and reversible.
- Prefer existing patterns and repo-local assets over new dependencies.
- Workflow, hook, and environment files are security-sensitive; default to least privilege and deterministic behavior.
- If you change the starter pack behavior, keep `README.md` focused on quickstart and put longer operational detail in `docs/`.

## MCP routing contract

- Prefer the minimum number of MCPs needed for the task.
- Start with one primary MCP and add a second only when verification truly needs it.
- Prefer the GitHub plugin/connectors over a separate GitHub MCP for repository, PR, issue, and review work.
- Prefer local code and tests before MCP lookups when the answer should exist in the repo.

Default routing:
- OpenAI-specific docs -> `openaiDeveloperDocs`
- General framework or library docs -> `context7`
- API contract questions -> `OpenAPI`
- Database schema questions -> `Postgres MCP`
- UI runtime or browser issues -> `chrome_devtools`

Do not use:
- `context7` for OpenAI-specific docs if `openaiDeveloperDocs` is enough
- documentation MCPs to infer runtime behavior
- documentation MCPs to infer the real database schema
- `chrome_devtools` for documentation lookup

Database safety:
- Treat `Postgres MCP` as read-only by default.
- Prefer schema inspection over reading rows.
- Report code/schema mismatches explicitly.

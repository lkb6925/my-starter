# Portable Codex Starter

Portable Codex Starter is a repo-local kit extracted from `oh-my-codex` and rebuilt to work without the OMX CLI.

It is designed for the case where you can use Codex from an IDE or app, but you do not want a separate launcher like `omx`.

## What is included

- `AGENTS.md`
  A portable top-level operating contract for direct execution, planning, review, and native subagent delegation.
- `.codex/agents/*.toml`
  Ready-to-use custom agents generated from the prompt catalog in `prompts/`.
- `.agents/skills/*/SKILL.md`
  Portable skills adapted from OMX concepts without `omx`, `.omx/`, tmux, or OMX MCP assumptions.
- `.codex/config.toml`
  Safe local defaults only. No OMX hooks, no custom runtime dependencies.
- `.codex/config.toml.example`
  Optional config sample for target repositories.
- `prompts/*.md`
  Source prompt catalog carried over from OMX so the agent pack stays editable and regenerable.
- `scripts/generate-agents.mjs`
  Regenerates `.codex/agents` from the prompt sources after sanitizing OMX-only guidance.
- `scripts/install.mjs`
  Installs the starter into another repository root.

## What is intentionally not included

- `omx` launcher behavior
- tmux team runtime
- HUD / notification hooks
- OMX MCP servers
- `.omx/` runtime state and lifecycle overlays

Those pieces are powerful, but they depend on the OMX CLI or OMX-managed runtime files. This starter removes that dependency.

## How to use it in any repository

1. Copy the contents of this directory into the target repository root.
2. Keep these paths at the repository root:
   - `AGENTS.md`
   - `.codex/agents/`
   - `.agents/skills/`
   - `.codex/config.toml`
3. Start Codex in that repository.
4. Use the custom agents or skills directly.

Or install into another repository from this directory:

```bash
node scripts/install.mjs --target /path/to/your-project --with-config
```

Optional skill target:

```bash
node scripts/install.mjs --target /path/to/your-project --skills-root=.codex
node scripts/install.mjs --target /path/to/your-project --skills-root=both
```

Examples:

- `Use the planner agent to create an execution plan for this migration.`
- `Run the code-review skill on the current branch.`
- `Use deep-interview first, then hand off to the architect agent.`

## Regenerating custom agents

If you edit anything under `prompts/`, regenerate the installable agents:

```bash
npm run generate:agents
```

This writes refreshed TOML files under `.codex/agents/`.

## Included portable skills

- `help`
- `analyze`
- `deep-interview`
- `plan`
- `deepsearch`
- `build-fix`
- `tdd`
- `code-review`
- `security-review`
- `ai-slop-cleaner`
- `git-master`
- `frontend-ui-ux`
- `doctor`

## Portability rules

- Skills live under `.agents/skills/` because that is the safest portable Codex skill location.
- Custom agents live under `.codex/agents/`.
- The generated agents intentionally strip OMX-only references such as `omx`, `.omx`, tmux, and OMX-specific tool names.
- The prompt catalog is kept as source material, even when a given prompt originally contained OMX-only guidance. The generator sanitizes those parts for the final agent TOML output.

## Provenance

This starter was derived from `oh-my-codex`, but it is not a thin wrapper around OMX. It is a standalone, copyable asset pack built from the reusable parts of that repo.

See `docs/source-map.md` for the carry-over, adaptation, and exclusion decisions.

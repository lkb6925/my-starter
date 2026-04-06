# Portability Audit

This project was derived from `oh-my-codex` by separating portable Codex assets from OMX-only runtime components.

## Included Directly

- Role prompt content, copied into `prompt-sources/`
- Custom subagents generated into `.codex/agents/`
- Portable workflow skills under `.agents/skills/`
- A new project-level `AGENTS.md`
- A safe baseline `.codex/config.toml`

## Adapted

- OMX prompt content that referenced `.omx/`, `omx explore`, `omx sparkshell`, `ralph`, `ralplan`, or runtime overlays
- Skill selection, expanded to workflows that remain useful without OMX CLI
- Agent instructions, generated as plain Codex subagent TOML files without model pinning

## Excluded

- `src/cli/*`
- `src/team/*`
- `src/hooks/*`
- `src/runtime/*`
- `src/subagents/*`
- `src/hud/*`
- `src/notifications/*`
- `src/openclaw/*`
- `crates/*`
- setup / doctor / uninstall command paths
- OMX-managed config sections and notify hooks
- OMX-only MCP servers and runtime state files

## Main Portability Risks

- Skills in upstream OMX are managed under `.codex/skills`, while current Codex docs describe `.agents/skills` as the more portable custom-skills location.
- Some upstream prompts assume OMX workflow surfaces and required sanitization.
- Team runtime, HUD, hooks, and sidecars are intentionally absent from this kit.

## Portable Skill Set

Included:

- `ai-slop-cleaner`
- `analyze`
- `build-fix`
- `code-review`
- `deep-interview`
- `deepsearch`
- `doctor`
- `frontend-ui-ux`
- `git-master`
- `help`
- `plan`
- `security-review`
- `tdd`

Not installed by default, but preserved as names in `docs/sync-audit.json` for future adaptation:

- `autopilot`
- `cancel`
- `configure-notifications`
- `ecomode`
- `hud`
- `note`
- `omx-setup`
- `pipeline`
- `ralph`
- `ralph-init`
- `ralplan`
- `review`
- `skill`
- `swarm`
- `team`
- `trace`
- `ultraqa`
- `ultrawork`
- `visual-verdict`
- `web-clone`
- `worker`

## Regeneration

If you edit files under `prompt-sources/`, run:

```bash
node scripts/generate-agents.mjs
```

from inside `portable-codex-kit/` to rebuild `.codex/agents/`.

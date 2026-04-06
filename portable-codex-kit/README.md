# Portable Codex Kit

Portable Codex starter project derived from reusable instruction surfaces inside `oh-my-codex`, but intentionally stripped of OMX CLI, tmux, HUD, hook runtime, and sidecar dependencies.

This project is meant to be copied into any repository and used from Codex in VS Code or other Codex environments without installing `omx`.

## What You Get

- A portable top-level [AGENTS.md](/workspaces/oh-my-codex/portable-codex-kit/AGENTS.md)
- A safe baseline project config under [portable-codex-kit/.codex/config.toml](/workspaces/oh-my-codex/portable-codex-kit/.codex/config.toml)
- 32 prebuilt custom agents under [portable-codex-kit/.codex/agents](/workspaces/oh-my-codex/portable-codex-kit/.codex/agents)
- Portable workflow skills under [portable-codex-kit/.agents/skills](/workspaces/oh-my-codex/portable-codex-kit/.agents/skills)
- Source role prompts under [portable-codex-kit/prompt-sources](/workspaces/oh-my-codex/portable-codex-kit/prompt-sources)
- An upstream source audit under [portable-codex-kit/docs/sync-audit.json](/workspaces/oh-my-codex/portable-codex-kit/docs/sync-audit.json)
- Simple install and regeneration scripts under [portable-codex-kit/scripts](/workspaces/oh-my-codex/portable-codex-kit/scripts)

## What Is Deliberately Excluded

- `omx` CLI wrappers
- `tmux` team runtime
- HUD/statusline management
- OMX state in `.omx/`
- notify hooks and OpenClaw integration
- native Rust sidecars such as `omx-explore` and `omx-sparkshell`
- OMX-managed MCP server setup

Those features depend on the OMX runtime and are not portable by simple file copy.

## Quick Start

From inside this directory:

```bash
node scripts/install.mjs --target /path/to/your-project
```

This copies:

- `AGENTS.md` to the target project root
- `.codex/agents/*.toml` to the target project
- portable skills to `.agents/skills` by default
- optional config files when `--with-config` is used

Optional flags:

```bash
node scripts/install.mjs --target /path/to/project --skills-root=.codex
node scripts/install.mjs --target /path/to/project --skills-root=both
node scripts/install.mjs --target /path/to/project --with-config
```

## Included Skills

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

## Included Agents

- 32 prebuilt custom agents generated from the role prompt catalog
- `explore-harness` is intentionally excluded because it assumes OMX sidecar behavior rather than plain Codex custom-agent usage

## Regenerating From The Source Repo

This pack keeps copied prompt sources so it can stay self-contained, and it records the full upstream skill inventory in `docs/sync-audit.json`.

To refresh those sources from the current OMX repo and rebuild the custom agents:

```bash
npm run sync
npm run generate
```

## Notes

- Skills are installed to `.agents/skills` by default because that is the most conservative documented custom-skills location today.
- If your Codex environment prefers project-local `.codex/skills`, use `--skills-root=.codex` or `--skills-root=both`.
- Agent TOMLs intentionally omit hardcoded model names so the target environment can use its own default model configuration.

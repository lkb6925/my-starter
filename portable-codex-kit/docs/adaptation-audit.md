# Adaptation Audit

This kit is built from reusable surfaces in the parent OMX repository.

## Carried Over

- Role prompt content from `prompts/*.md`
- Core orchestration patterns from `templates/AGENTS.md`
- The idea of prompt-backed native agents from `src/agents/native-config.ts`
- Workflow skill concepts from `skills/*/SKILL.md`

## Adapted

- OMX-specific wording removed from the portable `AGENTS.md`
- Agent TOMLs generated without hardcoded model names
- Skills rewritten to avoid `omx` command dependencies
- Install flow reduced to plain file copy

## Excluded

- `src/cli/*`
- `src/team/*`
- `src/runtime/*`
- `src/hooks/*` runtime overlay machinery
- `.omx/` stateful workflows
- notify/HUD/OpenClaw integrations
- Rust sidecars under `crates/`

## Why

Those excluded parts depend on OMX CLI process control, tmux coordination, runtime state files, or setup-time config mutation. They are not portable by dropping files into an arbitrary repo.


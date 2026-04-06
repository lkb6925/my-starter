# Source Map

This file records what was taken from `oh-my-codex`, what was adapted, and what was deliberately excluded.

## Safe carry-over sources

- `prompts/*.md`
  Carried over as source material for custom agents.
- `docs/prompt-guidance-fragments/*.md`
  Used as guidance for concise, evidence-driven portable behavior.
- `docs/shared/agent-tiers.md`
  Used for portable role/tier reasoning.
- `src/agents/definitions.ts`
  Used as the role catalog reference.
- `templates/AGENTS.md`
  Used as the structural basis for the new portable `AGENTS.md`.

## Adapted for portability

- `AGENTS.md`
  Rewritten to remove OMX CLI, tmux, runtime overlays, `.omx/` state, and OMX-only workflow commands.
- `.codex/config.toml`
  Replaced OMX-managed config generation with safe portable defaults only.
- `.codex/agents/*.toml`
  Generated from the prompt catalog with OMX-only lines removed.
- `.agents/skills/*`
  Rewritten as portable skills that assume native Codex behavior, not the OMX runtime.

## Deliberately excluded

- `src/cli/**`
  OMX launcher, setup, doctor, resume, team, ralph, and runtime entrypoints depend on the `omx` command.
- `src/team/**`
  Team mode depends on tmux, shared state directories, and OMX-specific lifecycle rules.
- `src/hooks/**`
  Hook overlays and runtime injection depend on OMX-managed startup.
- `src/runtime/**`, `src/subagents/**`, `src/mcp/**`
  These are OMX runtime implementation details, not portable Codex assets.
- `crates/**`
  Native sidecars are OMX-specific.
- Notification and OpenClaw docs
  Useful operationally, but not part of a portable no-OMX starter.

## Key portability decisions

- Skills use `.agents/skills/`, not `.codex/skills/`.
- Custom agents use `.codex/agents/`.
- Prompt sources are preserved, but generated agent instructions are sanitized.
- The starter favors native Codex subagents and plain repository-local files over runtime state machines.

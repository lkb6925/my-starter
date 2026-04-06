# Portable Codex Starter

Portable Codex Starter is a self-contained personal-use starter pack for one very specific target:

- GitHub Codespaces
- VS Code
- the Codex experience you are already using inside that environment
- optional GitHub Copilot support layers in the same repo
- no separate `omx` launcher
- no tmux runtime
- no extra background process you need to keep alive

If your real goal is:

> make the Codex I use inside Codespaces behave better by default, with stronger agents, repo rules, Codespaces bootstrapping, and GitHub-side support

then this folder is the thing you copy.

This folder is the canonical deliverable inside the larger `oh-my-codex` source repo. If you only read one file, read this one.

Inside the `oh-my-codex` source repository, this folder is also the source of truth for the shared portable `.devcontainer` and `.github` companion layer. The source repo mirrors the shared subset back to its own root-level files.

## What This Actually Gives You

This starter is now self-contained. Everything needed for the portable personal-use pack lives inside `portable-codex-starter/`.

You get:

- a stronger repo-level `AGENTS.md`
- 29 reusable Codex custom agents under `.codex/agents/`
- 13 portable skills under `.agents/skills/`
- a minimal `.codex/config.toml`
- a packaged `.devcontainer/` layer for GitHub Codespaces
- a packaged `.github/` layer for GitHub Copilot instructions, custom agents, hooks, and cloud-agent setup
- source prompts and maintenance scripts so you can regenerate and verify the pack yourself

You are not installing OMX.
You are not getting tmux team mode.
You are not getting `.omx/` persistence.
You are not getting OMX sidecars or runtime overlays.

## The Exact Target

This setup is optimized for this flow:

1. You open a repository in GitHub Codespaces.
2. That opens VS Code in the browser or desktop app.
3. You use Codex inside that workspace.
4. You may also use GitHub Copilot Chat or GitHub Copilot agent features.
5. You want the repo itself to carry the behavior, instead of depending on a separate CLI wrapper.

That means every design choice here favors:

- repo-local files
- copy/paste portability
- personal use over shared runtime complexity
- strong defaults with low ceremony

## What You Copy

If you want the full personal starter in another repo, these are the important paths:

- `AGENTS.md`
- `.codex/agents/`
- `.agents/skills/`
- `.codex/config.toml`
- `.codex/config.toml.example`
- `.devcontainer/`
- `.github/copilot-instructions.md`
- `.github/instructions/`
- `.github/agents/`
- `.github/hooks/`
- `.github/workflows/copilot-setup-steps.yml`

Everything else exists to help you regenerate, inspect, verify, or maintain those shipped files.

## Fastest Install

From inside `portable-codex-starter/`:

```bash
node scripts/install.mjs --target /path/to/your-project --with-config
```

Then verify:

```bash
node scripts/doctor.mjs --target /path/to/your-project
```

That installs the full portable pack:

- Codex core
- Codespaces layer
- GitHub Copilot layer

If you want the old lightweight mode with only the Codex core:

```bash
node scripts/install.mjs --target /path/to/your-project --with-config --core-only
```

And verify only the core:

```bash
node scripts/doctor.mjs --target /path/to/your-project --core-only
```

If you want skills under `.codex/skills/` instead:

```bash
node scripts/install.mjs --target /path/to/your-project --skills-root=.codex --with-config
```

If you want both skill locations:

```bash
node scripts/install.mjs --target /path/to/your-project --skills-root=both --with-config
```

## What Each Layer Does

### `AGENTS.md`

This is the top-level operating contract for Codex in the target repo.

It pushes Codex toward:

- direct execution when scope is clear
- evidence-first analysis
- bounded native subagent delegation
- concise progress updates
- explicit verification before completion

### `.codex/agents/*.toml`

These are the custom Codex specialist roles.

Included set:

- `analyst`
- `api-reviewer`
- `architect`
- `build-fixer`
- `code-reviewer`
- `code-simplifier`
- `critic`
- `debugger`
- `dependency-expert`
- `designer`
- `executor`
- `explore`
- `git-master`
- `information-architect`
- `performance-reviewer`
- `planner`
- `product-analyst`
- `product-manager`
- `quality-reviewer`
- `quality-strategist`
- `researcher`
- `security-reviewer`
- `sisyphus-lite`
- `style-reviewer`
- `test-engineer`
- `ux-researcher`
- `verifier`
- `vision`
- `writer`

Excluded on purpose:

- `explore-harness`
- `qa-tester`
- `team-executor`
- `team-orchestrator`

Those four depend too much on OMX runtime or interactive assumptions to be strong portable defaults.

### `.agents/skills/*/SKILL.md`

These are lightweight reusable workflows that still make sense without OMX CLI.

Included portable skills:

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

### `.codex/config.toml`

This stays intentionally minimal:

- `model_reasoning_effort = "high"`
- `approval_policy = "on-request"`
- `sandbox_mode = "workspace-write"`

It does not assume OMX hooks, OMX runtime state, or custom MCP wiring.

### `.devcontainer/`

This is the Codespaces bootstrapping layer.

It currently:

- installs Node 20, Rust, and GitHub CLI
- recommends a few useful VS Code extensions
- suggests personal secrets such as `OPENAI_API_KEY` and `GH_TOKEN`
- opens the most relevant files on first Codespaces launch
- runs `.devcontainer/scripts/post-create.sh`

That post-create script currently:

- marks the repo as a safe Git directory
- runs `npm ci` when a `package-lock.json` exists
- runs `cargo fetch` when a `Cargo.toml` exists

### `.github/copilot-instructions.md`

This is the GitHub Copilot repo-wide instruction layer.

It tells Copilot to treat the repo as:

- a Codex-first agent workspace
- a repo where `AGENTS.md` is authoritative
- a repo where the starter's behavior should remain self-contained and portable

### `.github/instructions/*.instructions.md`

These are path-specific GitHub Copilot instructions.

Current set:

- `typescript.instructions.md`
- `rust.instructions.md`
- `automation.instructions.md`
- `guidance.instructions.md`
- `portable-starter.instructions.md`

This is where you stop Copilot from treating:

- maintenance scripts like random app code
- automation files like low-risk text
- guidance assets like ordinary markdown
- the starter itself like a normal application repo

### `.github/agents/*.agent.md`

These are GitHub Copilot custom agents.

Current set:

- `omx-planner`
- `omx-implementer`
- `omx-reviewer`
- `omx-automation-guardian`
- `omx-portable-pack-maintainer`

These do not replace the 29 Codex custom agents.

Think of it like this:

- `.codex/agents/` = Codex-native specialist roles
- `.github/agents/` = GitHub Copilot-native specialist roles

### `.github/hooks/*`

This is the lightweight GitHub Copilot hook policy layer.

Current behavior:

- logs agent and tool events into `.github/hooks/logs/`
- blocks clearly destructive shell commands such as `git reset --hard`
- stays local and dependency-light

This is intentionally conservative and intentionally small.

### `.github/workflows/copilot-setup-steps.yml`

This prepares GitHub Copilot cloud agent sessions by:

- checking out the repo
- installing Node 20
- installing JavaScript dependencies
- fetching Rust dependencies
- building TypeScript output

This is for GitHub Copilot cloud agent, not for Codex itself.

## How To Use This In Practice

The highest-efficiency mental model is:

- `AGENTS.md` controls the baseline behavior of Codex in the repo
- `.codex/agents/` gives Codex better specialist lanes
- `.agents/skills/` gives Codex repeatable workflows
- `.devcontainer/` makes Codespaces less fragile
- `.github/copilot-instructions.md` and `.github/instructions/` make GitHub Copilot less generic
- `.github/agents/` gives GitHub Copilot a few good role surfaces
- `.github/hooks/` adds minimal policy and audit control

In day-to-day use:

- use Codex for direct repo work, edits, tests, verification, and bounded subagent execution
- use chat for requirement shaping, tradeoff review, and final judgment calls
- use GitHub Copilot agent layers as an additional assistive surface, not as the only engine

## Why This Exists Instead Of Using OMX Directly

Because your target is not:

> learn another CLI and operate a separate runtime all day

Your target is:

> improve the Codex and Codespaces environment I already use by changing repo contents

OMX still has value, but much of that value comes from runtime features that do not transfer cleanly into plain repo files:

- launch wrapping
- tmux orchestration
- HUD and statusline behavior
- `.omx/` state persistence
- OMX runtime hooks
- OMX sidecars such as explore and sparkshell harnesses

This starter intentionally keeps the parts that survive simple copy into another repo.

## Repository Structure

This is the packaged structure that matters:

```text
portable-codex-starter/
  AGENTS.md
  README.md
  .codex/
    config.toml
    config.toml.example
    agents/*.toml
  .agents/
    skills/*/SKILL.md
  .devcontainer/
    devcontainer.json
    scripts/post-create.sh
  .github/
    copilot-instructions.md
    instructions/*.instructions.md
    agents/*.agent.md
    hooks/
      copilot-policy.json
      scripts/*.mjs
    workflows/copilot-setup-steps.yml
  prompts/*.md
  scripts/
    generate-agents.mjs
    install.mjs
    doctor.mjs
    verify.mjs
```

## Maintenance Workflow

If you edit the prompt catalog and want refreshed Codex agents:

```bash
npm run generate:agents
```

If you want to test that the full pack still installs cleanly:

```bash
npm run verify:kit
```

If you want to check a target repo after install:

```bash
node scripts/doctor.mjs --target /path/to/your-project
```

If you only want to validate the core Codex layer:

```bash
node scripts/doctor.mjs --target /path/to/your-project --core-only
```

If you are maintaining this starter inside the `oh-my-codex` source repository, the shared root-level companion files are mirrored from here with:

```bash
npm run sync:portable-layer
```

To check whether the root-level shared files have drifted:

```bash
npm run check:portable-layer
```

## Quality Rules Built Into This Pack

This pack is intentionally opinionated.

It pushes Codex toward:

- evidence before claims
- verification before “done”
- narrow diffs
- native subagents only when they are useful
- minimal runtime assumptions

It also avoids:

- hidden state machines
- launcher-only magic
- repository-external runtime requirements

## Risk Inventory

These are the real risks, not marketing caveats.

### 1. This is still not OMX

This pack does not recreate:

- tmux team runtime
- HUD
- notification routing
- `.omx/` persistence
- OMX MCP integration
- OMX sidecars such as explore and sparkshell harnesses

If you want those, this is the wrong product.

### 2. GitHub and Codespaces features can vary

The packaged `.github/` and `.devcontainer/` layer depends on GitHub Copilot and Codespaces features that may vary by:

- plan
- account entitlements
- repo settings
- web vs desktop client behavior

The files are valid, but some surfaces may not appear immediately in every environment.

### 3. Skill discovery path can vary

Some Codex environments may prefer `.agents/skills/`, while others may recognize `.codex/skills/`.

That is why `scripts/install.mjs` supports:

- `--skills-root=.agents`
- `--skills-root=.codex`
- `--skills-root=both`

Default is `.agents` because it is the safest portable choice for this use case.

### 4. Prompt sanitization is heuristic

The generated Codex custom agents come from OMX prompt sources with OMX-only references stripped out.

That means:

- most useful role behavior survives
- some wording may still reflect the original source style
- future upstream prompt changes may require revisiting the sanitizer

### 5. Codespaces first-start time will be slower

`.devcontainer/scripts/post-create.sh` does real setup work.

That improves readiness, but first Codespaces startup may be slower because it runs:

- `npm ci`
- `cargo fetch`

### 6. Hook policy is intentionally conservative

The GitHub hook policy currently blocks only obviously risky shell behavior.

That is enough to reduce accidental damage, but it is not a full DLP or enterprise policy system.

### 7. Repo-local config can still collide with an existing repo

If a target repo already has:

- its own `AGENTS.md`
- its own `.codex/config.toml`
- its own custom agents or skills
- its own `.github/copilot-instructions.md`
- its own `.github/instructions/`
- its own `.devcontainer/`

then merge intentionally instead of blind-copying.

### 8. Personal-use bias is deliberate

This pack is optimized for one person's Codespaces workflow, not a big shared team standard.

That means:

- defaults are assertive
- instructions assume autonomy
- you may still want to trim unused agents, skills, or GitHub layers

## What I Would Actually Recommend For Personal Use

For your exact use case:

1. Start with the full pack as-is.
2. Test it in one personal sandbox repo first.
3. Tighten `AGENTS.md` to your own style.
4. Delete any agents, skills, or hook rules you never use.
5. Use `--core-only` only when you intentionally do not want the GitHub and Codespaces layer.
6. Promote your best edits back into this starter.

That way this directory becomes your personal baseline for future repos.

## Provenance

This starter was derived from `oh-my-codex`, but it is not a thin wrapper around OMX. It is a standalone personal-use asset pack built from the reusable parts of that repo, with the Codespaces and GitHub layer packaged directly into the starter.

For the carry-over and exclusion decisions, see [docs/source-map.md](/workspaces/oh-my-codex/portable-codex-starter/docs/source-map.md).

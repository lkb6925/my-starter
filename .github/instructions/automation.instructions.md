---
applyTo: ".github/workflows/**/*.yml,.github/workflows/**/*.yaml,.github/hooks/**/*.json,.github/hooks/scripts/**/*.mjs,.devcontainer/**/*.json,.devcontainer/scripts/**/*.sh"
---

# Automation, hook, and environment instructions

- Treat these files as security-sensitive. Prefer least-privilege permissions, deterministic setup, and local-only logging.
- Keep hook commands fast and robust. GitHub documents that hooks block agent execution, so prefer lightweight checks and short timeouts.
- Do not introduce external network calls in hook scripts unless the task explicitly requires them.
- `copilot-setup-steps.yml` must keep a single job named `copilot-setup-steps`, and only supported job-level settings should be customized.
- `devcontainer.json` should optimize for repeatable Codespaces startup, not one-off machine-specific tweaks.
- Bash scripts in this layer should use `set -euo pipefail`.

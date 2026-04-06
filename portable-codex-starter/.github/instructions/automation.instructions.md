---
applyTo: ".github/workflows/**/*.yml,.github/workflows/**/*.yaml,.github/hooks/**/*.json,.github/hooks/scripts/**/*.mjs,.devcontainer/**/*.json,.devcontainer/scripts/**/*.sh"
---

# Automation, hook, and environment instructions

- Treat these files as security-sensitive. Prefer least-privilege permissions, deterministic setup, and local-only logging.
- Keep hook commands fast and robust. Hooks block agent execution, so prefer lightweight checks and short timeouts.
- Do not introduce external network calls in hook scripts unless explicitly required.
- `copilot-setup-steps.yml` must keep a single job named `copilot-setup-steps`.
- Bash scripts in this layer should use `set -euo pipefail`.

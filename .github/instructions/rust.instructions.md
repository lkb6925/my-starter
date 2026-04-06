---
applyTo: "Cargo.toml,Cargo.lock,crates/**/Cargo.toml,crates/**/*.rs"
---

# Rust instructions

- Keep Rust changes narrowly scoped to the relevant crate; avoid cross-crate churn unless the interface really changes.
- Preserve existing CLI and exit-code behavior for native binaries such as `omx-explore`, `omx-runtime`, and `omx-sparkshell`.
- Prefer small, testable modules over broad rewrites.
- Verify Rust changes with `cargo fmt --all --check` and `cargo clippy --workspace --all-targets -- -D warnings` when feasible.
- If a Rust change affects a TypeScript-facing contract, also inspect the matching Node entrypoint or bridge code in `src/`.

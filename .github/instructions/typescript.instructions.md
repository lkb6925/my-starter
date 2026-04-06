---
applyTo: "src/**/*.ts,src/**/*.d.ts,package.json,tsconfig.json,tsconfig.no-unused.json,biome.json"
---

# TypeScript and Node instructions

- Keep source files in `src/` as ESM TypeScript and follow the existing local-import style with `.js` suffixes.
- Prefer existing helpers in `src/utils/`, shared contracts in `src/team/`, `src/mcp/`, `src/hooks/`, and `src/verification/` before adding new modules.
- Put targeted tests in the nearest `__tests__` directory when behavior changes.
- Remember that most Node-side tests execute compiled files from `dist/`, so build first before evaluating test results.
- Preserve CLI entrypoint behavior under `src/cli/` and avoid silent changes to command names, flags, or help text.
- Keep runtime and guidance contracts stable when touching `src/hooks/`, `src/team/`, `src/ralph/`, or `src/ralplan/`.

---
name: senior-review
description: Run the Gemini senior review script, read the feedback, and fix the code directly. Repeat up to 2 times maximum before committing.
---

# Senior Review Protocol

You are the primary executor. You must fix the code yourself based on the senior architect's review. **Do NOT delegate this to a sub-agent or another codex command.**

## Workflow
1. **[Essential]** Run `git add .` to stage your changes before review.
2. Run Round 1: `bash scripts/get-senior-review.sh 1`.
3. If output contains `[SKIP] test (package.json script not found)`, stop immediately. You must set up a test runner (Vitest/Jest), add a `test` script, and create at least one sanity test before continuing. In CI/automation, configure tests as run-once mode (e.g., `vitest run`, `jest --passWithNoTests`) and never use watch mode.
4. Read `.tmp-gemini-review-round1.json` and run `node scripts/review-gate.mjs --file .tmp-gemini-review-round1.json`.
5. If the verdict is "pass", the review is complete. You may proceed.
6. If the verdict is "fail" and there are issues, **YOU** must directly modify the files to fix the reported issues.
7. After applying your fixes, run `git add .` again and then run Round 2: `bash scripts/get-senior-review.sh 2`.
8. Read `.tmp-gemini-review-round2.json` and run `node scripts/review-gate.mjs --file .tmp-gemini-review-round2.json --final`.
9. You **MUST STOP** after a maximum of 2 review rounds, even if minor issues remain. Do not loop a third time.
10. Hard gate: if any `severity="critical"` remains after Round 2, **DO NOT commit**.
11. Hard gate: if AGENTS.md violations or architectural inconsistency remain after Round 2, **DO NOT commit**.
12. Once the loop is complete and all gates pass, proceed to create your durable checkpoint or git commit.

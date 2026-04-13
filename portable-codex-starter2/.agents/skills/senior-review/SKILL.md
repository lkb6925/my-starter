---
name: senior-review
description: Run the Gemini senior review script, read the feedback, and fix the code directly. Repeat up to 2 times maximum before committing.
---

# Senior Review Protocol

You are the primary executor. You must fix the code yourself based on the senior architect's review. **Do NOT delegate this to a sub-agent or another codex command.**

## Workflow
1. Run: `bash scripts/get-senior-review.sh`
2. Read the generated `.tmp-gemini-review.json` file.
3. If the verdict is "pass", the review is complete. You may proceed.
4. If the verdict is "fail" and there are issues, **YOU** must directly modify the files to fix the reported issues.
5. After applying your fixes, run `bash scripts/get-senior-review.sh` a **second time** (Round 2).
6. Read the new `.tmp-gemini-review.json`. If issues remain, fix them one last time.
7. You **MUST STOP** after a maximum of 2 review rounds, even if minor issues remain. Do not loop a third time.
8. Once the loop is complete, proceed immediately to create your durable checkpoint or git commit.

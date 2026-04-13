#!/usr/bin/env bash
set -Eeuo pipefail

echo "[INFO] Running local checks..."
npm run lint || true
npm run typecheck || true
npm test || true

echo "[INFO] Requesting Gemini Senior Architect review..."
# 실행 결과를 .tmp-gemini-review.json 파일에 덮어씌웁니다.
node scripts/gemini-reviewer.mjs > .tmp-gemini-review.json

echo "[INFO] Review complete. Results saved to .tmp-gemini-review.json"
cat .tmp-gemini-review.json

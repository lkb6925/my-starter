#!/usr/bin/env bash
set -Eeuo pipefail

strict_checks="${STRICT_LOCAL_CHECKS:-0}"

run_check() {
  local label="$1"
  shift

  echo "[INFO] Running ${label}..."
  if "$@"; then
    echo "[PASS] ${label}"
    return 0
  fi

  echo "[FAIL] ${label}"
  return 1
}

echo "[INFO] Running local checks..."
lint_ok=0
if run_check "lint" npm run lint; then
  lint_ok=1
fi

typecheck_ok=0
if run_check "typecheck" npm run typecheck; then
  typecheck_ok=1
fi

test_ok=0
if run_check "test" npm test; then
  test_ok=1
fi

echo "[INFO] Local checks summary: lint=${lint_ok} typecheck=${typecheck_ok} test=${test_ok}"

if [[ "${strict_checks}" == "1" ]] && [[ ${lint_ok} -ne 1 || ${typecheck_ok} -ne 1 || ${test_ok} -ne 1 ]]; then
  echo "[ERROR] STRICT_LOCAL_CHECKS=1 and at least one local check failed."
  exit 1
fi

echo "[INFO] Requesting Gemini Senior Architect review..."
tmp_output=".tmp-gemini-review.json.tmp"
node scripts/gemini-reviewer.mjs > "${tmp_output}"
mv "${tmp_output}" .tmp-gemini-review.json

echo "[INFO] Review complete. Results saved to .tmp-gemini-review.json"
cat .tmp-gemini-review.json

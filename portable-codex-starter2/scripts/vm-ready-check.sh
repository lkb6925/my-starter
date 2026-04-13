#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

echo "[INFO] VM preflight started in ${ROOT_DIR}"

require_cmd() {
  local cmd="$1"
  if command -v "$cmd" >/dev/null 2>&1; then
    echo "[PASS] command available: ${cmd}"
    return 0
  fi
  echo "[FAIL] missing command: ${cmd}"
  return 1
}

status=0
require_cmd git || status=1
require_cmd node || status=1
require_cmd npm || status=1

if [[ -n "${GEMINI_API_KEY:-}" ]]; then
  echo "[PASS] GEMINI_API_KEY is set"
else
  echo "[FAIL] GEMINI_API_KEY is missing"
  status=1
fi

if grep -q "postgresql://readonly:change-me@localhost/app" .codex/config.toml; then
  echo "[FAIL] postgres DSN is still placeholder in .codex/config.toml"
  status=1
else
  echo "[PASS] postgres DSN placeholder replaced"
fi

echo "[INFO] Running kit doctor..."
node scripts/doctor.mjs --target "${ROOT_DIR}" || status=1

if [[ ${status} -ne 0 ]]; then
  echo "[ERROR] VM preflight failed. Fix the failing checks above."
  exit 1
fi

echo "[INFO] VM preflight passed. You can run: STRICT_LOCAL_CHECKS=1 bash scripts/get-senior-review.sh"

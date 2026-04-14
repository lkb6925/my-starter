#!/usr/bin/env bash
set -Eeuo pipefail

env_file="${ENV_FILE:-}"
if [[ -z "${env_file}" ]]; then
  if [[ -f ".env.local" ]]; then
    env_file=".env.local"
  elif [[ -f ".env" ]]; then
    env_file=".env"
  fi
fi

if [[ -n "${env_file}" ]]; then
  # shellcheck disable=SC1091
  set -a
  source "${env_file}"
  set +a
  echo "[INFO] Loaded environment file: ${env_file}" >&2
fi

postgres_mcp_dsn="${POSTGRES_MCP_DSN:-}"

if [[ -z "${postgres_mcp_dsn}" ]]; then
  echo "[ERROR] POSTGRES_MCP_DSN is not set." >&2
  echo "[HINT] Export POSTGRES_MCP_DSN, then retry." >&2
  exit 1
fi

exec npx -y @modelcontextprotocol/server-postgres "${postgres_mcp_dsn}"

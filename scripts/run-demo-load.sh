#!/usr/bin/env bash
set -Eeuo pipefail

script_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
project_dir="$(CDPATH= cd -- "${script_dir}/.." && pwd)"
base_compose="${project_dir}/docker-compose.yml"
observability_compose="${project_dir}/docker-compose.observability.yml"

if [[ -z "${POSTGRES_PASSWORD:-}" && ! -f "${project_dir}/.env" ]]; then
  export POSTGRES_PASSWORD="visa-seva-local-demo-only-change-me"
fi
export RPS="${RPS:-500}"
export DURATION="${DURATION:-2m}"
export PRE_ALLOCATED_VUS="${PRE_ALLOCATED_VUS:-300}"
export MAX_VUS="${MAX_VUS:-1000}"
export LOAD_TEST_ID="${LOAD_TEST_ID:-visa-seva-$(date +%Y%m%d-%H%M%S)}"
export SESSION_RATE_LIMIT_PER_SECOND="${SESSION_RATE_LIMIT_PER_SECOND:-1000}"
export STATUS_RATE_LIMIT_PER_SECOND="${STATUS_RATE_LIMIT_PER_SECOND:-1000}"

if [[ ! "${RPS}" =~ ^[1-9][0-9]*$ ]]; then
  echo "RPS must be a positive integer." >&2
  exit 2
fi
if [[ ! "${DURATION}" =~ ^[1-9][0-9]*(s|m|h)$ ]]; then
  echo "DURATION must look like 30s, 2m, or 1h." >&2
  exit 2
fi
if [[ ! "${PRE_ALLOCATED_VUS}" =~ ^[1-9][0-9]*$ ]] || [[ ! "${MAX_VUS}" =~ ^[1-9][0-9]*$ ]]; then
  echo "PRE_ALLOCATED_VUS and MAX_VUS must be positive integers." >&2
  exit 2
fi
if (( MAX_VUS < PRE_ALLOCATED_VUS )); then
  echo "MAX_VUS cannot be lower than PRE_ALLOCATED_VUS." >&2
  exit 2
fi

if ! curl --fail --silent "http://127.0.0.1:9091/-/ready" >/dev/null; then
  echo "The observability stack is not ready. Run npm run demo:up first." >&2
  exit 1
fi

printf 'Starting %s at %s requests/sec for %s.\n' "${LOAD_TEST_ID}" "${RPS}" "${DURATION}"
printf 'Keep Grafana visible at http://127.0.0.1:3300/d/visa-seva-load-demo\n\n'

docker compose \
  --project-directory "${project_dir}" \
  -f "${base_compose}" \
  -f "${observability_compose}" \
  --profile load run --rm k6

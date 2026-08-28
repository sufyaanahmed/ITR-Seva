#!/usr/bin/env bash
set -Eeuo pipefail

script_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
project_dir="$(CDPATH= cd -- "${script_dir}/.." && pwd)"
base_compose="${project_dir}/docker-compose.yml"
observability_compose="${project_dir}/docker-compose.observability.yml"

if [[ -z "${POSTGRES_PASSWORD:-}" && ! -f "${project_dir}/.env" ]]; then
  export POSTGRES_PASSWORD="visa-seva-local-demo-only-change-me"
fi
# The benchmark runs only on the private Docker network. A higher session ramp
# ceiling prevents virtual-user initialization from distorting the demo.
export SESSION_RATE_LIMIT_PER_SECOND="${SESSION_RATE_LIMIT_PER_SECOND:-1000}"
export STATUS_RATE_LIMIT_PER_SECOND="${STATUS_RATE_LIMIT_PER_SECOND:-1000}"

compose() {
  docker compose --project-directory "${project_dir}" -f "${base_compose}" -f "${observability_compose}" "$@"
}

wait_for_url() {
  local name="$1"
  local url="$2"
  local attempts=0
  until curl --fail --silent --show-error "${url}" >/dev/null 2>&1; do
    attempts=$((attempts + 1))
    if (( attempts >= 90 )); then
      echo "Timed out waiting for ${name} at ${url}." >&2
      compose ps
      return 1
    fi
    sleep 1
  done
}

show_urls() {
  printf '\nVisa Seva UI:  http://127.0.0.1:8080\n'
  printf 'Grafana:       http://127.0.0.1:3300/d/visa-seva-load-demo\n'
  printf 'Prometheus:    http://127.0.0.1:9091/targets\n\n'
}

action="${1:-up}"
case "${action}" in
  up)
    docker info >/dev/null
    compose up -d --build web postgres-exporter prometheus grafana
    wait_for_url "Visa Seva" "http://127.0.0.1:8080/"
    wait_for_url "Grafana" "http://127.0.0.1:3300/api/health"
    wait_for_url "Prometheus" "http://127.0.0.1:9091/-/ready"
    compose ps
    show_urls
    echo "Start the local workload in another terminal with: npm run demo:load"
    ;;
  open)
    wait_for_url "Visa Seva" "http://127.0.0.1:8080/"
    wait_for_url "Grafana" "http://127.0.0.1:3300/api/health"
    if command -v open >/dev/null 2>&1; then
      open "http://127.0.0.1:8080/"
      open "http://127.0.0.1:3300/d/visa-seva-load-demo?refresh=2s&from=now-5m&to=now"
    else
      show_urls
    fi
    ;;
  status)
    compose ps
    show_urls
    ;;
  logs)
    compose logs --tail=200 -f api postgres postgres-exporter prometheus grafana web
    ;;
  down)
    compose down
    ;;
  reset)
    if [[ "${CONFIRM_RESET:-}" != "yes" ]]; then
      echo "This deletes the local demo database and dashboard history." >&2
      echo "Run CONFIRM_RESET=yes $0 reset if that is intentional." >&2
      exit 2
    fi
    compose down --volumes
    ;;
  *)
    echo "Usage: $0 {up|open|status|logs|down|reset}" >&2
    exit 2
    ;;
esac

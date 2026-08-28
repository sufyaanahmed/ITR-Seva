# Visa Seva self-hosted backend

This directory contains the implemented Rust/PostgreSQL backend for the independent Visa Journey Lab. It is a synthetic-data showcase, not a Government of India system and not a production visa-processing service.

## What is implemented

- Axum/Tokio HTTP service compiled as a native ARM64 container.
- PostgreSQL schema and startup migrations through SQLx.
- Opaque, expiring demo sessions; only SHA-256 token hashes are stored.
- Synthetic-only application creation (`demo_only=true`).
- Ownership checks on every application operation.
- Optimistic version checks for draft updates.
- Validated document metadata; document bytes are not stored.
- Atomic, idempotent final submission with a PostgreSQL advisory lock.
- Status history, audit events, and a transactional outbox.
- A bounded `FOR UPDATE SKIP LOCKED` outbox worker.
- A 32-connection database pool with acquire, statement, lock, transaction, and request timeouts.
- Hard request-body, in-flight request, rate-limit-map, and session-cache bounds.
- General, session-creation, and status-route rate limits.
- Structured JSON logs, request IDs, Prometheus metrics, liveness, and database readiness.
- Graceful SIGINT/SIGTERM draining.
- Public API and operator endpoints on separate listeners.

## API surface

| Method | Path | Authentication | Purpose |
| --- | --- | --- | --- |
| GET | `/api/v1/reference/visa-categories` | Public | Cacheable reviewed reference metadata |
| POST | `/api/v1/sessions` | Public, rate limited | Create an expiring opaque demo session |
| POST | `/api/v1/applications` | Bearer token | Create a synthetic draft |
| GET | `/api/v1/applications/{id}` | Bearer token + ownership | Read a draft/application |
| PATCH | `/api/v1/applications/{id}` | Bearer token + ownership + version | Replace a synthetic draft safely |
| PUT | `/api/v1/applications/{id}/documents` | Bearer token + ownership | Upsert validated document metadata |
| POST | `/api/v1/applications/{id}/submit` | Bearer token + `Idempotency-Key` | Atomically submit a draft |
| GET | `/api/v1/applications/{id}/status` | Bearer token + ownership | Read status and history |

Operator-only routes listen on port `9090`: `/internal/live`, `/internal/ready`, and `/internal/metrics`. Caddy blocks `/internal`, `/metrics`, `/admin`, and similar paths on the public port.

## Run locally

Create a local environment file without committing it:

```sh
cp .env.example .env
# Replace POSTGRES_PASSWORD in .env with a long random local value.
docker compose up -d --build
```

Check correctness:

```sh
curl --fail http://127.0.0.1:9090/internal/ready
npm run backend:smoke
npm run backend:abuse-smoke
npm test
npm run build
caddy validate --config Caddyfile
```

Run Caddy from the repository root after building the frontend. Point ngrok only at Caddy on `localhost:8080`; do not expose PostgreSQL, port `3000`, or port `9090` through the tunnel.

Stop the stack without deleting the PostgreSQL volume:

```sh
docker compose down
```

Use `docker compose down -v` only when intentionally deleting all local showcase records.

## Load testing

The mixed scenario uses approximately 50% reference reads, 25% status reads, 15% draft updates, 5% draft reads, and 5% atomic submissions. Every successful submission creates a replacement draft so writes continue throughout the run.

```sh
docker run --rm \
  -e API_URL=http://host.docker.internal:3000/api/v1 \
  -e RPS=500 -e DURATION=2m \
  -e PRE_ALLOCATED_VUS=300 -e MAX_VUS=600 \
  -v "$PWD/load-tests:/scripts:ro" \
  grafana/k6:0.54.0 run /scripts/mixed-workload.js
```

For a large synthetic session ramp, temporarily raise `SESSION_RATE_LIMIT_PER_SECOND` for the private benchmark process. The checked-in operational default remains 100 creations per second per peer. Never route benchmark traffic through ngrok.

## Important limitations

- The benchmark uses small synthetic JSON records and metadata, not real documents or external payment/identity services.
- The outbox worker acknowledges showcase events; no email, payment, or Government integration is performed.
- A short local benchmark is evidence for that exact workload and machine, not proof of unlimited capacity or production readiness.
- A real public service still requires independent security review, secrets management, backups/restore drills, disaster recovery, privacy/legal review, WAF/DDoS protection, and multi-host failure testing.

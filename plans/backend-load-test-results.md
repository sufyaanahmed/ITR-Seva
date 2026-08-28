# Rust/PostgreSQL backend benchmark — 28 August 2026

## Outcome

The implemented dynamic backend completed both the planned sustained target and short spike with no failed HTTP requests in the measured runs.

| Workload | Duration | Scheduled mixed iterations | Total HTTP requests | Failed HTTP requests | p95 HTTP latency | Maximum HTTP latency |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Sustained target | 30 seconds | 15,001 at 500 RPS | 16,319 | 0 | 1.73 ms | 22.54 ms |
| Short spike | 15 seconds | 30,002 at 2,000 RPS | 32,684 | 0 | 2.17 ms | 28.10 ms |

The extra HTTP requests are session creation, initial draft creation, and replacement-draft creation after submissions. The k6 checks validated response status rather than merely opening connections.

Across the final smoke and two measured profiles, the API reported 6,750 successful optimistic draft updates and 2,201 committed submissions, with zero overload or rate-limit rejections. After the worker caught up, PostgreSQL reported zero pending outbox events. The outbox processed counter also included retained records from earlier development runs on the same local volume, so it is not used as a benchmark-operation count.

## System under test

- Apple Silicon MacBook Air with 16 GB RAM (the showcase host specified for the project).
- Rust 1.89 release build in a container.
- Axum/Tokio API with a maximum of 512 in-flight requests.
- PostgreSQL 17.6 with 32 API pool connections.
- PostgreSQL container capped at 2 CPUs / 2 GB RAM.
- API container capped at 4 CPUs / 1 GB RAM.
- k6 0.54.0 in a separate local container.
- Traffic sent directly to `127.0.0.1:3000` through Docker host networking; ngrok and Caddy were not in the benchmark path.

The final benchmark profile temporarily allowed 2,000 session creations per second so k6 could initialize synthetic actors. The checked-in self-hosted default is 100 session creations per second per peer. Status lookups remain limited to 30 per second per authenticated session, while the general ceiling is 2,000 requests per second per key.

## Workload

Each scheduled iteration randomly chose:

- 50% cacheable reference metadata reads.
- 25% authenticated application-status/history reads.
- 15% optimistic-versioned PostgreSQL draft updates.
- 5% authenticated draft reads.
- 5% transactional submissions followed by replacement draft creation.

Submission is the expensive path: it takes an idempotency advisory lock, locks the application row, updates the application, writes status history, an outbox event, an audit event, and the idempotency response in one transaction.

## Correctness checks performed separately

The repeatable smoke script verified:

1. Session issuance and opaque token format.
2. Synthetic draft creation.
3. Successful optimistic-version update.
4. Rejection of a stale update with HTTP 409.
5. Atomic final submission.
6. Replay of the same idempotency key with the exact original response.
7. Ordered `DRAFT` → `SUBMITTED` status history.

Rust unit tests also verify the synthetic-only boundary, document metadata rules, stable token hashing, and that rate-limit keys do not contain bearer tokens.

The abuse-control smoke test additionally verified HTTP 401 for an unauthenticated write, HTTP 422 for a non-synthetic record, HTTP 413 for an oversized body, public isolation of the operator metrics route, and HTTP 429 during a session-creation burst. Changing `X-Forwarded-For` on each request did not bypass the socket-peer rate limit.

## Interpretation

These results address the earlier static-only benchmark: the measured traffic now includes authenticated Rust handlers and substantial PostgreSQL reads/writes. For this deliberately small synthetic workload, the database was not the bottleneck at the project targets.

This is still not evidence that one laptop can operate a national production visa system. The run was short, local, used small payloads, avoided external dependencies, and did not test hardware failure or Internet-scale attacks. Before making a broader capacity claim, run the one-hour peak test, two-hour soak, recovery tests, backup/restore drills, and a separately reviewed security test described in `plans/backend-capacity-plan.md`.

## Reproduction

Start the stack and validate it:

```sh
docker compose up -d --build
npm run backend:smoke
```

Then run:

```sh
docker run --rm \
  -e API_URL=http://host.docker.internal:3000/api/v1 \
  -e RPS=500 -e DURATION=30s \
  -e PRE_ALLOCATED_VUS=300 -e MAX_VUS=600 \
  -v "$PWD/load-tests:/scripts:ro" \
  grafana/k6:0.54.0 run /scripts/mixed-workload.js
```

Change `RPS=2000`, `DURATION=15s`, `PRE_ALLOCATED_VUS=600`, and `MAX_VUS=1200` for the short spike used here.

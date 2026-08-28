# Visa Seva Backend Capacity and Robustness Plan

> Implementation status (28 August 2026): the initial Rust/PostgreSQL modular monolith, frontend submission integration, Docker stack, correctness/abuse smoke tests, and mixed k6 workload are implemented. See `backend/README.md` and `plans/backend-load-test-results.md` for operation and measured results. The one-hour, soak, recovery, backup/restore, and independent security-review stages remain future validation work.

## Objective

Build a modern, self-hosted visa portal that:

- Supports approximately 50% of the estimated peak Indian e-Visa traffic.
- Remains responsive during realistic mixed traffic and sudden bursts.
- Protects the database and preserves accepted work when demand exceeds capacity.
- Runs on a 16 GB Apple Silicon MacBook Air.
- Exposes the user-facing portal through ngrok while sending benchmark traffic directly to the local backend.
- Combines an attractive interface with a lightweight browser payload.
- Produces transparent, repeatable benchmark results rather than an unsupported concurrency claim.

The system is not intended to prove that every Indian government website has inadequate infrastructure. It demonstrates that good public-service software requires capacity planning, backpressure, observability, database discipline, and graceful degradation in addition to good UI and UX.

## Traffic Assumptions

The planning figures supplied for a peak travel month are approximately:

- 15,000 successful e-Visa grants per day.
- 30,000 or more people attempting to apply per day.
- 100,000–150,000 site visits per day.
- Approximately 3 million visits per month.
- Approximately 1.2 million monthly unique users.

The initial system target is approximately 50% of that peak traffic:

| Measure | Target capacity |
| --- | ---: |
| Site visits | 50,000–75,000 per day |
| Application attempts | 15,000 per day |
| Successful submissions/grants | 7,500 per day |
| Monthly visits | 1.5 million |
| Monthly unique users | 600,000 |
| Active user sessions | 2,500 |
| Sustained mixed API traffic | 500 requests/second |
| Short traffic spike | 2,000 requests/second |
| Database write-heavy test | 100 writes/second |
| Final-submission spike | 25 submissions/second |

These API targets provide substantial headroom over the estimated human traffic.

## Concurrency Model

Concurrency is derived from visits rather than treating daily visitors as simultaneous users. Assuming 75,000 visits during a peak day, 15% of traffic during the busiest hour, and a ten-minute active session:

```text
75,000 × 15% = 11,250 visits in the busiest hour
11,250 / 3,600 = 3.125 new sessions per second
3.125 × 600 seconds = 1,875 active sessions
```

The design target is rounded up to 2,500 active sessions. At 20–30 API operations per visit, the calculated busiest-hour demand is approximately 60–95 API requests/second. The 500 RPS sustained target provides roughly five to eight times the estimated demand, while the 2,000 RPS spike test validates burst protection.

## Architecture

```text
Public browser
      │
    ngrok
      │
    Caddy
      ├── Optimized React application
      └── /api → Rust/Axum API
                         │
                         ├── PostgreSQL
                         ├── in-process reference cache
                         ├── bounded background worker
                         └── metrics and structured logs

Local k6 generator ─────► Rust API directly
Prometheus/Grafana ◄───── API, host, and database metrics
```

### Technology choices

- Frontend: the existing React and Vite application.
- Backend: Rust with Axum, Tokio, Tower, Serde, and SQLx.
- Database: PostgreSQL.
- Proxy and static serving: Caddy.
- Load testing: k6 for realistic workflows and controlled arrival-rate tests.
- Observability: Prometheus metrics, Grafana dashboards, and structured tracing.
- Runtime: native ARM backend and PostgreSQL processes on the Mac where practical.
- Public exposure: ngrok points to Caddy; benchmark traffic bypasses ngrok and calls the local API directly.

The backend remains a modular monolith. Microservices and Redis are unnecessary for the initial single-machine target and would introduce additional memory consumption and failure modes. Interfaces should still allow an external cache or multiple API instances later.

## Backend Scope

The initial API supports:

- Visa reference, eligibility, and category information.
- Creating, retrieving, and updating application drafts.
- Final application submission.
- Application status and status-history retrieval.
- Synthetic document metadata and uploads used by the demo.
- Authenticated demo sessions.
- Liveness, readiness, and local-only metrics endpoints.

Important behavior includes:

- Optimistic versioning for concurrent draft updates.
- Idempotency keys for final submission.
- Atomic creation of submissions and background-work records.
- Bounded asynchronous processing for secondary work.
- Explicit retryable and non-retryable API errors.
- Graceful shutdown that protects in-flight accepted work.
- Controlled `429 Too Many Requests` or `503 Service Unavailable` responses during saturation.

## Database Plan

PostgreSQL is treated as a finite resource and protected by the API:

- Begin with a 24–32 connection pool and tune it from measurements.
- Bound the number of requests waiting for a database connection.
- Validate and reject invalid work before acquiring a database connection.
- Keep transactions short and perform no external network work inside them.
- Use prepared, parameterized queries.
- Index application references, ownership fields, status fields, and relevant timestamps.
- Use time-ordered identifiers to preserve index locality.
- Debounce or batch draft autosaves rather than writing on every keystroke.
- Use optimistic version numbers to prevent lost draft updates.
- Apply idempotency to final submissions and other retry-sensitive operations.
- Commit background work through a transactional outbox.
- Store document bodies outside PostgreSQL and retain only metadata in the database.
- Apply query, transaction, pool-wait, and request timeouts.
- Monitor query latency, pool saturation, lock waits, WAL activity, and disk latency.

Initial logical tables:

- `users`
- `sessions`
- `applications`
- `application_drafts`
- `application_status_history`
- `documents`
- `idempotency_records`
- `outbox_events`
- `audit_events`

The API must shed excess load rather than allow an unbounded queue to exhaust memory. A robust backend does not accept infinite work; it preserves accepted work, communicates overload clearly, and recovers rapidly.

## Security Requirements

- Strict request schemas and server-side validation.
- Maximum request, field, and upload sizes.
- Secure session cookies or short-lived access tokens.
- Modern password hashing if password authentication is included.
- Per-route, per-session, and per-IP rate limits.
- Strict CORS rules and secure response headers.
- CSRF protection for cookie-authenticated mutations.
- No secrets, access tokens, or personally identifiable information in logs.
- Synthetic applicant data only during the showcase.
- Status-lookup controls that discourage reference enumeration.
- Forwarded-IP headers trusted only on the known proxy path.
- Dependency, license, and vulnerability checks in CI.
- Public, authenticated, and operator endpoints separated explicitly.
- Metrics and administrative endpoints unavailable through ngrok.
- Audit events for sensitive state changes.
- Graceful shutdown and database migration checks.

The project threat model covers brute-force status lookups, oversized payloads, duplicate submissions, malformed input, resource exhaustion, slow clients, unauthorized data access, SQL injection attempts, and abuse of file uploads.

## Lightweight Frontend Plan

The current project includes several large decorative images, so media optimization is part of the performance work.

- Generate responsive AVIF/WebP variants at appropriate dimensions.
- Lazy-load decorative and below-the-fold media.
- Use route-level code splitting.
- Serve hashed assets with immutable cache headers.
- Enable Brotli or gzip compression.
- Avoid continuous status polling.
- Cancel obsolete requests when users navigate or change steps.
- Debounce autosave requests.
- Use ETags and browser caching for reference information.
- Provide clear saved, loading, retry, offline, conflict, and overload states.
- Preserve keyboard navigation, accessible form semantics, and reduced-motion support.

Provisional frontend budgets:

- Initial JavaScript below approximately 250 KB compressed.
- Critical CSS below approximately 50 KB compressed.
- Initial mobile page media below approximately 500 KB.
- No large decorative image downloaded before it is needed.

The budgets will be finalized after measuring the current production build.

## Workload Composition

The principal mixed workload begins with:

| Operation | Share at 500 RPS | Approximate rate |
| --- | ---: | ---: |
| Visa/reference information | 50% | 250 RPS |
| Application status lookups | 25% | 125 RPS |
| Draft reads and updates | 15% | 75 RPS |
| Session and authentication operations | 5% | 25 RPS |
| Final submissions | 5% | 25 RPS |

This is deliberately heavier than the estimated real traffic, particularly on the durable-write path. Dedicated read-only, cache-bypass, write-heavy, and submission tests prevent a cached endpoint from hiding database weaknesses.

## Benchmark Suite

### 1. Smoke test

Validate correctness and instrumentation at low traffic before any stress test.

### 2. Realistic peak-hour test

- Ramp from 100 to 2,500 active virtual users.
- Include realistic pauses between actions.
- Generate up to 500 mixed RPS.
- Sustain the target for one hour.
- Keep a human browser journey active through ngrok during the test.

### 3. Full-traffic simulation

- Complete at least 75,000 user journeys.
- Generate approximately 1.5–2.25 million API operations.
- Validate response bodies and state transitions, not only HTTP status codes.

### 4. Spike test

- Jump from normal traffic to 2,000 RPS.
- Hold for 60–120 seconds.
- Verify bounded memory, bounded queues, and deliberate overload responses.

### 5. Database stress test

- Bypass reference caching where appropriate.
- Generate at least 100 database writes per second.
- Exercise draft conflicts, idempotency, pool saturation, and timeouts.

### 6. Soak test

- Run 250–500 RPS for at least two hours.
- Detect memory leaks, connection leaks, table growth, and thermal throttling.

### 7. Breakpoint test

- Increase throughput until the service objectives fail.
- Record the measured sustainable limit and failure behavior.
- Treat capacity above 1,000 mixed RPS as a desired outcome, not a claim made before measurement.

### 8. Security and abuse test

- Oversized bodies and uploads.
- Invalid, revoked, and expired sessions.
- Repeated status-reference guesses.
- Duplicate idempotency keys and submissions.
- Malformed JSON and invalid encodings.
- Slow request bodies and abandoned connections.
- Rate-limit and forwarded-header manipulation attempts.

### 9. Recovery test

- Remove the overload and verify latency returns to normal.
- Confirm no duplicate or partially committed submissions.
- Restart the API gracefully and verify readiness behavior.
- Simulate database unavailability and verify safe `503` responses.

## Acceptance Criteria

At the declared supported load:

- Sustain 2,500 realistically paced active users.
- Sustain 500 mixed API RPS.
- Keep unexpected errors below 0.1%.
- Keep read latency below 150 ms at p95 and 300 ms at p99 locally.
- Keep durable-write latency below 300 ms at p95 and 600 ms at p99 locally.
- Produce no duplicate final submissions.
- Maintain bounded database, worker, and request queues.
- Maintain stable memory during the soak test.
- Avoid backend crashes during overload.
- Return deliberate `429` or `503` responses for rejected excess traffic.
- Return to normal latency within ten seconds after an overload spike ends.
- Keep the browser application usable through ngrok while local load is active.

Ngrok latency is reported separately because it includes tunnel and public-network overhead. If the load generator shares the Mac with the system under test, benchmark reports must state that the result measures the combined resource usage of both components.

## Observability and Evidence

The live dashboard and benchmark report include:

- Requests per second and active requests.
- p50, p95, and p99 latency by route and operation class.
- Successful, rejected, and unexpected-error rates.
- Database pool use and pool wait time.
- Query latency and slow-query counts.
- Worker queue depth and job latency.
- Process and host CPU, memory, disk, and network usage.
- PostgreSQL sessions, locks, WAL activity, and disk latency.
- Cache hit and miss rates.
- Build commit, machine specification, test scenario, and generator location.

Raw k6 results, workload definitions, dashboards, and benchmark commands remain in the repository so the demonstration is reproducible.

## Demo Sequence

1. Show the Mac specification and local services.
2. Open the visa portal through ngrok.
3. Display live latency, throughput, error, database, queue, CPU, and memory metrics.
4. Start the realistic local workload.
5. Complete and retrieve an application through the browser while load continues.
6. Trigger the deliberate spike and show controlled rejections rather than a crash.
7. Stop the spike and show rapid recovery.
8. Display the completed benchmark summary and exact Git commit.

## Implementation Sequence

1. Verify the e-Visa user flows and define API contracts, schema, threat model, and workload assumptions.
2. Build the Rust service, PostgreSQL migrations, and health/readiness behavior.
3. Connect the React application to the API and replace browser-only draft persistence where appropriate.
4. Add authentication, authorization, validation, idempotency, and rate limiting.
5. Add backpressure, timeouts, bounded queues, transactional outbox handling, and graceful shutdown.
6. Add metrics, dashboards, structured logs, and benchmark result storage.
7. Optimize frontend assets, loading behavior, caching, and form-network behavior.
8. Implement repeatable k6 user journeys and component workloads.
9. Establish baselines, profile bottlenecks, and tune queries, indexes, connection pools, and concurrency limits.
10. Produce a one-command local startup, seeded synthetic environment, demo script, and final benchmark report.

## Scope Limitation

This design can remain healthy during traffic spikes, database saturation, malformed requests, and controlled component failures. A single MacBook remains a hardware, power, storage, and network single point of failure, so the project must not claim host-level high availability.

The intended final claim is:

> A lightweight and attractive visa portal handling approximately half of the estimated peak Indian e-Visa traffic, with substantial safety headroom, on one self-hosted M4 MacBook Air while maintaining database integrity, bounded resource usage, controlled overload behavior, and responsive user journeys.

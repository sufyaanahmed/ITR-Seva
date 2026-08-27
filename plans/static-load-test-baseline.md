# Static Frontend Load-Test Baseline

**Run date:** 27 August 2026

## Scope and honesty boundary

This benchmark measures Caddy serving the production-built React entry document over the macOS loopback interface. It does **not** measure an application API, PostgreSQL, uploads, authentication, draft writes, submissions, ngrok, or a complete browser page load. The repository does not contain the planned Rust/Axum and PostgreSQL backend yet.

The test host was a MacBook Pro with an Apple M4 Pro (14 cores) and 24 GB RAM, not the intended MacBook Air M4 with 16 GB RAM. The load generator and server ran on the same host, so they competed for local resources. The server used Caddy 2.11.4, and the dependency-free generator used Node.js 24.14.0.

## Reproducible runner

The arrival-rate runner is available through:

```sh
npm run load:local -- \
  --url http://127.0.0.1:8080/ \
  --rate 500 \
  --duration 10 \
  --max-in-flight 256 \
  --server-pid <CADDY_PID> \
  --label sustained-500
```

Unlike the initial closed-loop experiment, this runner schedules a configured number of arrivals per second. It records success and error counts, generator drops, maximum requests in flight, p50/p95/p99 latency, generator event-loop delay, and sampled Caddy CPU/RSS. The in-flight cap prevents a failed server from causing an unbounded client-side socket backlog.

For the recorded runs, Caddy was bounded explicitly:

```sh
GOMAXPROCS=4 GOMEMLIMIT=2GiB caddy run --config Caddyfile
```

## Sustained target: 500 RPS

Five independent ten-second trials were run against the original Caddy configuration before the SPA-routing optimization.

| Measure | Result |
| --- | ---: |
| Total requests | 25,000 |
| Successful responses | 25,000 |
| Failures | 0 |
| Generator drops | 0 |
| p95 range | 3.76–3.98 ms |
| Median p95 | 3.82 ms |
| p99 range | 5.83–8.15 ms |
| Median sampled Caddy CPU | 23.7% |
| Maximum sampled Caddy RSS | 49.88 MiB |

After the routing optimization, a final 500 RPS verification completed 5,000/5,000 requests with no drops or failures. It recorded p95 5.91 ms, p99 14.03 ms, average sampled Caddy CPU 18.5%, and maximum sampled RSS 47.33 MiB.

## Spike diagnosis

An initial unbounded 2,000 RPS run exposed unsafe benchmark behavior as well as a server failure. Once the server slowed, the client accumulated 6,393 in-flight requests. Caddy terminated with `runtime: failed to create new OS thread`; the remaining requests received resets or connection refusals. This result is retained as a failure, not treated as valid capacity evidence.

A bounded rerun prevented runaway client backlog but exposed a sharp performance cliff in the original Caddy pipeline:

| Configuration at 2,000 RPS | Successful | Generator drops | Failures | p95 |
| --- | ---: | ---: | ---: | ---: |
| Minimal fixed response | 20,000 | 0 | 0 | 1.15 ms |
| Raw `file_server` | 10,000 | 0 | 0 | 3.46 ms |
| `try_files` SPA fallback | 3,282 | 6,718 | 0 | 795.99 ms |
| `try_files` plus dynamic encoding | 3,290 | 6,710 | 0 | 788.59 ms |

The controlled comparison isolated the per-request `try_files {path} /index.html` fallback as the dominant bottleneck for this local workload. Dynamic encoding did not materially change the result.

## Implemented optimization

The production Caddyfile now uses deterministic routing:

- `/assets/*` goes directly to the file server with immutable caching.
- Known public-file extensions go directly to the file server with a one-day cache.
- Operational paths are rejected before SPA handling.
- Other public routes rewrite directly to `/index.html` without a filesystem existence check.

Functional checks confirmed `/`, a nested SPA route, and a public SVG return the expected content while `/metrics` remains unavailable publicly.

## Final controlled spike

The optimized configuration completed the final 15-second test as follows:

| Measure | Result |
| --- | ---: |
| Configured arrival rate | 2,000 RPS |
| Requests | 30,000 |
| Successful responses | 30,000 |
| Failures | 0 |
| Generator drops | 0 |
| Completion rate | 1,999.5 RPS |
| Maximum in flight | 19 |
| p50 | 1.65 ms |
| p95 | 3.03 ms |
| p99 | 4.79 ms |
| Maximum latency | 16.80 ms |
| Average sampled Caddy CPU | 40.7% |
| Maximum sampled Caddy CPU | 42.9% |
| Average sampled Caddy RSS | 48.82 MiB |
| Maximum sampled Caddy RSS | 49.42 MiB |

## Conclusion

The optimized static frontend passes the local 500 RPS sustained baseline and a short 2,000 RPS spike on the recorded host. These measurements are evidence for static entry-document delivery only. They are not evidence that the future application backend or database can sustain the same rates.

The next meaningful capacity milestone is to implement the Rust/Axum API and PostgreSQL schema, then run mixed read/write workflows with response validation, database-pool metrics, one-hour sustained tests, recovery checks, and a separate load-generator host. The final showcase must also be repeated on the actual MacBook Air M4 16 GB target.

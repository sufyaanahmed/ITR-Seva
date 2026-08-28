# Local load-test video demo

This setup runs entirely on the MacBook: the Visa Seva UI, Rust API, PostgreSQL, Prometheus, Grafana, the PostgreSQL exporter, and k6. It uses a dedicated Docker Compose project and volumes, so it does not reuse or modify the normal backend stack's database. Only the UI on port `8080` is suitable for an ngrok tunnel. Load traffic goes directly from k6 to the Rust API through Docker's private network.

## Three-command setup

Docker Desktop must be running. From the repository root:

```sh
npm run demo:up
npm run demo:open
npm run demo:load
```

If the repository already has a `.env`, the scripts reuse its database password so an existing local PostgreSQL volume keeps working. In a fresh checkout without `.env`, they use a local demo-only default without writing a secret file.

The commands open or print these local addresses:

- Visa Seva UI: <http://127.0.0.1:8080>
- Grafana dashboard: <http://127.0.0.1:3300/d/visa-seva-load-demo>
- Prometheus targets: <http://127.0.0.1:9091/targets>

Grafana is automatically provisioned with the Prometheus data source and the **Visa Seva — Local Load Test Command Center** dashboard. No login is required because Grafana is bound only to loopback and grants anonymous view-only access.

The demo scripts raise only the private benchmark process's session-ramp and status-poll ceilings to `1000` requests/second. The backend's checked-in public defaults remain conservative, and the general 2,000 requests/second peer limit and overload protection remain active.

## Recording sequence

1. Start with the Visa Seva UI and explain that only this port would be exposed with `ngrok http 8080`.
2. Complete one synthetic visa flow so the viewer sees the real application behavior.
3. Put Grafana beside the UI and make sure its time range is **Last 5 minutes** with **2s** refresh.
4. In a terminal, run `npm run demo:load`.
5. Show backend throughput, p95 latency, 2xx success rate, in-flight requests, PostgreSQL connections, transaction rate, cache hit ratio, virtual users, and intentional load-shedding counters.
6. Let k6 finish and show its threshold summary. Do not claim more than the measured rate and duration displayed in the video.

For a longer or heavier private run:

```sh
RPS=1000 DURATION=3m PRE_ALLOCATED_VUS=600 MAX_VUS=1600 npm run demo:load
```

Start at 500 RPS on the M4 MacBook Air. Increase in 250 RPS steps and stop increasing once p95 exceeds 250 ms, failures exceed 1%, the generator reports dropped iterations, or the laptop thermally throttles. A stable lower number is a stronger demonstration than an unstable headline number.

## Useful controls

```sh
npm run demo:status
./scripts/demo-observability.sh logs
npm run demo:down
```

`demo:down` preserves the database and Grafana history. To deliberately delete the local demo database and monitoring history:

```sh
CONFIRM_RESET=yes ./scripts/demo-observability.sh reset
```

## Screenshots and clean framing

- Use macOS `Shift-Command-5` for the recording and hide desktop notifications first.
- Grafana's kiosk mode is useful for clean footage: append `?kiosk&refresh=2s&from=now-5m&to=now` to the dashboard URL.
- Keep Activity Monitor available as optional proof that the workload is running on the Mac, but treat API and database metrics as the primary evidence.
- Capture a screenshot near the middle of the run, after the 30-second Prometheus windows have stabilized.

## Safety and interpretation

- Ports `8080`, `3000`, `3300`, `5432`, `9090`, and `9091` are bound to `127.0.0.1`; the database and monitoring tools are not public.
- Never tunnel Grafana, Prometheus, PostgreSQL, or the API's operator port.
- The workload uses synthetic records and document metadata only.
- This test demonstrates one workload on one machine. It is not evidence of unlimited capacity or a replacement for production security, disaster recovery, external-dependency, and multi-host testing.

FROM rust:1.89-bookworm AS builder
WORKDIR /build
COPY backend/Cargo.toml backend/Cargo.lock* ./
COPY backend/src ./src
COPY backend/migrations ./migrations
RUN cargo build --locked --release

FROM debian:bookworm-slim AS runtime
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system --gid 10001 visa \
    && useradd --system --uid 10001 --gid visa --no-create-home visa
COPY --from=builder /build/target/release/visa-seva-api /usr/local/bin/visa-seva-api
USER 10001:10001
EXPOSE 3000 9090
ENTRYPOINT ["/usr/local/bin/visa-seva-api"]

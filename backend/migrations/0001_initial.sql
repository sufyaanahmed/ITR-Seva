CREATE TABLE demo_sessions (
    id UUID PRIMARY KEY,
    token_hash BYTEA NOT NULL UNIQUE,
    client_label VARCHAR(80) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    CONSTRAINT demo_sessions_label_not_blank CHECK (length(btrim(client_label)) > 0)
);

CREATE INDEX demo_sessions_expiry_idx ON demo_sessions (expires_at)
    WHERE revoked_at IS NULL;

CREATE TYPE application_status AS ENUM ('DRAFT', 'SUBMITTED', 'PROCESSING', 'GRANTED', 'REJECTED');

CREATE TABLE applications (
    id UUID PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES demo_sessions(id) ON DELETE CASCADE,
    reference VARCHAR(40) NOT NULL UNIQUE,
    application_type VARCHAR(24) NOT NULL,
    status application_status NOT NULL DEFAULT 'DRAFT',
    version INTEGER NOT NULL DEFAULT 1,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    submitted_at TIMESTAMPTZ,
    CONSTRAINT application_type_allowed CHECK (application_type IN ('evisa', 'afghan', 'voa', 'regular')),
    CONSTRAINT application_version_positive CHECK (version > 0),
    CONSTRAINT application_is_demo CHECK (data @> '{"demo_only": true}'::jsonb)
);

CREATE INDEX applications_session_updated_idx ON applications (session_id, updated_at DESC);
CREATE INDEX applications_status_updated_idx ON applications (status, updated_at DESC);

CREATE TABLE document_metadata (
    id UUID PRIMARY KEY,
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    kind VARCHAR(64) NOT NULL,
    media_type VARCHAR(100) NOT NULL,
    size_bytes INTEGER NOT NULL,
    sha256_hex CHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (application_id, kind),
    CONSTRAINT document_size_valid CHECK (size_bytes BETWEEN 1 AND 10485760),
    CONSTRAINT document_hash_valid CHECK (sha256_hex ~ '^[0-9a-f]{64}$')
);

CREATE TABLE application_status_history (
    id BIGSERIAL PRIMARY KEY,
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    status application_status NOT NULL,
    detail VARCHAR(240) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX status_history_application_idx
    ON application_status_history (application_id, created_at DESC);

CREATE TABLE idempotency_records (
    session_id UUID NOT NULL REFERENCES demo_sessions(id) ON DELETE CASCADE,
    route VARCHAR(80) NOT NULL,
    idempotency_key VARCHAR(128) NOT NULL,
    response_status SMALLINT NOT NULL,
    response_body JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '24 hours'),
    PRIMARY KEY (session_id, route, idempotency_key)
);

CREATE INDEX idempotency_expiry_idx ON idempotency_records (expires_at);

CREATE TABLE outbox_events (
    id UUID PRIMARY KEY,
    aggregate_id UUID NOT NULL,
    event_type VARCHAR(80) NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    processed_at TIMESTAMPTZ,
    attempts SMALLINT NOT NULL DEFAULT 0
);

CREATE INDEX outbox_pending_idx ON outbox_events (created_at)
    WHERE processed_at IS NULL;

CREATE TABLE audit_events (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID REFERENCES demo_sessions(id) ON DELETE SET NULL,
    application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
    action VARCHAR(80) NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX audit_application_created_idx ON audit_events (application_id, created_at DESC);

REVOKE ALL ON SCHEMA public FROM PUBLIC;

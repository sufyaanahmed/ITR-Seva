import assert from 'node:assert/strict';

const baseUrl = String(process.env.API_URL || 'http://127.0.0.1:3000/api/v1').replace(/\/$/, '');

async function request(path, { expected, ...options } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) },
  });
  const body = response.status === 204 ? null : await response.json().catch(() => null);
  if (expected) assert.equal(response.status, expected, `${path}: ${JSON.stringify(body)}`);
  return { response, body };
}

const session = await request('/sessions', {
  method: 'POST', expected: 201, body: JSON.stringify({ client_label: 'integration-smoke' }),
});
assert.match(session.body.token, /^demo_[a-f0-9]{64}$/);
const auth = { Authorization: `Bearer ${session.body.token}` };
const fixture = {
  application_type: 'evisa',
  demo_only: true,
  journey_kind: 'integration-smoke',
  visa_category: 'tourist',
  document_count: 0,
};

const created = await request('/applications', {
  method: 'POST', expected: 201, headers: auth,
  body: JSON.stringify({ application_type: 'evisa', data: fixture }),
});
assert.equal(created.body.version, 1);
assert.equal(created.body.status, 'DRAFT');

const updated = await request(`/applications/${created.body.id}`, {
  method: 'PATCH', expected: 200, headers: auth,
  body: JSON.stringify({ version: 1, data: { ...fixture, benchmark_sequence: 1 } }),
});
assert.equal(updated.body.version, 2);

const documentStored = await request(`/applications/${created.body.id}/documents`, {
  method: 'PUT', expected: 200, headers: auth,
  body: JSON.stringify({
    expected_version: 2,
    kind: 'passport',
    media_type: 'application/pdf',
    size_bytes: 12_000,
    sha256_hex: 'a'.repeat(64),
  }),
});
assert.equal(documentStored.body.version, 3);
await request(`/applications/${created.body.id}/documents`, {
  method: 'PUT', expected: 409, headers: auth,
  body: JSON.stringify({
    expected_version: 2,
    kind: 'passport',
    media_type: 'application/pdf',
    size_bytes: 12_000,
    sha256_hex: 'b'.repeat(64),
  }),
});

await request(`/applications/${created.body.id}`, {
  method: 'PATCH', expected: 409, headers: auth,
  body: JSON.stringify({ version: 1, data: fixture }),
});

await request(`/applications/${created.body.id}`, {
  method: 'PATCH', expected: 422, headers: auth,
  body: JSON.stringify({ version: 3, data: { ...fixture, application_type: 'afghan' } }),
});

await request(`/applications/${created.body.id}/submit`, {
  method: 'POST', expected: 409, headers: { ...auth, 'Idempotency-Key': `stale-${crypto.randomUUID()}` },
  body: JSON.stringify({ expected_version: 2 }),
});

const idempotencyKey = `smoke-${crypto.randomUUID()}`;
const submitted = await request(`/applications/${created.body.id}/submit`, {
  method: 'POST', expected: 200, headers: { ...auth, 'Idempotency-Key': idempotencyKey },
  body: JSON.stringify({ expected_version: 3 }),
});
const replay = await request(`/applications/${created.body.id}/submit`, {
  method: 'POST', expected: 200, headers: { ...auth, 'Idempotency-Key': idempotencyKey },
  body: JSON.stringify({ expected_version: 3 }),
});
assert.deepEqual(replay.body, submitted.body, 'idempotency replay must return the original response');

const status = await request(`/applications/${created.body.id}/status`, { expected: 200, headers: auth });
assert.equal(status.body.status, 'SUBMITTED');
assert.deepEqual(status.body.events.map((event) => event.status), ['DRAFT', 'SUBMITTED']);

const completionKey = `complete-${crypto.randomUUID()}`;
const completionPayload = {
  application_type: 'voa',
  data: { application_type: 'voa', demo_only: true, journey_kind: 'integration-smoke', document_count: 0 },
  documents: [],
};
await request('/showcase-completions', {
  method: 'POST', expected: 422, headers: { ...auth, 'Idempotency-Key': `duplicate-doc-${crypto.randomUUID()}` },
  body: JSON.stringify({
    ...completionPayload,
    documents: [
      { kind: 'passport', media_type: 'application/pdf', size_bytes: 12_000, sha256_hex: 'c'.repeat(64) },
      { kind: 'passport', media_type: 'application/pdf', size_bytes: 13_000, sha256_hex: 'd'.repeat(64) },
    ],
  }),
});
const completion = await request('/showcase-completions', {
  method: 'POST', expected: 200, headers: { ...auth, 'Idempotency-Key': completionKey },
  body: JSON.stringify(completionPayload),
});
const completionReplay = await request('/showcase-completions', {
  method: 'POST', expected: 200, headers: { ...auth, 'Idempotency-Key': completionKey },
  body: JSON.stringify(completionPayload),
});
assert.deepEqual(completionReplay.body, completion.body, 'atomic completion replay must be stable');
const completionStatus = await request(`/applications/${completion.body.id}/status`, { expected: 200, headers: auth });
assert.deepEqual(completionStatus.body.events.map((event) => event.status), ['DRAFT', 'SUBMITTED']);

console.log(JSON.stringify({
  ok: true,
  baseUrl,
  applicationId: created.body.id,
  reference: submitted.body.reference,
  assertions: ['session', 'draft', 'optimistic-conflict', 'versioned-document-write', 'type-integrity', 'stale-submit-protection', 'idempotent-submit', 'duplicate-document-rejection', 'atomic-completion', 'status-history'],
}, null, 2));

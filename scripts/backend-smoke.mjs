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
  surname: 'EXAMPLE',
  given_name: 'SMOKE TEST',
};

const created = await request('/applications', {
  method: 'POST', expected: 201, headers: auth,
  body: JSON.stringify({ application_type: 'evisa', data: fixture }),
});
assert.equal(created.body.version, 1);
assert.equal(created.body.status, 'DRAFT');

const updated = await request(`/applications/${created.body.id}`, {
  method: 'PATCH', expected: 200, headers: auth,
  body: JSON.stringify({ version: 1, data: { ...fixture, places_to_visit: 'Delhi' } }),
});
assert.equal(updated.body.version, 2);

await request(`/applications/${created.body.id}`, {
  method: 'PATCH', expected: 409, headers: auth,
  body: JSON.stringify({ version: 1, data: fixture }),
});

const idempotencyKey = `smoke-${crypto.randomUUID()}`;
const submitted = await request(`/applications/${created.body.id}/submit`, {
  method: 'POST', expected: 200, headers: { ...auth, 'Idempotency-Key': idempotencyKey },
});
const replay = await request(`/applications/${created.body.id}/submit`, {
  method: 'POST', expected: 200, headers: { ...auth, 'Idempotency-Key': idempotencyKey },
});
assert.deepEqual(replay.body, submitted.body, 'idempotency replay must return the original response');

const status = await request(`/applications/${created.body.id}/status`, { expected: 200, headers: auth });
assert.equal(status.body.status, 'SUBMITTED');
assert.deepEqual(status.body.events.map((event) => event.status), ['DRAFT', 'SUBMITTED']);

console.log(JSON.stringify({
  ok: true,
  baseUrl,
  applicationId: created.body.id,
  reference: submitted.body.reference,
  assertions: ['session', 'draft', 'optimistic-conflict', 'idempotent-submit', 'status-history'],
}, null, 2));

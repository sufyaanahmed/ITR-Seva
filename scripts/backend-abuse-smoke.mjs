import assert from 'node:assert/strict';

const apiOrigin = String(process.env.API_ORIGIN || 'http://127.0.0.1:3000').replace(/\/$/, '');
const apiUrl = `${apiOrigin}/api/v1`;

const sessionResponse = await fetch(`${apiUrl}/sessions`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ client_label: 'abuse-smoke' }),
});
assert.equal(sessionResponse.status, 201);
const session = await sessionResponse.json();

const unauthorized = await fetch(`${apiUrl}/applications`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ application_type: 'evisa', data: { application_type: 'evisa', demo_only: true } }),
});
assert.equal(unauthorized.status, 401);

const nonSynthetic = await fetch(`${apiUrl}/applications`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
  body: JSON.stringify({ application_type: 'evisa', data: { application_type: 'evisa', demo_only: false } }),
});
assert.equal(nonSynthetic.status, 422);

const hiddenMetrics = await fetch(`${apiOrigin}/internal/metrics`);
assert.equal(hiddenMetrics.status, 404);

const oversized = await fetch(`${apiUrl}/sessions`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ client_label: 'x'.repeat(1_100_000) }),
});
assert.equal(oversized.status, 413);

const fakeTokenBurst = await Promise.all(Array.from({ length: 2_100 }, (_, index) => fetch(`${apiUrl}/applications`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer demo_${String(index).padStart(64, '0')}` },
  body: JSON.stringify({ application_type: 'evisa', data: { application_type: 'evisa', demo_only: true } }),
}).catch(() => ({ status: 'ERR' }))));
const fakeTokenStatuses = fakeTokenBurst.reduce((counts, response) => {
  counts[response.status] = (counts[response.status] || 0) + 1;
  return counts;
}, {});
assert.ok((fakeTokenStatuses[429] || 0) > 0, 'rotating invalid bearer tokens must not bypass the peer rate limit');

const burst = await Promise.all(Array.from({ length: 250 }, (_, index) => fetch(`${apiUrl}/sessions`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // The API deliberately ignores this untrusted value and keys by the socket peer.
    'X-Forwarded-For': `203.0.113.${index % 250}`,
  },
  body: JSON.stringify({ client_label: `rate-limit-${index}` }),
}).catch(() => ({ status: 'ERR' }))));
const burstStatuses = burst.reduce((counts, response) => {
  counts[response.status] = (counts[response.status] || 0) + 1;
  return counts;
}, {});
assert.ok((burstStatuses[201] || 0) > 0, 'the safe portion of the burst should be accepted');
assert.ok((burstStatuses[429] || 0) > 0, 'the session-creation burst must be rate limited');

console.log(JSON.stringify({
  ok: true,
  assertions: ['authentication', 'synthetic-only', 'operator-route-isolation', 'body-limit', 'rate-limit', 'invalid-token-rotation', 'forwarded-ip-not-trusted'],
  fakeTokenStatuses,
  burstStatuses,
}, null, 2));

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';

const apiUrl = String(__ENV.API_URL || 'http://127.0.0.1:3000/api/v1').replace(/\/$/, '');
const targetRate = Number(__ENV.RPS || 500);
const duration = __ENV.DURATION || '2m';
const preAllocatedVUs = Number(__ENV.PRE_ALLOCATED_VUS || Math.max(200, targetRate));
const operationFailures = new Counter('operation_failures');
const endToEndLatency = new Trend('end_to_end_latency', true);

export const options = {
  scenarios: {
    mixed_api: {
      executor: 'constant-arrival-rate',
      rate: targetRate,
      timeUnit: '1s',
      duration,
      preAllocatedVUs,
      maxVUs: Number(__ENV.MAX_VUS || preAllocatedVUs * 2),
      gracefulStop: '10s',
    },
  },
  thresholds: {
    checks: ['rate>0.99'],
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<250', 'p(99)<750'],
    operation_failures: ['count<1'],
  },
  discardResponseBodies: false,
};

let actor;

function jsonRequest(method, path, body, headers = {}, tags = {}) {
  const response = http.request(method, `${apiUrl}${path}`, body === null ? null : JSON.stringify(body), {
    headers: { Accept: 'application/json', ...(body === null ? {} : { 'Content-Type': 'application/json' }), ...headers },
    tags,
    timeout: '3s',
  });
  endToEndLatency.add(response.timings.duration);
  return response;
}

function createActor() {
  const session = jsonRequest('POST', '/sessions', { client_label: `k6-vu-${__VU}` }, {}, { operation: 'session' });
  if (session.status !== 201) return null;
  const token = session.json('token');
  const headers = { Authorization: `Bearer ${token}` };
  const draft = createDraft(headers);
  if (!draft) return null;
  return { headers, application: draft, draftsCreated: 1 };
}

function createDraft(headers) {
  const response = jsonRequest('POST', '/applications', {
    application_type: 'evisa',
    data: { application_type: 'evisa', demo_only: true, journey_kind: 'benchmark', benchmark_sequence: __VU },
  }, headers, { operation: 'draft_create' });
  return response.status === 201 ? response.json() : null;
}

export default function () {
  if (!actor) actor = createActor();
  if (!actor) {
    operationFailures.add(1);
    sleep(0.1);
    return;
  }

  const roll = Math.random();
  let response;
  if (roll < 0.50) {
    response = http.get(`${apiUrl}/reference/visa-categories`, { tags: { operation: 'reference' } });
    endToEndLatency.add(response.timings.duration);
  } else if (roll < 0.75) {
    response = jsonRequest('GET', `/applications/${actor.application.id}/status`, null, actor.headers, { operation: 'status' });
  } else if (roll < 0.90) {
    response = jsonRequest('PATCH', `/applications/${actor.application.id}`, {
      version: actor.application.version,
      data: { ...actor.application.data, benchmark_sequence: __ITER },
    }, actor.headers, { operation: 'draft_update' });
    if (response.status === 200) actor.application = response.json();
  } else if (roll < 0.95) {
    response = jsonRequest('GET', `/applications/${actor.application.id}`, null, actor.headers, { operation: 'draft_read' });
  } else {
    response = jsonRequest('POST', `/applications/${actor.application.id}/submit`, { expected_version: actor.application.version }, {
      ...actor.headers,
      'Idempotency-Key': `k6-load-${__VU}-${__ITER}`,
    }, { operation: 'submit' });
    if (response.status === 200) {
      // Rotate before the per-session application quota. This keeps the long
      // workload realistic without weakening the backend's checked-in quota.
      if (actor.draftsCreated >= 80) {
        actor = createActor();
      } else {
        const nextDraft = createDraft(actor.headers);
        if (nextDraft) {
          actor.application = nextDraft;
          actor.draftsCreated += 1;
        } else {
          actor = null;
        }
      }
    }
  }

  const accepted = check(response, {
    'operation succeeded or shed deliberately': (result) => (result.status >= 200 && result.status < 300) || result.status === 429 || result.status === 503,
  });
  if (!accepted) operationFailures.add(1);
}

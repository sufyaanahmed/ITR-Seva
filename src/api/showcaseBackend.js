const apiBase = String(import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '');
const backendEnabled = import.meta.env.VITE_SHOWCASE_BACKEND !== 'disabled';

const request = async (path, options = {}) => {
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });
  const body = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(body?.error?.message || `Showcase backend returned HTTP ${response.status}.`);
    error.code = body?.error?.code || `http_${response.status}`;
    error.retryable = Boolean(body?.error?.retryable);
    throw error;
  }
  return body;
};

const sha256Metadata = async (document) => {
  const bytes = new TextEncoder().encode(JSON.stringify({
    type: document.type,
    mimeType: document.mimeType,
    size: document.size,
    selectedAt: document.selectedAt,
  }));
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
};

export async function syncSyntheticApplication({ data, documents }) {
  if (!backendEnabled) return null;
  if (data?.demo_only !== true) throw new Error('The showcase backend accepts synthetic demo records only.');

  const session = await request('/sessions', {
    method: 'POST',
    body: JSON.stringify({ client_label: 'visa-journey-browser' }),
  });
  const authorization = { Authorization: `Bearer ${session.token}` };
  const application = await request('/applications', {
    method: 'POST',
    headers: authorization,
    body: JSON.stringify({ application_type: data.application_type, data }),
  });

  for (const document of documents || []) {
    if (!document?.type || !document?.mimeType || !Number.isFinite(document.size)) continue;
    await request(`/applications/${application.id}/documents`, {
      method: 'PUT',
      headers: authorization,
      body: JSON.stringify({
        kind: document.type.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64),
        media_type: document.mimeType,
        size_bytes: Math.max(1, Math.min(10_485_760, Math.round(document.size))),
        sha256_hex: await sha256Metadata(document),
      }),
    });
  }

  return request(`/applications/${application.id}/submit`, {
    method: 'POST',
    headers: {
      ...authorization,
      'Idempotency-Key': globalThis.crypto.randomUUID(),
    },
  });
}

const apiBase = String(import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '');
export const isShowcaseBackendEnabled = import.meta.env.VITE_SHOWCASE_BACKEND === 'enabled';
const syncContextKey = 'visa-showcase-sync-v1';
const requestTimeoutMs = 8_000;

const request = async (path, options = {}) => {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), requestTimeoutMs);
  try {
    const response = await fetch(`${apiBase}${path}`, {
      ...options,
      signal: controller.signal,
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
      error.retryable = Boolean(body?.error?.retryable)
        || [408, 429, 502, 503, 504].includes(response.status);
      throw error;
    }
    return body;
  } catch (error) {
    if (error?.name === 'AbortError') {
      const timeoutError = new Error('The self-hosted backend did not respond within 8 seconds.');
      timeoutError.code = 'request_timeout';
      timeoutError.retryable = true;
      throw timeoutError;
    }
    if (error instanceof TypeError) {
      error.retryable = true;
      error.code = 'network_error';
    }
    throw error;
  } finally {
    globalThis.clearTimeout(timeout);
  }
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

const loadContext = (attemptId) => {
  try {
    const parsed = JSON.parse(globalThis.sessionStorage?.getItem(syncContextKey) || 'null');
    return parsed?.attemptId === attemptId ? parsed : null;
  } catch {
    return null;
  }
};

const saveContext = (context) => globalThis.sessionStorage?.setItem(syncContextKey, JSON.stringify(context));
const clearContext = () => globalThis.sessionStorage?.removeItem(syncContextKey);
const canonicalMediaType = (document) => document.mimeType
  || (document.extension === 'pdf' ? 'application/pdf' : 'image/jpeg');

export async function syncSyntheticApplication({ data, documents, attemptId }) {
  if (!isShowcaseBackendEnabled) return null;
  if (data?.demo_only !== true) throw new Error('The showcase backend accepts synthetic demo records only.');

  let context = loadContext(attemptId);
  if (!context) {
    context = { attemptId, token: null, idempotencyKey: globalThis.crypto.randomUUID() };
    saveContext(context);
  }
  if (!context.token) {
    const session = await request('/sessions', {
      method: 'POST',
      body: JSON.stringify({ client_label: 'visa-journey-browser' }),
    });
    context = { ...context, token: session.token };
    saveContext(context);
  }

  const safeDocuments = await Promise.all((documents || [])
    .filter((document) => document?.type && Number.isFinite(document.size))
    .slice(0, 32)
    .map(async (document) => ({
      kind: document.type.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64),
      media_type: canonicalMediaType(document),
      size_bytes: Math.max(1, Math.min(10_485_760, Math.round(document.size))),
      sha256_hex: await sha256Metadata(document),
    })));
  const summary = {
    application_type: data.application_type,
    demo_only: true,
    journey_kind: 'browser-completion',
    visa_category: String(data.visa_category || '').slice(0, 80),
    ruleset_id: String(data.eligibility_ruleset_id || '').slice(0, 80),
    document_count: safeDocuments.length,
  };

  const executeWithRetry = async (retriesLeft) => {
    try {
      const result = await request('/showcase-completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${context.token}`, 'Idempotency-Key': context.idempotencyKey },
        body: JSON.stringify({ application_type: data.application_type, data: summary, documents: safeDocuments }),
      });
      clearContext();
      return result;
    } catch (error) {
      if (error.code === 'unauthorized') clearContext();
      if (error.retryable && retriesLeft > 0) {
        await new Promise(resolve => globalThis.setTimeout(resolve, 1000)); // 1s backoff
        return executeWithRetry(retriesLeft - 1);
      }
      throw error;
    }
  };

  return executeWithRetry(1);
}

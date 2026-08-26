/**
 * Local persistence.
 *
 * localStorage only. The stored record is JSON with no binary — document
 * *metadata* is kept, file contents never are — so the realistic payload is
 * around 10 KB against a ~5 MB quota. The previous version paid IndexedDB's
 * full complexity on every keystroke while never reading it back once.
 *
 * Three separate keys, because "Clear demo data" must be structurally
 * incapable of wiping someone's text-size preference. That is not a policy
 * here; it is the absence of a code path.
 */

export const KEY_APP = 'visaseva.app.v1';
export const KEY_SEQ = 'visaseva.seq.v1';
export const KEY_PREFS = 'visaseva.prefs.v1';
export const KEY_QUARANTINE = 'visaseva.quarantine.v1';
export const KEY_FINDER = 'visaseva.finder.v1';
export const KEY_LEGACY = 'bharat-visa-drafts';

export const SCHEMA_VERSION = 1;

/** The reserved seed block — user sequences start above it. */
const RESERVED = 6;

function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return undefined; // distinguishable from a genuine null (= "not stored")
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeSessionGet(key) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return undefined;
  }
}

export function storageAvailable() {
  try {
    const probe = '__visaseva_probe__';
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

/**
 * Migrations run forward only, one step each. Migration 0 exists so a draft
 * saved by the previous version of this prototype is carried across rather
 * than silently discarded.
 */
const MIGRATIONS = {
  0: (legacy) => ({
    schemaVersion: 1,
    id: null, // the StoreProvider adopts it with a stable ID before exposure
    pathId: legacy?.data?.application_type || 'evisa',
    category: legacy?.data?.visa_category || 'tourist',
    status: legacy?.submitted ? 'SUBMITTED' : 'DRAFT',
    data: legacy?.data || {},
    documents: (legacy?.docs || []).map((d) => ({
      slot: d.type, filename: d.name, status: 'selected', sizeBytes: null, selectedAt: null,
    })),
    requestedDocuments: [],
    payment: null,
    decision: null,
    finderAnswers: null,
    timeline: [],
  }),
};

function migrate(version, data) {
  let v = version;
  let d = data;
  while (v < SCHEMA_VERSION) {
    d = MIGRATIONS[v](d);
    v += 1;
  }
  return d;
}

function quarantine(raw, reason) {
  safeSet(KEY_QUARANTINE, raw);
  try {
    localStorage.removeItem(KEY_APP);
  } catch { /* nothing more we can do, and losing the read is not fatal */ }
  return { app: null, warning: reason };
}

/**
 * Read the stored application.
 * Returns `{ app, warning }`. A missing record is `{ app: null, warning: null }` —
 * an honest "you have not started anything", not a fabricated draft.
 */
export function loadApplication() {
  const raw = safeGet(KEY_APP);
  if (raw === undefined) return { app: null, warning: 'storage-unavailable' };
  if (raw === null) return { app: null, warning: null };

  let env;
  try {
    env = JSON.parse(raw);
  } catch {
    return quarantine(raw, 'unreadable');
  }

  // The legacy build stored an unversioned blob under a different key shape.
  const version = typeof env?.schemaVersion === 'number' ? env.schemaVersion : 0;
  if (version > SCHEMA_VERSION) return quarantine(raw, 'from-newer-version');

  try {
    return { app: migrate(version, version === 0 ? env : env), warning: null };
  } catch {
    return quarantine(raw, 'migration-failed');
  }
}

/** Adopt a draft left by the previous version of this prototype, if any. */
export function loadLegacyDraft() {
  const raw = safeGet(KEY_LEGACY);
  if (!raw) return null;
  try {
    const legacy = JSON.parse(raw);
    const data = legacy?.data || {};
    const meaningful = Boolean(
      legacy?.submitted
      || legacy?.docs?.length
      || Object.entries(data).some(([key, value]) =>
        !['application_type', 'visa_category'].includes(key) && value != null && value !== ''),
    );
    // The old build wrote a fabricated empty default on first paint. Do not
    // turn that into a real-looking saved draft during migration.
    return meaningful ? MIGRATIONS[0](legacy) : null;
  } catch {
    return null;
  }
}

export function clearLegacyDraft() {
  try { localStorage.removeItem(KEY_LEGACY); } catch { /* keep it if storage is blocked */ }
}

/**
 * Write the record. Returns the timestamp actually written, or null if the
 * write failed — the caller must not claim "Saved" without one.
 */
export function saveApplication(app) {
  if (!app) return null;
  const at = new Date().toISOString();
  const ok = safeSet(KEY_APP, JSON.stringify({ ...app, schemaVersion: SCHEMA_VERSION, updatedAt: at }));
  return ok ? at : null;
}

/** Next application sequence number. Persisted so IDs never repeat. */
export function nextSequence() {
  const raw = safeGet(KEY_SEQ);
  const current = Number.parseInt(raw ?? '', 10);
  const next = (Number.isFinite(current) && current > RESERVED ? current : RESERVED) + 1;
  safeSet(KEY_SEQ, String(next));
  return next;
}

export function loadPrefs() {
  const raw = safeGet(KEY_PREFS);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function savePrefs(prefs) {
  safeSet(KEY_PREFS, JSON.stringify(prefs));
}

/**
 * Remove the demo application and reset the counter.
 * Note what is absent: KEY_PREFS. Accessibility settings survive on purpose.
 */
export function clearDemoData() {
  try {
    localStorage.removeItem(KEY_APP);
    localStorage.removeItem(KEY_SEQ);
    localStorage.removeItem(KEY_QUARANTINE);
    localStorage.removeItem(KEY_LEGACY);
  } catch { /* if storage is blocked there is nothing stored to clear */ }
  try { sessionStorage.removeItem(KEY_FINDER); } catch { /* session storage may also be blocked */ }
}

/** What /help/your-data lists, so the disclosure cannot drift from reality. */
export function storedItems() {
  const describe = (key, purpose, clearable) => ({
    key,
    purpose,
    clearable,
    present: safeGet(key) != null,
    bytes: (safeGet(key) || '').length,
  });
  const describeSession = (key, purpose, clearable) => ({
    key,
    purpose,
    clearable,
    present: safeSessionGet(key) != null,
    bytes: (safeSessionGet(key) || '').length,
  });
  return [
    describe(KEY_APP, 'Your demo application: the answers you typed, which demo files you chose (names only, never the files themselves), and its history.', true),
    describe(KEY_SEQ, 'A counter, so two demo applications never get the same reference number.', true),
    describe(KEY_PREFS, 'Your display settings: text size, contrast, motion and Data Saver.', false),
    describe(KEY_QUARANTINE, 'A copy of a saved draft we could not read, kept so it is not lost.', true),
    describeSession(KEY_FINDER, 'Your finder answers for this tab. They survive a refresh, disappear when the tab closes, and are cleared when demo data is cleared.', true),
  ];
}

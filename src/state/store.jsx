import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  applyEvent, createApplication, deriveAccessCode, mintApplicationId, normaliseStatus, allowedEvents,
} from '../lib/application.js';
import {
  loadApplication, loadLegacyDraft, clearLegacyDraft, saveApplication, nextSequence,
  clearDemoData, storageAvailable,
} from '../lib/persist.js';
import { findApplication } from '../lib/demo-seed.js';

/**
 * The application draft.
 *
 * There is no default application. `app === null` means "you have not started
 * one", and every surface is built to say so honestly. The previous version
 * shipped a `defaultState` with `type: 'evisa'`, which made the dashboard's
 * empty state unreachable and wrote a fabricated draft to storage on first
 * paint.
 */

const StoreContext = createContext(null);

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
};

const SAVE_DEBOUNCE_MS = 800;

function loadInitialState() {
  const loaded = loadApplication();
  let candidate = loaded.app;
  let recovered = false;

  if (!candidate) {
    candidate = loadLegacyDraft();
    recovered = Boolean(candidate);
  }

  // Version-zero records had no stable identity. Adopt only meaningful data,
  // mint once, save the complete v1 envelope, then remove the old key. React
  // Strict Mode may call this initializer twice; the second call reads the v1
  // record written by the first, so no duplicate ID is created.
  if (candidate && !candidate.id) {
    const at = new Date().toISOString();
    const id = mintApplicationId(nextSequence(), candidate.pathId || 'evisa', at.slice(0, 4));
    candidate = {
      ...candidate,
      id,
      accessCode: deriveAccessCode(id),
      kind: 'user',
      status: 'DRAFT',
      createdAt: at,
      updatedAt: at,
      submittedAt: null,
      timeline: [{
        seq: 1, at, from: 'NOT_STARTED', to: 'DRAFT', event: 'RECOVER_LEGACY',
        actor: 'user', label: 'Draft recovered from an earlier prototype', detail: null,
      }],
    };
    const savedAt = saveApplication(candidate);
    if (savedAt) {
      candidate = { ...candidate, updatedAt: savedAt };
      clearLegacyDraft();
    }
    recovered = true;
  }

  const app = normaliseStatus(candidate);
  return {
    app,
    savedApp: app?.kind === 'seed' ? null : app,
    warning: recovered ? 'legacy-recovered' : loaded.warning,
  };
}

export function StoreProvider({ children }) {
  const [{ app, savedApp, warning }, setState] = useState(loadInitialState);
  const [lastSavedAt, setLastSavedAt] = useState(() => savedApp?.updatedAt ?? null);
  const [saving, setSaving] = useState(false);
  const [online, setOnline] = useState(() => navigator.onLine !== false);
  const [announcement, setAnnouncement] = useState('');
  const [storageBlocked, setStorageBlocked] = useState(() => !storageAvailable());
  const timer = useRef(null);
  const pending = useRef(null);

  /* -- Persistence: debounced, with a hard flush when the page goes away -- */

  const flush = useCallback(() => {
    if (!pending.current) return;
    const at = saveApplication(pending.current);
    pending.current = null;
    setSaving(false);
    if (at) setLastSavedAt(at);
    else setStorageBlocked(true);
  }, []);

  const schedule = useCallback((next) => {
    // Seeded reviewer records are session fixtures. They may be explored and
    // advanced in memory, but must reset on reload rather than becoming a
    // person's saved application.
    if (next?.kind === 'seed') return;
    pending.current = next;
    setSaving(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(flush, SAVE_DEBOUNCE_MS);
  }, [flush]);

  useEffect(() => {
    // A backgrounded mobile browser may never run another timer, so these two
    // events matter more for not losing work than the debounce does.
    const onHide = () => { clearTimeout(timer.current); flush(); };
    window.addEventListener('pagehide', onHide);
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') onHide();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      window.removeEventListener('pagehide', onHide);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [flush]);

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, []);

  const commit = useCallback((next) => {
    setState((s) => ({
      ...s,
      app: next,
      savedApp: next?.kind === 'seed' ? s.savedApp : next,
    }));
    if (next) schedule(next);
  }, [schedule]);

  /* -- Actions ---------------------------------------------------------- */

  const startApplication = useCallback(({
    pathId, category, answers = null, data = {}, replaceExisting = false,
  }) => {
    // Visa on Arrival happens at the airport; regular and Afghan-national
    // routes use other official journeys. This prototype simulates only the
    // e-Visa application rather than inventing forms for those routes.
    if (pathId !== 'evisa') return null;
    if (savedApp && !replaceExisting) return null;
    const at = new Date().toISOString();
    const seq = nextSequence();
    const id = mintApplicationId(seq, pathId, at.slice(0, 4));
    const next = createApplication({ id, pathId, category, at, answers, data });
    commit(next);
    setAnnouncement(`Demo application ${id} started.`);
    return next;
  }, [commit, savedApp]);

  const updateField = useCallback((name, value) => {
    setState((s) => {
      if (!s.app) return s;
      const next = { ...s.app, data: { ...s.app.data, [name]: value } };
      schedule(next);
      return { ...s, app: next, savedApp: next.kind === 'seed' ? s.savedApp : next };
    });
  }, [schedule]);

  const selectDocument = useCallback((slot, file, { replacement = false } = {}) => {
    setState((s) => {
      if (!s.app) return s;
      const entry = {
        slot,
        filename: file.name,
        sizeBytes: file.size,
        // Only metadata is stored. The file itself never leaves the file input,
        // which is both honest and the right call on a shared device.
        status: replacement ? 'replaced' : 'selected',
        selectedAt: new Date().toISOString(),
      };
      const next = {
        ...s.app,
        documents: [...s.app.documents.filter((d) => d.slot !== slot), entry],
      };
      schedule(next);
      return { ...s, app: next, savedApp: next.kind === 'seed' ? s.savedApp : next };
    });
    setAnnouncement(`${file.name} chosen for this document.`);
  }, [schedule]);

  const removeDocument = useCallback((slot) => {
    setState((s) => {
      if (!s.app) return s;
      const next = { ...s.app, documents: s.app.documents.filter((d) => d.slot !== slot) };
      schedule(next);
      return { ...s, app: next, savedApp: next.kind === 'seed' ? s.savedApp : next };
    });
    setAnnouncement('Document removed.');
  }, [schedule]);

  /** Dispatch a lifecycle event. Returns an error string, or null on success. */
  const dispatch = useCallback((event) => {
    if (!app) return 'There is no active demo application.';
    const result = applyEvent(app, { at: new Date().toISOString(), ...event });
    if (result.error) return result.error;
    commit(result.app);
    return null;
  }, [app, commit]);

  /** Load a seeded scenario as the active record, without persisting a copy. */
  const loadScenario = useCallback((id) => {
    const seeded = findApplication(id, null);
    if (!seeded) return null;
    setState((s) => ({ ...s, app: seeded }));
    setAnnouncement(`Demo scenario ${id} loaded.`);
    return seeded;
  }, []);

  /** Bring either the saved personal record or a seeded fixture into scope. */
  const activateApplication = useCallback((id) => {
    let activated = null;
    setState((s) => {
      if (s.app?.id === id) { activated = s.app; return s; }
      const found = findApplication(id, s.savedApp);
      if (!found) return s;
      activated = found;
      return { ...s, app: found };
    });
    return activated;
  }, []);

  const clear = useCallback(() => {
    clearDemoData();
    clearTimeout(timer.current);
    pending.current = null;
    setState((s) => ({
      app: s.app?.kind === 'seed' ? s.app : null,
      savedApp: null,
      warning: null,
    }));
    setLastSavedAt(null);
    setSaving(false);
    setAnnouncement('Demo data cleared from this device.');
  }, []);

  const value = useMemo(() => ({
    app,
    savedApp,
    warning,
    online,
    saving,
    lastSavedAt,
    storageBlocked,
    announcement,
    announce: setAnnouncement,
    allowed: allowedEvents(app),
    startApplication,
    updateField,
    selectDocument,
    removeDocument,
    dispatch,
    loadScenario,
    activateApplication,
    clear,
    flush,
    /** Resolve any ID against the person's record first, then the seeds. */
    resolve: (id) => app?.id === id ? app : findApplication(id, savedApp),
  }), [app, savedApp, warning, online, saving, lastSavedAt, storageBlocked, announcement, startApplication,
    updateField, selectDocument, removeDocument, dispatch, loadScenario, activateApplication, clear, flush]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

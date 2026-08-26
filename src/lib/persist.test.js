import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  KEY_APP, KEY_FINDER, KEY_LEGACY, KEY_PREFS, KEY_QUARANTINE, KEY_SEQ,
  clearDemoData, loadApplication, loadLegacyDraft, loadPrefs, nextSequence,
  saveApplication, savePrefs, storageAvailable, storedItems,
} from './persist.js';

class MemoryStorage {
  constructor() { this.data = new Map(); }
  getItem(key) { return this.data.has(key) ? this.data.get(key) : null; }
  setItem(key, value) { this.data.set(key, String(value)); }
  removeItem(key) { this.data.delete(key); }
}

beforeEach(() => {
  vi.stubGlobal('localStorage', new MemoryStorage());
  vi.stubGlobal('sessionStorage', new MemoryStorage());
});

describe('local persistence', () => {
  it('fails safely when browser storage is blocked', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => { throw new Error('blocked'); },
      setItem: () => { throw new Error('blocked'); },
      removeItem: () => { throw new Error('blocked'); },
    });
    expect(storageAvailable()).toBe(false);
    expect(loadApplication()).toEqual({ app: null, warning: 'storage-unavailable' });
    expect(saveApplication({ id: 'demo' })).toBeNull();
  });

  it('reports availability and starts sequence IDs after the reserved scenarios', () => {
    expect(storageAvailable()).toBe(true);
    expect(nextSequence()).toBe(7);
    expect(nextSequence()).toBe(8);
    expect(localStorage.getItem(KEY_SEQ)).toBe('8');
  });

  it('round-trips an application envelope and records a real save timestamp', () => {
    const before = Date.now();
    const savedAt = saveApplication({ id: 'DEMO2026E00007', status: 'DRAFT', data: {} });
    expect(Date.parse(savedAt)).toBeGreaterThanOrEqual(before);
    const { app, warning } = loadApplication();
    expect(warning).toBeNull();
    expect(app).toMatchObject({ schemaVersion: 1, id: 'DEMO2026E00007', updatedAt: savedAt });
  });

  it('migrates an unversioned legacy-shaped application', () => {
    localStorage.setItem(KEY_APP, JSON.stringify({
      submitted: false,
      data: { application_type: 'regular', visa_category: 'tourist', given_name: 'Demo' },
      docs: [{ type: 'passport', name: 'fictional.pdf' }],
    }));
    const { app, warning } = loadApplication();
    expect(warning).toBeNull();
    expect(app).toMatchObject({
      schemaVersion: 1,
      pathId: 'regular',
      status: 'DRAFT',
      documents: [{ slot: 'passport', filename: 'fictional.pdf' }],
    });
  });

  it('recovers only meaningful drafts from the former storage key', () => {
    localStorage.setItem(KEY_LEGACY, JSON.stringify({
      submitted: false,
      data: { application_type: 'evisa', visa_category: 'tourist' },
      docs: [],
    }));
    expect(loadLegacyDraft()).toBeNull();

    localStorage.setItem(KEY_LEGACY, JSON.stringify({
      submitted: false,
      data: { application_type: 'evisa', visa_category: 'tourist', given_name: 'Demo' },
      docs: [],
    }));
    expect(loadLegacyDraft()).toMatchObject({
      id: null, pathId: 'evisa', data: { given_name: 'Demo' },
    });
  });

  it('quarantines unreadable and future-version data instead of discarding it silently', () => {
    localStorage.setItem(KEY_APP, '{broken');
    expect(loadApplication()).toEqual({ app: null, warning: 'unreadable' });
    expect(localStorage.getItem(KEY_QUARANTINE)).toBe('{broken');
    expect(localStorage.getItem(KEY_APP)).toBeNull();

    localStorage.setItem(KEY_APP, JSON.stringify({ schemaVersion: 99, id: 'future' }));
    expect(loadApplication().warning).toBe('from-newer-version');
    expect(localStorage.getItem(KEY_QUARANTINE)).toContain('future');
  });

  it('clears demo records but deliberately preserves accessibility preferences', () => {
    savePrefs({ contrast: 'high', textSize: 'large' });
    localStorage.setItem(KEY_APP, '{}');
    localStorage.setItem(KEY_SEQ, '9');
    sessionStorage.setItem(KEY_FINDER, '{"purpose":"tourism"}');
    clearDemoData();
    expect(localStorage.getItem(KEY_APP)).toBeNull();
    expect(localStorage.getItem(KEY_SEQ)).toBeNull();
    expect(sessionStorage.getItem(KEY_FINDER)).toBeNull();
    expect(loadPrefs()).toEqual({ contrast: 'high', textSize: 'large' });
    expect(localStorage.getItem(KEY_PREFS)).not.toBeNull();
  });

  it('discloses every storage key, presence, size, and clearability', () => {
    savePrefs({ reduceMotion: true });
    sessionStorage.setItem(KEY_FINDER, '{"purpose":"tourism"}');
    const items = storedItems();
    expect(items.map((item) => item.key)).toEqual([
      KEY_APP, KEY_SEQ, KEY_PREFS, KEY_QUARANTINE, KEY_FINDER,
    ]);
    expect(items.find((item) => item.key === KEY_PREFS)).toMatchObject({
      present: true, clearable: false,
    });
    expect(items.find((item) => item.key === KEY_FINDER)).toMatchObject({
      present: true, clearable: true,
    });
  });
});

/**
 * Finder answers live in sessionStorage, not component state.
 *
 * The previous version kept them in `useState`, so a refresh — or a back
 * button pressed one step too far — silently discarded everything the person
 * had answered. sessionStorage is the right lifetime here: it survives a
 * reload, and it goes away when the tab does, which is what someone who was
 * only browsing would expect.
 */

import { KEY_FINDER } from './persist.js';

export function getAnswers() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY_FINDER) || '{}');
  } catch {
    return {};
  }
}

export function setAnswer(id, value) {
  const next = { ...getAnswers(), [id]: value };
  try {
    sessionStorage.setItem(KEY_FINDER, JSON.stringify(next));
  } catch { /* a blocked session store only costs refresh-resilience */ }
  return next;
}

export function clearAnswers() {
  try {
    sessionStorage.removeItem(KEY_FINDER);
  } catch { /* nothing stored, nothing to clear */ }
}

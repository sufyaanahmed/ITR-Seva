import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadPrefs, savePrefs } from '../lib/persist.js';

/**
 * Display preferences.
 *
 * Deliberately a separate context and a separate storage key from the
 * application record: a draft keystroke must not re-render this, and clearing
 * demo data must not reset somebody's text size.
 *
 * Every value here maps to a `data-*` attribute on <html>, which the token
 * layer in index.css reads. No second stylesheet, no rebuild, no flash.
 */

const DEFAULTS = {
  textSize: 'normal', // normal | large | x-large
  contrast: 'standard', // standard | high
  spacing: 'standard', // standard | roomy
  motion: 'system', // system | reduced
  dataSaver: 'off', // off | on
};

const PrefsContext = createContext(null);

export const usePrefs = () => {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error('usePrefs must be used inside <PrefsProvider>');
  return ctx;
};

export function PrefsProvider({ children }) {
  const [prefs, setPrefs] = useState(() => ({ ...DEFAULTS, ...(loadPrefs() || {}) }));

  useEffect(() => {
    const el = document.documentElement;
    el.dataset.textSize = prefs.textSize;
    el.dataset.contrast = prefs.contrast;
    el.dataset.spacing = prefs.spacing;
    el.dataset.saver = prefs.dataSaver;
    // Reduced motion is honoured from the OS by CSS already; this lets someone
    // opt in without changing a system setting they may not control.
    el.dataset.motion = prefs.motion;
    savePrefs(prefs);

    // Keep Data Saver literal: a returning visitor who enabled it never makes
    // a font request. System fallbacks remain deliberate and fully usable.
    const id = 'visa-seva-webfonts';
    const existing = document.getElementById(id);
    if (prefs.dataSaver === 'on') {
      existing?.remove();
    } else if (!existing) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&display=swap';
      document.head.appendChild(link);
    }
  }, [prefs]);

  const value = useMemo(
    () => ({
      prefs,
      set: (key, val) => setPrefs((p) => ({ ...p, [key]: val })),
      reset: () => setPrefs(DEFAULTS),
      /** True when decorative imagery should not even be requested. */
      get imagesSuppressed() {
        return prefs.dataSaver === 'on';
      },
    }),
    [prefs],
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export { DEFAULTS as PREF_DEFAULTS };

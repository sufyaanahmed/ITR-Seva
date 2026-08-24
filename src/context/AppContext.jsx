import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'karsaathi-demo-v1';
const initialState = {
  version: 1,
  language: 'en',
  resolutions: {},
  answers: {},
  started: false,
};

const AppContext = createContext(null);

function isRecord(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!isRecord(parsed) || parsed.version !== 1) return initialState;
    return {
      ...initialState,
      language: ['en', 'hi'].includes(parsed.language) ? parsed.language : initialState.language,
      resolutions: isRecord(parsed.resolutions) ? parsed.resolutions : {},
      answers: isRecord(parsed.answers) ? parsed.answers : {},
      started: parsed.started === true,
    };
  } catch {
    return initialState;
  }
}
export function AppProvider({ children }) {
  const [demo, setDemo] = useState(loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
    } catch {
      // The fictional demo remains usable when storage is blocked or full.
    }
  }, [demo]);

  const actions = useMemo(() => ({
    setLanguage: (language) => setDemo((current) => ({ ...current, language })),
    startDemo: () => setDemo((current) => ({ ...current, started: true })),
    setResolution: (itemId, resolution) => setDemo((current) => ({
      ...current,
      resolutions: { ...current.resolutions, [itemId]: resolution },
    })),
    setAnswer: (questionId, answer) => setDemo((current) => ({
      ...current,
      answers: { ...current.answers, [questionId]: answer },
    })),
    resetDemo: () => setDemo((current) => ({ ...initialState, language: current.language })),
  }), []);

  return <AppContext.Provider value={{ demo, ...actions }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}

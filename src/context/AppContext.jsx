import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export const PROFILE_IDS = Object.freeze(['individual', 'company', 'firm_llp']);
export const STORAGE_KEY = 'karsaathi-demo-v2';
export const LEGACY_STORAGE_KEY = 'karsaathi-demo-v1';

function createJourneyState() {
  return {
    started: false,
    answers: {},
    resolutions: {},
  };
}

export function createInitialState(language = 'en') {
  return {
    version: 2,
    language: ['en', 'hi'].includes(language) ? language : 'en',
    journeys: Object.fromEntries(PROFILE_IDS.map((profileId) => [profileId, createJourneyState()])),
  };
}

const AppContext = createContext(null);

function isRecord(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

export function isProfileId(value) {
  return PROFILE_IDS.includes(value);
}

function sanitizeJourney(value) {
  if (!isRecord(value)) return createJourneyState();
  return {
    started: value.started === true,
    answers: isRecord(value.answers) ? value.answers : {},
    resolutions: isRecord(value.resolutions) ? value.resolutions : {},
  };
}

function parseStoredValue(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

export function loadState() {
  const current = parseStoredValue(STORAGE_KEY);
  if (isRecord(current) && current.version === 2) {
    const state = createInitialState(current.language);
    const storedJourneys = isRecord(current.journeys) ? current.journeys : {};
    PROFILE_IDS.forEach((profileId) => {
      state.journeys[profileId] = sanitizeJourney(storedJourneys[profileId]);
    });
    return state;
  }

  const legacy = parseStoredValue(LEGACY_STORAGE_KEY);
  if (isRecord(legacy) && legacy.version === 1) {
    const migrated = createInitialState(legacy.language);
    migrated.journeys.individual = sanitizeJourney(legacy);
    return migrated;
  }

  return createInitialState();
}

function safeFieldId(value) {
  return typeof value === 'string' && /^[a-z0-9][a-z0-9_-]{0,63}$/i.test(value);
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

  const actions = useMemo(() => {
    const updateJourney = (profileId, update) => {
      if (!isProfileId(profileId)) return;
      setDemo((current) => ({
        ...current,
        journeys: {
          ...current.journeys,
          [profileId]: update(current.journeys[profileId]),
        },
      }));
    };

    const resetJourney = (profileId) => updateJourney(profileId, () => createJourneyState());

    return {
      setLanguage: (language) => {
        if (!['en', 'hi'].includes(language)) return;
        setDemo((current) => ({ ...current, language }));
      },
      startDemo: (profileId) => updateJourney(profileId, (journey) => ({ ...journey, started: true })),
      setResolution: (profileId, itemId, resolution) => {
        if (!safeFieldId(itemId)) return;
        updateJourney(profileId, (journey) => ({
          ...journey,
          resolutions: { ...journey.resolutions, [itemId]: resolution },
        }));
      },
      setAnswer: (profileId, questionId, answer) => {
        if (!safeFieldId(questionId)) return;
        updateJourney(profileId, (journey) => ({
          ...journey,
          answers: { ...journey.answers, [questionId]: answer },
        }));
      },
      resetJourney,
      resetDemo: resetJourney,
    };
  }, []);

  return <AppContext.Provider value={{ demo, ...actions }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}

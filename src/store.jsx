import React, { createContext, useContext, useState, useEffect } from 'react';

const appKey = 'bharat-visa-drafts';

const defaultState = {
  type: 'evisa',
  step: 0,
  data: {
    application_type: 'evisa',
    visa_category: 'tourist'
  },
  docs: [],
  submitted: false
};

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(appKey);
      return saved ? JSON.parse(saved) : defaultState;
    } catch {
      return defaultState;
    }
  });

  useEffect(() => {
    localStorage.setItem(appKey, JSON.stringify(state));
    // IndexedDB backup
    const saveToIDB = async () => {
      try {
        const request = indexedDB.open('bharat-visa-drafts', 1);
        request.onupgradeneeded = () => request.result.createObjectStore('drafts');
        request.onsuccess = () => {
          const db = request.result;
          const tx = db.transaction('drafts', 'readwrite');
          tx.objectStore('drafts').put(state, 'current');
        };
      } catch (e) {
        console.error('IDB Error', e);
      }
    };
    saveToIDB();
  }, [state]);

  const updateState = (newState) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const updateData = (field, value) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value }
    }));
  };

  const addDocument = (type, name) => {
    setState(prev => ({
      ...prev,
      docs: [...prev.docs.filter(d => d.type !== type), { type, name, status: 'uploaded' }]
    }));
  };

  const resetState = () => setState(defaultState);

  return (
    <StoreContext.Provider value={{ state, updateState, updateData, addDocument, resetState }}>
      {children}
    </StoreContext.Provider>
  );
};

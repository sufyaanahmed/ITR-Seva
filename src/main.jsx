import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { StoreProvider } from './state/store.jsx';
import { PrefsProvider } from './state/prefs.jsx';

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PrefsProvider>
        <StoreProvider>
          <App />
        </StoreProvider>
      </PrefsProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

import React, { Suspense, lazy, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ROUTES, REDIRECTS, routeForPath } from './lib/routes.js';
import { useStore } from './state/store.jsx';
import {
  Header, Footer, PrototypeStrip, SkipLink, RouteAnnouncer, ApplicationBar,
} from './components/Shell.jsx';
import { Announcer, Banner } from './ui/feedback.jsx';
import Button from './ui/Button.jsx';

/**
 * The shell.
 *
 * Routes are generated from the registry, so the nav, the sitemap, the agent
 * documentation and the smoke tests can never disagree with what actually
 * renders. Each entry's `component` thunk is also the code-splitting boundary.
 */

const LAZY = Object.fromEntries(ROUTES.map((r) => [r.id, lazy(r.component)]));

/** Routes that need the active application id resolve it at runtime. */
function ActiveApplicationRedirect({ suffix = '' }) {
  const { app } = useStore();
  if (!app) return <Navigate to="/start" replace />;
  return <Navigate to={`/application/${app.id}${suffix}`} replace />;
}

function RouteFallback() {
  return (
    <div className="shell py-12">
      <p className="text-body text-ink-muted" role="status">Loading…</p>
    </div>
  );
}

/**
 * A recoverable failure. A blank page is the one outcome a nervous traveller
 * must never get, so an unexpected error still leaves them somewhere to go.
 */
class Boundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="shell py-12 max-w-prose">
        <h1 className="font-display text-display-m mb-4">Something went wrong on this page</h1>
        <Banner tone="warning" title="Your saved answers are untouched">
          This is a prototype and this page failed to load. Answers already
          confirmed as saved remain in this browser.
        </Banner>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button to="/">Go to the start</Button>
          <Button variant="secondary" onClick={() => window.location.reload()}>Try again</Button>
        </div>
      </div>
    );
  }
}

export default function App() {
  const location = useLocation();
  const route = useMemo(() => routeForPath(location.pathname), [location.pathname]);
  const { announcement, app, online, activateApplication } = useStore();
  const inApplication = route.group === 'application';
  const scopedAppId = location.pathname.match(/^\/application\/([^/]+)/)?.[1] || null;

  useEffect(() => {
    if (scopedAppId && app?.id !== scopedAppId) activateApplication(scopedAppId);
  }, [activateApplication, app?.id, scopedAppId]);

  return (
    <div className="min-h-screen flex flex-col bg-paper-0 text-ink">
      <SkipLink />
      <PrototypeStrip />
      <Header />
      {inApplication && <ApplicationBar />}
      {!online && (
        <div className="shell pt-4 no-print">
          <Banner tone="warning" title="You are offline" live>
            Answers confirmed as saved remain on this device. The current page
            may keep working, but pages not opened before and official links can
            need a connection. Check the save indicator before closing the tab.
          </Banner>
        </div>
      )}

      <main id="main" tabIndex={-1} className="flex-1 w-full">
        <Boundary key={location.pathname}>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              {REDIRECTS.map((r) => (
                <Route key={r.from} path={r.from} element={<Navigate to={r.to} replace />} />
              ))}
              <Route path="/apply" element={<ActiveApplicationRedirect />} />
              <Route path="/dashboard" element={<ActiveApplicationRedirect />} />
              <Route path="/status" element={<Navigate to="/track" replace />} />

              {ROUTES.map((r) => {
                const Page = LAZY[r.id];
                return <Route key={r.id} path={r.path} element={<Page />} />;
              })}
            </Routes>
          </Suspense>
        </Boundary>
      </main>

      <Footer />
      <RouteAnnouncer />
      <Announcer message={announcement} />
    </div>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Page, { Section } from '../ui/Page.jsx';
import Button from '../ui/Button.jsx';
import { Banner, StatusBadge } from '../ui/feedback.jsx';
import { SCENARIOS, SEED_BY_ID } from '../lib/demo-seed.js';
import { useStore } from '../state/store.jsx';
import { usePrefs } from '../state/prefs.jsx';

export default function Demo() {
  const { loadScenario, online } = useStore();
  const { prefs, set, reset } = usePrefs();
  const navigate = useNavigate();

  const openScenario = (id) => {
    const loaded = loadScenario(id);
    if (loaded) navigate(`/application/${loaded.id}`);
  };

  const setConnection = (connected) => {
    window.dispatchEvent(new Event(connected ? 'online' : 'offline'));
  };

  const lowVisionMode = () => {
    set('textSize', 'x-large');
    set('contrast', 'high');
    set('spacing', 'roomy');
    set('motion', 'reduced');
  };

  return (
    <Page
      routeId="demo"
      eyebrow="Reviewer and testing surface"
      title="Demo scenarios"
      lede="Six deterministic fictional records expose the whole application lifecycle. Nothing here is official, live or connected to a government service."
      width="dashboard"
      decor
    >
      <Banner tone="warning" title="Every person and document is invented" className="mb-10">
        Seeded records are session-only fixtures. Loading one changes the active record for this tab; any exploration resets on reload and cannot submit, approve or refuse anything in the real world.
      </Banner>

      <ol className="list-none m-0 p-0 border-t border-rule-strong">
        {SCENARIOS.map((scenario, index) => {
          const record = SEED_BY_ID[scenario.id];
          return (
            <li key={scenario.id} className="grid gap-4 lg:grid-cols-[4rem_1fr_auto] lg:items-center py-7 border-b border-rule-strong">
              <span className="text-overline numeric text-ink-faint">0{index + 1}</span>
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="font-display text-title text-ink">{scenario.title}</h2>
                  <StatusBadge status={record.status} />
                </div>
                <p className="text-body text-ink-muted max-w-prose mb-3">{scenario.blurb}</p>
                <p className="text-meta text-ink-faint">
                  Reference <span className="numeric font-semibold text-ink">{record.id}</span> · access code <span className="numeric font-semibold text-ink">{record.accessCode}</span>
                </p>
              </div>
              <Button variant="secondary" onClick={() => openScenario(record.id)} aria-label={`Load ${scenario.title} scenario`}>
                Load scenario
              </Button>
            </li>
          );
        })}
      </ol>

      <Section title="Test interruption and low-connectivity behaviour">
        <div className="border border-rule-strong bg-paper-1 p-6 sm:p-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-body font-semibold text-ink mb-1">
              Connection indicator: <span className={online ? 'text-success' : 'text-warning'}>{online ? 'online' : 'offline simulation'}</span>
            </p>
            <p className="text-body text-ink-muted max-w-prose">
              This changes the interface indicator only; it does not control the browser’s real network. Use browser tools for a true offline test.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => setConnection(false)}>Simulate offline</Button>
            <Button variant="quiet" onClick={() => setConnection(true)}>Restore indicator</Button>
          </div>
        </div>
        <div className="mt-4 border border-rule-strong bg-paper-1 p-6 sm:p-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-body font-semibold text-ink mb-1">Data Saver: {prefs.dataSaver === 'on' ? 'on' : 'off'}</p>
            <p className="text-body text-ink-muted max-w-prose">Decorative images and patterns are suppressed while service content remains available.</p>
          </div>
          <Button variant="secondary" onClick={() => set('dataSaver', prefs.dataSaver === 'on' ? 'off' : 'on')}>
            Turn Data Saver {prefs.dataSaver === 'on' ? 'off' : 'on'}
          </Button>
        </div>
      </Section>

      <Section title="Accessibility review modes">
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="border-t border-rule-strong pt-5">
            <h3 className="text-subhead font-semibold text-ink mb-2">Elderly or low-vision mode</h3>
            <p className="text-body text-ink-muted mb-5">Uses the largest text, high contrast, roomier spacing and reduced motion together.</p>
            <Button variant="secondary" onClick={lowVisionMode}>Apply review mode</Button>
          </div>
          <div className="border-t border-rule-strong pt-5">
            <h3 className="text-subhead font-semibold text-ink mb-2">Reset display preferences</h3>
            <p className="text-body text-ink-muted mb-5">Returns text, contrast, spacing, motion and Data Saver to their defaults.</p>
            <Button variant="quiet" onClick={reset}>Reset preferences</Button>
          </div>
        </div>
      </Section>
    </Page>
  );
}

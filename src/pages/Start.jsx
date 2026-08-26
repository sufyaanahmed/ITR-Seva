import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../state/store.jsx';
import { STATE_META } from '../lib/application.js';
import Page, { Section } from '../ui/Page.jsx';
import Button from '../ui/Button.jsx';
import { ConfirmAction } from '../ui/structure.jsx';

export default function Start() {
  const { savedApp, startApplication } = useStore();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const begin = (replaceExisting = false) => {
    const created = startApplication({ pathId: 'evisa', category: 'tourist', replaceExisting });
    if (created) navigate(`/application/${created.id}/stage/setup`);
  };

  return (
    <Page
      routeId="start"
      title={savedApp ? 'Continue or start again' : 'Start a practice application'}
      lede="Use made-up details. Nothing leaves this browser."
    >
      {savedApp && (
        <section className="border-y border-rule-strong py-6 mb-10">
          <p className="text-overline uppercase text-ink-muted mb-2">Saved on this device</p>
          <h2 className="text-title font-semibold text-ink mb-2">Continue where you left off</h2>
          <p className="text-body text-ink-muted mb-5">
            <span className="numeric font-semibold text-ink">{savedApp.id}</span> · {STATE_META[savedApp.status]?.label}
          </p>
          <Button to={`/application/${savedApp.id}`} size="lg">Continue application</Button>
        </section>
      )}

      <Section title="Practice the e-Visa form" className={savedApp ? '' : 'mt-0'}>
        <p className="text-body text-ink-muted max-w-prose mb-5">
          The prototype models this route because it has a published online process. It is practice, not an application.
        </p>
        <Button onClick={() => savedApp ? setConfirming(true) : begin()} size="lg">
          {savedApp ? 'Start again' : 'Start the e-Visa demo'}
        </Button>
      </Section>

      <Section title="Need another route?">
        <p className="text-body text-ink-muted max-w-prose mb-4">
          Regular visas, Visa on Arrival and the separate Afghan-national route use different official journeys.
        </p>
        <Link to="/requirements" className="inline-flex min-h-touch items-center text-indigo underline underline-offset-4">
          Compare all four routes
        </Link>
      </Section>

      <p className="mt-10 pt-5 border-t border-rule text-meta text-ink-muted">
        Already have a reference and access code? <Link to="/track" className="text-indigo underline underline-offset-4">Track or reopen it</Link>.
      </p>

      <ConfirmAction
        open={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={() => { setConfirming(false); begin(true); }}
        title="Replace the saved demo application?"
        confirmLabel="Replace and start again"
        tone="danger"
      >
        This removes <span className="numeric font-semibold">{savedApp?.id}</span> and its saved answers from this browser.
      </ConfirmAction>
    </Page>
  );
}

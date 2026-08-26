import React, { useState } from 'react';
import Page, { Section } from '../ui/Page.jsx';
import Button from '../ui/Button.jsx';
import { Banner } from '../ui/feedback.jsx';
import { ConfirmAction, DefinitionList } from '../ui/structure.jsx';
import { storedItems } from '../lib/persist.js';
import { useStore } from '../state/store.jsx';

const number = new Intl.NumberFormat();

export default function YourData() {
  const { savedApp, clear, storageBlocked } = useStore();
  const [confirming, setConfirming] = useState(false);
  const [cleared, setCleared] = useState(false);
  const items = storedItems();

  const clearApplication = () => {
    clear();
    setCleared(true);
    setConfirming(false);
  };

  const totalBytes = items.reduce((sum, item) => sum + item.bytes, 0);

  return (
    <Page
      routeId="your-data"
      eyebrow="Plain-language privacy"
      title="Your data on this device"
      lede="Visa-Seva has no account, server or analytics pipeline. The fictional details you enter are kept in this browser so a draft can survive a refresh."
      width="doc"
    >
      {storageBlocked && (
        <Banner tone="warning" title="This browser is blocking local storage" className="mb-8">
          There may be nothing to clear, and any current answers will disappear when the page closes.
        </Banner>
      )}
      {cleared && (
        <Banner tone="success" title="Demo application data cleared" live className="mb-8">
          The application, sequence counter and any unreadable draft copy were removed. Your accessibility and Data Saver preferences were deliberately kept.
        </Banner>
      )}

      <div className="border border-rule-strong bg-paper-1 p-6 sm:p-8">
        <p className="text-overline uppercase text-ink-muted mb-2">Stored now</p>
        <p className="font-display text-display-m numeric text-ink mb-1">{number.format(totalBytes)} bytes</p>
        <p className="text-meta text-ink-muted">A small local record, never uploaded by this prototype.</p>
      </div>

      <Section title="What the browser may hold">
        <DefinitionList
          items={items.map((item) => ({
            term: item.present ? `${item.key} · stored` : `${item.key} · not stored`,
            value: `${item.purpose} ${item.present ? `${number.format(item.bytes)} bytes.` : ''}${item.clearable ? ' Cleared by the button below.' : ' Kept when demo data is cleared.'}`,
          }))}
        />
      </Section>

      <Section title="What is never stored">
        <ul className="grid gap-4 sm:grid-cols-2 list-none m-0 p-0">
          {[
            ['Document contents', 'The prototype remembers a chosen file’s name, size and slot only. It never reads or saves the file itself.'],
            ['Real submissions', 'There is no government connection, account, inbox or person receiving what you type.'],
            ['Payment details', 'The payment page is simulated and has no fields for cards, banks or wallets.'],
            ['Tracking analytics', 'This build does not send an analytics or advertising identifier anywhere.'],
          ].map(([title, body]) => (
            <li key={title} className="border-t border-rule pt-4">
              <h3 className="text-subhead font-semibold text-ink mb-1">{title}</h3>
              <p className="text-body text-ink-muted">{body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Clear the fictional application">
        <p className="text-body text-ink-muted max-w-prose mb-5">
          This removes the saved application{savedApp ? ` ${savedApp.id}` : ''}, its local reference counter, finder answers for this tab and any quarantined old draft. It cannot be undone. Display preferences stay in place because they may be accessibility needs, not application data.
        </p>
        <Button variant="danger" onClick={() => setConfirming(true)} disabled={!items.some((item) => item.clearable && item.present)}>
          Clear demo application data
        </Button>
      </Section>

      <ConfirmAction
        open={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={clearApplication}
        title="Clear demo application data?"
        confirmLabel="Clear this device"
        tone="danger"
      >
        The saved fictional application and its local reference counter will be removed from this browser. This cannot be undone. Your display preferences will remain.
      </ConfirmAction>
    </Page>
  );
}

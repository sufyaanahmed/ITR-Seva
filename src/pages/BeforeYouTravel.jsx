import React from 'react';
import Page, { Section, SourceNote } from '../ui/Page.jsx';
import Button, { ExternalLink } from '../ui/Button.jsx';
import { StatusBadge } from '../ui/feedback.jsx';
import { Disclosure } from '../ui/structure.jsx';
import { TRAVEL_CHECKLIST } from '../lib/content.js';
import { EVISA_PORTS, EARRIVAL } from '../lib/rules/reference.js';
import { SOURCES } from '../lib/rules/sources.js';
import { useStore } from '../state/store.jsx';

function PortDisclosure({ title, entries }) {
  return (
    <Disclosure summary={`${title} (${entries.length})`}>
      <p className="leading-7">{entries.join(' · ')}</p>
    </Disclosure>
  );
}

export default function BeforeYouTravel() {
  const { app } = useStore();
  const granted = app?.status === 'GRANTED';

  return (
    <Page
      routeId="before-you-travel"
      eyebrow="Arrival readiness"
      title="Before you travel"
      lede="A calm final check for travellers using an e-Visa. A visa or authorisation never guarantees admission; the Immigration Officer at the port makes that decision."
      width="dashboard"
    >
      {granted && (
        <div className="border-l-rail border-terracotta bg-paper-2 p-6 sm:p-8 mb-10">
          <p className="text-overline uppercase text-ink-muted mb-3">Your loaded demo record</p>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <h2 className="font-display text-title text-ink">Prepare for the journey</h2>
            <StatusBadge status={app.status} />
          </div>
          <p className="text-body text-ink-muted max-w-prose mb-5">
            The record <span className="numeric font-semibold text-ink">{app.id}</span> is granted only inside this fictional scenario. Its ETA is watermarked and has no travel value.
          </p>
          <Button to={`/application/${app.id}/status`} variant="secondary">Return to demo status</Button>
        </div>
      )}

      <ol className="list-none m-0 p-0 border-t border-rule-strong">
        {TRAVEL_CHECKLIST.map((item, index) => (
          <li key={item.id} className="grid sm:grid-cols-[4rem_1fr] gap-2 sm:gap-5 py-7 border-b border-rule-strong">
            <span aria-hidden="true" className="text-overline numeric text-terracotta-ink">0{index + 1}</span>
            <div>
              <h2 className="font-display text-title text-ink mb-2">{item.title}</h2>
              <p className="text-body text-ink-muted max-w-prose">{item.body}</p>
              {item.external && (
                <p className="mt-4"><ExternalLink href={item.external}>{item.externalLabel}</ExternalLink></p>
              )}
              <p className="text-meta text-ink-faint mt-4">
                Source: <ExternalLink href={item.source.url}>{item.source.title}</ExternalLink>
              </p>
            </div>
          </li>
        ))}
      </ol>

      <Section title="Check your arrival port">
        <p className="text-body text-ink-muted max-w-prose mb-5">
          An e-Visa can only be used to enter at a designated port. The lists below are transcribed from the official page; confirm them again before booking.
        </p>
        <div className="border-b border-rule max-w-doc">
          <PortDisclosure title="Airports" entries={EVISA_PORTS.airports} />
          <PortDisclosure title="Seaports" entries={EVISA_PORTS.seaports} />
          <PortDisclosure title="Land check posts" entries={EVISA_PORTS.landCheckPosts} />
        </div>
        <p className="text-body text-ink-muted mt-4">{EVISA_PORTS.exitNote}</p>
        <SourceNote source={SOURCES.evisa} />
      </Section>

      <Section title="The e-Arrival Card is separate">
        <div className="grid lg:grid-cols-[7fr_5fr] gap-8 border-y border-rule-strong py-7">
          <div>
            <p className="text-body text-ink-muted max-w-prose mb-3">{EARRIVAL.summary}</p>
            <p className="text-body text-ink-muted max-w-prose">{EARRIVAL.appliesTo} The published filing guidance says {EARRIVAL.window}.</p>
          </div>
          <div className="lg:border-l lg:border-rule lg:pl-8">
            <p className="font-semibold text-ink mb-3">It is not a visa and does not let you enter India on its own.</p>
            <ExternalLink href={EARRIVAL.url}>Open the official e-Arrival Card service</ExternalLink>
          </div>
        </div>
        <SourceNote source={SOURCES.earrivalWindow} />
      </Section>
    </Page>
  );
}

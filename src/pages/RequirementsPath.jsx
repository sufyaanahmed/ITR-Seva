import React from 'react';
import { useParams } from 'react-router-dom';
import Page, { RuleList, Section, SourceNote } from '../ui/Page.jsx';
import Button, { ExternalLink } from '../ui/Button.jsx';
import { Banner } from '../ui/feedback.jsx';
import { Disclosure } from '../ui/structure.jsx';
import { PATHS } from '../lib/content.js';

function PortList({ label, items }) {
  if (!items?.length) return null;
  return (
    <Disclosure summary={`${label} (${items.length})`}>
      <p className="leading-7">{items.join(' · ')}</p>
    </Disclosure>
  );
}

export default function RequirementsPath() {
  const { pathId } = useParams();
  const path = PATHS[pathId];

  if (!path) {
    return (
      <Page routeId="requirements-path" title="We do not recognise that visa route" lede="Choose one of the four routes covered by this prototype.">
        <Button to="/requirements">See all requirements</Button>
      </Page>
    );
  }

  const canDemo = path.id === 'evisa';

  return (
    <Page
      routeId="requirements-path"
      eyebrow={path.strapline}
      title={`${path.name} requirements`}
      lede={path.intro}
      width="dashboard"
    >
      <p className="text-meta text-ink-muted border-t border-rule-strong pt-4">
        Published guidance, not an eligibility decision. Confirm changes on the official page.
      </p>

      <div className="grid lg:grid-cols-[minmax(0,7fr)_minmax(18rem,5fr)] gap-10 lg:gap-14 mt-8">
        <aside className="lg:col-start-2 lg:row-start-1 lg:border-l lg:border-rule lg:pl-8">
          <p className="text-overline uppercase text-ink-muted mb-3">Next step</p>
          <h2 className="font-display text-title text-ink mb-3">Confirm, then continue</h2>
          <div className="grid gap-3">
            <ExternalLink href={path.source.url}>Read the official guidance</ExternalLink>
            {canDemo && <Button to="/start" variant="secondary">Start a fictional application</Button>}
            <Button to="/find/q/1" variant="quiet">Check the likely path first</Button>
          </div>
          <SourceNote source={path.source} />
        </aside>

        <div className="lg:col-start-1 lg:row-start-1">
          <Section title="What you will need" className="mt-0">
            <RuleList items={path.documents} />
          </Section>

          <Section title="Published conditions">
            <RuleList items={path.conditions} />
          </Section>

          {path.limits?.length > 0 && (
            <Section title="Stay limits">
              <RuleList items={path.limits} />
            </Section>
          )}

          {path.exclusions?.length > 0 && (
            <Section title="When this route does not apply">
              <Banner tone="warning">
                <RuleList items={path.exclusions} className="border-rule-strong" />
              </Banner>
            </Section>
          )}

          {path.fees?.length > 0 && (
            <Section title="What the official page says about fees">
              <RuleList items={path.fees} />
            </Section>
          )}

          {path.ports && (
            <Section title="Where this route can be used">
              <div className="border-b border-rule">
                <PortList label="Airports" items={path.ports.airports} />
                <PortList label="Seaports" items={path.ports.seaports} />
                <PortList label="Land check posts" items={path.ports.landCheckPosts} />
              </div>
              {path.ports.exitNote && <p className="text-body text-ink-muted mt-4">{path.ports.exitNote}</p>}
            </Section>
          )}
        </div>

      </div>
    </Page>
  );
}

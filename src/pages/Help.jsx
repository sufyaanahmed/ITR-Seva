import React from 'react';
import Page, { Section, SourceNote } from '../ui/Page.jsx';
import Button, { ExternalLink } from '../ui/Button.jsx';
import { Disclosure } from '../ui/structure.jsx';
import { Banner } from '../ui/feedback.jsx';
import { FAQ, GLOSSARY } from '../lib/content.js';
import {
  OFFICIAL_CONTACT, INTERMEDIARY_WARNING, SOURCES,
} from '../lib/rules/sources.js';

export default function Help() {
  return (
    <Page
      routeId="help"
      eyebrow="Clear answers, real contacts"
      title="Clear answers. Real contacts."
      lede="This prototype can explain its guidance and your demo data. For a real application, it hands you clearly to the Government of India."
      width="doc"
      decor
    >
      <Banner tone="warning" title="This is a prototype, not a support desk">
        Nobody receives messages through Visa-Seva, and nothing you do here reaches
        the Government of India. Do not enter real passport, payment or identity details.
      </Banner>

      <Section title="Frequently asked questions">
        <div className="border-t border-rule">
          {FAQ.map((item) => (
            <Disclosure key={item.q} summary={item.q} className="border-b border-rule">
              <p className="max-w-prose text-ink-muted">{item.a}</p>
            </Disclosure>
          ))}
        </div>
      </Section>

      <Section title="Ask the real e-Visa team">
        <div className="border border-rule-strong bg-paper-1 p-6 sm:p-8">
          <p className="text-body text-ink-muted max-w-prose">
            The Government of India publishes these contacts for e-Visa questions.
            Availability and response times are controlled by the official service,
            not by Visa-Seva.
          </p>
          <dl className="mt-6 grid gap-5 sm:grid-cols-[9rem_1fr]">
            <dt className="text-label uppercase tracking-[0.08em] text-ink-faint">Telephone</dt>
            <dd className="flex flex-col items-start gap-2">
              {OFFICIAL_CONTACT.phones.map((phone) => (
                <a key={phone} className="text-indigo underline underline-offset-4 numeric" href={`tel:${phone.replace(/\s/g, '')}`}>
                  {phone}
                </a>
              ))}
            </dd>
            <dt className="text-label uppercase tracking-[0.08em] text-ink-faint">Email</dt>
            <dd>
              <a className="text-indigo underline underline-offset-4 break-all" href={`mailto:${OFFICIAL_CONTACT.email}`}>
                {OFFICIAL_CONTACT.email}
              </a>
            </dd>
          </dl>
          <SourceNote source={OFFICIAL_CONTACT.source} />
        </div>
      </Section>

      <Section title="A warning about intermediaries">
        <blockquote className="border-l-rail border-gold pl-5 text-body text-ink-muted max-w-prose">
          {INTERMEDIARY_WARNING}
        </blockquote>
        <p className="mt-5">
          <ExternalLink href={SOURCES.portal.url}>Open the official Indian visa portal</ExternalLink>
        </p>
        <SourceNote source={SOURCES.portal} />
      </Section>

      <Section title="Words you may meet">
        <div className="border-t border-rule columns-1 md:columns-2 md:gap-10">
          {GLOSSARY.map((item) => (
            <div key={item.term} className="break-inside-avoid border-b border-rule py-5">
              <h3 className="text-subhead font-semibold text-ink">{item.term}</h3>
              <p className="mt-2 text-body text-ink-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button to="/help/your-data" variant="secondary">See what this prototype stores</Button>
        <Button to="/site-map" variant="quiet">Browse every page</Button>
      </div>
    </Page>
  );
}

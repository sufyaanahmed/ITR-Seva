import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { FORM_STAGES, requiredDocuments, visibleFields } from '../lib/application.js';
import { optionsFor } from '../lib/fields.js';
import { PATHS } from '../lib/content.js';
import { useStore } from '../state/store.jsx';
import Page, { Section } from '../ui/Page.jsx';
import Button from '../ui/Button.jsx';
import { DefinitionList, Timeline } from '../ui/structure.jsx';

function valueFor(field, app) {
  const value = app.data[field.name];
  if (value === undefined || value === null || value === '') return null;
  return optionsFor(field, app.data).find((option) => option.value === value)?.label || value;
}

export default function Print() {
  const { appId } = useParams();
  const { resolve } = useStore();
  const app = resolve(appId);
  if (!app) return <Navigate to="/track" replace />;
  const name = [app.data.given_name, app.data.surname].filter(Boolean).join(' ');

  return (
    <Page routeId="application-print" title="Demo application record" lede="A printable local artefact that identifies itself as fictional even when separated from this website." width="doc">
      <div aria-hidden="true" className="hidden print:flex fixed inset-0 items-center justify-center pointer-events-none z-50">
        <p className="-rotate-[32deg] text-[54pt] leading-none font-bold text-danger opacity-[0.10] text-center">PROTOTYPE<br />NOT OFFICIAL</p>
      </div>

      <div className="no-print flex flex-wrap gap-3 mb-8">
        <Button onClick={() => window.print()}>Print or save as PDF</Button>
        <Button variant="secondary" to={`/application/${app.id}`}>Back to application</Button>
      </div>

      <article className="print-sheet relative border border-rule-strong bg-paper-1 p-6 sm:p-10 overflow-hidden">
        <header className="border-b-rail border-indigo pb-7 mb-8 pr-20">
          <p className="text-overline uppercase text-danger mb-2">Prototype · not an official visa document</p>
          <h2 className="font-display text-display-m text-ink mb-3">{app.status === 'GRANTED' ? 'Fictional electronic travel authorisation' : 'Fictional application record'}</h2>
          <p className="text-body text-ink-muted">This page was generated locally. It was not issued, reviewed or endorsed by the Government of India.</p>
        </header>

        <div className="flex flex-col sm:flex-row items-start justify-between gap-7 mb-8">
          <dl className="grid gap-3 text-body">
            <div><dt className="text-meta text-ink-muted">Application reference</dt><dd className="numeric text-subhead font-semibold">{app.id}</dd></div>
            {app.decision?.etaNumber && <div><dt className="text-meta text-ink-muted">Demo ETA number</dt><dd className="numeric font-semibold">{app.decision.etaNumber}</dd></div>}
            <div><dt className="text-meta text-ink-muted">Applicant</dt><dd>{name || 'Not answered'}</dd></div>
            <div><dt className="text-meta text-ink-muted">Visa route</dt><dd>{PATHS[app.pathId]?.name || app.pathId}</dd></div>
          </dl>
          <p className="text-subhead font-semibold text-ink">{app.status === 'GRANTED' ? 'Granted in this demo' : 'Demo record'}</p>
        </div>

        {FORM_STAGES.map((stage) => (
          <Section key={stage.id} title={stage.title} className="break-inside-avoid border-t border-rule pt-6">
            <DefinitionList items={visibleFields(stage, app.data).map((field) => {
              const value = valueFor(field, app);
              return { term: field.label, value, missing: !value && field.required };
            })} />
          </Section>
        ))}

        <Section title="Document metadata" className="break-inside-avoid border-t border-rule pt-6">
          <DefinitionList items={requiredDocuments(app.data).map((req) => {
            const doc = app.documents.find((item) => item.slot === req.type);
            return { term: req.title, value: doc?.filename, missing: !doc };
          })} />
        </Section>

        <Section title="Demo timeline" className="break-inside-avoid border-t border-rule pt-6"><Timeline events={app.timeline} /></Section>
        <footer className="mt-10 pt-6 border-t-rail border-danger text-meta text-danger font-semibold uppercase tracking-[0.08em]">Prototype — not an official visa or travel document — {app.id}</footer>
      </article>
    </Page>
  );
}

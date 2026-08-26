import React from 'react';
import { Link } from 'react-router-dom';
import Page, { SourceNote } from '../ui/Page.jsx';
import { PATH_LIST } from '../lib/content.js';

export default function Requirements() {
  return (
    <Page
      routeId="requirements"
      eyebrow="Prepare before you begin"
      title="Documents and requirements"
      lede="Choose the likely visa route to see its published conditions, document checklist and official source. This is preparation, not an eligibility decision."
      width="dashboard"
      decor
    >
      <ul className="list-none m-0 p-0 border-t border-rule-strong">
        {PATH_LIST.map((path, index) => (
          <li key={path.id} className="border-b border-rule-strong">
            <Link
              to={`/requirements/${path.id}`}
              className="group grid gap-3 sm:grid-cols-[4rem_1fr_auto] sm:items-baseline py-7 px-3 -mx-3 no-underline hover:bg-paper-2 transition-colors duration-quick"
            >
              <span className="text-overline numeric text-ink-faint">0{index + 1}</span>
              <span>
                <span className="block font-display text-title text-ink mb-1">{path.name}</span>
                <span className="block text-body text-ink-muted max-w-prose">{path.strapline}</span>
                <span className="block text-meta text-ink-faint mt-2">
                  {path.documents.length} {path.documents.length === 1 ? 'document item' : 'document items'} · {path.conditions.length} published {path.conditions.length === 1 ? 'condition' : 'conditions'}
                </span>
              </span>
              <span className="text-indigo text-subhead" aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 border-l-rail border border-gold bg-paper-2 p-6 max-w-prose">
        <h2 className="font-display text-title text-ink mb-2">A checklist is a beginning, not permission to travel</h2>
        <p className="text-body text-ink-muted">
          Visa rules depend on the passport, purpose, travel history and individual circumstances. The Government of India or the relevant Indian Mission makes the real decision. Confirm every requirement before paying or booking around it.
        </p>
      </div>

      <div className="mt-8 grid gap-1">
        {PATH_LIST.map((path) => <SourceNote key={path.id} source={path.source} className="mt-0" />)}
      </div>
    </Page>
  );
}

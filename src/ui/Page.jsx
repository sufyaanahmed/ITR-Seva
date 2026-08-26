import React from 'react';
import { Breadcrumbs } from '../components/Shell.jsx';
import { ExternalLink } from './Button.jsx';

const WIDTH = {
  prose: 'max-w-prose',
  form: 'max-w-form',
  doc: 'max-w-doc',
  dashboard: 'max-w-dashboard',
  full: 'max-w-shell',
};

/**
 * The standard page frame.
 *
 * Every route uses it, so heading level, breadcrumb placement, measure and
 * vertical rhythm are decided once. `<h1>` is here rather than in each page
 * because RouteAnnouncer moves focus to `main h1` on navigation, and exactly
 * one must exist.
 */
export default function Page({
  routeId, eyebrow, title, lede, width = 'doc', children, aside, decor = false,
}) {
  return (
    <div className={decor ? 'jali-ghost' : undefined}>
      <div className={`shell py-9 ${WIDTH[width]}`}>
        {routeId && <Breadcrumbs routeId={routeId} />}
        {eyebrow && (
          <p className="text-overline uppercase text-ink-muted mb-3">{eyebrow}</p>
        )}
        <h1 className="font-display text-display-m text-ink mb-4 text-balance">{title}</h1>
        {lede && <p className="text-lede text-ink-muted max-w-prose mb-8">{lede}</p>}
        {aside}
        {children}
      </div>
    </div>
  );
}

/**
 * The provenance line under any factual claim.
 *
 * Shown wherever a rule is rendered, because a date-stamped source is the
 * difference between guidance and assertion.
 */
export function SourceNote({ source, reviewedAt, className = '' }) {
  if (!source) return null;
  return (
    <p className={`text-meta text-ink-faint mt-4 ${className}`}>
      Read from{' '}
      <ExternalLink href={source.url} className="text-ink-muted">{source.title}</ExternalLink>{' '}
      on{' '}
      <span className="numeric">
        {new Date(`${reviewedAt || source.reviewedAt}T00:00:00Z`).toLocaleDateString(undefined, {
          day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
        })}
      </span>
      . Visa rules change without notice — confirm on the official site before you rely on this.
    </p>
  );
}

export function Section({ title, children, className = '' }) {
  return (
    <section className={`mt-10 ${className}`}>
      {title && <h2 className="font-display text-title text-ink mb-4">{title}</h2>}
      {children}
    </section>
  );
}

/** A plain rule-separated list. Used instead of card grids throughout. */
export function RuleList({ items, className = '' }) {
  return (
    <ul className={`list-none m-0 p-0 border-t border-rule ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="border-b border-rule py-4 flex gap-4 text-body text-ink-muted">
          <span aria-hidden="true" className="text-indigo shrink-0">—</span>
          <span className="max-w-prose">{item}</span>
        </li>
      ))}
    </ul>
  );
}

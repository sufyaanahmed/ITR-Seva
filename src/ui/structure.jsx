import React, { useEffect, useId, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button.jsx';

/* ------------------------------------------------------------------ */
/* Stage progress — "the ledger rail"                                  */
/* ------------------------------------------------------------------ */

/**
 * Progress through the application, as a real ordered list with a stitched
 * seam drawn beside it — the perforation down a passport gutter.
 *
 * The list is the truth; the rail is decoration over it. On mobile the list
 * collapses to one line rather than becoming a horizontal scroll container
 * that keyboard users cannot reach.
 */
export function StageProgress({ stages, currentId, appId }) {
  const index = stages.findIndex((s) => s.id === currentId);
  const current = index >= 0 ? index : 0;
  const done = stages.filter((s) => s.complete).length;

  return (
    <div>
      <div
        role="progressbar"
        aria-valuenow={done}
        aria-valuemin={0}
        aria-valuemax={stages.length}
        aria-label={`Application progress: ${done} of ${stages.length} sections currently have all required answers`}
        className="h-[3px] w-full bg-rule mb-2"
      >
        <div
          className="h-full bg-indigo transition-[width] duration-base ease-out"
          style={{ width: `${(done / stages.length) * 100}%` }}
        />
      </div>

      <p className="text-meta text-ink-muted mb-4 sm:hidden">
        {done === stages.length ? (
          <>All <span className="numeric">{stages.length}</span> sections have their required answers</>
        ) : (
          <>Step <span className="numeric">{current + 1}</span> of{' '}
            <span className="numeric">{stages.length}</span> — {stages[current]?.title}</>
        )}
      </p>

      <ol className="hidden sm:grid gap-1">
        {stages.map((s, i) => {
          const isCurrent = s.id === currentId;
          const state = s.complete ? 'Required answers present' : isCurrent ? 'In progress' : 'Not started';
          const reachable = s.complete || isCurrent;
          const row = (
            <>
              <span aria-hidden="true" className="numeric text-ink-faint w-4">{i + 1}</span>
              <span className="flex-1">{s.title}</span>
              <span className={s.complete ? 'text-success' : 'text-ink-faint'}>
                <span aria-hidden="true">{s.complete ? '✓' : isCurrent ? '●' : '○'}</span>
                <span className="sr-only">{state}</span>
              </span>
            </>
          );
          return (
            <li key={s.id}>
              {reachable ? (
                <Link
                  to={s.id === 'review'
                    ? `/application/${appId}/review`
                    : s.id === 'submit'
                      ? `/application/${appId}/submit`
                      : `/application/${appId}/stage/${s.id}`}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={`flex items-baseline gap-3 min-h-touch py-2 px-2 -mx-2 text-meta hover:bg-paper-2 transition-colors duration-quick
                    ${isCurrent ? 'font-semibold text-ink border-l-rail border-indigo pl-3 -ml-3' : 'text-ink-muted'}`}
                >{row}</Link>
              ) : (
                <div className="flex items-baseline gap-3 min-h-touch py-2 px-2 -mx-2 text-meta text-ink-faint" aria-disabled="true">{row}</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Timeline                                                            */
/* ------------------------------------------------------------------ */

/** Derived entirely from the record's own events — never hard-coded markup. */
export function Timeline({ events, className = '' }) {
  if (!events?.length) return null;
  return (
    <ol className={`border-t border-rule-strong ${className}`}>
      {events.map((e) => (
          <li key={e.seq} className="grid sm:grid-cols-[10rem_1fr] gap-1 sm:gap-5 py-4 border-b border-rule">
            <p className="text-meta text-ink-faint numeric">
              <time dateTime={e.at}>
                {new Date(e.at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
              </time>
            </p>
            <div>
              <p className="text-body font-semibold text-ink">{e.label}</p>
              {e.detail && <p className="text-body text-ink-muted mt-1 max-w-prose">{e.detail}</p>}
              {e.actor === 'demo' && <p className="text-meta text-ink-faint mt-1">Simulated by the demo</p>}
            </div>
          </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Disclosure                                                          */
/* ------------------------------------------------------------------ */

/**
 * Native <details>. Gets keyboard support, Escape-free semantics and the
 * expanded state announced, all from the platform — which is why the previous
 * hand-rolled click-outside version is gone.
 */
export function Disclosure({ summary, children, className = '' }) {
  return (
    <details className={`border-t border-rule ${className}`}>
      <summary className="flex items-center justify-between gap-4 min-h-touch py-3 cursor-pointer text-body font-semibold text-ink list-none [&::-webkit-details-marker]:hidden">
        <span>{summary}</span>
        <span aria-hidden="true" className="text-indigo shrink-0">+</span>
      </summary>
      <div className="pb-5 text-body text-ink-muted max-w-prose">{children}</div>
    </details>
  );
}

/* ------------------------------------------------------------------ */
/* Confirmation gate                                                   */
/* ------------------------------------------------------------------ */

/**
 * The only place in this codebase that produces `confirmed: true`.
 *
 * A native <dialog> supplies the focus trap, Escape handling, inertness and
 * top-layer rendering, so there is no focus-trap dependency and no scroll-lock
 * hack. Because the state machine refuses confirm-gated transitions without
 * that flag, a browser agent cannot click its way past a commitment.
 */
export function ConfirmAction({ open, onClose, onConfirm, title, children, confirmLabel, tone = 'primary' }) {
  const ref = useRef(null);
  const opener = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      opener.current = document.activeElement;
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={() => { onClose(); opener.current?.focus?.(); }}
      aria-labelledby={titleId}
      className="w-[min(32rem,calc(100vw-2rem))] p-0 bg-paper-1 border border-rule-strong shadow-lift
                 backdrop:bg-[rgba(34,32,27,0.5)] text-ink"
    >
      <div className="p-6">
        <h2 id={titleId} className="font-display text-title text-ink mb-3">{title}</h2>
        <div className="text-body text-ink-muted mb-6 max-w-prose">{children}</div>
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <Button variant="secondary" onClick={onClose}>Go back</Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Read-only summaries                                                 */
/* ------------------------------------------------------------------ */

export function DefinitionList({ items, className = '' }) {
  return (
    <dl className={`grid gap-0 ${className}`}>
      {items.map((it) => (
        <div key={it.term} className="grid sm:grid-cols-[14rem_1fr] gap-1 sm:gap-4 py-3 border-b border-rule">
          <dt className="text-meta text-ink-muted">{it.term}</dt>
          <dd className={`text-body ${it.missing ? 'text-danger font-medium' : 'text-ink'} ${it.numeric ? 'numeric' : ''}`}>
            {it.missing ? 'Not answered yet' : it.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ------------------------------------------------------------------ */
/* Decision overprint                                                  */
/* ------------------------------------------------------------------ */

/** A rectangular typographic overprint: unmistakably fictional when cropped. */
export function Stamp({ reference, label = 'Demo decision', tone = 'gold' }) {
  const colour = tone === 'gold' ? 'var(--terracotta-ink)' : 'var(--ink-muted)';
  return (
    <svg
      viewBox="0 0 220 118"
      width="220"
      height="118"
      role="img"
      aria-label={`${label}. Prototype — not an official visa document. Reference ${reference}.`}
      className="shrink-0 max-w-full h-auto"
    >
      <rect x="1.5" y="1.5" width="217" height="115" fill="none" stroke={colour} strokeWidth="3" />
      <path d="M14 14v90" stroke={colour} strokeWidth="5" />
      <text x="28" y="40" fill={colour} fontSize="24" fontFamily="var(--font-display)" fontWeight="650" letterSpacing="1">
        DEMO DECISION
      </text>
      <text x="28" y="65" fill={colour} fontSize="12" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="1.2">
        NOT AN OFFICIAL VISA DOCUMENT
      </text>
      <text x="28" y="91" fill={colour} fontSize="11" fontFamily="var(--font-sans)" letterSpacing="0.6">
        REF {reference}
      </text>
    </svg>
  );
}

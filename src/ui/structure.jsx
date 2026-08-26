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
        aria-label={`Application progress: ${done} of ${stages.length} stages complete`}
        className="h-[3px] w-full bg-rule mb-2"
      >
        <div
          className="h-full bg-indigo transition-[width] duration-base ease-out"
          style={{ width: `${(done / stages.length) * 100}%` }}
        />
      </div>

      <p className="text-meta text-ink-muted mb-4 sm:hidden">
        {done === stages.length ? (
          <>All <span className="numeric">{stages.length}</span> application stages complete</>
        ) : (
          <>Stage <span className="numeric">{current + 1}</span> of{' '}
            <span className="numeric">{stages.length}</span> — {stages[current]?.title}</>
        )}
      </p>

      <ol className="hidden sm:grid gap-1">
        {stages.map((s, i) => {
          const isCurrent = s.id === currentId;
          const state = s.complete ? 'Complete' : isCurrent ? 'In progress' : 'Not started';
          return (
            <li key={s.id}>
              <Link
                to={s.id === 'review'
                  ? `/application/${appId}/review`
                  : s.id === 'submit'
                    ? `/application/${appId}/submit`
                    : `/application/${appId}/stage/${s.id}`}
                aria-current={isCurrent ? 'step' : undefined}
                className={`flex items-baseline gap-3 min-h-touch py-2 px-2 -mx-2 text-meta rounded-control
                  hover:bg-paper-2 transition-colors duration-quick
                  ${isCurrent ? 'font-semibold text-ink border-l-rail border-indigo pl-3 -ml-3' : 'text-ink-muted'}`}
              >
                <span aria-hidden="true" className="numeric text-ink-faint w-4">{i + 1}</span>
                <span className="flex-1">{s.title}</span>
                <span className={s.complete ? 'text-success' : 'text-ink-faint'}>
                  <span aria-hidden="true">{s.complete ? '✓' : isCurrent ? '●' : '○'}</span>
                  <span className="sr-only">{state}</span>
                </span>
              </Link>
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
    <ol className={`relative grid gap-6 ${className}`}>
      {events.map((e, i) => {
        const last = i === events.length - 1;
        return (
          <li key={e.seq} className="relative pl-8">
            <span
              aria-hidden="true"
              className={`absolute left-0 top-1.5 h-3 w-3 border-2 border-indigo ${last ? 'bg-indigo' : 'bg-paper-0'}`}
            />
            {!last && (
              <span aria-hidden="true" className="absolute left-[5px] top-5 bottom-[-1.5rem] w-px bg-rule-strong" />
            )}
            <p className="text-body font-semibold text-ink">{e.label}</p>
            {e.detail && <p className="text-body text-ink-muted mt-1 max-w-prose">{e.detail}</p>}
            <p className="text-meta text-ink-faint numeric mt-1">
              <time dateTime={e.at}>
                {new Date(e.at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
              </time>
              {e.actor === 'demo' && <span className="not-numeric"> · simulated by the demo</span>}
            </p>
          </li>
        );
      })}
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
/* The stamp                                                           */
/* ------------------------------------------------------------------ */

/**
 * The decision stamp.
 *
 * The reference number and the "not an official visa" disclaimer live inside
 * the ring, so a screenshot of a granted certificate carries its own denial
 * with it and can never be passed off as real.
 *
 * Inline SVG with real <text>, so it survives images-off; the octagon echoes
 * the jali cell rather than being generic clip art.
 */
export function Stamp({ reference, label = 'Demo decision', tone = 'gold' }) {
  const colour = tone === 'gold' ? 'var(--gold)' : 'var(--ink-muted)';
  return (
    <svg
      viewBox="0 0 160 160"
      width="128"
      height="128"
      role="img"
      aria-label={`${label}. Prototype — not an official visa document. Reference ${reference}.`}
      className="shrink-0 -rotate-3 motion-safe:transition-transform"
    >
      <defs>
        <path id="stamp-ring" d="M80 22a58 58 0 1 1 0 116 58 58 0 1 1 0-116" fill="none" />
      </defs>
      <g fill="none" stroke={colour} strokeWidth="2">
        <path d="M46.9 8h66.2L152 46.9v66.2L113.1 152H46.9L8 113.1V46.9Z" />
        <path d="M55 24h50l31 31v50l-31 31H55L24 105V55Z" strokeWidth="1" />
      </g>
      <text fill={colour} fontSize="9.5" fontFamily="var(--font-sans)" letterSpacing="1.6">
        <textPath href="#stamp-ring" startOffset="2%">
          PROTOTYPE · NOT AN OFFICIAL VISA DOCUMENT · {reference} ·
        </textPath>
      </text>
      <text
        x="80" y="76" textAnchor="middle" fill={colour}
        fontSize="17" fontFamily="var(--font-display)" fontWeight="600"
      >
        DEMO
      </text>
      <text
        x="80" y="94" textAnchor="middle" fill={colour}
        fontSize="9" fontFamily="var(--font-sans)" letterSpacing="1.4"
      >
        NOT OFFICIAL
      </text>
    </svg>
  );
}

/**
 * An image presented as a poster, whole, in a paper mount.
 *
 * The available artwork carries its own baked-in titles, so cropping it to a
 * fixed aspect ratio slices through the typography — which is exactly what the
 * previous grid did. Here the file's own proportions are respected and its
 * title becomes the caption.
 */
function PlateMotif({ motif }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 2 };
  return (
    <svg viewBox="0 0 800 540" aria-hidden="true" className="block w-full h-auto text-indigo bg-paper-2 jali-ghost">
      <rect x="34" y="34" width="732" height="472" fill="var(--paper-0)" stroke="var(--rule-strong)" />
      {motif === 'stepwell' && (
        <g {...common}>
          <path d="M110 112h580M148 154h504M186 196h428M224 238h352M262 280h276M300 322h200M338 364h124" />
          <path d="M110 112 338 364M690 112 462 364M338 364h124l-22 54h-80Z" />
          <circle cx="400" cy="92" r="24" fill="var(--terracotta-050)" stroke="var(--terracotta-ink)" />
        </g>
      )}
      {motif === 'water' && (
        <g {...common}>
          <path d="M92 230c104-46 181-58 276-20 87 34 158 36 340-38" opacity=".45" />
          <path d="M92 286c142-24 238-15 332 9 100 25 174 17 284-7M92 338c142-24 238-15 332 9 100 25 174 17 284-7M92 390c142-24 238-15 332 9 100 25 174 17 284-7" opacity=".65" />
          <path d="M326 306h172l-38 34h-98Z" fill="var(--indigo-050)" />
          <path d="M412 306v-88l70 88" />
          <circle cx="628" cy="142" r="34" fill="var(--paper-2)" />
        </g>
      )}
      {motif === 'rail' && (
        <g {...common}>
          <path d="M84 332c92-142 190-174 294-92 91 72 162 74 338-66" opacity=".35" />
          <path d="M76 406c156-96 272-110 362-34 74 62 146 54 286-42" opacity=".55" />
          <path d="M110 454c98-128 226-142 354-70 96 54 171 36 258-26" strokeWidth="5" />
          <path d="M122 472c98-128 226-142 354-70 96 54 171 36 258-26" strokeWidth="1" />
          <g fill="var(--terracotta-ink)" stroke="none">
            <rect x="352" y="335" width="72" height="36" rx="3" />
            <rect x="432" y="354" width="58" height="32" rx="3" />
          </g>
        </g>
      )}
    </svg>
  );
}

export function Plate({ src, alt, motif, caption, credit, className = '', suppressed = false }) {
  if (suppressed) {
    return (
      <figure className={`border border-rule-strong bg-paper-2 p-6 jali-structure ${className}`}>
        <figcaption className="text-meta text-ink-muted">
          {caption} <span className="text-ink-faint">— image not loaded in Data Saver mode.</span>
        </figcaption>
      </figure>
    );
  }
  return (
    <figure className={`border border-rule-strong bg-paper-1 p-4 sm:p-6 ${className}`}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" decoding="async" className="block w-full h-auto" />
      ) : (
        <PlateMotif motif={motif} />
      )}
      <figcaption className="text-meta text-ink-muted mt-4">
        {caption}
        {credit && <span className="block text-ink-faint mt-1">{credit}</span>}
      </figcaption>
    </figure>
  );
}

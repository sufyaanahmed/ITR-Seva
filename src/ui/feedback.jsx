import React from 'react';
import { STATE_META } from '../lib/application.js';

/**
 * Status, banners and empty states.
 *
 * The rule every component here obeys: no meaning is carried by colour alone.
 * Each state gets a colour, a word, and a shape — so a greyscale screenshot,
 * a high-contrast theme and a screen reader all convey the same thing.
 */

const TONES = {
  info: 'bg-info-bg border-info text-ink',
  success: 'bg-success-bg border-success text-ink',
  warning: 'bg-warning-bg border-warning text-ink',
  danger: 'bg-danger-bg border-danger text-ink',
  neutral: 'bg-paper-2 border-rule-strong text-ink',
};

const TONE_MARK = { info: 'ⓘ', success: '✓', warning: '⚠', danger: '⚠', neutral: '•' };

export function Banner({ tone = 'info', title, children, action, live = false, className = '' }) {
  return (
    <div
      className={`border-l-rail border ${TONES[tone]} p-5 rounded-control ${className}`}
      {...(live ? { role: 'status', 'aria-live': 'polite' } : {})}
    >
      <div className="flex gap-3">
        <span aria-hidden="true" className="text-subhead leading-none pt-0.5">{TONE_MARK[tone]}</span>
        <div className="min-w-0 flex-1">
          {title && <p className="text-subhead font-semibold mb-1">{title}</p>}
          <div className="text-body text-ink-muted [&_a]:text-indigo [&_a]:underline [&_a]:underline-offset-4">
            {children}
          </div>
          {action && <div className="mt-4">{action}</div>}
        </div>
      </div>
    </div>
  );
}

/** Shapes are drawn in CSS so they survive images-off and forced colours. */
const SHAPES = {
  circle: 'rounded-full border-2 bg-transparent',
  'circle-half': 'rounded-full border-2 bg-gradient-to-r from-current from-50% to-transparent to-50%',
  square: 'border-2 bg-transparent',
  'square-filled': 'border-2 bg-current',
  'square-open': 'border-2 border-dashed bg-transparent',
  triangle: 'border-2 rounded-[1px] rotate-45 bg-transparent',
};

const BADGE_TONE = {
  info: 'text-info border-info bg-info-bg',
  success: 'text-success border-success bg-success-bg',
  warning: 'text-warning border-warning bg-warning-bg',
  danger: 'text-danger border-danger bg-danger-bg',
  neutral: 'text-ink-muted border-rule-strong bg-paper-2',
};

export function StatusBadge({ status, className = '' }) {
  const meta = STATE_META[status] || STATE_META.NOT_STARTED;
  return (
    <span
      className={`inline-flex items-center gap-3 border-l-rail border px-4 py-2 ${BADGE_TONE[meta.tone]} ${className}`}
    >
      <span aria-hidden="true" className={`inline-block h-3 w-3 shrink-0 ${SHAPES[meta.shape]}`} />
      <span className="text-label font-semibold uppercase tracking-[0.08em]">{meta.label}</span>
      {meta.note && <span className="text-meta font-normal normal-case tracking-normal">{meta.note}</span>}
    </span>
  );
}

export function EmptyState({ title, children, action, className = '' }) {
  return (
    <div className={`border border-rule-strong bg-paper-1 p-8 jali-structure ${className}`}>
      <h2 className="font-display text-title text-ink mb-3">{title}</h2>
      <div className="text-body text-ink-muted max-w-prose mb-6">{children}</div>
      {action}
    </div>
  );
}

/**
 * A single polite live region for the whole app.
 *
 * Kept to one so announcements stay rare enough to be useful: saves, uploads,
 * route changes and validation all funnel through here.
 */
export function Announcer({ message }) {
  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}

/** Honest save state. Never says "synced", because nothing is. */
export function SaveState({ saving, lastSavedAt, blocked, online }) {
  if (blocked) {
    return (
      <p className="flex items-center gap-2 text-meta text-danger">
        <span aria-hidden="true">⚠</span>
        This browser is blocking local storage, so your answers will be lost if you close this page.
      </p>
    );
  }
  if (saving) {
    return <p className="text-meta text-ink-muted">Saving…</p>;
  }
  if (!lastSavedAt) return null;
  const time = new Date(lastSavedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  return (
    <p className="flex items-center gap-2 text-meta text-ink-muted">
      <span aria-hidden="true" className="text-success">✓</span>
      Saved on this device at <span className="numeric">{time}</span>
      {!online && <span className="text-warning">· offline, still safe here</span>}
    </p>
  );
}

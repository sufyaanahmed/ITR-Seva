import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useParams } from 'react-router-dom';
import { navRoutes, routeForPath, pageTitle, crumbs, SITE_NAME } from '../lib/routes.js';
import { SOURCES } from '../lib/rules/sources.js';
import { usePrefs } from '../state/prefs.jsx';
import { useStore } from '../state/store.jsx';
import Button, { ExternalLink } from '../ui/Button.jsx';
import { Announcer, SaveState } from '../ui/feedback.jsx';

/* ------------------------------------------------------------------ */
/* Wordmark                                                            */
/* ------------------------------------------------------------------ */

/**
 * A bespoke mark, not the State Emblem of India.
 *
 * The emblem was removed from this product entirely. Its use in a masthead
 * implies Government of India endorsement that a hackathon prototype has not
 * got, and its use is restricted under the State Emblem of India (Prohibition
 * of Improper Use) Act, 2005. This octagon is the jali cell used throughout
 * the interface — of the place, without borrowing its authority.
 */
function Wordmark() {
  return (
    <span className="flex items-center gap-3 min-w-0">
      <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" className="shrink-0">
        <g fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9.37 1H22.63L31 9.37V22.63L22.63 31H9.37L1 22.63V9.37Z" />
          <path d="M16 9 23 16 16 23 9 16Z" strokeWidth="1" strokeOpacity=".55" />
        </g>
      </svg>
      <span className="flex flex-col leading-none min-w-0">
        <span className="font-display text-[1.35rem] font-semibold tracking-tight truncate">
          Visa-Seva
        </span>
        <span className="text-overline uppercase text-ink-muted mt-1">Prototype · Not official</span>
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Prototype boundary                                                  */
/* ------------------------------------------------------------------ */

/**
 * Always the topmost element, on every route, never dismissible and never
 * covered — including by the mobile menu, which is anchored below it.
 */
export function PrototypeStrip() {
  return (
    <div className="bg-indigo-900 text-on-indigo on-indigo no-print">
      <div className="shell py-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-meta">
        <strong className="font-semibold">A demonstration, not a government service.</strong>
        <span className="text-on-indigo-muted">
          Nothing here reaches any authority. Please do not enter real passport details.
        </span>
        <a
          href={SOURCES.portal.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-on-indigo underline underline-offset-4 decoration-1 hover:decoration-2 whitespace-nowrap"
        >
          Apply at indianvisaonline.gov.in ↗
          <span className="sr-only">(opens the official site in a new tab)</span>
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Accessibility panel                                                 */
/* ------------------------------------------------------------------ */

const CHOICES = [
  { key: 'textSize', legend: 'Text size', options: [['normal', 'Normal'], ['large', 'Large'], ['x-large', 'Extra large']] },
  { key: 'contrast', legend: 'Contrast', options: [['standard', 'Standard'], ['high', 'High contrast']] },
  { key: 'spacing', legend: 'Spacing', options: [['standard', 'Standard'], ['roomy', 'More spacing']] },
  { key: 'motion', legend: 'Motion', options: [['system', 'Follow my device'], ['reduced', 'Reduce motion']] },
  { key: 'dataSaver', legend: 'Data Saver', options: [['off', 'Off'], ['on', 'On — skip images and web fonts']] },
];

function DisplayPanel({ open, onClose }) {
  const { prefs, set, reset } = usePrefs();
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="display-title"
      className="w-[min(30rem,calc(100vw-2rem))] p-0 bg-paper-1 border border-rule-strong text-ink
                 shadow-lift backdrop:bg-[rgba(34,32,27,0.5)]"
    >
      <div className="p-6">
        <h2 id="display-title" className="font-display text-title mb-1">Display settings</h2>
        <p className="text-meta text-ink-muted mb-6">
          These are kept separately from your application, so clearing demo data will not reset them.
        </p>
        {CHOICES.map((c) => (
          <fieldset key={c.key} className="mb-5 border-0 p-0">
            <legend className="text-label font-semibold mb-2 p-0">{c.legend}</legend>
            <div className="flex flex-wrap gap-2">
              {c.options.map(([value, label]) => (
                <label
                  key={value}
                  className={`inline-flex items-center gap-2 min-h-touch px-4 py-2 border cursor-pointer rounded-control
                    ${prefs[c.key] === value ? 'border-emph border-indigo bg-indigo-50 font-semibold' : 'border-rule-control bg-paper-1'}`}
                >
                  <input
                    type="radio"
                    name={c.key}
                    value={value}
                    checked={prefs[c.key] === value}
                    onChange={() => set(c.key, value)}
                    className="h-4 w-4 accent-[color:var(--indigo)]"
                  />
                  <span className="text-meta">{label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end mt-6 pt-5 border-t border-rule">
          <Button variant="quiet" onClick={reset}>Reset to defaults</Button>
          <Button onClick={onClose}>Done</Button>
        </div>
      </div>
    </dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

const navLinkClass = ({ isActive }) =>
  `flex items-center min-h-touch px-3 text-meta rounded-control transition-colors duration-quick
   hover:bg-paper-2 ${isActive ? 'font-semibold text-ink border-b-emph border-indigo' : 'text-ink-muted'}`;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [displayOpen, setDisplayOpen] = useState(false);
  const { savedApp } = useStore();
  const location = useLocation();
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const items = navRoutes('header');

  useEffect(() => {
    // Closing the native dialog emits `close`, which updates menuOpen outside
    // this effect and restores focus through the dialog's own event path.
    if (menuRef.current?.open) menuRef.current.close();
  }, [location.pathname]);

  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    if (menuOpen && !el.open) el.showModal();
    else if (!menuOpen && el.open) el.close();
  }, [menuOpen]);

  return (
    <header className="bg-paper-0 border-b border-rule-strong sticky top-0 z-40 shadow-raise no-print">
      <div className="shell flex items-center justify-between gap-4 py-3">
        <Link to="/" className="text-ink no-underline min-w-0 flex items-center min-h-touch">
          <Wordmark />
          <span className="sr-only">{SITE_NAME} home</span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1 list-none m-0 p-0">
            {items.map((r) => (
              <li key={r.id}>
                <NavLink to={r.path.replace(':step', '1')} className={navLinkClass} end={r.path === '/'}>
                  {r.navLabel || r.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="compact" onClick={() => setDisplayOpen(true)}>
            <span aria-hidden="true">Aa</span>
            <span className="hidden sm:inline">Display</span>
            <span className="sm:hidden sr-only">Display settings</span>
          </Button>
          <Button
            ref={triggerRef}
            variant="secondary"
            size="compact"
            className="lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen(true)}
          >
            Menu
          </Button>
        </div>
      </div>

      {/* Native <dialog> supplies the focus trap, Escape and inertness. */}
      <dialog
        id="site-menu"
        ref={menuRef}
        aria-label="Menu"
        onClose={() => { setMenuOpen(false); triggerRef.current?.focus?.(); }}
        className="m-0 ml-auto h-full max-h-none w-[min(22rem,100vw)] max-w-none p-0
                   bg-paper-1 text-ink border-l border-rule-strong shadow-lift
                   backdrop:bg-[rgba(34,32,27,0.5)]"
      >
        <div className="flex items-center justify-between p-4 border-b border-rule">
          <span className="text-label font-semibold uppercase tracking-[0.08em] text-ink-muted">Menu</span>
          <Button variant="secondary" size="compact" onClick={() => setMenuOpen(false)}>Close</Button>
        </div>

        {savedApp && (
          <div className="p-4 border-b border-rule bg-paper-2">
            <p className="text-meta text-ink-muted mb-1">Your application</p>
            <p className="numeric text-body font-semibold mb-3">{savedApp.id}</p>
            <Button to={`/application/${savedApp.id}`} size="md" className="w-full">Continue saved application</Button>
          </div>
        )}

        <nav aria-label="Site">
          <ul className="list-none m-0 p-0">
            {items.map((r) => (
              <li key={r.id} className="border-b border-rule">
                <NavLink
                  to={r.path.replace(':step', '1')}
                  className={({ isActive }) =>
                    `flex items-center min-h-[3.5rem] px-4 text-body
                     ${isActive ? 'font-semibold border-l-rail border-indigo pl-3' : 'text-ink-muted'}`}
                >
                  {r.navLabel || r.title}
                </NavLink>
              </li>
            ))}
            <li className="border-b border-rule">
              <NavLink to="/discover-india" className="flex items-center min-h-[3.5rem] px-4 text-body text-ink-muted">
                Discover India
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-rule">
          <p className="text-overline uppercase text-ink-faint mb-2">For reviewers</p>
          <Link to="/demo" className="flex items-center min-h-touch text-body text-indigo underline underline-offset-4">
            Demo scenarios
          </Link>
          <Link to="/help/your-data" className="flex items-center min-h-touch text-body text-indigo underline underline-offset-4">
            Your data on this device
          </Link>
        </div>
      </dialog>

      <DisplayPanel open={displayOpen} onClose={() => setDisplayOpen(false)} />
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Application bar                                                     */
/* ------------------------------------------------------------------ */

/** Shown only while a record is in scope. Answers "where am I, and is it safe". */
export function ApplicationBar() {
  const location = useLocation();
  const { app, resolve, saving, lastSavedAt, storageBlocked, online } = useStore();
  const scopedId = location.pathname.match(/^\/application\/([^/]+)/)?.[1];
  const record = resolve(scopedId) || app;
  if (!record) return null;
  return (
    <div className="bg-paper-2 border-b border-rule no-print">
      <div className="shell py-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
        <p className="text-meta text-ink-muted">
          {record.kind === 'seed' ? 'Session scenario' : 'Application'}{' '}
          <span className="numeric font-semibold text-ink">{record.id}</span>
        </p>
        {record.kind === 'seed' ? (
          <p className="text-meta text-ink-muted">Resets on reload · never saved over your draft</p>
        ) : (
          <SaveState saving={saving} lastSavedAt={lastSavedAt} blocked={storageBlocked} online={online} />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Breadcrumbs                                                         */
/* ------------------------------------------------------------------ */

export function Breadcrumbs({ routeId }) {
  const chain = crumbs(routeId);
  const params = useParams();
  if (chain.length < 2) return null;
  const pathFor = (path) => path.replace(/:([A-Za-z0-9_]+)/g, (_match, key) => {
    if (params[key]) return params[key];
    if (key === 'step') return '1';
    return '';
  });
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 list-none m-0 p-0 text-meta text-ink-muted">
        {chain.map((r, i) => (
          <li key={r.id} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === chain.length - 1 ? (
              <span aria-current="page" className="text-ink">{r.navLabel || r.title}</span>
            ) : (
              <Link to={pathFor(r.path)} className="underline underline-offset-4 decoration-1 hover:decoration-2">
                {r.navLabel || r.title}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Route focus, title and announcement                                 */
/* ------------------------------------------------------------------ */

/**
 * On every route change: set the document title, move focus to the page
 * heading, and announce the new page. The previous version scrolled to top and
 * left focus on a stale element, so a screen-reader user heard nothing at all.
 */
export function RouteAnnouncer() {
  const location = useLocation();
  const [message, setMessage] = useState('');
  const first = useRef(true);

  useEffect(() => {
    const route = routeForPath(location.pathname);
    document.title = pageTitle(route);
    if (first.current) { first.current = false; return; }

    setMessage(`${route.title}. Page loaded.`);
    requestAnimationFrame(() => {
      const hashTarget = location.hash
        ? document.getElementById(decodeURIComponent(location.hash.slice(1)))
        : null;
      const target = hashTarget || document.querySelector('main h1');
      if (target) {
        if (!target.matches('a, button, input, select, textarea, summary, [tabindex]')) {
          target.setAttribute('tabindex', '-1');
        }
        target.focus({ preventScroll: true });
      }
      if (hashTarget) hashTarget.scrollIntoView({ block: 'center' });
      else window.scrollTo(0, 0);
    });
  }, [location.hash, location.pathname]);

  return <Announcer message={message} />;
}

export function SkipLink() {
  return <a href="#main" className="skip-link">Skip to main content</a>;
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export function Footer() {
  const groups = [
    { title: 'Services', ids: ['find', 'start', 'track'] },
    { title: 'Guidance', ids: ['requirements', 'before-you-travel', 'help'] },
    { title: 'About this prototype', ids: ['your-data', 'site-map', 'discover'] },
  ];
  const all = navRoutes('header').concat(navRoutes('footer'));
  const find = (id) => all.find((r) => r.id === id);

  return (
    <footer className="on-indigo bg-indigo-900 text-on-indigo mt-12 border-t-rail border-gold no-print">
      <div className="shell py-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-title mb-3">Visa-Seva</p>
          <p className="text-meta text-on-indigo-muted max-w-[32ch]">
            A hackathon prototype exploring how a visa service could welcome a
            traveller. It is not affiliated with the Government of India and
            issues nothing.
          </p>
        </div>
        {groups.map((g) => (
          <nav key={g.title} aria-label={g.title}>
            <h2 className="text-overline uppercase text-on-indigo-muted mb-4">{g.title}</h2>
            <ul className="list-none m-0 p-0 grid gap-1">
              {g.ids.map((id) => {
                const r = find(id);
                if (!r) return null;
                return (
                  <li key={id}>
                    <Link
                      to={r.path.replace(':step', '1')}
                      className="flex items-center min-h-touch text-meta text-on-indigo-muted hover:text-on-indigo underline underline-offset-4 decoration-1 hover:decoration-2"
                    >
                      {r.navLabel || r.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        ))}
      </div>
      <div className="shell pb-10 pt-6 border-t border-[rgba(255,255,255,0.18)]">
        <p className="text-meta text-on-indigo-muted max-w-prose">
          The Government of India does not authorise any agent to charge fees
          for e-Visas, emergency visas or the e-Arrival Card. The real
          application is free to start and needs no intermediary.{' '}
          <ExternalLink href={SOURCES.portal.url} className="text-on-indigo">
            indianvisaonline.gov.in
          </ExternalLink>
        </p>
      </div>
    </footer>
  );
}

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button, { ExternalLink } from '../ui/Button.jsx';
import { Plate } from '../ui/structure.jsx';
import { useStore } from '../state/store.jsx';
import { usePrefs } from '../state/prefs.jsx';
import { STATE_META } from '../lib/application.js';
import { PLATES } from '../lib/content.js';
import { SOURCES } from '../lib/rules/sources.js';

/* ------------------------------------------------------------------ */
/* Signature moment: the meridian                                      */
/* ------------------------------------------------------------------ */

const PHASES = [
  { until: 300, key: 'night', line: 'It is the small hours in India.' },
  { until: 420, key: 'dawn', line: 'It is early morning in India.' },
  { until: 1020, key: 'day', line: 'It is daytime in India.' },
  { until: 1140, key: 'dusk', line: 'It is evening in India.' },
  { until: 1440, key: 'evening', line: 'It is night in India.' },
];

const PHASE_TONE = {
  night: 'bg-indigo-900 text-on-indigo on-indigo',
  dawn: 'bg-terracotta-050 text-ink',
  day: 'bg-paper-2 text-ink',
  dusk: 'bg-terracotta-050 text-ink',
  evening: 'bg-indigo-900 text-on-indigo on-indigo',
};

function istMinutes(now) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(now);
  const h = Number(parts.find((p) => p.type === 'hour').value);
  const m = Number(parts.find((p) => p.type === 'minute').value);
  return { minutes: h * 60 + m, label: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}` };
}

/**
 * A hairline across the band with a mark placed at the current time in India.
 *
 * It answers a question no visa site answers — where am I, relative to the
 * place I am going — and it does it in CSS and text alone, so it survives
 * images-off, Data Saver and reduced motion without a special case. Nothing
 * animates; it simply re-renders each minute.
 */
function Meridian() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const { minutes, label } = istMinutes(now);
  const phase = PHASES.find((p) => minutes < p.until) ?? PHASES.at(-1);
  const pct = (minutes / 1440) * 100;

  return (
    <aside
      aria-label="Local time in India"
      data-phase={phase.key}
      className={`border border-rule-strong p-6 sm:p-8 ${PHASE_TONE[phase.key]}`}
    >
      <p className="text-overline uppercase opacity-80 mb-3">Right now in India</p>
      <p className="font-display text-display-l leading-none numeric mb-1">
        <time dateTime={`${label}+05:30`}>{label}</time>
      </p>
      <p className="text-meta opacity-85 mb-8">India Standard Time · UTC+5:30</p>

      <div className="relative h-8" aria-hidden="true">
        <span className="absolute inset-x-0 top-4 h-px bg-current opacity-30" />
        {[0, 25, 50, 75, 100].map((t) => (
          <span key={t} className="absolute top-2 h-4 w-px bg-current opacity-30" style={{ left: `${t}%` }} />
        ))}
        <span
          className="absolute top-[9px] h-3 w-3 -translate-x-1/2 rounded-full bg-current"
          style={{ left: `${pct}%` }}
        />
      </div>
      <div aria-hidden="true" className="flex justify-between text-overline opacity-75 numeric">
        <span>00</span><span>06</span><span>12</span><span>18</span><span>24</span>
      </div>

      <p className="text-body mt-6 max-w-[34ch] opacity-90">
        {phase.line} Whenever you are reading this, the paperwork can wait until you are ready.
      </p>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Task list                                                           */
/* ------------------------------------------------------------------ */

const JOBS = [
  { to: '/find/q/1', title: 'Find my visa', body: 'Six questions, about ninety seconds. You get a suggested route, the reason for it, and the official source it came from.' },
  { to: '/start', title: 'Start or resume', body: 'Begin a demo application, or pick up one you saved on this device.' },
  { to: '/track', title: 'Track an application', body: 'Look up a demo record with its reference number and access code.' },
  { to: '/requirements', title: 'Documents and requirements', body: 'What each route asks for — worth reading before you start anything.' },
];

function TaskRow({ to, title, body }) {
  return (
    <li className="border-b border-rule">
      <Link
        to={to}
        className="group flex items-baseline gap-4 py-5 min-h-touch no-underline hover:bg-paper-2 transition-colors duration-quick -mx-4 px-4"
      >
        <span className="flex-1 min-w-0">
          <span className="block font-display text-title text-ink mb-1">{title}</span>
          <span className="block text-body text-ink-muted max-w-prose">{body}</span>
        </span>
        <span aria-hidden="true" className="text-indigo text-subhead shrink-0">→</span>
      </Link>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  const { savedApp } = useStore();
  const { prefs } = usePrefs();
  const plate = PLATES[1];

  return (
    <>
      <section className="border-b border-rule-strong jali-story">
        <div className="shell py-10 lg:py-12 grid gap-8 lg:grid-cols-[7fr_5fr] lg:items-center">
          <div>
            <p className="text-overline uppercase text-ink-muted mb-4">
              A digital welcome — built as a prototype
            </p>
            <h1 className="font-display text-display-xl text-ink mb-5 text-balance">
              India has thought about your journey.
            </h1>
            <p className="text-lede text-ink-muted max-w-prose mb-8">
              Work out which visa fits your trip, see exactly what you will need
              before you start, and practise the whole application without
              entering a single real detail.
            </p>

            {savedApp ? (
              <div className="border border-rule-strong bg-paper-1 p-5 mb-6 max-w-prose">
                <p className="text-overline uppercase text-ink-muted mb-2">Where you left off</p>
                <p className="text-body text-ink mb-1">
                  <span className="numeric font-semibold">{savedApp.id}</span> ·{' '}
                  {STATE_META[savedApp.status]?.label}
                </p>
                <p className="text-meta text-ink-muted mb-4">
                  Saved on this device. Nothing was sent anywhere.
                </p>
                <Button to={`/application/${savedApp.id}`} size="lg">Continue your application</Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Button to="/find/q/1" size="lg">Find my visa</Button>
                <Button to="/start" variant="secondary" size="lg">Start or resume</Button>
              </div>
            )}

            <p className="text-meta text-ink-muted">
              Applying for real? That happens at{' '}
              <ExternalLink href={SOURCES.portal.url}>indianvisaonline.gov.in</ExternalLink> —
              free to start, and no agent required.
            </p>
          </div>

          <Meridian />
        </div>
      </section>

      <section className="shell py-10" aria-labelledby="tasks-heading">
        <h2 id="tasks-heading" className="text-overline uppercase text-ink-muted mb-2">
          What you can do here
        </h2>
        <ul className="list-none m-0 p-0 border-t border-rule max-w-doc">
          {JOBS.map((j) => <TaskRow key={j.to} {...j} />)}
        </ul>
      </section>

      <section className="border-y border-rule-strong bg-paper-2">
        <div className="shell py-10 max-w-doc">
          <h2 className="font-display text-title text-ink mb-6">How this prototype works</h2>
          <ol className="grid gap-6 sm:grid-cols-3 list-none m-0 p-0">
            {[
              ['It suggests, it never decides', 'Every result says which rule produced it, links the official page it came from, and shows the date a person last read that page. Where the rules do not cover you, it says so instead of guessing.'],
              ['Nothing leaves this device', 'Your answers live in this browser and go nowhere else. There is no server, no account, and no one at the other end. Please use invented details.'],
              ['Every artefact says it is fake', 'The demo record, the printout and the stamp all carry the words “not an official visa document” — including inside the stamp itself, so a screenshot cannot lose them.'],
            ].map(([title, body], i) => (
              <li key={title}>
                <p className="text-overline uppercase text-ink-faint numeric mb-2">0{i + 1}</p>
                <h3 className="text-subhead font-semibold text-ink mb-2">{title}</h3>
                <p className="text-body text-ink-muted">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="shell py-10 grid gap-8 lg:grid-cols-[5fr_7fr] lg:items-center max-w-dashboard">
        <Plate
          src={plate.src}
          alt={plate.alt}
          motif={plate.motif}
          caption={plate.caption}
          credit={plate.credit}
          suppressed={prefs.dataSaver === 'on'}
        />
        <div>
          <p className="text-overline uppercase text-ink-muted mb-3">Discover India</p>
          <h2 className="font-display text-title text-ink mb-4">
            The country the paperwork is for
          </h2>
          <p className="text-body text-ink-muted max-w-prose mb-6">
            Three short pieces, placed here rather than in front of the service —
            because when you came to sort out a visa, a tourism campaign is not
            what you needed first.
          </p>
          <Button to="/discover-india" variant="secondary">Read the three pieces</Button>
        </div>
      </section>
    </>
  );
}

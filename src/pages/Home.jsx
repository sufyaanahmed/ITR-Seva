import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button, { ExternalLink } from '../ui/Button.jsx';
import { useStore } from '../state/store.jsx';
import { STATE_META } from '../lib/application.js';
import { SOURCES } from '../lib/rules/sources.js';

function IndiaClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(now);

  return <time className="numeric font-semibold">{time} IST</time>;
}

const SERVICES = [
  {
    to: '/find/q/1', number: '01', title: 'Find the route that fits',
    body: 'Answer six plain questions. See the likely path, the reasoning and the official source.',
    action: 'Find my visa',
  },
  {
    to: '/requirements', number: '02', title: 'Know what to gather',
    body: 'Check documents, conditions, ports and limits before you begin a real application.',
    action: 'Read the requirements',
  },
  {
    to: '/start', number: '03', title: 'Practise the process',
    body: 'Walk through a private, fictional application without sharing a real passport detail.',
    action: 'Start or resume',
  },
  {
    to: '/track', number: '04', title: 'Return to a demo record',
    body: 'Use its reference and access code to see progress, requests and a simulated decision.',
    action: 'Track an application',
  },
];

const PRINCIPLES = [
  ['Traceable', 'Recommendations name the published rule and link to the official page.'],
  ['Private', 'Fictional answers stay in this browser. There is no account and no server.'],
  ['Clearly a demo', 'Every record and printout identifies itself as a prototype.'],
];

export default function Home() {
  const { savedApp } = useStore();

  return (
    <>
      <section className="home-cover" aria-labelledby="home-title">
        <div className="shell home-cover__register" aria-label="Service edition information">
          <span>Visitor guidance</span>
          <span>Independent prototype</span>
          <span>India · <IndiaClock /></span>
        </div>
        <div className="shell home-cover__grid">
          <div className="home-cover__copy">
            <p className="home-kicker">Clearer Indian visa guidance</p>
            <h1 id="home-title" className="home-title">Prepare for your journey with fewer unknowns.</h1>
            <p className="home-intro">
              Find the route that suits your visit, understand what it asks of
              you, then practise the process without sharing a real passport detail.
            </p>

            {savedApp ? (
              <div className="saved-journey" aria-label="Saved demo application">
                <div>
                  <p className="home-kicker">Continue where you left off</p>
                  <p className="saved-journey__record">
                    <span className="numeric font-semibold">{savedApp.id}</span>
                    <span aria-hidden="true"> · </span>
                    {STATE_META[savedApp.status]?.label}
                  </p>
                  <p className="text-meta text-ink-muted">Saved only on this device.</p>
                </div>
                <Button to={`/application/${savedApp.id}`} size="lg">Continue application</Button>
              </div>
            ) : (
              <div className="home-actions">
                <Button to="/find/q/1" size="lg">Find my visa <span aria-hidden="true">→</span></Button>
                <Button to="/start" variant="secondary" size="lg">Explore the demo</Button>
              </div>
            )}
          </div>

          <aside className="home-cover__official" aria-label="Official application">
            <p className="home-kicker">Apply for real</p>
            <p>Visa-Seva does not submit applications or collect payment.</p>
            <ExternalLink href={SOURCES.portal.url}>Go to the official Government of India portal</ExternalLink>
            <p className="text-meta text-ink-faint">Free to start · no intermediary required</p>
          </aside>
        </div>
      </section>

      <nav className="service-index shell" aria-labelledby="service-index-title">
        <div className="service-index__heading">
          <p className="home-kicker">Choose what you need</p>
          <h2 id="service-index-title">Start with the task in front of you.</h2>
          <p>You do not need to know the visa vocabulary first.</p>
        </div>
        <ol className="service-index__list">
          {SERVICES.map((service) => (
            <li key={service.number}>
              <Link to={service.to} className="service-index__link">
                <span className="service-index__number" aria-hidden="true">{service.number}</span>
                <span className="service-index__content">
                  <span className="service-index__title">{service.title}</span>
                  <span className="service-index__body">{service.body}</span>
                  <span className="service-index__action">{service.action} <span aria-hidden="true">→</span></span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </nav>

      <section className="home-principles shell" aria-labelledby="principles-title">
        <div className="home-principles__heading">
          <p className="home-kicker">Before you type</p>
          <h2 id="principles-title">Keep your real passport in the drawer.</h2>
          <p>This is a working prototype, not a government service. Use made-up details.</p>
        </div>
        <ol className="home-principles__list">
          {PRINCIPLES.map(([title, body], index) => (
            <li key={title}>
              <span className="numeric" aria-hidden="true">0{index + 1}</span>
              <div><h3>{title}</h3><p>{body}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="home-next shell" aria-labelledby="next-title">
        <p className="home-kicker">Useful next reading</p>
        <h2 id="next-title">The practical details, when you need them.</h2>
        <div>
          <Link to="/before-you-travel">Before you travel <span aria-hidden="true">→</span></Link>
          <Link to="/help">Answers and official contacts <span aria-hidden="true">→</span></Link>
          <Link to="/discover-india">India notebook <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </>
  );
}

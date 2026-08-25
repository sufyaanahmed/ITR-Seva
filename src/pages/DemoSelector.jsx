import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const DEMOS = [
  {
    id: 'individual',
    title: 'An individual',
    eyebrow: 'Salaried example',
    description: 'Rahul checks Form 16, AIS, Form 26AS and bank interest, then sees a bounded tax illustration.',
    action: 'Explore individual',
  },
  {
    id: 'company',
    title: 'A private company',
    eyebrow: 'Domestic company example',
    description: 'Aster Components checks its accounts, tax credits and challans before a qualified review.',
    action: 'Explore company',
  },
  {
    id: 'firm_llp',
    title: 'A firm or LLP',
    eyebrow: 'Non-company · LLP example',
    description: 'Mehta & Rao Advisory LLP prepares a focused records pack. This does not represent every non-company entity.',
    action: 'Explore LLP example',
  },
];

export default function DemoSelector() {
  const headingRef = useRef(null);
  useEffect(() => { headingRef.current?.focus(); }, []);

  return (
    <section className="section" aria-labelledby="demo-selector-title">
      <div className="container">
        <p className="eyebrow">Choose a fictional journey</p>
        <h1 id="demo-selector-title" ref={headingRef} tabIndex="-1">Who are you checking taxes for?</h1>
        <p className="lead selector-lead">Pick the closest example. Each uses fictional information and takes about three minutes.</p>
        <div className="profile-grid">
          {DEMOS.map((demo) => (
            <article className="profile-card" key={demo.id}>
              <p className="eyebrow">{demo.eyebrow}</p>
              <h2>{demo.title}</h2>
              <p className="muted">{demo.description}</p>
              <Link className="button button-primary" to={`/demo/${demo.id}/documents`}>
                {demo.action}
              </Link>
            </article>
          ))}
        </div>
        <div className="notice notice-warning selector-note"><strong>Trust, society, HUF, AOP, BOI or another entity?</strong> These examples do not safely cover every taxpayer type. Use the <a href="https://www.incometax.gov.in/iec/foportal/taxonomy/term/45" target="_blank" rel="noreferrer" aria-label="Official return guidance (opens in a new tab)">official return guidance ↗</a> and qualified help.</div>
      </div>
    </section>
  );
}

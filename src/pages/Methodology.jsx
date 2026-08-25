import { Link } from 'react-router-dom';

export default function Methodology() {
  return (
    <section className="section">
      <div className="container prose">
        <p className="eyebrow">How it works</p>
        <h1>Deterministic decisions. Optional AI explanations.</h1>
        <p className="lead" style={{ color: 'var(--muted)' }}>KarSaathi uses three bounded fictional examples: a salaried individual, a domestic private company, and an LLP. It does not pretend these cover every taxpayer.</p>
        <h2>What decides the result</h2>
        <p>Versioned JavaScript rules reconcile each sample’s records and create a readiness result. Only the supported salaried example receives a limited illustrative tax comparison. Company and LLP paths deliberately stop at a professional-review pack.</p>
        <h2>What AI does</h2>
        <p>When configured, a server-side OpenAI Responses API call rewrites curated official guidance in plain language. Only a safe topic identifier, language, and fictional step name are sent. If the API is unavailable, the same buttons return useful offline guidance.</p>
        <h2>What this prototype does not do</h2>
        <ul>
          <li>It does not accept real tax documents or identifiers.</li>
          <li>It does not connect to or submit anything to a government system.</li>
          <li>It does not calculate company or LLP tax, decide audit applicability, or cover every non-company entity.</li>
          <li>It does not provide a final legal or tax determination.</li>
        </ul>
        <h2>Sources</h2>
        <ul>
          <li><a href="https://www.incometax.gov.in/iec/foportal/ais-faq" target="_blank" rel="noreferrer" aria-label="Income Tax Department AIS FAQ (opens in a new tab)">Income Tax Department AIS FAQ ↗</a></li>
          <li><a href="https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/file-itr-2-online/itr-2-UM" target="_blank" rel="noreferrer" aria-label="ITR online filing manual (opens in a new tab)">ITR online filing manual ↗</a></li>
          <li><a href="https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/income-and-tax-estimator-um" target="_blank" rel="noreferrer" aria-label="Income and Tax Estimator manual (opens in a new tab)">Income and Tax Estimator manual ↗</a></li>
          <li><a href="https://www.incometax.gov.in/iec/foportal/help/company/return-applicable" target="_blank" rel="noreferrer" aria-label="Domestic company guidance for AY 2026–27 (opens in a new tab)">Domestic company guidance for AY 2026–27 ↗</a></li>
          <li><a href="https://www.incometax.gov.in/iec/foportal/help/partnership-firm-llp" target="_blank" rel="noreferrer" aria-label="Partnership firm and LLP guidance for AY 2026–27 (opens in a new tab)">Partnership firm / LLP guidance for AY 2026–27 ↗</a></li>
        </ul>
        <Link className="button button-primary" to="/demo">Choose a fictional journey</Link>
      </div>
    </section>
  );
}

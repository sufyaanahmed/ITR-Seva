import { Link } from 'react-router-dom';

export default function Methodology() {
  return (
    <section className="section">
      <div className="container prose">
        <p className="eyebrow">How it works</p>
        <h1>Deterministic decisions. Optional AI explanations.</h1>
        <p className="lead" style={{ color: 'var(--muted)' }}>KarSaathi is deliberately narrow: it demonstrates filing readiness for one fictional salaried person rather than pretending to replace the official portal.</p>
        <h2>What decides the result</h2>
        <p>Versioned JavaScript rules reconcile the sample records, route the sample to a likely ITR form, and calculate a limited illustrative estimate. The AI assistant cannot change these results.</p>
        <h2>What AI does</h2>
        <p>When configured, a server-side OpenAI Responses API call rewrites curated official guidance in plain language. Only a safe topic identifier, language, and fictional step name are sent. If the API is unavailable, the same buttons return useful offline guidance.</p>
        <h2>What this prototype does not do</h2>
        <ul>
          <li>It does not accept real tax documents or identifiers.</li>
          <li>It does not connect to or submit anything to a government system.</li>
          <li>It does not support business income, capital gains, foreign assets, or other complex cases.</li>
          <li>It does not provide a final legal or tax determination.</li>
        </ul>
        <h2>Sources</h2>
        <ul>
          <li><a href="https://www.incometax.gov.in/iec/foportal/ais-faq" target="_blank" rel="noreferrer" aria-label="Income Tax Department AIS FAQ (opens in a new tab)">Income Tax Department AIS FAQ ↗</a></li>
          <li><a href="https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/file-itr-2-online/itr-2-UM" target="_blank" rel="noreferrer" aria-label="ITR online filing manual (opens in a new tab)">ITR online filing manual ↗</a></li>
          <li><a href="https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/income-and-tax-estimator-um" target="_blank" rel="noreferrer" aria-label="Income and Tax Estimator manual (opens in a new tab)">Income and Tax Estimator manual ↗</a></li>
        </ul>
        <Link className="button button-primary" to="/demo/documents">Start the fictional demo</Link>
      </div>
    </section>
  );
}

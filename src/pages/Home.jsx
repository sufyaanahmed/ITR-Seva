import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { COPY } from '../data/copy.js';

export default function Home() {
  const { demo } = useApp();
  const copy = COPY[demo.language];
  const hindi = demo.language === 'hi';

  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="eyebrow">{hindi ? 'सरल, निर्देशित कर तैयारी' : 'Simple, guided tax readiness'}</p>
          <h1>{hindi ? 'आयकर रिटर्न भरने से पहले साफ़ तस्वीर पाएँ।' : 'Find the right tax path—without the service maze.'}</h1>
          <p className="lead">
            {hindi
              ? 'काल्पनिक दस्तावेज़ों से देखें कि क्या मेल खाता है, किस पर ध्यान देना है और अगला कदम क्या है। लगभग 3 मिनट।'
              : 'Explore a fictional journey for an individual, a private company, or a firm/LLP. See what is ready, what needs attention, and what to do next.'}
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/demo">Choose a sample journey</Link>
            <Link className="button button-secondary" to="/methodology">{copy.how}</Link>
          </div>
          <p className="fine-print" style={{ color: '#d8e8e3', marginTop: '1.2rem' }}>
            {hindi
              ? 'केवल काल्पनिक जानकारी। कभी भी PAN, आधार, OTP, बैंक विवरण या असली कर दस्तावेज़ दर्ज न करें।'
              : 'Fictional information only. Never enter a PAN, Aadhaar, OTP, bank detail, or real tax document.'}
          </p>
        </div>
      </section>

      <section className="trust-strip" aria-label="Prototype promises">
        <div className="container trust-grid">
          <div className="trust-item"><strong>Start with your type</strong><span className="muted">Choose an individual, company, or firm/LLP example.</span></div>
          <div className="trust-item"><strong>Check the right records</strong><span className="muted">Each sample shows its own documents and readiness questions.</span></div>
          <div className="trust-item"><strong>Leave with a plan</strong><span className="muted">Get a clear readiness report, not a fake filing.</span></div>
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="container">
          <p className="eyebrow">One simple pattern, three examples</p>
          <h2>From scattered records to clear next steps.</h2>
          <div className="grid-3">
            <article className="feature"><span className="feature-number">01</span><h3>Pick the closest example</h3><p className="muted">Choose a salaried individual, domestic private company, or firm/LLP. No login or real documents.</p></article>
            <article className="feature"><span className="feature-number">02</span><h3>Review what matters</h3><p className="muted">See type-specific records and turn uncertainty into a short review list.</p></article>
            <article className="feature"><span className="feature-number">03</span><h3>Leave with a next step</h3><p className="muted">Get bounded form guidance and a printable readiness pack—not a fake filing.</p></article>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container health-preview">
          <div className="health-score" aria-hidden="true">4/5</div>
          <div>
            <p className="eyebrow">Tax Health, without a dashboard</p>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '.4rem' }}>A familiar readiness check.</h2>
            <p className="muted">Ready, resolved, and still-to-check items appear in one short report. No accounts, charts, or service maze.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Visual tax concepts</p>
          <h2>Understand the few terms this journey needs.</h2>
          <div className="grid-2">
            <article className="feature"><h3>FY 2025–26 → AY 2026–27</h3><p className="muted">Financial Year is when income is earned. Assessment Year is when that income is assessed and the return is prepared.</p></article>
            <article className="feature"><h3>Your type → the right checklist</h3><p className="muted">A person, company, and LLP do not use the same records or rules. KarSaathi keeps each fictional path separate.</p></article>
          </div>
        </div>
      </section>
    </>
  );
}

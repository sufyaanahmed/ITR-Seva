import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { COPY } from '../data/copy.js';

export default function Home() {
  const { demo, startDemo } = useApp();
  const copy = COPY[demo.language];
  const hindi = demo.language === 'hi';

  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="eyebrow">{hindi ? 'पहली बार रिटर्न भरने वालों के लिए' : 'For first-time salaried taxpayers'}</p>
          <h1>{hindi ? 'आयकर रिटर्न भरने से पहले साफ़ तस्वीर पाएँ।' : 'Get ready to file—without the tax confusion.'}</h1>
          <p className="lead">
            {hindi
              ? 'काल्पनिक दस्तावेज़ों से देखें कि क्या मेल खाता है, किस पर ध्यान देना है और अगला कदम क्या है। लगभग 3 मिनट।'
              : 'See which records agree, what needs attention, and what to do next. Try the complete journey with fictional data in about 3 minutes.'}
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/demo/documents" onClick={startDemo}>{copy.start}</Link>
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
          <div className="trust-item"><strong>Check the documents</strong><span className="muted">See Form 16, AIS, 26AS and bank records together.</span></div>
          <div className="trust-item"><strong>Find likely mismatches</strong><span className="muted">Resolve two realistic issues in plain language.</span></div>
          <div className="trust-item"><strong>Leave with a plan</strong><span className="muted">Get a clear readiness report, not a fake filing.</span></div>
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="container">
          <p className="eyebrow">One simple tax journey</p>
          <h2>From scattered records to clear next steps.</h2>
          <div className="grid-3">
            <article className="feature"><span className="feature-number">01</span><h3>Meet Rahul</h3><p className="muted">Use one fictional salaried example. No login and no real documents.</p></article>
            <article className="feature"><span className="feature-number">02</span><h3>Compare what was reported</h3><p className="muted">See what matches and resolve only the differences that matter.</p></article>
            <article className="feature"><span className="feature-number">03</span><h3>Know what to do next</h3><p className="muted">Receive likely form guidance, an illustrative estimate, and a printable checklist.</p></article>
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
            <article className="feature"><h3>FY 2025–26 → AY 2026–27</h3><p className="muted">Financial Year is when Rahul earned income. Assessment Year is when that income is assessed and the return is prepared.</p></article>
            <article className="feature"><h3>Documents → one income picture</h3><p className="muted">Form 16, AIS, Form 26AS and bank records each show a different part of the same story.</p></article>
          </div>
        </div>
      </section>
    </>
  );
}

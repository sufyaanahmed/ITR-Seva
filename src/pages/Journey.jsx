import { useEffect, useMemo, useRef } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import AssistantPanel from '../components/AssistantPanel.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import StepNav, { JOURNEY_STEPS } from '../components/StepNav.jsx';
import { COPY } from '../data/copy.js';
import { DEMO_DOCUMENTS, DEMO_PERSONA } from '../data/index.js';
import {
  buildReadinessReport,
  buildReconciliation,
  estimateTax,
  FILING_QUESTIONS,
  formatCurrency,
  getRecommendation,
  getUnresolvedItems,
  RECOMMENDATION,
  RESOLUTION_ACTION,
  serializeReadinessReport,
} from '../domain/index.js';
import { useApp } from '../context/AppContext.jsx';

const SOURCE_LABELS = {
  form16: 'Form 16',
  ais: 'AIS',
  form26as: 'Form 26AS',
  interestCertificate: 'Bank certificate',
};

const QUESTIONS = FILING_QUESTIONS.map((question) => {
  if (question.id === 'otherComplexity') {
    return { ...question, label: 'Any special-rate income or agricultural income above ₹5,000?' };
  }
  return question;
});

function normalizedAnswers(answers) {
  const otherComplexity = answers.otherComplexity;
  return {
    residentialStatus: 'resident',
    multipleEmployers: answers.multipleEmployers,
    houseProperties: answers.houseProperties,
    capitalGains: answers.capitalGains,
    businessOrProfessionalIncome: answers.businessOrProfessionalIncome,
    foreignAssetsOrIncome: answers.foreignAssetsOrIncome,
    totalIncomeAbove50Lakh: answers.totalIncomeAbove50Lakh,
    agriculturalIncome: otherComplexity === undefined ? undefined : otherComplexity ? 6001 : 0,
    specialRateIncome: otherComplexity,
  };
}

function DocumentsStep({ next, startDemo }) {
  return (
    <section className="panel" aria-labelledby="documents-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Meet Rahul</p>
          <h2 id="documents-title">Rahul has four fictional records to check.</h2>
          <p className="muted">One salary, ordinary bank interest, and no complex income. Nothing here belongs to a real person.</p>
        </div>
        <StatusBadge status="info">Synthetic data</StatusBadge>
      </div>

      <div className="notice">
        <strong>FY 2025–26</strong> is when Rahul earned the income. <strong>AY 2026–27</strong> is when that income is assessed and the return is prepared.
      </div>

      <div className="document-grid">
        {DEMO_DOCUMENTS.map((document) => (
          <article className="document-card" key={document.id}>
            <div className="document-meta">
              <div><h3>{document.title}</h3><p className="fine-print">{document.issuer}</p></div>
              <StatusBadge status="matched">Available</StatusBadge>
            </div>
            <dl>
              <dt>Period</dt><dd>FY {document.financialYear}</dd>
              <dt>Updated</dt><dd>{document.updatedOn}</dd>
              <dt>Why it matters</dt><dd>{document.kind === 'form16' ? 'Salary and salary TDS' : document.kind === 'ais' ? 'Income and reported transactions' : document.kind === 'form26as' ? 'Tax deducted and deposited' : 'Actual bank interest'}</dd>
            </dl>
          </article>
        ))}
      </div>

      <div className="step-actions">
        <Link className="button button-secondary" to="/">Back home</Link>
        <button className="button button-primary" type="button" onClick={() => { startDemo(); next(); }}>Compare these records</button>
      </div>
      <AssistantPanel context="documents" />
    </section>
  );
}

function EvidenceTable({ items }) {
  return (
    <>
      <div className="table-wrap desktop-evidence">
        <table className="data-table">
          <caption className="sr-only">Comparison of fictional tax records</caption>
          <thead><tr><th>Income or credit</th><th>Records found</th><th>Amounts</th><th>Status</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.label}</strong></td>
                <td>{item.entries.map((entry) => SOURCE_LABELS[entry.source]).join(', ')}</td>
                <td>{item.entries.map((entry) => <div className="amount" key={entry.id}>{SOURCE_LABELS[entry.source]}: {formatCurrency(entry.amount)}</div>)}</td>
                <td><StatusBadge status={item.status === 'matched' ? 'matched' : item.status === 'resolved' ? 'resolved' : 'review'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mobile-evidence">
        {items.map((item) => (
          <article className="document-card" key={item.id}>
            <div className="document-meta"><h3>{item.label}</h3><StatusBadge status={item.status === 'matched' ? 'matched' : item.status === 'resolved' ? 'resolved' : 'review'} /></div>
            {item.entries.map((entry) => <p className="fine-print" key={entry.id}><strong>{SOURCE_LABELS[entry.source]}:</strong> {formatCurrency(entry.amount)}</p>)}
          </article>
        ))}
      </div>
    </>
  );
}

function CompareStep({ items, setResolution, next }) {
  const unresolved = getUnresolvedItems(items);
  const matchedCount = items.filter((item) => item.status === 'matched').length;

  function resolve(itemId, action) {
    setResolution(itemId, { action, note: 'Selected in fictional guided demo', resolvedAt: 'demo-session' });
  }

  return (
    <section className="panel" aria-labelledby="compare-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Compare the records</p>
          <h2 id="compare-title">{matchedCount} items match. {unresolved.length} need attention.</h2>
          <p className="muted">Start with the differences. Rahul does not need to understand every tax schedule.</p>
        </div>
        <StatusBadge status={unresolved.length ? 'review' : 'resolved'}>{unresolved.length ? `${unresolved.length} to check` : 'All checked'}</StatusBadge>
      </div>

      <EvidenceTable items={items} />

      <div className="resolution-list">
        {items.filter((item) => ['missing', 'duplicate', 'resolved'].includes(item.originalStatus)).map((item) => {
          const resolved = item.status === 'resolved';
          const isDuplicate = item.id === 'savings-interest';
          return (
            <article className="resolution-card" data-resolved={resolved} key={item.id}>
              <StatusBadge status={resolved ? 'resolved' : 'review'} />
              <h3 style={{ marginTop: '.75rem' }}>{isDuplicate ? 'This AIS entry may be repeated.' : 'Fixed-deposit interest is missing from AIS.'}</h3>
              <p className="muted">
                {isDuplicate
                  ? 'The same ₹18,000 savings-interest amount appears twice in the fictional AIS.'
                  : 'Bank certificate: ₹42,000. AIS: not shown. Income may still need to be included even when AIS does not show it.'}
              </p>
              {resolved ? (
                <p><strong>{isDuplicate ? 'One repeated AIS entry is excluded from Rahul’s summary.' : '₹42,000 is included from the bank certificate.'}</strong></p>
              ) : (
                <div className="choice-grid">
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={() => resolve(item.id, isDuplicate ? RESOLUTION_ACTION.MARK_AIS_ENTRY_DUPLICATE : RESOLUTION_ACTION.INCLUDE_FROM_BANK_RECORD)}
                  >
                    {isDuplicate ? 'Mark one as duplicate' : 'Include from bank certificate'}
                  </button>
                  <p className="fine-print">Not sure? Leave this unresolved; the final report will tell Rahul to check it before filing.</p>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {unresolved.length > 0 && <div className="notice notice-warning"><strong>Resolve both sample differences to see the clean readiness path.</strong> You can still continue to see how unresolved items become blockers.</div>}
      <div className="step-actions">
        <Link className="button button-secondary" to="/demo/documents">Back</Link>
        <button className="button button-primary" type="button" onClick={next}>Continue with these answers</button>
      </div>
      <AssistantPanel context="compare" />
    </section>
  );
}

function QuestionControl({ question, value, setAnswer }) {
  if (question.type === 'number') {
    return (
      <div className="segmented">
        {[0, 1, 2].map((count) => (
          <label key={count}><input type="radio" name={question.id} checked={value === count} onChange={() => setAnswer(question.id, count)} />{count === 2 ? '2+' : count}</label>
        ))}
      </div>
    );
  }
  return (
    <div className="segmented">
      <label><input type="radio" name={question.id} checked={value === true} onChange={() => setAnswer(question.id, true)} />Yes</label>
      <label><input type="radio" name={question.id} checked={value === false} onChange={() => setAnswer(question.id, false)} />No</label>
    </div>
  );
}

function QuestionsStep({ demo, setAnswer, next }) {
  const answered = QUESTIONS.filter((question) => demo.answers[question.id] !== undefined).length;
  return (
    <section className="panel" aria-labelledby="questions-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Personalised tax guidance</p>
          <h2 id="questions-title">Seven quick questions find the likely next step.</h2>
          <p className="muted">These answers affect a deterministic form check. AI does not decide the result.</p>
        </div>
        <StatusBadge status={answered === QUESTIONS.length ? 'resolved' : 'info'}>{answered} of {QUESTIONS.length}</StatusBadge>
      </div>
      <div className="question-list">
        {QUESTIONS.map((question, index) => (
          <fieldset className="question" key={question.id}>
            <legend>{index + 1}. {question.label}</legend>
            <p>Why we ask: {question.why}</p>
            <QuestionControl question={question} value={demo.answers[question.id]} setAnswer={setAnswer} />
          </fieldset>
        ))}
      </div>
      {answered < QUESTIONS.length && <div className="notice notice-warning">Answer all seven questions to receive a useful result.</div>}
      <div className="step-actions">
        <Link className="button button-secondary" to="/demo/compare">Back</Link>
        <button className="button button-primary" type="button" disabled={answered < QUESTIONS.length} onClick={next}>Show Rahul’s result</button>
      </div>
    </section>
  );
}

function RegimeCard({ regime, recommended }) {
  return (
    <article className={`regime ${recommended ? 'regime-recommended' : ''}`}>
      {recommended && <StatusBadge status="resolved">Lower illustration</StatusBadge>}
      <h3 style={{ marginTop: '.75rem' }}>{regime.regime === 'new' ? 'New regime' : 'Old regime'}</h3>
      <p className="regime-total">{formatCurrency(regime.totalTax)}</p>
      <div className="calc-line"><span>Gross income</span><strong>{formatCurrency(regime.grossIncome)}</strong></div>
      <div className="calc-line"><span>Standard deduction</span><strong>− {formatCurrency(regime.standardDeduction)}</strong></div>
      <div className="calc-line"><span>Chapter VI-A used</span><strong>− {formatCurrency(regime.chapterVIADeductions)}</strong></div>
      <div className="calc-line"><span>Taxable income</span><strong>{formatCurrency(regime.taxableIncome)}</strong></div>
      {regime.rebate > 0 && <div className="calc-line"><span>Rebate</span><strong>− {formatCurrency(regime.rebate)}</strong></div>}
      {regime.marginalRelief > 0 && <div className="calc-line"><span>Marginal relief</span><strong>− {formatCurrency(regime.marginalRelief)}</strong></div>}
      <div className="calc-line"><span>4% cess</span><strong>{formatCurrency(regime.cess)}</strong></div>
    </article>
  );
}

function ResultStep({ recommendation, taxComparison, next }) {
  const candidate = recommendation.kind === RECOMMENDATION.ITR1_CANDIDATE;
  const incomplete = recommendation.kind === RECOMMENDATION.INSUFFICIENT_INFORMATION;
  return (
    <>
      <section className="panel recommendation" aria-labelledby="result-title">
        <p className="eyebrow">Likely filing route</p>
        <h2 className="result-title" id="result-title">{recommendation.title}</h2>
        <p className="muted">Based only on Rahul’s fictional records and answers. This is guidance, not a final tax determination.</p>
        <ul className="reason-list">{recommendation.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
        <p className="fine-print">Source checked 25 August 2026: <a href={recommendation.source.url} target="_blank" rel="noreferrer">{recommendation.source.title} ↗</a></p>
      </section>

      <section className="panel" aria-labelledby="estimate-title">
        <div className="panel-heading">
          <div><p className="eyebrow">Visual tax calculator</p><h2 id="estimate-title">A small, explainable comparison.</h2><p className="muted">No sliders or hidden formulas. Only the supported salaried example.</p></div>
          <StatusBadge status={taxComparison.status === 'ready' ? 'info' : 'blocked'}>{taxComparison.status === 'ready' ? 'Illustrative' : 'Unavailable'}</StatusBadge>
        </div>
        {taxComparison.status === 'blocked' ? (
          <div className="notice notice-danger"><strong>This example needs expert review.</strong><p>{taxComparison.reason}</p></div>
        ) : (
          <>
            <div className="metric-grid">
              <div className="metric"><span>Reconciled gross income</span><strong>{formatCurrency(taxComparison.grossIncome)}</strong></div>
              <div className="metric"><span>Lower illustration</span><strong>{taxComparison.lowerTaxRegime === 'same' ? 'Same' : `${taxComparison.lowerTaxRegime} regime`}</strong></div>
              <div className="metric"><span>Difference</span><strong>{formatCurrency(taxComparison.difference)}</strong></div>
            </div>
            <div className="compare-grid">
              <RegimeCard regime={taxComparison.newRegime} recommended={taxComparison.lowerTaxRegime === 'new'} />
              <RegimeCard regime={taxComparison.oldRegime} recommended={taxComparison.lowerTaxRegime === 'old'} />
            </div>
            <details style={{ marginTop: '1rem' }}><summary><strong>How was this estimated?</strong></summary><ul className="fine-print">{taxComparison.assumptions.map((assumption) => <li key={assumption}>{assumption}</li>)}</ul></details>
          </>
        )}
        {!candidate && !incomplete && <div className="notice notice-warning">The comparison stops for complex income instead of offering false precision.</div>}
        <div className="step-actions">
          <Link className="button button-secondary" to="/demo/questions">Back</Link>
          <button className="button button-primary" type="button" disabled={incomplete} onClick={next}>Create readiness report</button>
        </div>
        <AssistantPanel context="result" />
      </section>
    </>
  );
}

function ReportStep({ report, resetDemo }) {
  const navigate = useNavigate();
  function downloadJson() {
    const blob = new Blob([serializeReadinessReport(report)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'karsaathi-fictional-readiness-report.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  const ready = report.status === 'ready_to_continue';
  return (
    <section className="panel" aria-labelledby="report-title">
      <div className="report-header">
        <div><p className="eyebrow">Tax Health</p><h2 className="result-title" id="report-title">Rahul’s filing readiness</h2><p className="muted">FY {report.financialYear} · AY {report.assessmentYear} · fictional demonstration</p></div>
        <StatusBadge status={ready ? 'resolved' : 'review'}>{ready ? 'Ready to continue' : 'Needs attention'}</StatusBadge>
      </div>

      <div className="report-section">
        <h3>Ready</h3>
        <ul className="check-list">{report.completedChecks.map((check) => <li key={check}>{check} checked</li>)}</ul>
      </div>
      <div className="report-section">
        <h3>{ready ? 'Nothing left in this demo' : 'Still to check'}</h3>
        {ready ? <p>All supported fictional checks are complete.</p> : <ul className="blocker-list">{report.blockers.map((blocker) => <li key={blocker}>{blocker}</li>)}</ul>}
      </div>
      <div className="report-section">
        <h3>Rahul’s next three steps</h3>
        <ol className="reason-list">
          <li>Keep Form 16, AIS, Form 26AS, and the bank certificate ready.</li>
          <li>Review the likely filing form and illustrative calculation on the official service.</li>
          <li>Continue on the official e-Filing portal or seek qualified help if anything differs.</li>
        </ol>
      </div>
      <div className="notice notice-warning"><strong>Nothing was filed.</strong> {report.disclaimer}</div>

      <div className="hero-actions no-print">
        <button className="button button-primary" type="button" onClick={() => window.print()}>Print readiness report</button>
        <button className="button button-secondary" type="button" onClick={downloadJson}>Export fictional JSON</button>
        <a className="button button-secondary" href="https://www.incometax.gov.in/" target="_blank" rel="noreferrer">Open official e-Filing portal ↗</a>
      </div>
      <p className="fine-print no-print">The official portal opens in a new tab. KarSaathi does not transfer any data.</p>
      <button className="topic-button no-print" type="button" onClick={() => { resetDemo(); navigate('/'); }}>Start demo again</button>
    </section>
  );
}

export default function Journey() {
  const { stepId } = useParams();
  const navigate = useNavigate();
  const headingRef = useRef(null);
  const { demo, startDemo, setResolution, setAnswer, resetDemo } = useApp();
  const stepIndex = JOURNEY_STEPS.findIndex((step) => step.id === stepId);
  const copy = COPY[demo.language];

  const reconciliation = useMemo(() => buildReconciliation(demo.resolutions), [demo.resolutions]);
  const answers = useMemo(() => normalizedAnswers(demo.answers), [demo.answers]);
  const recommendation = useMemo(() => getRecommendation(answers), [answers]);
  const taxComparison = useMemo(() => estimateTax(DEMO_PERSONA, answers, demo.resolutions), [answers, demo.resolutions]);
  const report = useMemo(() => buildReadinessReport({ persona: DEMO_PERSONA, reconciliationItems: reconciliation, recommendation, taxComparison }), [reconciliation, recommendation, taxComparison]);
  const issuesResolved = getUnresolvedItems(reconciliation).length === 0;
  const questionsAnswered = QUESTIONS.every((question) => demo.answers[question.id] !== undefined);
  const completedThrough = questionsAnswered ? 4 : issuesResolved ? 2 : demo.started ? 1 : 0;

  useEffect(() => {
    headingRef.current?.focus();
  }, [stepId, stepIndex]);

  if (stepIndex < 0) return <Navigate to="/demo/documents" replace />;
  const next = () => navigate(`/demo/${JOURNEY_STEPS[Math.min(stepIndex + 1, JOURNEY_STEPS.length - 1)].id}`);

  return (
    <>
      <div className="container journey-header">
        <p className="eyebrow">Rahul’s fictional tax journey</p>
        <h1 tabIndex="-1" ref={headingRef}>Am I ready to file?</h1>
        <p className="muted">Step {stepIndex + 1} of {JOURNEY_STEPS.length} · one familiar path, no service maze</p>
        <button className="topic-button no-print" type="button" onClick={() => { resetDemo(); navigate('/'); }}>{copy.reset}</button>
        <span className="sr-only" aria-live="polite">Step {stepIndex + 1} of {JOURNEY_STEPS.length}: {JOURNEY_STEPS[stepIndex]?.label || ''}</span>
      </div>
      <div className="container journey-layout">
        <StepNav currentStep={stepId} completedThrough={completedThrough} />
        <div>
          {stepId === 'documents' && <DocumentsStep next={next} startDemo={startDemo} />}
          {stepId === 'compare' && <CompareStep items={reconciliation} setResolution={setResolution} next={next} />}
          {stepId === 'questions' && <QuestionsStep demo={demo} setAnswer={setAnswer} next={next} />}
          {stepId === 'result' && <ResultStep recommendation={recommendation} taxComparison={taxComparison} next={next} />}
          {stepId === 'report' && <ReportStep report={report} resetDemo={resetDemo} />}
        </div>
      </div>
    </>
  );
}

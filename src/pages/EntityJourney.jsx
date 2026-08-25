import { useEffect, useMemo, useRef } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge.jsx';
import StepNav, { JOURNEY_STEPS } from '../components/StepNav.jsx';
import { useApp } from '../context/AppContext.jsx';
import { getEntityJourneyProfile } from '../data/index.js';
import { evaluateEntityJourney } from '../domain/index.js';

const ANSWER_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'not_sure', label: 'Not sure' },
];

const CHECK_OPTIONS = [
  { value: 'checked', label: 'Looks ready' },
  { value: 'needs_attention', label: 'Add to review list' },
  { value: 'not_sure', label: 'Not sure' },
];

function DocumentsStep({ profile, onStart, next }) {
  return (
    <section className="panel" aria-labelledby="documents-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Meet {profile.identity.name}</p>
          <h2 id="documents-title">Start with this fictional {profile.shortLabel.toLowerCase()} review pack.</h2>
          <p className="muted">{profile.description} Nothing here belongs to a real organisation.</p>
        </div>
        <StatusBadge status="info">Synthetic data</StatusBadge>
      </div>
      <div className="notice"><strong>FY {profile.financialYear}</strong> records are being prepared for <strong>AY {profile.assessmentYear}</strong>.</div>
      <div className="document-grid">
        {profile.documents.map((document) => (
          <article className="document-card" key={document.id}>
            <div className="document-meta"><h3>{document.title}</h3><StatusBadge status="matched">Available</StatusBadge></div>
            <p className="fine-print">Prepared by: {document.issuer}</p>
            <p>{document.why}</p>
          </article>
        ))}
      </div>
      <div className="notice notice-warning"><strong>Use fictional data only.</strong> Never enter a PAN, TAN, CIN/LLPIN, GSTIN, DSC credential, bank detail, or real business record.</div>
      <div className="step-actions">
        <Link className="button button-secondary" to="/demo">Back to samples</Link>
        <button className="button button-primary" type="button" onClick={() => { onStart(); next(); }}>Review this pack</button>
      </div>
    </section>
  );
}

function ReviewStep({ profile, checks, setCheck, next }) {
  const answered = profile.reviewChecks.filter((check) => Object.prototype.hasOwnProperty.call(checks, check.id)).length;
  return (
    <section className="panel" aria-labelledby="compare-title">
      <div className="panel-heading">
        <div><p className="eyebrow">Review the records</p><h2 id="compare-title">Three checks make the handoff clearer.</h2><p className="muted">This does not change any official record. It only builds a review list.</p></div>
        <StatusBadge status={answered === profile.reviewChecks.length ? 'resolved' : 'info'}>{answered} of {profile.reviewChecks.length}</StatusBadge>
      </div>
      <div className="question-list">
        {profile.reviewChecks.map((check, index) => (
          <fieldset className="question" key={check.id}>
            <legend>{index + 1}. {check.label}</legend>
            <p>{check.why}</p>
            <div className="segmented entity-options">
              {CHECK_OPTIONS.map((option) => (
                <label key={option.value}><input type="radio" name={check.id} checked={checks[check.id] === option.value} onChange={() => setCheck(check.id, option.value)} />{option.label}</label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      {answered < profile.reviewChecks.length && <div className="notice notice-warning">Choose an answer for each check. “Not sure” is always safe.</div>}
      <div className="step-actions">
        <Link className="button button-secondary" to={`/demo/${profile.id}/documents`}>Back</Link>
        <button className="button button-primary" type="button" disabled={answered < profile.reviewChecks.length} onClick={next}>Continue to quick questions</button>
      </div>
    </section>
  );
}

function QuestionsStep({ profile, answers, setAnswer, next }) {
  const answered = profile.questions.filter((question) => Object.prototype.hasOwnProperty.call(answers, question.id)).length;
  return (
    <section className="panel" aria-labelledby="questions-title">
      <div className="panel-heading">
        <div><p className="eyebrow">Type-specific guidance</p><h2 id="questions-title">A few questions find the safest next step.</h2><p className="muted">Plain answers only. KarSaathi will not guess when the answer is uncertain.</p></div>
        <StatusBadge status={answered === profile.questions.length ? 'resolved' : 'info'}>{answered} of {profile.questions.length}</StatusBadge>
      </div>
      <div className="question-list">
        {profile.questions.map((question, index) => (
          <fieldset className="question" key={question.id}>
            <legend>{index + 1}. {question.label}</legend>
            <p><strong>Why we ask:</strong> {question.why}</p>
            <div className="segmented">
              {ANSWER_OPTIONS.map((option) => (
                <label key={option.value}><input type="radio" name={question.id} checked={answers[question.id] === option.value} onChange={() => setAnswer(question.id, option.value)} />{option.label}</label>
              ))}
            </div>
            {answers[question.id] === 'not_sure' && <p className="uncertainty-note">That is okay. This stays visible in the final review list.</p>}
          </fieldset>
        ))}
      </div>
      {answered < profile.questions.length && <div className="notice notice-warning">Answer each question—even with “Not sure”—to see the result.</div>}
      <div className="step-actions">
        <Link className="button button-secondary" to={`/demo/${profile.id}/compare`}>Back</Link>
        <button className="button button-primary" type="button" disabled={answered < profile.questions.length} onClick={next}>Show the safest route</button>
      </div>
    </section>
  );
}

function ResultStep({ profile, result, next }) {
  return (
    <>
      <section className="panel recommendation" aria-labelledby="result-title">
        <p className="eyebrow">Possible official starting point</p>
        <h2 className="result-title" id="result-title">{result.recommendation.title}</h2>
        <p className="muted">For {profile.identity.name}, a fictional {profile.identity.legalForm}. This is a preparation aid, not a final form determination.</p>
        <ul className="reason-list">{result.recommendation.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
        <p className="fine-print">Source checked {profile.officialSource.checkedOn}: <a href={profile.officialSource.url} target="_blank" rel="noreferrer" aria-label={`${profile.officialSource.title} (opens in a new tab)`}>{profile.officialSource.title} ↗</a></p>
      </section>
      <section className="panel" aria-labelledby="estimate-title">
        <div className="panel-heading"><div><p className="eyebrow">Deliberate safety boundary</p><h2 id="estimate-title">No entity tax estimate is shown.</h2><p className="muted">{result.taxCalculation.reason}</p></div><StatusBadge status="blocked">Not modelled</StatusBadge></div>
        <div className="notice notice-warning"><strong>This is intentional.</strong> A short, honest checklist is safer than a confident but incomplete company or LLP calculation.</div>
        <div className="step-actions">
          <Link className="button button-secondary" to={`/demo/${profile.id}/questions`}>Back</Link>
          <button className="button button-primary" type="button" onClick={next}>Create review pack</button>
        </div>
      </section>
    </>
  );
}

function ReportStep({ profile, report, resetJourney }) {
  const navigate = useNavigate();
  const ready = report.status === 'ready_for_professional_review';

  function downloadJson() {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `karsaathi-${profile.id}-fictional-review-pack.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="panel" aria-labelledby="report-title">
      <div className="report-header">
        <div><p className="eyebrow">Tax Health</p><h2 className="result-title" id="report-title">{profile.identity.name} review pack</h2><p className="muted">FY {report.financialYear} · AY {report.assessmentYear} · fictional {profile.shortLabel.toLowerCase()} example</p></div>
        <StatusBadge status={ready ? 'resolved' : 'review'}>{ready ? 'Pack ready for review' : 'Needs attention'}</StatusBadge>
      </div>
      <div className="report-section"><h3>Checked in this demo</h3>{report.completedChecks.length ? <ul className="check-list">{report.completedChecks.map((check) => <li key={check}>{check}</li>)}</ul> : <p className="muted">No checks are complete yet.</p>}</div>
      <div className="report-section"><h3>{ready ? 'No unresolved demo items' : 'Bring these to the review'}</h3>{ready ? <p>All fictional pack checks are complete. A qualified professional must still confirm the final form and filing position.</p> : <ul className="blocker-list">{report.blockers.map((blocker) => <li key={blocker}>{blocker}</li>)}</ul>}</div>
      <div className="report-section"><h3>Next three steps</h3><ol className="reason-list">{report.nextSteps.map((step) => <li key={step}>{step}</li>)}</ol></div>
      <div className="notice notice-warning"><strong>Nothing was filed.</strong> {report.caveat}</div>
      <div className="hero-actions no-print">
        <button className="button button-primary" type="button" onClick={() => window.print()}>Print review pack</button>
        <button className="button button-secondary" type="button" onClick={downloadJson}>Export fictional JSON</button>
        <a className="button button-secondary" href={profile.officialSource.url} target="_blank" rel="noreferrer" aria-label={`Open ${profile.officialSource.title} in a new tab`}>Open official guidance ↗</a>
      </div>
      <button className="topic-button no-print" type="button" onClick={() => { resetJourney(); navigate('/demo'); }}>Choose another sample</button>
    </section>
  );
}

export default function EntityJourney() {
  const { profileId, stepId } = useParams();
  const profile = getEntityJourneyProfile(profileId);
  const navigate = useNavigate();
  const headingRef = useRef(null);
  const { demo, startDemo, setResolution, setAnswer, resetDemo } = useApp();
  const session = demo.journeys?.[profileId];
  const stepIndex = JOURNEY_STEPS.findIndex((step) => step.id === stepId);
  const allChecksAnswered = profile?.reviewChecks.every((check) => Object.prototype.hasOwnProperty.call(session?.resolutions || {}, check.id));
  const allQuestionsAnswered = profile?.questions.every((question) => Object.prototype.hasOwnProperty.call(session?.answers || {}, question.id));
  const result = useMemo(() => profile ? evaluateEntityJourney(profileId, { answers: session?.answers, checks: session?.resolutions }) : null, [profile, profileId, session?.answers, session?.resolutions]);

  useEffect(() => { headingRef.current?.focus(); }, [stepId, profileId]);

  if (!profile || stepIndex < 0) return <Navigate to="/demo" replace />;
  if (stepId !== 'documents' && !session?.started) return <Navigate to={`/demo/${profileId}/documents`} replace />;
  if (['questions', 'result', 'report'].includes(stepId) && !allChecksAnswered) return <Navigate to={`/demo/${profileId}/compare`} replace />;
  if (['result', 'report'].includes(stepId) && !allQuestionsAnswered) return <Navigate to={`/demo/${profileId}/questions`} replace />;

  const next = () => navigate(`/demo/${profileId}/${JOURNEY_STEPS[Math.min(stepIndex + 1, JOURNEY_STEPS.length - 1)].id}`);
  const completedThrough = stepId === 'report' ? 4 : allQuestionsAnswered ? 3 : allChecksAnswered ? 2 : session?.started ? 1 : 0;

  return (
    <>
      <div className="container journey-header">
        <p className="eyebrow">{profile.shortLabel} · fictional sample</p>
        <h1 tabIndex="-1" ref={headingRef}>Is this review pack ready?</h1>
        <p className="muted">Step {stepIndex + 1} of {JOURNEY_STEPS.length} · the same simple pattern, tailored to this entity</p>
        <div className="journey-utilities no-print"><Link className="topic-button" to="/demo">Change sample</Link><button className="topic-button" type="button" onClick={() => { resetDemo(profileId); navigate(`/demo/${profileId}/documents`); }}>Reset this sample</button></div>
        <span className="sr-only" aria-live="polite">Step {stepIndex + 1} of {JOURNEY_STEPS.length}: {JOURNEY_STEPS[stepIndex]?.label}</span>
      </div>
      <div className="container journey-layout">
        <StepNav currentStep={stepId} completedThrough={completedThrough} basePath={`/demo/${profileId}`} />
        <div>
          {stepId === 'documents' && <DocumentsStep profile={profile} onStart={() => startDemo(profileId)} next={next} />}
          {stepId === 'compare' && <ReviewStep profile={profile} checks={session.resolutions} setCheck={(id, value) => setResolution(profileId, id, value)} next={next} />}
          {stepId === 'questions' && <QuestionsStep profile={profile} answers={session.answers} setAnswer={(id, value) => setAnswer(profileId, id, value)} next={next} />}
          {stepId === 'result' && <ResultStep profile={profile} result={result} next={next} />}
          {stepId === 'report' && <ReportStep profile={profile} report={result} resetJourney={() => resetDemo(profileId)} />}
        </div>
      </div>
    </>
  );
}

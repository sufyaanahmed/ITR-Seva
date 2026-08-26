import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../state/store.jsx';
import {
  FORM_STAGES, STAGES, getStage, requiredDocuments, visibleFields,
} from '../lib/fields.js';
import { isEditable, stageProgress } from '../lib/application.js';
import { validateField, validateStage } from '../lib/validation.js';
import Page from '../ui/Page.jsx';
import Button from '../ui/Button.jsx';
import { Field, ErrorSummary } from '../ui/Field.jsx';
import { Banner, EmptyState } from '../ui/feedback.jsx';
import { StageProgress } from '../ui/structure.jsx';

function DocumentsStage({ app }) {
  const { selectDocument, removeDocument, announce } = useStore();
  const navigate = useNavigate();
  const docs = requiredDocuments(app.data);
  const missing = docs.filter((req) => !app.documents.some((doc) => doc.slot === req.type));
  const summaryRef = useRef(null);
  const [showErrors, setShowErrors] = useState(false);

  const continueToReview = () => {
    if (missing.length > 0) {
      setShowErrors(true);
      announce(`${missing.length} demo document ${missing.length === 1 ? 'is' : 'are'} still needed.`);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    navigate(`/application/${app.id}/review`);
  };

  return (
    <>
      <Banner tone="warning" title="Choose invented files only" className="mb-8">
        The prototype stores the filename, size and time you chose it. The file itself is not uploaded or kept.
      </Banner>
      {showErrors && missing.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="mb-8 border border-danger bg-danger-bg p-5">
          <h2 className="text-heading font-semibold text-danger mb-2">Choose {missing.length} more demo {missing.length === 1 ? 'file' : 'files'}</h2>
          <ul className="list-disc pl-5 text-body text-ink-muted">{missing.map((d) => <li key={d.type}>{d.title}</li>)}</ul>
        </div>
      )}
      <div className="grid gap-5">
        {docs.map((req) => {
          const selected = app.documents.find((doc) => doc.slot === req.type);
          return (
            <section key={req.type} className="border border-rule-strong bg-paper-1 p-5 sm:p-6">
              <h2 className="text-subhead font-semibold text-ink mb-1">{req.title}</h2>
              <p className="text-body text-ink-muted mb-4 max-w-prose">{req.desc}</p>
              {selected ? (
                <div className="flex flex-wrap items-center justify-between gap-4 bg-success-bg border-l-rail border-success p-4">
                  <div><p className="text-body font-semibold break-all">{selected.filename}</p><p className="text-meta text-ink-muted">Metadata selected · {Math.max(1, Math.round(selected.sizeBytes / 1024))} KB</p></div>
                  <Button variant="quiet" onClick={() => removeDocument(req.type)}>Remove</Button>
                </div>
              ) : (
                <label className="file-picker-label inline-flex min-h-touch items-center px-5 py-3 border border-indigo text-indigo font-semibold cursor-pointer rounded-control hover:bg-indigo-50">
                  Select demo file
                  <input
                    type="file"
                    accept={req.accept}
                    className="sr-only"
                    data-agent-field={`document_${req.type}`}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) selectDocument(req.type, file);
                    }}
                  />
                </label>
              )}
            </section>
          );
        })}
      </div>
      <div className="mt-8 pt-6 border-t border-rule flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
        <Button variant="secondary" to={`/application/${app.id}/stage/travel`}>Back to travel plans</Button>
        <Button onClick={continueToReview}>Review demo application</Button>
      </div>
    </>
  );
}

export default function Stage() {
  const { appId, stageId } = useParams();
  const navigate = useNavigate();
  const store = useStore();
  const { app: active, resolve, loadScenario, updateField, dispatch, flush, announce } = store;
  const resolved = resolve(appId);
  const app = active?.id === appId ? active : resolved;
  const stage = getStage(stageId);
  const [errors, setErrors] = useState({});
  const summaryRef = useRef(null);

  useEffect(() => {
    if (resolved?.kind === 'seed' && active?.id !== appId) loadScenario(appId);
  }, [active?.id, appId, loadScenario, resolved?.kind]);

  if (!app) return <Navigate to="/start" replace />;
  if (!stage) return <Navigate to={`/application/${app.id}`} replace />;
  if (stageId === 'review') return <Navigate to={`/application/${app.id}/review`} replace />;
  if (stageId === 'submit') return <Navigate to={`/application/${app.id}/submit`} replace />;

  if (!isEditable(app)) {
    return (
      <Page routeId="application-stage" title={stage.title} lede="This record is locked because its simulated submission has already happened.">
        <EmptyState title="Answers can no longer be edited" action={<Button to={`/application/${app.id}/status`}>View application status</Button>}>
          This mirrors the point at which a submitted application becomes a fixed record. Nothing was sent outside this browser.
        </EmptyState>
      </Page>
    );
  }

  const progress = stageProgress(app);
  const stageIndex = STAGES.findIndex((item) => item.id === stage.id);
  const previous = STAGES[stageIndex - 1];

  const onBlur = (name) => {
    const field = visibleFields(stage, app.data).find((item) => item.name === name);
    const error = field ? validateField(field, app.data) : null;
    setErrors((current) => ({ ...current, [name]: error }));
  };

  const onChange = (name, value) => {
    if (app.status === 'READY_FOR_REVIEW') dispatch({ type: 'REOPEN' });
    updateField(name, value);
    if (errors[name]) {
      const field = visibleFields(stage, { ...app.data, [name]: value }).find((item) => item.name === name);
      setErrors((current) => ({ ...current, [name]: field ? validateField(field, { ...app.data, [name]: value }) : null }));
    }
  };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = validateStage(stage, app.data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      announce(`${Object.keys(nextErrors).length} ${Object.keys(nextErrors).length === 1 ? 'problem' : 'problems'} to fix on ${stage.title}.`);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    flush();
    const next = FORM_STAGES[FORM_STAGES.findIndex((item) => item.id === stage.id) + 1];
    navigate(next ? `/application/${app.id}/stage/${next.id}` : `/application/${app.id}/stage/documents`);
  };

  return (
    <Page
      routeId="application-stage"
      title={stage.title}
      lede={`${stage.purpose} Estimated effort: ${stage.effort}.`}
      width="dashboard"
      pageClass="application-stage-page"
    >
      <div className="grid gap-6 lg:gap-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside aria-label="Application stages"><StageProgress stages={progress} currentId={stage.id} appId={app.id} /></aside>
        <div className="min-w-0">
          {stage.id === 'documents' ? <DocumentsStage app={app} /> : (
            <form onSubmit={submit} noValidate>
              <p className="stage-privacy-note">Use made-up details. Answers stay in this browser.</p>
              <ErrorSummary ref={summaryRef} errors={Object.fromEntries(Object.entries(errors).filter(([, value]) => value))} />
              {stage.groups.map((group) => {
                const fields = group.fields.filter((field) => !field.showIf || field.showIf(app.data));
                if (fields.length === 0) return null;
                return (
                  <fieldset key={group.legend} className="border-0 border-t border-rule p-0 pt-6 mb-8">
                    <legend className="font-display text-heading text-ink mb-2 p-0">{group.legend}</legend>
                    {group.note && <p className="text-body text-ink-muted max-w-prose mb-6">{group.note}</p>}
                    {fields.map((field) => (
                      <Field key={field.name} field={field} value={app.data[field.name]} data={app.data} onChange={onChange} onBlur={onBlur} error={errors[field.name]} />
                    ))}
                  </fieldset>
                );
              })}
              <div className="pt-6 border-t border-rule flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
                <div className="flex flex-col-reverse sm:flex-row gap-3">
                  <Button variant="secondary" to={previous ? `/application/${app.id}/stage/${previous.id}` : `/application/${app.id}`}>Back</Button>
                  <Button variant="quiet" to={`/application/${app.id}`} onClick={flush}>Save and exit</Button>
                </div>
                <Button type="submit">{stage.action}</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Page>
  );
}

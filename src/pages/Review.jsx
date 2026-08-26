import React, { useEffect } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../state/store.jsx';
import {
  FORM_STAGES, outstandingIssues, requiredDocuments, visibleFields,
} from '../lib/application.js';
import { optionsFor } from '../lib/fields.js';
import Page, { Section } from '../ui/Page.jsx';
import Button from '../ui/Button.jsx';
import { Banner } from '../ui/feedback.jsx';
import { DefinitionList } from '../ui/structure.jsx';

function displayValue(field, value, data) {
  if (value === undefined || value === null || value === '') return null;
  const option = optionsFor(field, data).find((item) => item.value === value);
  if (option) return option.label;
  if (field.type === 'date') {
    const date = new Date(`${value}T00:00:00`);
    if (!Number.isNaN(date.getTime())) return date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
  }
  return value;
}

export default function Review() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { app: active, resolve, loadScenario, dispatch, announce } = useStore();
  const resolved = resolve(appId);
  const app = active?.id === appId ? active : resolved;

  useEffect(() => {
    if (resolved?.kind === 'seed' && active?.id !== appId) loadScenario(appId);
  }, [active?.id, appId, loadScenario, resolved?.kind]);

  if (!app) return <Navigate to="/start" replace />;

  const issues = outstandingIssues(app);
  const issueGroups = FORM_STAGES.map((stage) => ({
    stage,
    issues: issues.filter((issue) => issue.stageId === stage.id),
  })).filter((group) => group.issues.length > 0);
  const committed = !['DRAFT', 'READY_FOR_REVIEW'].includes(app.status);

  const continueToSubmit = () => {
    if (issues.length > 0) return;
    if (app.status === 'DRAFT') {
      const error = dispatch({ type: 'REQUEST_REVIEW' });
      if (error) {
        announce(error);
        return;
      }
    }
    navigate(`/application/${app.id}/submit`);
  };

  return (
    <Page routeId="application-review" title="Review and resolve" lede="Problems come first. Then read every answer as one application before you simulate submission." width="dashboard">
      {committed && (
        <Banner tone="info" title="This is now a fixed demo record" className="mb-8">
          The simulated submission has happened, so answers cannot be changed. You can still read or print them.
        </Banner>
      )}

      {issues.length > 0 ? (
        <section className="border border-emph border-danger bg-danger-bg p-6 sm:p-8 mb-10" role="alert">
          <p className="text-overline uppercase text-danger mb-2">Needs attention</p>
          <h2 className="font-display text-title text-ink mb-2">Resolve {issues.length} {issues.length === 1 ? 'issue' : 'issues'} before submission</h2>
          <div className="mt-5 border-t border-danger/40">
            {issueGroups.map(({ stage, issues: stageIssues }) => (
              <details key={stage.id} className="border-b border-danger/40 py-3">
                <summary className="cursor-pointer font-semibold text-ink min-h-touch py-2">
                  {stage.title} · <span className="numeric">{stageIssues.length}</span> {stageIssues.length === 1 ? 'issue' : 'issues'}
                </summary>
                <ul className="grid gap-2 list-disc pl-6 pb-3 text-body text-ink-muted">
                  {stageIssues.map((issue) => <li key={issue.field}>{issue.message}</li>)}
                </ul>
                <Link to={`/application/${app.id}/stage/${stage.id}`} className="inline-flex min-h-touch items-center text-indigo underline underline-offset-4 font-semibold">
                  Edit {stage.title.toLowerCase()}
                </Link>
              </details>
            ))}
          </div>
        </section>
      ) : (
        <Banner tone="success" title="Ready for the final check" className="mb-10">
          Every required answer and demo-document slot is present. That does not mean a real application would be accepted.
        </Banner>
      )}

      {FORM_STAGES.map((stage) => {
        const fields = visibleFields(stage, app.data);
        return (
          <Section key={stage.id} className="border-t border-rule pt-7">
            <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
              <h2 className="font-display text-title text-ink">{stage.title}</h2>
              {!committed && <Button variant="quiet" size="compact" to={`/application/${app.id}/stage/${stage.id}`}>Edit this section</Button>}
            </div>
            <DefinitionList items={fields.map((field) => {
              const value = displayValue(field, app.data[field.name], app.data);
              return { term: field.label, value, missing: !value && field.required };
            })} />
          </Section>
        );
      })}

      <Section className="border-t border-rule pt-7">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
          <h2 className="font-display text-title text-ink">Documents</h2>
          {!committed && <Button variant="quiet" size="compact" to={`/application/${app.id}/stage/documents`}>Edit documents</Button>}
        </div>
        <DefinitionList items={requiredDocuments(app.data).map((req) => {
          const doc = app.documents.find((item) => item.slot === req.type);
          return { term: req.title, value: doc?.filename, missing: !doc };
        })} />
      </Section>

      <div className="mt-10 pt-6 border-t border-rule flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
        <Button variant="secondary" to={`/application/${app.id}`}>Back to application</Button>
        {committed ? (
          <Button to={`/application/${app.id}/status`}>View demo status</Button>
        ) : (
          <Button onClick={continueToSubmit} disabled={issues.length > 0}>Continue to simulated submission</Button>
        )}
      </div>
    </Page>
  );
}

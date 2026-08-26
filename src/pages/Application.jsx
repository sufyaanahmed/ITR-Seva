import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStore } from '../state/store.jsx';
import {
  STATE_META, STAGES, nextIncompleteStage, outstandingIssues, stageProgress,
} from '../lib/application.js';
import { PATHS } from '../lib/content.js';
import Page, { Section } from '../ui/Page.jsx';
import Button from '../ui/Button.jsx';
import { Banner, EmptyState, StatusBadge } from '../ui/feedback.jsx';
import { StageProgress, Timeline } from '../ui/structure.jsx';

function nextAction(app) {
  const stage = nextIncompleteStage(app);
  const map = {
    DRAFT: {
      title: 'Continue your application',
      body: `Your next incomplete stage is ${STAGES.find((item) => item.id === stage)?.title || 'review'}.`,
      label: 'Continue application',
      to: stage === 'review' ? 'review' : `stage/${stage}`,
    },
    READY_FOR_REVIEW: { title: 'Ready to submit', body: 'Your answers and demo documents have no outstanding issues.', label: 'Review before submission', to: 'review' },
    PAYMENT_PENDING: { title: 'Simulate the payment', body: 'No card or bank details are collected in this demonstration.', label: 'Continue to simulated payment', to: 'payment' },
    SUBMITTED: { title: 'Demo application submitted', body: 'Nothing was sent to an authority. Follow its fictional progress on the status page.', label: 'View demo status', to: 'status' },
    PROCESSING: { title: 'Nothing needed right now', body: 'This fictional application is with the demo reviewer.', label: 'View timeline', to: 'status' },
    DOCUMENTS_REQUIRED: { title: 'Replace a requested document', body: 'The demo reviewer has asked for new document metadata.', label: 'Respond to request', to: 'documents-requested' },
    GRANTED: { title: 'Prepare for the journey', body: 'View the fictional decision and print a clearly watermarked demo record.', label: 'View arrival readiness', to: 'status' },
    REFUSED: { title: 'Read the demo decision', body: 'See the fictional reason and the official-service next steps.', label: 'View decision', to: 'status' },
  };
  return map[app.status] || map.DRAFT;
}

export default function Application() {
  const { appId } = useParams();
  const { resolve } = useStore();
  const app = resolve(appId);

  if (!app) {
    return (
      <Page routeId="application" title="Application not found" lede="We could not find that demo record on this device.">
        <EmptyState title="Check the reference and access code" action={<Button to="/start">Start or resume</Button>}>
          A personal draft only exists in the browser that created it. Seeded reviewer scenarios can be reopened from Demo scenarios.
        </EmptyState>
      </Page>
    );
  }

  const action = nextAction(app);
  const progress = stageProgress(app);
  const issues = outstandingIssues(app);
  const path = PATHS[app.pathId];
  const applicant = [app.data.given_name, app.data.surname].filter(Boolean).join(' ');

  return (
    <Page
      routeId="application"
      eyebrow={path?.name || 'Demo visa application'}
      title={app.status === 'DRAFT' ? 'Continue your application' : 'Your application'}
      lede="One clear record for your answers, documents, simulated submission and demo decision."
      width="dashboard"
    >
      {app.kind === 'seed' && (
        <Banner tone="info" title="Seeded reviewer scenario" className="mb-6">
          This record is invented and resets when the page is reloaded. It is safe to explore.
        </Banner>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div>
          <section className="border border-rule-strong bg-paper-1 p-6 sm:p-8">
            <div className="flex flex-wrap justify-between items-start gap-5 mb-6">
              <div>
                <p className="text-overline uppercase text-ink-muted mb-2">Current position</p>
                <h2 className="font-display text-title text-ink mb-2">{action.title}</h2>
                <p className="text-body text-ink-muted max-w-prose">{action.body}</p>
              </div>
              <StatusBadge status={app.status} />
            </div>
            <Button to={`/application/${app.id}/${action.to}`} size="lg">{action.label}</Button>
          </section>

          <Section title="Application progress">
            <StageProgress stages={progress} currentId={nextIncompleteStage(app)} appId={app.id} />
            {issues.length > 0 && app.status === 'DRAFT' && (
              <p className="text-meta text-ink-muted mt-4">
                <span className="numeric font-semibold text-ink">{issues.length}</span>{' '}
                {issues.length === 1 ? 'item needs' : 'items need'} attention before review.
              </p>
            )}
          </Section>

          <Section title="Recent history">
            <Timeline events={app.timeline.slice(-3)} />
            <Link to={`/application/${app.id}/status`} className="inline-flex min-h-touch items-center mt-5 text-indigo underline underline-offset-4">
              See the complete timeline
            </Link>
          </Section>
        </div>

        <aside className="lg:border-l lg:border-rule lg:pl-8">
          <h2 className="font-display text-heading text-ink mb-4">At a glance</h2>
          <dl className="grid gap-4 text-body">
            <div><dt className="text-meta text-ink-muted">Application reference</dt><dd className="numeric font-semibold break-all">{app.id}</dd></div>
            <div><dt className="text-meta text-ink-muted">Access code</dt><dd className="numeric font-semibold">{app.accessCode}</dd></div>
            <div><dt className="text-meta text-ink-muted">Applicant</dt><dd>{applicant || 'Not answered yet'}</dd></div>
            <div><dt className="text-meta text-ink-muted">Visa route</dt><dd>{path?.name || app.pathId}</dd></div>
            <div><dt className="text-meta text-ink-muted">State</dt><dd>{STATE_META[app.status]?.label}</dd></div>
          </dl>
          <p className="text-meta text-ink-faint mt-5">The access code is only a demo convenience, not a real security control.</p>
          <div className="mt-6 pt-5 border-t border-rule grid gap-2">
            <Link to={`/application/${app.id}/print`} className="inline-flex min-h-touch items-center text-indigo underline underline-offset-4">Print demo record</Link>
            <Link to="/help/your-data" className="inline-flex min-h-touch items-center text-indigo underline underline-offset-4">How local data is stored</Link>
          </div>
        </aside>
      </div>
    </Page>
  );
}

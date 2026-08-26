import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useStore } from '../state/store.jsx';
import { STATE_META } from '../lib/application.js';
import { PATHS } from '../lib/content.js';
import { SOURCES } from '../lib/rules/sources.js';
import Page, { Section } from '../ui/Page.jsx';
import Button, { ExternalLink } from '../ui/Button.jsx';
import { Banner, StatusBadge } from '../ui/feedback.jsx';
import { Stamp, Timeline } from '../ui/structure.jsx';

function statusPanel(app) {
  const map = {
    DRAFT: { tone: 'info', title: 'Continue your draft', body: 'This has not been submitted, even in the demonstration.', label: 'Continue application', path: '' },
    READY_FOR_REVIEW: { tone: 'info', title: 'Ready for your final check', body: 'Review every answer before you create the fictional submission.', label: 'Review application', path: 'review' },
    PAYMENT_PENDING: { tone: 'warning', title: 'Simulated payment waiting', body: 'No card details or money are needed. The demo application is not submitted until the payment simulation succeeds.', label: 'Continue to simulated payment', path: 'payment' },
    SUBMITTED: { tone: 'info', title: 'Submitted in this demonstration', body: 'The fixed record was created locally. Nothing was sent to an authority.', label: 'Print demo record', path: 'print' },
    PROCESSING: { tone: 'info', title: 'Fictional review in progress', body: 'No action is needed. This status only belongs to the seeded demonstration.', label: 'Print demo record', path: 'print' },
    DOCUMENTS_REQUIRED: { tone: 'warning', title: 'A replacement document is needed', body: 'Choose an invented file to practise responding to the request.', label: 'Respond to document request', path: 'documents-requested' },
    GRANTED: { tone: 'success', title: 'Granted in this demonstration', body: 'This is not permission to travel. The artefact and decision are fictional.', label: 'Print watermarked demo ETA', path: 'print' },
    REFUSED: { tone: 'danger', title: 'Not granted in this demonstration', body: 'This fictional result has no effect on any real visa application.', label: 'Print demo record', path: 'print' },
  };
  return map[app.status] || map.DRAFT;
}

export default function Status() {
  const { appId } = useParams();
  const { resolve } = useStore();
  const app = resolve(appId);
  if (!app) return <Navigate to="/track" replace />;

  const panel = statusPanel(app);
  const path = PATHS[app.pathId];
  const applicant = [app.data.given_name, app.data.surname].filter(Boolean).join(' ');

  return (
    <Page routeId="application-status" eyebrow="Demo application status" title={STATE_META[app.status]?.label || 'Application status'} lede="The status and timeline below come from this record's own lifecycle events." width="dashboard">
      <div className="flex flex-wrap items-start justify-between gap-5 mb-8">
        <StatusBadge status={app.status} />
        <p className="text-meta text-ink-muted">Application <span className="numeric font-semibold text-ink">{app.id}</span></p>
      </div>

      <Banner tone={panel.tone} title={panel.title} action={<Button to={`/application/${app.id}/${panel.path}`}>{panel.label}</Button>}>
        {panel.body}
      </Banner>

      {app.status === 'GRANTED' && (
        <section className="mt-10 border border-gold bg-paper-1 p-6 sm:p-8 flex flex-col sm:flex-row gap-7 items-start justify-between">
          <div>
            <p className="text-overline uppercase text-ink-muted mb-2">Arrival readiness</p>
            <h2 className="font-display text-title text-ink mb-3">A warm welcome starts with being prepared</h2>
            <p className="text-body text-ink-muted max-w-prose mb-5">Carry the real ETA issued by the official service, check that your passport matches it, and complete the official e-Arrival Card before travel.</p>
            <div className="flex flex-wrap gap-4">
              <ExternalLink href={SOURCES.earrival.url}>Open the official e-Arrival Card</ExternalLink>
              <ExternalLink href={SOURCES.portal.url}>Check official visa guidance</ExternalLink>
            </div>
          </div>
          <Stamp reference={app.decision?.etaNumber || app.id} label="Granted in this demo" />
        </section>
      )}

      {app.status === 'REFUSED' && (
        <Banner tone="danger" title="Reason recorded in this fictional scenario" className="mt-8">
          {app.decision?.reason || 'No reason was recorded. A real decision must be read in the official service that issued it.'}
        </Banner>
      )}

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] mt-10">
        <Section title="Application timeline" className="mt-0"><Timeline events={app.timeline} /></Section>
        <aside className="lg:border-l lg:border-rule lg:pl-8">
          <h2 className="font-display text-heading mb-4">Record details</h2>
          <dl className="grid gap-4 text-body">
            <div><dt className="text-meta text-ink-muted">Applicant</dt><dd>{applicant || 'Not answered yet'}</dd></div>
            <div><dt className="text-meta text-ink-muted">Route</dt><dd>{path?.name || app.pathId}</dd></div>
            <div><dt className="text-meta text-ink-muted">Access code</dt><dd className="numeric font-semibold">{app.accessCode}</dd></div>
            {app.submittedAt && <div><dt className="text-meta text-ink-muted">Demo submitted</dt><dd><time dateTime={app.submittedAt}>{new Date(app.submittedAt).toLocaleDateString()}</time></dd></div>}
            {app.payment?.reference && <div><dt className="text-meta text-ink-muted">Simulated transaction</dt><dd className="numeric break-all">{app.payment.reference}</dd></div>}
          </dl>
          <div className="grid gap-2 mt-6 pt-5 border-t border-rule">
            <Button variant="secondary" to={`/application/${app.id}`}>Application overview</Button>
            <Button variant="quiet" to={`/application/${app.id}/print`}>Print demo record</Button>
          </div>
        </aside>
      </div>
    </Page>
  );
}

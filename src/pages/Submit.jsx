import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { feeApplies, outstandingIssues } from '../lib/application.js';
import { useStore } from '../state/store.jsx';
import Page from '../ui/Page.jsx';
import Button from '../ui/Button.jsx';
import { Checkbox } from '../ui/Field.jsx';
import { Banner } from '../ui/feedback.jsx';
import { ConfirmAction } from '../ui/structure.jsx';

export default function Submit() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { app: active, resolve, loadScenario, dispatch, announce } = useStore();
  const resolved = resolve(appId);
  const app = active?.id === appId ? active : resolved;
  const [declared, setDeclared] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (resolved?.kind === 'seed' && active?.id !== appId) loadScenario(appId);
  }, [active?.id, appId, loadScenario, resolved?.kind]);

  if (!app) return <Navigate to="/start" replace />;
  const issues = outstandingIssues(app);
  if (issues.length > 0 || app.status === 'DRAFT') return <Navigate to={`/application/${app.id}/review`} replace />;
  if (app.status === 'PAYMENT_PENDING') return <Navigate to={`/application/${app.id}/payment`} replace />;
  if (app.status !== 'READY_FOR_REVIEW') return <Navigate to={`/application/${app.id}/status`} replace />;

  const submit = () => {
    const error = dispatch({ type: 'CONFIRM_SUBMIT', confirmed: true, actor: 'user' });
    setOpen(false);
    if (error) {
      announce(error);
      return;
    }
    navigate(feeApplies(app) ? `/application/${app.id}/payment` : `/application/${app.id}/status`);
  };

  return (
    <Page routeId="application-submit" title="Confirm simulated submission" lede="This is the single commitment point. Read what will happen before you continue." width="form">
      <Banner tone="warning" title="No application will be submitted" className="mb-8">
        Visa-Seva has no connection to an immigration authority. This action only changes the fictional status of a record in this browser.
      </Banner>

      <section className="border border-rule-strong bg-paper-1 p-6 sm:p-8 mb-8">
        <h2 className="font-display text-title text-ink mb-5">What this action does</h2>
        <dl className="grid gap-4 text-body">
          <div className="grid sm:grid-cols-[10rem_1fr] gap-1"><dt className="font-semibold">Will happen</dt><dd className="text-ink-muted">Your demo answers become read-only and a fictional timeline event is created.</dd></div>
          <div className="grid sm:grid-cols-[10rem_1fr] gap-1"><dt className="font-semibold">Will not happen</dt><dd className="text-ink-muted">No network request, government filing, email, identity check or real decision.</dd></div>
          <div className="grid sm:grid-cols-[10rem_1fr] gap-1"><dt className="font-semibold">Stored here</dt><dd className="text-ink-muted">The record remains in this browser until you clear demo data.</dd></div>
          <div className="grid sm:grid-cols-[10rem_1fr] gap-1"><dt className="font-semibold">Reference</dt><dd className="numeric text-ink">{app.id}</dd></div>
          <div className="grid sm:grid-cols-[10rem_1fr] gap-1"><dt className="font-semibold">Next</dt><dd className="text-ink-muted">{feeApplies(app) ? 'A fictional fee screen with no payment fields.' : 'The demo status timeline.'}</dd></div>
        </dl>
      </section>

      <div className="border-l-rail border-indigo bg-indigo-50 p-5 mb-8">
        <p id="declaration-help" className="text-meta text-ink-muted mb-3">
          Confirm this only after reviewing every fictional answer above.
        </p>
        <Checkbox
          id="confirm-demo-declaration"
          checked={declared}
          onChange={setDeclared}
          describedBy="declaration-help"
          label="I understand this is a fictional demonstration, I have used made-up information, and nothing will be sent to the Government of India."
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
        <Button variant="secondary" to={`/application/${app.id}/review`}>Back to review</Button>
        <Button disabled={!declared} onClick={() => setOpen(true)}>Submit demo application</Button>
      </div>

      <ConfirmAction
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={submit}
        title="Create this fictional submission?"
        confirmLabel="Yes, submit the demo"
      >
        This locks the answers. An e-Visa demo moves to the fictional fee step first; only a successful payment simulation records submission. It cannot create a visa application.
      </ConfirmAction>
    </Page>
  );
}

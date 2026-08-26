import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { feeApplies, outstandingIssues } from '../lib/application.js';
import { useStore } from '../state/store.jsx';
import Page from '../ui/Page.jsx';
import Button from '../ui/Button.jsx';
import { ConfirmAction } from '../ui/structure.jsx';

export default function Submit() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { app: active, resolve, loadScenario, dispatch, announce } = useStore();
  const resolved = resolve(appId);
  const app = active?.id === appId ? active : resolved;
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
    <Page routeId="application-submit" title="Create the demo submission" lede="One final check. Nothing will be sent to the Government of India." width="form">
      <dl className="border-t border-rule-strong mb-8 text-body">
        <div className="grid sm:grid-cols-[9rem_1fr] gap-1 py-4 border-b border-rule"><dt className="font-semibold">Record</dt><dd className="numeric">{app.id}</dd></div>
        <div className="grid sm:grid-cols-[9rem_1fr] gap-1 py-4 border-b border-rule"><dt className="font-semibold">What changes</dt><dd className="text-ink-muted">Answers become read-only and a fictional timeline event is added.</dd></div>
        <div className="grid sm:grid-cols-[9rem_1fr] gap-1 py-4 border-b border-rule"><dt className="font-semibold">What does not</dt><dd className="text-ink-muted">No network request, filing, email, identity check or real decision.</dd></div>
      </dl>

      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
        <Button variant="secondary" to={`/application/${app.id}/review`}>Back to review</Button>
        <Button onClick={() => setOpen(true)}>Create demo submission</Button>
      </div>

      <ConfirmAction
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={submit}
        title="Create this demo submission?"
        confirmLabel="Create submission"
      >
        This locks the fictional answers. {feeApplies(app) ? 'The practice payment handoff comes next.' : 'The demo status timeline comes next.'}
      </ConfirmAction>
    </Page>
  );
}

import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../state/store.jsx';
import { SOURCES } from '../lib/rules/sources.js';
import Page from '../ui/Page.jsx';
import Button, { ExternalLink } from '../ui/Button.jsx';
import { ConfirmAction } from '../ui/structure.jsx';

export default function Payment() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { app: active, resolve, loadScenario, dispatch, announce } = useStore();
  const resolved = resolve(appId);
  const app = active?.id === appId ? active : resolved;
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (resolved?.kind === 'seed' && active?.id !== appId) loadScenario(appId);
  }, [active?.id, appId, loadScenario, resolved?.kind]);

  if (!app) return <Navigate to="/start" replace />;
  if (app.status !== 'PAYMENT_PENDING') return <Navigate to={`/application/${app.id}/status`} replace />;

  const continueDemo = () => {
    const error = dispatch({ type: 'SIMULATE_PAYMENT_SUCCESS', confirmed: true, actor: 'user' });
    setConfirming(false);
    if (error) return announce(error);
    navigate(`/application/${app.id}/status`);
  };

  return (
    <Page
      routeId="application-payment"
      title="Practise the payment handoff"
      lede="No card, bank account, wallet or money is involved."
      width="form"
    >
      <dl className="border-t border-rule-strong mb-8">
        <div className="grid sm:grid-cols-[9rem_1fr] gap-1 py-4 border-b border-rule">
          <dt className="font-semibold">Amount</dt>
          <dd className="text-ink-muted">Not shown. Real fees depend on the route and nationality.</dd>
        </div>
        <div className="grid sm:grid-cols-[9rem_1fr] gap-1 py-4 border-b border-rule">
          <dt className="font-semibold">Payment data</dt>
          <dd className="text-ink-muted">No fields are provided and no payment service is contacted.</dd>
        </div>
        <div className="grid sm:grid-cols-[9rem_1fr] gap-1 py-4 border-b border-rule">
          <dt className="font-semibold">Official fees</dt>
          <dd><ExternalLink href={SOURCES.evisa.url}>Check the Government of India guidance</ExternalLink></dd>
        </div>
      </dl>

      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
        <Button variant="quiet" to={`/application/${app.id}/review`}>Return to review</Button>
        <Button onClick={() => setConfirming(true)}>Complete practice handoff</Button>
      </div>

      <ConfirmAction
        open={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={continueDemo}
        title="Complete this practice step?"
        confirmLabel="Complete handoff"
      >
        The fictional record will move to Submitted. No charge or network request will happen.
      </ConfirmAction>
    </Page>
  );
}

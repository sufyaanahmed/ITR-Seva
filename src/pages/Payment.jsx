import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { FEE_LINES, FEE_TOTAL } from '../lib/application.js';
import { useStore } from '../state/store.jsx';
import Page from '../ui/Page.jsx';
import Button from '../ui/Button.jsx';
import { Banner } from '../ui/feedback.jsx';
import { ConfirmAction } from '../ui/structure.jsx';

const money = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export default function Payment() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { app: active, resolve, loadScenario, dispatch, announce } = useStore();
  const resolved = resolve(appId);
  const app = active?.id === appId ? active : resolved;
  const [action, setAction] = useState(null);

  useEffect(() => {
    if (resolved?.kind === 'seed' && active?.id !== appId) loadScenario(appId);
  }, [active?.id, appId, loadScenario, resolved?.kind]);

  if (!app) return <Navigate to="/start" replace />;
  if (app.status !== 'PAYMENT_PENDING') return <Navigate to={`/application/${app.id}/status`} replace />;

  const run = (type) => {
    const event = type === 'success' ? 'SIMULATE_PAYMENT_SUCCESS' : type === 'failure' ? 'SIMULATE_PAYMENT_FAILURE' : 'CANCEL_PAYMENT';
    const error = dispatch({ type: event, confirmed: true, actor: 'user' });
    setAction(null);
    if (error) {
      announce(error);
      return;
    }
    if (type === 'success') navigate(`/application/${app.id}/status`);
    if (type === 'cancel') navigate(`/application/${app.id}/review`);
  };

  return (
    <Page routeId="application-payment" title="Simulated payment" lede="Practise the handoff without entering a card number, bank account or payment identity." width="form">
      <Banner tone="warning" title="Fictional fee — no money moves" className="mb-8">
        These amounts exist only to demonstrate a fee summary. They are not a quote and may not match any official fee.
      </Banner>

      {app.payment?.status === 'failed' && (
        <Banner tone="danger" title="The simulated payment failed" className="mb-8">
          No charge was attempted. Choose success to continue the demo, or return to review.
        </Banner>
      )}

      <section className="border border-rule-strong bg-paper-1 p-6 sm:p-8 mb-8">
        <p className="text-overline uppercase text-ink-muted mb-2">Demonstration only</p>
        <h2 className="font-display text-title text-ink mb-5">Fictional fee summary</h2>
        <dl>
          {FEE_LINES.map((line) => (
            <div key={line.label} className="flex justify-between gap-4 py-3 border-b border-rule text-body"><dt>{line.label}</dt><dd className="numeric">{money(line.amount)}</dd></div>
          ))}
          <div className="flex justify-between gap-4 pt-5 text-subhead font-semibold"><dt>Total simulated amount</dt><dd className="numeric">{money(FEE_TOTAL)}</dd></div>
        </dl>
        <p className="text-meta text-ink-faint mt-5">Reference {app.id}. No payment fields are intentionally provided.</p>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button onClick={() => setAction('success')}>Simulate successful payment</Button>
        <Button variant="secondary" onClick={() => setAction('failure')}>Simulate failed payment</Button>
        <Button variant="quiet" className="sm:col-span-2" onClick={() => setAction('cancel')}>Cancel and return to review</Button>
      </div>

      <ConfirmAction open={action === 'success'} onClose={() => setAction(null)} onConfirm={() => run('success')} title="Mark this fictional payment successful?" confirmLabel="Simulate success">
        No payment service will be contacted. The record will receive a reference beginning DEMO-TXN and move to Submitted.
      </ConfirmAction>
      <ConfirmAction open={action === 'failure'} onClose={() => setAction(null)} onConfirm={() => run('failure')} title="Show the failure path?" confirmLabel="Simulate failure">
        No charge will be attempted. The record will stay on this page so the recovery state can be tested.
      </ConfirmAction>
      <ConfirmAction open={action === 'cancel'} onClose={() => setAction(null)} onConfirm={() => run('cancel')} title="Cancel this simulated payment?" confirmLabel="Cancel payment">
        The application will return to Ready for review. Your answers and document metadata remain saved.
      </ConfirmAction>
    </Page>
  );
}

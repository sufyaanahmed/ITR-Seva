import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { requiredDocuments } from '../lib/fields.js';
import { useStore } from '../state/store.jsx';
import Page from '../ui/Page.jsx';
import Button from '../ui/Button.jsx';
import { Banner, EmptyState } from '../ui/feedback.jsx';
import { ConfirmAction } from '../ui/structure.jsx';

export default function DocumentsRequested() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const store = useStore();
  const { app: active, resolve, loadScenario, selectDocument, removeDocument, dispatch, announce } = store;
  const resolved = resolve(appId);
  const app = active?.id === appId ? active : resolved;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (resolved?.kind === 'seed' && active?.id !== appId) loadScenario(appId);
  }, [active?.id, appId, loadScenario, resolved?.kind]);

  if (!app) return <Navigate to="/track" replace />;
  if (app.status !== 'DOCUMENTS_REQUIRED') {
    return (
      <Page routeId="application-documents-requested" title="No documents are requested" lede="This application does not currently need a replacement.">
        <EmptyState title="There is nothing to send" action={<Button to={`/application/${app.id}/status`}>Return to status</Button>}>
          Document requests appear here only when the fictional lifecycle is in Documents required.
        </EmptyState>
      </Page>
    );
  }

  const catalogue = requiredDocuments(app.data);
  const requested = app.requestedDocuments.map((slot) => catalogue.find((req) => req.type === slot) || {
    type: slot,
    title: slot.replaceAll('_', ' '),
    desc: 'A replacement was requested for this demo document.',
    accept: '.pdf,.jpg,.jpeg',
  });
  const ready = requested.every((req) => app.documents.some((doc) => doc.slot === req.type && doc.status === 'replaced'));

  const resubmit = () => {
    const error = dispatch({ type: 'RESUBMIT_DOCUMENTS', confirmed: true, actor: 'user' });
    setOpen(false);
    if (error) {
      announce(error);
      return;
    }
    navigate(`/application/${app.id}/status`);
  };

  return (
    <Page routeId="application-documents-requested" title="Replace requested documents" lede="Respond to the fictional request without uploading or retaining a real file." width="form">
      <Banner tone="warning" title="Use an invented file" className="mb-8">
        Only its filename, size and selection time are stored. The contents never leave the file picker and are not retained.
      </Banner>

      <div className="grid gap-5">
        {requested.map((req) => {
          const event = [...app.timeline].reverse().find((item) => item.event === 'REQUEST_DOCUMENTS');
          const replacement = app.documents.find((doc) => doc.slot === req.type && doc.status === 'replaced');
          return (
            <section key={req.type} className="border border-rule-strong bg-paper-1 p-6">
              <p className="text-overline uppercase text-warning mb-2">Replacement requested</p>
              <h2 className="text-subhead font-semibold text-ink mb-2">{req.title}</h2>
              <p className="text-body text-ink-muted mb-2">{event?.detail || req.desc}</p>
              {replacement ? (
                <div className="mt-5 bg-success-bg border-l-rail border-success p-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-body break-all">✓ {replacement.filename}</p>
                    <p className="text-meta text-ink-muted">Replacement metadata ready to send</p>
                  </div>
                  <Button variant="quiet" onClick={() => removeDocument(req.type)}>Choose a different file</Button>
                </div>
              ) : (
                <label className="file-picker-label mt-4 inline-flex min-h-touch items-center px-5 py-3 border border-indigo text-indigo font-semibold cursor-pointer rounded-control hover:bg-indigo-50">
                  Select replacement demo file
                  <input
                    type="file"
                    accept={req.accept}
                    className="sr-only"
                    data-agent-field={`replacement_${req.type}`}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) selectDocument(req.type, file, { replacement: true });
                    }}
                  />
                </label>
              )}
            </section>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-rule flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
        <Button variant="secondary" to={`/application/${app.id}/status`}>Back to status</Button>
        <Button disabled={!ready} onClick={() => setOpen(true)}>Send replacement metadata</Button>
      </div>

      <ConfirmAction open={open} onClose={() => setOpen(false)} onConfirm={resubmit} title="Send this fictional response?" confirmLabel="Send demo response">
        No file or message will be transmitted. The local timeline will record that the replacement was sent and return the application to Processing.
      </ConfirmAction>
    </Page>
  );
}

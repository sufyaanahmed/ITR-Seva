import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../state/store.jsx';
import { PATH_LIST } from '../lib/content.js';
import { STATE_META } from '../lib/application.js';
import Page, { Section } from '../ui/Page.jsx';
import Button from '../ui/Button.jsx';
import { Banner, EmptyState } from '../ui/feedback.jsx';
import { FieldShell, ErrorSummary } from '../ui/Field.jsx';
import { ConfirmAction } from '../ui/structure.jsx';

/**
 * The only place a demo application is created, and where a saved one is
 * picked up. Resume is shown above Start when a draft exists, so nobody
 * accidentally begins a second one on top of the first.
 */
export default function Start() {
  const {
    savedApp, startApplication, resolve, loadScenario, activateApplication,
  } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ id: '', code: '' });
  const [errors, setErrors] = useState({});
  const [pendingPath, setPendingPath] = useState(null);
  const summaryRef = useRef(null);

  const begin = (path, replaceExisting = false) => {
    const created = startApplication({
      pathId: path.id,
      category: 'tourist',
      replaceExisting,
    });
    if (created) navigate(`/application/${created.id}/stage/setup`);
  };

  const lookup = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.id.trim()) next.id = 'Enter the application reference, for example DEMO2026E00005.';
    if (!form.code.trim()) next.code = 'Enter the access code that was shown when the application was saved.';
    if (Object.keys(next).length === 0) {
      const found = resolve(form.id.trim().toUpperCase());
      if (!found || found.accessCode !== form.code.trim().toUpperCase()) {
        // Deliberately does not reveal which of the two was wrong.
        next.id = 'We could not find that combination. Check both the reference and the code.';
      } else {
        if (found.kind === 'seed') loadScenario(found.id);
        else activateApplication(found.id);
        navigate(`/application/${found.id}`);
        return;
      }
    }
    setErrors(next);
    requestAnimationFrame(() => summaryRef.current?.focus());
  };

  return (
    <Page
      routeId="start"
      title="Start or resume an application"
      lede="Everything here is a simulation. Nothing is submitted, and nothing leaves this browser."
    >
      {savedApp ? (
        <div className="border border-emph border-indigo bg-indigo-50 p-6">
          <p className="text-overline uppercase text-ink-muted mb-2">Saved on this device</p>
          <h2 className="font-display text-title text-ink mb-2">Continue where you left off</h2>
          <p className="text-body text-ink-muted mb-1">
            <span className="numeric font-semibold text-ink">{savedApp.id}</span> ·{' '}
            {STATE_META[savedApp.status]?.label}
          </p>
          <p className="text-meta text-ink-muted mb-5">
            Access code <span className="numeric font-semibold">{savedApp.accessCode}</span> — keep
            it if you want to find this record again in this browser.
          </p>
          <Button to={`/application/${savedApp.id}`} size="lg">Continue application</Button>
        </div>
      ) : (
        <EmptyState
          title="You have not started one yet"
          action={<Button to="/find/q/1" size="lg">Find my visa first</Button>}
        >
          The finder takes about ninety seconds and tells you which route the
          published rules point to — which is worth knowing before you fill
          anything in.
        </EmptyState>
      )}

      <Section title={savedApp ? 'Or start a different one' : 'Or start one directly'}>
        <p className="text-body text-ink-muted max-w-prose mb-6">
          If you already know which route you want, begin here. Starting a new
          demo application replaces any draft currently saved on this device.
        </p>
        <ul className="list-none m-0 p-0 border-t border-rule">
          {PATH_LIST.map((p) => (
            <li key={p.id} className="border-b border-rule py-5 flex flex-wrap items-baseline gap-4">
              <div className="flex-1 min-w-[16rem]">
                <h3 className="text-subhead font-semibold text-ink mb-1">{p.name}</h3>
                <p className="text-body text-ink-muted max-w-prose">{p.strapline}</p>
              </div>
              {p.id !== 'evisa' ? (
                <Link to={`/requirements/${p.id}`} className="inline-flex items-center min-h-touch text-body text-indigo underline underline-offset-4">
                  {p.id === 'voa' ? 'Read how it works' : 'Read the requirements'}
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => savedApp ? setPendingPath(p) : begin(p)}
                >
                  Start an e-Visa demo
                </Button>
              )}
            </li>
          ))}
        </ul>
        <Banner tone="info" className="mt-6">
          Visa on Arrival is requested at the airport. Regular and Afghan-national
          routes use an Indian Mission or a separate official portal. This
          prototype explains those journeys instead of inventing an online form.
        </Banner>
      </Section>

      <Section title="Resume with a reference and access code">
        <p className="text-body text-ink-muted max-w-prose mb-6">
          Use this to open one of the demo scenarios, or a record you noted
          down. In this prototype, records only exist in the browser that made
          them — the seeded demo records are the exception, and they work
          anywhere.
        </p>
        <form onSubmit={lookup} noValidate className="max-w-form">
          <ErrorSummary ref={summaryRef} errors={errors} />
          <FieldShell
            id="field-lookup-id"
            label="Application reference"
            hint="Fourteen characters, like DEMO2026E00005."
            required
            error={errors.id}
          >
            <input
              id="field-lookup-id"
              name="application_id"
              data-agent-field="application_id"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              autoComplete="off"
              spellCheck="false"
              className="w-full min-h-touch bg-paper-1 border border-rule-control rounded-control px-4 py-3 text-body numeric"
            />
          </FieldShell>
          <FieldShell
            id="field-lookup-code"
            label="Access code"
            hint="Nine characters with a dash, like 7BQ3-M2KD. Shown when the application was saved."
            required
            error={errors.code}
          >
            <input
              id="field-lookup-code"
              name="access_code"
              data-agent-field="access_code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              autoComplete="off"
              spellCheck="false"
              className="w-full min-h-touch bg-paper-1 border border-rule-control rounded-control px-4 py-3 text-body numeric"
            />
          </FieldShell>
          <Button type="submit">Find this application</Button>
        </form>
        <p className="text-meta text-ink-faint mt-6 max-w-prose">
          A passport number alone is never enough to open a record here. A real
          service would need stronger verification than either, and this
          prototype should not model a weaker habit.{' '}
          <Link to="/demo" className="text-indigo underline underline-offset-4">
            Demo scenarios list every seeded reference and code.
          </Link>
        </p>
      </Section>

      <ConfirmAction
        open={Boolean(pendingPath)}
        onClose={() => setPendingPath(null)}
        onConfirm={() => {
          const path = pendingPath;
          setPendingPath(null);
          if (path) begin(path, true);
        }}
        title="Replace the saved demo application?"
        confirmLabel="Replace and start again"
        tone="danger"
      >
        Starting again removes <span className="numeric font-semibold text-ink">{savedApp?.id}</span>{' '}
        and its locally saved answers from this browser. This cannot be undone.
      </ConfirmAction>
    </Page>
  );
}

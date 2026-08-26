import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Page, { Section } from '../ui/Page.jsx';
import Button from '../ui/Button.jsx';
import { Banner } from '../ui/feedback.jsx';
import { ErrorSummary, FieldShell } from '../ui/Field.jsx';
import { useStore } from '../state/store.jsx';

export default function Track() {
  const { resolve, loadScenario, activateApplication, online } = useStore();
  const navigate = useNavigate();
  const summaryRef = useRef(null);
  const [form, setForm] = useState({ id: '', code: '' });
  const [errors, setErrors] = useState({});

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    const id = form.id.trim().toUpperCase();
    const code = form.code.trim().toUpperCase();

    if (!id) next.application_id = 'Enter a demo application reference.';
    if (!code) next.access_code = 'Enter the access code shown with the application.';

    if (Object.keys(next).length === 0) {
      const found = resolve(id);
      if (!found || found.accessCode !== code) {
        next.application_id = 'We could not find that reference and access-code combination. Check both and try again.';
      } else {
        if (found.kind === 'seed') loadScenario(found.id);
        else activateApplication(found.id);
        navigate(`/application/${found.id}/status`);
        return;
      }
    }

    setErrors(next);
    requestAnimationFrame(() => summaryRef.current?.focus());
  };

  return (
    <Page
      routeId="track"
      eyebrow="Private by design"
      title="Track an application"
      lede="Open a fictional record with its demo reference and access code. A passport number is never accepted here."
      width="form"
    >
      {!online && (
        <Banner tone="warning" title="You are viewing the offline demo" className="mb-8">
          Saved and seeded records still work on this device. Nothing is being checked against a real visa service.
        </Banner>
      )}

      <form onSubmit={submit} noValidate>
        <ErrorSummary ref={summaryRef} errors={errors} title="Check the tracking details" />
        <FieldShell
          id="field-application-id"
          label="Application reference"
          hint="For example, DEMO2026E00005."
          error={errors.application_id}
          required
        >
          <input
            id="field-application-id"
            name="application_id"
            data-agent-field="application_id"
            value={form.id}
            onChange={(event) => setForm((current) => ({ ...current, id: event.target.value }))}
            autoComplete="off"
            spellCheck="false"
            className="w-full min-h-touch bg-paper-1 border border-rule-control rounded-control px-4 py-3 text-body numeric uppercase"
          />
        </FieldShell>

        <FieldShell
          id="field-access-code"
          label="Access code"
          hint="Nine characters including the dash, for example 7BQ3-M2KD."
          error={errors.access_code}
          required
        >
          <input
            id="field-access-code"
            name="access_code"
            data-agent-field="access_code"
            value={form.code}
            onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))}
            autoComplete="off"
            spellCheck="false"
            className="w-full min-h-touch bg-paper-1 border border-rule-control rounded-control px-4 py-3 text-body numeric uppercase"
          />
        </FieldShell>

        <Button type="submit" size="lg">Check demo status</Button>
      </form>

      <Section title="Need a reference to try?">
        <p className="text-body text-ink-muted max-w-prose mb-5">
          Reviewers can choose a complete, processing, document-requested or refused fictional application. Each scenario publishes both values needed for lookup.
        </p>
        <Button to="/demo" variant="secondary">Open demo scenarios</Button>
      </Section>

      <p className="text-meta text-ink-faint mt-10 border-t border-rule pt-5">
        This lookup searches only records created in this browser and the six built-in fictional scenarios. For a real application, use the official service linked in the site footer. Your data stays on this device. <Link to="/help/your-data" className="text-indigo underline underline-offset-4">See exactly what is stored.</Link>
      </p>
    </Page>
  );
}

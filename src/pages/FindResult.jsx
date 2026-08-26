import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { evaluate, explainAnswers, OUTCOME } from '../lib/rules/index.js';
import { PATHS } from '../lib/content.js';
import { VOA } from '../lib/rules/reference.js';
import { SOURCES } from '../lib/rules/sources.js';
import { getAnswers, clearAnswers } from '../lib/finder-answers.js';
import { useStore } from '../state/store.jsx';
import Button, { ExternalLink } from '../ui/Button.jsx';
import { SourceNote, Section, RuleList } from '../ui/Page.jsx';
import { ConfirmAction } from '../ui/structure.jsx';

/**
 * The result screen.
 *
 * Two rules govern everything here:
 *  - A "Start this application" button exists **only** for LIKELY_PATH. For
 *    every other outcome it is absent from the DOM, not disabled — so neither
 *    a person nor an agent can proceed on an undetermined result.
 *  - No green tick, no "eligible", no "approved". This screen reports what the
 *    published rules say; it does not deliver a verdict.
 */

const RAIL = {
  [OUTCOME.LIKELY_PATH]: 'border-info',
  [OUTCOME.NEEDS_OFFICIAL_REVIEW]: 'border-warning',
  [OUTCOME.NOT_AVAILABLE_ONLINE]: 'border-warning',
  [OUTCOME.INSUFFICIENT_INFORMATION]: 'border-warning',
};

const EYEBROW = {
  [OUTCOME.LIKELY_PATH]: 'Suggested route',
  [OUTCOME.NEEDS_OFFICIAL_REVIEW]: 'Needs official review',
  [OUTCOME.NOT_AVAILABLE_ONLINE]: 'No online route',
  [OUTCOME.INSUFFICIENT_INFORMATION]: 'Not enough information',
};

const CATEGORY_FOR_PURPOSE = {
  tourism: 'tourist',
  business: 'business',
  medical: 'medical',
  'medical-attendant': 'medical-attendant',
  study: 'student',
  transit: 'transit',
};

export default function FindResult() {
  const navigate = useNavigate();
  const { startApplication, savedApp } = useStore();
  const [confirmingReplace, setConfirmingReplace] = useState(false);
  const answers = getAnswers();
  const result = evaluate(answers);
  const why = explainAnswers(answers);
  const path = result.route ? PATHS[result.route] : null;

  const canStart = result.kind === OUTCOME.LIKELY_PATH && result.route === 'evisa';

  const begin = (replaceExisting = false) => {
    const app = startApplication({
      pathId: result.route,
      category: CATEGORY_FOR_PURPOSE[answers.purpose] || 'tourist',
      answers,
      data: {
        nationality: answers.nationality,
        country_of_application: answers.nationality,
        passport_type: answers.passportType === 'ordinary' ? 'ordinary' : undefined,
        pakistani_origin: answers.pakistaniConnection,
        visited_india_before: answers.priorIndianVisa,
      },
      replaceExisting,
    });
    if (!app) return;
    clearAnswers();
    navigate(`/application/${app.id}/stage/setup`);
  };

  return (
    <div className="shell py-9 max-w-doc">
      <p className="text-overline uppercase text-ink-muted mb-3">{EYEBROW[result.kind]}</p>
      <h1 className="font-display text-display-m text-ink mb-5 text-balance">{result.headline}</h1>

      <p className="text-lede text-ink-muted max-w-prose">{result.summary}</p>
      <p className={`mt-6 border-l-rail pl-4 text-body text-ink-muted ${RAIL[result.kind]}`}>
        This is a sourced suggestion, not a decision. Confirm it with the
        official service before you book or pay.
      </p>

      <div className="mt-8 pt-6 border-t border-rule-strong flex flex-col sm:flex-row flex-wrap gap-3">
        <Button
          size="lg"
          href={result.officialUrl || SOURCES.portal.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {result.officialLabel || 'Continue on the official portal'} ↗
          <span className="sr-only">(opens the official site in a new tab)</span>
        </Button>
        {canStart && (
          <Button variant="secondary" size="lg" onClick={() => savedApp ? setConfirmingReplace(true) : begin()}>
            Practise this application
          </Button>
        )}
      </div>

      {result.kind === OUTCOME.INSUFFICIENT_INFORMATION && result.missing?.length > 0 && (
        <Section title="What is still missing">
          <RuleList items={result.missing.map((m) => `We did not get an answer for: ${m}.`)} />
          <div className="mt-6">
            <Button to="/find/q/1">Go back and answer the rest</Button>
          </div>
        </Section>
      )}

      {why.length > 0 && (
        <Section title="Why this result">
          <p className="text-body text-ink-muted mb-4 max-w-prose">
            These are the answers the rule used. Nothing else was considered.
          </p>
          <dl className="grid gap-0 border-t border-rule">
            {why.map((w) => (
              <div key={w.question} className="grid sm:grid-cols-[20rem_1fr] gap-1 sm:gap-4 py-3 border-b border-rule">
                <dt className="text-meta text-ink-muted">{w.question}</dt>
                <dd className="text-body text-ink">{w.answer}</dd>
              </div>
            ))}
          </dl>
          {result.rule && (
            <p className="text-body text-ink-muted mt-5 max-w-prose">
              <strong className="text-ink font-semibold">The rule that applied:</strong>{' '}
              {result.rule.rationale}
              {result.rule.coverage === 'partial' && (
                <span className="block mt-2 text-warning">
                  Our coverage of this rule is partial, which is why we are
                  pointing you at a person rather than at a form.
                </span>
              )}
            </p>
          )}
        </Section>
      )}

      {result.conditions?.length > 0 && (
        <Section title="Conditions that matter here">
          <RuleList items={result.conditions} />
        </Section>
      )}

      {path && (
        <Section title="What you will need">
          <RuleList items={path.documents} />
          <p className="text-body text-ink-muted mt-4 max-w-prose">
            Gathering these first makes the real application quick.{' '}
            <Link to={`/requirements/${path.id}`} className="text-indigo underline underline-offset-4">
              See the full requirements for the {path.name}
            </Link>.
          </p>
        </Section>
      )}

      {result.alsoVoa && (
        <Section title="You may also have a second option">
          <p className="text-body text-ink-muted max-w-prose mb-4">
            Your answers also match the conditions published for Visa on
            Arrival. It is a facility, not an entitlement — an Immigration
            Officer decides on the day, at one of {VOA.airports.length} airports:{' '}
            {VOA.airports.join(', ')}. Most travellers still apply in advance,
            because a refusal at the airport is a bad place to discover a problem.
          </p>
          <Link to="/requirements/voa" className="inline-flex items-center min-h-touch text-body text-indigo underline underline-offset-4">
            Read about Visa on Arrival
          </Link>
        </Section>
      )}

      <div className="mt-10 pt-6 border-t border-rule-strong">
        <Link to="/find/q/1" className="inline-flex items-center min-h-touch text-body text-indigo underline underline-offset-4">
          Change my answers
        </Link>
      </div>

      <SourceNote
        source={result.rule ? { url: result.rule.sourceUrl, title: result.rule.sourceTitle } : SOURCES.evisa}
        reviewedAt={result.reviewedAt}
      />
      <p className="text-meta text-ink-faint mt-2">
        Rule set version <span className="numeric">{result.rulesetVersion}</span>
        {result.rule && <> · rule <span className="numeric">{result.rule.id}</span></>}
      </p>

      <p className="text-meta text-ink-faint mt-8 max-w-prose">
        Not sure any of this fits?{' '}
        <ExternalLink href={SOURCES.categories.url}>
          The twelve regular visa categories
        </ExternalLink>{' '}
        cover every reason to visit India, and a Mission can tell you which is yours.
      </p>

      <ConfirmAction
        open={confirmingReplace}
        onClose={() => setConfirmingReplace(false)}
        onConfirm={() => {
          setConfirmingReplace(false);
          begin(true);
        }}
        title="Replace the saved demo application?"
        confirmLabel="Replace and start this route"
        tone="danger"
      >
        Starting this route removes <span className="numeric font-semibold text-ink">{savedApp?.id}</span>{' '}
        and its locally saved answers from this browser. This cannot be undone.
      </ConfirmAction>
    </div>
  );
}

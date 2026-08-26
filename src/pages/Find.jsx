import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { QUESTIONS } from '../lib/rules/index.js';
import { ALL_NATIONALITIES } from '../lib/rules/reference.js';
import { REVIEWED_AT_LABEL } from '../lib/rules/sources.js';
import { getAnswers, setAnswer } from '../lib/finder-answers.js';
import { RadioGroup, FieldShell } from '../ui/Field.jsx';
import { Disclosure } from '../ui/structure.jsx';
import Button from '../ui/Button.jsx';

/**
 * One question per screen.
 *
 * The question number is in the URL, so Back, refresh and a deep link all
 * behave. Options are real radios inside a fieldset — the platform then
 * supplies arrow keys, grouping, the checked state and "2 of 5", none of
 * which the previous button-based version had.
 */
export default function Find() {
  const { step } = useParams();
  const navigate = useNavigate();
  const index = Math.min(Math.max(Number(step) || 1, 1), QUESTIONS.length) - 1;
  const question = QUESTIONS[index];
  const [answers, setAnswers] = useState(getAnswers);
  const [errorStep, setErrorStep] = useState(null);
  const headingRef = useRef(null);
  const formRef = useRef(null);

  // A deep link to a later question with nothing answered would be a dead end.
  useEffect(() => {
    const firstUnanswered = QUESTIONS.findIndex((q) => !getAnswers()[q.id]);
    if (firstUnanswered !== -1 && index > firstUnanswered) {
      navigate(`/find/q/${firstUnanswered + 1}`, { replace: true });
    }
  }, [index, navigate]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [index]);

  const value = answers[question.id] || '';

  const choose = (id, val) => {
    setErrorStep(null);
    setAnswers(setAnswer(id, val));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!value) {
      setErrorStep(index);
      requestAnimationFrame(() => formRef.current?.querySelector('select, input')?.focus());
      return;
    }
    if (index === QUESTIONS.length - 1) navigate('/find/result');
    else navigate(`/find/q/${index + 2}`);
  };

  return (
    <div className="shell py-9 max-w-doc">
      <div className="mb-8">
        <div
          role="progressbar"
          aria-valuenow={index + 1}
          aria-valuemin={1}
          aria-valuemax={QUESTIONS.length}
          aria-label={`Question ${index + 1} of ${QUESTIONS.length}`}
          className="h-[3px] w-full bg-rule mb-3"
        >
          <div
            className="h-full bg-indigo transition-[width] duration-base ease-out"
            style={{ width: `${((index + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
        <p className="text-meta text-ink-muted numeric">
          Question {index + 1} of {QUESTIONS.length}
        </p>
      </div>

      {/* The visible page heading, and the focus target on each step change. */}
      <h1 ref={headingRef} tabIndex={-1} className="font-display text-display-m text-ink mb-3 text-balance">
        {question.legend}
      </h1>
      {question.hint && <p className="text-lede text-ink-muted max-w-prose mb-8">{question.hint}</p>}

      <form ref={formRef} onSubmit={submit} noValidate>
        {errorStep === index && (
          <p role="alert" className="flex gap-2 text-body text-danger font-medium mb-6 border-l-rail border-danger pl-3">
            <span aria-hidden="true">⚠</span>
            <span>Choose an answer before continuing. {question.legend}</span>
          </p>
        )}

        {question.type === 'nationality' ? (
          <FieldShell
            id="field-nationality"
            label="Country that issued your passport"
            hint="Start typing to jump down the list."
            required
          >
            <select
              id="field-nationality"
              name="nationality"
              data-agent-field="nationality"
              value={value}
              onChange={(e) => choose(question.id, e.target.value)}
              autoComplete="country-name"
              className="w-full min-h-touch bg-paper-1 border border-rule-control rounded-control px-4 py-3 pr-12 text-body text-ink"
            >
              <option value="">Choose a country or territory</option>
              {ALL_NATIONALITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </FieldShell>
        ) : (
          <RadioGroup
            field={{ ...question, name: question.id, required: true, hint: undefined }}
            value={value}
            onChange={choose}
            options={question.options}
            size="default"
          />
        )}

        <Disclosure summary="Why are we asking this?" className="mb-8 border-b border-rule">
          <p>{question.why}</p>
        </Disclosure>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-4 pt-4">
          <Button type="submit" size="lg">
            {index === QUESTIONS.length - 1 ? 'See what the rules suggest' : 'Next question'}
          </Button>
          {index > 0 ? (
            <Link to={`/find/q/${index}`} className="inline-flex items-center min-h-touch text-body text-indigo underline underline-offset-4">
              Back to question {index}
            </Link>
          ) : (
            <Link to="/" className="inline-flex items-center min-h-touch text-body text-indigo underline underline-offset-4">
              Back to the start
            </Link>
          )}
        </div>
      </form>

      <p className="text-meta text-ink-faint mt-10 border-t border-rule pt-5 max-w-prose">
        These questions come from rules read on {REVIEWED_AT_LABEL}. Nothing you
        answer here is sent anywhere, and none of it is stored beyond this
        browser tab.
      </p>
    </div>
  );
}

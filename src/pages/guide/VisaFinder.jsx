import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { PASSPORT_NATIONALITIES, VISA_RULESET } from '../../data/visaEligibilityRules.js';
import { evaluateVisaRoute, getFinderQuestions } from '../../domain/visaEligibility.js';

const displayValue = (question, value) => {
  if (!value) return '';
  const option = question.options?.find((candidate) => candidate.value === value);
  return option?.label || value;
};

const dependentAnswers = {
  passport: ['pakistanOrigin', 'purpose', 'durationDays', 'studyInIndiaInstitution', 'uaePriorVisa', 'voaArrivalPort', 'voaIndiaResidenceOrOccupation', 'voaAdmissibility', 'travelReadiness'],
  purpose: ['durationDays', 'studyInIndiaInstitution', 'uaePriorVisa', 'voaArrivalPort', 'voaIndiaResidenceOrOccupation', 'voaAdmissibility', 'travelReadiness'],
  durationDays: ['voaArrivalPort', 'voaIndiaResidenceOrOccupation', 'voaAdmissibility'],
};

export default function VisaFinder() {
  const navigate = useNavigate();
  const { updateState } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showHelp, setShowHelp] = useState(false);
  const [result, setResult] = useState(null);

  const questions = useMemo(() => getFinderQuestions(answers), [answers]);
  const safeStep = Math.min(currentStep, questions.length - 1);
  const currentQ = questions[safeStep];
  const currentValue = answers[currentQ.id];
  const isCurrentAnswerValid = currentQ.type !== 'number'
    ? Boolean(currentValue)
    : Number.isFinite(Number(currentValue))
      && Number(currentValue) >= currentQ.min
      && Number(currentValue) <= currentQ.max;

  const handleSelect = (value) => {
    setAnswers((previous) => {
      const next = { ...previous, [currentQ.id]: value };
      (dependentAnswers[currentQ.id] || []).forEach((answerId) => {
        delete next[answerId];
      });
      return next;
    });
  };

  const handleNext = () => {
    if (safeStep < questions.length - 1) {
      setCurrentStep(safeStep + 1);
      setShowHelp(false);
      return;
    }
    setResult(evaluateVisaRoute(answers));
  };

  const handleBack = () => {
    if (safeStep > 0) {
      setCurrentStep(safeStep - 1);
      setShowHelp(false);
    } else {
      navigate(-1);
    }
  };

  const reviseAnswers = () => {
    setResult(null);
    setCurrentStep(0);
    setShowHelp(false);
  };

  const startApplication = () => {
    updateState({
      type: result.applicationType,
      step: 0,
      data: {
        application_type: result.applicationType,
        visa_category: result.visaCategory,
        nationality: answers.passport,
        passport_type: answers.passportType,
        pakistan_origin: answers.pakistanOrigin || 'not_applicable',
        purpose_intent: answers.purpose,
        intended_stay_days: Number(answers.durationDays),
        study_in_india_institution: answers.studyInIndiaInstitution || 'not_applicable',
        uae_prior_indian_visa: answers.uaePriorVisa || 'not_applicable',
        voa_arrival_port_gate: answers.voaArrivalPort || 'not_applicable',
        eligibility_ruleset_id: VISA_RULESET.id,
        eligibility_reviewed_date: VISA_RULESET.reviewedDate,
      },
      docs: [],
      submitted: false,
    });
    navigate(result.path);
  };

  if (result) {
    return (
      <div className="min-h-screen bg-surface py-12 px-4 flex justify-center relative pattern-kalamkari">
        <div className="absolute inset-0 bg-surface/90" />
        <div className="max-w-2xl w-full bg-white border border-border-dark p-8 md:p-12 relative z-10">
          <div className="w-16 h-16 bg-surface border border-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-secondary-accent uppercase tracking-[0.2em] mb-2 font-sans">Preliminary route</p>
            <h1 className="text-4xl font-serif font-bold text-primary mb-6">{result.type}</h1>
            <p className="text-text-secondary mb-8 text-lg font-serif italic">{result.description}</p>
          </div>

          <section className="border border-border-dark p-6 mb-6 bg-surface" aria-labelledby="why-this-route">
            <h2 id="why-this-route" className="font-sans font-bold text-primary mb-3 uppercase tracking-widest text-sm">Why this route?</h2>
            <ul className="space-y-2 text-text-secondary text-sm font-sans list-disc pl-5">
              {result.rationale.map((reason) => <li key={reason}>{reason}</li>)}
            </ul>
          </section>

          <section className="border-l-4 border-secondary-accent bg-amber-50 p-5 mb-6" aria-labelledby="before-continuing">
            <h2 id="before-continuing" className="font-sans font-bold text-primary mb-2 uppercase tracking-widest text-sm">Before continuing</h2>
            <ul className="space-y-2 text-text-secondary text-sm font-sans list-disc pl-5">
              {result.cautions.map((caution) => <li key={caution}>{caution}</li>)}
            </ul>
          </section>

          <div className="text-xs text-text-secondary font-sans border-t border-border-dark pt-4 mb-8">
            <p className="font-bold text-primary">Reviewed reference snapshot</p>
            <p>Effective {VISA_RULESET.effectiveDate}; reviewed {VISA_RULESET.reviewedDate}. This demo does not automatically synchronize with Government systems.</p>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {VISA_RULESET.sources.map((source) => (
                <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="text-secondary-accent underline hover:text-primary">
                  {source.label}
                </a>
              ))}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={reviseAnswers} className="btn-secondary">Change answers</button>
            <button onClick={startApplication} className="btn-mughal group">
              <span className="inner-border" />
              <span className="relative z-10 flex items-center gap-2">
                {result.actionLabel}
                <span className="text-secondary-accent transform group-hover:translate-x-1 transition-transform" aria-hidden="true">&rarr;</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-12 px-4 flex flex-col items-center relative pattern-kalamkari">
      <div className="absolute inset-0 bg-surface/90" />
      <div className="max-w-3xl w-full bg-white border border-border-dark flex flex-col min-h-[560px] relative z-10">
        <div className="bg-primary px-8 py-8 text-white relative border-b border-border-dark pattern-jali">
          <div className="absolute inset-0 bg-primary/95" />
          <div className="relative z-10">
            <p className="text-[0.65rem] font-bold text-secondary-accent uppercase tracking-[0.2em] mb-2 font-sans">Visa Finder</p>
            <div className="flex justify-between items-end gap-4 mb-6">
              <h1 className="text-3xl font-serif font-bold text-white">Find the right visa route</h1>
              <span className="text-xs font-sans uppercase tracking-widest text-primary-light whitespace-nowrap">Step {safeStep + 1} of {questions.length}</span>
            </div>
            <div className="w-full bg-primary-dark h-1 mt-4 overflow-hidden" aria-hidden="true">
              <div className="bg-secondary-accent h-full transition-all duration-500 ease-out" style={{ width: `${((safeStep + 1) / questions.length) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 flex-1 flex flex-col">
          <h2 className="text-3xl font-serif font-bold text-primary mb-8">{currentQ.title}</h2>

          {currentQ.type === 'country_select' && (
            <div className="w-full mb-8 relative">
              <label htmlFor="passport-nationality" className="sr-only">Passport nationality</label>
              <select
                id="passport-nationality"
                className="w-full appearance-none bg-surface border border-border-dark px-4 py-4 font-sans text-primary focus:outline-none focus:border-secondary-accent transition-colors duration-200"
                value={answers[currentQ.id] || ''}
                onChange={(event) => handleSelect(event.target.value)}
              >
                <option value="">Select passport nationality...</option>
                {PASSPORT_NATIONALITIES.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-primary" aria-hidden="true">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          )}

          {currentQ.type === 'number' && (
            <div className="mb-8">
              <label htmlFor={currentQ.id} className="sr-only">{currentQ.title}</label>
              <div className="flex items-stretch max-w-sm">
                <input
                  id={currentQ.id}
                  type="number"
                  min={currentQ.min}
                  max={currentQ.max}
                  inputMode="numeric"
                  className="min-w-0 flex-1 bg-surface border border-border-dark px-4 py-4 font-sans text-primary focus:outline-none focus:border-secondary-accent"
                  value={answers[currentQ.id] || ''}
                  onChange={(event) => handleSelect(event.target.value)}
                />
                <span className="border border-l-0 border-border-dark px-4 py-4 bg-white text-text-secondary font-sans">{currentQ.suffix}</span>
              </div>
            </div>
          )}

          {currentQ.type === 'select' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {currentQ.options.map((option) => {
                const isSelected = answers[currentQ.id] === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`p-5 text-left border transition-all duration-300 font-sans ${isSelected ? 'border-secondary-accent bg-surface shadow-sm' : 'border-border-dark hover:border-primary-light hover:bg-surface'}`}
                    aria-pressed={isSelected}
                  >
                    <span className="flex items-center">
                      <span className={`w-4 h-4 flex-shrink-0 mr-4 border flex items-center justify-center transition-colors ${isSelected ? 'border-secondary-accent' : 'border-border'}`} aria-hidden="true">
                        {isSelected && <span className="w-2 h-2 bg-secondary-accent" />}
                      </span>
                      <span className={`text-sm tracking-wide ${isSelected ? 'text-primary font-bold' : 'text-text-secondary font-medium'}`}>{option.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {answers[currentQ.id] && <p className="sr-only" aria-live="polite">Selected: {displayValue(currentQ, answers[currentQ.id])}</p>}

          {currentQ.help && (
            <div className="mt-auto pt-6 border-t border-border-dark">
              <button
                type="button"
                onClick={() => setShowHelp((visible) => !visible)}
                className="text-xs font-sans font-bold text-secondary-accent uppercase tracking-widest flex items-center gap-2 hover:text-primary transition-colors focus:outline-none"
                aria-expanded={showHelp}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Why are we asking this?
              </button>
              {showHelp && <div className="mt-4 p-4 bg-surface border-l-2 border-secondary-accent text-text-secondary text-sm font-sans italic animate-fade-in">{currentQ.help}</div>}
            </div>
          )}
        </div>

        <div className="bg-surface px-8 py-6 border-t border-border-dark flex justify-between items-center gap-4">
          <button onClick={handleBack} className="text-sm font-sans font-bold text-text-secondary uppercase tracking-widest hover:text-primary transition-colors">&larr; Back</button>
          <button
            onClick={handleNext}
            disabled={!isCurrentAnswerValid}
            className={`px-8 py-3 font-sans font-bold uppercase tracking-widest text-sm transition-all duration-300 border ${!isCurrentAnswerValid ? 'bg-surface border-border text-text-muted cursor-not-allowed' : 'bg-primary border-primary text-white hover:bg-white hover:text-primary'}`}
          >
            {safeStep === questions.length - 1 ? 'See preliminary route' : 'Next step'}
          </button>
        </div>

        <div className="px-8 py-4 bg-white border-t border-border text-xs text-text-secondary font-sans">
          Rules snapshot effective {VISA_RULESET.effectiveDate}, reviewed {VISA_RULESET.reviewedDate}. Not live-synchronized; always verify on the official Government portal.
        </div>
      </div>
    </div>
  );
}

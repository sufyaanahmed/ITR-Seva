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

  const [countrySearch, setCountrySearch] = useState('');

  const filteredNationalities = useMemo(() => {
    if (!countrySearch.trim()) return PASSPORT_NATIONALITIES;
    const q = countrySearch.toLowerCase();
    return PASSPORT_NATIONALITIES.filter((name) => name.toLowerCase().includes(q));
  }, [countrySearch]);

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
      setCountrySearch('');
      return;
    }
    setResult(evaluateVisaRoute(answers));
  };

  const handleBack = () => {
    if (safeStep > 0) {
      setCurrentStep(safeStep - 1);
      setShowHelp(false);
      setCountrySearch('');
    } else {
      navigate(-1);
    }
  };

  const reviseAnswers = () => {
    setResult(null);
    setCurrentStep(0);
    setShowHelp(false);
    setCountrySearch('');
  };

  const jumpToQuestion = (stepIndex) => {
    if (stepIndex < safeStep) {
      setCurrentStep(stepIndex);
      setShowHelp(false);
      setCountrySearch('');
    }
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
    // Determine fee tier & turnaround specs based on route
    const isVoa = result.applicationType === 'voa';
    const isAfghan = result.applicationType === 'afghan';
    const isPaper = result.applicationType === 'regular';
    const feeDisplay = isVoa ? '₹2,000 INR at Port' : isAfghan ? 'Exempt / Fee per Mission' : isPaper ? 'Mission Tariff' : '$25 / $40 / $80 USD';
    const turnaroundDisplay = isVoa ? 'Instant on Arrival' : isAfghan ? 'Prior Clearance' : isPaper ? 'Embassy Schedule' : '72 Hours Standard';
    const validityDisplay = isVoa ? 'Up to 60 Days (Double Entry)' : isAfghan ? 'Single / Double Entry' : isPaper ? 'Subject to Visa Grant' : '30 Days / 1 Yr / 5 Yrs';

    return (
      <div className="min-h-screen bg-surface py-12 px-4 flex justify-center relative pattern-kalamkari">
        <div className="absolute inset-0 bg-surface/90" />
        <div className="max-w-3xl w-full bg-white border border-border-dark p-8 md:p-12 relative z-10 shadow-2xl rounded-sm">
          <div className="w-16 h-16 bg-surface border border-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-secondary-accent uppercase tracking-[0.2em] mb-2 font-sans">Identified Official Route</p>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-4">{result.type}</h1>
            <p className="text-text-secondary mb-6 text-base font-serif italic max-w-xl mx-auto">{result.description}</p>
          </div>

          {/* Quantitative Specification Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 bg-[#FAF7F0] border border-[#D4AF37]/30 p-4 rounded text-center">
            <div className="border-b sm:border-b-0 sm:border-r border-gray-200 pb-2 sm:pb-0 sm:pr-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Permitted Validity</span>
              <strong className="text-xs font-bold text-[#1E2A4F] block mt-0.5">{validityDisplay}</strong>
            </div>
            <div className="border-b sm:border-b-0 sm:border-r border-gray-200 pb-2 sm:pb-0 sm:pr-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Estimated Tariff</span>
              <strong className="text-xs font-bold text-[#176B45] block mt-0.5">{feeDisplay}</strong>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Processing Standard</span>
              <strong className="text-xs font-bold text-[#1E2A4F] block mt-0.5">{turnaroundDisplay}</strong>
            </div>
          </div>

          <section className="border border-border-dark p-5 sm:p-6 mb-5 bg-surface" aria-labelledby="why-this-route">
            <h2 id="why-this-route" className="font-sans font-bold text-primary mb-3 uppercase tracking-widest text-xs">Why this route?</h2>
            <ul className="space-y-2 text-text-secondary text-sm font-sans list-disc pl-5">
              {result.rationale.map((reason) => <li key={reason}>{reason}</li>)}
            </ul>
          </section>

          {result.cautions && result.cautions.length > 0 && (
            <section className="border-l-4 border-secondary-accent bg-amber-50 p-5 mb-8" aria-labelledby="before-continuing">
              <h2 id="before-continuing" className="font-sans font-bold text-primary mb-2 uppercase tracking-widest text-xs">Before continuing</h2>
              <ul className="space-y-2 text-text-secondary text-sm font-sans list-disc pl-5">
                {result.cautions.map((caution) => <li key={caution}>{caution}</li>)}
              </ul>
            </section>
          )}

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
      <div className="max-w-3xl w-full bg-white border border-border-dark flex flex-col min-h-[560px] relative z-10 shadow-2xl rounded-sm">
        <div className="bg-primary px-6 sm:px-8 py-6 sm:py-8 text-white relative border-b border-border-dark pattern-jali">
          <div className="absolute inset-0 bg-primary/95" />
          <div className="relative z-10">
            <p className="text-[0.65rem] font-bold text-secondary-accent uppercase tracking-[0.2em] mb-2 font-sans">Official Route Eligibility</p>
            <div className="flex justify-between items-end gap-4 mb-4">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">Find the right visa route</h1>
              <span className="text-xs font-sans uppercase tracking-widest text-primary-light whitespace-nowrap">Step {safeStep + 1} of {questions.length}</span>
            </div>
            
            {/* Live Context Summary Pills */}
            {safeStep > 0 && (
              <div className="flex flex-wrap gap-2 mb-3 pt-2 border-t border-white/10">
                {questions.slice(0, safeStep).map((q, idx) => {
                  const val = answers[q.id];
                  if (!val) return null;
                  const label = displayValue(q, val);
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => jumpToQuestion(idx)}
                      className="bg-white/15 hover:bg-white/25 text-white/90 text-[10px] font-sans font-medium px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer"
                      title={`Edit ${q.title}`}
                    >
                      <span className="text-[#D4AF37] font-bold">✓</span>
                      <span className="truncate max-w-[140px]">{label}</span>
                      <span className="text-white/50 text-[9px] uppercase">Edit</span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="w-full bg-primary-dark h-1 mt-2 overflow-hidden" aria-hidden="true">
              <div className="bg-secondary-accent h-full transition-all duration-500 ease-out" style={{ width: `${((safeStep + 1) / questions.length) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10 flex-1 flex flex-col">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-6">{currentQ.title}</h2>

          {/* Searchable Country Selector */}
          {currentQ.type === 'country_select' && (
            <div className="w-full mb-8">
              <div className="mb-3">
                <label htmlFor="passport-search-input" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Search or select passport nationality:
                </label>
                <div className="relative">
                  <input
                    id="passport-search-input"
                    type="text"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    placeholder="Type to filter country (e.g., United States, Japan, France)..."
                    className="w-full bg-[#FAF7F0] border border-border-dark px-4 py-3 text-sm font-sans text-primary focus:outline-none focus:border-secondary-accent rounded"
                  />
                  {countrySearch && (
                    <button
                      type="button"
                      onClick={() => setCountrySearch('')}
                      className="absolute right-3 top-3 text-xs text-gray-500 hover:text-gray-800"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-56 overflow-y-auto border border-border-dark bg-white rounded p-1 space-y-0.5">
                {filteredNationalities.length > 0 ? (
                  filteredNationalities.map((country) => {
                    const isSelected = answers[currentQ.id] === country;
                    return (
                      <button
                        key={country}
                        type="button"
                        onClick={() => handleSelect(country)}
                        className={`w-full text-left px-3 py-2 text-xs font-medium rounded transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected ? 'bg-[#1E2A4F] text-white font-bold' : 'hover:bg-gray-100 text-gray-800'
                        }`}
                      >
                        <span>{country}</span>
                        {isSelected && <span className="text-[#D4AF37] font-bold text-xs">Selected ✓</span>}
                      </button>
                    );
                  })
                ) : (
                  <div className="p-3 text-xs text-gray-500 text-center">
                    No country matches &quot;{countrySearch}&quot;
                  </div>
                )}
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
                    className={`p-5 text-left border transition-all duration-300 font-sans cursor-pointer ${isSelected ? 'border-secondary-accent bg-surface shadow-sm' : 'border-border-dark hover:border-primary-light hover:bg-surface'}`}
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
                className="text-xs font-sans font-bold text-secondary-accent uppercase tracking-widest flex items-center gap-2 hover:text-primary transition-colors focus:outline-none cursor-pointer"
                aria-expanded={showHelp}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Why are we asking this?
              </button>
              {showHelp && <div className="mt-4 p-4 bg-surface border-l-2 border-secondary-accent text-text-secondary text-sm font-sans italic animate-fade-in">{currentQ.help}</div>}
            </div>
          )}
        </div>

        <div className="bg-surface px-6 sm:px-8 py-5 sm:py-6 border-t border-border-dark flex justify-between items-center gap-4">
          <button onClick={handleBack} className="text-sm font-sans font-bold text-text-secondary uppercase tracking-widest hover:text-primary transition-colors cursor-pointer">&larr; Back</button>
          <button
            onClick={handleNext}
            disabled={!isCurrentAnswerValid}
            className={`px-6 sm:px-8 py-3 font-sans font-bold uppercase tracking-widest text-xs sm:text-sm transition-all duration-300 border cursor-pointer ${!isCurrentAnswerValid ? 'bg-surface border-border text-text-muted cursor-not-allowed' : 'bg-primary border-primary text-white hover:bg-white hover:text-primary'}`}
          >
            {safeStep === questions.length - 1 ? 'See preliminary route' : 'Next step'}
          </button>
        </div>
      </div>
    </div>
  );
}

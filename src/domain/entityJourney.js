import { getEntityJourneyProfile } from '../data/journeyProfiles.js';

const ANSWER_VALUES = new Set(['yes', 'no', 'not_sure']);
const CHECK_VALUES = new Set(['checked', 'needs_attention', 'not_sure']);

export const ENTITY_RECOMMENDATION = Object.freeze({
  POSSIBLE_ITR6: 'possible_itr6',
  POSSIBLE_ITR5: 'possible_itr5',
  PROFESSIONAL_REVIEW: 'professional_review',
  INSUFFICIENT_INFORMATION: 'insufficient_information',
});

export const ENTITY_REPORT_STATUS = Object.freeze({
  READY_FOR_PROFESSIONAL_REVIEW: 'ready_for_professional_review',
  NEEDS_ATTENTION: 'needs_attention',
});

function isRecord(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function answerBlocker(question, value) {
  if (value === undefined) return `Answer: ${question.label}`;
  if (!ANSWER_VALUES.has(value)) return `Check the answer for: ${question.label}`;
  if (value === 'not_sure') return `Confirm: ${question.label}`;
  if (value !== question.safeAnswer) return `Qualified review needed: ${question.label}`;
  return null;
}

function checkBlocker(check, value) {
  if (value === undefined) return check.blockerLabel;
  if (!CHECK_VALUES.has(value)) return `Check the review status for: ${check.label}`;
  if (value === 'not_sure') return `Confirm before review: ${check.label}`;
  if (value === 'needs_attention') return check.blockerLabel;
  return null;
}

function recommendationFor(profile, questionResults, checkResults) {
  const missingOrInvalid = questionResults.some(({ value }) => value === undefined || !ANSWER_VALUES.has(value))
    || checkResults.some(({ value }) => value === undefined || !CHECK_VALUES.has(value));
  const uncertain = questionResults.some(({ value }) => value === 'not_sure')
    || checkResults.some(({ value }) => value === 'not_sure');
  const complex = questionResults.some(({ question, value }) => ANSWER_VALUES.has(value) && value !== 'not_sure' && value !== question.safeAnswer)
    || checkResults.some(({ value }) => value === 'needs_attention');

  if (missingOrInvalid) {
    return {
      kind: ENTITY_RECOMMENDATION.INSUFFICIENT_INFORMATION,
      title: 'Complete the entity review questions',
      possibleForm: null,
      reasons: ['KarSaathi will not guess from missing or invalid information.'],
      source: profile.officialSource,
    };
  }

  if (uncertain || complex) {
    return {
      kind: ENTITY_RECOMMENDATION.PROFESSIONAL_REVIEW,
      title: 'Qualified entity-tax review needed',
      possibleForm: null,
      reasons: [
        uncertain ? 'One or more answers still need confirmation.' : null,
        complex ? 'One or more facts are outside this simple fictional path.' : null,
      ].filter(Boolean),
      source: profile.officialSource,
    };
  }

  return {
    kind: profile.possibleForm.id === 'ITR-6'
      ? ENTITY_RECOMMENDATION.POSSIBLE_ITR6
      : ENTITY_RECOMMENDATION.POSSIBLE_ITR5,
    title: profile.possibleForm.conditionalLabel,
    possibleForm: profile.possibleForm.id,
    reasons: [
      `The answers fit the bounded fictional ${profile.shortLabel.toLowerCase()} example.`,
      'The three record checks are complete for professional review.',
      'The final return and every applicable report still need qualified confirmation.',
    ],
    source: profile.officialSource,
  };
}

export function evaluateEntityJourney(profileId, input = {}) {
  const profile = getEntityJourneyProfile(profileId);
  if (!profile) throw new RangeError(`Unsupported entity journey profile: ${String(profileId)}`);

  const safeInput = isRecord(input) ? input : {};
  const answers = isRecord(safeInput.answers) ? safeInput.answers : {};
  const checks = isRecord(safeInput.checks) ? safeInput.checks : {};
  const questionResults = profile.questions.map((question) => ({
    question,
    value: answers[question.id],
    blocker: answerBlocker(question, answers[question.id]),
  }));
  const checkResults = profile.reviewChecks.map((check) => ({
    check,
    value: checks[check.id],
    blocker: checkBlocker(check, checks[check.id]),
  }));
  const recommendation = recommendationFor(profile, questionResults, checkResults);
  const blockers = [...questionResults, ...checkResults]
    .map(({ blocker }) => blocker)
    .filter(Boolean);
  const completedChecks = checkResults
    .filter(({ value }) => value === 'checked')
    .map(({ check }) => check.completedLabel);
  const ready = blockers.length === 0 && [
    ENTITY_RECOMMENDATION.POSSIBLE_ITR6,
    ENTITY_RECOMMENDATION.POSSIBLE_ITR5,
  ].includes(recommendation.kind);

  return {
    profileId: profile.id,
    generatedFor: profile.identity.name,
    financialYear: profile.financialYear,
    assessmentYear: profile.assessmentYear,
    status: ready
      ? ENTITY_REPORT_STATUS.READY_FOR_PROFESSIONAL_REVIEW
      : ENTITY_REPORT_STATUS.NEEDS_ATTENTION,
    recommendation,
    completedChecks,
    blockers,
    nextSteps: [...profile.nextSteps],
    caveat: `${profile.caveat} Tax Health means readiness of this fictional review pack—not compliance, filing, audit completion, or government approval.`,
    taxCalculation: {
      status: 'not_offered',
      reason: profile.taxCaveat,
    },
  };
}

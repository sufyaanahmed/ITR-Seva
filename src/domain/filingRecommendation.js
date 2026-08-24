import { OFFICIAL_SOURCES } from '../data/officialSources.js';

export const RECOMMENDATION = Object.freeze({
  ITR1_CANDIDATE: 'itr1_candidate',
  PROFESSIONAL_REVIEW: 'professional_review',
  INSUFFICIENT_INFORMATION: 'insufficient_information',
});

export const FILING_QUESTIONS = Object.freeze([
  { id: 'multipleEmployers', label: 'Did you work for more than one employer?', type: 'boolean', why: 'We will remind you to reconcile every Form 16.' },
  { id: 'houseProperties', label: 'How many house properties generated income?', type: 'number', why: 'ITR-1 supports income from up to one house property.' },
  { id: 'capitalGains', label: 'Did you sell investments or property?', type: 'boolean', why: 'Capital gains can require a different form and special calculations.' },
  { id: 'businessOrProfessionalIncome', label: 'Did you earn business or freelance income?', type: 'boolean', why: 'Business or professional income is outside ITR-1.' },
  { id: 'foreignAssetsOrIncome', label: 'Did you have foreign assets or foreign income?', type: 'boolean', why: 'These require additional disclosures.' },
  { id: 'totalIncomeAbove50Lakh', label: 'Was total income above ₹50 lakh?', type: 'boolean', why: 'ITR-1 has a ₹50 lakh total-income limit.' },
  { id: 'otherComplexity', label: 'Any special-rate income or agricultural income above ₹5,000?', type: 'boolean', fields: ['specialRateIncome', 'agriculturalIncome'], why: 'These need a more detailed form check.' },
]);

const REQUIRED = [
  'residentialStatus', 'multipleEmployers', 'houseProperties', 'capitalGains',
  'businessOrProfessionalIncome', 'foreignAssetsOrIncome', 'agriculturalIncome',
  'totalIncomeAbove50Lakh', 'specialRateIncome',
];

const BOOLEAN_FIELDS = [
  'multipleEmployers', 'capitalGains', 'businessOrProfessionalIncome',
  'foreignAssetsOrIncome', 'totalIncomeAbove50Lakh', 'specialRateIncome',
];

function invalidAnswers(answers) {
  const invalid = [];
  if (!['resident', 'non_resident', 'not_ordinarily_resident'].includes(answers.residentialStatus)) invalid.push('residentialStatus');
  BOOLEAN_FIELDS.forEach((key) => {
    if (answers[key] !== true && answers[key] !== false) invalid.push(key);
  });
  if (!Number.isInteger(answers.houseProperties) || answers.houseProperties < 0) invalid.push('houseProperties');
  if (typeof answers.agriculturalIncome !== 'number' || !Number.isFinite(answers.agriculturalIncome) || answers.agriculturalIncome < 0) invalid.push('agriculturalIncome');
  return invalid;
}

export function recommendFilingRoute(answers = {}) {
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) answers = {};
  const missing = REQUIRED.filter((key) => answers[key] === undefined || answers[key] === null || answers[key] === '');
  const invalid = missing.length ? [] : invalidAnswers(answers);
  if (missing.length || invalid.length) {
    return {
      kind: RECOMMENDATION.INSUFFICIENT_INFORMATION,
      title: invalid.length ? 'Check these answers' : 'Answer a few more questions',
      reasons: [missing.length ? `Missing: ${missing.join(', ')}` : `Invalid: ${invalid.join(', ')}`],
      missing,
      invalid,
      source: OFFICIAL_SOURCES.itrForms,
    };
  }

  const reasons = [];
  if (answers.residentialStatus !== 'resident') reasons.push('ITR-1 is limited to eligible resident individuals.');
  if (answers.houseProperties > 1) reasons.push('Income from more than one house property is outside this simple ITR-1 check.');
  if (answers.capitalGains) reasons.push('Capital gains need a form and calculation review.');
  if (answers.businessOrProfessionalIncome) reasons.push('Business or professional income is outside ITR-1.');
  if (answers.foreignAssetsOrIncome) reasons.push('Foreign assets or income require additional disclosures.');
  if (answers.agriculturalIncome > 5000) reasons.push('Agricultural income above ₹5,000 is outside this ITR-1 check.');
  if (answers.totalIncomeAbove50Lakh) reasons.push('Total income above ₹50 lakh is outside ITR-1.');
  if (answers.specialRateIncome) reasons.push('Special-rate income needs a more detailed review.');

  if (reasons.length) {
    return {
      kind: RECOMMENDATION.PROFESSIONAL_REVIEW,
      title: 'A different ITR or professional review may be needed',
      reasons,
      missing: [],
      invalid: [],
      source: OFFICIAL_SOURCES.itrForms,
    };
  }

  return {
    kind: RECOMMENDATION.ITR1_CANDIDATE,
    title: 'Likely ITR-1 candidate',
    reasons: [
      'Resident individual with total income within ₹50 lakh.',
      'Income is limited to supported salary, up to one house property, and ordinary other-source income.',
      answers.multipleEmployers
        ? 'Multiple employers do not by themselves rule out ITR-1; all salary records still need reconciliation.'
        : 'One employer makes the salary evidence straightforward to reconcile.',
    ],
    missing: [],
    invalid: [],
    source: OFFICIAL_SOURCES.itrForms,
  };
}

export const getRecommendation = recommendFilingRoute;

import { DEMO_EVIDENCE, DEMO_PERSONA } from '../data/demoPersona.js';
import { calculateTaxComparison } from './taxCalculator.js';
import { getReconciledIncome, reconcileEvidence } from './reconciliation.js';

export function buildReconciliation(resolutions = {}) {
  return reconcileEvidence(DEMO_EVIDENCE, resolutions);
}

export const RECONCILIATION_ITEMS = Object.freeze(buildReconciliation());

export function estimateTax(persona = DEMO_PERSONA, answers = persona.filingAnswers, resolutions = {}) {
  const income = getReconciledIncome(DEMO_EVIDENCE, resolutions);
  return calculateTaxComparison({
    ...persona.taxInputs,
    ...income,
    capitalGains: answers.capitalGains,
    businessOrProfessionalIncome: answers.businessOrProfessionalIncome,
    foreignAssetsOrIncome: answers.foreignAssetsOrIncome,
    specialRateIncome: answers.specialRateIncome,
    totalIncomeAbove50Lakh: answers.totalIncomeAbove50Lakh,
  });
}

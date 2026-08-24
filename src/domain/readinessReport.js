import { getUnresolvedItems } from './reconciliation.js';
import { RECOMMENDATION } from './filingRecommendation.js';

export function buildReadinessReport({ persona, reconciliationItems, recommendation, taxComparison }) {
  const blockers = [];
  const unresolved = getUnresolvedItems(reconciliationItems);
  unresolved.forEach((item) => blockers.push(`Resolve ${item.label.toLowerCase()}.`));
  if (recommendation.kind === RECOMMENDATION.INSUFFICIENT_INFORMATION) blockers.push('Complete the filing questions.');
  if (recommendation.kind === RECOMMENDATION.PROFESSIONAL_REVIEW) blockers.push('Review the filing form with a qualified tax professional.');
  if (taxComparison.status === 'blocked') blockers.push('The illustrative tax comparison is unavailable for this income profile.');

  return {
    id: `readiness-${persona.id}`,
    generatedFor: persona.name,
    financialYear: persona.financialYear,
    assessmentYear: persona.assessmentYear,
    isSynthetic: true,
    status: blockers.length ? 'needs_attention' : 'ready_to_continue',
    title: blockers.length ? 'Resolve these items first' : 'Ready to continue',
    blockers,
    completedChecks: reconciliationItems
      .filter((item) => ['matched', 'resolved'].includes(item.status))
      .map((item) => item.label),
    recommendation,
    taxComparison,
    disclaimer: 'Independent educational prototype. This is not tax advice and nothing has been filed with the Income Tax Department.',
  };
}

export function serializeReadinessReport(report) {
  return JSON.stringify(report, null, 2);
}

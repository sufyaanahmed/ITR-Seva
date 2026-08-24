export const RECONCILIATION_STATUS = Object.freeze({
  MATCHED: 'matched',
  MISSING: 'missing',
  DUPLICATE: 'duplicate',
  NEEDS_REVIEW: 'needs_review',
  RESOLVED: 'resolved',
});

export const RESOLUTION_ACTION = Object.freeze({
  INCLUDE_FROM_BANK_RECORD: 'include_from_bank_record',
  MARK_AIS_ENTRY_DUPLICATE: 'mark_ais_entry_duplicate',
});

const GROUPS = Object.freeze([
  { id: 'salary', label: 'Salary', category: 'salary', expectedSources: ['form16', 'ais'] },
  { id: 'salary-tds', label: 'TDS on salary', category: 'salaryTds', expectedSources: ['form16', 'form26as'] },
  { id: 'savings-interest', label: 'Savings-account interest', category: 'savingsInterest', expectedSources: ['interestCertificate', 'ais'] },
  { id: 'fd-interest', label: 'Fixed-deposit interest', category: 'fixedDepositInterest', expectedSources: ['interestCertificate', 'ais'] },
  { id: 'fd-tds', label: 'TDS on fixed-deposit interest', category: 'fixedDepositTds', expectedSources: ['form26as'] },
]);

function classify(group, evidence) {
  const entries = evidence.filter((line) => line.category === group.category);
  const bySource = Object.fromEntries(group.expectedSources.map((source) => [source, entries.filter((line) => line.source === source)]));
  const missingSources = group.expectedSources.filter((source) => bySource[source].length === 0);
  const duplicateSources = group.expectedSources.filter((source) => bySource[source].length > 1);
  const uniqueAmounts = new Set(entries.map((line) => line.amount));

  if (duplicateSources.length) return { status: RECONCILIATION_STATUS.DUPLICATE, missingSources, duplicateSources };
  if (missingSources.length) return { status: RECONCILIATION_STATUS.MISSING, missingSources, duplicateSources };
  if (uniqueAmounts.size > 1) return { status: RECONCILIATION_STATUS.NEEDS_REVIEW, missingSources, duplicateSources };
  return { status: RECONCILIATION_STATUS.MATCHED, missingSources, duplicateSources };
}

export function reconcileEvidence(evidence, resolutions = {}) {
  return GROUPS.map((group) => {
    const entries = evidence.filter((line) => line.category === group.category);
    const classification = classify(group, evidence);
    const resolution = resolutions[group.id] ?? null;
    return {
      ...group,
      entries,
      ...classification,
      status: resolution ? RECONCILIATION_STATUS.RESOLVED : classification.status,
      originalStatus: classification.status,
      resolution,
    };
  });
}

export const buildReconciliationFromEvidence = reconcileEvidence;

export function resolveReconciliation(resolutions, itemId, action, note = '') {
  const valid = (itemId === 'fd-interest' && action === RESOLUTION_ACTION.INCLUDE_FROM_BANK_RECORD)
    || (itemId === 'savings-interest' && action === RESOLUTION_ACTION.MARK_AIS_ENTRY_DUPLICATE);
  if (!valid) throw new Error('This resolution is not valid for the selected item.');

  return {
    ...resolutions,
    [itemId]: {
      action,
      note: String(note).trim(),
      resolvedAt: 'demo-session',
    },
  };
}

export function getUnresolvedItems(items) {
  return items.filter((item) => ![RECONCILIATION_STATUS.MATCHED, RECONCILIATION_STATUS.RESOLVED].includes(item.status));
}

export function getReconciledIncome(evidence, resolutions = {}) {
  const amount = (id) => evidence.find((line) => line.id === id)?.amount ?? 0;
  return {
    salary: amount('salary-form16'),
    savingsInterest: amount('savings-bank'),
    fixedDepositInterest: resolutions['fd-interest']?.action === RESOLUTION_ACTION.INCLUDE_FROM_BANK_RECORD ? amount('fd-bank') : 0,
  };
}

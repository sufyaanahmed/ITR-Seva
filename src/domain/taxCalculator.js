import { OFFICIAL_SOURCES } from '../data/officialSources.js';

export const TAX_YEAR = 'AY 2026–27';

const NEW_SLABS = [[400000, 0], [800000, 0.05], [1200000, 0.1], [1600000, 0.15], [2000000, 0.2], [2400000, 0.25], [Infinity, 0.3]];
const OLD_SLABS = [[250000, 0], [500000, 0.05], [1000000, 0.2], [Infinity, 0.3]];

function money(value, label) {
  const number = Number(value ?? 0);
  if (!Number.isFinite(number) || number < 0) throw new Error(`${label} must be a non-negative number.`);
  return Math.round(number);
}

function slabTax(income, slabs) {
  let lower = 0;
  let tax = 0;
  const breakdown = [];
  for (const [upper, rate] of slabs) {
    const taxableAtRate = Math.max(0, Math.min(income, upper) - lower);
    const amount = Math.round(taxableAtRate * rate);
    if (taxableAtRate > 0) breakdown.push({ from: lower, to: upper, rate, taxable: taxableAtRate, tax: amount });
    tax += amount;
    lower = upper;
    if (income <= upper) break;
  }
  return { tax, breakdown };
}

function calculateRegime(grossIncome, deductions, regime) {
  const isNew = regime === 'new';
  const standardDeduction = isNew ? 75000 : 50000;
  const allowedChapterVIA = isNew ? 0 : Math.min(deductions.section80C, 150000) + Math.min(deductions.section80D, 25000);
  const taxableIncome = Math.max(0, grossIncome - standardDeduction - allowedChapterVIA);
  const slab = slabTax(taxableIncome, isNew ? NEW_SLABS : OLD_SLABS);
  const rebateThreshold = isNew ? 1200000 : 500000;
  const maxRebate = isNew ? 60000 : 12500;
  const rebate = taxableIncome <= rebateThreshold ? Math.min(slab.tax, maxRebate) : 0;
  let taxAfterRebate = slab.tax - rebate;
  let marginalRelief = 0;
  if (isNew && taxableIncome > rebateThreshold) {
    const excessIncome = taxableIncome - rebateThreshold;
    marginalRelief = Math.max(0, taxAfterRebate - excessIncome);
    taxAfterRebate -= marginalRelief;
  }
  const cess = Math.round(taxAfterRebate * 0.04);
  return {
    regime,
    grossIncome,
    standardDeduction,
    chapterVIADeductions: allowedChapterVIA,
    taxableIncome,
    slabTax: slab.tax,
    rebate,
    marginalRelief,
    cess,
    totalTax: Math.round(taxAfterRebate + cess),
    breakdown: slab.breakdown,
  };
}

export function calculateTaxComparison(input = {}) {
  const blockers = [];
  if (input.capitalGains) blockers.push('capital gains');
  if (input.businessOrProfessionalIncome) blockers.push('business or professional income');
  if (input.foreignAssetsOrIncome) blockers.push('foreign assets or income');
  if (input.specialRateIncome) blockers.push('special-rate income');
  if (input.totalIncomeAbove50Lakh) blockers.push('income above ₹50 lakh, where surcharge may apply');
  if (blockers.length) {
    return {
      status: 'blocked',
      reason: `Illustrative comparison is unavailable for ${blockers.join(', ')}.`,
      blockers,
      assessmentYear: TAX_YEAR,
      source: OFFICIAL_SOURCES.taxSlabs,
    };
  }

  const grossIncome = money(input.salary, 'Salary')
    + money(input.savingsInterest, 'Savings interest')
    + money(input.fixedDepositInterest, 'Fixed-deposit interest')
    + money(input.otherIncome, 'Other income');
  const deductions = {
    section80C: money(input.chapterVIA?.section80C, 'Section 80C deduction'),
    section80D: money(input.chapterVIA?.section80D, 'Section 80D deduction'),
  };
  const oldRegime = calculateRegime(grossIncome, deductions, 'old');
  const newRegime = calculateRegime(grossIncome, deductions, 'new');
  const lower = oldRegime.totalTax === newRegime.totalTax ? 'same' : oldRegime.totalTax < newRegime.totalTax ? 'old' : 'new';

  return {
    status: 'ready',
    assessmentYear: TAX_YEAR,
    label: 'Illustrative estimate',
    grossIncome,
    oldRegime,
    newRegime,
    lowerTaxRegime: lower,
    difference: Math.abs(oldRegime.totalTax - newRegime.totalTax),
    assumptions: [
      'Resident individual below 60 years of age.',
      'Only salary and ordinary bank-interest income are included.',
      'Health and education cess is 4%; surcharge is not modelled.',
      'This estimate is educational and is not a filing determination.',
    ],
    source: OFFICIAL_SOURCES.taxSlabs,
  };
}

export function formatCurrency(value, locale = 'en-IN') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

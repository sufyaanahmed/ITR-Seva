const COMPANY_SOURCE_URL = 'https://www.incometax.gov.in/iec/foportal/help/company/return-applicable';
const FIRM_LLP_SOURCE_URL = 'https://www.incometax.gov.in/iec/foportal/help/partnership-firm-llp';

export const ENTITY_PROFILE_IDS = Object.freeze({
  COMPANY: 'company',
  FIRM_LLP: 'firm_llp',
});

const company = {
  id: ENTITY_PROFILE_IDS.COMPANY,
  category: 'company',
  label: 'Registered company',
  shortLabel: 'Company',
  identity: {
    name: 'Aster Components Private Limited',
    legalForm: 'Domestic private limited company',
    city: 'Pune',
    isSynthetic: true,
  },
  financialYear: '2025–26',
  assessmentYear: '2026–27',
  description: 'A fictional domestic company preparing its records for a qualified tax review.',
  documents: [
    {
      id: 'company-financial-statements',
      title: 'Signed financial statements',
      issuer: 'Fictional company records',
      why: 'The final accounts are the starting point for the company return review.',
    },
    {
      id: 'company-tax-records',
      title: 'AIS and Form 26AS',
      issuer: 'Synthetic Income Tax records',
      why: 'These records help check reported transactions and available tax credits.',
    },
    {
      id: 'company-tax-payments',
      title: 'Tax-payment challans',
      issuer: 'Synthetic payment records',
      why: 'Advance-tax and self-assessment-tax payments should be traced before review.',
    },
    {
      id: 'company-prior-return',
      title: 'Previous return and adviser reports',
      issuer: 'Fictional prior-year pack',
      why: 'Prior positions and any applicable audit or special reports need continuity.',
    },
  ],
  reviewChecks: [
    {
      id: 'financial_statements',
      label: 'Are the signed financial statements ready?',
      why: 'A draft or incomplete set of accounts is not a safe base for return preparation.',
      completedLabel: 'Signed financial statements are in the review pack.',
      blockerLabel: 'Confirm and add the signed financial statements.',
    },
    {
      id: 'information_statements',
      label: 'Have AIS and Form 26AS been checked against the books?',
      why: 'Reported information and tax credits can differ from the books and need explanation.',
      completedLabel: 'AIS and Form 26AS were checked against the books.',
      blockerLabel: 'Reconcile AIS and Form 26AS with the books.',
    },
    {
      id: 'tax_payments',
      label: 'Have the tax-payment challans been checked?',
      why: 'The review pack should identify every payment without assuming the credit is available.',
      completedLabel: 'Tax-payment challans were checked.',
      blockerLabel: 'Check advance-tax and self-assessment-tax challans.',
    },
  ],
  questions: [
    {
      id: 'domestic_company',
      label: 'Is this a domestic company?',
      why: 'This fictional path is limited to a domestic company.',
      safeAnswer: 'yes',
    },
    {
      id: 'section_11_exemption',
      label: 'Is the company claiming exemption under section 11?',
      why: 'A company claiming section 11 exemption is outside the simple ITR-6 starting-point check.',
      safeAnswer: 'no',
    },
    {
      id: 'international_transactions',
      label: 'Were there international or specified domestic transactions?',
      why: 'These can require specialised reporting and professional review.',
      safeAnswer: 'no',
    },
    {
      id: 'foreign_tax_credit',
      label: 'Is foreign income or foreign tax credit involved?',
      why: 'Foreign income and credit claims require additional records and checks.',
      safeAnswer: 'no',
    },
    {
      id: 'special_report_review',
      label: 'Has an adviser flagged a tax-audit, MAT, or other special report for review?',
      why: 'KarSaathi does not determine whether an audit, MAT report, or special form applies.',
      safeAnswer: 'no',
    },
  ],
  officialSource: {
    title: 'Income Tax Department — Domestic Company for AY 2026–27',
    url: COMPANY_SOURCE_URL,
    checkedOn: '25 August 2026',
  },
  possibleForm: {
    id: 'ITR-6',
    conditionalLabel: 'Possible ITR-6 starting point',
  },
  nextSteps: [
    'Give the completed fictional review pack to a qualified tax professional.',
    'Confirm the applicable return, audit reports, elections, rates, surcharge, cess, and due dates.',
    'Continue only on the official e-Filing portal after the professional review.',
  ],
  caveat: 'KarSaathi does not determine filing obligations, select a final ITR, or confirm whether an audit or special report applies.',
  taxCaveat: 'No company tax estimate is shown. Rates, surcharge, cess, MAT, elections, audit and special reporting can change the result.',
};

const firmLlp = {
  id: ENTITY_PROFILE_IDS.FIRM_LLP,
  category: 'firm_llp',
  label: 'Firm or LLP',
  shortLabel: 'Firm / LLP',
  identity: {
    name: 'Mehta & Rao Advisory LLP',
    legalForm: 'Limited liability partnership',
    city: 'Ahmedabad',
    isSynthetic: true,
  },
  financialYear: '2025–26',
  assessmentYear: '2026–27',
  description: 'A fictional LLP preparing its records for a qualified tax review.',
  documents: [
    {
      id: 'llp-financial-statements',
      title: 'Financial statements and books',
      issuer: 'Fictional LLP records',
      why: 'The return review starts with a complete, final set of entity accounts.',
    },
    {
      id: 'llp-tax-records',
      title: 'AIS, Form 26AS and Form 16A',
      issuer: 'Synthetic tax records',
      why: 'These records help check reported income and tax deducted at source.',
    },
    {
      id: 'llp-tax-payments',
      title: 'Tax-payment challans',
      issuer: 'Synthetic payment records',
      why: 'Payments should be traced without assuming that every credit is available.',
    },
    {
      id: 'llp-prior-return',
      title: 'Previous return and audit report, if applicable',
      issuer: 'Fictional prior-year pack',
      why: 'Prior positions and adviser-confirmed audit requirements need continuity.',
    },
  ],
  reviewChecks: [
    {
      id: 'financial_statements',
      label: 'Are the final financial statements and books ready?',
      why: 'Incomplete accounts are not a safe base for the return review.',
      completedLabel: 'Final financial statements and books are in the review pack.',
      blockerLabel: 'Confirm and add the final financial statements and books.',
    },
    {
      id: 'information_statements',
      label: 'Have AIS, Form 26AS and Form 16A been checked against the books?',
      why: 'Income records and TDS credits can differ and need an explained reconciliation.',
      completedLabel: 'AIS, Form 26AS and Form 16A were checked against the books.',
      blockerLabel: 'Reconcile AIS, Form 26AS and Form 16A with the books.',
    },
    {
      id: 'tax_payments',
      label: 'Have the entity’s tax-payment challans been checked?',
      why: 'Every payment should be traced before a professional return review.',
      completedLabel: 'The entity’s tax-payment challans were checked.',
      blockerLabel: 'Check the entity’s tax-payment challans.',
    },
  ],
  questions: [
    {
      id: 'is_llp',
      label: 'Is this entity an LLP?',
      why: 'This fictional path uses an LLP; an ordinary firm can have a different return choice.',
      safeAnswer: 'yes',
    },
    {
      id: 'presumptive_return',
      label: 'Is a presumptive ITR-4 return being considered?',
      why: 'ITR-4 may be optional for some eligible resident firms, but not for an LLP.',
      safeAnswer: 'no',
    },
    {
      id: 'international_transactions',
      label: 'Were there international or specified domestic transactions?',
      why: 'These can require specialised reporting and professional review.',
      safeAnswer: 'no',
    },
    {
      id: 'foreign_tax_credit',
      label: 'Is foreign income or foreign tax credit involved?',
      why: 'Foreign income and credit claims require additional records and checks.',
      safeAnswer: 'no',
    },
    {
      id: 'special_report_review',
      label: 'Has an adviser flagged a tax audit or another special report for review?',
      why: 'KarSaathi does not decide audit applicability or choose between audit-report forms.',
      safeAnswer: 'no',
    },
  ],
  officialSource: {
    title: 'Income Tax Department — Partnership Firm / LLP for AY 2026–27',
    url: FIRM_LLP_SOURCE_URL,
    checkedOn: '25 August 2026',
  },
  possibleForm: {
    id: 'ITR-5',
    conditionalLabel: 'Possible ITR-5 starting point',
  },
  nextSteps: [
    'Give the completed fictional review pack to a qualified tax professional.',
    'Confirm the entity status, applicable return, audit reports, tax treatment, and due dates.',
    'Continue only on the official e-Filing portal after the professional review.',
  ],
  caveat: 'This LLP example does not cover every firm, trust, society, AOP, BOI, co-operative society, or other non-company entity.',
  taxCaveat: 'No firm or LLP tax estimate is shown. Rates, surcharge, cess, AMT, audit and special reporting can change the result.',
};

export const ENTITY_JOURNEY_PROFILES = Object.freeze({
  [ENTITY_PROFILE_IDS.COMPANY]: Object.freeze(company),
  [ENTITY_PROFILE_IDS.FIRM_LLP]: Object.freeze(firmLlp),
});

export function getEntityJourneyProfile(profileId) {
  return ENTITY_JOURNEY_PROFILES[profileId] || null;
}

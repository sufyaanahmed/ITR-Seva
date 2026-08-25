const freeze = (value) => Object.freeze(value);

export const DEMO_PERSONA = freeze({
  id: 'rahul-sharma-salaried-2025-26',
  name: 'Rahul Sharma',
  label: 'Salaried employee · one employer',
  isSynthetic: true,
  financialYear: '2025–26',
  assessmentYear: '2026–27',
  profile: freeze({
    age: 31,
    residentialStatus: 'resident',
    employment: 'salaried',
    city: 'Pune',
  }),
  filingAnswers: freeze({
    residentialStatus: 'resident',
    multipleEmployers: false,
    houseProperties: 0,
    capitalGains: false,
    businessOrProfessionalIncome: false,
    foreignAssetsOrIncome: false,
    agriculturalIncome: 0,
    totalIncomeAbove50Lakh: false,
    specialRateIncome: false,
  }),
  taxInputs: freeze({
    salary: 1450000,
    savingsInterest: 18000,
    fixedDepositInterest: 42000,
    otherIncome: 0,
    chapterVIA: freeze({ section80C: 150000, section80D: 25000 }),
  }),
});

export const DEMO_DOCUMENTS = freeze([
  freeze({
    id: 'rahul-form-16',
    kind: 'form16',
    title: 'Form 16',
    issuer: 'Northstar Labs Pvt. Ltd.',
    financialYear: '2025–26',
    isSynthetic: true,
    updatedOn: '2026-06-15',
  }),
  freeze({
    id: 'rahul-ais',
    kind: 'ais',
    title: 'Annual Information Statement',
    issuer: 'Synthetic Income Tax record',
    financialYear: '2025–26',
    isSynthetic: true,
    updatedOn: '2026-07-10',
  }),
  freeze({
    id: 'rahul-26as',
    kind: 'form26as',
    title: 'Form 26AS',
    issuer: 'Synthetic Income Tax record',
    financialYear: '2025–26',
    isSynthetic: true,
    updatedOn: '2026-07-10',
  }),
  freeze({
    id: 'rahul-interest-certificate',
    kind: 'interestCertificate',
    title: 'Bank interest certificate',
    issuer: 'Example Bank',
    financialYear: '2025–26',
    isSynthetic: true,
    updatedOn: '2026-05-31',
  }),
]);

export const DEMO_EVIDENCE = freeze([
  freeze({ id: 'salary-form16', category: 'salary', source: 'form16', amount: 1450000, label: 'Gross salary' }),
  freeze({ id: 'salary-ais', category: 'salary', source: 'ais', amount: 1450000, label: 'Salary reported in AIS' }),
  freeze({ id: 'salary-tds-form16', category: 'salaryTds', source: 'form16', amount: 129000, label: 'Salary TDS' }),
  freeze({ id: 'salary-tds-26as', category: 'salaryTds', source: 'form26as', amount: 129000, label: 'Salary TDS credit' }),
  freeze({ id: 'savings-bank', category: 'savingsInterest', source: 'interestCertificate', amount: 18000, label: 'Savings interest' }),
  freeze({ id: 'savings-ais-1', category: 'savingsInterest', source: 'ais', amount: 18000, label: 'Savings interest reported' }),
  freeze({ id: 'savings-ais-duplicate', category: 'savingsInterest', source: 'ais', amount: 18000, label: 'Duplicate savings entry' }),
  freeze({ id: 'fd-bank', category: 'fixedDepositInterest', source: 'interestCertificate', amount: 42000, label: 'Fixed-deposit interest' }),
  freeze({ id: 'fd-tds-26as', category: 'fixedDepositTds', source: 'form26as', amount: 4200, label: 'TDS on fixed-deposit interest' }),
]);

export function createDemoSession() {
  return {
    persona: DEMO_PERSONA,
    documents: DEMO_DOCUMENTS.map((document) => ({ ...document })),
    evidence: DEMO_EVIDENCE.map((line) => ({ ...line })),
    resolutions: {},
  };
}

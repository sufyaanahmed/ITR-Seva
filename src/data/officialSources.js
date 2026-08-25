export const OFFICIAL_SOURCES = Object.freeze({
  itrForms: Object.freeze({
    id: 'income-tax-itr-forms',
    title: 'Income Tax Returns',
    publisher: 'Income Tax Department',
    url: 'https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1',
    accessedOn: '2026-08-25',
  }),
  taxSlabs: Object.freeze({
    id: 'income-tax-slabs-fy-2025-26',
    title: 'Tax Slabs for FY 2025–26',
    publisher: 'Income Tax Department',
    url: 'https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1',
    accessedOn: '2026-08-25',
  }),
  ais: Object.freeze({
    id: 'income-tax-ais-faq',
    title: 'Annual Information Statement (AIS) FAQ',
    publisher: 'Income Tax Department',
    url: 'https://www.incometax.gov.in/iec/foportal/ais-faq',
    accessedOn: '2026-08-25',
  }),
});

export function getSource(sourceId) {
  return Object.values(OFFICIAL_SOURCES).find((source) => source.id === sourceId) ?? null;
}

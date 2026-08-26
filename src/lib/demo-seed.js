/**
 * Seeded demo scenarios, for reviewers and testers.
 *
 * These are frozen module exports, never persisted. That means they are
 * byte-identical on every machine, cannot be corrupted, cannot be edited, and
 * "Clear demo data" cannot remove them — it only deletes storage keys.
 *
 * They occupy the reserved ID block 00001–00006; `mintApplicationId` refuses
 * to issue anything inside it, so a person's own draft can never collide.
 *
 * Every name, passport number and address here is invented.
 */

import { deriveAccessCode } from './application.js';

const T = (d) => `2026-08-${d}T09:00:00.000Z`;

function seed({ id, pathId, category, status, applicant, data, documents = [], requestedDocuments = [], payment = null, decision = null, timeline }) {
  return Object.freeze({
    schemaVersion: 1,
    id,
    accessCode: deriveAccessCode(id),
    kind: 'seed',
    pathId,
    category,
    status,
    applicant,
    createdAt: timeline[0].at,
    updatedAt: timeline.at(-1).at,
    submittedAt: timeline.find((e) => e.to === 'SUBMITTED')?.at ?? null,
    finderAnswers: null,
    data: Object.freeze({ application_type: pathId, visa_category: category, ...data }),
    documents: Object.freeze(documents),
    requestedDocuments: Object.freeze(requestedDocuments),
    payment,
    decision,
    timeline: Object.freeze(timeline),
  });
}

const doc = (slot, filename, status = 'selected') => ({
  slot, filename, sizeBytes: 184320, status, selectedAt: T('12'),
});

const common = {
  given_name: 'Amara Chinelo',
  surname: 'Okonjo',
  date_of_birth: '1991-03-04',
  gender: 'female',
  country_of_birth: 'Ghana',
  place_of_birth: 'Accra',
  nationality: 'Ghana',
  marital_status: 'single',
  passport_number: 'DEMO123456',
  passport_type: 'ordinary',
  place_of_issue: 'Accra',
  date_of_issue: '2021-06-01',
  date_of_expiry: '2031-06-01',
  address_line_1: '14 Demo Street',
  city: 'Accra',
  country: 'Ghana',
  email: 'demo@example.com',
  mobile: '+233 000 000 000',
  country_of_application: 'Ghana',
  father_name: 'Emeka Okonjo',
  mother_name: 'Ngozi Okonjo',
  parents_nationality: 'Ghana',
  pakistani_origin: 'no',
  occupation: 'employed',
  employer_name: 'Demo Textiles Ltd',
  employer_address: '2 Sample Road, Accra',
  visited_india_before: 'no',
  visited_saarc: 'no',
  expected_arrival_date: '2026-10-01',
  expected_departure_date: '2026-10-21',
  port_of_arrival: 'Delhi',
  places_to_visit: 'Delhi, Agra, Jaipur',
  address_in_india: 'Demo Guest House, New Delhi',
  reference_name: 'Priya Demo',
  reference_address: '9 Example Marg, New Delhi',
  reference_phone: '+91 00000 00000',
};

export const SEED_APPLICATIONS = [
  seed({
    id: 'DEMO2026E00001',
    pathId: 'evisa', category: 'tourist', status: 'DRAFT',
    applicant: 'Amara Chinelo Okonjo',
    // Deliberately half-finished: two stages done, nothing else.
    data: {
      given_name: common.given_name, surname: common.surname,
      date_of_birth: common.date_of_birth, gender: common.gender,
      country_of_birth: common.country_of_birth, place_of_birth: common.place_of_birth,
      nationality: common.nationality, marital_status: common.marital_status,
      country_of_application: common.country_of_application,
    },
    timeline: [{ seq: 1, at: T('20'), from: 'NOT_STARTED', to: 'DRAFT', event: 'START_APPLICATION', actor: 'user', label: 'Application started' }],
  }),

  seed({
    id: 'DEMO2026E00002',
    pathId: 'evisa', category: 'business', status: 'DRAFT',
    applicant: 'Tomás Rivera Salas',
    data: { ...common, given_name: 'Tomás', surname: 'Rivera Salas', nationality: 'Chile', country_of_application: 'Chile', country_of_birth: 'Chile', place_of_birth: 'Valparaíso', visa_category: 'business' },
    documents: [doc('passport', 'demo-passport.pdf')],
    timeline: [
      { seq: 1, at: T('18'), from: 'NOT_STARTED', to: 'DRAFT', event: 'START_APPLICATION', actor: 'user', label: 'Application started' },
    ],
  }),

  seed({
    id: 'DEMO2026E00003',
    pathId: 'evisa', category: 'tourist', status: 'PROCESSING',
    applicant: 'Amara Chinelo Okonjo',
    data: common,
    documents: [doc('passport', 'demo-passport.pdf'), doc('photograph', 'demo-photo.jpg')],
    payment: { status: 'succeeded', lines: [], total: null, currency: null, simulated: true, reference: 'DEMO-TXN-00003', at: T('19') },
    timeline: [
      { seq: 1, at: T('17'), from: 'NOT_STARTED', to: 'DRAFT', event: 'START_APPLICATION', actor: 'user', label: 'Application started' },
      { seq: 2, at: T('19'), from: 'DRAFT', to: 'READY_FOR_REVIEW', event: 'REQUEST_REVIEW', actor: 'user', label: 'Ready for review' },
      { seq: 3, at: T('19'), from: 'READY_FOR_REVIEW', to: 'PAYMENT_PENDING', event: 'CONFIRM_SUBMIT', actor: 'user', label: 'Submission step confirmed' },
      { seq: 4, at: T('19'), from: 'PAYMENT_PENDING', to: 'SUBMITTED', event: 'SIMULATE_PAYMENT_SUCCESS', actor: 'user', label: 'Payment simulated' },
      { seq: 5, at: T('20'), from: 'SUBMITTED', to: 'PROCESSING', event: 'ADVANCE_TO_PROCESSING', actor: 'demo', label: 'Demo review started' },
    ],
  }),

  seed({
    id: 'DEMO2026E00004',
    pathId: 'evisa', category: 'medical', status: 'DOCUMENTS_REQUIRED',
    applicant: 'Lucia Marchetti',
    data: { ...common, given_name: 'Lucia', surname: 'Marchetti', nationality: 'Italy', country_of_application: 'Italy', country_of_birth: 'Italy', place_of_birth: 'Bologna', visa_category: 'medical' },
    documents: [doc('passport', 'demo-passport.pdf'), doc('photograph', 'demo-photo.jpg'), doc('medical_document', 'demo-hospital-letter.pdf')],
    requestedDocuments: ['photograph'],
    payment: { status: 'succeeded', lines: [], total: null, currency: null, simulated: true, reference: 'DEMO-TXN-00004', at: T('18') },
    timeline: [
      { seq: 1, at: T('16'), from: 'NOT_STARTED', to: 'DRAFT', event: 'START_APPLICATION', actor: 'user', label: 'Application started' },
      { seq: 2, at: T('18'), from: 'DRAFT', to: 'READY_FOR_REVIEW', event: 'REQUEST_REVIEW', actor: 'user', label: 'Ready for review' },
      { seq: 3, at: T('18'), from: 'READY_FOR_REVIEW', to: 'PAYMENT_PENDING', event: 'CONFIRM_SUBMIT', actor: 'user', label: 'Submission step confirmed' },
      { seq: 4, at: T('18'), from: 'PAYMENT_PENDING', to: 'SUBMITTED', event: 'SIMULATE_PAYMENT_SUCCESS', actor: 'user', label: 'Payment simulated' },
      { seq: 5, at: T('19'), from: 'SUBMITTED', to: 'PROCESSING', event: 'ADVANCE_TO_PROCESSING', actor: 'demo', label: 'Demo review started' },
      { seq: 6, at: T('21'), from: 'PROCESSING', to: 'DOCUMENTS_REQUIRED', event: 'REQUEST_DOCUMENTS', actor: 'demo', label: 'A replacement document was requested', detail: 'The background of the photograph is not plain white.' },
    ],
  }),

  seed({
    id: 'DEMO2026E00005',
    pathId: 'evisa', category: 'tourist', status: 'GRANTED',
    applicant: 'Amara Chinelo Okonjo',
    data: common,
    documents: [doc('passport', 'demo-passport.pdf'), doc('photograph', 'demo-photo.jpg')],
    payment: { status: 'succeeded', lines: [], total: null, currency: null, simulated: true, reference: 'DEMO-TXN-00005', at: T('15') },
    decision: { outcome: 'GRANTED', at: T('21'), etaNumber: 'DEMO-ETA-00005', reason: null },
    timeline: [
      { seq: 1, at: T('14'), from: 'NOT_STARTED', to: 'DRAFT', event: 'START_APPLICATION', actor: 'user', label: 'Application started' },
      { seq: 2, at: T('15'), from: 'DRAFT', to: 'READY_FOR_REVIEW', event: 'REQUEST_REVIEW', actor: 'user', label: 'Ready for review' },
      { seq: 3, at: T('15'), from: 'READY_FOR_REVIEW', to: 'PAYMENT_PENDING', event: 'CONFIRM_SUBMIT', actor: 'user', label: 'Submission step confirmed' },
      { seq: 4, at: T('15'), from: 'PAYMENT_PENDING', to: 'SUBMITTED', event: 'SIMULATE_PAYMENT_SUCCESS', actor: 'user', label: 'Payment simulated' },
      { seq: 5, at: T('17'), from: 'SUBMITTED', to: 'PROCESSING', event: 'ADVANCE_TO_PROCESSING', actor: 'demo', label: 'Demo review started' },
      { seq: 6, at: T('21'), from: 'PROCESSING', to: 'GRANTED', event: 'GRANT', actor: 'demo', label: 'Granted in this demo' },
    ],
  }),

  seed({
    id: 'DEMO2026A00006',
    pathId: 'regular', category: 'tourist', status: 'REFUSED',
    applicant: 'Ines Halvorsen',
    data: { ...common, given_name: 'Ines', surname: 'Halvorsen', nationality: 'Norway', country_of_application: 'Norway', country_of_birth: 'Norway', place_of_birth: 'Bergen', date_of_expiry: '2026-11-15', indian_mission: 'Embassy of India, Oslo' },
    documents: [doc('passport', 'demo-passport.pdf'), doc('photograph', 'demo-photo.jpg')],
    decision: {
      outcome: 'REFUSED',
      at: T('22'),
      etaNumber: null,
      reason: 'In this demo the passport expires less than six months after the travel dates.',
    },
    timeline: [
      { seq: 1, at: T('16'), from: 'NOT_STARTED', to: 'DRAFT', event: 'START_APPLICATION', actor: 'user', label: 'Application started' },
      { seq: 2, at: T('18'), from: 'DRAFT', to: 'READY_FOR_REVIEW', event: 'REQUEST_REVIEW', actor: 'user', label: 'Ready for review' },
      { seq: 3, at: T('18'), from: 'READY_FOR_REVIEW', to: 'SUBMITTED', event: 'CONFIRM_SUBMIT', actor: 'user', label: 'Application submitted' },
      { seq: 4, at: T('20'), from: 'SUBMITTED', to: 'PROCESSING', event: 'ADVANCE_TO_PROCESSING', actor: 'demo', label: 'Demo review started' },
      { seq: 5, at: T('22'), from: 'PROCESSING', to: 'REFUSED', event: 'REFUSE', actor: 'demo', label: 'Not granted in this demo' },
    ],
  }),
];

export const SEED_BY_ID = Object.fromEntries(SEED_APPLICATIONS.map((a) => [a.id, a]));
export const SEED_IDS = SEED_APPLICATIONS.map((a) => a.id);

/** What the /demo launcher lists. Order is the order a reviewer should walk. */
export const SCENARIOS = [
  { key: 'first-time', id: 'DEMO2026E00001', title: 'First-time traveller', blurb: 'A half-finished draft, two stages in. Shows resume, validation and the issues list.' },
  { key: 'offline-draft', id: 'DEMO2026E00002', title: 'Offline draft scenario', blurb: 'A fictional business draft with one document chosen. Pair it with the offline indicator below.' },
  { key: 'processing', id: 'DEMO2026E00003', title: 'Application processing', blurb: 'Submitted with the fictional payment step completed, now with the demo reviewer. Nothing needed from the applicant.' },
  { key: 'documents-required', id: 'DEMO2026E00004', title: 'Documents required', blurb: 'A replacement photograph has been requested. Shows the re-upload journey.' },
  { key: 'granted', id: 'DEMO2026E00005', title: 'Granted application', blurb: 'A granted demo record with a watermarked ETA and the arrival-readiness checklist.' },
  { key: 'refused', id: 'DEMO2026A00006', title: 'Refused application', blurb: 'A regular visa that was not granted, with the reason and what a real applicant could do next.' },
];

/** Resolve an ID against the person's own record first, then the seeds. */
export function findApplication(id, mine) {
  if (!id) return null;
  if (mine && mine.id === id) return mine;
  return SEED_BY_ID[id] ?? null;
}

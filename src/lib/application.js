/**
 * The demo application record, its lifecycle, and its identity.
 *
 * Two properties matter more than anything else here:
 *
 *  1. **One stable ID.** The previous version computed
 *     `DEMO{Math.floor(Math.random()*1000000)}` inside JSX, so it changed on
 *     every render and could never be looked up. Here the ID is minted once,
 *     in a reducer, from a persisted counter — never during render, never
 *     from `Math.random()`.
 *  2. **Nothing irreversible happens without a human.** Transitions marked
 *     `confirm` refuse to run unless the event carries `confirmed: true`,
 *     which only ConfirmAction sets. A browser agent driving the DOM cannot
 *     dispatch its way past a commitment gate.
 *
 * This module is pure JavaScript with no React import, so Node can load it
 * directly when generating the agent documentation.
 */

import { STAGES, FORM_STAGES, visibleFields, requiredDocuments } from './fields.js';
import { validateStage } from './validation.js';

export const STATES = Object.freeze([
  'NOT_STARTED',
  'DRAFT',
  'READY_FOR_REVIEW',
  'PAYMENT_PENDING',
  'SUBMITTED',
  'PROCESSING',
  'DOCUMENTS_REQUIRED',
  'GRANTED',
  'REFUSED',
]);

/** How each state is described to a person. Never colour alone. */
export const STATE_META = {
  NOT_STARTED: { label: 'Not started', tone: 'neutral', shape: 'circle' },
  DRAFT: { label: 'Draft', tone: 'info', shape: 'circle-half', note: 'Not submitted' },
  READY_FOR_REVIEW: { label: 'Ready for review', tone: 'info', shape: 'circle-half' },
  PAYMENT_PENDING: { label: 'Payment pending', tone: 'warning', shape: 'triangle' },
  SUBMITTED: { label: 'Submitted', tone: 'info', shape: 'square' },
  PROCESSING: { label: 'Processing', tone: 'info', shape: 'square' },
  DOCUMENTS_REQUIRED: { label: 'Documents required', tone: 'warning', shape: 'triangle' },
  GRANTED: { label: 'Granted', tone: 'success', shape: 'square-filled' },
  REFUSED: { label: 'Not granted', tone: 'danger', shape: 'square-open' },
};

export const TERMINAL_STATES = ['GRANTED', 'REFUSED'];

const PATH_LETTER = { evisa: 'E', regular: 'A', voa: 'V', afghan: 'F' };

/** IDs 00001–00006 belong to the seeded judge scenarios and are never minted. */
export const RESERVED_SEQUENCE = 6;

/**
 * Mint an application ID. Deterministic given (seq, pathId, year).
 * Callers pass the year explicitly so this stays a pure function.
 */
export function mintApplicationId(seq, pathId, year) {
  const letter = PATH_LETTER[pathId];
  if (!letter) throw new Error(`mintApplicationId: unknown path "${pathId}"`);
  if (!Number.isInteger(seq) || seq <= RESERVED_SEQUENCE) {
    throw new Error(`mintApplicationId: sequence ${seq} is inside the reserved seed block`);
  }
  return `DEMO${year}${letter}${String(seq).padStart(5, '0')}`;
}

/**
 * A fictional access code derived from the ID, so the pair can never drift
 * apart and a seeded scenario shows the same code on every reviewer's machine.
 *
 * This is a demo convenience, not a security control, and the UI says so.
 */
export function deriveAccessCode(id) {
  let h = 0x811c9dc5;
  for (const ch of id) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  // Crockford base32 without I, L, O and U, so a code read aloud is unambiguous.
  const A = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  let out = '';
  for (let i = 0; i < 8; i += 1) {
    out += A[h & 31];
    h = ((h >>> 5) | (h << 27)) >>> 0;
  }
  return `${out.slice(0, 4)}-${out.slice(4)}`;
}

export function createApplication({ id, pathId, category, at, answers = null, data = {} }) {
  return {
    schemaVersion: 1,
    id,
    accessCode: deriveAccessCode(id),
    kind: 'user',
    pathId,
    category,
    status: 'DRAFT',
    createdAt: at,
    updatedAt: at,
    submittedAt: null,
    finderAnswers: answers,
    data: { application_type: pathId, visa_category: category, ...data },
    documents: [],
    requestedDocuments: [],
    payment: null,
    decision: null,
    timeline: [
      { seq: 1, at, from: 'NOT_STARTED', to: 'DRAFT', event: 'START_APPLICATION', actor: 'user', label: 'Application started' },
    ],
  };
}

/* ---------------------------------------------------------------------- */
/* Progress                                                                */
/* ---------------------------------------------------------------------- */

/** Whether a form stage has every field it currently requires. */
export function isStageComplete(app, stageId) {
  const stage = STAGES.find((s) => s.id === stageId);
  if (!stage || stage.groups.length === 0) return false;
  return Object.keys(validateStage(stage, app.data)).length === 0;
}

export function stageProgress(app) {
  const reviewed = app.status !== 'DRAFT'
    || app.timeline?.some((event) => event.event === 'REQUEST_REVIEW');
  const submitted = Boolean(app.submittedAt)
    || ['SUBMITTED', 'PROCESSING', 'DOCUMENTS_REQUIRED', 'GRANTED', 'REFUSED'].includes(app.status);

  return STAGES.map((stage) => {
    let complete = false;
    if (FORM_STAGES.some((item) => item.id === stage.id)) complete = isStageComplete(app, stage.id);
    if (stage.id === 'documents') complete = documentsComplete(app);
    if (stage.id === 'review') complete = reviewed;
    if (stage.id === 'submit') complete = submitted;
    return { id: stage.id, title: stage.title, effort: stage.effort, complete };
  });
}

/** The first stage still needing work — where "Continue" should land. */
export function nextIncompleteStage(app) {
  const progress = stageProgress(app);
  return progress.find((stage) => !stage.complete)?.id ?? null;
}

export function documentsComplete(app) {
  const required = requiredDocuments(app.data);
  return required.every((r) => app.documents.some((d) => d.slot === r.type));
}

/**
 * Everything standing between the applicant and submission, as a flat list the
 * review screen can render issues-first.
 */
export function outstandingIssues(app) {
  const issues = [];
  for (const stage of FORM_STAGES) {
    const errors = validateStage(stage, app.data);
    for (const [field, message] of Object.entries(errors)) {
      issues.push({ stageId: stage.id, stageTitle: stage.title, field, message });
    }
  }
  for (const req of requiredDocuments(app.data)) {
    if (!app.documents.some((d) => d.slot === req.type)) {
      issues.push({
        stageId: 'documents',
        stageTitle: 'Documents',
        field: req.type,
        message: `Choose a demo file for ${req.title}.`,
      });
    }
  }
  return issues;
}

/* ---------------------------------------------------------------------- */
/* The state machine                                                       */
/* ---------------------------------------------------------------------- */

const EVENT_LABEL = {
  START_APPLICATION: 'Application started',
  REQUEST_REVIEW: 'Ready for review',
  REOPEN: 'Reopened for editing',
  CONFIRM_SUBMIT: 'Submission step confirmed',
  SIMULATE_PAYMENT_SUCCESS: 'Payment simulated',
  SIMULATE_PAYMENT_FAILURE: 'Simulated payment did not go through',
  CANCEL_PAYMENT: 'Payment cancelled',
  ADVANCE_TO_PROCESSING: 'Demo review started',
  REQUEST_DOCUMENTS: 'A replacement document was requested',
  RESUBMIT_DOCUMENTS: 'Replacement document sent',
  GRANT: 'Granted in this demo',
  REFUSE: 'Not granted in this demo',
};

/** Paths that carry a fee in this simulation. Only the e-Visa route does. */
export const feeApplies = (app) => app.pathId === 'evisa';

export const FEE_LINES = [
  { label: 'Visa fee', amount: 2000 },
  { label: 'Service charge', amount: 500 },
];
export const FEE_TOTAL = FEE_LINES.reduce((n, l) => n + l.amount, 0);

const TRANSITIONS = [
  {
    from: 'DRAFT', on: 'REQUEST_REVIEW', to: 'READY_FOR_REVIEW',
    guard: (app) => outstandingIssues(app).length === 0,
  },
  { from: 'READY_FOR_REVIEW', on: 'REOPEN', to: 'DRAFT' },
  {
    from: 'READY_FOR_REVIEW', on: 'CONFIRM_SUBMIT', to: 'PAYMENT_PENDING',
    confirm: true, guard: feeApplies,
    reduce: (app, e) => ({
      ...app,
      payment: { status: 'pending', lines: FEE_LINES, total: FEE_TOTAL, currency: 'INR', simulated: true, at: e.at },
    }),
  },
  {
    from: 'READY_FOR_REVIEW', on: 'CONFIRM_SUBMIT', to: 'SUBMITTED',
    confirm: true, guard: (app) => !feeApplies(app),
    reduce: (app, e) => ({ ...app, submittedAt: e.at }),
  },
  {
    from: 'PAYMENT_PENDING', on: 'SIMULATE_PAYMENT_SUCCESS', to: 'SUBMITTED',
    confirm: true,
    reduce: (app, e) => ({
      ...app,
      submittedAt: e.at,
      payment: { ...app.payment, status: 'succeeded', reference: `DEMO-TXN-${app.id.slice(-5)}`, at: e.at },
    }),
  },
  {
    from: 'PAYMENT_PENDING', on: 'SIMULATE_PAYMENT_FAILURE', to: 'PAYMENT_PENDING',
    confirm: true,
    reduce: (app, e) => ({
      ...app,
      payment: { ...app.payment, status: 'failed', reason: 'The simulated payment was declined.', at: e.at },
    }),
  },
  {
    from: 'PAYMENT_PENDING', on: 'CANCEL_PAYMENT', to: 'READY_FOR_REVIEW', confirm: true,
    reduce: (app, e) => ({
      ...app,
      payment: { ...app.payment, status: 'cancelled', at: e.at },
    }),
  },
  { from: 'SUBMITTED', on: 'ADVANCE_TO_PROCESSING', to: 'PROCESSING' },
  {
    from: 'PROCESSING', on: 'REQUEST_DOCUMENTS', to: 'DOCUMENTS_REQUIRED',
    reduce: (app, e) => ({ ...app, requestedDocuments: e.slots || [] }),
  },
  {
    from: 'DOCUMENTS_REQUIRED', on: 'RESUBMIT_DOCUMENTS', to: 'PROCESSING',
    confirm: true,
    guard: (app) => app.requestedDocuments.every((slot) =>
      app.documents.some((d) => d.slot === slot && d.status === 'replaced')),
    reduce: (app) => ({ ...app, requestedDocuments: [] }),
  },
  {
    from: 'PROCESSING', on: 'GRANT', to: 'GRANTED',
    reduce: (app, e) => ({
      ...app,
      decision: { outcome: 'GRANTED', at: e.at, etaNumber: `DEMO-ETA-${app.id.slice(-5)}`, reason: null },
    }),
  },
  {
    from: 'PROCESSING', on: 'REFUSE', to: 'REFUSED',
    reduce: (app, e) => ({
      ...app,
      decision: { outcome: 'REFUSED', at: e.at, etaNumber: null, reason: e.reason || 'No reason recorded in this demo.' },
    }),
  },
];

/** Events currently available, used to drive the UI and the agent state. */
export function allowedEvents(app) {
  if (!app) return ['START_APPLICATION'];
  return TRANSITIONS.filter((t) => t.from === app.status && (!t.guard || t.guard(app, {})))
    .map((t) => t.on);
}

/**
 * Apply an event. Pure: the caller supplies `at`, so there is no clock read
 * here and the transition tests need no time mocking.
 */
export function applyEvent(app, event) {
  const t = TRANSITIONS.find(
    (x) => x.from === app.status && x.on === event.type && (!x.guard || x.guard(app, event)),
  );
  if (!t) return { app, error: `Cannot ${event.type} from ${app.status}.` };
  if (t.confirm && event.confirmed !== true) {
    return { app, error: `${event.type} requires an explicit confirmation from a person.` };
  }
  const next = {
    ...app,
    status: t.to,
    updatedAt: event.at,
    timeline: [
      ...app.timeline,
      {
        seq: app.timeline.length + 1,
        at: event.at,
        from: app.status,
        to: t.to,
        event: t.on,
        actor: event.actor || 'user',
        label: EVENT_LABEL[t.on] || t.on,
        detail: event.detail || null,
      },
    ],
  };
  return { app: t.reduce ? t.reduce(next, event) : next, error: null };
}

/** Editing is only possible before the record is committed. */
export const isEditable = (app) => app?.status === 'DRAFT' || app?.status === 'READY_FOR_REVIEW';

/** Rehydration self-heals a corrupted status from the append-only timeline. */
export function normaliseStatus(app) {
  if (!app) return app;
  if (STATES.includes(app.status)) return app;
  return { ...app, status: app.timeline?.at(-1)?.to ?? 'DRAFT' };
}

export { STAGES, FORM_STAGES, visibleFields, requiredDocuments };

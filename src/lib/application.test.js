import { describe, expect, it } from 'vitest';
import {
  FEE_TOTAL, allowedEvents, applyEvent, createApplication, deriveAccessCode,
  isEditable, mintApplicationId, nextIncompleteStage, normaliseStatus, stageProgress,
} from './application.js';
import { SEED_BY_ID } from './demo-seed.js';

const at = (day) => `2026-08-${day}T09:00:00.000Z`;
const clone = (value) => structuredClone(value);

describe('application identity', () => {
  it('mints deterministic path-aware IDs outside the reserved seed block', () => {
    expect(mintApplicationId(7, 'evisa', '2026')).toBe('DEMO2026E00007');
    expect(mintApplicationId(42, 'regular', '2027')).toBe('DEMO2027A00042');
    expect(() => mintApplicationId(6, 'evisa', '2026')).toThrow(/reserved seed block/);
    expect(() => mintApplicationId(7, 'unknown', '2026')).toThrow(/unknown path/);
  });

  it('derives a stable, readable access code from the ID', () => {
    expect(deriveAccessCode('DEMO2026E00005')).toMatch(/^[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/);
    expect(deriveAccessCode('DEMO2026E00005')).toBe(deriveAccessCode('DEMO2026E00005'));
    expect(deriveAccessCode('DEMO2026E00005')).not.toBe(deriveAccessCode('DEMO2026E00004'));
  });

  it('creates a draft and records the first lifecycle event', () => {
    const app = createApplication({
      id: 'DEMO2026E00007', pathId: 'evisa', category: 'tourist', at: at('23'),
    });
    expect(app.status).toBe('DRAFT');
    expect(app.accessCode).toBe(deriveAccessCode(app.id));
    expect(app.timeline).toMatchObject([{ from: 'NOT_STARTED', to: 'DRAFT' }]);
  });
});

describe('application lifecycle', () => {
  it('reports the same seven-stage journey that the page heading promises', () => {
    const draft = clone(SEED_BY_ID.DEMO2026E00001);
    const progress = stageProgress(draft);
    expect(progress).toHaveLength(7);
    expect(progress.map((stage) => stage.id)).toEqual([
      'setup', 'applicant', 'background', 'travel', 'documents', 'review', 'submit',
    ]);
    expect(nextIncompleteStage(draft)).toBe('applicant');

    const processing = clone(SEED_BY_ID.DEMO2026E00003);
    expect(stageProgress(processing).every((stage) => stage.complete)).toBe(true);
    expect(nextIncompleteStage(processing)).toBeNull();
  });

  it('allows review only after all visible fields and demo documents are complete', () => {
    const incomplete = clone(SEED_BY_ID.DEMO2026E00001);
    expect(allowedEvents(incomplete)).not.toContain('REQUEST_REVIEW');
    expect(applyEvent(incomplete, { type: 'REQUEST_REVIEW', at: at('24') }).error)
      .toBe('Cannot REQUEST_REVIEW from DRAFT.');

    const complete = { ...clone(SEED_BY_ID.DEMO2026E00003), status: 'DRAFT' };
    expect(allowedEvents(complete)).toContain('REQUEST_REVIEW');
    expect(applyEvent(complete, { type: 'REQUEST_REVIEW', at: at('24') }).app.status)
      .toBe('READY_FOR_REVIEW');
  });

  it('requires explicit human confirmation at payment and submission gates', () => {
    const ready = { ...clone(SEED_BY_ID.DEMO2026E00003), status: 'READY_FOR_REVIEW' };
    const blocked = applyEvent(ready, { type: 'CONFIRM_SUBMIT', at: at('24') });
    expect(blocked.error).toMatch(/explicit confirmation from a person/);
    expect(blocked.app).toBe(ready);

    const accepted = applyEvent(ready, {
      type: 'CONFIRM_SUBMIT', at: at('24'), confirmed: true, actor: 'user',
    });
    expect(accepted.error).toBeNull();
    expect(accepted.app.status).toBe('PAYMENT_PENDING');
    expect(accepted.app.payment).toMatchObject({ status: 'pending', total: FEE_TOTAL, simulated: true });
  });

  it('takes a no-fee regular application directly to submitted', () => {
    const ready = { ...clone(SEED_BY_ID.DEMO2026A00006), status: 'READY_FOR_REVIEW' };
    const { app, error } = applyEvent(ready, {
      type: 'CONFIRM_SUBMIT', at: at('24'), confirmed: true,
    });
    expect(error).toBeNull();
    expect(app.status).toBe('SUBMITTED');
    expect(app.submittedAt).toBe(at('24'));
  });

  it('submits only after a confirmed successful simulated payment', () => {
    const pending = {
      ...clone(SEED_BY_ID.DEMO2026E00003),
      status: 'PAYMENT_PENDING',
      submittedAt: null,
      payment: { status: 'pending', total: FEE_TOTAL, simulated: true },
    };
    const blocked = applyEvent(pending, { type: 'SIMULATE_PAYMENT_SUCCESS', at: at('25') });
    expect(blocked.error).toMatch(/explicit confirmation/);
    const result = applyEvent(pending, {
      type: 'SIMULATE_PAYMENT_SUCCESS', at: at('25'), confirmed: true,
    });
    expect(result.error).toBeNull();
    expect(result.app).toMatchObject({
      status: 'SUBMITTED',
      submittedAt: at('25'),
      payment: { status: 'succeeded', simulated: true },
    });
    expect(result.app.payment.reference).toBe('DEMO-TXN-00003');
  });

  it('records a cancelled payment instead of leaving a stale pending label', () => {
    const pending = {
      ...clone(SEED_BY_ID.DEMO2026E00003),
      status: 'PAYMENT_PENDING',
      payment: { status: 'pending', total: FEE_TOTAL, simulated: true },
    };
    const result = applyEvent(pending, {
      type: 'CANCEL_PAYMENT', at: at('25'), confirmed: true,
    });
    expect(result.error).toBeNull();
    expect(result.app).toMatchObject({
      status: 'READY_FOR_REVIEW', payment: { status: 'cancelled', at: at('25') },
    });
  });

  it('moves through document request and guarded replacement resubmission', () => {
    const processing = clone(SEED_BY_ID.DEMO2026E00003);
    const requested = applyEvent(processing, {
      type: 'REQUEST_DOCUMENTS', slots: ['photograph'], at: at('24'), actor: 'demo',
    }).app;
    expect(requested.status).toBe('DOCUMENTS_REQUIRED');
    expect(requested.requestedDocuments).toEqual(['photograph']);
    expect(allowedEvents(requested)).not.toContain('RESUBMIT_DOCUMENTS');

    requested.documents = requested.documents.map((document) => document.slot === 'photograph'
      ? { ...document, status: 'replaced' }
      : document);
    expect(allowedEvents(requested)).toContain('RESUBMIT_DOCUMENTS');
    const blocked = applyEvent(requested, { type: 'RESUBMIT_DOCUMENTS', at: at('25') });
    expect(blocked.error).toMatch(/explicit confirmation/);
    const resubmitted = applyEvent(requested, {
      type: 'RESUBMIT_DOCUMENTS', at: at('25'), confirmed: true,
    });
    expect(resubmitted.app.status).toBe('PROCESSING');
    expect(resubmitted.app.requestedDocuments).toEqual([]);
  });

  it('rejects impossible transitions without mutating the record', () => {
    const draft = clone(SEED_BY_ID.DEMO2026E00001);
    const result = applyEvent(draft, { type: 'GRANT', at: at('24') });
    expect(result.error).toBe('Cannot GRANT from DRAFT.');
    expect(result.app).toBe(draft);
  });

  it('locks committed records and repairs an invalid rehydrated status', () => {
    expect(isEditable(SEED_BY_ID.DEMO2026E00001)).toBe(true);
    expect(isEditable(SEED_BY_ID.DEMO2026E00003)).toBe(false);
    expect(normaliseStatus({ status: 'CORRUPT', timeline: [{ to: 'PROCESSING' }] }).status)
      .toBe('PROCESSING');
    expect(normaliseStatus({ status: 'CORRUPT', timeline: [] }).status).toBe('DRAFT');
  });
});

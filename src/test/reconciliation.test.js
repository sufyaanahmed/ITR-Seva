import { describe, expect, it } from 'vitest';
import { createDemoSession } from '../data/demoPersona.js';
import {
  getReconciledIncome,
  getUnresolvedItems,
  reconcileEvidence,
  RESOLUTION_ACTION,
  resolveReconciliation,
} from '../domain/reconciliation.js';

describe('demo reconciliation', () => {
  it('starts with exactly the two deliberate issues', () => {
    const session = createDemoSession();
    const items = reconcileEvidence(session.evidence);
    expect(getUnresolvedItems(items).map((item) => [item.id, item.status])).toEqual([
      ['savings-interest', 'duplicate'],
      ['fd-interest', 'missing'],
    ]);
  });

  it('resolves both issues without mutating previous state', () => {
    const session = createDemoSession();
    const first = resolveReconciliation({}, 'savings-interest', RESOLUTION_ACTION.MARK_AIS_ENTRY_DUPLICATE);
    const second = resolveReconciliation(first, 'fd-interest', RESOLUTION_ACTION.INCLUDE_FROM_BANK_RECORD);
    const items = reconcileEvidence(session.evidence, second);

    expect(first['fd-interest']).toBeUndefined();
    expect(getUnresolvedItems(items)).toHaveLength(0);
    expect(getReconciledIncome(session.evidence, second)).toEqual({
      salary: 1450000,
      savingsInterest: 18000,
      fixedDepositInterest: 42000,
    });
  });

  it('rejects a resolution that does not match the evidence issue', () => {
    expect(() => resolveReconciliation({}, 'salary', RESOLUTION_ACTION.INCLUDE_FROM_BANK_RECORD)).toThrow();
  });

  it('does not trust malformed or stale persisted resolutions', () => {
    const session = createDemoSession();
    const items = reconcileEvidence(session.evidence, {
      'savings-interest': { action: RESOLUTION_ACTION.INCLUDE_FROM_BANK_RECORD },
      salary: { action: RESOLUTION_ACTION.MARK_AIS_ENTRY_DUPLICATE },
    });
    expect(items.find((item) => item.id === 'savings-interest').status).toBe('duplicate');
    expect(items.find((item) => item.id === 'salary').status).toBe('matched');
  });

  it('rejects malformed evidence instead of reporting a false match', () => {
    expect(() => reconcileEvidence(null)).toThrow('Evidence must be an array');
    expect(() => reconcileEvidence([{ id: 'bad', category: 'salary', source: 'ais', amount: -1 }])).toThrow('Every evidence line');
  });

  it('bounds and cleans resolution notes', () => {
    const result = resolveReconciliation({}, 'fd-interest', RESOLUTION_ACTION.INCLUDE_FROM_BANK_RECORD, `\u0000${'x'.repeat(200)}`);
    expect(result['fd-interest'].note).toHaveLength(160);
    expect(result['fd-interest'].note).not.toContain('\u0000');
  });
});

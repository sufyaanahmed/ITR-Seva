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
});

import { describe, expect, it } from 'vitest';
import { createDemoSession, DEMO_PERSONA } from '../data/demoPersona.js';
import { recommendFilingRoute } from '../domain/filingRecommendation.js';
import { buildReadinessReport, serializeReadinessReport } from '../domain/readinessReport.js';
import { reconcileEvidence, RESOLUTION_ACTION, resolveReconciliation } from '../domain/reconciliation.js';
import { calculateTaxComparison } from '../domain/taxCalculator.js';

function makeReport(resolutions = {}) {
  const session = createDemoSession();
  return buildReadinessReport({
    persona: session.persona,
    reconciliationItems: reconcileEvidence(session.evidence, resolutions),
    recommendation: recommendFilingRoute(session.persona.filingAnswers),
    taxComparison: calculateTaxComparison(session.persona.taxInputs),
  });
}

describe('readiness report', () => {
  it('lists unresolved evidence as blockers', () => {
    const report = makeReport();
    expect(report.status).toBe('needs_attention');
    expect(report.blockers).toHaveLength(2);
  });

  it('becomes ready only when both seeded issues are resolved', () => {
    let resolutions = resolveReconciliation({}, 'savings-interest', RESOLUTION_ACTION.MARK_AIS_ENTRY_DUPLICATE);
    resolutions = resolveReconciliation(resolutions, 'fd-interest', RESOLUTION_ACTION.INCLUDE_FROM_BANK_RECORD);
    const report = makeReport(resolutions);
    expect(report.status).toBe('ready_to_continue');
    expect(report.blockers).toEqual([]);
    expect(JSON.parse(serializeReadinessReport(report)).generatedFor).toBe(DEMO_PERSONA.name);
  });
});

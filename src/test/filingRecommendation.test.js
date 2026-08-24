import { describe, expect, it } from 'vitest';
import { DEMO_PERSONA } from '../data/demoPersona.js';
import { recommendFilingRoute, RECOMMENDATION } from '../domain/filingRecommendation.js';

describe('filing recommendation', () => {
  it('identifies the supported demo as a likely ITR-1 candidate', () => {
    const result = recommendFilingRoute(DEMO_PERSONA.filingAnswers);
    expect(result.kind).toBe(RECOMMENDATION.ITR1_CANDIDATE);
    expect(result.reasons.length).toBeGreaterThan(1);
  });

  it.each([
    ['capital gains', { capitalGains: true }],
    ['business income', { businessOrProfessionalIncome: true }],
    ['foreign assets', { foreignAssetsOrIncome: true }],
    ['multiple houses', { houseProperties: 2 }],
    ['income above ₹50 lakh', { totalIncomeAbove50Lakh: true }],
  ])('sends %s for professional review', (_label, override) => {
    const result = recommendFilingRoute({ ...DEMO_PERSONA.filingAnswers, ...override });
    expect(result.kind).toBe(RECOMMENDATION.PROFESSIONAL_REVIEW);
  });

  it('does not guess when required answers are absent', () => {
    const result = recommendFilingRoute({ residentialStatus: 'resident' });
    expect(result.kind).toBe(RECOMMENDATION.INSUFFICIENT_INFORMATION);
    expect(result.missing).toContain('capitalGains');
  });

  it.each([
    ['negative houses', { houseProperties: -1 }],
    ['string boolean', { capitalGains: 'false' }],
    ['unknown residence', { residentialStatus: 'somewhere' }],
    ['invalid agricultural income', { agriculturalIncome: Number.NaN }],
  ])('does not guess for %s', (_label, override) => {
    const result = recommendFilingRoute({ ...DEMO_PERSONA.filingAnswers, ...override });
    expect(result.kind).toBe(RECOMMENDATION.INSUFFICIENT_INFORMATION);
    expect(result.invalid.length).toBeGreaterThan(0);
  });
});

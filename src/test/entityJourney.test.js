import { describe, expect, it } from 'vitest';
import { ENTITY_JOURNEY_PROFILES, ENTITY_PROFILE_IDS } from '../data/journeyProfiles.js';
import {
  ENTITY_RECOMMENDATION,
  ENTITY_REPORT_STATUS,
  evaluateEntityJourney,
} from '../domain/entityJourney.js';

function safeInput(profileId) {
  const profile = ENTITY_JOURNEY_PROFILES[profileId];
  return {
    answers: Object.fromEntries(profile.questions.map((question) => [question.id, question.safeAnswer])),
    checks: Object.fromEntries(profile.reviewChecks.map((check) => [check.id, 'checked'])),
  };
}

describe('entity journey evaluator', () => {
  it.each([
    [ENTITY_PROFILE_IDS.COMPANY, ENTITY_RECOMMENDATION.POSSIBLE_ITR6, 'ITR-6'],
    [ENTITY_PROFILE_IDS.FIRM_LLP, ENTITY_RECOMMENDATION.POSSIBLE_ITR5, 'ITR-5'],
  ])('returns a conditional starting point for a bounded %s example', (profileId, kind, form) => {
    const result = evaluateEntityJourney(profileId, safeInput(profileId));

    expect(result.status).toBe(ENTITY_REPORT_STATUS.READY_FOR_PROFESSIONAL_REVIEW);
    expect(result.recommendation.kind).toBe(kind);
    expect(result.recommendation.possibleForm).toBe(form);
    expect(result.completedChecks).toHaveLength(3);
    expect(result.blockers).toEqual([]);
    expect(result.taxCalculation.status).toBe('not_offered');
  });

  it('does not suggest ITR-6 when section 11 exemption is involved', () => {
    const input = safeInput(ENTITY_PROFILE_IDS.COMPANY);
    input.answers.section_11_exemption = 'yes';
    const result = evaluateEntityJourney(ENTITY_PROFILE_IDS.COMPANY, input);

    expect(result.status).toBe(ENTITY_REPORT_STATUS.NEEDS_ATTENTION);
    expect(result.recommendation.kind).toBe(ENTITY_RECOMMENDATION.PROFESSIONAL_REVIEW);
    expect(result.recommendation.possibleForm).toBeNull();
    expect(result.blockers).toContain('Qualified review needed: Is the company claiming exemption under section 11?');
  });

  it('does not treat an ordinary firm as the bounded LLP example', () => {
    const input = safeInput(ENTITY_PROFILE_IDS.FIRM_LLP);
    input.answers.is_llp = 'no';
    const result = evaluateEntityJourney(ENTITY_PROFILE_IDS.FIRM_LLP, input);

    expect(result.recommendation.kind).toBe(ENTITY_RECOMMENDATION.PROFESSIONAL_REVIEW);
    expect(result.recommendation.possibleForm).toBeNull();
  });

  it('turns uncertainty and record issues into blockers', () => {
    const input = safeInput(ENTITY_PROFILE_IDS.COMPANY);
    input.answers.foreign_tax_credit = 'not_sure';
    input.checks.information_statements = 'needs_attention';
    const result = evaluateEntityJourney(ENTITY_PROFILE_IDS.COMPANY, input);

    expect(result.status).toBe(ENTITY_REPORT_STATUS.NEEDS_ATTENTION);
    expect(result.recommendation.kind).toBe(ENTITY_RECOMMENDATION.PROFESSIONAL_REVIEW);
    expect(result.blockers).toHaveLength(2);
    expect(result.completedChecks).toHaveLength(2);
  });

  it('refuses missing and malformed values instead of coercing them', () => {
    const result = evaluateEntityJourney(ENTITY_PROFILE_IDS.FIRM_LLP, {
      answers: { is_llp: true },
      checks: [],
    });

    expect(result.recommendation.kind).toBe(ENTITY_RECOMMENDATION.INSUFFICIENT_INFORMATION);
    expect(result.recommendation.possibleForm).toBeNull();
    expect(result.blockers.length).toBeGreaterThan(3);
  });

  it('rejects unsupported profile ids', () => {
    expect(() => evaluateEntityJourney('trust')).toThrow(RangeError);
  });
});

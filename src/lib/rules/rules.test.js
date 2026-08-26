import { describe, it, expect } from 'vitest';
import {
  evaluate, voaAvailable, isEvisaEligibleNationality, OUTCOME, RULES, QUESTION_IDS,
} from './index.js';
import { EVISA_ELIGIBLE, COMMON_NON_EVISA } from './reference.js';

/** A complete, unremarkable answer set. Individual tests override one field. */
const base = {
  nationality: 'USA',
  passportType: 'ordinary',
  purpose: 'tourism',
  stayLength: 'under-60',
  pakistaniConnection: 'no',
  priorIndianVisa: 'no',
};
const answer = (o = {}) => evaluate({ ...base, ...o });

describe('engine contract', () => {
  it('every rule carries a source, a review date and a rationale', () => {
    for (const rule of RULES) {
      expect(rule.source?.url, rule.id).toMatch(/^https:\/\//);
      expect(rule.reviewedAt, rule.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(rule.rationale.length, rule.id).toBeGreaterThan(30);
      expect(['complete', 'partial'], rule.id).toContain(rule.coverage);
    }
  });

  it('returns INSUFFICIENT_INFORMATION when any answer is missing, naming what is missing', () => {
    for (const id of QUESTION_IDS) {
      const partial = { ...base, [id]: undefined };
      const out = evaluate(partial);
      expect(out.kind).toBe(OUTCOME.INSUFFICIENT_INFORMATION);
      expect(out.missing).toContain(id);
    }
    expect(evaluate({}).kind).toBe(OUTCOME.INSUFFICIENT_INFORMATION);
  });

  it('every determined outcome cites the rule that fired', () => {
    const out = answer();
    expect(out.rule.id).toBeTruthy();
    expect(out.rule.sourceUrl).toMatch(/^https:\/\//);
    expect(out.rule.reviewedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('never emits an outcome kind outside the four permitted ones', () => {
    const permitted = Object.values(OUTCOME);
    for (const nationality of [...EVISA_ELIGIBLE, ...COMMON_NON_EVISA]) {
      for (const purpose of ['tourism', 'business', 'work', 'study', 'conference', 'transit']) {
        expect(permitted).toContain(answer({ nationality, purpose }).kind);
      }
    }
  });
});

describe('the fallthrough regression — the defect this rebuild exists to fix', () => {
  it('never recommends an e-Visa to a nationality absent from the published list', () => {
    for (const nationality of COMMON_NON_EVISA.filter((n) => n !== 'Afghanistan')) {
      const out = answer({ nationality });
      expect(out.kind, nationality).not.toBe(OUTCOME.LIKELY_PATH);
      expect(JSON.stringify(out), nationality).not.toMatch(/e-Tourist Visa/);
    }
  });

  it('never uses the words "eligible", "approved" or "guaranteed" in any outcome', () => {
    const forbidden = /\b(you are eligible|you qualify|approved|guaranteed|will be granted)\b/i;
    for (const nationality of [...EVISA_ELIGIBLE.slice(0, 40), ...COMMON_NON_EVISA]) {
      for (const purpose of ['tourism', 'business', 'work', 'medical', 'study']) {
        const out = answer({ nationality, purpose });
        expect(`${out.headline} ${out.summary}`, `${nationality}/${purpose}`).not.toMatch(forbidden);
      }
    }
  });

  it('an unknown nationality string is not treated as eligible', () => {
    expect(isEvisaEligibleNationality('Atlantis')).toBe(false);
    expect(answer({ nationality: 'Atlantis' }).kind).toBe(OUTCOME.NOT_AVAILABLE_ONLINE);
  });
});

describe('exclusions run before permissions', () => {
  it('a diplomatic passport overrides an otherwise eligible nationality', () => {
    const out = answer({ nationality: 'Japan', passportType: 'diplomatic' });
    expect(out.kind).toBe(OUTCOME.NEEDS_OFFICIAL_REVIEW);
    expect(out.rule.id).toBe('passport-diplomatic');
  });

  it('an endorsed passport overrides an otherwise eligible nationality', () => {
    expect(answer({ passportType: 'endorsed' }).rule.id).toBe('passport-endorsed');
  });

  it('a non-passport travel document overrides an otherwise eligible nationality', () => {
    expect(answer({ passportType: 'other-document' }).rule.id).toBe('passport-other-document');
  });

  it('a Pakistani connection overrides an otherwise eligible nationality', () => {
    const out = answer({ nationality: 'United Kingdom', pakistaniConnection: 'yes' });
    expect(out.kind).toBe(OUTCOME.NEEDS_OFFICIAL_REVIEW);
    expect(out.rule.id).toBe('pakistani-connection');
  });

  it('a Pakistani passport reaches the same rule even when the connection question says no', () => {
    expect(answer({ nationality: 'Pakistan', pakistaniConnection: 'no' }).rule.id)
      .toBe('pakistani-connection');
  });

  it('a stay over 180 days overrides an otherwise eligible nationality', () => {
    expect(answer({ stayLength: 'over-180' }).rule.id).toBe('stay-over-180');
  });
});

describe('purposes with no online route', () => {
  it.each(['work', 'journalism'])('%s is NOT_AVAILABLE_ONLINE even for an eligible passport', (purpose) => {
    const out = answer({ purpose });
    expect(out.kind).toBe(OUTCOME.NOT_AVAILABLE_ONLINE);
    expect(out.officialUrl).toContain('visa-category');
  });

  it('conference is NEEDS_OFFICIAL_REVIEW rather than an invented sub-type', () => {
    const out = answer({ purpose: 'conference' });
    expect(out.kind).toBe(OUTCOME.NEEDS_OFFICIAL_REVIEW);
    expect(out.rule.coverage).toBe('partial');
    // The rationale may name e-Conference to explain why we refuse to invent it;
    // what must never happen is offering it to the traveller as a real route.
    expect(`${out.headline} ${out.summary}`).not.toMatch(/e-Conference/);
    expect(out.route).toBeUndefined();
  });
});

describe('e-Visa likely paths', () => {
  it.each([
    ['tourism', 'e-Tourist Visa'],
    ['business', 'e-Business Visa'],
    ['medical', 'e-Medical Visa'],
    ['medical-attendant', 'e-Medical Attendant Visa'],
    ['study', 'e-Student Visa'],
    ['transit', 'e-Transit Visa'],
  ])('%s maps to the %s for an eligible passport', (purpose, expected) => {
    const out = answer({ purpose });
    expect(out.kind).toBe(OUTCOME.LIKELY_PATH);
    expect(out.headline).toContain(expected);
    expect(out.route).toBe('evisa');
  });

  it('phrases the result as guidance, not a decision', () => {
    const out = answer();
    expect(out.headline).toMatch(/point to/i);
    expect(out.summary).toMatch(/not a decision/i);
  });

  it('accepts common aliases for official list spellings', () => {
    for (const alias of ['United States', 'south korea', 'UK', 'united arab emirates']) {
      expect(isEvisaEligibleNationality(alias), alias).toBe(true);
    }
  });
});

describe('Visa on Arrival', () => {
  const voa = (o) => voaAvailable({ ...base, ...o });

  it('is offered to Japan and Republic of Korea for all four permitted purposes', () => {
    for (const nationality of ['Japan', 'Republic of Korea']) {
      for (const purpose of ['tourism', 'business', 'conference', 'medical']) {
        expect(voa({ nationality, purpose }), `${nationality}/${purpose}`).toBe(true);
      }
    }
  });

  it('is withheld from UAE nationals without a prior Indian visa', () => {
    expect(voa({ nationality: 'UAE', priorIndianVisa: 'no' })).toBe(false);
    expect(voa({ nationality: 'UAE', priorIndianVisa: 'yes' })).toBe(true);
  });

  it('is withheld beyond 60 days', () => {
    expect(voa({ nationality: 'Japan', stayLength: '60-to-180' })).toBe(false);
  });

  it('is withheld for purposes outside the permitted four', () => {
    expect(voa({ nationality: 'Japan', purpose: 'study' })).toBe(false);
  });

  it('is withheld where there is a Pakistani connection or a non-ordinary passport', () => {
    expect(voa({ nationality: 'Japan', pakistaniConnection: 'yes' })).toBe(false);
    expect(voa({ nationality: 'Japan', passportType: 'diplomatic' })).toBe(false);
  });

  it('is withheld from nationalities outside the three named', () => {
    expect(voa({ nationality: 'USA' })).toBe(false);
    expect(voa({ nationality: 'United Kingdom' })).toBe(false);
  });

  it('is surfaced as an additional option alongside the e-Visa, never instead of it', () => {
    const out = answer({ nationality: 'Japan', purpose: 'tourism' });
    expect(out.kind).toBe(OUTCOME.LIKELY_PATH);
    expect(out.route).toBe('evisa');
    expect(out.alsoVoa).toBe(true);
  });
});

describe('Afghan nationals', () => {
  it('routes to the separate official portal for a covered category', () => {
    const out = answer({ nationality: 'Afghanistan', purpose: 'business' });
    expect(out.kind).toBe(OUTCOME.LIKELY_PATH);
    expect(out.route).toBe('afghan');
    expect(out.officialUrl).toContain('avisa');
  });

  it('does not invent a tourism category, because none is listed', () => {
    const out = answer({ nationality: 'Afghanistan', purpose: 'tourism' });
    expect(out.kind).toBe(OUTCOME.NEEDS_OFFICIAL_REVIEW);
    expect(out.summary).toMatch(/not among them/i);
  });

  it('never routes an Afghan national through the e-Visa system', () => {
    for (const purpose of ['tourism', 'business', 'study', 'medical', 'transit']) {
      expect(answer({ nationality: 'Afghanistan', purpose }).route).not.toBe('evisa');
    }
  });
});

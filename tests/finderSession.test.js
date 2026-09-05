import assert from 'node:assert/strict';
import { test } from 'node:test';
import { countryFlag, resolveNationality, searchNationalities } from '../src/domain/countries.js';
import { PASSPORT_NATIONALITIES } from '../src/data/visaEligibilityRules.js';
import { getFinderQuestions, evaluateVisaRoute } from '../src/domain/visaEligibility.js';
import { applyFinderAnswer, applicationFromFinder, firstUnansweredStep } from '../src/domain/finderSession.js';

const answers = { passport: 'United Arab Emirates', passportType: 'ordinary', pakistanOrigin: 'no', purpose: 'tourism', durationDays: '12', uaePriorVisa: 'yes', voaArrivalPort: 'designated', voaIndiaResidenceOrOccupation: 'no', voaAdmissibility: 'yes', travelReadiness: 'yes' };

test('country search handles punctuated aliases without changing the canonical nationality', () => {
  for (const query of ['UAE', 'U.A.E.', ' u.a.e ', 'United Arab Emirates']) {
    assert.deepEqual(searchNationalities(query), ['United Arab Emirates']);
    assert.equal(resolveNationality(query), 'United Arab Emirates');
  }
  assert.equal(resolveNationality('USA'), 'United States');
  assert.equal(resolveNationality('UK'), 'United Kingdom');
  assert.equal(resolveNationality('Korea'), undefined);
});

test('every selectable country has a flag', () => {
  assert.equal(countryFlag('United Arab Emirates'), '🇦🇪');
  assert.deepEqual(PASSPORT_NATIONALITIES.filter((country) => !countryFlag(country)), []);
});

test('reselecting a previous answer preserves all subsequent answers and draft state', () => {
  const finder = { answers, step: 3, showResult: false };
  assert.equal(applyFinderAnswer(finder, 'passport', answers.passport), finder);
  assert.equal(firstUnansweredStep(answers), getFinderQuestions(answers).length);
});

test('changing passport keeps trip details but rechecks the passport conditions', () => {
  const result = applyFinderAnswer({ answers }, 'passport', 'France');
  assert.equal(result.answers.uaePriorVisa, undefined);
  assert.equal(result.answers.voaArrivalPort, undefined);
  assert.equal(result.answers.purpose, 'tourism');
  assert.equal(result.answers.durationDays, '12');
  assert.equal(result.answers.passportType, undefined);
  assert.equal(result.answers.travelReadiness, undefined);
  assert.equal(firstUnansweredStep(result.answers), 1);
});

test('new conditional questions cannot be skipped after editing duration', () => {
  let finder = applyFinderAnswer({ answers }, 'durationDays', '61');
  finder = applyFinderAnswer(finder, 'durationDays', '12');
  const next = getFinderQuestions(finder.answers)[firstUnansweredStep(finder.answers)];
  assert.equal(next.id, 'voaArrivalPort');
});

test('returning through the same finder result preserves the application and documents', () => {
  const result = evaluateVisaRoute(answers);
  const initial = applicationFromFinder({ data: {} }, answers, result);
  const inProgress = { ...initial, step: 3, docs: [{ type: 'passport' }], data: { ...initial.data, given_name: 'EXAMPLE' } };
  assert.equal(applicationFromFinder(inProgress, answers, result), null);
  const changed = { ...answers, passport: 'Japan' };
  assert.equal(applicationFromFinder(inProgress, changed, evaluateVisaRoute(changed)).step, 0);
});

test('travel readiness offers only Yes or No and explains funds outside the options', () => {
  const question = getFinderQuestions(answers).find((item) => item.id === 'travelReadiness');
  assert.deepEqual(question.options.map((option) => option.label), ['Yes', 'No']);
  assert.equal(question.requirements.length, 4);
  assert.match(question.requirements.join(' '), /no fixed minimum balance/);
});

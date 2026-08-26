import { describe, expect, it } from 'vitest';
import { crossFieldErrors, validateField, validateStage } from './validation.js';

const field = (overrides = {}) => ({
  name: 'email', label: 'Email address', type: 'email', required: true, ...overrides,
});

describe('field validation', () => {
  it('gives actionable required, email and phone messages', () => {
    expect(validateField(field(), {})).toBe('Enter email address.');
    expect(validateField(field(), { email: 'not-an-email' })).toMatch(/name@example.com/);
    expect(validateField(field({ name: 'mobile', label: 'Mobile', type: 'tel' }), { mobile: 'abc' }))
      .toMatch(/digits/);
  });

  it('rejects values that are absent from select options', () => {
    const select = field({
      name: 'kind', label: 'Application type', type: 'select',
      options: [{ value: 'evisa', label: 'e-Visa' }],
    });
    expect(validateField(select, { kind: 'invented' })).toMatch(/options listed/);
  });

  it('validates only visible stage fields', () => {
    const stage = {
      groups: [{ fields: [
        field({ name: 'always', label: 'Always', type: 'text' }),
        field({ name: 'conditional', label: 'Conditional', type: 'text', showIf: (data) => data.show === 'yes' }),
      ] }],
    };
    expect(validateStage(stage, {})).toEqual({ always: 'Enter always.' });
    expect(validateStage(stage, { show: 'yes' })).toHaveProperty('conditional');
  });
});

describe('cross-field validation', () => {
  it('rejects contradictory passport and travel dates', () => {
    expect(crossFieldErrors({
      date_of_issue: '2030-01-02', date_of_expiry: '2030-01-01',
    }).date_of_expiry).toMatch(/after the date it was issued/);
    expect(crossFieldErrors({
      expected_arrival_date: '2030-06-02', expected_departure_date: '2030-06-01',
    }).expected_departure_date).toMatch(/after the arrival date/);
  });

  it('checks six-month passport validity against arrival', () => {
    expect(crossFieldErrors({
      expected_arrival_date: '2030-06-01', date_of_expiry: '2030-10-01',
    }).date_of_expiry).toMatch(/six months/);
  });
});

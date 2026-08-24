import { describe, expect, it } from 'vitest';
import { DEMO_PERSONA } from '../data/demoPersona.js';
import { calculateTaxComparison } from '../domain/taxCalculator.js';

describe('AY 2026–27 illustrative tax comparison', () => {
  it('calculates the supported synthetic persona deterministically', () => {
    const result = calculateTaxComparison(DEMO_PERSONA.taxInputs);
    expect(result.status).toBe('ready');
    expect(result.grossIncome).toBe(1510000);
    expect(result.oldRegime.totalTax).toBe(205920);
    expect(result.newRegime.totalTax).toBe(99060);
    expect(result.lowerTaxRegime).toBe('new');
  });

  it('applies the new-regime rebate at ₹12 lakh taxable income', () => {
    const result = calculateTaxComparison({ salary: 1275000 });
    expect(result.newRegime.taxableIncome).toBe(1200000);
    expect(result.newRegime.slabTax).toBe(60000);
    expect(result.newRegime.rebate).toBe(60000);
    expect(result.newRegime.totalTax).toBe(0);
  });

  it('applies marginal relief immediately above the rebate threshold', () => {
    const result = calculateTaxComparison({ salary: 1275001 });
    expect(result.newRegime.taxableIncome).toBe(1200001);
    expect(result.newRegime.marginalRelief).toBe(59999);
    expect(result.newRegime.totalTax).toBe(1);
  });

  it('handles zero income and rounds inputs to whole rupees', () => {
    expect(calculateTaxComparison({}).newRegime.totalTax).toBe(0);
    expect(calculateTaxComparison({ salary: 100000.6 }).grossIncome).toBe(100001);
  });

  it('rejects negative or non-numeric money inputs', () => {
    expect(() => calculateTaxComparison({ salary: -1 })).toThrow('Salary');
    expect(() => calculateTaxComparison({ salary: 'not money' })).toThrow('Salary');
    expect(() => calculateTaxComparison(null)).toThrow('Tax input must be an object');
  });

  it('applies the salary deduction only against salary income', () => {
    const result = calculateTaxComparison({ savingsInterest: 100000 });
    expect(result.newRegime.standardDeduction).toBe(0);
    expect(result.newRegime.taxableIncome).toBe(100000);
  });

  it('automatically blocks income above ₹50 lakh because surcharge is not modelled', () => {
    const result = calculateTaxComparison({ salary: 5000001 });
    expect(result.status).toBe('blocked');
    expect(result.blockers[0]).toContain('₹50 lakh');
  });

  it.each(['capitalGains', 'businessOrProfessionalIncome', 'foreignAssetsOrIncome', 'specialRateIncome', 'totalIncomeAbove50Lakh'])(
    'blocks unsafe calculations for %s',
    (field) => {
      const result = calculateTaxComparison({ salary: 1000000, [field]: true });
      expect(result.status).toBe('blocked');
      expect(result.blockers).toHaveLength(1);
    },
  );
});

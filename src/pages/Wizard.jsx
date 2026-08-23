import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

const steps = [
  { id: 'personal', title: 'Personal Information', fields: [['pan', 'PAN', 'text', true], ['assessment_year', 'Assessment Year', 'select', true, ['2026-27', '2025-26']], ['name', 'Full Name', 'text', true], ['dob', 'Date of Birth', 'date', true]] },
  { id: 'income', title: 'Income Details', fields: [['gross_salary', 'Gross Salary', 'number', false], ['house_property', 'Income from House Property', 'number', false], ['business_income', 'Income from Business/Profession', 'number', false], ['other_sources', 'Income from Other Sources', 'number', false]] },
  { id: 'deductions', title: 'Deductions', fields: [['sec_80c', 'Section 80C Deductions', 'number', false], ['sec_80d', 'Section 80D Deductions', 'number', false], ['other_deductions', 'Other Deductions (Chapter VI-A)', 'number', false]] },
  { id: 'taxes_paid', title: 'Taxes Paid', fields: [['tds', 'TDS / TCS', 'number', false], ['advance_tax', 'Advance Tax', 'number', false], ['self_assessment', 'Self Assessment Tax', 'number', false]] },
  { id: 'review', title: 'Computation & Review' }
];

export default function Wizard() {
  const { state, updateState, updateData } = useStore();
  const navigate = useNavigate();
  
  if (state.submitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center bg-white border border-border shadow-sm rounded mt-12">
        <h1 className="text-3xl font-bold mb-4 text-success">ITR Submitted Successfully (Demo)</h1>
        <p className="text-xl mb-6">Your demo e-Filing Acknowledgement Number is <strong className="font-mono text-primary text-2xl tracking-wider block mt-2">ITR{Math.floor(Math.random()*1000000000)}</strong></p>
        <p className="text-text-secondary mb-8">This is a simulated submission. No real data was sent to the Income Tax Department.</p>
        <div className="flex gap-4 justify-center">
          <a href="https://eportal.incometax.gov.in/iec/foservices/#/pre-login/eVerifyReturn-bl" className="bg-primary text-white px-6 py-2 rounded-sm font-bold hover:bg-primary-dark transition">e-Verify Return (Official)</a>
          <button onClick={() => navigate('/')} className="border-2 border-primary text-primary px-6 py-2 rounded-sm font-bold hover:bg-primary-light transition">Return to Home</button>
        </div>
      </div>
    );
  }

  const step = steps[state.step];
  
  const handleNext = (e) => {
    e.preventDefault();
    if (state.step < steps.length - 1) {
      updateState({ step: state.step + 1 });
      window.scrollTo(0, 0);
    } else {
      updateState({ submitted: true });
    }
  };
  
  const handleBack = () => {
    if (state.step > 0) {
      updateState({ step: state.step - 1 });
      window.scrollTo(0, 0);
    }
  };

  const calculateTax = () => {
    const grossIncome = (Number(state.data.gross_salary) || 0) + (Number(state.data.house_property) || 0) + (Number(state.data.business_income) || 0) + (Number(state.data.other_sources) || 0);
    const totalDeductions = (Number(state.data.sec_80c) || 0) + (Number(state.data.sec_80d) || 0) + (Number(state.data.other_deductions) || 0);
    const taxableIncome = Math.max(0, grossIncome - totalDeductions);
    const taxesPaid = (Number(state.data.tds) || 0) + (Number(state.data.advance_tax) || 0) + (Number(state.data.self_assessment) || 0);
    
    // Very simple demo tax calculation (not legally authoritative)
    let tax = 0;
    if (taxableIncome > 500000) {
      tax = taxableIncome * 0.1; // Demo mock flat tax
    }
    
    const balance = tax - taxesPaid;
    
    return { grossIncome, totalDeductions, taxableIncome, taxesPaid, tax, balance };
  };

  const Progress = () => (
    <div className="mb-8">
      <p className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-4">Step {state.step + 1} of {steps.length}</p>
      <div className="flex gap-2 text-sm overflow-x-auto pb-4">
        {steps.map((s, i) => (
          <div key={s.id} className={`whitespace-nowrap pb-2 border-b-2 ${i === state.step ? 'border-primary text-primary font-bold' : i < state.step ? 'border-success text-success' : 'border-border text-text-secondary'}`}>
            {i < state.step ? '✓ ' : ''}{s.title}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 md:p-12 border border-border rounded-lg shadow-sm mt-8 mb-16">
      <Progress />
      <h1 className="text-3xl font-serif font-bold mb-2 text-primary">{step.title}</h1>
      <p className="text-text-secondary mb-8 pb-4 border-b border-border">This is a demo workflow. Do not enter real taxpayer data.</p>
      
      <form onSubmit={handleNext}>
        {step.id !== 'review' && (
          <div className="space-y-6">
            {step.fields.map(([name, label, type, required, options]) => (
              <div key={name}>
                <label htmlFor={name} className="block font-bold mb-1">
                  {label} {required && <span className="text-error ml-1 text-sm font-normal">*</span>}
                </label>
                {type === 'select' ? (
                  <select 
                    id={name} 
                    required={required} 
                    className="input-field"
                    value={state.data[name] || ''}
                    onChange={(e) => updateData(name, e.target.value)}
                  >
                    <option value="">Choose an option</option>
                    {options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input 
                    id={name} 
                    type={type} 
                    required={required} 
                    min={type === 'number' ? '0' : undefined}
                    className={`input-field ${name === 'pan' ? 'uppercase' : ''}`}
                    value={state.data[name] || ''}
                    onChange={(e) => updateData(name, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
        
        {step.id === 'review' && (
          <div className="space-y-6">
            <div className="bg-yellow-50 border-l-4 border-secondary p-4 mb-6">
              <h3 className="font-bold text-yellow-900">Demo Calculation Only</h3>
              <p className="text-sm text-yellow-800">The tax calculation shown below is an estimate for demo purposes and is not legally authoritative.</p>
            </div>
            
            <div className="bg-background p-6 rounded text-sm grid grid-cols-2 gap-4 border border-border">
              {Object.entries(state.data).map(([k, v]) => {
                if (!v) return null;
                return (
                  <div key={k} className="border-b border-border pb-2">
                    <span className="block text-text-secondary text-xs uppercase mb-1">{k.replace(/_/g, ' ')}</span>
                    <strong className="break-words">{v}</strong>
                  </div>
                );
              })}
            </div>
            
            <h3 className="font-bold text-xl mt-8 mb-4 border-b pb-2">Tax Computation Summary</h3>
            {(() => {
              const calc = calculateTax();
              return (
                <div className="space-y-4">
                  <div className="flex justify-between"><span className="text-text-secondary">Gross Total Income:</span> <span className="font-bold">₹ {calc.grossIncome}</span></div>
                  <div className="flex justify-between"><span className="text-text-secondary">Total Deductions:</span> <span className="font-bold">₹ {calc.totalDeductions}</span></div>
                  <div className="flex justify-between text-lg"><span className="font-bold">Total Taxable Income:</span> <span className="font-bold text-primary">₹ {calc.taxableIncome}</span></div>
                  <div className="flex justify-between"><span className="text-text-secondary">Total Tax Computed:</span> <span className="font-bold">₹ {calc.tax}</span></div>
                  <div className="flex justify-between"><span className="text-text-secondary">Taxes Already Paid:</span> <span className="font-bold">₹ {calc.taxesPaid}</span></div>
                  <div className="flex justify-between text-xl border-t pt-4 mt-2">
                    <span className="font-bold">{calc.balance > 0 ? 'Tax Payable:' : 'Refund Due:'}</span>
                    <span className={`font-bold ${calc.balance > 0 ? 'text-error' : 'text-success'}`}>₹ {Math.abs(calc.balance)}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
        
        <div className="mt-12 flex gap-4 pt-6 border-t border-border">
          {state.step > 0 && <button type="button" onClick={handleBack} className="border-2 border-primary text-primary px-6 py-2 rounded-sm font-bold hover:bg-primary-light transition">Back</button>}
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded-sm font-bold hover:bg-primary-dark transition ml-auto">{state.step === steps.length - 1 ? 'Submit Return (Demo)' : 'Save and Continue'}</button>
        </div>
      </form>
    </div>
  );
}

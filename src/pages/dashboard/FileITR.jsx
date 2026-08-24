import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store';
import { useNavigate, useParams, Navigate } from 'react-router-dom';

const getStepsForPersona = (entityType) => {
  const commonStart = [
    { id: 'assessment-year', title: 'Assessment Year', type: 'select', field: 'assessment_year', options: ['2026-27', '2025-26'] },
    { id: 'filing-status', title: 'Filing Status', type: 'select', field: 'filing_status', options: ['Original', 'Revised', 'Belated'] }
  ];
  const commonEnd = [
    { id: 'computation', title: 'Tax Computation', type: 'custom' },
    { id: 'preview', title: 'Preview Return', type: 'custom' },
    { id: 'validation', title: 'Validation', type: 'custom' },
    { id: 'submit', title: 'Submit ITR', type: 'custom' },
    { id: 'verify', title: 'e-Verify', type: 'custom' },
    { id: 'acknowledgement', title: 'Acknowledgement', type: 'custom' }
  ];

  if (entityType === 'Company') {
    return [
      ...commonStart,
      { id: 'select-form', title: 'ITR Form', type: 'select', field: 'itr_type', options: ['ITR-6', 'ITR-7'] },
      { id: 'company-info', title: 'Company Information', type: 'form', fields: [['company_name', 'Company Name', 'text'], ['pan', 'PAN', 'text']] },
      { id: 'business', title: 'Business Receipts', type: 'form', fields: [['business_receipts', 'Gross Business Receipts', 'number'], ['net_profit', 'Net Profit (before tax)', 'number']] },
      { id: 'capital-gains', title: 'Capital Gains', type: 'form', fields: [['stcg', 'Short Term Capital Gains', 'number']] },
      { id: 'deductions', title: 'Deductions', type: 'form', fields: [['sec_80g', '80G (Donations)', 'number']] },
      { id: 'taxes-paid', title: 'Taxes Paid', type: 'form', fields: [['advance_tax', 'Advance Tax', 'number'], ['tds', 'TDS', 'number']] },
      ...commonEnd
    ];
  } else if (entityType === 'Firm') {
    return [
      ...commonStart,
      { id: 'select-form', title: 'ITR Form', type: 'select', field: 'itr_type', options: ['ITR-5'] },
      { id: 'firm-info', title: 'Firm Information', type: 'form', fields: [['firm_name', 'Firm Name', 'text'], ['pan', 'PAN', 'text']] },
      { id: 'business', title: 'Professional Receipts', type: 'form', fields: [['professional_receipts', 'Gross Professional Receipts', 'number'], ['net_profit', 'Net Profit (before tax)', 'number']] },
      { id: 'partners', title: 'Partner Details', type: 'form', fields: [['partner_remuneration', 'Remuneration to Partners', 'number']] },
      { id: 'taxes-paid', title: 'Taxes Paid', type: 'form', fields: [['advance_tax', 'Advance Tax', 'number'], ['tds', 'TDS', 'number']] },
      ...commonEnd
    ];
  }

  // Default Individual
  return [
    ...commonStart,
    { id: 'select-form', title: 'ITR Form', type: 'select', field: 'itr_type', options: ['ITR-1', 'ITR-2', 'ITR-3', 'ITR-4'] },
    { id: 'personal-information', title: 'Personal Information', type: 'form', fields: [['first_name', 'First Name', 'text'], ['last_name', 'Last Name', 'text'], ['pan', 'PAN', 'text'], ['dob', 'Date of Birth', 'date']] },
    { id: 'salary', title: 'Income from Salary', type: 'form', fields: [['gross_salary', 'Gross Salary', 'number'], ['exempt_allowances', 'Exempt Allowances', 'number']] },
    { id: 'house-property', title: 'House Property', type: 'form', fields: [['house_property_income', 'Income from House Property', 'number'], ['home_loan_interest', 'Interest on Home Loan', 'number']] },
    { id: 'business', title: 'Business / Profession', type: 'form', fields: [['business_income', 'Gross Business Income', 'number']] },
    { id: 'capital-gains', title: 'Capital Gains', type: 'form', fields: [['stcg', 'Short Term Capital Gains', 'number'], ['ltcg', 'Long Term Capital Gains', 'number']] },
    { id: 'other-sources', title: 'Other Sources', type: 'form', fields: [['interest_income', 'Interest Income', 'number'], ['dividend_income', 'Dividend Income', 'number']] },
    { id: 'deductions', title: 'Deductions (Chapter VI-A)', type: 'form', fields: [['sec_80c', '80C (LIC, PPF, etc.)', 'number'], ['sec_80d', '80D (Health Insurance)', 'number'], ['sec_80tta', '80TTA (Savings Interest)', 'number']] },
    { id: 'taxes-paid', title: 'Taxes Paid', type: 'form', fields: [['tds_salary', 'TDS on Salary', 'number'], ['tds_other', 'TDS on Other Income', 'number'], ['advance_tax', 'Advance Tax', 'number'], ['self_assessment_tax', 'Self Assessment Tax', 'number']] },
    ...commonEnd
  ];
};

export default function FileITR() {
  const { state, updateItrDraft, updateItrData, submitItr } = useStore();
  const navigate = useNavigate();
  const { stepId } = useParams();
  const formTopRef = useRef(null);
  const [draftSavedMessage, setDraftSavedMessage] = useState('');
  
  if (!stepId) {
    return <Navigate to="/itr/assessment-year" replace />;
  }

  const draft = state.itrDraft;
  const entityType = state.auth.user.entity_type;
  const steps = getStepsForPersona(entityType);
  const currentStepIndex = Math.max(0, steps.findIndex(s => s.id === stepId));
  const currentStep = steps[currentStepIndex];

  // Sync draft step to the URL index if needed
  useEffect(() => {
    if (draft.step !== currentStepIndex) {
      updateItrDraft({ step: currentStepIndex });
      
      // Smooth scroll only the form container into view, not the whole page
      if (formTopRef.current) {
        formTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [currentStepIndex, draft.step, updateItrDraft]);

  // Hook into updateItrData to show save indicator
  const handleDataChange = (name, value) => {
    updateItrData(name, value);
    setDraftSavedMessage(`Draft auto-saved at ${new Date().toLocaleTimeString()}`);
    // Clear message after 3 seconds
    setTimeout(() => setDraftSavedMessage(''), 3000);
  };

  const calculateTaxes = () => {
    const d = draft.data;
    const num = (val) => Number(val) || 0;
    const entityType = state.auth.user.entity_type;
    
    if (entityType === 'Company') {
      const grossTotalIncome = num(d.net_profit) + num(d.stcg);
      const totalDeductions = num(d.sec_80g);
      const totalTaxableIncome = Math.max(0, grossTotalIncome - totalDeductions);
      const tax = totalTaxableIncome * 0.25; // 25% corporate tax demo
      const cess = tax * 0.04;
      const totalTaxLiability = tax + cess;
      const totalTaxesPaid = num(d.tds) + num(d.advance_tax);
      const balance = totalTaxLiability - totalTaxesPaid;
      return { grossTotalIncome, totalDeductions, totalTaxableIncome, totalTaxLiability, totalTaxesPaid, balance };
    }
    
    if (entityType === 'Firm') {
      const grossTotalIncome = num(d.net_profit); // Remuneration handled in net profit for demo
      const totalDeductions = 0;
      const totalTaxableIncome = Math.max(0, grossTotalIncome - totalDeductions);
      const tax = totalTaxableIncome * 0.30; // 30% firm tax demo
      const cess = tax * 0.04;
      const totalTaxLiability = tax + cess;
      const totalTaxesPaid = num(d.tds) + num(d.advance_tax);
      const balance = totalTaxLiability - totalTaxesPaid;
      return { grossTotalIncome, totalDeductions, totalTaxableIncome, totalTaxLiability, totalTaxesPaid, balance };
    }

    // Individual
    const salaryIncome = Math.max(0, num(d.gross_salary) - num(d.exempt_allowances) - 50000); // Std deduction 50k
    const houseIncome = num(d.house_property_income) - Math.min(200000, num(d.home_loan_interest));
    const businessIncome = num(d.business_income);
    const capitalGains = num(d.stcg) + num(d.ltcg);
    const otherIncome = num(d.interest_income) + num(d.dividend_income);
    
    const grossTotalIncome = salaryIncome + houseIncome + businessIncome + capitalGains + otherIncome;
    
    const totalDeductions = Math.min(150000, num(d.sec_80c)) + num(d.sec_80d) + Math.min(10000, num(d.sec_80tta));
    const totalTaxableIncome = Math.max(0, grossTotalIncome - totalDeductions);
    
    let tax = 0;
    if (totalTaxableIncome > 500000) {
      tax = (totalTaxableIncome - 500000) * 0.2; // demo flat 20% over 5L
    }
    const cess = tax * 0.04;
    const totalTaxLiability = tax + cess;
    
    const totalTaxesPaid = num(d.tds_salary) + num(d.tds_other) + num(d.advance_tax) + num(d.self_assessment_tax);
    const balance = totalTaxLiability - totalTaxesPaid;

    return { grossTotalIncome, totalDeductions, totalTaxableIncome, totalTaxLiability, totalTaxesPaid, balance };
  };

  const handleNext = (e) => {
    e?.preventDefault();
    if (currentStep.id === 'submit') {
      navigate('/itr/' + steps[currentStepIndex + 1].id);
      return;
    }
    
    if (currentStep.id === 'verify') {
      const ackNum = 'ITR' + Math.floor(Math.random()*1000000000);
      submitItr({ ay: draft.assessment_year, ack: ackNum, form: draft.itr_type, status: 'e-Verified', dateFiled: new Date().toISOString().split('T')[0] });
      updateItrDraft({ ackNumber: ackNum });
      navigate('/itr/acknowledgement');
      return;
    }

    if (currentStepIndex < steps.length - 1) {
      navigate('/itr/' + steps[currentStepIndex + 1].id);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      navigate('/itr/' + steps[currentStepIndex - 1].id);
    }
  };

  const Sidebar = () => (
    <div className="w-full md:w-64 shrink-0 bg-white border border-border p-4 rounded-sm hidden lg:block h-fit">
      <h3 className="font-bold text-lg mb-4 text-primary border-b pb-2">ITR Progress</h3>
      <ul className="space-y-2">
        {steps.map((s, i) => (
          <li key={s.id} className={`text-sm flex items-center ${i === currentStepIndex ? 'font-bold text-primary' : i < currentStepIndex ? 'text-success' : 'text-gray-400'}`}>
            <span className="w-5">{i < currentStepIndex ? '✓' : i === currentStepIndex ? '●' : '○'}</span>
            {s.title}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto" ref={formTopRef}>
      <Sidebar />
      <div className="flex-1 bg-white p-6 md:p-8 border border-border rounded-sm shadow-sm min-h-[600px] flex flex-col">
        
        <div className="mb-6 pb-4 border-b flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif font-bold text-primary">{currentStep.title}</h1>
            <p className="text-sm text-text-secondary">Step {currentStepIndex + 1} of {steps.length}</p>
          </div>
          <div className="text-right">
            <div className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-bold mb-1 inline-block">Demo Mode</div>
            {draftSavedMessage && <div className="text-xs text-success animate-pulse">{draftSavedMessage}</div>}
          </div>
        </div>

        <form onSubmit={handleNext} className="flex-1 flex flex-col">
          <div className="flex-1">
          {currentStep.type === 'select' && (
            <div className="space-y-4">
              <label className="block font-bold">Please select {currentStep.title.toLowerCase()}:</label>
              <select 
                className="input-field max-w-md"
                value={draft[currentStep.field] || ''}
                onChange={(e) => updateItrDraft({ [currentStep.field]: e.target.value })}
                required
              >
                <option value="">Select...</option>
                {currentStep.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          )}

          {currentStep.type === 'form' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentStep.fields.map(([name, label, type]) => (
                <div key={name}>
                  <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
                  <input 
                    type={type} 
                    className="input-field"
                    value={draft.data[name] || ''}
                    onChange={(e) => handleDataChange(name, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          {currentStep.id === 'computation' && (() => {
            const c = calculateTaxes();
            return (
              <div className="space-y-4">
                <div className="flex justify-between p-3 border-b"><span className="text-text-secondary">Gross Total Income:</span> <span className="font-bold">₹ {c.grossTotalIncome}</span></div>
                <div className="flex justify-between p-3 border-b"><span className="text-text-secondary">Total Deductions:</span> <span className="font-bold">₹ {c.totalDeductions}</span></div>
                <div className="flex justify-between p-3 border-b bg-gray-50"><span className="font-bold">Total Taxable Income:</span> <span className="font-bold text-primary text-lg">₹ {c.totalTaxableIncome}</span></div>
                <div className="flex justify-between p-3 border-b"><span className="text-text-secondary">Total Tax Liability:</span> <span className="font-bold">₹ {c.totalTaxLiability}</span></div>
                <div className="flex justify-between p-3 border-b"><span className="text-text-secondary">Total Taxes Paid:</span> <span className="font-bold">₹ {c.totalTaxesPaid}</span></div>
                <div className={`flex justify-between p-4 border rounded ${c.balance > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                  <span className="font-bold text-lg">{c.balance > 0 ? 'Tax Payable:' : 'Refund Due:'}</span>
                  <span className={`font-bold text-xl ${c.balance > 0 ? 'text-error' : 'text-success'}`}>₹ {Math.abs(c.balance)}</span>
                </div>
              </div>
            );
          })()}

          {currentStep.id === 'preview' && (
            <div className="space-y-4 text-sm">
              <p className="font-bold">Review your filled details:</p>
              <div className="grid grid-cols-2 gap-4 border p-4 rounded">
                <div><span className="text-gray-500 block">Name</span><span className="font-bold">{draft.data.company_name || draft.data.firm_name || `${draft.data.first_name} ${draft.data.last_name}`}</span></div>
                <div><span className="text-gray-500 block">PAN</span><span className="font-bold uppercase">{draft.data.pan}</span></div>
                <div><span className="text-gray-500 block">Assessment Year</span><span className="font-bold">{draft.assessment_year}</span></div>
                <div><span className="text-gray-500 block">Form</span><span className="font-bold">{draft.itr_type}</span></div>
              </div>
              <p className="text-gray-500 italic mt-4">For the purpose of this demo, we assume all entered information is correct and skip detailed preview rendering.</p>
            </div>
          )}

          {currentStep.id === 'validation' && (
            <div className="p-6 bg-green-50 border border-green-200 rounded text-center">
              <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-success">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="font-bold text-success text-xl mb-2">Validation Successful</h3>
              <p className="text-green-800">No errors found in your return. You can proceed to submit.</p>
            </div>
          )}

          {currentStep.id === 'submit' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border-l-4 border-secondary p-4">
                <p className="text-yellow-800 font-medium">By clicking submit, you are generating a demo submission. This does not submit data to the real Income Tax Department.</p>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="declare" required className="w-5 h-5" />
                <label htmlFor="declare">I declare that the information provided is true and correct (Demo).</label>
              </div>
            </div>
          )}

          {currentStep.id === 'verify' && (
            <div className="space-y-6">
              <h3 className="font-bold text-lg">Select Verification Method</h3>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 border rounded cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="verify" required className="mt-1" />
                  <div>
                    <span className="font-bold block">Generate Aadhaar OTP</span>
                    <span className="text-sm text-gray-500">OTP will be sent to the mobile number registered with Aadhaar.</span>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 border rounded cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="verify" className="mt-1" />
                  <div>
                    <span className="font-bold block">Through Net Banking</span>
                    <span className="text-sm text-gray-500">Log in to your net banking portal to verify.</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {currentStep.id === 'acknowledgement' && (
            <div className="text-center py-8">
              <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-success">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h2 className="text-2xl font-bold text-success mb-2">Return e-Verified Successfully</h2>
              <p className="mb-6 text-gray-600">Your mock return has been filed and verified.</p>
              <div className="bg-gray-100 inline-block p-4 rounded mb-8">
                <span className="block text-sm text-gray-500 mb-1">Acknowledgement Number</span>
                <span className="font-mono font-bold text-xl text-primary">{draft.ackNumber || 'ITR123456789'}</span>
              </div>
              <div>
                <button type="button" onClick={() => navigate('/dashboard')} className="btn-primary">Go to Dashboard</button>
              </div>
            </div>
          )}

          </div> {/* End of form flex-1 body */}
          {currentStep.id !== 'acknowledgement' && (
            <div className="mt-8 pt-4 border-t flex justify-between">
              <button 
                type="button" 
                onClick={handleBack}
                className={`btn-secondary min-w-[120px] ${currentStepIndex === 0 ? 'invisible' : ''}`}
              >
                Back
              </button>
              <button type="submit" className="bg-primary text-white px-6 py-2 rounded-sm font-bold hover:bg-primary-dark transition min-w-[150px]">
                {currentStep.id === 'submit' ? 'Submit' : currentStep.id === 'verify' ? 'Verify Now' : 'Save & Next'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

const steps = [
  { id: 'mission', title: 'Visa type', fields: [['application_type', 'Application type', 'select', true, ['evisa', 'regular']], ['visa_category', 'Visa category', 'select', true, ['tourist', 'business', 'medical', 'medical-attendant']], ['country_of_application', 'Country where you are applying', 'text', true], ['purpose_of_visit', 'Purpose of visit', 'text', true]] },
  { id: 'applicant', title: 'Personal details', fields: [['given_name', 'Given name', 'text', true], ['surname', 'Family name / surname', 'text', true], ['date_of_birth', 'Date of birth', 'date', true], ['nationality', 'Nationality', 'text', true], ['marital_status', 'Marital status', 'select', true, ['single', 'married', 'other']]] },
  { id: 'passport', title: 'Passport details', fields: [['passport_number', 'Passport number', 'text', true], ['country_of_passport', 'Country of passport', 'text', true], ['date_of_issue', 'Date of issue', 'date', true], ['date_of_expiry', 'Date of expiry', 'date', true]] },
  { id: 'travel', title: 'Travel details', fields: [['expected_arrival_date', 'Expected arrival date', 'date', true], ['expected_departure_date', 'Expected departure date', 'date', true], ['port_of_arrival', 'Port of arrival', 'text', true], ['places_to_visit', 'Places you plan to visit', 'text', true], ['address_in_india', 'Address in India', 'text', true]] },
  { id: 'documents', title: 'Documents' },
  { id: 'review', title: 'Review' }
];

export default function Wizard() {
  const { state, updateState, updateData, addDocument } = useStore();
  const navigate = useNavigate();
  
  if (state.submitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center bg-white border border-border shadow-sm rounded mt-12">
        <h1 className="text-3xl font-bold mb-4">Application Submitted (Demo)</h1>
        <p className="text-xl mb-6">Your demo application ID is <strong className="font-mono text-primary text-2xl tracking-wider block mt-2">DEMO{Math.floor(Math.random()*1000000)}</strong></p>
        <p className="text-text-secondary mb-8">Save this ID to check your status later.</p>
        <button onClick={() => navigate('/')} className="btn-primary">Return to Home</button>
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

  const handleDocUpload = (e, type) => {
    if (e.target.files[0]) {
      addDocument(type, e.target.files[0].name);
    }
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
    <div className="max-w-3xl mx-auto bg-white p-6 md:p-12 border border-border rounded-lg shadow-sm">
      <Progress />
      <h1 className="text-3xl font-serif font-bold mb-2">{step.title}</h1>
      <p className="text-text-secondary mb-8 pb-4 border-b border-border">Your changes are saved automatically on this device.</p>
      
      <form onSubmit={handleNext}>
        {step.id !== 'documents' && step.id !== 'review' && (
          <div className="space-y-6">
            {step.fields.map(([name, label, type, required, options]) => (
              <div key={name}>
                <label htmlFor={name} className="block font-bold mb-1">
                  {label} {required && <span className="text-red-600 ml-1 text-sm font-normal">Required</span>}
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
                    {options.map(o => <option key={o} value={o}>{o.replace('-', ' ')}</option>)}
                  </select>
                ) : (
                  <input 
                    id={name} 
                    type={type} 
                    required={required} 
                    className="input-field"
                    value={state.data[name] || ''}
                    onChange={(e) => updateData(name, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
        
        {step.id === 'documents' && (
          <div className="space-y-6">
            {[['passport', 'Passport'], ['photograph', 'Photograph']].map(([type, label]) => {
              const doc = state.docs.find(d => d.type === type);
              return (
                <div key={type} className="flex justify-between items-center p-4 border border-border rounded">
                  <div>
                    <strong className="block text-lg">{doc ? '✓' : '○'} {label}</strong>
                    <p className="text-sm text-text-secondary">{doc ? `${doc.name} — uploaded` : 'Required for this demo'}</p>
                  </div>
                  <label className="btn-secondary cursor-pointer">
                    {doc ? 'Replace' : 'Upload'}
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleDocUpload(e, type)} />
                  </label>
                </div>
              );
            })}
          </div>
        )}
        
        {step.id === 'review' && (
          <div className="space-y-6">
            <p className="font-bold">Please review your information carefully before submitting the fictional application.</p>
            <div className="bg-background p-6 rounded text-sm grid grid-cols-2 gap-4">
              {Object.entries(state.data).map(([k, v]) => (
                <div key={k} className="border-b border-border pb-2">
                  <span className="block text-text-secondary text-xs uppercase mb-1">{k.replace(/_/g, ' ')}</span>
                  <strong className="break-words">{v || '-'}</strong>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-12 flex gap-4 pt-6 border-t border-border">
          {state.step > 0 && <button type="button" onClick={handleBack} className="btn-secondary">Back</button>}
          <button type="submit" className="btn-primary ml-auto">{state.step === steps.length - 1 ? 'Submit Application' : 'Save and continue'}</button>
        </div>
      </form>
    </div>
  );
}

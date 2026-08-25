import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import ContextHelp from '../components/ContextHelp';
import SmartDocuments from '../components/SmartDocuments';

// Generate dynamic steps based on the application type (evisa, afghan, voa, regular)
const getDynamicSteps = (appType) => {
  const isVoa = appType === 'voa';
  const isAfghan = appType === 'regular' || appType === 'afghan'; // simplified check

  const baseSteps = [
    { id: 'applicant', title: 'Personal details', fields: [
      ['country_of_application', 'Country where you are applying', 'text', true, null, 'The country where you currently reside and are applying from.'], 
      ['given_name', 'Given name', 'text', true], 
      ['surname', 'Family name / surname', 'text', true, null, 'Enter your name exactly as it appears in the Machine Readable Zone of your passport.'], 
      ['date_of_birth', 'Date of birth', 'date', true], 
      ...(isAfghan ? [['tazkira_number', 'National ID (Tazkira) Number', 'text', true]] : []),
      ['marital_status', 'Marital status', 'select', true, ['single', 'married', 'other']]
    ] },
    { id: 'passport', title: 'Passport details', fields: [
      ['passport_number', 'Passport number', 'text', true, null, 'Usually a 9-character alphanumeric string on the top right of your passport data page.'], 
      ['date_of_issue', 'Date of issue', 'date', true], 
      ['date_of_expiry', 'Date of expiry', 'date', true]
    ] }
  ];

  // If VoA, we dramatically cut down the required steps
  if (isVoa) {
    baseSteps.push(
      { id: 'travel', title: 'Arrival Details', fields: [
        ['expected_arrival_date', 'Expected arrival date', 'date', true], 
        ['port_of_arrival', 'Designated Port of arrival', 'select', true, ['Bangalore', 'Chennai', 'Delhi', 'Hyderabad', 'Kolkata', 'Mumbai'], 'You must arrive at one of the 6 designated airports for Visa on Arrival.'], 
        ['address_in_india', 'Hotel / Address in India', 'text', true]
      ] },
      { id: 'review', title: 'Generate VoA Form' }
    );
    return baseSteps; // Stop here, no docs needed for VoA online
  }

  // For e-Visa and Regular, we need the exhaustive fields
  baseSteps.push(
    { id: 'family_employment', title: 'Family & Employment', fields: [
      ['parents_nationality', 'Parents\' Nationality', 'text', true],
      ['pakistani_descent', 'Are your parents/grandparents of Pakistani descent?', 'select', true, ['yes', 'no']],
      ['occupation', 'Current Occupation', 'text', true],
      ['employer_name', 'Employer Name', 'text', true]
    ] },
    { id: 'travel', title: 'Travel History', fields: [
      ['expected_arrival_date', 'Expected arrival date', 'date', true], 
      ['expected_departure_date', 'Expected departure date', 'date', true], 
      ['port_of_arrival', 'Port of arrival', 'text', true, null, 'The first airport or seaport you will arrive at in India.'], 
      ['places_to_visit', 'Places you plan to visit', 'text', true], 
      ['address_in_india', 'Address in India', 'text', true],
      ['visited_saarc', 'Have you visited any SAARC countries in the last 3 years?', 'select', true, ['yes', 'no'], 'SAARC includes Afghanistan, Bangladesh, Bhutan, Maldives, Nepal, Pakistan, Sri Lanka']
    ] },
    { id: 'documents', title: 'Documents' },
    { id: 'review', title: 'Review' }
  );

  return baseSteps;
};

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

  const steps = getDynamicSteps(state.data.application_type);
  const step = steps[state.step];
  
  const fillDemoData = () => {
    const demoPayload = {
      country_of_application: 'United States',
      given_name: 'Sam',
      surname: 'Altman',
      date_of_birth: '1985-04-22',
      marital_status: 'single',
      passport_number: 'P12345678',
      date_of_issue: '2020-01-01',
      date_of_expiry: '2030-01-01',
      expected_arrival_date: '2026-10-01',
      expected_departure_date: '2026-10-15',
      port_of_arrival: 'Delhi',
      places_to_visit: 'Delhi, Agra, Jaipur',
      address_in_india: 'Taj Palace Hotel, New Delhi',
      tazkira_number: '123-456-789',
      parents_nationality: 'United States',
      pakistani_descent: 'no',
      occupation: 'CEO',
      employer_name: 'OpenAI',
      visited_saarc: 'no',
      ...state.data
    };
    
    Object.entries(demoPayload).forEach(([k, v]) => updateData(k, v));
  };
  
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
    <div className="mb-10 border-b border-border pb-6">
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-2xl font-serif font-bold text-gray-900">{step?.title}</h2>
        <div className="flex items-center gap-4">
          <button type="button" onClick={fillDemoData} className="text-xs bg-amber-100 text-amber-800 px-3 py-1 font-bold rounded-full hover:bg-amber-200 transition">
            Fill Demo Data
          </button>
          <span className="text-sm font-bold text-text-secondary uppercase tracking-widest">Step {state.step + 1} of {steps.length}</span>
        </div>
      </div>
      <div className="flex text-sm overflow-x-auto gap-6 pb-4">
        {steps.map((s, i) => (
          <div key={s.id} className="min-w-fit">
            <div className={`h-1.5 w-full rounded-full mb-2 transition-colors ${i === state.step ? 'bg-[#0b2540]' : i < state.step ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            <div className={`text-xs whitespace-nowrap px-1 ${i === state.step ? 'text-[#0b2540] font-bold' : i < state.step ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
              {i < state.step ? <span className="text-green-600 mr-1">✓</span> : ''}{s.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 md:p-12 border border-border rounded-lg shadow-sm mb-12">
      <Progress />
      <p className="text-text-secondary mb-8 pb-4 border-b border-border">Your changes are saved automatically on this device.</p>
      
      <form onSubmit={handleNext}>
        {step && step.id !== 'documents' && step.id !== 'review' && (
          <div className="space-y-6">
            {step.fields.map(([name, label, type, required, options, helpText]) => (
              <div key={name} className="max-w-xl">
                <label htmlFor={name} className="block font-bold mb-1 text-gray-900">
                  {label} 
                  {required && <span className="text-red-600 ml-1 text-sm font-normal">*</span>}
                  {helpText && <ContextHelp text={helpText} />}
                </label>
                {type === 'select' ? (
                  <select 
                    id={name} 
                    required={required} 
                    className="input-field w-full"
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
                    className="input-field w-full"
                    value={state.data[name] || ''}
                    onChange={(e) => updateData(name, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
        
        {step && step.id === 'documents' && (
          <div className="mb-8">
            <SmartDocuments />
          </div>
        )}
        
        {step && step.id === 'review' && (
          <div className="space-y-6">
            <p className="font-bold">Please review your information carefully before generating the application.</p>
            <div className="bg-background p-6 rounded text-sm grid grid-cols-1 md:grid-cols-2 gap-4">
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

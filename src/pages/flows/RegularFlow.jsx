import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import FlowGuide from '../../components/FlowGuide';

export default function RegularFlow() {
  const navigate = useNavigate();
  const { state, updateState } = useStore();
  const routedByFinder = state.data?.application_type === 'regular' && Boolean(state.data?.eligibility_ruleset_id);
  const startPreparation = () => {
    if (state.data.visa_category === 'unconfirmed') {
      updateState({ data: { ...state.data, visa_category: '' } });
    }
    navigate('/apply');
  };

  return (
    <FlowGuide title="Regular / paper visa" intro="Apply through the Indian Embassy or Consulate responsible for where you live. Requirements, fees and processing times vary by location and visa category.">
      <ol className="divide-y divide-border border-y border-border">
        {[
          ['Find your Embassy or Consulate', 'Check its visa categories and the authorized application centre for your place of residence.'],
          ['Gather your documents', 'Prepare your passport, photo, residence evidence and documents for your purpose of travel. Follow the local checklist for translations and physical copies.'],
          ['Apply and attend your appointment', 'Complete the official form, print and sign it, and follow the local instructions for payment, passport submission and any interview or biometrics.'],
        ].map(([title, detail], index) => (
          <li key={title} className="flex gap-4 py-6">
            <span className="text-sm font-semibold text-secondary-accent">0{index + 1}</span>
            <div><h2 className="mb-2 font-semibold text-primary">{title}</h2><p className="text-sm leading-relaxed text-text-secondary">{detail}</p></div>
          </li>
        ))}
      </ol>
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <button type="button" onClick={routedByFinder ? startPreparation : () => navigate('/guide/visa-finder')} className="btn-primary rounded-md">{routedByFinder ? 'Prepare my application' : 'Find my visa route'} →</button>
        <a href="https://indianvisaonline.gov.in/visa/" target="_blank" rel="noreferrer" className="text-sm text-primary underline">Official visa portal ↗</a>
      </div>
    </FlowGuide>
  );
}

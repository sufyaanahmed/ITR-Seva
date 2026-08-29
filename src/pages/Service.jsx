import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Service({ type = 'evisa' }) {
  const isRegular = type === 'regular';
  const label = isRegular ? 'Regular / Paper Visa' : 'e-Visa';
  const navigate = useNavigate();

  const reviewRoute = () => {
    // Do not seed a category here: nationality, purpose, passport, and route gates are not known.
    navigate(isRegular ? '/flow/regular' : '/guide/visa-finder');
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <p className="uppercase tracking-widest text-sm text-amber-700 mb-2 font-bold">Educational prototype</p>
      <h1 className="text-4xl font-serif font-bold mb-4">{label}</h1>
      <p className="text-xl text-text-secondary mb-4">Review a fictional preparation journey or continue a local draft saved in this browser.</p>
      <p className="text-sm text-text-secondary mb-10">No route or visa category is assumed from this page. The finder must check the answers available to this demo before a journey is prepared.</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button type="button" onClick={reviewRoute} className="btn-primary">{isRegular ? 'Review paper-visa route' : 'Check route eligibility'}</button>
        <button type="button" onClick={() => navigate('/resume')} className="btn-secondary">Continue local preparation</button>
        <button type="button" onClick={() => navigate('/status')} className="btn-secondary">Before-travel demo</button>
      </div>


    </div>
  );
}

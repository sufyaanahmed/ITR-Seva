import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Service({ type = 'evisa' }) {
  const isRegular = type === 'regular';
  const label = isRegular ? 'Regular / Paper Visa' : 'Electronic Visa (e-Visa)';
  const navigate = useNavigate();

  const reviewRoute = () => {
    navigate(isRegular ? '/flow/regular' : '/guide/visa-finder');
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 font-sans">
      <p className="uppercase tracking-widest text-xs text-[#C4762A] mb-2 font-bold font-sans">Official Visa Information</p>
      <h1 className="text-4xl font-serif font-bold mb-4 text-[#1E2A4F]">{label}</h1>
      <p className="text-xl text-text-secondary mb-4">Explore visa categories, eligibility requirements, or resume your saved application draft.</p>
      <p className="text-sm text-text-secondary mb-10">Select your country of passport and purpose of travel to identify the official immigration route applicable to your journey.</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button type="button" onClick={reviewRoute} className="btn-primary cursor-pointer">{isRegular ? 'Review Paper Visa Requirements' : 'Check Route Eligibility'}</button>
        <button type="button" onClick={() => navigate('/resume')} className="btn-secondary cursor-pointer">Continue Saved Draft</button>
        <button type="button" onClick={() => navigate('/status')} className="btn-secondary cursor-pointer">Check Application Status</button>
      </div>
    </div>
  );
}

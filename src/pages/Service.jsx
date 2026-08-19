import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

export default function Service({ type = 'evisa' }) {
  const label = type === 'regular' ? 'Regular / Paper Visa' : 'e-Visa';
  const navigate = useNavigate();
  const { updateState } = useStore();

  const handleStart = () => {
    updateState({ type, step: 0, data: { application_type: type, visa_category: 'tourist' }, docs: [], submitted: false });
    navigate('/apply');
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-serif font-bold mb-4">{label}</h1>
      <p className="text-xl text-text-secondary mb-10">Start a fictional demo application, continue a saved one, or check a demo application’s status.</p>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button onClick={handleStart} className="btn-primary">Start a new application</button>
        <button onClick={() => navigate('/resume')} className="btn-secondary">Continue saved application</button>
        <button onClick={() => navigate('/status')} className="btn-secondary">Check status</button>
      </div>
      
      <div className="bg-yellow-50 border-l-4 border-secondary p-4 text-yellow-900 text-sm">
        <strong>Demo only:</strong> no real government services, visa submissions, or payments are available here.
      </div>
    </div>
  );
}

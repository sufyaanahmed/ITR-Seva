import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

export default function Resume() {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const { state } = useStore();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
  };

  const hasLocalDraft = state && !state.submitted && state.data && state.data.application_type;

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-serif font-bold mb-4">Continue My Application</h1>
      <p className="text-text-secondary mb-8">If you have a saved application, you can continue it here.</p>

      {hasLocalDraft && (
        <div className="border-2 border-primary p-6 rounded bg-primary-light/20 shadow-sm mb-10 text-center">
          <h2 className="font-bold text-xl mb-2 text-primary">Draft Found on this Device</h2>
          <p className="text-sm text-text-secondary mb-6">You have an in-progress {state.data.application_type} application saved locally.</p>
          <button onClick={() => navigate('/apply')} className="btn-primary w-full sm:w-auto">Resume Local Draft</button>
        </div>
      )}
      
      <div className="border border-border p-6 rounded bg-white shadow-sm">
        <h2 className="font-bold text-xl mb-4">Find with Application ID</h2>
        <form onSubmit={handleSearch} className="flex gap-4">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Application ID" 
            className="input-field flex-1"
            required
          />
          <button type="submit" className="btn-secondary">Find</button>
        </form>

        {searched && (
          <div className="mt-6 p-4 bg-red-50 text-error rounded text-sm">
            No remote application found with that ID in this demo prototype.
          </div>
        )}
      </div>
    </div>
  );
}

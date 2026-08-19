import React, { useState } from 'react';

const mockDb = [
  { id: 'DEMO2026E00001', passport: 'DEMO123456', applicant: 'Jane Doe', nationality: 'USA', visa: 'e-Tourist Visa', status: 'GRANTED' },
  { id: 'DEMO2026E00002', passport: 'DEMO123457', applicant: 'John Smith', nationality: 'UK', visa: 'e-Business Visa', status: 'PROCESSING' },
  { id: 'DEMO2026A00003', passport: 'DEMO123458', applicant: 'Maria Garcia', nationality: 'Spain', visa: 'Regular Tourist Visa', status: 'GRANTED' },
  { id: 'DEMO2026A00004', passport: 'DEMO123459', applicant: 'Alex Johnson', nationality: 'Canada', visa: 'Regular Tourist Visa', status: 'REJECTED' }
];

export default function Status() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
    const found = mockDb.find(r => r.id === query || r.passport === query);
    setResult(found || null);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-serif font-bold mb-4">Check Application Status</h1>
      <p className="text-text-secondary mb-8">Enter your Application ID or Passport Number to check your status.</p>
      
      <form onSubmit={handleSearch} className="flex gap-4 mb-10">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. DEMO2026E00001" 
          className="input-field flex-1"
          required
        />
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {searched && (
        <div className="border border-border p-6 rounded bg-white shadow-sm">
          {result ? (
            <div>
              <h2 className="font-bold text-xl mb-4">Application Found</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-secondary text-xs uppercase">Application ID</p>
                  <p className="font-bold">{result.id}</p>
                </div>
                <div>
                  <p className="text-text-secondary text-xs uppercase">Applicant Name</p>
                  <p className="font-bold">{result.applicant}</p>
                </div>
                <div>
                  <p className="text-text-secondary text-xs uppercase">Visa Type</p>
                  <p className="font-bold">{result.visa}</p>
                </div>
                <div>
                  <p className="text-text-secondary text-xs uppercase">Status</p>
                  <p className={`font-bold ${result.status === 'GRANTED' ? 'text-success' : result.status === 'REJECTED' ? 'text-error' : 'text-primary'}`}>
                    {result.status}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="font-bold text-xl mb-2 text-error">Application Not Found</h2>
              <p className="text-text-secondary text-sm">No matching application found for that ID or Passport Number in the demo database.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

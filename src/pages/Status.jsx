import React, { useState } from 'react';

const mockDb = [
  { pan: 'DEMOP1234A', ay: '2026-27', applicant: 'Jane Doe', type: 'ITR-1', status: 'PROCESSED' },
  { pan: 'DEMOP1234B', ay: '2026-27', applicant: 'John Smith', type: 'ITR-3', status: 'PENDING' },
  { pan: 'DEMOP1234C', ay: '2025-26', applicant: 'Maria Garcia', type: 'ITR-2', status: 'REFUND ISSUED' },
  { pan: 'DEMOP1234D', ay: '2026-27', applicant: 'Alex Johnson', type: 'ITR-4', status: 'DEFECTIVE' }
];

export default function Status() {
  const [pan, setPan] = useState('');
  const [ay, setAy] = useState('2026-27');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
    const found = mockDb.find(r => r.pan === pan.toUpperCase() && r.ay === ay);
    setResult(found || null);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-serif font-bold mb-4 text-primary">Check ITR Status</h1>
      <p className="text-text-secondary mb-8">Enter your PAN and Assessment Year to check your filing or refund status.</p>
      
      <form onSubmit={handleSearch} className="flex gap-4 mb-10 flex-col sm:flex-row">
        <input 
          type="text" 
          value={pan}
          onChange={(e) => setPan(e.target.value)}
          placeholder="Enter PAN (e.g. DEMOP1234A)" 
          className="input-field flex-1 uppercase"
          required
        />
        <select value={ay} onChange={(e) => setAy(e.target.value)} className="input-field w-full sm:w-48">
          <option value="2026-27">2026-27</option>
          <option value="2025-26">2025-26</option>
          <option value="2024-25">2024-25</option>
        </select>
        <button type="submit" className="bg-primary text-white px-6 py-2 rounded-sm font-bold hover:bg-primary-dark transition">Search</button>
      </form>

      {searched && (
        <div className="border border-border p-6 rounded bg-white shadow-sm">
          {result ? (
            <div>
              <h2 className="font-bold text-xl mb-4">Status Found</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-secondary text-xs uppercase">PAN</p>
                  <p className="font-bold">{result.pan}</p>
                </div>
                <div>
                  <p className="text-text-secondary text-xs uppercase">Applicant Name</p>
                  <p className="font-bold">{result.applicant}</p>
                </div>
                <div>
                  <p className="text-text-secondary text-xs uppercase">ITR Type</p>
                  <p className="font-bold">{result.type}</p>
                </div>
                <div>
                  <p className="text-text-secondary text-xs uppercase">Status</p>
                  <p className={`font-bold ${result.status === 'PROCESSED' || result.status === 'REFUND ISSUED' ? 'text-success' : result.status === 'DEFECTIVE' ? 'text-error' : 'text-primary'}`}>
                    {result.status}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="font-bold text-xl mb-2 text-error">Record Not Found</h2>
              <p className="text-text-secondary text-sm">No matching ITR record found for that PAN and Assessment Year in the demo database.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

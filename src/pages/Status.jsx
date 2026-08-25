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
            <div className="space-y-8">
              <div className="border-b border-border pb-6">
                <h2 className="font-serif text-2xl font-bold mb-4">Application Profile</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Application ID</p>
                    <p className="font-bold text-[#0b2540]">{result.id}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Applicant Name</p>
                    <p className="font-bold text-[#0b2540]">{result.applicant}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Visa Type</p>
                    <p className="font-bold text-[#0b2540]">{result.visa}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Current Status</p>
                    <span className={`inline-block px-3 py-1 font-bold rounded-full text-xs ${result.status === 'GRANTED' ? 'bg-green-100 text-green-800' : result.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                      {result.status}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold mb-4">Processing Timeline</h3>
                <div className="relative border-l-2 border-gray-200 ml-3 space-y-6">
                  
                  <div className="relative pl-6">
                    <div className="absolute w-4 h-4 rounded-full bg-green-500 left-[-9px] top-1 border-2 border-white"></div>
                    <strong className="text-gray-900 block">Application Submitted</strong>
                    <p className="text-sm text-gray-500">Your application and fee were received.</p>
                  </div>

                  <div className="relative pl-6">
                    <div className="absolute w-4 h-4 rounded-full bg-green-500 left-[-9px] top-1 border-2 border-white"></div>
                    <strong className="text-gray-900 block">Documents Verified</strong>
                    <p className="text-sm text-gray-500">Your uploaded documents meet the requirements.</p>
                  </div>

                  <div className="relative pl-6">
                    <div className={`absolute w-4 h-4 rounded-full left-[-9px] top-1 border-2 border-white ${result.status === 'PROCESSING' ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
                    <strong className="text-gray-900 block">Processing</strong>
                    <p className="text-sm text-gray-500">Your application is under review by immigration authorities.</p>
                  </div>

                  {(result.status === 'GRANTED' || result.status === 'REJECTED') && (
                    <div className="relative pl-6">
                      <div className={`absolute w-4 h-4 rounded-full left-[-9px] top-1 border-2 border-white ${result.status === 'GRANTED' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <strong className="text-gray-900 block">Decision Rendered</strong>
                      <p className="text-sm text-gray-500">Your application processing has concluded.</p>
                    </div>
                  )}
                </div>
              </div>

              {result.status === 'GRANTED' && (
                <div className="bg-green-50 border border-green-200 rounded p-6 mt-8">
                  <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                    <span>✈️</span> Travel Readiness Checklist
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5 text-green-600" />
                      <div>
                        <strong className="block text-green-900">Download & Print ETA</strong>
                        <p className="text-sm text-green-800">You must carry a physical copy of your Electronic Travel Authorization.</p>
                        <button className="mt-2 text-sm bg-white border border-green-300 text-green-700 font-bold px-4 py-1 rounded hover:bg-green-50">Download PDF</button>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-5 h-5 text-green-600" />
                      <div>
                        <strong className="block text-green-900">Complete e-Arrival Card</strong>
                        <p className="text-sm text-green-800">Must be submitted online within 72 hours of your flight.</p>
                        <button className="mt-2 text-sm bg-white border border-green-300 text-green-700 font-bold px-4 py-1 rounded hover:bg-green-50">Start e-Arrival</button>
                      </div>
                    </li>
                  </ul>
                </div>
              )}
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

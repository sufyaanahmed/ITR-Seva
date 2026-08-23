import React, { useState } from 'react';
import { useStore } from '../store';
import { Link } from 'react-router-dom';

export default function Status() {
  const { state } = useStore();
  const [pan, setPan] = useState('');
  const [ay, setAy] = useState('2026-27');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  // If user is logged in, auto-fill PAN and use logged-in state
  React.useEffect(() => {
    if (state.auth.isLoggedIn) {
      setPan(state.auth.user.pan);
    }
  }, [state.auth]);

  const handleCheck = (e) => {
    e.preventDefault();
    setSearched(true);
    
    // Demo logic: Find return in filedReturns or fake it if logged out
    let match = null;
    if (state.auth.isLoggedIn) {
      match = state.mockDb.filedReturns.find(r => r.ay === ay);
    } else {
      // Mock result for public checking
      if (pan.length > 5) {
        match = {
          ay: ay,
          status: 'Processed',
          dateFiled: '2025-07-20',
          ack: 'ITR' + Math.floor(Math.random() * 100000)
        };
      }
    }
    setResult(match);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif font-bold mb-4 text-primary">ITR / Refund Status</h1>
        <p className="text-lg text-text-secondary">Check the status of your Income Tax Return and Refunds.</p>
      </div>

      <div className="bg-white border border-border p-8 rounded-sm shadow-sm mb-12">
        <form onSubmit={handleCheck} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label htmlFor="pan" className="block text-sm font-bold text-gray-700 mb-1">PAN</label>
            <input
              id="pan"
              type="text"
              required
              className="input-field uppercase"
              value={pan}
              onChange={e => setPan(e.target.value)}
              placeholder="e.g. ABCPS1234K"
              disabled={state.auth.isLoggedIn}
            />
          </div>
          <div className="flex-1 w-full">
            <label htmlFor="ay" className="block text-sm font-bold text-gray-700 mb-1">Assessment Year</label>
            <select
              id="ay"
              className="input-field"
              value={ay}
              onChange={e => setAy(e.target.value)}
            >
              <option value="2026-27">2026-27</option>
              <option value="2025-26">2025-26</option>
              <option value="2024-25">2024-25</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full md:w-auto mt-4 md:mt-0">Check Status</button>
        </form>
      </div>

      {searched && (
        <div className="bg-white border border-border p-8 rounded-sm shadow-sm">
          {result ? (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-primary">Status for AY {result.ay}</h2>
              
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-[19px] top-4 bottom-4 w-1 bg-gray-200 z-0"></div>

                <div className="space-y-8 relative z-10">
                  
                  {/* Step 1: Return Filed */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-success text-white flex items-center justify-center font-bold text-lg shrink-0">✓</div>
                    <div>
                      <h3 className="font-bold text-lg">Return Filed</h3>
                      <p className="text-sm text-gray-600">Your return was filed on {result.dateFiled}. Acknowledgement: {result.ack}</p>
                    </div>
                  </div>

                  {/* Step 2: e-Verified */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-success text-white flex items-center justify-center font-bold text-lg shrink-0">✓</div>
                    <div>
                      <h3 className="font-bold text-lg">Return e-Verified</h3>
                      <p className="text-sm text-gray-600">Successfully verified.</p>
                    </div>
                  </div>

                  {/* Step 3: Processed */}
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${result.status === 'Processed' || result.status.includes('Refund') ? 'bg-success text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {result.status === 'Processed' || result.status.includes('Refund') ? '✓' : '3'}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Return Processing</h3>
                      <p className="text-sm text-gray-600">
                        {result.status === 'Processed' || result.status.includes('Refund') ? 'Processing complete. Intimation under section 143(1) issued.' : 'Pending for processing.'}
                      </p>
                    </div>
                  </div>

                  {/* Step 4: Refund (Optional) */}
                  {result.status.includes('Refund') && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-success text-white flex items-center justify-center font-bold text-lg shrink-0">✓</div>
                      <div>
                        <h3 className="font-bold text-lg">Refund Issued</h3>
                        <p className="text-sm text-gray-600">Refund has been sent to your registered bank account.</p>
                      </div>
                    </div>
                  )}

                </div>
              </div>
              
              {!state.auth.isLoggedIn && (
                <div className="mt-8 text-center bg-gray-50 p-4 border rounded">
                  <p className="text-sm text-text-secondary mb-2">Log in to view complete details, download intimations, and track your history.</p>
                  <Link to="/login" className="btn-primary inline-block">Login to e-Filing</Link>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">No Records Found</h3>
              <p className="text-text-secondary">We could not find any filed returns for the given PAN and Assessment Year.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

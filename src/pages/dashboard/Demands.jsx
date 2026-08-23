import React from 'react';
import { useStore } from '../../store';
import { useNavigate } from 'react-router-dom';

export default function Demands() {
  const { state } = useStore();
  const navigate = useNavigate();
  const { demands } = state.mockDb;

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-primary mb-1">Response to Outstanding Demand</h1>
        <p className="text-sm text-text-secondary">View and respond to pending tax demands</p>
      </div>

      {demands.length === 0 ? (
        <div className="bg-green-50 border border-green-200 p-8 text-center rounded-sm">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-success">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-xl font-bold text-green-800 mb-2">No Outstanding Demands</h2>
          <p className="text-green-700">You do not have any pending demands to respond to.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {demands.map(demand => (
            <div key={demand.id} className="bg-white border border-border rounded-sm shadow-sm overflow-hidden flex flex-col md:flex-row">
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-lg">AY {demand.ay}</span>
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-bold rounded">{demand.status}</span>
                  </div>
                  <p className="text-sm text-text-secondary mb-1">Demand Reference Number (DIN): <span className="font-semibold text-text">{demand.id}</span></p>
                  <p className="text-sm text-text-secondary mb-4">Type: <span className="font-semibold text-text">{demand.type}</span></p>
                </div>
                <div className="text-sm text-error font-bold flex items-center gap-1">
                  <span>Due Date: {demand.dueDate}</span>
                </div>
              </div>
              <div className="bg-gray-50 border-t md:border-t-0 md:border-l border-border p-6 flex flex-col justify-center items-end min-w-[250px]">
                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Demand Amount</p>
                <p className="text-3xl font-bold text-error mb-4">₹ {demand.amount.toLocaleString()}</p>
                <button 
                  onClick={() => navigate('/dashboard/services/epaytax')}
                  className="bg-primary text-white w-full py-2 rounded font-bold hover:bg-primary-dark transition"
                >
                  Pay Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-blue-50 border-l-4 border-primary p-4 text-sm text-blue-900 mt-8">
        <p className="font-bold mb-1">Information:</p>
        <p>If you agree with the demand, you can proceed to "Pay Now". If you disagree, you can submit a response detailing your disagreement through the official portal.</p>
      </div>
    </div>
  );
}

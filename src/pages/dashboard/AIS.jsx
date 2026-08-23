import React, { useState } from 'react';
import { useStore } from '../../store';

export default function AIS() {
  const { state } = useStore();
  const [activeTab, setActiveTab] = useState('tis'); // 'tis' or 'ais'

  const mockTIS = [
    { category: 'Salary', processed: 1250000, derived: 1250000 },
    { category: 'Interest from Savings Bank', processed: 15000, derived: 15000 },
    { category: 'Interest from Deposits', processed: 10000, derived: 10000 },
    { category: 'Dividend', processed: 5000, derived: 5000 },
  ];

  const mockAIS = [
    { type: 'TDS/TCS Information', details: 'TDS on Salary (Sec 192) - XYZ Corp: ₹1,10,000' },
    { type: 'SFT Information', details: 'Purchase of mutual funds: ₹2,00,000' },
    { type: 'Payment of Taxes', details: 'Self Assessment Tax for AY 2024-25: ₹10,000' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-1">Annual Information Statement (AIS)</h1>
          <p className="text-sm text-text-secondary">PAN: {state.auth.user.pan} | AY: 2026-27</p>
        </div>
        <div>
          <button className="text-primary font-bold hover:underline text-sm border border-primary px-3 py-1 rounded">Download PDF</button>
        </div>
      </div>

      <div className="flex border-b border-border">
        <button 
          className={`px-4 py-2 font-bold text-sm ${activeTab === 'tis' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary'}`}
          onClick={() => setActiveTab('tis')}
        >
          Taxpayer Information Summary (TIS)
        </button>
        <button 
          className={`px-4 py-2 font-bold text-sm ${activeTab === 'ais' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary'}`}
          onClick={() => setActiveTab('ais')}
        >
          Annual Information Statement (AIS)
        </button>
      </div>

      {activeTab === 'tis' && (
        <div className="bg-white border border-border rounded-sm overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-border text-primary font-bold">
              <tr>
                <th className="p-3">Information Category</th>
                <th className="p-3">Processed Value (₹)</th>
                <th className="p-3">Derived Value (₹)</th>
              </tr>
            </thead>
            <tbody>
              {mockTIS.map((item, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 font-semibold text-text">{item.category}</td>
                  <td className="p-3">{item.processed.toLocaleString()}</td>
                  <td className="p-3">{item.derived.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'ais' && (
        <div className="space-y-4">
          {mockAIS.map((item, i) => (
            <div key={i} className="bg-white border border-border p-4 rounded-sm shadow-sm flex flex-col">
              <h3 className="font-bold text-primary mb-2">{item.type}</h3>
              <p className="text-sm text-text-secondary">{item.details}</p>
              <div className="mt-3">
                <button className="text-xs font-bold text-secondary hover:underline">Provide Feedback</button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

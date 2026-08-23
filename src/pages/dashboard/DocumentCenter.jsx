import React from 'react';
import { useStore } from '../../store';

export default function DocumentCenter() {
  const { state } = useStore();
  const { filedReturns, payments } = state.mockDb;

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-primary mb-1">Download Documents</h1>
        <p className="text-sm text-text-secondary">Access and download your ITR-V, Acknowledgements, and Receipts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Income Tax Returns */}
        <div className="bg-white border border-border shadow-sm rounded-sm">
          <div className="bg-gray-50 p-4 border-b border-border">
            <h2 className="font-bold text-lg text-primary">Income Tax Returns</h2>
          </div>
          <div className="p-4">
            {filedReturns.length === 0 ? (
              <p className="text-sm text-text-secondary py-4 text-center">No filed returns available.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {filedReturns.map((r, i) => (
                  <li key={i} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm mb-1">{r.form} (AY {r.ay})</p>
                      <p className="text-xs text-text-secondary">Filed on {r.dateFiled} | Ack: {r.ack}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-xs font-bold text-primary border border-primary px-2 py-1 rounded hover:bg-primary-light transition">ITR-V</button>
                      <button className="text-xs font-bold text-primary border border-primary px-2 py-1 rounded hover:bg-primary-light transition">Form</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Challan Receipts */}
        <div className="bg-white border border-border shadow-sm rounded-sm">
          <div className="bg-gray-50 p-4 border-b border-border">
            <h2 className="font-bold text-lg text-primary">Challan Receipts (Tax Payments)</h2>
          </div>
          <div className="p-4">
            {payments.length === 0 ? (
              <p className="text-sm text-text-secondary py-4 text-center">No payment receipts available.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {payments.map((p, i) => (
                  <li key={i} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm mb-1">{p.type} (AY {p.ay})</p>
                      <p className="text-xs text-text-secondary">Paid on {p.date} | CRN: {p.crn}</p>
                    </div>
                    <button className="text-xs font-bold text-primary border border-primary px-3 py-1 rounded hover:bg-primary-light transition">Download</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Annual Statements */}
        <div className="bg-white border border-border shadow-sm rounded-sm">
          <div className="bg-gray-50 p-4 border-b border-border">
            <h2 className="font-bold text-lg text-primary">Annual Statements</h2>
          </div>
          <div className="p-4">
            <ul className="divide-y divide-gray-100">
              <li className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm mb-1">Form 26AS</p>
                  <p className="text-xs text-text-secondary">AY 2026-27</p>
                </div>
                <button className="text-xs font-bold text-primary border border-primary px-3 py-1 rounded hover:bg-primary-light transition">Download</button>
              </li>
              <li className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm mb-1">Annual Information Statement (AIS)</p>
                  <p className="text-xs text-text-secondary">AY 2026-27</p>
                </div>
                <button className="text-xs font-bold text-primary border border-primary px-3 py-1 rounded hover:bg-primary-light transition">Download</button>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

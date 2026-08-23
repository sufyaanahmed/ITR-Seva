import React from 'react';
import { useStore } from '../../store';

export default function Form26AS() {
  const { state } = useStore();

  const tdsEntries = [
    { deductor: 'XYZ Corporation Ltd', tan: 'MUMX12345E', section: '192', date: '31-Mar-2026', paid: 1250000, tds: 110000 },
    { deductor: 'State Bank of India', tan: 'SBIN00001B', section: '194A', date: '31-Mar-2026', paid: 25000, tds: 2500 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-1">Form 26AS</h1>
          <p className="text-sm text-text-secondary">Annual Tax Statement under Section 203AA</p>
        </div>
        <div className="flex gap-2">
          <select className="input-field text-sm py-1 h-auto" defaultValue="2026-27">
            <option value="2026-27">AY 2026-27</option>
            <option value="2025-26">AY 2025-26</option>
          </select>
          <button className="bg-primary text-white text-sm px-3 py-1 font-bold rounded hover:bg-primary-dark">View / Download</button>
        </div>
      </div>

      <div className="bg-white border border-border rounded-sm p-4 shadow-sm">
        <h2 className="text-lg font-bold text-primary mb-4 border-b pb-2">Part A: Details of Tax Deducted at Source</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-y border-border text-text font-bold">
              <tr>
                <th className="p-3">Name of Deductor</th>
                <th className="p-3">TAN</th>
                <th className="p-3">Section</th>
                <th className="p-3">Date of Booking</th>
                <th className="p-3 text-right">Amount Paid/Credited (₹)</th>
                <th className="p-3 text-right">Tax Deducted (₹)</th>
                <th className="p-3 text-right">Tax Deposited (₹)</th>
              </tr>
            </thead>
            <tbody>
              {tdsEntries.map((entry, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 font-semibold">{entry.deductor}</td>
                  <td className="p-3 uppercase">{entry.tan}</td>
                  <td className="p-3">{entry.section}</td>
                  <td className="p-3">{entry.date}</td>
                  <td className="p-3 text-right">{entry.paid.toLocaleString()}</td>
                  <td className="p-3 text-right">{entry.tds.toLocaleString()}</td>
                  <td className="p-3 text-right">{entry.tds.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 font-bold border-b border-border">
              <tr>
                <td colSpan="4" className="p-3 text-right">Total:</td>
                <td className="p-3 text-right">12,75,000</td>
                <td className="p-3 text-right">1,12,500</td>
                <td className="p-3 text-right">1,12,500</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-secondary p-4 text-sm text-yellow-800">
        <p><strong>Note:</strong> The amounts shown above are for demonstration purposes based on the fictional profile of {state.auth.user.name}.</p>
      </div>
    </div>
  );
}

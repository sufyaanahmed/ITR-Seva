import React, { useState } from 'react';
import { useStore } from '../../store';

const steps = ['Select Act', 'Payment Details', 'Payment Mode', 'Success'];

export default function EPayTax() {
  const { state, addPayment } = useStore();
  const [step, setStep] = useState(0);
  
  const [paymentData, setPaymentData] = useState({
    act: '',
    ay: '2026-27',
    type: 'Self Assessment Tax (300)',
    tax: '',
    surcharge: '',
    cess: '',
    interest: '',
    penalty: '',
    mode: '',
    bank: ''
  });

  const [receipt, setReceipt] = useState(null);

  const calculateTotal = () => {
    return (Number(paymentData.tax) || 0) + 
           (Number(paymentData.surcharge) || 0) + 
           (Number(paymentData.cess) || 0) + 
           (Number(paymentData.interest) || 0) + 
           (Number(paymentData.penalty) || 0);
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 2) {
      // Process payment (Demo)
      const crn = 'CRN' + Math.floor(Math.random() * 10000000000);
      const newPayment = {
        crn,
        date: new Date().toISOString().split('T')[0],
        amount: calculateTotal(),
        status: 'PAID',
        ay: paymentData.ay,
        type: paymentData.type
      };
      addPayment(newPayment);
      setReceipt(newPayment);
      setStep(3);
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-primary border-b border-border pb-4">e-Pay Tax</h1>
      
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-col items-center w-1/4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${
              step > i ? 'bg-success text-white' : step === i ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > i ? '✓' : i + 1}
            </div>
            <span className={`text-xs text-center ${step === i ? 'font-bold text-primary' : 'text-gray-500'}`}>{s}</span>
          </div>
        ))}
      </div>

      <div className="bg-white border border-border shadow-sm rounded-sm p-6">
        <form onSubmit={handleNext}>
          
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-bold text-lg mb-4">Select Tax Applicable (Act)</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border rounded cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="act" required checked={paymentData.act === 'IT'} onChange={() => setPaymentData({...paymentData, act: 'IT'})} />
                  <div>
                    <span className="font-bold">Income Tax (Other than Companies)</span>
                    <span className="block text-sm text-gray-500">Tax Applicable: (0021)</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 border rounded cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="act" required checked={paymentData.act === 'CT'} onChange={() => setPaymentData({...paymentData, act: 'CT'})} />
                  <div>
                    <span className="font-bold">Corporation Tax (Companies)</span>
                    <span className="block text-sm text-gray-500">Tax Applicable: (0020)</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-bold text-lg mb-4">Payment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Assessment Year</label>
                  <select className="input-field" value={paymentData.ay} onChange={e => setPaymentData({...paymentData, ay: e.target.value})}>
                    <option value="2026-27">2026-27</option>
                    <option value="2025-26">2025-26</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Type of Payment</label>
                  <select className="input-field" value={paymentData.type} onChange={e => setPaymentData({...paymentData, type: e.target.value})}>
                    <option value="Self Assessment Tax (300)">Self Assessment Tax (300)</option>
                    <option value="Advance Tax (100)">Advance Tax (100)</option>
                    <option value="Tax on Regular Assessment (400)">Tax on Regular Assessment (400)</option>
                  </select>
                </div>
              </div>

              <h3 className="font-bold mt-6 mb-2 border-b pb-2">Breakup of Total Amount</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className="block text-xs font-bold text-gray-600 mb-1">Tax</label><input type="number" required className="input-field" value={paymentData.tax} onChange={e => setPaymentData({...paymentData, tax: e.target.value})} placeholder="0" /></div>
                <div><label className="block text-xs font-bold text-gray-600 mb-1">Surcharge</label><input type="number" className="input-field" value={paymentData.surcharge} onChange={e => setPaymentData({...paymentData, surcharge: e.target.value})} placeholder="0" /></div>
                <div><label className="block text-xs font-bold text-gray-600 mb-1">Cess</label><input type="number" className="input-field" value={paymentData.cess} onChange={e => setPaymentData({...paymentData, cess: e.target.value})} placeholder="0" /></div>
                <div><label className="block text-xs font-bold text-gray-600 mb-1">Interest</label><input type="number" className="input-field" value={paymentData.interest} onChange={e => setPaymentData({...paymentData, interest: e.target.value})} placeholder="0" /></div>
                <div><label className="block text-xs font-bold text-gray-600 mb-1">Penalty</label><input type="number" className="input-field" value={paymentData.penalty} onChange={e => setPaymentData({...paymentData, penalty: e.target.value})} placeholder="0" /></div>
              </div>
              
              <div className="bg-gray-50 p-4 border rounded flex justify-between items-center">
                <span className="font-bold text-gray-700">Total Amount</span>
                <span className="text-xl font-bold text-primary">₹ {calculateTotal().toLocaleString()}</span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-bold text-lg mb-4">Select Payment Mode</h2>
              <div className="bg-blue-50 border-l-4 border-primary p-4 mb-6">
                <span className="font-bold block">Total Amount Payable: ₹ {calculateTotal().toLocaleString()}</span>
                <span className="text-sm text-gray-600">CRN will be generated upon confirmation.</span>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border rounded cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="mode" required value="Net Banking" onChange={e => setPaymentData({...paymentData, mode: e.target.value})} />
                  <span className="font-bold">Net Banking</span>
                </label>
                <label className="flex items-center gap-3 p-4 border rounded cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="mode" value="UPI" onChange={e => setPaymentData({...paymentData, mode: e.target.value})} />
                  <span className="font-bold">UPI</span>
                </label>
                <label className="flex items-center gap-3 p-4 border rounded cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="mode" value="Credit/Debit Card" onChange={e => setPaymentData({...paymentData, mode: e.target.value})} />
                  <span className="font-bold">Credit/Debit Card</span>
                </label>
              </div>
            </div>
          )}

          {step === 3 && receipt && (
            <div className="text-center py-8">
              <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-success">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h2 className="text-2xl font-bold text-success mb-2">Payment Successful</h2>
              <p className="mb-6 text-gray-600">Your tax payment demo was successful.</p>
              
              <div className="bg-gray-50 border rounded-sm p-6 text-left max-w-sm mx-auto space-y-3">
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">CRN</span><span className="font-bold">{receipt.crn}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Date</span><span className="font-bold">{receipt.date}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Amount</span><span className="font-bold text-primary">₹ {receipt.amount.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="font-bold text-success">{receipt.status}</span></div>
              </div>

              <div className="mt-8">
                <button type="button" onClick={() => window.print()} className="btn-secondary mr-4">Download Challan Receipt</button>
              </div>
            </div>
          )}

          {step < 3 && (
            <div className="mt-8 pt-4 border-t flex justify-end">
              {step > 0 && <button type="button" onClick={() => setStep(s => s - 1)} className="btn-secondary mr-auto">Back</button>}
              <button type="submit" className="btn-primary" disabled={step === 1 && calculateTotal() === 0}>
                {step === 2 ? 'Pay Now' : 'Continue'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

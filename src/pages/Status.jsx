import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const mockDb = [
  {
    id: 'DEMO2026E00001',
    passport: 'DEMO123456',
    birthDate: '1985-04-22',
    applicant: 'Sam Altman',
    nationality: 'United States',
    visa: 'e-Tourist Visa (synthetic)',
    status: 'GRANTED',
    events: [
      { label: 'Demo record created', detail: 'Synthetic record stored for the local status demonstration.' },
      { label: 'Demo status set to GRANTED', detail: 'A test state chosen to demonstrate the post-grant checklist; it is not a Government decision.' },
    ],
  },
  {
    id: 'DEMO2026E00002',
    passport: 'DEMO123457',
    birthDate: '1988-11-03',
    applicant: 'Ravi Example',
    nationality: 'United Kingdom',
    visa: 'e-Business Visa (synthetic)',
    status: 'PROCESSING',
    events: [
      { label: 'Demo record created', detail: 'Synthetic record stored with a processing state; no official event is implied.' },
    ],
  },
  {
    id: 'DEMO2026A00003',
    passport: 'DEMO123458',
    birthDate: '1996-02-21',
    applicant: 'Noor Example',
    nationality: 'Afghanistan',
    visa: 'Afghan Medical Visa (synthetic)',
    status: 'REJECTED',
    events: [
      { label: 'Demo record created', detail: 'Synthetic record stored for the local status demonstration.' },
      { label: 'Demo status set to REJECTED', detail: 'A test state only; no reason or Government decision is represented.' },
    ],
  },
];

const normalize = (value) => value.trim().toUpperCase();
const maskPassport = (passport) => `${passport.slice(0, 2)}••••${passport.slice(-2)}`;

export default function Status() {
  const [applicationId, setApplicationId] = useState('');
  const [passport, setPassport] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearched(true);
    const found = mockDb.find((record) => (
      record.id === normalize(applicationId)
      && record.passport === normalize(passport)
      && record.birthDate === birthDate
    ));
    setResult(found || null);
  };

  const fillDemoData = () => {
    setApplicationId('DEMO2026E00001');
    setPassport('DEMO123456');
    setBirthDate('1985-04-22');
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-4">Check Application Status</h1>
          <p className="text-text-secondary">Enter your Application ID, passport number, and date of birth to track your visa.</p>
        </div>
        <button 
          type="button" 
          onClick={fillDemoData} 
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#D4AF37]/40 bg-[#FAF7F0] text-[#C4762A] text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#1E2A4F] hover:border-[#D4AF37] transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Auto-fill Demo Data
        </button>
      </div>

      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <label className="text-sm font-bold text-gray-800 md:col-span-2">Demo Application ID
          <input type="text" value={applicationId} onChange={(e) => setApplicationId(e.target.value)} placeholder="DEMO2026E00001" autoComplete="off" className="input-field mt-2 font-normal" required />
        </label>
        <label className="text-sm font-bold text-gray-800">Demo passport number
          <input type="text" value={passport} onChange={(e) => setPassport(e.target.value)} placeholder="DEMO123456" autoComplete="off" className="input-field mt-2 font-normal" required />
        </label>
        <label className="text-sm font-bold text-gray-800">Date of birth
          <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="input-field mt-2 font-normal" required />
        </label>
        <button type="submit" className="btn-primary md:col-span-2 md:justify-self-start">Search Records</button>
      </form>

      {searched && (
        <div className="border border-border p-6 rounded bg-white shadow-sm">
          {result ? (
            <div className="space-y-8">
              <div className="border-b border-border pb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-5">
                  <div>
                    <p className="uppercase tracking-widest text-xs text-primary font-bold mb-1">Local synthetic result</p>
                    <h2 className="font-serif text-2xl font-bold">Application profile</h2>
                  </div>
                  <span className={`self-start inline-block px-3 py-1 font-bold rounded-full text-xs ${result.status === 'GRANTED' ? 'bg-green-100 text-green-800' : result.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>{result.status}</span>
                </div>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {[
                    ['Application ID', result.id],
                    ['Applicant', result.applicant],
                    ['Passport', maskPassport(result.passport)],
                    ['Nationality', result.nationality],
                    ['Visa type', result.visa],
                    ['Date of birth', result.birthDate],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-text-secondary text-xs uppercase tracking-wider mb-1">{label}</dt>
                      <dd className="font-bold text-[#0b2540]">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold mb-4">Stored demo state history</h3>
                <div className="relative border-l-2 border-gray-200 ml-3 space-y-6">
                  {result.events.map((event) => (
                    <div key={event.label} className="relative pl-6">
                      <div className="absolute w-4 h-4 rounded-full bg-primary left-[-9px] top-1 border-2 border-white" />
                      <strong className="text-gray-900 block">{event.label}</strong>
                      <p className="text-sm text-gray-500">{event.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {result.status === 'GRANTED' && (
                <div className="bg-[#FAF7F0] border border-[#D4AF37]/30 rounded-2xl p-8 relative overflow-hidden shadow-sm">
                  {/* Decorative background element */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 text-[#D4AF37] opacity-[0.03] pointer-events-none">
                    <svg viewBox="0 0 100 100" fill="currentColor">
                      <path d="M50 0C50 27.614 27.614 50 0 50C27.614 50 50 72.386 50 100C50 72.386 72.386 50 100 50C72.386 50 50 27.614 50 0Z" />
                    </svg>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-[#1E2A4F]/5 flex items-center justify-center border border-[#1E2A4F]/10">
                      <svg className="w-5 h-5 text-[#1E2A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#C4762A] font-bold">Action Required</p>
                      <h3 className="text-xl font-serif font-bold text-[#1E2A4F]">Travel Readiness Checklist</h3>
                    </div>
                  </div>
                  
                  <ul className="space-y-4 relative z-10">
                    {[
                      "Print your official Electronic Travel Authorization (ETA). Digital copies or screenshots are not accepted at immigration.",
                      "Carry the exact physical passport used in this application. If replaced, carry both the old and new passports.",
                      "Verify your permitted entry ports and review any yellow-fever or restricted-area requirements prior to departure.",
                      "Complete your mandatory Customs declaration and e-Arrival Card within 72 hours of your flight."
                    ].map((item, idx) => (
                      <li key={idx} className="flex gap-4 items-start bg-white p-4 rounded-xl border border-[#D4AF37]/10 shadow-sm">
                        <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-green-50 flex items-center justify-center border border-green-200">
                          <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-sm text-[#1E2A4F]/80 leading-relaxed">{item}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 print:hidden">
                <button type="button" onClick={() => window.print()} className="btn-secondary">Print demo summary</button>
                <Link to="/e-arrival" className="btn-secondary">Review e-Arrival</Link>

              </div>
            </div>
          ) : (
            <div>
              <h2 className="font-bold text-xl mb-2 text-error">No matching demo record</h2>
              <p className="text-text-secondary text-sm">All three values must match one synthetic fixture. For privacy, this message does not reveal which field differed.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

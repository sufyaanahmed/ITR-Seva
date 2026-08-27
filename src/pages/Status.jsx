import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const EVISA_PORTAL = 'https://indianvisaonline.gov.in/evisa/';
const AFGHAN_PORTAL = 'https://www.indianvisaonline.gov.in/avisa/index.html';

const mockDb = [
  {
    id: 'DEMO2026E00001',
    passport: 'DEMO123456',
    birthDate: '1992-04-18',
    applicant: 'Asha Example',
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

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-serif font-bold mb-4">Check a demo application state</h1>
      <p className="text-text-secondary mb-5">This local lookup requires an Application ID, passport number, and date of birth together. A production service must also rate-limit attempts and prevent account enumeration.</p>

      <div className="bg-amber-50 border border-amber-300 p-5 rounded mb-8">
        <p className="font-bold text-amber-950 mb-1">Synthetic demo records only</p>
        <p className="text-sm text-amber-900">This page does not contact the Government of India and cannot display a real application or ETA. Never enter real identity or passport data here.</p>
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
        <button type="submit" className="btn-primary md:col-span-2 md:justify-self-start">Search demo records</button>
      </form>
      <p className="text-xs text-gray-500 mb-10">Demo fixture: DEMO2026E00001 · DEMO123456 · 18 April 1992</p>

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
                <div className="bg-green-50 border border-green-200 rounded p-6">
                  <h3 className="text-xl font-bold text-green-950 mb-4">Real-world travel readiness</h3>
                  <ul className="list-disc pl-6 space-y-2 text-sm text-green-900">
                    <li>Confirm the real official ETA itself says <strong>GRANTED</strong>; this synthetic state is not proof.</li>
                    <li>Print and carry the official ETA. A screenshot or this demo summary is not an ETA.</li>
                    <li>Carry the passport used in the application; if replaced, carry both the old and new passports.</li>
                    <li>Verify permitted entry points, yellow-fever requirements, restricted-area rules, and expect biometrics at immigration.</li>
                    <li>Complete the separate e-Arrival Card within 72 hours before arrival.</li>
                  </ul>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 print:hidden">
                <button type="button" onClick={() => window.print()} className="btn-secondary">Print demo summary</button>
                <Link to="/e-arrival" className="btn-secondary">Review e-Arrival</Link>
                <a href={result.nationality === 'Afghanistan' ? AFGHAN_PORTAL : EVISA_PORTAL} target="_blank" rel="noreferrer" className="btn-primary">Open official portal ↗</a>
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

      <section className="mt-10 border-t border-border pt-7">
        <h2 className="text-xl font-bold mb-3">Checking a real application?</h2>
        <p className="text-sm text-text-secondary mb-4">Leave this demo and use the relevant Government of India portal. The standard status endpoint redirected during the audit, so the official landing pages are used as the stable handoff.</p>
        <div className="flex flex-wrap gap-3">
          <a href={EVISA_PORTAL} target="_blank" rel="noreferrer" className="btn-secondary">Official e-Visa portal ↗</a>
          <a href={AFGHAN_PORTAL} target="_blank" rel="noreferrer" className="btn-secondary">Official Afghan portal ↗</a>
        </div>
      </section>
    </div>
  );
}

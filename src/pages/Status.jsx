import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────────────────────────
   SOVEREIGN VECTOR ORNAMENTS & SEALS (NO EMOJIS)
───────────────────────────────────────────────────────────────────────────── */

function StatusMandalaCorner({ className = '' }) {
  return (
    <svg viewBox="0 0 60 60" className={`w-6 h-6 ${className}`} fill="none">
      <path d="M2 2 L35 2 Q2 2 2 35 Z" fill="#D4AF37" fillOpacity="0.15" stroke="#D4AF37" strokeWidth="1" />
      <path d="M2 2 L22 2 Q2 2 2 22 Z" fill="#1E2A4F" fillOpacity="0.1" />
      <circle cx="10" cy="10" r="4" fill="#D4AF37" fillOpacity="0.5" />
      <path d="M2 18 Q18 18 18 2" stroke="#D4AF37" strokeWidth="0.75" fill="none" />
      <path d="M2 28 Q28 28 28 2" stroke="#1E2A4F" strokeWidth="0.75" strokeDasharray="1.5 1.5" fill="none" />
    </svg>
  );
}

function StatusAshokaChakra() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] overflow-hidden">
      <svg viewBox="0 0 200 200" className="w-[320px] h-[320px] text-[#1E2A4F]">
        <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="6" />
        <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="16" fill="none" stroke="currentColor" strokeWidth="6" />
        <circle cx="100" cy="100" r="7" fill="currentColor" />
        {[...Array(24)].map((_, i) => (
          <line
            key={i}
            x1="100"
            y1="100"
            x2="100"
            y2="10"
            stroke="currentColor"
            strokeWidth="2"
            transform={`rotate(${i * 15} 100 100)`}
          />
        ))}
      </svg>
    </div>
  );
}

function StatusBarcode({ text = 'ETA-VERIFIED-2026' }) {
  const bars = text.split('').flatMap((char) => {
    const code = char.charCodeAt(0);
    return [
      (code % 3) + 1,
      ((code >> 1) % 2) + 1,
      ((code >> 2) % 3) + 1,
      ((code >> 3) % 2) + 1,
    ];
  });

  return (
    <div className="flex flex-col items-start">
      <svg viewBox={`0 0 ${bars.length * 3} 24`} className="w-36 sm:w-40 h-6 print:h-5" preserveAspectRatio="none">
        {bars.map((width, idx) => (
          <rect
            key={idx}
            x={idx * 3}
            y="0"
            width={width * 0.8}
            height="24"
            fill="#1E2A4F"
          />
        ))}
      </svg>
      <span className="font-mono text-[8.5px] print:text-[7.5px] tracking-widest text-gray-600 mt-0.5 uppercase font-semibold">{text}</span>
    </div>
  );
}

function StatusQrCode() {
  return (
    <svg viewBox="0 0 80 80" className="w-12 h-12 sm:w-14 sm:h-14 print:w-11 print:h-11 border border-gray-300 p-0.5 bg-white shrink-0" fill="#1E2A4F">
      <rect x="4" y="4" width="22" height="22" fill="none" stroke="#1E2A4F" strokeWidth="4" />
      <rect x="9" y="9" width="12" height="12" />
      <rect x="54" y="4" width="22" height="22" fill="none" stroke="#1E2A4F" strokeWidth="4" />
      <rect x="59" y="9" width="12" height="12" />
      <rect x="4" y="54" width="22" height="22" fill="none" stroke="#1E2A4F" strokeWidth="4" />
      <rect x="9" y="59" width="12" height="12" />
      <rect x="32" y="8" width="6" height="6" />
      <rect x="42" y="14" width="6" height="6" />
      <rect x="32" y="24" width="16" height="6" />
      <rect x="8" y="32" width="6" height="16" />
      <rect x="20" y="38" width="8" height="8" />
      <rect x="34" y="36" width="12" height="12" />
      <rect x="54" y="32" width="8" height="6" />
      <rect x="68" y="38" width="6" height="12" />
      <rect x="36" y="54" width="8" height="6" />
      <rect x="48" y="60" width="12" height="8" />
      <rect x="66" y="58" width="8" height="14" />
      <rect x="32" y="68" width="10" height="6" />
    </svg>
  );
}

function StatusSealStamp({ status = 'GRANTED' }) {
  const isGranted = status === 'GRANTED';
  const color = isGranted ? '#176B45' : status === 'REJECTED' ? '#8B1C1C' : '#0B2540';
  
  return (
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 print:w-14 print:h-14 flex items-center justify-center select-none shrink-0">
      <svg viewBox="0 0 120 120" className="w-full h-full" style={{ color }}>
        <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" />
        <circle cx="60" cy="60" r="48" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="60" cy="60" r="36" fill="none" stroke="currentColor" strokeWidth="0.75" />
        <path id="statusSealPath" d="M 60,60 m -42,0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0" fill="none" />
        <text fontSize="7" fontWeight="bold" letterSpacing="1.2" fill="currentColor">
          <textPath href="#statusSealPath" startOffset="0%">
            IMMIGRATION BUREAU · STATUS VERIFIED ·
          </textPath>
        </text>
        <path d="M 60,46 L 63,55 L 72,55 L 65,61 L 67,70 L 60,65 L 53,70 L 55,61 L 48,55 L 57,55 Z" fill="currentColor" fillOpacity="0.85" />
        <text x="60" y="82" fontSize="6.5" fontWeight="bold" textAnchor="middle" fill="currentColor" letterSpacing="0.5">
          {status}
        </text>
      </svg>
    </div>
  );
}

const mockDb = [
  {
    id: 'DEMO2026E00001',
    passport: 'DEMO123456',
    birthDate: '1985-04-22',
    applicant: 'Sam Altman',
    nationality: 'United States',
    visa: 'e-Tourist Visa (1 Year)',
    arrivalPort: 'Delhi (DEL) International Airport',
    status: 'GRANTED',
    issueDate: '2026-03-01',
    expiryDate: '2027-02-28',
    events: [
      { label: 'Application Submitted & Sealed', date: '01 Mar 2026', detail: 'Application dossier logged with Bureau of Immigration.' },
      { label: 'Security & Biometrics Cleared', date: '02 Mar 2026', detail: 'Automated identity and travel risk verification completed.' },
      { label: 'Electronic Travel Authorization GRANTED', date: '03 Mar 2026', detail: 'ETA issued with 1-Year Multiple Entry privilege.' },
    ],
  },
  {
    id: 'DEMO2026E00002',
    passport: 'DEMO123457',
    birthDate: '1988-11-03',
    applicant: 'Ravi Example',
    nationality: 'United Kingdom',
    visa: 'e-Business Visa (1 Year)',
    arrivalPort: 'Mumbai (BOM) International Airport',
    status: 'PROCESSING',
    issueDate: 'Pending',
    expiryDate: 'Pending',
    events: [
      { label: 'Application Submitted', date: '03 Mar 2026', detail: 'Application dossier received in secure staging queue.' },
      { label: 'Under Consular Review', date: '04 Mar 2026', detail: 'Document validation in progress by consular processing officer.' },
    ],
  },
  {
    id: 'DEMO2026A00003',
    passport: 'DEMO123458',
    birthDate: '1996-02-21',
    applicant: 'Noor Example',
    nationality: 'Afghanistan',
    visa: 'Afghan Medical Visa',
    arrivalPort: 'Delhi (DEL) International Airport',
    status: 'REJECTED',
    issueDate: 'N/A',
    expiryDate: 'N/A',
    events: [
      { label: 'Application Lodged', date: '25 Feb 2026', detail: 'Application filed via special Afghan medical route.' },
      { label: 'Application Rejected', date: '28 Feb 2026', detail: 'Supporting hospital invitation letter expired. Please file a fresh application.' },
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
    if (event) event.preventDefault();
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

  const todayFormatted = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 font-sans">
      
      {/* ── EMBEDDED PRINT STYLES (STRICT 1-PAGE CERTIFICATE) ── */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 5mm 6mm 5mm 6mm !important;
          }
          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            font-size: 11px !important;
          }
          .status-print-container {
            border: 1.5px solid #000000 !important;
            box-shadow: none !important;
            padding: 14px 18px !important;
            margin: 0 auto !important;
            max-height: 282mm !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            overflow: hidden !important;
          }
          .status-screen-only {
            display: none !important;
          }
          .status-print-only {
            display: block !important;
          }
        }
        @media screen {
          .status-print-only {
            display: none;
          }
        }
      `}</style>

      {/* ── SCREEN VIEW: HEADER ── */}
      <div className="status-screen-only flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-[#C4762A] block mb-1">
            Government of India · Immigration Bureau
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#1E2A4F]">Check Application Status</h1>
          <p className="text-text-secondary text-sm mt-1">
            Track your Electronic Travel Authorization (ETA), review real-time milestones, and print your official status certificate.
          </p>
        </div>
        
        <div>
          <button 
            type="button" 
            onClick={fillDemoData} 
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#FAF7F0] text-[#C4762A] text-xs font-bold uppercase tracking-wider hover:bg-[#D4AF37] hover:text-[#1E2A4F] transition-all shadow-xs cursor-pointer"
          >
            <span>Auto-Fill Sample Data</span>
          </button>
        </div>
      </div>

      {/* ── SCREEN VIEW: SEARCH FORM ── */}
      <form onSubmit={handleSearch} className="status-screen-only bg-white border border-border p-6 sm:p-8 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 md:col-span-2">
          Application Reference ID
          <input
            type="text"
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
            placeholder="e.g. DEMO2026E00001 or reference ID"
            autoComplete="off"
            className="input-field mt-1.5 font-normal text-sm"
            required
          />
        </label>
        <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
          Passport Number
          <input
            type="text"
            value={passport}
            onChange={(e) => setPassport(e.target.value)}
            placeholder="DEMO123456"
            autoComplete="off"
            className="input-field mt-1.5 font-normal text-sm"
            required
          />
        </label>
        <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
          Date of Birth
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="input-field mt-1.5 font-normal text-sm"
            required
          />
        </label>
        <div className="md:col-span-2 flex items-center justify-between pt-2">
          <button type="submit" className="btn-primary cursor-pointer">
            Search Status Records
          </button>
          <span className="text-[11px] text-gray-500 italic">
            Exact match required across all 3 fields
          </span>
        </div>
      </form>

      {/* ── SCREEN VIEW: SEARCH RESULTS ── */}
      {searched && (
        <div className="status-screen-only border border-border p-6 sm:p-8 rounded-xl bg-white shadow-md animate-[fadeIn_0.4s_ease-out]">
          {result ? (
            <div className="space-y-8">
              
              {/* Official Status Banner Card */}
              <div className="relative border-2 border-[#D4AF37]/50 rounded-xl p-6 sm:p-7 bg-[#FAF7F0] overflow-hidden shadow-sm">
                <StatusAshokaChakra />
                <StatusMandalaCorner className="absolute top-1 left-1 opacity-70" />
                <StatusMandalaCorner className="absolute top-1 right-1 transform rotate-90 opacity-70" />
                <StatusMandalaCorner className="absolute bottom-1 right-1 transform rotate-180 opacity-70" />
                <StatusMandalaCorner className="absolute bottom-1 left-1 transform -rotate-90 opacity-70" />

                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 pb-4 border-b border-[#D4AF37]/30">
                    <div className="flex items-center gap-3">
                      <img src="/emblem.svg" alt="Emblem of India" className="h-12 w-auto opacity-95 shrink-0" />
                      <div>
                        <span className="text-[9.5px] uppercase font-bold tracking-[0.2em] text-[#8B1C1C] block">
                          Government of India · Immigration Bureau
                        </span>
                        <h2 className="font-serif text-2xl font-bold text-[#1E2A4F]">
                          Electronic Travel Authorization (ETA) Status
                        </h2>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 self-start sm:self-auto">
                      <StatusSealStamp status={result.status} />
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 font-bold rounded-full text-xs uppercase tracking-wider ${
                          result.status === 'GRANTED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : result.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-sky-100 text-sky-800 border border-sky-300'
                        }`}>
                          {result.status}
                        </span>
                        <span className="text-[9px] block text-gray-500 uppercase tracking-wider mt-1">
                          Valid As Of: {todayFormatted}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Grid */}
                  <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
                    {[
                      ['Application Reference', result.id],
                      ['Applicant Name', result.applicant],
                      ['Passport Number', maskPassport(result.passport)],
                      ['Nationality', result.nationality],
                      ['Visa Category', result.visa],
                      ['Date of Birth', result.birthDate],
                      ['Designated Port', result.arrivalPort || 'Delhi Airport'],
                      ['Granted / Effective Date', result.issueDate || 'N/A'],
                      ['Validity Period', result.expiryDate || 'N/A'],
                    ].map(([label, value]) => (
                      <div key={label} className="bg-white p-3 rounded-lg border border-gray-200/80 shadow-2xs">
                        <dt className="text-gray-500 text-[9.5px] uppercase tracking-wider mb-0.5 font-bold">{label}</dt>
                        <dd className="font-bold text-[#1E2A4F] text-xs sm:text-sm break-all">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              {/* Status History Timeline */}
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1E2A4F] mb-4 flex items-center gap-2">
                  <span>Milestone Verification History</span>
                  <span className="text-xs font-sans font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {result.events.length} Recorded Events
                  </span>
                </h3>
                <div className="relative border-l-2 border-[#1E2A4F]/30 ml-3 space-y-5">
                  {result.events.map((event, i) => (
                    <div key={i} className="relative pl-6">
                      <div className="absolute w-3.5 h-3.5 rounded-full bg-[#1E2A4F] -left-[7px] top-1 border-2 border-white shadow-xs" />
                      <div className="flex items-center gap-2">
                        <strong className="text-gray-900 text-xs font-bold">{event.label}</strong>
                        {event.date && (
                          <span className="text-[10px] font-mono text-[#C4762A] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            {event.date}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">{event.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Entry & Travel Directives (Static Guidance, Only When GRANTED) */}
              {result.status === 'GRANTED' && (
                <div className="bg-[#FAF7F0] border border-[#D4AF37]/50 rounded-xl p-5 sm:p-6 shadow-xs">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-[#176B45]" />
                    <h3 className="font-serif font-bold text-base text-[#1E2A4F] uppercase tracking-wide">
                      Official Travel Directives & Port of Entry Requirements
                    </h3>
                  </div>

                  <p className="text-xs text-gray-600 mb-4">
                    Your Electronic Travel Authorization is officially confirmed. Please note the following statutory immigration directives for entry into India:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3.5 rounded-lg border border-gray-200">
                      <strong className="text-gray-900 block font-bold mb-1">1. Physical Printed Copy Mandatory</strong>
                      <p className="text-gray-600 text-[11px] leading-relaxed">
                        Carry a physical printed copy of this ETA certificate. Smartphone screenshots or soft copies are not accepted at immigration counters.
                      </p>
                    </div>

                    <div className="bg-white p-3.5 rounded-lg border border-gray-200">
                      <strong className="text-gray-900 block font-bold mb-1">2. Passport Validity & Blank Pages</strong>
                      <p className="text-gray-600 text-[11px] leading-relaxed">
                        Your original physical passport must have at least 6 months remaining validity from your arrival date and contain at least 2 blank pages.
                      </p>
                    </div>

                    <div className="bg-white p-3.5 rounded-lg border border-gray-200">
                      <strong className="text-gray-900 block font-bold mb-1">3. Designated Port of Entry</strong>
                      <p className="text-gray-600 text-[11px] leading-relaxed">
                        Valid for arrival at 28 designated international airports (e.g. Delhi, Mumbai, Bengaluru) and 5 designated seaports.
                      </p>
                    </div>

                    <div className="bg-white p-3.5 rounded-lg border border-gray-200">
                      <strong className="text-gray-900 block font-bold mb-1">4. Mandatory Biometric Enrolment</strong>
                      <p className="text-gray-600 text-[11px] leading-relaxed">
                        Biometric capture (facial photograph & fingerprints) will be conducted upon arrival by the immigration officer.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-gradient-to-r from-[#D4AF37] to-[#C9933A] text-[#1E2A4F] px-6 py-2.5 font-bold text-xs uppercase tracking-wider rounded shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>
                    {result.status === 'GRANTED'
                      ? 'Print 1-Page Official Certificate (PDF)'
                      : 'Print Official Status Record (PDF)'}
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  {result.status === 'REJECTED' ? (
                    <Link to="/guide/visa-finder" className="btn-secondary">
                      Apply Fresh Visa Route →
                    </Link>
                  ) : (
                    <Link to="/e-arrival" className="btn-secondary">
                      Pre-Flight e-Arrival Guide →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center mx-auto mb-3 font-bold">
                !
              </div>
              <h2 className="font-serif font-bold text-lg text-[#1E2A4F] mb-1">No Matching Status Record Found</h2>
              <p className="text-text-secondary text-xs max-w-md mx-auto mb-4">
                Please verify that the Application Reference ID, passport number, and date of birth match the exact details used during application submission.
              </p>
              <button
                type="button"
                onClick={fillDemoData}
                className="text-xs font-bold text-[#C4762A] hover:underline uppercase tracking-wider cursor-pointer"
              >
                Auto-fill sample record to test status view →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────
         STRICT 1-PAGE PRINTABLE OFFICIAL STATUS CERTIFICATE (PRINT VIEW ONLY)
      ───────────────────────────────────────────────────────────────────────── */}
      {result && (
        <article className="status-print-only status-print-container relative bg-white text-gray-900 border-2 border-[#D4AF37]/60 rounded-lg p-5 shadow-none overflow-hidden">
          
          {/* Cultural Mandala Corner Filigrees */}
          <StatusMandalaCorner className="absolute top-1 left-1 print:w-5 print:h-5" />
          <StatusMandalaCorner className="absolute top-1 right-1 transform rotate-90 print:w-5 print:h-5" />
          <StatusMandalaCorner className="absolute bottom-1 right-1 transform rotate-180 print:w-5 print:h-5" />
          <StatusMandalaCorner className="absolute bottom-1 left-1 transform -rotate-90 print:w-5 print:h-5" />

          {/* Ashoka Chakra Background Watermark */}
          <StatusAshokaChakra />

          {/* Inner Border Frame */}
          <div className="relative z-10 border border-[#1E2A4F]/25 p-3.5 rounded print:p-2.5 print:border-black/40">
            
            {/* Header Section */}
            <header className="border-b border-[#1E2A4F] pb-2.5 mb-2.5 print:pb-2 print:mb-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src="/emblem.svg"
                    alt="Emblem of India"
                    className="h-12 print:h-10 w-auto opacity-95 shrink-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-[9.5px] print:text-[8.5px] font-serif font-bold uppercase tracking-[0.2em] text-[#8B1C1C]">
                      भारत सरकार · GOVERNMENT OF INDIA
                    </span>
                    <span className="text-sm print:text-xs font-serif font-bold text-[#1E2A4F] tracking-wide">
                      अखिल भारतीय ई-वीज़ा पोर्टल · BHARAT VISA SEVA
                    </span>
                    <span className="text-[9px] print:text-[8px] font-sans font-bold uppercase tracking-widest text-[#D4AF37] print:text-black">
                      IMMIGRATION BUREAU · STATUS VERIFICATION CERTIFICATE
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusQrCode />
                  <div className="text-right">
                    <span className="text-[8px] uppercase tracking-wider text-gray-500 block font-bold">Verified</span>
                    <span className="text-[9.5px] font-mono font-bold text-[#1E2A4F]">{todayFormatted}</span>
                    <span className="text-[8px] uppercase tracking-wider text-[#176B45] font-bold block">STATUS: {result.status}</span>
                  </div>
                </div>
              </div>

              <div className="mt-2 bg-[#FAF7F0] border border-[#D4AF37]/30 px-2 py-0.5 rounded text-center print:bg-gray-50">
                <p className="text-[8.5px] print:text-[7.5px] font-serif font-bold text-[#8A5A00] tracking-wider uppercase">
                  OFFICIAL ELECTRONIC TRAVEL AUTHORIZATION RECORD · REPUBLIC OF INDIA
                </p>
              </div>
            </header>

            {/* Reference Meta Box */}
            <section className="bg-slate-50 border border-slate-200 rounded p-2 mb-2.5 grid grid-cols-3 gap-2 print:bg-white print:border-black/20 print:p-1.5 print:mb-2">
              <div>
                <span className="block text-[8px] font-bold uppercase text-gray-500">Application Reference</span>
                <strong className="font-mono text-xs print:text-[10px] text-[#1E2A4F] font-bold break-all">{result.id}</strong>
              </div>
              <div>
                <span className="block text-[8px] font-bold uppercase text-gray-500">Authorization Status</span>
                <strong className="text-xs print:text-[10px] text-[#176B45] uppercase font-bold">{result.status}</strong>
              </div>
              <div>
                <span className="block text-[8px] font-bold uppercase text-gray-500">Service Category</span>
                <span className="text-xs print:text-[10px] text-gray-800 font-bold uppercase">{result.visa}</span>
              </div>
            </section>

            {/* Applicant Details Grid */}
            <section className="mb-2.5 print:mb-2">
              <h2 className="text-[9px] print:text-[8px] font-bold uppercase tracking-widest text-[#1E2A4F] bg-slate-100 px-2 py-0.5 border-l-2 border-[#1E2A4F] mb-1.5 print:bg-gray-100">
                1. Applicant Bio-Data & Passport Information
              </h2>
              <div className="grid grid-cols-4 gap-2 text-[10.5px] print:text-[9.5px] leading-tight">
                <div className="border-b border-gray-200 pb-1">
                  <span className="block text-[8px] uppercase text-gray-500 font-medium">Full Name</span>
                  <strong className="font-bold text-gray-900 uppercase">{result.applicant}</strong>
                </div>
                <div className="border-b border-gray-200 pb-1">
                  <span className="block text-[8px] uppercase text-gray-500 font-medium">Passport Number</span>
                  <strong className="font-mono font-bold text-gray-900 uppercase">{result.passport}</strong>
                </div>
                <div className="border-b border-gray-200 pb-1">
                  <span className="block text-[8px] uppercase text-gray-500 font-medium">Nationality</span>
                  <strong className="font-bold text-gray-900 uppercase">{result.nationality}</strong>
                </div>
                <div className="border-b border-gray-200 pb-1">
                  <span className="block text-[8px] uppercase text-gray-500 font-medium">Date of Birth</span>
                  <strong className="font-bold text-gray-900">{result.birthDate}</strong>
                </div>
              </div>
            </section>

            {/* Travel & Port Grid */}
            <section className="mb-2.5 print:mb-2">
              <h2 className="text-[9px] print:text-[8px] font-bold uppercase tracking-widest text-[#1E2A4F] bg-slate-100 px-2 py-0.5 border-l-2 border-[#1E2A4F] mb-1.5 print:bg-gray-100">
                2. Travel & Immigration Clearance Details
              </h2>
              <div className="grid grid-cols-3 gap-2 text-[10.5px] print:text-[9.5px] leading-tight">
                <div className="border-b border-gray-200 pb-1">
                  <span className="block text-[8px] uppercase text-gray-500 font-medium">Designated Entry Port</span>
                  <strong className="font-bold text-gray-900">{result.arrivalPort || 'Delhi Airport'}</strong>
                </div>
                <div className="border-b border-gray-200 pb-1">
                  <span className="block text-[8px] uppercase text-gray-500 font-medium">Effective Grant Date</span>
                  <strong className="font-bold text-gray-900">{result.issueDate || todayFormatted}</strong>
                </div>
                <div className="border-b border-gray-200 pb-1">
                  <span className="block text-[8px] uppercase text-gray-500 font-medium">Authorization Validity</span>
                  <strong className="font-bold text-gray-900">{result.expiryDate || '365 Days from First Entry'}</strong>
                </div>
              </div>
            </section>

            {/* Verification Milestones */}
            <section className="mb-2.5 print:mb-2">
              <h2 className="text-[9px] print:text-[8px] font-bold uppercase tracking-widest text-[#1E2A4F] bg-slate-100 px-2 py-0.5 border-l-2 border-[#1E2A4F] mb-1.5 print:bg-gray-100">
                3. Milestone Verification Audit Log
              </h2>
              <div className="space-y-1 text-[9.5px] print:text-[8.5px]">
                {result.events.map((event, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-0.5">
                    <span className="font-bold text-gray-800">✓ {event.label}</span>
                    <span className="text-gray-500 font-mono text-[8px]">{event.date || todayFormatted}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer with Seal & Barcode */}
            <footer className="border-t border-[#1E2A4F] pt-2 mt-2 print:pt-1.5 print:mt-1.5">
              <div className="flex items-center justify-between gap-4">
                <StatusBarcode text={result.id} />
                <div className="flex items-center gap-3">
                  <StatusSealStamp status={result.status} />
                  <div className="text-left text-[8.5px] print:text-[7.5px] text-gray-600 max-w-xs space-y-0.5 leading-tight">
                    <p className="font-bold text-gray-900">IMMIGRATION INSTRUCTIONS:</p>
                    <p>1. Present this printed status certificate along with your original passport.</p>
                    <p>2. Mandatory biometric enrolment (fingerprints & facial photograph) at port of entry.</p>
                  </div>
                </div>
              </div>
            </footer>

          </div>
        </article>
      )}

    </div>
  );
}


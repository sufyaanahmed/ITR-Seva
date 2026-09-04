import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────────────────────────
   INLINE CULTURAL ORNAMENTS & SVG SEALS (NO EMOJIS)
   Inspired by Indian architecture, Ashoka Chakra, Guilloche & Government Seals
───────────────────────────────────────────────────────────────────────────── */

/** Traditional Indian Mandala Corner Filigree for Certificate Borders */
function MandalaCorner({ className = '' }) {
  return (
    <svg viewBox="0 0 60 60" className={`w-7 h-7 ${className}`} fill="none">
      <path d="M2 2 L35 2 Q2 2 2 35 Z" fill="#D4AF37" fillOpacity="0.15" stroke="#D4AF37" strokeWidth="1" />
      <path d="M2 2 L22 2 Q2 2 2 22 Z" fill="#1E2A4F" fillOpacity="0.1" />
      <circle cx="10" cy="10" r="4" fill="#D4AF37" fillOpacity="0.5" />
      <path d="M2 18 Q18 18 18 2" stroke="#D4AF37" strokeWidth="0.75" fill="none" />
      <path d="M2 28 Q28 28 28 2" stroke="#1E2A4F" strokeWidth="0.75" strokeDasharray="1.5 1.5" fill="none" />
      <circle cx="20" cy="6" r="1" fill="#1E2A4F" />
      <circle cx="6" cy="20" r="1" fill="#1E2A4F" />
    </svg>
  );
}

/** Authentic Ashoka Chakra Background Watermark */
function AshokaChakraWatermark() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] overflow-hidden">
      <svg viewBox="0 0 200 200" className="w-[360px] h-[360px] text-[#1E2A4F]">
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

/** Vector Barcode Generator (Code-128 Look) */
function VectorBarcode({ text = 'FINAL-DEMO-2026' }) {
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
    <div className="flex flex-col items-center sm:items-start">
      <svg viewBox={`0 0 ${bars.length * 3} 30`} className="w-40 sm:w-44 h-7 print:h-6" preserveAspectRatio="none">
        {bars.map((width, idx) => (
          <rect
            key={idx}
            x={idx * 3}
            y="0"
            width={width * 0.8}
            height="30"
            fill="#1E2A4F"
          />
        ))}
      </svg>
      <span className="font-mono text-[9px] print:text-[8px] tracking-widest text-gray-600 mt-0.5 uppercase font-semibold">{text}</span>
    </div>
  );
}

/** Vector QR Code Graphic */
function VectorQrCode() {
  return (
    <svg viewBox="0 0 80 80" className="w-14 h-14 sm:w-16 sm:h-16 print:w-12 print:h-12 border border-gray-300 p-0.5 bg-white shrink-0" fill="#1E2A4F">
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

/** Official Verification Seal Stamp with Star */
function OfficialSealStamp() {
  return (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 print:w-16 print:h-16 flex items-center justify-center select-none shrink-0">
      <svg viewBox="0 0 120 120" className="w-full h-full text-[#8B1C1C]">
        <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" />
        <circle cx="60" cy="60" r="48" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="60" cy="60" r="36" fill="none" stroke="currentColor" strokeWidth="0.75" />
        <path id="sealTextPath" d="M 60,60 m -42,0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0" fill="none" />
        <text fontSize="7.5" fontWeight="bold" letterSpacing="1.2" fill="currentColor">
          <textPath href="#sealTextPath" startOffset="0%">
            BHARAT VISA SEVA · OFFICIAL SEAL ·
          </textPath>
        </text>
        <path d="M 60,46 L 63,55 L 72,55 L 65,61 L 67,70 L 60,65 L 53,70 L 55,61 L 48,55 L 57,55 Z" fill="currentColor" fillOpacity="0.85" />
        <text x="60" y="82" fontSize="6" fontWeight="bold" textAnchor="middle" fill="currentColor" letterSpacing="0.5">
          VALIDATED
        </text>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CEREMONIAL SUCCESS ANIMATION SCREEN (NO EMOJIS)
───────────────────────────────────────────────────────────────────────────── */

function VerificationCeremony({ reference, onComplete }) {
  const [stepStage, setStepStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStepStage(1), 700);
    const timer2 = setTimeout(() => setStepStage(2), 1500);
    const timer3 = setTimeout(() => setStepStage(3), 2300);
    const timerComplete = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timerComplete);
    };
  }, [onComplete]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-md w-full bg-white border border-[#D4AF37]/40 shadow-2xl rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden">
        
        {/* Background Mandala & Rings */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-[300px] h-[300px] animate-[spin_60s_linear_infinite] text-[#1E2A4F]">
            <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="4" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* Central Animated Seal */}
        <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
          {/* Pulsing ring */}
          <div className="absolute inset-0 rounded-full border-2 border-[#D4AF37] animate-ping opacity-30" />
          <div className="absolute -inset-2 rounded-full border border-dashed border-[#1E2A4F]/30 animate-[spin_20s_linear_infinite]" />
          
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0B2540] to-[#163A5F] border-2 border-[#D4AF37] flex items-center justify-center shadow-xl">
            <svg className="w-10 h-10 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
                className="stroke-dasharray-[24] stroke-dashoffset-[24] animate-[strokeDraw_0.8s_ease-out_forwards]"
              />
            </svg>
          </div>
        </div>

        {/* Ceremonial Titles */}
        <span className="text-[11px] font-sans font-bold uppercase tracking-[0.25em] text-[#C4762A] block mb-1">
          Government Protocol Verification
        </span>
        <h2 className="text-2xl font-serif font-bold text-[#1E2A4F] tracking-wide mb-6">
          Sealing Application Dossier
        </h2>

        {/* Progressive Verification Steps */}
        <div className="space-y-3 text-left mb-8 max-w-xs mx-auto">
          {/* Check 1 */}
          <div className={`flex items-center gap-3 text-xs transition-all duration-300 ${stepStage >= 1 ? 'text-gray-900 font-medium' : 'text-gray-400 opacity-40'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${stepStage >= 1 ? 'bg-[#176B45] text-white' : 'bg-gray-200 text-gray-500'}`}>
              {stepStage >= 1 ? '✓' : '1'}
            </span>
            <span>Cryptographic Checksum Verified</span>
          </div>

          {/* Check 2 */}
          <div className={`flex items-center gap-3 text-xs transition-all duration-300 ${stepStage >= 2 ? 'text-gray-900 font-medium' : 'text-gray-400 opacity-40'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${stepStage >= 2 ? 'bg-[#176B45] text-white' : 'bg-gray-200 text-gray-500'}`}>
              {stepStage >= 2 ? '✓' : '2'}
            </span>
            <span>Immigration Declarations Validated</span>
          </div>

          {/* Check 3 */}
          <div className={`flex items-center gap-3 text-xs transition-all duration-300 ${stepStage >= 3 ? 'text-gray-900 font-medium' : 'text-gray-400 opacity-40'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${stepStage >= 3 ? 'bg-[#176B45] text-white' : 'bg-gray-200 text-gray-500'}`}>
              {stepStage >= 3 ? '✓' : '3'}
            </span>
            <span>Electronic Dossier Reference Issued</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-6">
          <div
            className="bg-gradient-to-r from-[#D4AF37] to-[#1E2A4F] h-1.5 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min(100, stepStage * 34)}%` }}
          />
        </div>

        {/* Instant Skip Action */}
        <button
          type="button"
          onClick={onComplete}
          className="text-xs text-[#1E2A4F] hover:text-[#C4762A] font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          View Official Dossier →
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN DOSSIER COMPONENT (STRICT 1-PAGE PRINT FORMAT)
───────────────────────────────────────────────────────────────────────────── */

export default function OfficialApplicationDossier({ state }) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('ceremony'); // 'ceremony' | 'dossier'
  const [copied, setCopied] = useState(false);
  const data = state?.data || {};
  const isVoa = state?.outcome === 'form-prepared';
  const reference = isVoa
    ? state?.identifiers?.formPreparationId || 'VOA-DEMO-RECORD'
    : state?.identifiers?.finalDemoId || 'FINAL-DEMO-RECORD';
  const temporaryId = state?.identifiers?.temporaryDemoId || 'TMP-DEMO-RECORD';

  const applicantName = `${data.given_name || 'DEMO'} ${data.surname || 'APPLICANT'}`.trim();
  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();

  const handleCopyJson = () => {
    const exportData = {
      reference,
      temporaryId,
      application_type: data.application_type,
      generated_at: new Date().toISOString(),
      applicant: {
        name: applicantName,
        nationality: data.nationality,
        passport_number: data.passport_number,
        date_of_birth: data.date_of_birth,
      },
      travel: {
        visa_category: data.visa_category,
        arrival_port: data.arrival_port,
        expected_arrival: data.expected_arrival_date || data.arrival_date,
      },
      data_fields: data,
      documents_metadata: state.docs || [],
      disclaimer: 'SYNTHETIC DEMONSTRATION RECORD - NOT A GOVERNMENT OF INDIA VISA',
    };
    navigator.clipboard?.writeText(JSON.stringify(exportData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (phase === 'ceremony') {
    return (
      <VerificationCeremony
        reference={reference}
        onComplete={() => setPhase('dossier')}
      />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-3 sm:px-4 font-sans animate-[fadeIn_0.6s_ease-out]">
      
      {/* ── EMBEDDED PRINT STYLES (STRICT 1-PAGE FIT) ── */}
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
          .dossier-print-container {
            border: 1.5px solid #000000 !important;
            box-shadow: none !important;
            padding: 14px 18px !important;
            margin: 0 auto !important;
            max-height: 282mm !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            overflow: hidden !important;
          }
          .print-hidden-toolbar {
            display: none !important;
          }
        }
      `}</style>

      {/* ── TOP ACTION BAR (SCREEN ONLY) ── */}
      <div className="print-hidden-toolbar bg-gradient-to-r from-[#0B2540] via-[#163A5F] to-[#0B2540] rounded-xl p-5 sm:p-6 text-white shadow-xl mb-6 border border-[#D4AF37]/30">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#176B45] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              ✓
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-serif font-bold text-white leading-tight">
                {isVoa ? 'Visa on Arrival Summary Ready' : 'Electronic Travel Dossier Generated'}
              </h1>
              <p className="text-xs text-gray-300">
                Official format • Formatted for 1-Page A4 PDF print
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 items-center">
            <button
              type="button"
              onClick={() => window.print()}
              className="bg-gradient-to-r from-[#D4AF37] to-[#C9933A] text-[#1E2A4F] px-5 py-2 font-bold text-xs uppercase tracking-wider rounded shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print 1-Page PDF
            </button>
            <button
              type="button"
              onClick={handleCopyJson}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 font-bold text-xs uppercase tracking-wider rounded transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? 'Copied!' : 'Copy JSON'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-white/70 hover:text-white text-xs font-bold uppercase tracking-wider px-2 py-2 transition-colors cursor-pointer"
            >
              Home →
            </button>
          </div>
        </div>
      </div>

      {/* ── 1-PAGE OFFICIAL PRINTABLE DOSSIER ── */}
      <article className="dossier-print-container relative bg-white text-gray-900 border-2 border-[#D4AF37]/50 rounded-lg p-5 sm:p-7 shadow-2xl overflow-hidden">
        
        {/* Cultural Mandala Corner Filigrees */}
        <MandalaCorner className="absolute top-1 left-1 print:w-5 print:h-5" />
        <MandalaCorner className="absolute top-1 right-1 transform rotate-90 print:w-5 print:h-5" />
        <MandalaCorner className="absolute bottom-1 right-1 transform rotate-180 print:w-5 print:h-5" />
        <MandalaCorner className="absolute bottom-1 left-1 transform -rotate-90 print:w-5 print:h-5" />

        {/* Ashoka Chakra Background Watermark */}
        <AshokaChakraWatermark />

        {/* Inner Border Frame */}
        <div className="relative z-10 border border-[#1E2A4F]/20 p-4 sm:p-5 rounded print:p-2.5 print:border-black/40">
          
          {/* Header Section */}
          <header className="border-b border-[#1E2A4F] pb-3 mb-3 print:pb-2 print:mb-2">
            <div className="flex items-center justify-between gap-3">
              {/* National Emblem & Title */}
              <div className="flex items-center gap-3">
                <img
                  src="/emblem.svg"
                  alt="Emblem of India"
                  className="h-12 sm:h-14 print:h-10 w-auto opacity-95 shrink-0"
                />
                <div className="flex flex-col">
                  <span className="text-[10px] print:text-[9px] font-serif font-bold uppercase tracking-[0.2em] text-[#8B1C1C]">
                    भारत सरकार · GOVERNMENT OF INDIA
                  </span>
                  <span className="text-sm sm:text-base print:text-xs font-serif font-bold text-[#1E2A4F] tracking-wide">
                    अखिल भारतीय ई-वीज़ा पोर्टल · BHARAT VISA SEVA
                  </span>
                  <span className="text-[9px] print:text-[8px] font-sans font-bold uppercase tracking-widest text-[#D4AF37] print:text-black">
                    {isVoa ? 'IMMIGRATION TRANSIT & ARRIVAL DESK' : 'ELECTRONIC TRAVEL AUTHORIZATION (ETA) DOSSIER'}
                  </span>
                </div>
              </div>

              {/* QR Code & Issuance Badge */}
              <div className="flex items-center gap-2">
                <VectorQrCode />
                <div className="text-right hidden sm:block print:block">
                  <span className="text-[8px] uppercase tracking-wider text-gray-500 block font-bold">Issued</span>
                  <span className="text-[10px] print:text-[9px] font-mono font-bold text-[#1E2A4F]">{todayFormatted}</span>
                  <span className="text-[8px] uppercase tracking-wider text-[#176B45] font-bold block">VERIFIED</span>
                </div>
              </div>
            </div>

            {/* Sub-header Title Bar */}
            <div className="mt-2 bg-[#FAF7F0] border border-[#D4AF37]/30 px-2 py-0.5 rounded text-center print:bg-gray-50 print:py-0.5">
              <p className="text-[8.5px] print:text-[7.5px] font-serif font-bold text-[#8A5A00] tracking-wider uppercase">
                OFFICIAL ELECTRONIC TRAVEL AUTHORIZATION RECORD · REPUBLIC OF INDIA
              </p>
            </div>
          </header>

          {/* Reference Meta Box */}
          <section className="bg-slate-50 border border-slate-200 rounded p-2.5 mb-3 grid grid-cols-3 gap-2 print:bg-white print:border-black/20 print:p-1.5 print:mb-2">
            <div>
              <span className="block text-[8.5px] print:text-[7.5px] font-bold uppercase text-gray-500">Application Reference</span>
              <strong className="font-mono text-xs print:text-[10px] text-[#1E2A4F] font-bold break-all">
                {reference}
              </strong>
            </div>
            <div>
              <span className="block text-[8.5px] print:text-[7.5px] font-bold uppercase text-gray-500">Service Category</span>
              <strong className="text-xs print:text-[10px] text-[#1E2A4F] uppercase font-bold">
                {data.visa_category ? `${data.visa_category} Visa` : (isVoa ? 'Visa on Arrival' : 'Electronic Visa (e-Visa)')}
              </strong>
            </div>
            <div>
              <span className="block text-[8.5px] print:text-[7.5px] font-bold uppercase text-gray-500">Session ID</span>
              <span className="font-mono text-[10px] print:text-[8.5px] text-gray-700 font-medium break-all">{temporaryId}</span>
            </div>
          </section>

          {/* ── SECTION A: APPLICANT BIO-DATA ── */}
          <section className="mb-3 print:mb-2">
            <h2 className="text-[9.5px] print:text-[8.5px] font-bold uppercase tracking-widest text-[#1E2A4F] bg-slate-100 px-2.5 py-0.5 border-l-2 border-[#1E2A4F] mb-1.5 print:bg-gray-100">
              A. Applicant Bio-Data & Passport Information
            </h2>
            <div className="grid grid-cols-4 gap-2 text-[11px] print:text-[9.5px] print:gap-1.5 leading-tight">
              <div className="border-b border-gray-200 pb-1">
                <span className="block text-[8.5px] print:text-[7.5px] uppercase text-gray-500 font-medium">Surname</span>
                <strong className="font-bold text-gray-900 uppercase">{data.surname || '—'}</strong>
              </div>
              <div className="border-b border-gray-200 pb-1">
                <span className="block text-[8.5px] print:text-[7.5px] uppercase text-gray-500 font-medium">Given Name(s)</span>
                <strong className="font-bold text-gray-900 uppercase">{data.given_name || '—'}</strong>
              </div>
              <div className="border-b border-gray-200 pb-1">
                <span className="block text-[8.5px] print:text-[7.5px] uppercase text-gray-500 font-medium">Nationality</span>
                <strong className="font-bold text-gray-900 uppercase">{data.nationality || '—'}</strong>
              </div>
              <div className="border-b border-gray-200 pb-1">
                <span className="block text-[8.5px] print:text-[7.5px] uppercase text-gray-500 font-medium">Gender</span>
                <strong className="font-bold text-gray-900 uppercase">{data.gender || '—'}</strong>
              </div>
              <div className="border-b border-gray-200 pb-1">
                <span className="block text-[8.5px] print:text-[7.5px] uppercase text-gray-500 font-medium">Date of Birth</span>
                <strong className="font-bold text-gray-900">{data.date_of_birth || '—'}</strong>
              </div>
              <div className="border-b border-gray-200 pb-1">
                <span className="block text-[8.5px] print:text-[7.5px] uppercase text-gray-500 font-medium">Place of Birth</span>
                <strong className="font-bold text-gray-900 uppercase">{data.place_of_birth || '—'}</strong>
              </div>
              <div className="border-b border-gray-200 pb-1">
                <span className="block text-[8.5px] print:text-[7.5px] uppercase text-gray-500 font-medium">Passport Number</span>
                <strong className="font-mono font-bold text-gray-900 uppercase">{data.passport_number || '—'}</strong>
              </div>
              <div className="border-b border-gray-200 pb-1">
                <span className="block text-[8.5px] print:text-[7.5px] uppercase text-gray-500 font-medium">Passport Expiry</span>
                <strong className="font-bold text-gray-900">{data.passport_expiry_date || '—'}</strong>
              </div>
            </div>
          </section>

          {/* ── SECTION B: TRAVEL ITINERARY ── */}
          <section className="mb-3 print:mb-2">
            <h2 className="text-[9.5px] print:text-[8.5px] font-bold uppercase tracking-widest text-[#1E2A4F] bg-slate-100 px-2.5 py-0.5 border-l-2 border-[#1E2A4F] mb-1.5 print:bg-gray-100">
              B. Travel Itinerary & Ports of Entry
            </h2>
            <div className="grid grid-cols-4 gap-2 text-[11px] print:text-[9.5px] print:gap-1.5 leading-tight">
              <div className="border-b border-gray-200 pb-1">
                <span className="block text-[8.5px] print:text-[7.5px] uppercase text-gray-500 font-medium">Designated Entry Port</span>
                <strong className="font-bold text-gray-900 uppercase">{data.arrival_port || 'Delhi Airport'}</strong>
              </div>
              <div className="border-b border-gray-200 pb-1">
                <span className="block text-[8.5px] print:text-[7.5px] uppercase text-gray-500 font-medium">Expected Arrival</span>
                <strong className="font-bold text-gray-900">{data.expected_arrival_date || data.arrival_date || '—'}</strong>
              </div>
              <div className="border-b border-gray-200 pb-1">
                <span className="block text-[8.5px] print:text-[7.5px] uppercase text-gray-500 font-medium">Intended Exit Port</span>
                <strong className="font-bold text-gray-900 uppercase">{data.intended_exit_port || 'Same as arrival'}</strong>
              </div>
              <div className="border-b border-gray-200 pb-1">
                <span className="block text-[8.5px] print:text-[7.5px] uppercase text-gray-500 font-medium">Places to Visit</span>
                <strong className="font-bold text-gray-900 uppercase">{data.places_to_visit || 'Delhi, Agra'}</strong>
              </div>
            </div>
          </section>

          {/* ── SECTION C: RESIDENCE & REFERENCES ── */}
          <section className="mb-3 print:mb-2">
            <h2 className="text-[9.5px] print:text-[8.5px] font-bold uppercase tracking-widest text-[#1E2A4F] bg-slate-100 px-2.5 py-0.5 border-l-2 border-[#1E2A4F] mb-1.5 print:bg-gray-100">
              C. Contact, Residence & References
            </h2>
            <div className="grid grid-cols-2 gap-2 text-[10.5px] print:text-[9px] leading-tight">
              <div className="border border-gray-200 p-1.5 rounded print:p-1">
                <span className="block text-[8px] uppercase text-gray-500 font-bold">Present Residential Address</span>
                <p className="text-gray-800 truncate">{data.present_address || data.permanent_address || '—'}</p>
                <p className="text-gray-600 font-mono text-[9px] print:text-[8px]">Phone: {data.phone_abroad || '—'}</p>
              </div>
              <div className="border border-gray-200 p-1.5 rounded print:p-1">
                <span className="block text-[8px] uppercase text-gray-500 font-bold">Reference in India</span>
                <p className="text-gray-800 truncate">{data.india_reference || 'Demo Hotel, New Delhi'}</p>
                <p className="text-gray-600 font-mono text-[9px] print:text-[8px]">Contact: {data.phone_india || '+91-11-00000000'}</p>
              </div>
            </div>
          </section>

          {/* ── SECTION D: VALIDATION & OFFICIAL SEAL ── */}
          <footer className="border-t border-[#1E2A4F] pt-2 mt-2 print:pt-1.5 print:mt-1.5">
            <div className="flex items-center justify-between gap-4">
              <VectorBarcode text={reference} />
              <div className="flex items-center gap-3">
                <OfficialSealStamp />
                <div className="text-left text-[9px] print:text-[7.5px] text-gray-600 max-w-xs space-y-0.5 leading-tight">
                  <p className="font-bold text-gray-900">IMMIGRATION INSTRUCTIONS:</p>
                  <p>1. Carry printed physical copy of ETA during arrival.</p>
                  <p>2. Mandatory biometric enrolment at immigration counters.</p>
                </div>
              </div>
            </div>
          </footer>

        </div>
      </article>
    </div>
  );
}

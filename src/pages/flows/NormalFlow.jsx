import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { getEvisaWizardGate } from '../../domain/visaEligibility';

const EVISA_PORTAL = 'https://indianvisaonline.gov.in/evisa/';

const stages = [
  ['Eligibility and route', 'Confirm current nationality, passport and origin eligibility; six-month passport validity, two blank pages, onward/return travel and sufficient funds; then choose a current purpose and permitted duration. Afghan nationals use the dedicated Afghan route. Pakistani-passport and certain Pakistani-origin applicants use the regular/paper route.'],
  ['Registration', 'Enter nationality/region, passport type, designated arrival port, birth date, confirmed email, expected arrival date and exact purpose. The official portal also requires its acknowledgements and CAPTCHA.'],
  ['Temporary Application ID', 'Retain the temporary ID used to resume an unfinished application. It is distinct from the final Application ID used later for payment and status.'],
  ['Applicant and passport', 'Provide passport-exact identity, previous-name and nationality details, birth information, national ID, religion, visible mark, education, citizenship acquisition and any other passport or identity certificate.'],
  ['Address, family and occupation', 'Complete present/permanent addresses, contacts, parent and spouse details where applicable, origin questions, employment and any military, police or security-service history.'],
  ['Travel, visa history and references', 'Declare places to visit, arrival and intended exit ports, prior India visits or refusals, countries and SAARC travel, accommodation or operator details, and references in India and your home country.'],
  ['Security declarations', 'Answer every official background and security question. Yes answers require details, followed by an explicit accuracy and consequences declaration.'],
  ['Photo and documents', 'Upload the compliant JPEG photograph, passport bio-page PDF and every purpose-specific PDF. Missing or invalid evidence must block final verification.'],
  ['Review and final application', 'Review every field and upload before finalizing. After verification, retain the final Application ID and use the official payment or pay-later route where applicable.'],
  ['Payment, scrutiny and decision', 'Use the official portal to pay or verify payment, respond to any official re-upload request, check status and print the application or ETA. Fees and decisions depend on the current official rules.'],
  ['Before travel and arrival', 'Travel only after the ETA shows GRANTED. Print and carry it, use the application passport or carry both old and new passports, complete e-Arrival, and expect biometrics at immigration.'],
];

export default function NormalFlow() {
  const navigate = useNavigate();
  const { state, updateState } = useStore();
  const routedByFinder = state.data?.application_type === 'evisa' && getEvisaWizardGate(state.data).allowed;

  const startDemo = () => {
    updateState({
      type: 'evisa',
      step: 0,
      data: {
        ...state.data,
        application_type: 'evisa',
        demo_only: true,
      },
      docs: [],
      submitted: false,
    });
    navigate('/apply');
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="mb-10 border-b border-border-dark pb-8">
        <p className="uppercase tracking-widest text-sm text-primary mb-2 font-bold">Current journey briefing</p>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">How the Indian e-Visa journey works</h1>
        <p className="text-xl text-text-secondary leading-relaxed">The e-Visa route is more than a short online form: it includes eligibility, registration, identity and history, security declarations, evidence, verification, payment, decision, and arrival-readiness stages.</p>
      </div>

      <div className="mb-10 bg-amber-50 border border-amber-300 p-5 rounded">
        <p className="font-bold text-amber-950 mb-1">Educational prototype—not an authorized application portal</p>
        <p className="text-sm text-amber-900">The local wizard is an incomplete interaction demo. It does not submit data to the Government of India, make payment, issue a valid Application ID, or issue an ETA. Use the official portal for a real application.</p>
      </div>

      <section className="bg-blue-50 border-l-4 border-primary p-6 mb-12">
        <h2 className="text-xl font-bold mb-4 text-[#081e33]">Prepare official-format evidence</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-800">
          <li>Recent square front-facing photograph with a plain light background: <strong>JPEG, 10 KB–1 MB</strong>.</li>
          <li>Passport bio page and supporting documents: <strong>PDF, 10–300 KB each</strong>.</li>
          <li>Purpose-specific evidence in English, following the live checklist for the selected service and subtype.</li>
        </ul>
        <p className="text-sm text-blue-950 mt-4">The Government portal&apos;s live eligibility, purpose, port, document and fee data is authoritative and can change. The prototype does not yet enforce these rules server-side.</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">End-to-end application stages</h2>
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {stages.map(([title, detail], index) => (
            <li key={title} className={`border border-border p-6 rounded bg-white ${index === stages.length - 1 ? 'md:col-span-2' : ''}`}>
              <div className="flex gap-4">
                <span className="flex-none w-9 h-9 rounded-full bg-primary text-white grid place-items-center font-bold">{index + 1}</span>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-primary">{title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{detail}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12 bg-gray-50 border border-border p-7 rounded">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Payment, timing and outcome</h2>
        <ul className="list-disc pl-6 space-y-3 text-text-secondary">
          <li>Apply within the official window for your selected service and generally at least four days before arrival where the live rules require it.</li>
          <li>Fees vary by nationality and category, may include the published bank charge, and are non-refundable regardless of outcome.</li>
          <li>No 3–5-business-day promise is made here; the reviewed official material does not publish that guarantee.</li>
          <li>An acknowledgement or payment is not permission to travel. Confirm that the official ETA status is <strong>GRANTED</strong> before departure.</li>
        </ul>
      </section>

      <section className="mt-12 border-t border-gray-200 pt-8">
        <h2 className="text-xl font-bold mb-3 text-gray-900">Continue</h2>
        {!routedByFinder && (
          <div className="mb-6 border border-amber-300 bg-amber-50 p-5 rounded text-amber-950">
            <strong className="block mb-1">Eligibility has not been reviewed</strong>
            <p className="text-sm">Opening this briefing directly does not establish e-Visa eligibility. Complete the route finder before starting the local wizard.</p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          <a href={EVISA_PORTAL} target="_blank" rel="noreferrer" className="btn-primary">Open official e-Visa portal ↗</a>
          {routedByFinder
            ? <button type="button" onClick={startDemo} className="btn-secondary">Explore local wizard</button>
            : <button type="button" onClick={() => navigate('/guide/visa-finder')} className="btn-secondary">Check preliminary eligibility</button>}
          <Link to="/e-arrival" className="text-primary underline font-bold self-center sm:ml-2">Review e-Arrival step</Link>
        </div>
        <p className="text-xs text-gray-500 mt-4">The local option preserves the finder’s reviewed route, nationality, purpose, and category. It saves only for the current browser-tab session.</p>
      </section>

      <p className="mt-8 text-xs text-gray-500">Guidance reviewed 27 August 2026. The live form beyond CAPTCHA and the redirected official status endpoint could not be fully verified during the audit.</p>
    </div>
  );
}

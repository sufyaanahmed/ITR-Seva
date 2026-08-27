import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

const VOA_PURPOSES = [
  { id: 'tourist', label: 'Tourism / Sightseeing' },
  { id: 'business', label: 'Business Meetings' },
  { id: 'medical', label: 'Medical Treatment' },
  { id: 'conference', label: 'Conference' },
];

const ELIGIBILITY_CHECKS = [
  { label: 'You are a citizen of Japan, South Korea, or UAE.', note: '' },
  { label: 'UAE nationals: You have previously obtained an Indian e-Visa or paper visa.', note: 'First-time UAE visitors are not eligible for VoA.' },
  { label: 'You are visiting for Tourism, Business, Conference, or Medical purposes only.', note: '' },
  { label: 'Your intended stay is no more than 60 days.', note: '' },
  { label: 'You have no residence or occupation in India.', note: '' },
  { label: 'Your passport is valid for at least 6 months from the date of arrival.', note: '' },
  { label: 'You hold a return or onward ticket.', note: '' },
  { label: 'You are not traveling on a Diplomatic or Official passport.', note: 'VoA is not available to Diplomatic/Official passport holders.' },
];

export default function VoaFlow() {
  const navigate = useNavigate();
  const { updateState } = useStore();
  const [selectedPurpose, setSelectedPurpose] = useState(null);
  const [eligibilityAcknowledged, setEligibilityAcknowledged] = useState(false);

  const startApplication = () => {
    if (!selectedPurpose || !eligibilityAcknowledged) return;
    updateState({
      type: 'voa',
      step: 0,
      data: {
        application_type: 'voa',
        visa_category: selectedPurpose,
      },
      docs: [],
      submitted: false,
    });
    navigate('/apply');
  };

  const canProceed = selectedPurpose && eligibilityAcknowledged;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-10 border-b border-border-dark pb-8">
        <p className="uppercase tracking-widest text-sm text-primary mb-2 font-bold">Pre-Application Briefing</p>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Visa-on-Arrival</h1>
        <p className="text-xl text-text-secondary leading-relaxed">
          Visa-on-Arrival is available exclusively to nationals of <strong>Japan</strong>, <strong>South Korea</strong>, and the <strong>United Arab Emirates (UAE)</strong>. No prior online application is needed — you fill out a form and pay at the airport.
        </p>
      </div>

      <div className="space-y-10">

        {/* Unified Country Card */}
        <section className="border border-border-dark rounded overflow-hidden">
          <div className="bg-[#0b2540] text-white px-6 py-4">
            <h2 className="font-bold text-lg tracking-wide">Eligible Countries</h2>
            <p className="text-sm text-blue-200 mt-1">A single Visa-on-Arrival facility applies to all three countries below.</p>
          </div>
          <div className="grid grid-cols-3 divide-x divide-border-dark">
            {['🇯🇵 Japan', '🇰🇷 South Korea', '🇦🇪 United Arab Emirates'].map(country => (
              <div key={country} className="p-5 text-center bg-gray-50">
                <p className="font-bold text-gray-900 text-sm">{country}</p>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 border-t border-amber-200 px-6 py-3 text-sm text-amber-800">
            <strong>UAE nationals only:</strong> You must have previously obtained an Indian e-Visa or paper visa. First-time UAE visitors must apply for an e-Visa before travel.
          </div>
        </section>

        {/* Eligibility Checklist */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Eligibility Requirements</h2>
          <p className="text-text-secondary mb-6">You must meet all of the following conditions to be eligible for Visa-on-Arrival:</p>
          <div className="space-y-3">
            {ELIGIBILITY_CHECKS.map((check, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-50 border border-border p-4 rounded">
                <span className="text-green-600 font-bold text-lg leading-none mt-0.5">✓</span>
                <div>
                  <p className="font-medium text-gray-800">{check.label}</p>
                  {check.note && <p className="text-xs text-amber-700 mt-1">{check.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Purpose of Visit */}
        <section>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Purpose of Visit</h2>
          <p className="text-text-secondary mb-6">Select your primary purpose. VoA is available for the following categories only:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VOA_PURPOSES.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPurpose(p.id)}
                className={`p-5 text-left border-2 rounded transition-all duration-200 ${
                  selectedPurpose === p.id
                    ? 'border-primary bg-blue-50 shadow-sm'
                    : 'border-border-dark bg-gray-50 hover:border-primary-light'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedPurpose === p.id ? 'border-primary' : 'border-gray-400'}`}>
                    {selectedPurpose === p.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <span className={`font-bold ${selectedPurpose === p.id ? 'text-primary' : 'text-gray-800'}`}>{p.label}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Arrival Process */}
        <section className="bg-blue-50 border-l-4 border-primary p-6">
          <h2 className="text-xl font-bold mb-4 text-[#081e33]">Arrival Process in India</h2>
          <ol className="list-decimal pl-5 space-y-4 text-gray-800">
            <li>
              <strong>Arrive at a designated airport:</strong> Bangalore, Chennai, Delhi, Hyderabad, Kolkata, or Mumbai.
            </li>
            <li>
              <strong>Complete the VoA form:</strong> Fill in the application form and disembarkation card at the immigration counter.
            </li>
            <li>
              <strong>Submit documents</strong> to the Visa Officer (passport, return ticket, proof of funds).
            </li>
            <li>
              <strong>Pay the fee:</strong> ₹2,000 per passenger (including children).
            </li>
            <li>
              If approved, you receive a <strong>Double-Entry VoA valid for up to 60 days</strong>.
            </li>
          </ol>
        </section>

        {/* Acknowledgement */}
        <section>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={eligibilityAcknowledged}
              onChange={e => setEligibilityAcknowledged(e.target.checked)}
              className="mt-1 w-5 h-5 accent-[#0b2540] flex-shrink-0"
            />
            <span className="text-gray-700 font-medium">
              I confirm that I meet all the eligibility requirements listed above and understand that entry is subject to assessment by the Immigration Officer at the airport.
            </span>
          </label>
        </section>

        <div className="mt-12 text-center pt-8 border-t border-gray-200">
          <button
            onClick={startApplication}
            disabled={!canProceed}
            className={`px-8 py-4 font-bold rounded shadow transition inline-block text-lg ${
              canProceed
                ? 'bg-[#0b2540] text-white hover:bg-[#163a5f]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Generate My VoA Form &rarr;
          </button>
          {!canProceed && <p className="text-sm text-gray-400 mt-3">Select your purpose and confirm eligibility to continue.</p>}
          {canProceed && <p className="text-sm text-gray-500 mt-3">This generates a pre-filled form to bring to the airport. No fees are paid online.</p>}
        </div>
      </div>
    </div>
  );
}


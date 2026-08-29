import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

export default function RegularFlow() {
  const navigate = useNavigate();
  const { state, updateState } = useStore();
  const routedByFinder = state.data?.application_type === 'regular' && Boolean(state.data?.eligibility_ruleset_id);

  const startPreparation = () => {
    updateState({
      type: 'regular',
      step: 0,
      data: {
        ...state.data,
        application_type: 'regular',
        // A trip purpose is not always the legal visa category. Require an explicit choice in the wizard.
        visa_category: '',
        demo_only: true,
      },
      docs: [],
      outcome: null,
      submitted: false,
    });
    navigate('/apply');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-10 border-b border-border-dark pb-8">
        <p className="uppercase tracking-widest text-sm text-primary mb-2 font-bold">Paper-route preparation briefing</p>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Regular / Paper Visa Guide</h1>
        <p className="text-xl text-text-secondary leading-relaxed mb-4">
          Regular-visa categories and filing procedures depend on nationality, purpose, residence, and the Indian Mission/Post responsible for the application.
        </p>
        <p className="text-sm text-text-secondary">
          This educational demo can organise typical information, but it does not identify a universally correct category, submit a form, book an appointment, or replace Mission/Post instructions.
        </p>
      </div>

      {!routedByFinder && (
        <div className="bg-amber-50 border border-amber-300 p-6 rounded mb-10">
          <h2 className="font-bold text-amber-950 text-lg mb-2">Route not yet reviewed</h2>
          <p className="text-sm text-amber-900 mb-5">Opening this page directly does not establish that a regular/paper visa is the right route. Complete the finder before starting a local preparation.</p>
          <button type="button" onClick={() => navigate('/guide/visa-finder')} className="btn-primary">Check my preliminary route</button>
        </div>
      )}

      {routedByFinder && (
        <div className="bg-blue-50 border border-blue-200 p-5 rounded mb-10 text-sm text-blue-950">
          <strong className="block mb-1">Preliminary finder handoff</strong>
          <p>The reviewed rules snapshot directed these answers to a paper-visa or official-review path. Your intended purpose is recorded as <strong>{state.data.purpose_intent?.replace(/-/g, ' ') || 'not specified'}</strong>, but you must still select and verify the applicable legal category.</p>
        </div>
      )}

      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#0b2540] text-white font-bold flex items-center justify-center flex-shrink-0 text-xl">1</div>
            <h2 className="text-2xl font-bold text-gray-900">Confirm the responsible Mission/Post</h2>
          </div>
          <div className="ml-14 bg-gray-50 p-6 rounded border border-gray-200">
            <p className="text-gray-700 mb-4">Before using any checklist, confirm where you are permitted to apply and read that Mission/Post’s current category instructions. Depending on the route, you may need:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>An eligible passport and any required residence evidence</li>
              <li>Identity, address, family, employment, and travel-history details</li>
              <li>Purpose-specific letters, approvals, or relationship evidence</li>
              <li>References in India and in the home or residence country</li>
            </ul>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#0b2540] text-white font-bold flex items-center justify-center flex-shrink-0 text-xl">2</div>
            <h2 className="text-2xl font-bold text-gray-900">Prepare category-specific evidence</h2>
          </div>
          <div className="ml-14">
            <p className="text-gray-700 mb-4">Photo format, upload steps, physical copies, translations, attestations, passport validity, and blank-page rules can vary by category and Mission/Post. The demo therefore records document-readiness metadata without asserting universal regular-visa upload limits.</p>
            <div className="bg-blue-50 border border-blue-100 p-4 rounded text-sm text-blue-900">
              <strong className="block mb-1">Do not reuse e-Visa upload rules automatically</strong>
              The standard e-Visa JPEG/PDF limits are not presented here as universal paper-visa requirements. Check the current official checklist for the selected category and filing location.
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#0b2540] text-white font-bold flex items-center justify-center flex-shrink-0 text-xl">3</div>
            <h2 className="text-2xl font-bold text-gray-900">Follow the published filing procedure</h2>
          </div>
          <div className="ml-14">
            <p className="text-gray-700 mb-4">The responsible service may require an online form, printout and signature, physical passport, appointment, biometrics, interview, fee, or additional documents. Availability and sequence must be taken from the current official instructions—not inferred from this prototype.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="border border-gray-200 p-4 rounded">
                <strong className="block text-gray-900 mb-2">Appointment or service provider</strong>
                <p className="text-sm text-gray-600">Use only the provider named by the relevant Indian Mission/Post. An appointment is not universally required or offered in the same way.</p>
              </div>
              <div className="border border-gray-200 p-4 rounded">
                <strong className="block text-gray-900 mb-2">Fee and decision</strong>
                <p className="text-sm text-gray-600">Fees, payment channels, processing, and decisions vary. This demo does not calculate, collect, predict, or verify them.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {routedByFinder && (
        <div className="mt-12 flex justify-center">
          <button type="button" onClick={startPreparation} className="bg-[#0b2540] text-white px-8 py-3 font-bold rounded shadow hover:bg-[#163a5f] transition inline-block text-lg">Start local demo preparation &rarr;</button>
        </div>
      )}


    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getRequiredDocuments } from '../../components/SmartDocuments';
import { useStore } from '../../store';

function DraftPrivacyControls({ persistence, onErase }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const erase = async () => {
    setBusy(true);
    const result = await onErase();
    if (!result?.ok) setBusy(false);
  };

  return (
    <section className="mt-8 border border-amber-300 bg-amber-50 p-5 rounded" aria-labelledby="dashboard-retention-title">
      <h2 id="dashboard-retention-title" className="font-bold text-amber-950 mb-2">This-tab retention and erasure</h2>
      <p className="text-sm text-amber-900 mb-2">Draft fields are kept only in this tab&apos;s session storage. Refreshing this tab can restore them; a separately opened tab or a browser restart will not. File contents are never retained.</p>
      <p className="text-sm text-amber-900 mb-4">Older builds may have left a persistent browser copy. This version never reads that legacy data and removes it only when you explicitly erase it below.</p>
      <p className={`text-sm mb-4 ${persistence?.status === 'error' ? 'font-bold text-red-800' : 'text-amber-950'}`} role={persistence?.status === 'error' ? 'alert' : 'status'}>
        {persistence?.message || 'Session save status is unavailable.'}
      </p>

      {!confirming ? (
        <button type="button" onClick={() => setConfirming(true)} className="px-4 py-2 border border-red-700 text-red-800 bg-white font-bold rounded hover:bg-red-50">Erase this draft and legacy browser data</button>
      ) : (
        <div role="alertdialog" aria-labelledby="dashboard-erase-title" aria-describedby="dashboard-erase-description" className="border border-red-300 bg-white p-4 rounded">
          <h3 id="dashboard-erase-title" className="font-bold text-red-900 mb-2">Erase local demo data?</h3>
          <p id="dashboard-erase-description" className="text-sm text-red-800 mb-4">This clears the visible draft, this tab&apos;s session copy, and any legacy localStorage or IndexedDB copy for this prototype. It cannot be undone.</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={erase} disabled={busy} className="px-4 py-2 bg-red-700 text-white font-bold rounded disabled:opacity-60">{busy ? 'Erasing…' : 'Yes, erase local data'}</button>
            <button type="button" onClick={() => setConfirming(false)} disabled={busy} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}
    </section>
  );
}

const flowDetails = {
  evisa: {
    label: 'Standard e-Visa demo',
    steps: [
      ['registration', 'Registration & route'],
      ['identity', 'Identity'],
      ['passport', 'Passport'],
      ['family', 'Address & family'],
      ['employment', 'Employment'],
      ['travel', 'Travel, history & references'],
      ['security', 'Security questions'],
      ['documents', 'Photo & documents'],
      ['review', 'Review & demo finality'],
    ],
  },
  afghan: {
    label: 'Dedicated Afghan visa/ETA demo',
    steps: [
      ['route', 'Category & purpose'],
      ['identity', 'Applicant identity'],
      ['passport', 'Passport'],
      ['family', 'Address & family'],
      ['employment', 'Employment / study context'],
      ['travel', 'Travel & references'],
      ['security', 'Security declarations'],
      ['documents', 'Required evidence'],
      ['review', 'Final review'],
    ],
  },
  voa: {
    label: 'Visa on Arrival Annexure I preparation',
    steps: [
      ['eligibility', 'VoA eligibility'],
      ['applicant', 'Annexure I applicant details'],
      ['passport', 'Passport & contacts'],
      ['travel', 'Travel details'],
      ['declaration', 'Declaration'],
      ['review', 'Review & print preparation'],
    ],
  },
  regular: {
    label: 'Regular / paper visa preparation',
    steps: [
      ['route', 'Paper visa route'],
      ['identity', 'Identity'],
      ['passport', 'Passport'],
      ['family', 'Address, family & employment'],
      ['travel', 'Travel & references'],
      ['security', 'Security declarations'],
      ['documents', 'Demo document readiness'],
      ['review', 'Review & print handoff'],
    ],
  },
};

const isMeaningfulDraft = (state) => Boolean(
  state?.submitted
  || state?.step > 0
  || state?.docs?.length
  || state?.data?.visa_category
  || state?.data?.nationality
  || state?.data?.given_name
);

export default function Dashboard() {
  const { state, clearLocalDraft, persistence } = useStore();
  const navigate = useNavigate();
  const eraseAndLeave = async () => {
    const result = await clearLocalDraft();
    if (result.ok) navigate('/guide/visa-finder', { replace: true });
    return result;
  };

  if (!isMeaningfulDraft(state)) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-white border border-border shadow-sm rounded p-8 text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">My local visa demo</h1>
          <p className="text-text-secondary mb-3">No local preparation has been started in this tab session.</p>
          <p className="text-sm text-text-secondary mb-8">This prototype does not connect to or retrieve applications from Government systems.</p>
          <Link to="/guide/visa-finder" className="btn-primary">Find the appropriate route &rarr;</Link>
        </div>
        <DraftPrivacyControls persistence={persistence} onErase={eraseAndLeave} />
      </div>
    );
  }

  const appType = flowDetails[state.data?.application_type] ? state.data.application_type : 'evisa';
  const flow = flowDetails[appType];
  const currentStep = Math.min(Math.max(Number(state.step) || 0, 0), flow.steps.length - 1);
  const progressPercent = state.submitted ? 100 : Math.round((currentStep / flow.steps.length) * 100);
  const documents = Array.isArray(state.docs) ? state.docs : [];
  const requiredDocuments = getRequiredDocuments(state.data || {});
  const documentStep = flow.steps.findIndex(([id]) => id === 'documents');
  const missingDocuments = requiredDocuments.filter((requirement) => !documents.some((document) => document.type === requirement.type && document.status === 'selected-this-session'));
  const documentCheckReached = documentStep >= 0 && currentStep >= documentStep;
  const documentsComplete = requiredDocuments.length > 0 && missingDocuments.length === 0;

  const outcome = state.outcome;
  const statusLabel = outcome === 'form-prepared'
    ? 'Form prepared locally'
    : outcome === 'demo-preparation-complete'
      ? 'Demo preparation complete'
      : 'Local draft';
  const completionCopy = outcome === 'form-prepared'
    ? 'Your local Annexure I preparation summary is ready to review and print. No Visa on Arrival request was submitted.'
    : 'Your local demo preparation is complete. Nothing was submitted to the Government of India.';
  const reference = outcome === 'form-prepared'
    ? state.identifiers?.formPreparationId
    : state.identifiers?.finalDemoId || state.identifiers?.temporaryDemoId;

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-serif font-bold mb-2">My local visa demo</h1>
      <p className="text-text-secondary mb-8">Private, tab-session preparation only—not a Government application dashboard.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-border shadow-sm rounded overflow-hidden flex flex-col">
          <div className="bg-[#0b2540] text-white p-6">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
              <div>
                <p className="text-[#f0cc91] text-xs font-bold uppercase tracking-widest mb-1">Preparation type</p>
                <h2 className="text-2xl font-bold">{flow.label}</h2>
              </div>
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{statusLabel}</span>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>{state.submitted ? 'Preparation complete' : `Step ${currentStep + 1} of ${flow.steps.length}`}</span>
                <span className="font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-[#163a5f] h-2 rounded-full overflow-hidden" role="progressbar" aria-label="Local preparation progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progressPercent}>
                <div className="bg-[#f0cc91] h-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col">
            <div className="mb-6 rounded border border-slate-200 bg-slate-50 p-4 text-sm">
              <span className="block text-xs uppercase tracking-wider text-text-secondary mb-1">Local demo reference</span>
              <strong className="font-mono break-all">{reference || 'Created when preparation begins'}</strong>
            </div>

            <h3 className="font-bold text-lg mb-4">Preparation checklist</h3>
            <ol className="space-y-3 mb-8">
              {flow.steps.map(([id, label], index) => {
                const isDocumentStep = id === 'documents';
                const complete = state.submitted || index < currentStep || (isDocumentStep && documentsComplete);
                const warning = isDocumentStep && documentCheckReached && missingDocuments.length > 0;
                return (
                  <li key={id} className="flex items-start gap-3">
                    <span aria-hidden="true" className={complete ? 'text-green-600 font-bold' : warning ? 'text-amber-600 font-bold' : 'text-gray-400'}>{complete ? '✓' : warning ? '⚠' : '○'}</span>
                    <span className={complete ? 'text-gray-900' : warning ? 'text-amber-800 font-bold' : index === currentStep ? 'text-gray-900 font-bold' : 'text-gray-500'}>
                      {label}{warning ? ` — ${missingDocuments.length} required item${missingDocuments.length === 1 ? '' : 's'} missing` : ''}
                    </span>
                  </li>
                );
              })}
            </ol>

            <div className="mt-auto pt-6 border-t border-border">
              {!state.submitted ? (
                <div>
                  <p className="text-sm text-text-secondary mb-3">Draft fields and file metadata are saved only for this tab session. A refresh may restore them; closing the tab or browser ends the session. Document contents are not retained.</p>
                  <Link to="/apply" className="btn-primary inline-flex items-center gap-2">{missingDocuments.length && documentCheckReached ? 'Continue document checks' : 'Continue local preparation'} &rarr;</Link>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-green-800 font-bold mb-3">{completionCopy}</p>
                  <Link to="/apply" className="btn-secondary inline-block">View prepared result &rarr;</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 p-5 rounded shadow-sm">
            <h3 className="font-bold text-amber-950 mb-2">Prototype boundary</h3>
            <p className="text-sm text-amber-900">No official submission, approval, payment, status lookup, or Government account exists in this demo.</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 p-5 rounded shadow-sm">
            <h3 className="font-bold text-blue-900 mb-2">Need help?</h3>
            <p className="text-sm text-blue-800 mb-4">Review general guidance about route selection, document preparation, and this prototype.</p>
            <Link to="/help" className="text-sm font-bold text-[#0b2540] hover:underline">Read help &rarr;</Link>
          </div>
          <div className="bg-white border border-border p-5 rounded shadow-sm">
            <h3 className="font-bold text-gray-900 mb-2">Travel guidance demo</h3>
            <p className="text-sm text-gray-600 mb-4">See the prototype’s arrival-readiness guidance without treating it as a live decision.</p>
            <Link to="/status" className="text-sm font-bold text-[#0b2540] hover:underline">View demo guidance &rarr;</Link>
          </div>
        </div>
      </div>

      <DraftPrivacyControls persistence={persistence} onErase={eraseAndLeave} />
    </div>
  );
}

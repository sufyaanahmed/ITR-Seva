import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, formatReference } from '../store';

const flowLabels = {
  evisa: 'Standard e-Visa Application',
  afghan: 'Dedicated Afghan Visa / ETA',
  voa: 'Visa on Arrival Annexure I Preparation',
  regular: 'Regular / Paper Visa Preparation',
};

const hasMeaningfulLocalState = (state) => Boolean(
  state?.submitted
  || state?.step > 0
  || state?.docs?.length
  || state?.data?.visa_category
  || state?.data?.nationality
  || state?.data?.given_name
);

function DraftErasure({ persistence, onErase }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const erase = async () => {
    setBusy(true);
    const result = await onErase();
    if (!result?.ok) setBusy(false);
  };

  return (
    <section className="mt-8 border border-red-200 p-6 rounded bg-red-50" aria-labelledby="resume-erase-heading">
      <h2 id="resume-erase-heading" className="font-bold text-lg text-red-950 mb-2">Erase Saved Draft Data</h2>
      <p className="text-sm text-red-900 mb-4">Remove your saved answers and document selections.</p>
      {persistence?.status === 'error' && <p className="text-sm mb-4 font-bold text-red-800" role="alert">{persistence.message}</p>}

      {!confirming ? (
        <button type="button" onClick={() => setConfirming(true)} className="px-4 py-2 border border-red-700 text-red-800 bg-white font-bold rounded hover:bg-red-100 cursor-pointer">Erase this draft</button>
      ) : (
        <div role="alertdialog" aria-labelledby="resume-confirm-heading" aria-describedby="resume-confirm-description" className="border border-red-300 bg-white p-4 rounded">
          <h3 id="resume-confirm-heading" className="font-bold text-red-950 mb-2">Permanently erase draft data?</h3>
          <p id="resume-confirm-description" className="text-sm text-red-900 mb-4">Your answers and document selections will be deleted. This cannot be undone.</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={erase} disabled={busy} className="px-4 py-2 bg-red-700 text-white font-bold rounded disabled:opacity-60 cursor-pointer">{busy ? 'Erasing…' : 'Yes, erase data'}</button>
            <button type="button" onClick={() => setConfirming(false)} disabled={busy} className="btn-secondary cursor-pointer">Cancel</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default function Resume() {
  const { state, clearLocalDraft, persistence } = useStore();
  const navigate = useNavigate();
  const hasLocalPreparation = hasMeaningfulLocalState(state);
  const appType = flowLabels[state?.data?.application_type] ? state.data.application_type : 'evisa';
  const isComplete = Boolean(state?.submitted);
  const reference = isComplete
    ? (state.outcome === 'form-prepared' ? state.identifiers?.formPreparationId : state.identifiers?.finalDemoId)
    : state.identifiers?.temporaryDemoId;
  const eraseAndLeave = async () => {
    const result = await clearLocalDraft();
    if (result.ok) navigate('/guide/visa-finder', { replace: true });
    return result;
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 font-sans">
      <h1 className="text-3xl font-serif font-bold mb-4 text-[#1E2A4F]">Continue Saved Application</h1>
      <p className="text-text-secondary mb-8">Reopen your in-progress application draft or view your completed dossier.</p>

      {hasLocalPreparation ? (
        <div className="border-2 border-primary p-6 rounded-xl bg-primary-light/20 shadow-sm mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">{isComplete ? 'Completed Application Record' : 'Active In-Progress Draft'}</p>
          <h2 className="font-bold text-xl mb-2 text-primary">{flowLabels[appType]}</h2>
          {reference && (
            <div className="bg-white/70 border border-primary/20 rounded p-3 mb-6">
              <span className="block text-xs uppercase text-text-secondary mb-1">Application Reference ID</span>
              <strong className="font-mono text-sm break-all text-[#1E2A4F]">{formatReference(reference)}</strong>
            </div>
          )}
          <button type="button" onClick={() => navigate('/apply')} className="btn-primary w-full sm:w-auto cursor-pointer">{isComplete ? 'View application' : 'Resume Application Draft'}</button>
        </div>
      ) : (
        <div className="border border-border p-8 rounded-xl bg-white shadow-sm mb-10 text-center">
          <h2 className="font-bold text-xl mb-2 text-[#1E2A4F]">No Saved Application Found</h2>
          <p className="text-sm text-text-secondary mb-6">Find your visa route to start an application.</p>
          <button type="button" onClick={() => navigate('/guide/visa-finder')} className="btn-primary cursor-pointer">Find Appropriate Visa Route</button>
        </div>
      )}

      <DraftErasure persistence={persistence} onErase={eraseAndLeave} />
    </div>
  );
}

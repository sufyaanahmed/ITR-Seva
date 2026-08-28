import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

const flowLabels = {
  evisa: 'standard e-Visa demo',
  afghan: 'dedicated Afghan visa/ETA demo',
  voa: 'Visa on Arrival Annexure I preparation',
  regular: 'regular / paper visa preparation',
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
      <h2 id="resume-erase-heading" className="font-bold text-lg text-red-950 mb-2">Erase local demo data</h2>
      <p className="text-sm text-red-900 mb-2">This version never reads older persistent drafts. If an earlier build left one behind, the erase action also attempts to remove its localStorage and IndexedDB copies.</p>
      <p className={`text-sm mb-4 ${persistence?.status === 'error' ? 'font-bold text-red-800' : 'text-red-950'}`} role={persistence?.status === 'error' ? 'alert' : 'status'}>
        {persistence?.message || 'Session save status is unavailable.'}
      </p>

      {!confirming ? (
        <button type="button" onClick={() => setConfirming(true)} className="px-4 py-2 border border-red-700 text-red-800 bg-white font-bold rounded hover:bg-red-100">Erase this draft and legacy browser data</button>
      ) : (
        <div role="alertdialog" aria-labelledby="resume-confirm-heading" aria-describedby="resume-confirm-description" className="border border-red-300 bg-white p-4 rounded">
          <h3 id="resume-confirm-heading" className="font-bold text-red-950 mb-2">Permanently erase local demo data?</h3>
          <p id="resume-confirm-description" className="text-sm text-red-900 mb-4">This clears the visible draft, this tab&apos;s session copy, and any legacy browser copies for this prototype. It cannot be undone.</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={erase} disabled={busy} className="px-4 py-2 bg-red-700 text-white font-bold rounded disabled:opacity-60">{busy ? 'Erasing…' : 'Yes, erase local data'}</button>
            <button type="button" onClick={() => setConfirming(false)} disabled={busy} className="btn-secondary">Cancel</button>
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
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-serif font-bold mb-4">Continue local preparation</h1>
      <p className="text-text-secondary mb-3">This page can reopen only the demo preparation stored for this tab session.</p>
      <p className="text-sm text-text-secondary mb-8">It cannot retrieve a Government application, check an official Application ID, or resume work completed on another device.</p>

      {hasLocalPreparation ? (
        <div className="border-2 border-primary p-6 rounded bg-primary-light/20 shadow-sm mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">{isComplete ? 'Prepared result found in this tab' : 'Session draft found in this tab'}</p>
          <h2 className="font-bold text-xl mb-2 text-primary">{flowLabels[appType]}</h2>
          <p className="text-sm text-text-secondary mb-4">{isComplete
            ? 'This result records local demo preparation only. It is not evidence of an official submission, payment, visa decision, or approval.'
            : 'Your entered demo fields and validated file metadata were saved for this tab session. File contents were not saved.'}</p>
          {reference && (
            <div className="bg-white/70 border border-primary/20 rounded p-3 mb-6">
              <span className="block text-xs uppercase text-text-secondary mb-1">{isComplete ? 'Local result reference' : 'Temporary local demo reference'}</span>
              <strong className="font-mono text-sm break-all">{reference}</strong>
            </div>
          )}
          <button type="button" onClick={() => navigate('/apply')} className="btn-primary w-full sm:w-auto">{isComplete ? 'View prepared result' : 'Resume local draft'}</button>
        </div>
      ) : (
        <div className="border border-border p-6 rounded bg-white shadow-sm mb-10 text-center">
          <h2 className="font-bold text-xl mb-2">No local preparation found</h2>
          <p className="text-sm text-text-secondary mb-6">Start the route finder to create a new demo draft for this tab session.</p>
          <button type="button" onClick={() => navigate('/guide/visa-finder')} className="btn-primary">Find the appropriate route</button>
        </div>
      )}

      <div className="border border-amber-200 p-6 rounded bg-amber-50 text-amber-950">
        <h2 className="font-bold text-lg mb-2">This-tab storage is not an official account</h2>
        <ul className="text-sm space-y-2 list-disc pl-5">
          <li>Refreshing this tab may restore the draft; opening a separate tab or restarting the browser will not.</li>
          <li>Closing this tab or browser ends the draft session. File contents are never retained.</li>
          <li>The temporary demo reference works only as an on-screen label inside this prototype.</li>
          <li>For a real application or official status, use only the appropriate Government of India service and its issued credentials.</li>
        </ul>
      </div>

      <DraftErasure persistence={persistence} onErase={eraseAndLeave} />
    </div>
  );
}

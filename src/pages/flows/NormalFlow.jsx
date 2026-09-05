import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { getEvisaWizardGate } from '../../domain/visaEligibility';
import FlowGuide from '../../components/FlowGuide';
import Disclosure from '../../components/Disclosure';

export default function NormalFlow() {
  const navigate = useNavigate();
  const { state } = useStore();
  const routedByFinder = state.data?.application_type === 'evisa' && getEvisaWizardGate(state.data).allowed;

  return (
    <FlowGuide title="Apply for an e-Visa" intro="Prepare your documents, complete the online application and wait for your Electronic Travel Authorization (ETA) before travelling.">
      <ol className="divide-y divide-border border-y border-border">
        {[
          ['Prepare', 'Have your passport, photo, travel details and supporting documents ready. Use the application window shown for your visa category.'],
          ['Apply and pay', 'Enter your details exactly as they appear on your passport. Review the form and uploads, pay on the official portal and keep your Application ID. Fees vary by nationality and category and are non-refundable.'],
          ['Check your ETA', 'Respond to any document requests. Travel only when your official status shows GRANTED, and carry a printed ETA with the passport used to apply. If replaced, carry both passports.'],
        ].map(([title, detail], index) => (
          <li key={title} className="flex gap-4 py-6"><span className="text-sm font-semibold text-secondary-accent">0{index + 1}</span><div><h2 className="mb-2 font-semibold text-primary">{title}</h2><p className="text-sm leading-relaxed text-text-secondary">{detail}</p></div></li>
        ))}
      </ol>
      <Disclosure title="Photo and document requirements">
        <ul className="list-disc space-y-2 pl-5">
          <li>Square photo, front-facing on a light background: JPEG, 10 KB to 1 MB.</li>
          <li>Passport bio page and supporting evidence: PDF, 10 to 300 KB each.</li>
          <li>Supporting documents in English, matching the checklist for your category.</li>
        </ul>
      </Disclosure>
      <p className="text-sm leading-relaxed text-text-secondary">Complete your <Link to="/e-arrival" className="text-primary underline">e-Arrival Card</Link> within 72 hours before arrival. Biometrics are taken at immigration.</p>
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <button type="button" onClick={() => navigate(routedByFinder ? '/apply' : '/guide/visa-finder')} className="btn-primary rounded-md">{routedByFinder ? 'Continue application' : 'Find my visa route'} →</button>
        <a href="https://indianvisaonline.gov.in/evisa/" target="_blank" rel="noreferrer" className="text-sm text-primary underline">Official e-Visa portal ↗</a>
      </div>
    </FlowGuide>
  );
}

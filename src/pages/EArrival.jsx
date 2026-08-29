import React from 'react';


export default function EArrival() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-10 border-b border-border-dark pb-8">
        <p className="uppercase tracking-widest text-sm text-primary mb-2 font-bold">Separate pre-arrival requirement</p>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">India e-Arrival Card</h1>
        <p className="text-xl text-text-secondary leading-relaxed">Foreign nationals and OCI/eOCI cardholders should complete the official online arrival-information form within 72 hours before arriving in India.</p>
      </div>

      <div className="bg-amber-50 border border-amber-300 p-5 rounded mb-10">
        <p className="font-bold text-amber-950 mb-1">Arrival information—not a visa</p>
        <p className="text-sm text-amber-900">The e-Arrival Card does not grant entry, replace an e-Visa, replace the dedicated Afghan visa/ETA route, or replace the Visa-on-Arrival Annexure I form. This prototype does not collect or submit e-Arrival details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <section className="border border-border rounded p-6 bg-white">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Before opening the form</h2>
          <ul className="list-disc pl-6 space-y-2 text-sm text-text-secondary">
            <li>Complete it only within the published 72-hour pre-arrival window.</li>
            <li>Use the same passport and personal details as your travel documents.</li>
            <li>Have the address, state, and district where you will stay in India.</li>
            <li>Have your recent travel history and contact details ready.</li>
          </ul>
        </section>

        <section className="border border-border rounded p-6 bg-white">
          <h2 className="text-xl font-bold mb-4 text-gray-900">What the official form asks</h2>
          <ul className="list-disc pl-6 space-y-2 text-sm text-text-secondary">
            <li>Full name, nationality/region, passport number, and purpose.</li>
            <li>Arrival date and countries visited during the previous six days.</li>
            <li>Address, state, and district in India.</li>
            <li>Email, contact number, and optional emergency contact.</li>
            <li>Any additional travellers, CAPTCHA, and an accuracy declaration.</li>
          </ul>
        </section>
      </div>


    </div>
  );
}

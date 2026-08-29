import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

const AFGHAN_PORTAL = 'https://www.indianvisaonline.gov.in/avisa/index.html';

const categories = [
  { value: 'business', label: 'Business Visa', note: 'Business, investment, sports and eligible dependant purposes have different evidence requirements.' },
  { value: 'student', label: 'Student Visa', note: 'Scholarship, new or returning study, and eligible dependant purposes are assessed separately.' },
  { value: 'medical', label: 'Medical Visa', note: 'For the patient travelling for treatment in India.' },
  { value: 'medical-attendant', label: 'Medical Attendant Visa', note: 'For an Afghan national accompanying the principal patient.' },
  { value: 'entry', label: 'Entry Visa', note: 'Covers several defined family, cultural, official, property, student-guardian and other purposes.' },
  { value: 'un-diplomat', label: 'UN Diplomat Visa', note: 'For qualifying UN assignment, visit and dependant purposes.' },
];

export default function AfghanFlow() {
  const navigate = useNavigate();
  const { state, updateState } = useStore();
  const [category, setCategory] = useState(state?.data?.visa_category || '');
  const [showCategoryError, setShowCategoryError] = useState(false);

  const startApplication = () => {
    if (!category) {
      setShowCategoryError(true);
      return;
    }

    updateState({
      type: 'afghan',
      step: 0,
      data: { ...(state?.data || {}), application_type: 'afghan', visa_category: category, nationality: 'Afghanistan' },
      docs: [],
      submitted: false,
    });
    navigate('/apply');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-10 border-b border-border-dark pb-8">
        <p className="uppercase tracking-widest text-sm text-primary mb-2 font-bold">Dedicated route briefing</p>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Indian visa route for Afghan nationals</h1>
        <p className="text-xl text-text-secondary leading-relaxed">
          Afghan nationals are directed to the Government of India&apos;s dedicated Afghan online visa/ETA route—not the ordinary e-Visa or regular-paper flow.
        </p>
      </div>


      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-3 text-gray-900">1. Select the official category</h2>
          <p className="mb-6 text-text-secondary">A category is required before the demo can begin. The official portal then asks for the applicable purpose or subtype, which determines the full evidence list.</p>
          <fieldset>
            <legend className="sr-only">Afghan visa category</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((item) => (
                <label key={item.value} className={`border p-5 rounded cursor-pointer transition ${category === item.value ? 'border-primary bg-blue-50 ring-1 ring-primary' : 'border-border bg-white hover:border-primary-light'}`}>
                  <span className="flex items-start gap-3">
                    <input type="radio" name="afghan-category" value={item.value} checked={category === item.value} onChange={() => { setCategory(item.value); setShowCategoryError(false); }} className="mt-1" />
                    <span>
                      <strong className="block text-gray-900 mb-1">{item.label}</strong>
                      <span className="block text-sm text-text-secondary leading-relaxed">{item.note}</span>
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          {showCategoryError && <p role="alert" className="mt-3 text-sm font-bold text-red-700">Choose one of the six official categories to continue.</p>}
        </section>

        <section className="bg-blue-50 border-l-4 border-primary p-6">
          <h2 className="text-xl font-bold mb-4 text-[#081e33]">2. Prepare the mandatory common documents</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-800">
            <li>A recent, clear, front-facing photograph with a white background.</li>
            <li>A clear copy of the passport bio page containing the applicant&apos;s particulars.</li>
            <li>A clear copy of the <strong>National Identity Card (Tazkira)</strong>.</li>
            <li>All documents required for the selected category and purpose; invitation letters and business cards must be in English.</li>
          </ul>
          <p className="mt-4 text-sm text-blue-950">Upload formats and limits could not be verified because the official live application route was unavailable during the review. The demo must not be treated as the authoritative upload validator.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-5 text-gray-900">3. Application and travel journey</h2>
          <ol className="space-y-4 text-text-secondary">
            {[
              ['Apply once per person', 'Complete a separate application for every traveller and keep the generated Application ID.'],
              ['Save, review, then finalize', 'An unfinished official form may be resumed. Review it carefully: the portal says no changes are allowed after final submission. Re-upload is a separate action, not general editing.'],
              ['Wait for the official decision', 'Before travel, confirm the Electronic Travel Authorization status is GRANTED. This demo does not issue or verify an ETA.'],
              ['Carry the right documents', 'Print and carry the ETA and travel on the passport used in the application. If that passport was replaced, carry both the old and new passports.'],
              ['Complete arrival steps', 'Complete the separate e-Arrival Card within the published pre-arrival window. Biometrics are captured by immigration upon arrival.'],
            ].map(([title, detail], index) => (
              <li key={title} className="flex gap-4 border border-border p-5 rounded bg-white">
                <span className="flex-none w-8 h-8 rounded-full bg-primary text-white grid place-items-center font-bold">{index + 1}</span>
                <p><strong className="block text-gray-900 mb-1">{title}</strong>{detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className="pt-6 border-t border-border-dark flex justify-end">
          <button type="button" onClick={startApplication} className="bg-gradient-to-r from-secondary-accent to-[#C9933A] text-primary-dark px-8 py-3.5 font-sans font-bold uppercase tracking-widest text-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-sm">
            Start Application →
          </button>
        </div>
      </div>
    </div>
  );
}

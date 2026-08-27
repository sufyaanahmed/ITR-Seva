import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

const AFGHAN_VISA_CATEGORIES = [
  { id: 'business', label: 'Business Visa', docs: ['Invitation letter from an Indian company', 'Letter from company in country of residence', 'Recommendation from Chamber of Commerce', 'Proof of occupation (if available)'] },
  { id: 'student', label: 'Student Visa', docs: ['Admission letter from a recognized Indian institution', 'Documentation of financial support', 'Student undertaking form'] },
  { id: 'medical', label: 'Medical Visa', docs: ['System-generated medical invitation letter from an Indian hospital', 'Consent letter from parent (for minors)'] },
  { id: 'medical_attendant', label: 'Medical Attendant Visa', docs: ['System-generated medical invitation letter', "Copy of principal patient's visa"] },
  { id: 'entry', label: 'Entry Visa', docs: ['Documents vary by specific Entry Visa subcategory — consult the official portal'] },
  { id: 'un_diplomat', label: 'UN Diplomat Visa', docs: ['Official UN credentials and mission documentation'] },
];

export default function AfghanFlow() {
  const navigate = useNavigate();
  const { updateState } = useStore();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const startApplication = () => {
    if (!selectedCategory) return;
    updateState({
      type: 'afghan',
      step: 0,
      data: {
        application_type: 'afghan',
        visa_category: selectedCategory,
        nationality: 'Afghanistan',
      },
      docs: [],
      submitted: false,
    });
    navigate('/apply');
  };

  const selectedCat = AFGHAN_VISA_CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-10 border-b border-border-dark pb-8">
        <p className="uppercase tracking-widest text-sm text-primary mb-2 font-bold">Pre-Application Briefing</p>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Indian Visa for Afghan Nationals</h1>
        <p className="text-xl text-text-secondary leading-relaxed">
          Afghan nationals use a dedicated visa portal separate from the standard Indian e-Visa system. Select your visa category below and review the document requirements before starting your application.
        </p>
      </div>

      <div className="space-y-10">

        {/* Core Documents */}
        <section className="bg-blue-50 border-l-4 border-primary p-6">
          <h2 className="text-xl font-bold mb-3 text-[#081e33]">Core Documents Required (All Categories)</h2>
          <p className="text-gray-800 mb-3">Before starting any application, you must have:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-800">
            <li>A copy of the <strong>passport page</strong> containing your personal particulars.</li>
            <li>A <strong>National ID Card (Tazkira)</strong>.</li>
          </ul>
        </section>

        {/* Category Selector */}
        <section>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Select Your Visa Category</h2>
          <p className="text-text-secondary mb-6">Choose the category that matches your purpose of travel. Each category has different additional requirements.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AFGHAN_VISA_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-5 text-left border-2 rounded transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'border-primary bg-blue-50 shadow-sm'
                    : 'border-border-dark bg-gray-50 hover:border-primary-light'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedCategory === cat.id ? 'border-primary' : 'border-gray-400'}`}>
                    {selectedCategory === cat.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <span className={`font-bold ${selectedCategory === cat.id ? 'text-primary' : 'text-gray-800'}`}>{cat.label}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Additional Docs for Selected Category */}
        {selectedCat && (
          <section className="bg-amber-50 border border-amber-200 p-6 rounded">
            <h3 className="font-bold text-gray-900 mb-3">Additional Documents for {selectedCat.label}</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-800 text-sm">
              {selectedCat.docs.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
            <p className="text-xs text-gray-500 mt-4">All supporting documents must be in English, or accompanied by a certified English translation.</p>
          </section>
        )}

        {/* Important Advisory */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Important Advisory</h2>
          <ul className="space-y-4 text-text-secondary">
            <li className="flex gap-3">
              <span className="text-primary font-bold">1.</span>
              <p><strong>Separate Applications:</strong> Each online application form is for one person. A separate application must be submitted for each applicant.</p>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">2.</span>
              <p><strong>Document Language:</strong> Documents such as invitation letters must be in English; otherwise, the application may be rejected.</p>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">3.</span>
              <p><strong>Biometrics:</strong> Biometric details are captured at immigration upon arrival in India.</p>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">4.</span>
              <p><strong>Travel Document:</strong> You must travel on the same passport on which the visa was issued. If you receive a new passport, carry the old one as well.</p>
            </li>
          </ul>
        </section>

        <div className="mt-12 text-center pt-8 border-t border-gray-200">
          <button
            onClick={startApplication}
            disabled={!selectedCategory}
            className={`px-8 py-4 font-bold rounded shadow transition inline-block text-lg ${
              selectedCategory
                ? 'bg-[#0b2540] text-white hover:bg-[#163a5f]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Start My Application &rarr;
          </button>
          {!selectedCategory && <p className="text-sm text-gray-400 mt-3">Please select a visa category to continue.</p>}
          {selectedCategory && <p className="text-sm text-gray-500 mt-3">Your progress will be saved automatically.</p>}
        </div>
      </div>
    </div>
  );
}


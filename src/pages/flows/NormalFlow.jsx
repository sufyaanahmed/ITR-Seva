import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

export default function NormalFlow() {
  const navigate = useNavigate();
  const { updateState } = useStore();

  const startApplication = () => {
    updateState({ 
      type: 'evisa', 
      step: 0, 
      data: { 
        application_type: 'evisa',
        visa_category: 'tourist',
      }, 
      docs: [], 
      submitted: false 
    });
    navigate('/apply');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-10 border-b border-border-dark pb-8">
        <p className="uppercase tracking-widest text-sm text-primary mb-2 font-bold">Pre-Application Briefing</p>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">How to Apply for an Indian e-Visa</h1>
        <p className="text-xl text-text-secondary leading-relaxed">
          The Indian e-Visa, also known as an Electronic Travel Authorization (ETA), allows eligible travelers to apply online at least 4 days before their intended date of arrival.
        </p>
      </div>

      <div className="space-y-12">
        <section className="bg-blue-50 border-l-4 border-primary p-6">
          <h2 className="text-xl font-bold mb-4 text-[#081e33]">Documents Required</h2>
          <p className="text-gray-800 mb-2">Before applying, prepare the following documents for upload:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-800">
            <li>A recently taken front-facing photograph with a white or light-colored background, in <strong>JPEG format</strong>.</li>
            <li>The passport data page, in <strong>PDF format</strong>.</li>
            <li>Any additional documents required for your specific visa category.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Application Stages</h2>
          
          <div className="space-y-6">
            <div className="border border-border p-6 rounded">
              <h3 className="text-lg font-bold mb-3 text-primary">1. Personal Details</h3>
              <p className="text-sm text-text-secondary mb-3">Provide your surname and given name exactly as they appear in your passport.</p>
            </div>

            <div className="border border-border p-6 rounded">
              <h3 className="text-lg font-bold mb-3 text-primary">2. Passport and Address Details</h3>
              <p className="text-sm text-text-secondary">Enter passport details and current/permanent residential address.</p>
            </div>

            <div className="border border-border p-6 rounded">
              <h3 className="text-lg font-bold mb-3 text-primary">3. Document Upload</h3>
              <p className="text-sm text-text-secondary mb-3">Upload your photograph in JPEG format and passport data page in PDF format.</p>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Visa Fee and Processing</h2>
          <p className="text-text-secondary mb-4">
            For applicants required to pay a fee, you will be prompted to make the payment securely. Processing typically takes <strong>3-5 business days</strong>.
          </p>
        </section>

        <div className="mt-12 text-center pt-8 border-t border-gray-200">
          <button 
            onClick={startApplication}
            className="bg-[#0b2540] text-white px-8 py-4 font-bold rounded shadow hover:bg-[#163a5f] transition inline-block text-lg"
          >
            Start My Application &rarr;
          </button>
          <p className="text-sm text-gray-500 mt-4">Your progress will be saved automatically.</p>
        </div>
      </div>
    </div>
  );
}

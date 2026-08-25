import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

export default function VoaFlow() {
  const navigate = useNavigate();
  const { updateState } = useStore();

  const startApplication = () => {
    updateState({ 
      type: 'voa', 
      step: 0, 
      data: { 
        application_type: 'voa',
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
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Visa-on-Arrival Eligibility</h1>
        <p className="text-xl text-text-secondary leading-relaxed">
          Visa-on-Arrival is a special facility available exclusively to the nationals of Japan, South Korea, and the United Arab Emirates (UAE). Review the requirements before generating your VoA form.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Step 1: Check Basic Eligibility</h2>
          <div className="bg-gray-50 border border-border p-6 rounded text-gray-800">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-xl leading-none">✓</span>
                <div>
                  <strong className="block mb-1">Are you a citizen of Japan, South Korea, or UAE?</strong>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-xl leading-none">✓</span>
                <div>
                  <strong className="block mb-1">For UAE Nationals Only: Have you previously obtained an Indian e-Visa or regular/paper visa?</strong>
                  <p className="text-sm text-text-secondary">If no, you must apply for an e-Visa or regular visa before travel. First-time visitors from UAE are not eligible.</p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section className="bg-blue-50 border-l-4 border-primary p-6">
          <h2 className="text-xl font-bold mb-4 text-[#081e33]">Step 2: Arrival Process in India</h2>
          <ol className="list-decimal pl-5 space-y-4 text-gray-800">
            <li>
              <strong>Arrive at a designated airport:</strong> Bangalore, Chennai, Delhi, Hyderabad, Kolkata, or Mumbai.
            </li>
            <li>
              <strong>Submit & Pay:</strong> Submit documents to the Visa Officer and pay the Visa-on-Arrival fee of ₹2,000.
            </li>
          </ol>
        </section>
        
        <div className="mt-12 text-center pt-8 border-t border-gray-200">
          <button 
            onClick={startApplication}
            className="bg-[#0b2540] text-white px-8 py-4 font-bold rounded shadow hover:bg-[#163a5f] transition inline-block text-lg"
          >
            Start My Application &rarr;
          </button>
          <p className="text-sm text-gray-500 mt-4">Generate your pre-filled VoA form to bring to the airport.</p>
        </div>
      </div>
    </div>
  );
}

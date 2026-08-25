import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

export default function AfghanFlow() {
  const navigate = useNavigate();
  const { updateState } = useStore();

  const startApplication = () => {
    updateState({ 
      type: 'regular', 
      step: 0, 
      data: { 
        application_type: 'regular',
        visa_category: 'tourist',
        nationality: 'Afghanistan'
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
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Indian Visa for Afghan Nationals</h1>
        <p className="text-xl text-text-secondary leading-relaxed">
          If you are an Afghan national planning to travel to India, the application process requires specific documentation including your Tazkira. Review the requirements below before starting your application.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Visa Categories Available</h2>
          <p className="mb-4 text-text-secondary">Afghan nationals can currently apply online for the following visa categories:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['Business Visa', 'Student Visa', 'Medical Visa', 'Medical Attendant Visa', 'Entry Visa', 'UN Diplomat Visa'].map(cat => (
              <div key={cat} className="bg-gray-50 border border-border p-4 rounded text-gray-800 font-medium">
                {cat}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-blue-50 border-l-4 border-primary p-6">
          <h2 className="text-xl font-bold mb-4 text-[#081e33]">Core Document Requirements</h2>
          <p className="text-gray-800 mb-2">Before starting your application, you must possess:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-800">
            <li>A copy of the passport page containing your personal particulars.</li>
            <li>A <strong>National ID Card (Tazkira)</strong>.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Important Advisory</h2>
          <ul className="space-y-4 text-text-secondary">
            <li className="flex gap-3">
              <span className="text-primary font-bold">1.</span>
              <p><strong>Separate Applications:</strong> Each online application form is intended for one person. A separate application must be submitted for each applicant.</p>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">2.</span>
              <p><strong>Document Language:</strong> Documents such as invitation letters and business cards should be in English; otherwise, the application may be liable for rejection.</p>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">3.</span>
              <p><strong>Biometrics:</strong> Biometric details are captured at immigration upon arrival in India.</p>
            </li>
          </ul>
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

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

export default function RegularFlow() {
  const navigate = useNavigate();
  const { updateState } = useStore();

  const startApplication = () => {
    updateState({ 
      type: 'regular', 
      step: 0, 
      data: { application_type: 'regular' }, 
      docs: [], 
      submitted: false 
    });
    navigate('/apply');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-10 border-b border-border-dark pb-8">
        <p className="uppercase tracking-widest text-sm text-primary mb-2 font-bold">Pre-Application Briefing</p>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Regular / Paper Visa Guide</h1>
        <p className="text-xl text-text-secondary leading-relaxed">
          Based on your profile, you need to apply for a Regular Visa. This process involves filling out the online application and then physically submitting your passport and documents to an Indian Mission or Visa Application Center (VAC).
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#0b2540] text-white font-bold flex items-center justify-center flex-shrink-0 text-xl">1</div>
            <h2 className="text-2xl font-bold text-gray-900">Complete the Online Form</h2>
          </div>
          <div className="ml-14 bg-gray-50 p-6 rounded border border-gray-200">
            <p className="text-gray-700 mb-4">You will need to fill out a comprehensive application form. Have the following ready:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
              <li>Passport (Valid for at least 6 months with 2 blank pages)</li>
              <li>Details of your parents and their nationalities</li>
              <li>Your complete 10-year travel history</li>
              <li>Details of any previous visits to India</li>
              <li>A reference in India and your home country</li>
            </ul>
            <div className="bg-white p-4 rounded border-l-4 border-[#0b2540] shadow-sm">
              <strong className="block text-[#0b2540] mb-2">Important Notice</strong>
              <p className="text-sm text-gray-600">Ensure all details match your passport exactly. Any discrepancy will result in rejection at the Embassy.</p>
            </div>
            
            <div className="mt-6 flex justify-center">
              <button 
                onClick={startApplication}
                className="bg-[#0b2540] text-white px-8 py-3 font-bold rounded shadow hover:bg-[#163a5f] transition inline-block text-lg"
              >
                Start My Application &rarr;
              </button>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#0b2540] text-white font-bold flex items-center justify-center flex-shrink-0 text-xl">2</div>
            <h2 className="text-2xl font-bold text-gray-900">Upload Photo & Documents</h2>
          </div>
          <div className="ml-14">
            <p className="text-gray-700 mb-4">After completing the form, you must upload a digital photograph and required documents based on your visa category (e.g., Invitation letters for Business Visas).</p>
            <div className="bg-blue-50 border border-blue-100 p-4 rounded text-sm text-blue-800">
              <strong className="block mb-1">Photo Requirements:</strong>
              Format: JPEG, Size: 10KB to 300KB, Dimensions: 350x350 pixels (min) to 1000x1000 pixels (max). Must be a recent color photo with a white background.
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#0b2540] text-white font-bold flex items-center justify-center flex-shrink-0 text-xl">3</div>
            <h2 className="text-2xl font-bold text-gray-900">Submit Physical Documents</h2>
          </div>
          <div className="ml-14">
            <p className="text-gray-700 mb-4">Once your online application is submitted, you will receive an Application ID. You must print the application form, sign it, and submit it along with your physical passport and supporting documents.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="border border-gray-200 p-4 rounded">
                <strong className="block text-gray-900 mb-2">Book an Appointment</strong>
                <p className="text-sm text-gray-600 mb-4">You may need to schedule an appointment at the nearest Indian Embassy or outsourced Visa Application Center (e.g., BLS, VFS).</p>
              </div>
              <div className="border border-gray-200 p-4 rounded">
                <strong className="block text-gray-900 mb-2">Pay the Fee</strong>
                <p className="text-sm text-gray-600 mb-4">Fees vary by nationality and visa type. Payment is typically made at the time of document submission or via bank transfer.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Important Note */}
      <div className="bg-yellow-50 border-l-4 border-secondary p-6 text-yellow-900 text-[0.95rem] leading-relaxed mt-12">
        <strong>Important Note:</strong> Requirements, appointment procedures, processing times, fees, and document requirements may vary by visa category and Indian Mission. Check the official instructions and the website of the relevant Indian Mission before submitting your application.
      </div>
    </div>
  );
}

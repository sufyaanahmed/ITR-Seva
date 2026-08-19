import React from 'react';

export default function AfghanFlow() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-10 border-b border-border-dark pb-8">
        <p className="uppercase tracking-widest text-sm text-primary mb-2 font-bold">Visa Guide</p>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Indian Visa for Afghan Nationals</h1>
        <p className="text-xl text-text-secondary leading-relaxed">
          If you are an Afghan national planning to travel to India, the application process is strictly through the dedicated Afghan Visa portal rather than the standard e-Visa system.
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
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Specific Visa Requirements</h2>
          
          <div className="space-y-8">
            <div className="border border-border rounded overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-border">
                <h3 className="text-lg font-bold">Business Visa</h3>
              </div>
              <div className="p-6">
                <ul className="list-disc pl-6 space-y-2 text-text-secondary">
                  <li>Passport personal-details page & Tazkira</li>
                  <li>Invitation letter from an Indian company</li>
                  <li>Original signed letter from the company in the country of residence</li>
                  <li>Recommendation letter from the Afghan or Indian Chamber of Commerce</li>
                  <li>Proof of residence in Afghanistan and proof of occupation (if available)</li>
                </ul>
              </div>
            </div>

            <div className="border border-border rounded overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-border">
                <h3 className="text-lg font-bold">Student Visa</h3>
              </div>
              <div className="p-6">
                <ul className="list-disc pl-6 space-y-2 text-text-secondary">
                  <li>Passport personal-details page & Tazkira</li>
                  <li>Letter of admission from a recognized Indian educational institution</li>
                  <li>Documentation showing financial support</li>
                  <li>Student undertaking form</li>
                  <li>Ministry of Health approval for medical/paramedical courses</li>
                </ul>
              </div>
            </div>

            <div className="border border-border rounded overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-border">
                <h3 className="text-lg font-bold">Medical & Medical Attendant Visa</h3>
              </div>
              <div className="p-6">
                <ul className="list-disc pl-6 space-y-2 text-text-secondary">
                  <li>Passport personal-details page & Tazkira</li>
                  <li>System-generated medical invitation letter from an Indian hospital</li>
                  <li>Consent letter from a parent for a minor applicant</li>
                </ul>
                <p className="mt-4 text-sm text-gray-600 bg-gray-100 p-3 rounded">
                  Note: Granted typically as a Triple Entry, 2-month visa. Attendant validity is linked to the patient.
                </p>
              </div>
            </div>
          </div>
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
            <li className="flex gap-3">
              <span className="text-primary font-bold">4.</span>
              <p><strong>e-Arrival Card:</strong> The e-Arrival Card is not a visa. It must be completed within 72 hours before arrival.</p>
            </li>
          </ul>
        </section>

        <div className="mt-12 text-center">
          <a href="https://indianvisaonline.gov.in/avisa/index.html" target="_blank" rel="noopener noreferrer" className="bg-[#0b2540] text-white px-8 py-4 font-bold rounded shadow hover:bg-[#163a5f] transition inline-block">
            Access the Official Afghan Visa Portal
          </a>
        </div>
      </div>
    </div>
  );
}

import React from 'react';

export default function NormalFlow() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-10 border-b border-border-dark pb-8">
        <p className="uppercase tracking-widest text-sm text-primary mb-2 font-bold">Visa Guide</p>
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
              <h3 className="text-lg font-bold mb-3 text-primary">1. Starting the Application</h3>
              <p className="text-sm text-text-secondary mb-3">Enter basic details including Nationality, Passport type, Port of arrival, Date of birth, Email address, Visa category, and Expected date of arrival.</p>
              <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
                <strong>Important:</strong> Make sure to note down your Application ID. Click Save and Continue frequently.
              </div>
            </div>

            <div className="border border-border p-6 rounded">
              <h3 className="text-lg font-bold mb-3 text-primary">2. Personal Details</h3>
              <p className="text-sm text-text-secondary mb-3">Provide your surname and given name exactly as they appear in your passport. You must also provide:</p>
              <ul className="list-disc pl-5 text-sm text-text-secondary space-y-1">
                <li>Previous name changes, gender, city/country of birth</li>
                <li>National ID number, Religion, Visible identification marks (enter NA if not applicable)</li>
                <li>Educational qualification, citizenship acquisition method</li>
              </ul>
            </div>

            <div className="border border-border p-6 rounded">
              <h3 className="text-lg font-bold mb-3 text-primary">3. Passport and Address Details</h3>
              <p className="text-sm text-text-secondary">Enter passport details and current/permanent residential address. You must provide parents' details (Name, Nationality, Previous nationality, Place of birth) and declare if your parents/grandparents were Pakistani nationals.</p>
            </div>

            <div className="border border-border p-6 rounded">
              <h3 className="text-lg font-bold mb-3 text-primary">4. Employment & Travel Details</h3>
              <p className="text-sm text-text-secondary">Provide your occupation, employer details, places you intend to visit in India, intended exit port, and countries visited in the last 10 years (including SAARC countries in the last 3 years).</p>
            </div>

            <div className="border border-border p-6 rounded">
              <h3 className="text-lg font-bold mb-3 text-primary">5. References & Document Upload</h3>
              <p className="text-sm text-text-secondary mb-3">Provide contact details of a relative, friend, or hotel in India, plus a contact in your home country.</p>
              <ul className="list-disc pl-5 text-sm text-text-secondary space-y-1">
                <li>Upload your photograph in JPEG format (crop to align head).</li>
                <li>Upload your passport data page in PDF format.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Visa Fee and Processing</h2>
          <p className="text-text-secondary mb-4">
            For applicants required to pay a fee, the website will prompt you to make the payment. Processing typically takes <strong>3-5 business days</strong>. You will receive updates by email.
          </p>
          <div className="bg-white border border-border p-4 rounded text-sm text-gray-700">
            <strong>Note:</strong> Malaysian nationals are granted a 30-day, double-entry e-Tourist Visa on a gratis basis (no fee).
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Downloading Your e-Visa</h2>
          <p className="text-text-secondary mb-6">
            To download your e-Visa, return to the official website and select <strong>Check Visa Status</strong>. Enter your Application ID and passport number, then print your status. Carry a physical copy of your ETA when you arrive in India.
          </p>
          <div className="text-center">
            <a href="https://indianvisaonline.gov.in/evisa/tvoa.html" target="_blank" rel="noopener noreferrer" className="bg-[#0b2540] text-white px-8 py-4 font-bold rounded shadow hover:bg-[#163a5f] transition inline-block">
              Start e-Visa Application
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

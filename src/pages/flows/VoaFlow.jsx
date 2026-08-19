import React from 'react';

export default function VoaFlow() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-10 border-b border-border-dark pb-8">
        <p className="uppercase tracking-widest text-sm text-primary mb-2 font-bold">Visa Guide</p>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Visa-on-Arrival Eligibility</h1>
        <p className="text-xl text-text-secondary leading-relaxed">
          Visa-on-Arrival is a special facility available exclusively to the nationals of Japan, South Korea, and the United Arab Emirates (UAE). Follow the checklist below to determine your eligibility.
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
                  <p className="text-sm text-text-secondary">If no, Visa-on-Arrival is not available. Apply for a standard e-Visa or regular visa.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-xl leading-none">✓</span>
                <div>
                  <strong className="block mb-1">For UAE Nationals Only: Have you previously obtained an Indian e-Visa or regular/paper visa?</strong>
                  <p className="text-sm text-text-secondary">If no, you must apply for an e-Visa or regular visa before travel. First-time visitors from UAE are not eligible.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-xl leading-none">✓</span>
                <div>
                  <strong className="block mb-1">Are you visiting for Tourism, Business, Conference, or Medical purposes?</strong>
                  <p className="text-sm text-text-secondary">Your stay must also not exceed 60 days.</p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Step 2: Travel Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-border p-4 rounded">
              <strong className="block mb-2 text-[#0b2540]">Mandatory Conditions</strong>
              <ul className="list-disc pl-5 space-y-1 text-sm text-text-secondary">
                <li>No residence or occupation in India</li>
                <li>Passport valid for at least 6 months</li>
                <li>Return or onward ticket</li>
                <li>Sufficient funds for your stay</li>
              </ul>
            </div>
            <div className="border border-border p-4 rounded">
              <strong className="block mb-2 text-[#0b2540]">Exclusions</strong>
              <ul className="list-disc pl-5 space-y-1 text-sm text-text-secondary">
                <li>Cannot be travelling on a Diplomatic/Official passport</li>
                <li>Must not be explicitly excluded from the scheme</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-blue-50 border-l-4 border-primary p-6">
          <h2 className="text-xl font-bold mb-4 text-[#081e33]">Step 3: Arrival Process in India</h2>
          <ol className="list-decimal pl-5 space-y-4 text-gray-800">
            <li>
              <strong>Arrive at a designated airport:</strong>
              <p className="text-sm mt-1 text-gray-600">Bangalore, Chennai, Delhi, Hyderabad, Kolkata, or Mumbai.</p>
            </li>
            <li>
              <strong>Complete Forms:</strong> Fill out the VoA Application Form and disembarkation card.
            </li>
            <li>
              <strong>Submit & Pay:</strong> Submit documents to the Visa Officer and pay the Visa-on-Arrival fee of ₹2,000 per passenger (including children).
            </li>
            <li>
              <strong>Immigration Assessment:</strong> The Immigration Officer will assess the application.
            </li>
            <li>
              <strong>Visa Granted:</strong> If approved, you receive a Double-entry Visa-on-Arrival valid for up to 60 days.
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}

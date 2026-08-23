import React from 'react';

export default function Help() {
  return (
    <div className="max-w-[1200px] mx-auto py-12 px-6">
      <h1 className="text-4xl font-serif font-bold mb-8 text-primary">Help Centre</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="border border-border p-4 rounded bg-white cursor-pointer group">
                <summary className="font-bold list-none flex justify-between">
                  How do I file my return?
                  <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 text-text-secondary text-sm">
                  You can file your return by registering/logging into the e-Filing portal, selecting the appropriate ITR form, filling in your income and deduction details, and submitting the form. You must also e-Verify your return after submission.
                </div>
              </details>
              <details className="border border-border p-4 rounded bg-white cursor-pointer group">
                <summary className="font-bold list-none flex justify-between">
                  Which ITR form should I use?
                  <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 text-text-secondary text-sm">
                  The form depends on your income sources. E.g., ITR-1 is for individuals having income from salary, one house property, and other sources up to ₹50 lakh. Check the "Taxpayer Categories" section for detailed guidance.
                </div>
              </details>
              <details className="border border-border p-4 rounded bg-white cursor-pointer group">
                <summary className="font-bold list-none flex justify-between">
                  How do I check my refund status?
                  <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 text-text-secondary text-sm">
                  You can check your refund status by navigating to the "Refund Status" page and entering your PAN and Assessment Year.
                </div>
              </details>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Browse by Topic</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Filing Returns', 'Registration', 'Login', 'e-Verification', 'PAN', 'Aadhaar', 'Refunds', 'Tax Payments', 'Forms', 'Technical Help', 'Grievances'].map(topic => (
                <div key={topic} className="border border-border p-3 rounded text-center text-sm font-bold text-primary hover:bg-primary hover:text-white transition cursor-pointer">
                  {topic}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-primary-light border-t-4 border-primary p-6 rounded-sm">
            <h2 className="text-xl font-bold mb-2 text-primary">Official Helpdesk</h2>
            <p className="text-sm text-text-secondary mb-4">For official assistance, please visit the Income Tax Department's contact page.</p>
            <a href="https://www.incometax.gov.in/iec/foportal/contact-us" className="block text-center bg-white border border-primary text-primary px-4 py-2 font-bold hover:bg-primary hover:text-white transition">Visit Contact Us</a>
          </section>

          <section className="bg-white border border-border p-6 rounded-sm shadow-sm">
            <h2 className="text-xl font-bold mb-2">Grievances</h2>
            <p className="text-sm text-text-secondary mb-4">Submit or view the status of a grievance.</p>
            <div className="space-y-2">
              <a href="https://eportal.incometax.gov.in/iec/foservices/#/fo-greivance/submit" className="block text-primary text-sm font-bold hover:underline">Submit Grievance &rarr;</a>
              <a href="https://eportal.incometax.gov.in/iec/foservices/#/fo-greivance/view" className="block text-primary text-sm font-bold hover:underline">View Grievance &rarr;</a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

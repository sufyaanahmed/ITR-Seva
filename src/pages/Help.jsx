import React from 'react';

export default function Help() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-serif font-bold mb-8">Get Help</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="border border-border p-4 rounded bg-white cursor-pointer group">
              <summary className="font-bold list-none flex justify-between">
                What is an e-Visa?
                <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-text-secondary text-sm">
                An e-Visa is an electronic authorization to travel to India for tourism, business, or medical purposes. You can apply for it completely online without visiting an embassy.
              </div>
            </details>
            <details className="border border-border p-4 rounded bg-white cursor-pointer group">
              <summary className="font-bold list-none flex justify-between">
                How long does processing take?
                <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-text-secondary text-sm">
                Typically, e-Visas are processed within 72 hours. Regular paper visas may take longer depending on the mission and nationality.
              </div>
            </details>
            <details className="border border-border p-4 rounded bg-white cursor-pointer group">
              <summary className="font-bold list-none flex justify-between">
                What documents do I need?
                <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-text-secondary text-sm">
                You generally need a recent photograph with a white background and a scanned copy of your passport's bio page. Business and medical visas may require additional documentation.
              </div>
            </details>
          </div>
        </section>

        <section className="bg-primary text-white p-8 rounded-lg mt-12 text-center" style={{ backgroundColor: '#172554' }}>
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="mb-6">Our support team is available 24/7 to assist you with your application process.</p>
          <button className="bg-white text-primary px-6 py-3 rounded font-bold hover:bg-gray-100 transition">Contact Support</button>
        </section>
      </div>
    </div>
  );
}

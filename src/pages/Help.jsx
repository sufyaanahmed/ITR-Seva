import React from 'react';

const faqs = [
  {
    category: "General & Eligibility",
    items: [
      {
        q: "What is an e-Visa?",
        a: "An e-Visa is an electronic authorization to travel to India for tourism, business, or medical purposes. You can apply for it completely online without visiting an embassy."
      },
      {
        q: "How early should I apply before my travel date?",
        a: "You can apply for an e-Visa up to 120 days in advance of your arrival, but you must apply at least 4 days before your date of travel."
      },
      {
        q: "Are there restricted areas I cannot visit with an e-Visa?",
        a: "Yes. The e-Visa does not allow entry into Protected/Restricted Areas (like certain parts of Sikkim or Arunachal Pradesh). You will need to obtain a separate Protected Area Permit (PAP) to visit those regions."
      }
    ]
  },
  {
    category: "Application & Documents",
    items: [
      {
        q: "What documents do I need to apply?",
        a: "Generally, you need a recent photograph (white background) and a scanned copy of your passport's bio page. Business and medical visas may require additional documentation like a letter of invitation or a hospital letter."
      },
      {
        q: "How long does the processing take?",
        a: "e-Visas are typically processed within 72 hours. However, it is highly recommended to apply well in advance in case of unexpected delays."
      },
      {
        q: "Can I edit my application after submitting?",
        a: "No. Once you submit the final application and proceed to payment, no further edits can be made. Ensure all details exactly match your passport."
      }
    ]
  },
  {
    category: "Payment & Post-Submission",
    items: [
      {
        q: "My payment failed. What should I do?",
        a: "If your payment fails, please wait a few hours before trying again, or try a different card. Do not make multiple attempts in quick succession to avoid double-charging."
      },
      {
        q: "Do I need to carry a printed copy of the ETA?",
        a: "Yes. You must print your Electronic Travel Authorization (ETA) and carry it with you to present at Immigration upon your arrival in India."
      },
      {
        q: "Is the e-Visa valid for multiple entries?",
        a: "It depends on the sub-category. For example, 1-year and 5-year e-Tourist visas allow multiple entries. The 30-day e-Tourist visa allows double entry."
      }
    ]
  }
];

export default function Help() {
  return (
    <div className="min-h-screen bg-surface pattern-kalamkari py-12 px-4 relative">
      <div className="absolute inset-0 bg-surface/90" />
      <div className="max-w-4xl mx-auto relative z-10">
        
        <div className="text-center mb-16">
          <p className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-secondary-accent mb-3">Support Center</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">How can we help?</h1>
          <p className="text-text-secondary font-sans max-w-2xl mx-auto">Find answers to the most common questions regarding the Indian visa process, eligibility, and post-submission steps.</p>
        </div>
        
        <div className="space-y-12">
          {faqs.map((group, idx) => (
            <section key={idx}>
              <h2 className="text-xl font-serif font-bold text-primary border-b border-border-dark pb-3 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-secondary-accent/20 flex items-center justify-center text-secondary-accent text-sm">
                  {idx + 1}
                </span>
                {group.category}
              </h2>
              <div className="space-y-4">
                {group.items.map((faq, fIdx) => (
                  <details key={fIdx} className="group border border-border-dark bg-white shadow-sm p-5 transition-all duration-300 hover:border-secondary-accent/50 open:shadow-md open:border-secondary-accent/30">
                    <summary className="font-sans font-bold text-primary cursor-pointer list-none flex justify-between items-center pr-2">
                      <span className="pr-4">{faq.q}</span>
                      <span className="text-secondary-accent transform group-open:rotate-180 transition-transform duration-300 flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </span>
                    </summary>
                    <div className="mt-4 text-text-secondary text-sm font-sans leading-relaxed border-t border-border pt-4">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}

          <section className="bg-primary-dark text-white p-10 mt-16 text-center border-t-4 border-secondary-accent shadow-xl relative overflow-hidden rounded-sm">
            <div className="absolute inset-0 pattern-jali opacity-10" />
            <div className="relative z-10">
              <h2 className="text-2xl font-serif font-bold mb-3">Still need help?</h2>
              <p className="mb-8 text-primary-light font-sans max-w-lg mx-auto">If you couldn't find the answer to your question, our support team is available to assist you with your application process.</p>
              <button className="bg-gradient-to-r from-secondary-accent to-[#C9933A] text-primary-dark px-8 py-3.5 font-sans font-bold uppercase tracking-widest text-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                Contact Support
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

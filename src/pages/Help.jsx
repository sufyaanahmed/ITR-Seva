import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

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
      },
      {
        q: "What is the difference between Visa on Arrival and e-Visa?",
        a: "Visa on Arrival (VoA) is restricted strictly to qualifying citizens of Japan, South Korea, and the UAE at 6 designated airports. All other eligible foreign nationals should obtain an e-Visa online prior to boarding."
      }
    ]
  },
  {
    category: "Application & Documents",
    items: [
      {
        q: "What documents do I need to apply?",
        a: "Generally, you need a recent photograph (white background, 50mm x 50mm) and a scanned copy of your passport's bio page (PDF). Business and medical visas require an invitation card/letter or hospital referral."
      },
      {
        q: "How long does the processing take?",
        a: "e-Visas are typically processed within 72 hours. However, it is highly recommended to apply at least 7 to 10 days in advance during peak tourism seasons."
      },
      {
        q: "Can I edit my application after submitting?",
        a: "No. Once you submit the final application, no further edits can be made. Ensure all details match your physical passport exactly."
      },
      {
        q: "What passport validity is required?",
        a: "Your physical passport must have at least 6 months of remaining validity from the date of arrival in India and contain at least 2 blank pages for immigration stamps."
      }
    ]
  },
  {
    category: "Payment & Post-Submission",
    items: [
      {
        q: "Do I need to carry a printed copy of the ETA?",
        a: "Yes. You must print your official 1-page Electronic Travel Authorization (ETA) and carry it with you to present at Immigration upon your arrival in India. Digital photos or mobile phone screenshots are not accepted."
      },
      {
        q: "What is the mandatory e-Arrival Card requirement?",
        a: "Foreign passengers must submit the online arrival declaration within 72 hours before flight departure. This is an arrival health and customs record, not a visa."
      },
      {
        q: "Is the e-Visa valid for multiple entries?",
        a: "It depends on the category. For example, 1-year and 5-year e-Tourist visas allow multiple entries. The 30-day e-Tourist visa allows double entry."
      },
      {
        q: "What if my payment fails?",
        a: "If payment fails, wait a few minutes before trying again or try an alternate card. Avoid rapid repetitive payment attempts to prevent temporary bank locks."
      }
    ]
  }
];

export default function Help() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...faqs.map((f) => f.category)];

  const filteredFaqs = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return faqs
      .filter((group) => selectedCategory === 'All' || group.category === selectedCategory)
      .map((group) => {
        const matchingItems = group.items.filter(
          (item) => !q || item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
        );
        return { ...group, items: matchingItems };
      })
      .filter((group) => group.items.length > 0);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-surface pattern-kalamkari py-12 px-4 relative">
      <div className="absolute inset-0 bg-surface/90" />
      <div className="max-w-4xl mx-auto relative z-10">
        
        <div className="text-center mb-10">
          <p className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-[#C4762A] mb-3">Guidance & Support Center</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Frequently Asked Questions</h1>
          <p className="text-text-secondary font-sans max-w-2xl mx-auto">Find authoritative answers regarding eligibility rules, document requirements, fees, and pre-arrival procedures.</p>
        </div>

        {/* Live Search & Filter Bar */}
        <div className="bg-white border border-border-dark p-6 rounded-xl shadow-md mb-10 space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keyword (e.g., photo size, validity, 72 hours, fee, arrival card)..."
              className="w-full bg-[#FAF7F0] border border-border-dark px-4 py-3.5 pl-11 text-sm font-sans text-primary focus:outline-none focus:border-[#D4AF37] rounded-lg"
            />
            <div className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-3 text-xs font-bold text-gray-500 hover:text-gray-800 uppercase px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#1E2A4F] text-white shadow-xs'
                    : 'bg-[#FAF7F0] text-gray-700 border border-gray-300 hover:border-[#D4AF37]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        {/* FAQ Groups */}
        <div className="space-y-10">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((group, idx) => (
              <section key={idx}>
                <h2 className="text-lg font-serif font-bold text-primary border-b border-border-dark pb-3 mb-4 flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-secondary-accent/20 flex items-center justify-center text-secondary-accent text-xs font-bold font-mono">
                    {idx + 1}
                  </span>
                  {group.category}
                </h2>
                <div className="space-y-3">
                  {group.items.map((faq, fIdx) => (
                    <details
                      key={fIdx}
                      open={Boolean(searchTerm)}
                      className="group border border-border-dark bg-white shadow-xs p-5 transition-all duration-300 hover:border-secondary-accent/50 open:shadow-md open:border-secondary-accent/30 rounded-lg"
                    >
                      <summary className="font-sans font-bold text-primary cursor-pointer list-none flex justify-between items-center pr-2 text-sm">
                        <span className="pr-4">{faq.q}</span>
                        <span className="text-secondary-accent transform group-open:rotate-180 transition-transform duration-300 flex-shrink-0">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </span>
                      </summary>
                      <div className="mt-3 text-text-secondary text-xs sm:text-sm font-sans leading-relaxed border-t border-border pt-3">
                        {faq.a}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="bg-white border border-border p-8 rounded-xl text-center">
              <h3 className="font-serif font-bold text-lg text-gray-900 mb-1">No FAQs Match Your Search</h3>
              <p className="text-gray-500 text-xs mb-4">Try searching for a different keyword or browse all categories.</p>
              <button
                type="button"
                onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                className="btn-secondary text-xs"
              >
                Reset Search Filters
              </button>
            </div>
          )}

          {/* Direct Assistance Card */}
          <section className="bg-primary-dark text-white p-8 sm:p-10 mt-12 text-center border-t-4 border-secondary-accent shadow-xl relative overflow-hidden rounded-xl">
            <div className="absolute inset-0 pattern-jali opacity-10" />
            <div className="relative z-10">
              <h2 className="text-2xl font-serif font-bold mb-3">Ready to Begin Your Application?</h2>
              <p className="mb-6 text-primary-light font-sans text-xs sm:text-sm max-w-lg mx-auto">
                Use the interactive Visa Finder to verify requirements or launch your e-Visa application directly.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/guide/visa-finder" className="bg-gradient-to-r from-secondary-accent to-[#C9933A] text-primary-dark px-6 py-3 font-sans font-bold uppercase tracking-widest text-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded">
                  Explore Visa Finder →
                </Link>
                <Link to="/status" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 font-sans font-bold uppercase tracking-widest text-xs transition-all duration-300 rounded">
                  Track Application Status
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

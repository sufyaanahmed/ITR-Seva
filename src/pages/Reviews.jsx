import React from 'react';
import reviewsData from '../../visa_seva_indianvisaonline_reviews_refined.json';

const displayCopy = (text = '') => String(text ?? '').replace(/\s*\u2014\s*/g, ', ');

const Reviews = () => {
  const reviews = reviewsData.reviews || [];

  const getPlatformLogo = (source) => {
    const s = source.toLowerCase();

    // Trustpilot - Official style green box with white star
    if (s.includes('trustpilot')) {
      return (
        <svg viewBox="0 0 512 512" className="w-6 h-6 text-[#00b67a]" fill="currentColor" aria-label="Trustpilot">
          <rect width="512" height="512" fill="#00B67A"/>
          <path d="M256 94l51.5 158.4H474l-134.8 98 51.5 158.4L256 311l-134.8 98 51.5-158.4L38 252.4h166.5L256 94z" fill="#FFF"/>
        </svg>
      );
    }

    // X / Twitter
    if (s === 'x' || s.startsWith('x ') || s.includes('twitter')) {
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#1E2A4F]" fill="currentColor" aria-label="X">
          <path d="M18.9 2h3.3l-7.2 8.2L23.5 22h-6.7l-5.2-6.8-6 6.8H2.3l7.7-8.8L2 2h6.9l4.7 6.2L18.9 2z"/>
        </svg>
      );
    }

    // Reddit
    if (s.includes('reddit')) {
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#FF4500]" fill="currentColor" aria-label="Reddit">
          <circle cx="12" cy="12" r="12" />
          <path fill="#FFF" d="M16 11.5c0-.83-.67-1.5-1.5-1.5-.42 0-.8.17-1.07.45C12.18 9.5 10.3 8.86 8.16 8.8l.58-2.73 2.37.5c.03.62.54 1.12 1.17 1.12.65 0 1.18-.53 1.18-1.18 0-.65-.53-1.18-1.18-1.18-.51 0-.96.33-1.11.8l-2.61-.55c-.09-.02-.17.04-.19.12l-.66 3.12c-2.22.04-4.16.7-5.51 1.7-.27-.27-.64-.44-1.06-.44-.83 0-1.5.67-1.5 1.5 0 .61.37 1.14.89 1.37-.03.21-.05.42-.05.64 0 2.91 3.51 5.27 7.84 5.27s7.84-2.36 7.84-5.27c0-.22-.02-.43-.05-.64.53-.23.89-.76.89-1.37zM8.88 15.65c-.65 0-1.18-.53-1.18-1.18 0-.65.53-1.18 1.18-1.18.65 0 1.18.53 1.18 1.18 0 .65-.53 1.18-1.18 1.18zm4.35 1.95c-1.37.01-2.52-.52-2.6-1.15h5.19c-.08.62-1.22 1.15-2.59 1.15zm.7-1.95c-.65 0-1.18-.53-1.18-1.18 0-.65.53-1.18 1.18-1.18.65 0 1.18.53 1.18 1.18 0 .65-.53 1.18-1.18 1.18z"/>
        </svg>
      );
    }

    // Tripadvisor
    if (s.includes('tripadvisor')) {
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#34E0A1]" fill="currentColor" aria-label="Tripadvisor">
          <circle cx="12" cy="12" r="12" />
          <path fill="#000" d="M12 4.5c2 0 3.7.8 5 2l1.3-1.3c.3-.3.8-.3 1.1 0 .3.3.3.8 0 1.1L17.9 8c1 1.5 1.6 3.3 1.6 5.3 0 4.6-3.7 8.3-8.3 8.3S2.9 17.9 2.9 13.3c0-2 .6-3.8 1.6-5.3L3 6.3c-.3-.3-.3-.8 0-1.1.3-.3.8-.3 1.1 0L5.5 6.5c1.3-1.2 3-2 5-2m-3.5 5c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3m0 4.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5m7 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5m0-4.5c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3" />
        </svg>
      );
    }

    // Times of India
    if (s.includes('times of india') || s.includes('toi')) {
      return (
        <div className="font-serif font-black text-xs px-1 border border-black text-black bg-white" aria-label="Times of India">
          TOI
        </div>
      );
    }

    // Default fallback
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-500" fill="currentColor">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
      </svg>
    );
  };

  return (
    <div className="bg-[#FAF7F0] min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#C4762A] mb-3 font-sans">Public Feedback</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1E2A4F] mb-6">User Reviews & Experiences</h1>
          <div className="w-16 h-px bg-[#D4AF37] mx-auto mb-6" />
          <p className="max-w-3xl mx-auto text-sm text-[#1E2A4F]/80 font-sans leading-relaxed">
            {reviewsData.summary.headline}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm border border-[#1E2A4F]/10 flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1E2A4F]/5 flex items-center justify-center font-bold text-[#1E2A4F] shadow-inner">
                    {review.reviewer?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#1E2A4F]">{review.reviewer || 'Anonymous'}</h3>
                    <p className="text-xs text-gray-500 font-medium">{review.date}</p>
                  </div>
                </div>
                <div title={review.source} className="opacity-80">
                  {getPlatformLogo(review.source)}
                </div>
              </div>

              {review.rating && (
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              )}

              <h4 className="font-bold text-[#1E2A4F] text-sm mb-3 font-serif leading-snug">{displayCopy(review.title)}</h4>

              <p className="text-sm text-gray-700 mb-6 flex-1 italic relative before:content-['\201C'] before:absolute before:-left-2 before:-top-1 before:text-gray-300 before:text-xl leading-relaxed break-words whitespace-pre-wrap">
                {displayCopy(review.text || review.thread_full_text || "No content available")}
              </p>

              <div className="mt-auto pt-4 border-t border-gray-100">
                <a
                  href={review.source_review_url || review.source_url || review.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#C4762A] hover:text-[#1E2A4F] transition-colors group"
                >
                  View Original
                  <span className="text-sm transform group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;

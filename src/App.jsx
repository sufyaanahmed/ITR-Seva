import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Loader from './components/Loader';
import ScrollToTop from './components/ScrollToTop';

const Wizard = lazy(() => import('./pages/Wizard'));
const Status = lazy(() => import('./pages/Status'));
const EArrival = lazy(() => import('./pages/EArrival'));
const Resume = lazy(() => import('./pages/Resume'));
const Help = lazy(() => import('./pages/Help'));
const Tourism = lazy(() => import('./pages/Tourism'));
const AfghanFlow = lazy(() => import('./pages/flows/AfghanFlow'));
const VoaFlow = lazy(() => import('./pages/flows/VoaFlow'));
const NormalFlow = lazy(() => import('./pages/flows/NormalFlow'));
const RegularFlow = lazy(() => import('./pages/flows/RegularFlow'));
const VisaFinder = lazy(() => import('./pages/guide/VisaFinder'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Reviews = lazy(() => import('./pages/Reviews'));

const Header = ({ toggleHighContrast, toggleLargeText, isHighContrast, isLargeText }) => {
  const [isAccessOpen, setIsAccessOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border relative z-50">
      <div className="max-w-[1200px] mx-auto w-full min-h-[104px] py-4 px-6 flex items-center justify-between gap-4">
        
        <Link to="/" className="flex items-center gap-3 sm:gap-4 text-primary no-underline font-serif text-[1.2rem] sm:text-[1.4rem] md:text-2xl mr-auto group shrink-0" aria-label="India Visa Seva home">
          <span className="h-[48px] w-[48px] sm:h-[56px] sm:w-[56px] grid place-items-center shrink-0" aria-hidden="true">
            <img src="/emblem.svg" alt="National Emblem" className="h-10 sm:h-14 w-auto drop-shadow-sm opacity-90" />
          </span>
          <div className="flex flex-col leading-tight border-l border-border pl-3 sm:pl-4">
            <span className="text-secondary-accent text-[0.60rem] sm:text-[0.65rem] font-sans uppercase tracking-[0.2em] font-medium mb-1">Republic of India</span>
            <span className="font-bold text-primary-dark">India Visa Seva</span>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/guide/visa-finder" className="text-text font-sans font-medium text-[0.85rem] lg:text-[0.9rem] uppercase tracking-wider hover:text-secondary-accent transition-colors">Apply</Link>
          <Link to="/dashboard" className="text-text font-sans font-medium text-[0.85rem] lg:text-[0.9rem] uppercase tracking-wider hover:text-secondary-accent transition-colors">My Application</Link>
          <Link to="/status" className="text-text font-sans font-medium text-[0.85rem] lg:text-[0.9rem] uppercase tracking-wider hover:text-secondary-accent transition-colors">Before You Travel</Link>
          <Link to="/tourism" className="text-text font-sans font-medium text-[0.85rem] lg:text-[0.9rem] uppercase tracking-wider hover:text-secondary-accent transition-colors">Discover India</Link>
          <Link to="/help" className="text-text font-sans font-medium text-[0.85rem] lg:text-[0.9rem] uppercase tracking-wider hover:text-secondary-accent transition-colors">Help</Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="relative">
            <button 
              onClick={() => setIsAccessOpen(!isAccessOpen)}
              className="flex items-center gap-1 sm:gap-2 bg-white border border-gray-200 text-gray-700 h-[36px] sm:h-[40px] px-2 sm:px-4 rounded-full font-sans text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              aria-label="Accessibility options"
              aria-expanded={isAccessOpen}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-600" fill="currentColor">
                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
              </svg>
              <span className="hidden sm:inline">Accessibility</span>
            </button>
            
            {isAccessOpen && (
              <div className="absolute top-full right-0 mt-3 w-56 bg-white shadow-xl border border-gray-100 z-50 rounded-xl py-2 overflow-hidden transform origin-top-right transition-all">
                <div className="px-4 py-2 border-b border-gray-50 bg-gray-50/50">
                  <span className="text-[0.65rem] font-bold text-gray-500 uppercase tracking-widest">Display Settings</span>
                </div>
                <button 
                  onClick={toggleHighContrast}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-[#FAF7F0] flex items-center justify-between text-gray-800 font-medium transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/></svg>
                    High Contrast
                  </div>
                  {isHighContrast && <span className="text-[#00b67a] font-bold">✓</span>}
                </button>
                <button 
                  onClick={toggleLargeText}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-[#FAF7F0] flex items-center justify-between text-gray-800 font-medium transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>
                    Large Text
                  </div>
                  {isLargeText && <span className="text-[#00b67a] font-bold">✓</span>}
                </button>
              </div>
            )}
          </div>

          <button 
            className="md:hidden flex items-center justify-center p-2 text-primary focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 z-40 shadow-xl flex flex-col px-6 py-4">
          <Link to="/guide/visa-finder" onClick={() => setIsMenuOpen(false)} className="py-3 text-text font-sans font-medium text-[0.95rem] uppercase tracking-wider hover:text-secondary-accent border-b border-gray-50">Apply</Link>
          <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="py-3 text-text font-sans font-medium text-[0.95rem] uppercase tracking-wider hover:text-secondary-accent border-b border-gray-50">My Application</Link>
          <Link to="/status" onClick={() => setIsMenuOpen(false)} className="py-3 text-text font-sans font-medium text-[0.95rem] uppercase tracking-wider hover:text-secondary-accent border-b border-gray-50">Before You Travel</Link>
          <Link to="/tourism" onClick={() => setIsMenuOpen(false)} className="py-3 text-text font-sans font-medium text-[0.95rem] uppercase tracking-wider hover:text-secondary-accent border-b border-gray-50">Discover India</Link>
          <Link to="/help" onClick={() => setIsMenuOpen(false)} className="py-3 text-text font-sans font-medium text-[0.95rem] uppercase tracking-wider hover:text-secondary-accent">Help</Link>
        </nav>
      )}
    </header>
  );
};

const Footer = () => (
  <footer className="bg-primary-dark text-white mt-12 py-16 border-t-[8px] border-secondary-accent pattern-jali">
    <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
      <div>
        <h3 className="font-serif font-bold text-2xl mb-4 text-surface">India Visa Seva</h3>
        <p className="text-primary-light text-sm font-sans">Official portal for Indian e-Visa services and travel authorization.</p>
      </div>
      <div>
        <h3 className="font-sans font-medium text-sm uppercase tracking-widest mb-6 text-surface">Quick Links</h3>
        <ul className="flex flex-col gap-3 text-sm text-primary-light font-sans">
          <li><Link to="/guide/visa-finder" className="hover:text-secondary-accent transition-colors">Apply</Link></li>
          <li><Link to="/dashboard" className="hover:text-secondary-accent transition-colors">My Application</Link></li>
          <li><Link to="/status" className="hover:text-secondary-accent transition-colors">Check Status</Link></li>
          <li><Link to="/e-arrival" className="hover:text-secondary-accent transition-colors">e-Arrival Guidance</Link></li>
          <li><Link to="/tourism" className="hover:text-secondary-accent transition-colors">Discover India</Link></li>
          <li><Link to="/help" className="hover:text-secondary-accent transition-colors">FAQ</Link></li>
          <li><Link to="/reviews" className="hover:text-secondary-accent transition-colors">Public Reviews</Link></li>
        </ul>
      </div>
    </div>
  </footer>
);

const RouteFallback = () => (
  <div
    role="status"
    aria-live="polite"
    aria-busy="true"
    className="mx-auto flex min-h-[40vh] max-w-6xl items-center justify-center px-6 text-center"
  >
    <span className="font-sans text-sm font-semibold uppercase tracking-[0.16em] text-primary">
      Loading demo…
    </span>
  </div>
);

export default function App() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);

  useEffect(() => {
    if (isHighContrast) document.documentElement.classList.add('contrast-125', 'saturate-200');
    else document.documentElement.classList.remove('contrast-125', 'saturate-200');
    
    if (isLargeText) document.documentElement.classList.add('text-lg');
    else document.documentElement.classList.remove('text-lg');
  }, [isHighContrast, isLargeText]);

  return (
    <div className={`min-h-screen flex flex-col bg-background font-sans text-text ${isHighContrast ? 'grayscale' : ''}`}>
      <ScrollToTop />
      <Loader />
      <Header 
        toggleHighContrast={() => setIsHighContrast(!isHighContrast)}
        toggleLargeText={() => setIsLargeText(!isLargeText)}
        isHighContrast={isHighContrast}
        isLargeText={isLargeText}
      />
      <div className="bg-secondary-accent text-white py-3 px-4 text-center text-sm font-medium tracking-wide">
        Travel-guidance snapshot: review the separate <Link to="/e-arrival" className="underline font-bold hover:text-primary-dark transition-colors">e-Arrival Card explainer</Link> and verify it on the official service before travel.
      </div>
      <main id="main-content" className="flex-1 w-full">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flow/afghan" element={<AfghanFlow />} />
            <Route path="/flow/voa" element={<VoaFlow />} />
            <Route path="/flow/normal" element={<NormalFlow />} />
            <Route path="/flow/regular" element={<RegularFlow />} />
            <Route path="/guide/visa-finder" element={<VisaFinder />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/status" element={<Status />} />
            <Route path="/e-arrival" element={<EArrival />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/help" element={<Help />} />
            <Route path="/tourism" element={<Tourism />} />
            <Route path="/apply" element={<Wizard />} />
            <Route path="/reviews" element={<Reviews />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

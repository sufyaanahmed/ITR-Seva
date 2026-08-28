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

  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-[1200px] mx-auto w-full min-h-[104px] py-4 px-6 grid grid-cols-1 md:grid-cols-[auto_1fr_auto_auto] items-center gap-6">
        <Link to="/" className="flex items-center gap-4 text-primary no-underline font-serif text-[1.4rem] md:text-2xl mr-auto group" aria-label="India Visa Seva home">
          <span className="h-[56px] w-[56px] grid place-items-center" aria-hidden="true">
            <img src="/emblem.svg" alt="National Emblem" className="h-14 w-auto drop-shadow-sm opacity-90" />
          </span>
          <div className="flex flex-col leading-tight border-l border-border pl-4">
            <span className="text-secondary-accent text-[0.65rem] font-sans uppercase tracking-[0.2em] font-medium mb-1">Republic of India</span>
            <span className="font-bold text-primary-dark">India Visa Seva</span>
          </div>
        </Link>
        <nav className="flex flex-wrap items-center gap-6 md:justify-end row-start-2 md:row-start-1 md:col-start-2 col-span-full md:col-span-1 w-full md:w-auto">
          <Link to="/guide/visa-finder" className="text-text font-sans font-medium text-[0.9rem] uppercase tracking-wider hover:text-secondary-accent transition-colors">Apply</Link>
          <Link to="/dashboard" className="text-text font-sans font-medium text-[0.9rem] uppercase tracking-wider hover:text-secondary-accent transition-colors">My Application</Link>
          <Link to="/status" className="text-text font-sans font-medium text-[0.9rem] uppercase tracking-wider hover:text-secondary-accent transition-colors">Before You Travel</Link>
          <Link to="/tourism" className="text-text font-sans font-medium text-[0.9rem] uppercase tracking-wider hover:text-secondary-accent transition-colors">Discover India</Link>
          <Link to="/help" className="text-text font-sans font-medium text-[0.9rem] uppercase tracking-wider hover:text-secondary-accent transition-colors">Help</Link>
        </nav>
        <div className="flex items-center gap-3 row-start-1 col-start-2 md:col-start-3 justify-self-end">
          <select className="bg-surface border border-border-dark text-text h-[44px] px-3 font-sans text-sm focus:outline-none focus:border-primary transition-colors cursor-pointer">
            <option>English</option>
            <option>हिन्दी</option>
          </select>
        </div>
        <div className="flex items-center row-start-1 col-start-3 md:col-start-4 justify-self-end relative">
          <button 
            onClick={() => setIsAccessOpen(!isAccessOpen)}
            className="bg-transparent border border-border-dark text-text h-[44px] px-4 font-sans text-sm font-medium hover:bg-surface-dark transition-colors"
          >
            Accessibility
          </button>
          
          {isAccessOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-xl border border-gray-200 z-50 rounded-sm py-2">
              <button 
                onClick={toggleHighContrast}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between text-black"
              >
                High Contrast
                {isHighContrast && <span className="text-green-600 font-bold">✓</span>}
              </button>
              <button 
                onClick={toggleLargeText}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between text-black"
              >
                Large Text
                {isLargeText && <span className="text-green-600 font-bold">✓</span>}
              </button>
            </div>
          )}
        </div>
      </div>
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

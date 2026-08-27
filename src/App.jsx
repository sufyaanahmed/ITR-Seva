import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Service from './pages/Service';
import Wizard from './pages/Wizard';
import Status from './pages/Status';
import Resume from './pages/Resume';
import Help from './pages/Help';
import Tourism from './pages/Tourism';
import Demo from './pages/Demo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  // Accessibility State
  const [isAccessMenuOpen, setIsAccessMenuOpen] = React.useState(false);
  const [textZoom, setTextZoom] = React.useState(0);
  const [highContrast, setHighContrast] = React.useState(false);
  const [highlightLinks, setHighlightLinks] = React.useState(false);

  React.useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('text-zoom-1', 'text-zoom-2', 'high-contrast', 'highlight-links');
    if (textZoom === 1) html.classList.add('text-zoom-1');
    if (textZoom === 2) html.classList.add('text-zoom-2');
    if (highContrast) html.classList.add('high-contrast');
    if (highlightLinks) html.classList.add('highlight-links');
  }, [textZoom, highContrast, highlightLinks]);

  return (
    <header className="bg-background border-b border-border relative z-50">
      <div className="max-w-[1200px] mx-auto w-full min-h-[104px] py-4 px-6 flex justify-between items-center gap-6">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-4 text-primary no-underline font-serif text-[1.4rem] md:text-2xl mr-auto group z-50">
          <img src="/Emblem_of_India.svg" alt="Emblem of India" className="h-[60px] opacity-90 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col leading-tight border-l border-border pl-4">
            <span className="text-secondary-accent text-[0.65rem] font-sans uppercase tracking-[0.2em] font-medium mb-1">Bharat</span>
            <span className="font-bold text-primary-dark">Visa Seva</span>
          </div>
        </Link>
        
        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6 relative">
          <Link to="/guide/visa-finder" className="text-text font-sans font-medium text-[0.9rem] uppercase tracking-wider hover:text-secondary-accent transition-colors">Apply</Link>
          <Link to="/dashboard" className="text-text font-sans font-medium text-[0.9rem] uppercase tracking-wider hover:text-secondary-accent transition-colors">My Application</Link>
          <Link to="/status" className="text-text font-sans font-medium text-[0.9rem] uppercase tracking-wider hover:text-secondary-accent transition-colors">Before You Travel</Link>
          <Link to="/tourism" className="text-text font-sans font-medium text-[0.9rem] uppercase tracking-wider hover:text-secondary-accent transition-colors">Discover India</Link>
          <Link to="/help" className="text-text font-sans font-medium text-[0.9rem] uppercase tracking-wider hover:text-secondary-accent transition-colors">Help</Link>
          
          <div className="relative">
            <button 
              className="bg-transparent border border-border-dark text-text h-[44px] px-4 font-sans text-sm font-medium hover:bg-surface-dark transition-colors flex items-center gap-2"
              onClick={() => setIsAccessMenuOpen(!isAccessMenuOpen)}
            >
              Accessibility
              <span className={`text-xs transition-transform ${isAccessMenuOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {/* Accessibility Dropdown */}
            {isAccessMenuOpen && (
              <div className="absolute top-[100%] right-0 mt-2 w-64 bg-white border border-border-dark shadow-xl rounded-sm p-4 z-50 flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-border-dark pb-2">
                  <span className="font-sans font-bold text-sm text-primary-dark uppercase tracking-widest">Text Size</span>
                  <div className="flex gap-1">
                    <button onClick={() => setTextZoom(Math.max(0, textZoom - 1))} className="w-8 h-8 flex items-center justify-center border border-border-dark hover:bg-surface text-sm">-</button>
                    <button onClick={() => setTextZoom(Math.min(2, textZoom + 1))} className="w-8 h-8 flex items-center justify-center border border-border-dark hover:bg-surface text-sm">+</button>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-border-dark pb-2">
                  <span className="font-sans font-bold text-sm text-primary-dark uppercase tracking-widest">High Contrast</span>
                  <button 
                    onClick={() => setHighContrast(!highContrast)} 
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${highContrast ? 'bg-primary' : 'bg-surface-dark'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${highContrast ? 'translate-x-6' : ''}`} />
                  </button>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span className="font-sans font-bold text-sm text-primary-dark uppercase tracking-widest">Highlight Links</span>
                  <button 
                    onClick={() => setHighlightLinks(!highlightLinks)} 
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${highlightLinks ? 'bg-primary' : 'bg-surface-dark'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${highlightLinks ? 'translate-x-6' : ''}`} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button 
          className="md:hidden flex flex-col items-center justify-center gap-[6px] w-10 h-10 z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className={`block w-6 h-0.5 bg-primary-dark transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
          <span className={`block w-6 h-0.5 bg-primary-dark transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-primary-dark transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
        </button>
      </div>

      {/* MOBILE NAV DROPDOWN */}
      <div className={`md:hidden absolute top-[104px] left-0 w-full bg-background border-b border-border shadow-lg transition-all duration-300 origin-top overflow-y-auto ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className="flex flex-col items-start px-6 py-4 gap-4">
          <Link to="/guide/visa-finder" onClick={() => setIsMenuOpen(false)} className="text-text font-sans font-medium text-[1rem] uppercase tracking-wider hover:text-secondary-accent transition-colors">Apply</Link>
          <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-text font-sans font-medium text-[1rem] uppercase tracking-wider hover:text-secondary-accent transition-colors">My Application</Link>
          <Link to="/status" onClick={() => setIsMenuOpen(false)} className="text-text font-sans font-medium text-[1rem] uppercase tracking-wider hover:text-secondary-accent transition-colors">Before You Travel</Link>
          <Link to="/tourism" onClick={() => setIsMenuOpen(false)} className="text-text font-sans font-medium text-[1rem] uppercase tracking-wider hover:text-secondary-accent transition-colors">Discover India</Link>
          <Link to="/help" onClick={() => setIsMenuOpen(false)} className="text-text font-sans font-medium text-[1rem] uppercase tracking-wider hover:text-secondary-accent transition-colors">Help</Link>
          
          <div className="w-full mt-4 border-t border-border-dark pt-4">
            <span className="font-sans font-bold text-sm text-primary-dark uppercase tracking-widest block mb-4">Accessibility Tools</span>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-text font-medium text-sm">Text Size</span>
                <div className="flex gap-1">
                  <button onClick={() => setTextZoom(Math.max(0, textZoom - 1))} className="w-10 h-10 border border-border-dark flex justify-center items-center">-</button>
                  <button onClick={() => setTextZoom(Math.min(2, textZoom + 1))} className="w-10 h-10 border border-border-dark flex justify-center items-center">+</button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text font-medium text-sm">High Contrast</span>
                <button onClick={() => setHighContrast(!highContrast)} className={`w-14 h-8 rounded-full p-1 transition-colors ${highContrast ? 'bg-primary' : 'bg-surface-dark'}`}>
                  <div className={`w-6 h-6 rounded-full bg-white transition-transform ${highContrast ? 'translate-x-6' : ''}`} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text font-medium text-sm">Highlight Links</span>
                <button onClick={() => setHighlightLinks(!highlightLinks)} className={`w-14 h-8 rounded-full p-1 transition-colors ${highlightLinks ? 'bg-primary' : 'bg-surface-dark'}`}>
                  <div className={`w-6 h-6 rounded-full bg-white transition-transform ${highlightLinks ? 'translate-x-6' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-primary-dark text-white py-16 border-t-[8px] border-secondary-accent pattern-jali">
    <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
      <div>
        <h3 className="font-serif font-bold text-2xl mb-4 text-surface">Visa Seva</h3>
        <p className="text-primary-light text-sm font-sans">Not Official portal for Indian Visa services.</p>
      </div>
      <div>
        <h3 className="font-sans font-medium text-sm uppercase tracking-widest mb-6 text-surface">Quick Links</h3>
        <ul className="flex flex-col gap-3 text-sm text-primary-light font-sans">
          <li><Link to="/guide/visa-finder" className="hover:text-secondary-accent transition-colors">Find My Visa</Link></li>
          <li><Link to="/dashboard" className="hover:text-secondary-accent transition-colors">Application Dashboard</Link></li>
          <li><Link to="/status" className="hover:text-secondary-accent transition-colors">Check Status</Link></li>
          <li><Link to="/tourism" className="hover:text-secondary-accent transition-colors">Discover India</Link></li>
          <li><Link to="/help" className="hover:text-secondary-accent transition-colors">FAQ</Link></li>
        </ul>
      </div>
    </div>
  </footer>
);

import Loader from './components/Loader';
import ScrollToTop from './components/ScrollToTop';
import AfghanFlow from './pages/flows/AfghanFlow';
import VoaFlow from './pages/flows/VoaFlow';
import NormalFlow from './pages/flows/NormalFlow';
import RegularFlow from './pages/flows/RegularFlow';
import VisaFinder from './pages/guide/VisaFinder';
import Dashboard from './pages/dashboard/Dashboard';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-text">
      <ScrollToTop />
      <Loader />
      <Header />
      <div className="bg-secondary-accent text-white py-3 px-4 text-center text-sm font-medium tracking-wide">
        Foreigners and OCI Card holders must complete the <Link to="/status" className="underline font-bold hover:text-primary-dark transition-colors">e-Arrival card</Link> online within 72 hours before their arrival in India.
      </div>
      <main id="main-content" className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flow/afghan" element={<AfghanFlow />} />
          <Route path="/flow/voa" element={<VoaFlow />} />
          <Route path="/flow/normal" element={<NormalFlow />} />
          <Route path="/flow/regular" element={<RegularFlow />} />
          <Route path="/guide/visa-finder" element={<VisaFinder />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/status" element={<Status />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/help" element={<Help />} />
          <Route path="/tourism" element={<Tourism />} />
          <Route path="/apply" element={<Wizard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

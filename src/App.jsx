import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
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

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const [textZoom, setTextZoom] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = `${textZoom}%`;
    root.classList.toggle('high-contrast', highContrast);
    root.classList.toggle('highlight-links', highlightLinks);
    return () => {
      root.style.fontSize = '';
      root.classList.remove('high-contrast', 'highlight-links');
    };
  }, [textZoom, highContrast, highlightLinks]);

  const navLinkClass = 'text-text font-sans font-medium text-[0.85rem] uppercase tracking-wider hover:text-secondary-accent transition-colors';
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="relative z-50 border-b border-border bg-background">
      <div className="mx-auto flex min-h-[104px] w-full max-w-[1200px] flex-wrap items-center gap-4 px-4 py-4 sm:px-6 lg:flex-nowrap">
        <Link to="/" className="group mr-auto flex shrink-0 items-center gap-3 font-serif text-[1.2rem] text-primary no-underline sm:gap-4 sm:text-[1.4rem] md:text-2xl" aria-label="India Visa Seva independent demo home">
          <span className="grid h-[48px] w-[48px] shrink-0 place-items-center sm:h-[56px] sm:w-[56px]" aria-hidden="true">
            <img src="/emblem.svg" alt="" className="h-10 w-auto opacity-90 drop-shadow-sm sm:h-14" />
          </span>
          <span className="flex flex-col border-l border-border pl-3 leading-tight sm:pl-4">
            <span className="mb-1 font-sans text-[0.6rem] font-bold uppercase tracking-[0.2em] text-secondary-accent sm:text-[0.65rem]">Independent prototype</span>
            <span className="font-bold text-primary-dark">India Visa Seva Demo</span>
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-3 lg:flex xl:gap-6">
          <Link to="/guide/visa-finder" className={navLinkClass}>Apply</Link>
          <Link to="/dashboard" className={navLinkClass}>My Application</Link>
          <Link to="/status" className={navLinkClass}>Before You Travel</Link>
          <Link to="/tourism" className={navLinkClass}>Discover India</Link>
          <Link to="/help" className={navLinkClass}>Help</Link>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setAccessibilityOpen((open) => !open)}
              className="flex h-[40px] items-center gap-2 rounded-full border border-gray-200 bg-white px-3 font-sans text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] sm:px-4 sm:text-sm"
              aria-controls="accessibility-options"
              aria-expanded={accessibilityOpen}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-600" fill="currentColor" aria-hidden="true">
                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
              </svg>
              <span className="hidden sm:inline">Accessibility</span>
            </button>

            {accessibilityOpen && (
              <div id="accessibility-options" className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-xl border border-gray-100 bg-white py-2 text-gray-800 shadow-xl" aria-label="Accessibility options">
                <div className="border-b border-gray-100 bg-gray-50 px-4 py-2 text-[0.65rem] font-bold uppercase tracking-widest text-gray-600">Display settings</div>
                <div className="px-4 py-3">
                  <p className="mb-2 text-xs font-bold">Text size: {textZoom}%</p>
                  <div className="flex gap-2">
                    {[100, 110, 125].map((size) => (
                      <button key={size} type="button" aria-pressed={textZoom === size} onClick={() => setTextZoom(size)} className="rounded border border-gray-300 px-3 py-2 text-xs hover:bg-[#FAF7F0]">{size}%</button>
                    ))}
                  </div>
                </div>
                <button type="button" aria-pressed={highContrast} onClick={() => setHighContrast((value) => !value)} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-[#FAF7F0]">
                  High contrast {highContrast && <span className="font-bold text-[#00875f]">On</span>}
                </button>
                <button type="button" aria-pressed={highlightLinks} onClick={() => setHighlightLinks((value) => !value)} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-[#FAF7F0]">
                  Highlight links {highlightLinks && <span className="font-bold text-[#00875f]">On</span>}
                </button>
              </div>
            )}
          </div>

          <button type="button" className="flex items-center justify-center p-2 text-primary focus:outline-none focus:ring-2 focus:ring-[#D4AF37] lg:hidden" onClick={() => setMenuOpen((open) => !open)} aria-controls="mobile-navigation" aria-expanded={menuOpen} aria-label="Toggle navigation menu">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="absolute left-0 z-40 flex w-full flex-col border-t border-gray-100 bg-white px-6 py-4 shadow-xl lg:hidden">
          <Link to="/guide/visa-finder" onClick={closeMenu} className="border-b border-gray-100 py-3 font-sans text-[0.95rem] font-medium uppercase tracking-wider text-text hover:text-secondary-accent">Apply</Link>
          <Link to="/dashboard" onClick={closeMenu} className="border-b border-gray-100 py-3 font-sans text-[0.95rem] font-medium uppercase tracking-wider text-text hover:text-secondary-accent">My Application</Link>
          <Link to="/status" onClick={closeMenu} className="border-b border-gray-100 py-3 font-sans text-[0.95rem] font-medium uppercase tracking-wider text-text hover:text-secondary-accent">Before You Travel</Link>
          <Link to="/tourism" onClick={closeMenu} className="border-b border-gray-100 py-3 font-sans text-[0.95rem] font-medium uppercase tracking-wider text-text hover:text-secondary-accent">Discover India</Link>
          <Link to="/help" onClick={closeMenu} className="py-3 font-sans text-[0.95rem] font-medium uppercase tracking-wider text-text hover:text-secondary-accent">Help</Link>
        </nav>
      )}
    </header>
  );
};

const Footer = () => (
  <footer className="pattern-jali mt-12 border-t-[8px] border-secondary-accent bg-primary-dark py-16 text-white">
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 sm:grid-cols-2 md:grid-cols-4">
      <div>
        <h3 className="mb-4 font-serif text-2xl font-bold text-surface">India Visa Seva Demo</h3>
        <p className="font-sans text-sm text-primary-light">Independent educational prototype—not affiliated with or endorsed by the Government of India.</p>
      </div>
      <div>
        <h3 className="mb-6 font-sans text-sm font-medium uppercase tracking-widest text-surface">Quick Links</h3>
        <ul className="flex flex-col gap-3 font-sans text-sm text-primary-light">
          <li><Link to="/guide/visa-finder" className="transition-colors hover:text-secondary-accent">Explore Route Demo</Link></li>
          <li><Link to="/dashboard" className="transition-colors hover:text-secondary-accent">Local Draft Dashboard</Link></li>
          <li><Link to="/status" className="transition-colors hover:text-secondary-accent">Synthetic Status Demo</Link></li>
          <li><Link to="/e-arrival" className="transition-colors hover:text-secondary-accent">e-Arrival Guidance</Link></li>
          <li><Link to="/tourism" className="transition-colors hover:text-secondary-accent">Discover India</Link></li>
          <li><Link to="/help" className="transition-colors hover:text-secondary-accent">FAQ</Link></li>
          <li><Link to="/reviews" className="transition-colors hover:text-secondary-accent">Public Reviews</Link></li>
        </ul>
      </div>
    </div>
  </footer>
);

const RouteFallback = () => (
  <div role="status" aria-live="polite" aria-busy="true" className="mx-auto flex min-h-[40vh] max-w-6xl items-center justify-center px-6 text-center">
    <span className="font-sans text-sm font-semibold uppercase tracking-[0.16em] text-primary">Loading demo…</span>
  </div>
);

const NotFound = () => (
  <section className="mx-auto max-w-2xl px-6 py-20 text-center">
    <p className="text-sm font-bold uppercase tracking-widest text-amber-700">Page not found</p>
    <h1 className="mt-3 font-serif text-4xl font-bold">This demo route does not exist</h1>
    <p className="my-6 text-text-secondary">Check the address or return to the route finder.</p>
    <Link to="/guide/visa-finder" className="btn-primary inline-block">Open route finder</Link>
  </section>
);

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-text">
      <ScrollToTop />
      <div role="note" className="sticky top-0 z-[100] border-b-4 border-amber-400 bg-[#2b180f] px-4 py-3 text-center text-sm text-amber-50 shadow-md">
        <strong className="mr-2 uppercase tracking-wider text-amber-300">Independent educational prototype.</strong>
        <span>Not a Government website, not affiliated with the Government of India, and unable to submit or approve a visa. Use synthetic data only.</span>
      </div>
      <Header />
      <div className="bg-secondary-accent px-4 py-3 text-center text-sm font-medium tracking-wide text-white">
        Travel-guidance snapshot: review the separate <Link to="/e-arrival" className="font-bold underline transition-colors hover:text-primary-dark">e-Arrival Card explainer</Link> and verify it on the official service before travel.
      </div>
      <main id="main-content" className="w-full flex-1">
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

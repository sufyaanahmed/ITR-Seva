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
  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-[1200px] mx-auto w-full min-h-[104px] py-4 px-6 grid grid-cols-1 md:grid-cols-[auto_1fr_auto_auto] items-center gap-6">
        <Link to="/" className="flex items-center gap-4 text-primary no-underline font-serif text-[1.4rem] md:text-2xl mr-auto group">
          <img src="/Emblem_of_India.svg" alt="Emblem of India" className="h-[60px] opacity-90 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col leading-tight border-l border-border pl-4">
            <span className="text-secondary-accent text-[0.65rem] font-sans uppercase tracking-[0.2em] font-medium mb-1">Bharat</span>
            <span className="font-bold text-primary-dark">Visa Seva</span>
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
        <div className="flex items-center row-start-1 col-start-3 md:col-start-4 justify-self-end">
          <button className="bg-transparent border border-border-dark text-text h-[44px] px-4 font-sans text-sm font-medium hover:bg-surface-dark transition-colors">
            Accessibility
          </button>
        </div>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-primary-dark text-white mt-12 py-16 border-t-[8px] border-secondary-accent pattern-jali">
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

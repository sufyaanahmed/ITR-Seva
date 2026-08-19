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
    <header className="bg-white border-b-[5px] border-[#163a5f]">
      <div className="max-w-[1200px] mx-auto w-full min-h-[104px] py-[1.2rem] px-[1.5rem] grid grid-cols-1 md:grid-cols-[auto_1fr_auto_auto] items-center gap-[1.15rem]">
        <Link to="/" className="flex items-center gap-3 text-primary no-underline font-serif font-bold text-[1.2rem] md:text-2xl mr-auto">
          <img src="/Emblem_of_India.svg" alt="Emblem of India" className="h-[52px]" />
          <div className="flex flex-col leading-none">
            <span className="text-secondary text-[0.7rem] font-sans uppercase tracking-[0.15em] mb-1">Bharat</span>
            Visa Seva
          </div>
        </Link>
        <nav className="flex flex-wrap items-center gap-[1.15rem] md:justify-end row-start-2 md:row-start-1 md:col-start-2 col-span-full md:col-span-1 w-full md:w-auto">
          <Link to="/" className="text-gray-900 font-bold text-[0.9rem] hover:text-[#163a5f] hover:underline">Home</Link>
          <Link to="/evisa" className="text-gray-900 font-bold text-[0.9rem] hover:text-[#163a5f] hover:underline">Visa Services</Link>
          <Link to="/status" className="text-gray-900 font-bold text-[0.9rem] hover:text-[#163a5f] hover:underline">Check Status</Link>
          <Link to="/tourism" className="text-gray-900 font-bold text-[0.9rem] hover:text-[#163a5f] hover:underline">Tourism</Link>
          <Link to="/help" className="text-gray-900 font-bold text-[0.9rem] hover:text-[#163a5f] hover:underline">Help</Link>
        </nav>
        <div className="flex items-center gap-3 row-start-1 col-start-2 md:col-start-3 justify-self-end">
          <select className="bg-white border border-border-dark text-text h-[44px] px-3 font-sans text-sm rounded-none focus:outline-none focus:border-primary">
            <option>English</option>
            <option>हिन्दी</option>
          </select>
        </div>
        <div className="flex items-center row-start-1 col-start-3 md:col-start-4 justify-self-end">
          <button className="bg-white border border-border-dark text-text h-[44px] px-4 font-sans text-sm font-bold hover:bg-gray-50 transition rounded-none">
            Accessibility
          </button>
        </div>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-white border-t border-border-dark mt-12 py-12">
    <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      <div>
        <h3 className="font-bold mb-4">Visa Seva</h3>
        <p className="text-text-secondary text-sm">Official portal for Indian Visa services.</p>
      </div>
      <div>
        <h3 className="font-bold mb-4">Quick Links</h3>
        <ul className="flex flex-col gap-2 text-sm text-primary">
          <li><Link to="/evisa">Start Application</Link></li>
          <li><Link to="/resume">Resume Draft</Link></li>
          <li><Link to="/status">Check Status</Link></li>
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

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ScrollToTop />
      <Loader />
      <Header />
      <marquee className="py-3 text-[0.95rem] font-medium px-4 text-text" style={{ backgroundColor: '#f0f4f8' }}>
        Foreigners and OCI Card holders can complete and submit the <a href="https://indianvisaonline.gov.in/earrival/" className="text-primary hover:underline font-bold">e-Arrival card</a> online within 72 hours before their arrival in India at <a href="https://boi.gov.in/" className="text-primary hover:underline font-bold">boi.gov.in</a> or <a href="https://indianvisaonline.gov.in/" className="text-primary hover:underline font-bold">indianvisaonline.gov.in</a> or via official 'Indian Visa Su-Swagatam' Mobile App. This is for arrival information, not a visa.
      </marquee>
      <main id="main-content" className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flow/afghan" element={<AfghanFlow />} />
          <Route path="/flow/voa" element={<VoaFlow />} />
          <Route path="/flow/normal" element={<NormalFlow />} />
          <Route path="/flow/regular" element={<RegularFlow />} />
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

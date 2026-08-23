import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Wizard from './pages/Wizard';
import Status from './pages/Status';
import Help from './pages/Help';
import Downloads from './pages/Downloads';
import TaxpayerCategory from './pages/TaxpayerCategory';
import Loader from './components/Loader';
import ScrollToTop from './components/ScrollToTop';

const Header = () => {
  return (
    <header className="bg-white border-b-[5px] border-primary">
      <div className="max-w-[1200px] mx-auto w-full min-h-[104px] py-[1.2rem] px-[1.5rem] grid grid-cols-1 md:grid-cols-[auto_1fr_auto_auto] items-center gap-[1.15rem]">
        <Link to="/" className="flex items-center gap-3 text-primary no-underline font-serif font-bold text-[1.2rem] md:text-2xl mr-auto">
          <img src="/Emblem_of_India.svg" alt="Emblem of India" className="h-[52px]" />
          <div className="flex flex-col leading-none">
            <span className="text-secondary text-[0.75rem] font-sans uppercase font-bold tracking-[0.1em] mb-1">Income Tax Department</span>
            e-Filing
          </div>
        </Link>
        <nav className="flex flex-wrap items-center gap-[1.15rem] md:justify-end row-start-2 md:row-start-1 md:col-start-2 col-span-full md:col-span-1 w-full md:w-auto">
          <Link to="/" className="text-gray-900 font-bold text-[0.9rem] hover:text-primary hover:underline">Home</Link>
          <Link to="/category/individual" className="text-gray-900 font-bold text-[0.9rem] hover:text-primary hover:underline">Individual / HUF</Link>
          <Link to="/category/company" className="text-gray-900 font-bold text-[0.9rem] hover:text-primary hover:underline">Company</Link>
          <Link to="/category/non-company" className="text-gray-900 font-bold text-[0.9rem] hover:text-primary hover:underline">Non-Company</Link>
          <Link to="/category/tax-professionals" className="text-gray-900 font-bold text-[0.9rem] hover:text-primary hover:underline">Tax Professionals</Link>
          <Link to="/downloads" className="text-gray-900 font-bold text-[0.9rem] hover:text-primary hover:underline">Downloads</Link>
          <Link to="/help" className="text-gray-900 font-bold text-[0.9rem] hover:text-primary hover:underline">Help</Link>
        </nav>
        <div className="flex items-center gap-3 row-start-1 col-start-2 md:col-start-3 justify-self-end">
          <select className="bg-white border border-border-dark text-text h-[44px] px-3 font-sans text-sm rounded-none focus:outline-none focus:border-primary">
            <option>English</option>
            <option>हिन्दी</option>
          </select>
        </div>
        <div className="flex items-center row-start-1 col-start-3 md:col-start-4 justify-self-end">
          <button className="bg-white border border-border-dark text-text h-[44px] px-4 font-sans text-sm font-bold hover:bg-gray-50 transition rounded-none">
            Login
          </button>
        </div>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-white border-t border-border-dark mt-12 py-12">
    <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
      <div>
        <h3 className="font-bold text-primary mb-4">About</h3>
        <ul className="flex flex-col gap-2 text-sm text-text-secondary">
          <li><a href="https://www.incometax.gov.in/iec/foportal/about-portal" className="hover:text-primary hover:underline">About Portal</a></li>
          <li><a href="https://www.incometaxindia.gov.in/history-of-direct-taxation" className="hover:text-primary hover:underline">History</a></li>
          <li><a href="https://www.incometaxindia.gov.in/who-we-are" className="hover:text-primary hover:underline">Who We Are</a></li>
          <li><a href="https://www.incometaxindia.gov.in/right-to-information" className="hover:text-primary hover:underline">RTI</a></li>
          <li><a href="https://www.incometaxindia.gov.in/cbdt" className="hover:text-primary hover:underline">Organization & Functions</a></li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-primary mb-4">Services</h3>
        <ul className="flex flex-col gap-2 text-sm text-text-secondary">
          <li><a href="https://eportal.incometax.gov.in/iec/foservices/#/login" className="hover:text-primary hover:underline">Login</a></li>
          <li><a href="https://eportal.incometax.gov.in/iec/foservices/#/pre-login/register" className="hover:text-primary hover:underline">Register</a></li>
          <li><a href="https://eportal.incometax.gov.in/iec/foservices/#/pre-login/eVerifyReturn-bl" className="hover:text-primary hover:underline">e-Verify</a></li>
          <li><a href="https://eportal.incometax.gov.in/iec/foservices/#/pre-login/bl-link-aadhaar" className="hover:text-primary hover:underline">Link Aadhaar</a></li>
          <li><a href="https://eportal.incometax.gov.in/iec/foservices/#/know-refund-status/user-information" className="hover:text-primary hover:underline">Refund Status</a></li>
          <li><a href="https://eportal.incometax.gov.in/iec/foservices/#/e-pay-tax-prelogin/user-details" className="hover:text-primary hover:underline">e-Pay Tax</a></li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-primary mb-4">Resources</h3>
        <ul className="flex flex-col gap-2 text-sm text-text-secondary">
          <li><Link to="/downloads" className="hover:text-primary hover:underline">Income Tax Returns</Link></li>
          <li><Link to="/downloads" className="hover:text-primary hover:underline">Income Tax Forms</Link></li>
          <li><Link to="/downloads" className="hover:text-primary hover:underline">DSC Utility</Link></li>
          <li><Link to="/help" className="hover:text-primary hover:underline">Help</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-primary mb-4">Portal</h3>
        <ul className="flex flex-col gap-2 text-sm text-text-secondary">
          <li><a href="https://www.incometax.gov.in/iec/foportal/using-the-portal/webSitePolicies" className="hover:text-primary hover:underline">Website Policies</a></li>
          <li><a href="https://www.incometax.gov.in/iec/foportal/using-the-portal/accessibility-statement" className="hover:text-primary hover:underline">Accessibility</a></li>
          <li><a href="https://www.incometax.gov.in/iec/foportal/using-the-portal/browser-support" className="hover:text-primary hover:underline">Browser Support</a></li>
          <li><a href="https://www.incometax.gov.in/iec/foportal/using-the-portal/sitemap" className="hover:text-primary hover:underline">Sitemap</a></li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-primary mb-4">Support</h3>
        <ul className="flex flex-col gap-2 text-sm text-text-secondary">
          <li><a href="https://www.incometax.gov.in/iec/foportal/contact-us" className="hover:text-primary hover:underline">Helpdesk</a></li>
          <li><a href="https://eportal.incometax.gov.in/iec/foservices/#/fo-greivance/submit" className="hover:text-primary hover:underline">Submit Grievance</a></li>
          <li><a href="https://eportal.incometax.gov.in/iec/foservices/#/fo-greivance/view" className="hover:text-primary hover:underline">View Grievance</a></li>
        </ul>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ScrollToTop />
      <Loader />
      <Header />
      <div className="bg-yellow-100 border-b border-yellow-200 text-center py-2 px-4 text-sm font-medium text-yellow-800">
        Demo Application — Not the Official Income Tax Department Portal. Do not enter real taxpayer information.
      </div>
      <main id="main-content" className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:type" element={<TaxpayerCategory />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/help" element={<Help />} />
          <Route path="/status" element={<Status />} />
          <Route path="/apply" element={<Wizard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

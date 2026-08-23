import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Help from './pages/Help';
import Downloads from './pages/Downloads';
import TaxpayerCategory from './pages/TaxpayerCategory';
import Status from './pages/Status';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import FileITR from './pages/dashboard/FileITR';
import AIS from './pages/dashboard/AIS';
import Form26AS from './pages/dashboard/Form26AS';
import EPayTax from './pages/dashboard/EPayTax';
import Demands from './pages/dashboard/Demands';
import Grievance from './pages/dashboard/Grievance';
import DocumentCenter from './pages/dashboard/DocumentCenter';
import Loader from './components/Loader';
import ScrollToTop from './components/ScrollToTop';
import { useStore } from './store';

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
          <Link to="/login" className="bg-white border border-border-dark text-text h-[44px] px-4 font-sans text-sm font-bold flex items-center justify-center hover:bg-gray-50 transition rounded-none">
            Login
          </Link>
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
          <li><Link to="/about" className="hover:text-primary hover:underline">About Portal</Link></li>
          <li><Link to="/about" className="hover:text-primary hover:underline">History</Link></li>
          <li><Link to="/about" className="hover:text-primary hover:underline">Who We Are</Link></li>
          <li><Link to="/about" className="hover:text-primary hover:underline">RTI</Link></li>
          <li><Link to="/about" className="hover:text-primary hover:underline">Organization & Functions</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-primary mb-4">Services</h3>
        <ul className="flex flex-col gap-2 text-sm text-text-secondary">
          <li><Link to="/login" className="hover:text-primary hover:underline">Login</Link></li>
          <li><Link to="/register" className="hover:text-primary hover:underline">Register</Link></li>
          <li><Link to="/itr/verify" className="hover:text-primary hover:underline">e-Verify</Link></li>
          <li><Link to="/aadhaar/link" className="hover:text-primary hover:underline">Link Aadhaar</Link></li>
          <li><Link to="/refund-status" className="hover:text-primary hover:underline">Refund Status</Link></li>
          <li><Link to="/tax-payment" className="hover:text-primary hover:underline">e-Pay Tax</Link></li>
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
          <li><Link to="/about" className="hover:text-primary hover:underline">Website Policies</Link></li>
          <li><Link to="/about" className="hover:text-primary hover:underline">Accessibility</Link></li>
          <li><Link to="/about" className="hover:text-primary hover:underline">Browser Support</Link></li>
          <li><Link to="/about" className="hover:text-primary hover:underline">Sitemap</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-primary mb-4">Support</h3>
        <ul className="flex flex-col gap-2 text-sm text-text-secondary">
          <li><Link to="/help" className="hover:text-primary hover:underline">Helpdesk</Link></li>
          <li><Link to="/grievances/new" className="hover:text-primary hover:underline">Submit Grievance</Link></li>
        </ul>
      </div>
    </div>
  </footer>
);

export default function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isLogin = location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ScrollToTop />
      {!isDashboard && <Loader />}
      
      {!isDashboard && !isLogin && <Header />}
      
      {!isDashboard && !isLogin && (
        <div className="bg-yellow-100 border-b border-yellow-200 text-center py-2 px-4 text-sm font-medium text-yellow-800">
          Demo Application — Not the Official Income Tax Department Portal. Do not enter real taxpayer information.
        </div>
      )}

      <main id="main-content" className={`flex-1 w-full ${isDashboard ? 'flex flex-col' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/category/:type" element={<TaxpayerCategory />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/help" element={<Help />} />
          <Route path="/status" element={<Status />} />
          
          {/* Private Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Overview />} />
            <Route path="/itr" element={<FileITR />} />
            <Route path="/itr/:stepId" element={<FileITR />} />
            <Route path="/ais" element={<AIS />} />
            <Route path="/form-26as" element={<Form26AS />} />
            <Route path="/tax-payment" element={<EPayTax />} />
            <Route path="/demand" element={<Demands />} />
            <Route path="/grievances" element={<Grievance />} />
            <Route path="/grievances/new" element={<Grievance />} />
            <Route path="/documents" element={<DocumentCenter />} />
            
            {/* Stub Routes */}
            <Route path="/profile" element={<div className="p-8 max-w-4xl mx-auto"><h1 className="text-2xl font-bold">Profile</h1><p>Demo placeholder</p></div>} />
            <Route path="/pan/verify" element={<div className="p-8 max-w-4xl mx-auto"><h1 className="text-2xl font-bold">Verify PAN</h1><p>Demo placeholder</p></div>} />
            <Route path="/aadhaar/link" element={<div className="p-8 max-w-4xl mx-auto"><h1 className="text-2xl font-bold">Link Aadhaar</h1><p>Demo placeholder</p></div>} />
            <Route path="/refund-status" element={<Status />} />
            <Route path="/contact" element={<div className="p-8 max-w-4xl mx-auto"><h1 className="text-2xl font-bold">Contact</h1><p>Demo placeholder</p></div>} />
            <Route path="/know-tan" element={<div className="p-8 max-w-4xl mx-auto"><h1 className="text-2xl font-bold">Know TAN Details</h1><p>Demo placeholder</p></div>} />
            <Route path="/about" element={<div className="p-8 max-w-4xl mx-auto"><h1 className="text-2xl font-bold">About Portal</h1><p>Demo placeholder</p></div>} />
          </Route>
        </Routes>
      </main>

      {!isDashboard && !isLogin && <Footer />}
    </div>
  );
}

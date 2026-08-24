import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';

export default function Home() {
  const { state } = useStore();
  const navigate = useNavigate();
  
  const startITR = () => {
    navigate('/itr/file');
  };

  return (
    <div className="w-full">
      <section className="relative flex flex-col justify-center mx-auto min-h-[500px] bg-primary text-left px-4 py-16">
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-0">
          <p className="font-sans font-bold text-[0.85rem] uppercase tracking-widest mb-[0.35rem] text-secondary">
            Government of India
          </p>
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-serif font-bold text-white mb-6 leading-[1.1] max-w-[15ch]">
            ITR-Seva
          </h1>
          <p className="font-sans text-[1.2rem] leading-[1.5] mb-10 max-w-[40rem] text-primary-light">
            File your Income Tax Return, make tax payments, verify returns and access income-tax services online.
          </p>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            {state.auth.isLoggedIn ? (
              <Link to="/dashboard" className="bg-white text-primary px-8 py-3 min-h-[50px] font-bold text-center flex items-center justify-center hover:bg-gray-100 transition whitespace-nowrap rounded-sm">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="bg-white text-primary px-8 py-3 min-h-[50px] font-bold text-center flex items-center justify-center hover:bg-gray-100 transition whitespace-nowrap rounded-sm">
                  Login
                </Link>
                <Link to="/register" className="border-2 border-white text-white bg-transparent px-8 py-3 min-h-[50px] font-bold text-center flex items-center justify-center hover:bg-white hover:text-primary transition whitespace-nowrap rounded-sm">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 space-y-16">

      <section>
        <p className="text-sm font-bold uppercase text-text-secondary tracking-wider mb-2">Access Services</p>
        <h2 className="text-3xl font-serif font-bold mb-8 text-primary">Quick Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/itr/verify" className="border border-border p-6 rounded-sm bg-white shadow-sm hover:border-primary transition group flex flex-col">
            <h3 className="font-bold text-lg mb-2 text-primary group-hover:text-secondary transition-colors">e-Verify Return</h3>
            <p className="text-text-secondary mb-4 flex-1 text-sm">Verify your Income Tax Return online quickly and securely.</p>
          </Link>
          <Link to="/aadhaar/link" className="border border-border p-6 rounded-sm bg-white shadow-sm hover:border-primary transition group flex flex-col">
            <h3 className="font-bold text-lg mb-2 text-primary group-hover:text-secondary transition-colors">Link Aadhaar</h3>
            <p className="text-text-secondary mb-4 flex-1 text-sm">Link your Aadhaar with PAN to avoid invalidation of PAN.</p>
          </Link>
          <Link to="/refund-status" className="border border-border p-6 rounded-sm bg-white shadow-sm hover:border-primary transition group flex flex-col">
            <h3 className="font-bold text-lg mb-2 text-primary group-hover:text-secondary transition-colors">Check Refund Status</h3>
            <p className="text-text-secondary mb-4 flex-1 text-sm">Track the status of your income tax refund online.</p>
          </Link>
          <Link to="/tax-payment" className="border border-border p-6 rounded-sm bg-white shadow-sm hover:border-primary transition group flex flex-col">
            <h3 className="font-bold text-lg mb-2 text-primary group-hover:text-secondary transition-colors">e-Pay Tax</h3>
            <p className="text-text-secondary mb-4 flex-1 text-sm">Make tax payments quickly and securely online.</p>
          </Link>
          <Link to="/pan/verify" className="border border-border p-6 rounded-sm bg-white shadow-sm hover:border-primary transition group flex flex-col">
            <h3 className="font-bold text-lg mb-2 text-primary group-hover:text-secondary transition-colors">Verify PAN</h3>
            <p className="text-text-secondary mb-4 flex-1 text-sm">Verify your PAN details.</p>
          </Link>
          <Link to="/know-tan" className="border border-border p-6 rounded-sm bg-white shadow-sm hover:border-primary transition group flex flex-col">
            <h3 className="font-bold text-lg mb-2 text-primary group-hover:text-secondary transition-colors">Know TAN Details</h3>
            <p className="text-text-secondary mb-4 flex-1 text-sm">Search and verify TAN details.</p>
          </Link>
          <button onClick={startITR} className="border-2 border-primary p-6 rounded-sm bg-primary-light shadow-sm hover:bg-primary hover:text-white transition group flex flex-col text-left">
            <h3 className="font-bold text-lg mb-2 text-primary group-hover:text-white">File ITR (Demo)</h3>
            <p className="text-primary group-hover:text-white mb-4 flex-1 text-sm">Simulate filing an Income Tax Return.</p>
          </button>
        </div>
      </section>

      <section>
        <p className="text-sm font-bold uppercase text-text-secondary tracking-wider mb-2">Guidance By Type</p>
        <h2 className="text-3xl font-serif font-bold mb-8 text-primary">Taxpayer Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link to="/category/individual" className="bg-white border-t-4 border-primary p-6 shadow-sm hover:shadow-md transition">
            <h3 className="font-bold text-xl mb-4 text-primary">Individual / HUF</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>Salaried Employees</li>
              <li>Business / Profession</li>
              <li>Senior Citizens</li>
              <li>Non Resident</li>
            </ul>
          </Link>
          <Link to="/category/company" className="bg-white border-t-4 border-primary p-6 shadow-sm hover:shadow-md transition">
            <h3 className="font-bold text-xl mb-4 text-primary">Company</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>Domestic Company</li>
              <li>Foreign Company</li>
            </ul>
          </Link>
          <Link to="/category/non-company" className="bg-white border-t-4 border-primary p-6 shadow-sm hover:shadow-md transition">
            <h3 className="font-bold text-xl mb-4 text-primary">Non-Company</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>AOP / BOI / Trust / AJP</li>
              <li>Firm / LLP</li>
              <li>Local Authority</li>
            </ul>
          </Link>
          <Link to="/category/tax-professionals" className="bg-white border-t-4 border-primary p-6 shadow-sm hover:shadow-md transition">
            <h3 className="font-bold text-xl mb-4 text-primary">Tax Professionals</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>Chartered Accountants</li>
              <li>e-Return Intermediaries</li>
              <li>Tax Deductor & Collector</li>
            </ul>
          </Link>
        </div>
      </section>

      <section>
        <div className="bg-red-50 border-l-4 border-red-500 p-6">
          <h2 className="text-xl font-bold mb-2 text-red-900">Security Warning</h2>
          <p className="text-red-800">Never share your password, PIN, OTP, or CVV with anyone. The Income Tax Department never asks for your PIN or passwords via email or phone calls.</p>
        </div>
      </section>
    </div>
  </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store';

export default function Dashboard() {
  const { state } = useStore();
  
  // Basic empty state if no application started
  if (!state.type) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-white border border-border shadow-sm rounded p-8 text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Application Dashboard</h1>
          <p className="text-text-secondary mb-8">You haven't started an application yet.</p>
          <Link to="/guide/visa-finder" className="btn-primary">Find My Visa &rarr;</Link>
        </div>
      </div>
    );
  }

  // Active application state
  const totalSteps = 6; // from Wizard.jsx
  const currentStep = state.step;
  const progressPercent = state.submitted ? 100 : Math.round((currentStep / totalSteps) * 100);
  
  const hasPassport = state.docs.some(d => d.type === 'passport');
  const hasPhoto = state.docs.some(d => d.type === 'photograph');
  const missingDocs = (!hasPassport || !hasPhoto) && currentStep >= 4;

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-serif font-bold mb-8">My Application</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Status Card */}
        <div className="md:col-span-2 bg-white border border-border shadow-sm rounded overflow-hidden flex flex-col">
          <div className="bg-[#0b2540] text-white p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[#f0cc91] text-xs font-bold uppercase tracking-widest mb-1">Application Type</p>
                <h2 className="text-2xl font-bold">{state.type === 'evisa' ? 'e-Visa Application' : 'Regular Visa Application'}</h2>
              </div>
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {state.submitted ? 'Submitted' : 'Draft'}
              </span>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span className="font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-[#163a5f] h-2 rounded-full overflow-hidden">
                <div className="bg-[#f0cc91] h-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="font-bold text-lg mb-4">Checklist</h3>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                {currentStep > 0 ? <span className="text-green-600 font-bold">✓</span> : <span className="text-gray-400">○</span>}
                <span className={currentStep > 0 ? 'text-gray-900' : 'text-gray-500'}>Personal Details</span>
              </div>
              <div className="flex items-center gap-3">
                {currentStep > 1 ? <span className="text-green-600 font-bold">✓</span> : <span className="text-gray-400">○</span>}
                <span className={currentStep > 1 ? 'text-gray-900' : 'text-gray-500'}>Passport Details</span>
              </div>
              <div className="flex items-center gap-3">
                {currentStep > 2 ? <span className="text-green-600 font-bold">✓</span> : <span className="text-gray-400">○</span>}
                <span className={currentStep > 2 ? 'text-gray-900' : 'text-gray-500'}>Travel Details</span>
              </div>
              <div className="flex items-center gap-3">
                {currentStep > 3 && !missingDocs ? <span className="text-green-600 font-bold">✓</span> : missingDocs ? <span className="text-amber-600 font-bold">⚠</span> : <span className="text-gray-400">○</span>}
                <span className={currentStep > 3 && !missingDocs ? 'text-gray-900' : missingDocs ? 'text-amber-700 font-bold' : 'text-gray-500'}>
                  Supporting Documents {missingDocs && '(Missing)'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {state.submitted ? <span className="text-green-600 font-bold">✓</span> : <span className="text-gray-400">○</span>}
                <span className={state.submitted ? 'text-gray-900' : 'text-gray-500'}>Review & Submit</span>
              </div>
            </div>
            
            <div className="mt-auto pt-6 border-t border-border">
              {!state.submitted ? (
                <div>
                  <p className="text-sm text-text-secondary mb-3">Your application is saved automatically.</p>
                  <Link to="/apply" className="btn-primary inline-flex items-center gap-2">
                    {missingDocs ? 'Upload Missing Documents' : 'Continue Application'} &rarr;
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-green-700 font-bold mb-3">Application submitted successfully.</p>
                  <Link to="/status" className="btn-secondary inline-block">Track Status &rarr;</Link>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Sidebar Cards */}
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 p-5 rounded shadow-sm">
            <h3 className="font-bold text-blue-900 mb-2">Need help?</h3>
            <p className="text-sm text-blue-800 mb-4">Find answers to common questions about documents, eligibility, and fees.</p>
            <Link to="/help" className="text-sm font-bold text-[#0b2540] hover:underline">Read FAQ &rarr;</Link>
          </div>
          
          <div className="bg-white border border-border p-5 rounded shadow-sm">
            <h3 className="font-bold text-gray-900 mb-2">Travel Guidance</h3>
            <p className="text-sm text-gray-600 mb-4">Learn about what you need to prepare before arriving at Indian immigration.</p>
            <Link to="/status" className="text-sm font-bold text-[#0b2540] hover:underline">View Requirements &rarr;</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

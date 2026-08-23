import React from 'react';

export default function Downloads() {
  return (
    <div className="max-w-[1200px] mx-auto py-12 px-6">
      <h1 className="text-4xl font-serif font-bold mb-2 text-primary">Downloads</h1>
      <p className="text-text-secondary mb-8">Download offline utilities, forms, and tools for e-Filing.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="border border-border rounded-sm shadow-sm flex flex-col bg-white">
          <div className="p-6 flex-1">
            <h2 className="text-2xl font-bold mb-2 text-primary">Income Tax Returns</h2>
            <p className="text-text-secondary text-sm mb-4">Download offline utilities to prepare your Income Tax Returns (ITR-1 to ITR-7) for various Assessment Years.</p>
          </div>
          <div className="bg-gray-50 p-4 border-t border-border">
            <a href="https://www.incometax.gov.in/iec/foportal/downloads/income-tax-returns" className="text-primary font-bold hover:underline">Go to ITR Downloads &rarr;</a>
          </div>
        </div>

        <div className="border border-border rounded-sm shadow-sm flex flex-col bg-white">
          <div className="p-6 flex-1">
            <h2 className="text-2xl font-bold mb-2 text-primary">Income Tax Forms</h2>
            <p className="text-text-secondary text-sm mb-4">Download statutory forms (like Form 15G, Form 15H, Form 10E) and their offline utilities.</p>
          </div>
          <div className="bg-gray-50 p-4 border-t border-border">
            <a href="https://www.incometax.gov.in/iec/foportal/downloads/income-tax-forms" className="text-primary font-bold hover:underline">Go to Forms Downloads &rarr;</a>
          </div>
        </div>

        <div className="border border-border rounded-sm shadow-sm flex flex-col bg-white">
          <div className="p-6 flex-1">
            <h2 className="text-2xl font-bold mb-2 text-primary">DSC Management Utility</h2>
            <p className="text-text-secondary text-sm mb-4">Download the emSigner utility required for registering and using Digital Signature Certificates (DSC) on the portal.</p>
          </div>
          <div className="bg-gray-50 p-4 border-t border-border">
            <a href="https://www.incometax.gov.in/iec/foportal/downloads/dsc-management-utility" className="text-primary font-bold hover:underline">Download Utility &rarr;</a>
          </div>
        </div>

      </div>
    </div>
  );
}

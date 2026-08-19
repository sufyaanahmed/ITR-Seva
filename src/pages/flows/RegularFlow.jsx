import React from 'react';
import { Link } from 'react-router-dom';

export default function RegularFlow() {
  return (
    <div className="w-full bg-white">
      <div className="max-w-5xl mx-auto py-[4.75rem] px-6">
        
        {/* Header Section */}
        <section className="mb-16">
          <p className="uppercase tracking-widest text-[0.8rem] text-primary font-bold mb-3">
            Visa Guide
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Regular / Paper Visa Application Process
          </h1>
          <p className="text-[1.15rem] text-text-secondary max-w-3xl leading-relaxed">
            Apply online, submit your documents in person, and receive your passport and visa after processing.
          </p>
        </section>

        {/* 3-Step Timeline */}
        <section className="mb-20">
          <div className="relative flex flex-col md:flex-row gap-8 md:gap-4">
            
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-[2px] bg-gray-200 z-0"></div>

            {/* Step 1 */}
            <div className="relative flex-1 flex flex-col md:items-center text-left md:text-center z-10 group">
              <div className="flex md:flex-col items-center md:items-center gap-4 md:gap-0">
                <div className="w-16 h-16 rounded-full bg-[#0b2540] text-white flex items-center justify-center text-2xl font-bold border-4 border-white shadow-sm mb-0 md:mb-6 shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Apply Online</h3>
                  <p className="text-sm text-text-secondary mb-3 md:min-h-[60px]">
                    Complete and submit the Regular / Paper Visa application form online.
                  </p>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded text-sm text-[#081e33] border-l-4 border-primary text-left mb-6 w-full">
                <strong>Important:</strong> After submitting the form, print the completed application form and sign it.
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <a href="https://indianvisaonline.gov.in/visa/index.html" target="_blank" rel="noopener noreferrer" className="bg-[#0b2540] text-white px-6 py-3 font-bold rounded hover:bg-[#163a5f] transition text-center text-sm shadow-sm">
                  Start Visa Application
                </a>
                <a href="https://indianvisaonline.gov.in/visa/index.html" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline text-center text-sm">
                  Continue Partially Filled Application
                </a>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex-1 flex flex-col md:items-center text-left md:text-center z-10 group mt-8 md:mt-0">
              <div className="flex md:flex-col items-center md:items-center gap-4 md:gap-0">
                <div className="w-16 h-16 rounded-full bg-white text-gray-400 flex items-center justify-center text-2xl font-bold border-4 border-gray-200 shadow-sm mb-0 md:mb-6 shrink-0 group-hover:bg-[#0b2540] group-hover:text-white group-hover:border-white transition-colors duration-300">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Submit Documents</h3>
                  <p className="text-sm text-text-secondary mb-3 md:min-h-[60px]">
                    Bring your printed and signed application form, passport, and required supporting documents to the designated Indian Visa Application Center (IVAC) or Indian Mission.
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-600 italic text-left md:text-center mb-6 w-full">
                An appointment may be required depending on the Indian Mission or application center.
              </div>
              <div className="mt-auto w-full md:w-auto">
                <a href="https://indianvisaonline.gov.in/visa/instruction.html" target="_blank" rel="noopener noreferrer" className="border-2 border-[#0b2540] text-[#0b2540] px-6 py-3 font-bold rounded hover:bg-gray-50 transition block text-center text-sm">
                  View Application Instructions
                </a>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex-1 flex flex-col md:items-center text-left md:text-center z-10 group mt-8 md:mt-0">
              <div className="flex md:flex-col items-center md:items-center gap-4 md:gap-0">
                <div className="w-16 h-16 rounded-full bg-white text-gray-400 flex items-center justify-center text-2xl font-bold border-4 border-gray-200 shadow-sm mb-0 md:mb-6 shrink-0 group-hover:bg-[#0b2540] group-hover:text-white group-hover:border-white transition-colors duration-300">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Receive Your Passport & Visa</h3>
                  <p className="text-sm text-text-secondary mb-6 md:min-h-[60px]">
                    After your application has been processed, collect your passport and visa from the Indian Mission or Visa Application Center, or receive it by post where available.
                  </p>
                </div>
              </div>
              <div className="mt-auto w-full md:w-auto">
                <a href="https://indianvisaonline.gov.in/visa/VisaEnquiry.jsp" target="_blank" rel="noopener noreferrer" className="border-2 border-gray-300 text-gray-700 px-6 py-3 font-bold rounded hover:bg-gray-50 transition block text-center text-sm">
                  Check Visa Status
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* Manage Your Application */}
        <section className="bg-gray-50 border border-border p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Your Application</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <a href="https://indianvisaonline.gov.in/visa/index.html" target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-200 p-4 rounded shadow-sm hover:border-primary hover:shadow-md transition text-center flex flex-col justify-center min-h-[100px]">
              <span className="font-bold text-[#0b2540] text-sm">Continue Partially Filled Application</span>
            </a>
            <a href="https://indianvisaonline.gov.in/visa/VisaEnquiry.jsp" target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-200 p-4 rounded shadow-sm hover:border-primary hover:shadow-md transition text-center flex flex-col justify-center min-h-[100px]">
              <span className="font-bold text-[#0b2540] text-sm">Check Visa Status</span>
            </a>
            <a href="https://indianvisaonline.gov.in/visa/PrintApplication" target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-200 p-4 rounded shadow-sm hover:border-primary hover:shadow-md transition text-center flex flex-col justify-center min-h-[100px]">
              <span className="font-bold text-[#0b2540] text-sm">Print Registered Application Form</span>
            </a>
            <a href="https://indianvisaonline.gov.in/visa/UploadDocument" target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-200 p-4 rounded shadow-sm hover:border-primary hover:shadow-md transition text-center flex flex-col justify-center min-h-[100px]">
              <span className="font-bold text-[#0b2540] text-sm">Re-upload Document</span>
            </a>
          </div>
        </section>

        {/* Important Note */}
        <div className="bg-yellow-50 border-l-4 border-secondary p-6 text-yellow-900 text-[0.95rem] leading-relaxed">
          <strong>Important Note:</strong> Requirements, appointment procedures, processing times, fees, and document requirements may vary by visa category and Indian Mission. Check the official instructions and the website of the relevant Indian Mission before submitting your application.
        </div>
        
      </div>
    </div>
  );
}

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';

export default function Home() {
  const { updateState } = useStore();
  const navigate = useNavigate();
  
  const startApp = (type) => {
    updateState({ type, step: 0, data: { application_type: type, visa_category: 'tourist' }, docs: [], submitted: false });
    navigate('/apply');
  };

  return (
    <div className="w-full">
      <section className="relative overflow-hidden flex flex-col justify-center max-w-[990px] mx-auto mt-8 mb-8 rounded-lg min-h-[700px] bg-[#0b2540] text-left">
        {/* Full-bleed background image */}
        <img src="/side1.png" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full min-h-[700px] object-cover object-center" />
        
        {/* Gradient overlays matching exact specifications */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b2540]/95 via-[#0b2540]/60 to-[#0b2540]/60 md:from-[#0b2540]/97 md:via-[#0b2540]/86 md:to-transparent"></div>
        
        {/* Content Container */}
        <div className="relative z-10 w-full max-w-[640px] px-6 py-8 md:px-[4.5rem] md:py-[4.5rem] mx-0">
          <p className="font-sans font-bold text-[0.74rem] uppercase tracking-[0.13em] mb-[0.35rem]" style={{ color: '#f0cc91' }}>
            Atithi Devo Bhava <span lang="hi" className="block normal-case tracking-normal text-[1.05rem] mt-1">अतिथि देवो भवः</span>
          </p>
          <h1 className="text-[clamp(2.8rem,5vw,5rem)] font-serif font-bold text-white mb-6 leading-[1.1] max-w-[11ch]">
            India Welcomes You.
          </h1>
          <p className="font-serif text-[1.22rem] leading-[1.45] mb-10 max-w-[30rem]" style={{ color: '#f1ede5' }}>
            Bharat Visa Portal helps visitors understand and complete the visa application process.
          </p>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-[0.75rem]">
            <a href="#visa-services" className="bg-white text-[#0b2540] px-6 py-3 min-h-[50px] font-bold text-center flex items-center justify-center hover:bg-gray-100 transition whitespace-nowrap">
              Apply for a Visa
            </a>
            <Link to="/status" className="border border-white text-white bg-transparent px-6 py-3 min-h-[50px] font-bold text-center flex items-center justify-center hover:bg-white hover:text-[#0b2540] transition whitespace-nowrap">
              Check Application Status
            </Link>
            <Link to="/resume" className="text-white text-[0.93rem] font-extrabold hover:underline text-center md:text-left mt-3 md:mt-0 whitespace-nowrap flex items-center justify-center md:justify-start min-h-[50px]">
              Continue My Application &rarr;
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-16">

      <section>
        <p className="text-sm font-bold uppercase text-text-secondary tracking-wider mb-2">Start here</p>
        <h2 className="text-3xl font-serif font-bold mb-8">How can we help?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border border-border p-6 rounded bg-white shadow-sm flex flex-col">
            <h3 className="font-bold text-lg mb-2">Apply for a Visa</h3>
            <p className="text-text-secondary mb-4 flex-1">Choose the visa type you need.</p>
            <a href="#visa-services" className="text-primary font-bold hover:underline">View visa options &rarr;</a>
          </div>
          <div className="border border-border p-6 rounded bg-white shadow-sm flex flex-col">
            <h3 className="font-bold text-lg mb-2">Continue My Application</h3>
            <p className="text-text-secondary mb-4 flex-1">Continue an application you previously saved.</p>
            <Link to="/resume" className="text-primary font-bold hover:underline">Continue application &rarr;</Link>
          </div>
          <div className="border border-border p-6 rounded bg-white shadow-sm flex flex-col">
            <h3 className="font-bold text-lg mb-2">Check Application Status</h3>
            <p className="text-text-secondary mb-4 flex-1">Check the progress of an existing application.</p>
            <Link to="/status" className="text-primary font-bold hover:underline">Check status &rarr;</Link>
          </div>
          <div className="border border-border p-6 rounded bg-white shadow-sm flex flex-col">
            <h3 className="font-bold text-lg mb-2">Get Help</h3>
            <p className="text-text-secondary mb-4 flex-1">Find guidance about visas, documents, applications, and common questions.</p>
            <Link to="/help" className="text-primary font-bold hover:underline">Get help &rarr;</Link>
          </div>
        </div>
      </section>

      <section id="visa-services" className="pt-8 scroll-mt-24">
        <p className="text-sm font-bold uppercase text-text-secondary tracking-wider mb-2">Visa information</p>
        <h2 className="text-3xl font-serif font-bold mb-8">Visa Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/flow/regular" className="border border-border p-6 rounded bg-white shadow-sm hover:border-primary transition group flex flex-col min-h-[200px]">
            <h3 className="font-bold text-xl mb-2 flex justify-between items-center group-hover:text-primary transition-colors">
              Regular / Paper Visa <span className="opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
            </h3>
            <p className="text-text-secondary">For applicants who need a regular or paper visa through an Indian Mission or Post.</p>
          </Link>
          <Link to="/flow/normal" className="border border-border p-6 rounded bg-white shadow-sm hover:border-primary transition group flex flex-col min-h-[200px]">
            <h3 className="font-bold text-xl mb-2 flex justify-between items-center group-hover:text-primary transition-colors">
              e-Visa <span className="opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
            </h3>
            <p className="text-text-secondary">For eligible travelers applying for an electronic visa by the Bureau of Immigration.</p>
          </Link>
          <Link to="/flow/voa" className="border border-border p-6 rounded bg-white shadow-sm hover:border-primary transition group flex flex-col min-h-[200px]">
            <div className="flex gap-2 mb-4">
              <img src="https://flagcdn.com/jp.svg" alt="Japan Flag" className="h-6 rounded-sm border border-gray-200" />
              <img src="https://flagcdn.com/kr.svg" alt="South Korea Flag" className="h-6 rounded-sm border border-gray-200" />
              <img src="https://flagcdn.com/ae.svg" alt="UAE Flag" className="h-6 rounded-sm border border-gray-200" />
            </div>
            <h3 className="font-bold text-xl mb-2 flex justify-between items-center group-hover:text-primary transition-colors">
              Visa on Arrival <span className="opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
            </h3>
            <p className="text-text-secondary">For nationals of Japan, South Korea, and UAE (only UAE nationals with prior e-Visa/regular visa). Available at selected airports.</p>
          </Link>
          <Link to="/flow/afghan" className="border border-border p-6 rounded bg-white shadow-sm hover:border-primary transition group flex flex-col min-h-[200px]">
            <div className="flex gap-2 mb-4">
              <img src="https://flagcdn.com/af.svg" alt="Afghanistan Flag" className="h-6 rounded-sm border border-gray-200" />
            </div>
            <h3 className="font-bold text-xl mb-2 flex justify-between items-center group-hover:text-primary transition-colors">
              Visa for Afghan National <span className="opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
            </h3>
            <p className="text-text-secondary">Visa applications specifically for Afghanistan Nationals.</p>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-serif font-bold mb-8">Before you apply</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="border border-border p-6 rounded bg-white">
            <h3 className="font-bold mb-2">Passport</h3>
            <p className="text-sm text-text-secondary">You need a valid passport or other accepted international travel document for travel to India.</p>
          </div>
          <div className="border border-border p-6 rounded bg-white">
            <h3 className="font-bold mb-2">Visa</h3>
            <p className="text-sm text-text-secondary">Most foreign visitors need a valid Indian visa before travel.</p>
          </div>
          <div className="border border-border p-6 rounded bg-white">
            <h3 className="font-bold mb-2">e-Visa</h3>
            <p className="text-sm text-text-secondary">e-Visa is available only for eligible travelers and visa categories.</p>
          </div>
          <div className="border border-border p-6 rounded bg-white">
            <h3 className="font-bold mb-2">Arrival information</h3>
            <p className="text-sm text-text-secondary">An arrival form is different from a visa application. It does not replace a visa.</p>
          </div>
        </div>
      </section>

      <section>
        <div className="bg-yellow-50 border-l-4 border-secondary p-6">
          <h2 className="text-xl font-bold mb-2 text-yellow-900">Use care when applying online</h2>
          <p className="text-yellow-800">Be careful with unauthorized visa agents and unofficial websites. Bharat Visa Portal is the only official channel to process your Indian Visa application. Only provide your details on the official domains.</p>
        </div>
      </section>
    </div>
  </div>
  );
}

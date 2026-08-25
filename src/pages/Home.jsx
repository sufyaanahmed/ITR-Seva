import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="w-full bg-surface relative overflow-hidden">
      
      {/* Background Kalamkari texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] pattern-kalamkari z-0"></div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-6 border-b border-border-dark pattern-jali">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none"></div>
        <div className="max-w-4xl z-20 relative pt-12">
          <p className="uppercase tracking-[0.3em] text-secondary-accent font-sans font-bold text-[0.85rem] mb-6">
            Government of India
          </p>
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-primary mb-6 leading-tight">
            India is a Journey.
          </h1>
          <p className="text-xl md:text-3xl font-serif text-text-secondary italic mb-12 max-w-3xl mx-auto leading-relaxed">
            Your visa is the beginning.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-8">
            <Link to="/guide/visa-finder" className="btn-mughal group">
              <span className="inner-border"></span>
              <span className="relative z-10 flex items-center gap-2">Start Application <span className="text-secondary-accent transform group-hover:translate-x-1 transition-transform">&rarr;</span></span>
            </Link>
            <Link to="/status" className="bg-transparent border border-primary text-primary px-10 py-5 font-sans font-medium uppercase tracking-widest text-sm hover:bg-primary hover:text-white transition-all duration-300 relative">
              Check Status
            </Link>
          </div>
        </div>
      </section>

      {/* The Journey Section */}
      <section className="relative max-w-6xl mx-auto py-24 px-6 z-10">
        
        {/* Central Journey Line */}
        <div className="absolute left-[20px] sm:left-1/2 top-0 bottom-0 w-[2px] bg-border-dark sm:-translate-x-1/2 z-0"></div>

        {/* Stop 1: The Himalayas (North) */}
        <div className="relative flex flex-col md:flex-row items-center justify-between mb-32 gap-12 group">
          <div className="md:w-1/2 md:text-right md:pr-16 relative">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">The Himalayas</h2>
            <p className="text-text-secondary font-sans leading-relaxed mb-6">Discover the roof of the world, where ancient monasteries cling to snow-draped peaks and the air holds the chill of eternal history.</p>
            <div className="inline-block border-mughal p-4 bg-white shadow-sm">
              <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-secondary-accent mb-2">Popular Visa</h3>
              <p className="font-serif text-lg text-primary">e-Tourist Visa (30 Days)</p>
            </div>
          </div>
          
          {/* Journey Node */}
          <div className="absolute left-[20px] md:left-1/2 transform md:-translate-x-1/2 w-6 h-6 rounded-full bg-secondary-accent border-4 border-surface z-10 shadow-md"></div>
          
          <div className="md:w-1/2 md:pl-16 relative">
            <div className="relative w-full max-w-sm aspect-[4/5] mx-auto md:mx-0 overflow-hidden border-mughal p-2 bg-white">
              <img src="/Places/Kashmir.jpg" alt="Kashmir" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700" />
            </div>
          </div>
        </div>

        {/* Stop 2: The Heartlands (Central) */}
        <div className="relative flex flex-col md:flex-row-reverse items-center justify-between mb-32 gap-12 group">
          <div className="md:w-1/2 md:text-left md:pl-16 relative">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">The Heartlands</h2>
            <p className="text-text-secondary font-sans leading-relaxed mb-6">Journey through the architectural marvels of empires past, where marble monuments stand as testaments to undying love and power.</p>
            <div className="inline-block border-mughal p-4 bg-white shadow-sm">
              <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-accent-peacock mb-2">Business Gateway</h3>
              <p className="font-serif text-lg text-primary">e-Business Visa</p>
            </div>
          </div>
          
          <div className="absolute left-[20px] md:left-1/2 transform md:-translate-x-1/2 w-6 h-6 rounded-full bg-accent-peacock border-4 border-surface z-10 shadow-md"></div>
          
          <div className="md:w-1/2 md:pr-16 relative flex justify-end">
            <div className="relative w-full max-w-sm aspect-[4/5] mx-auto md:mx-0 overflow-hidden border-mughal p-2 bg-white">
              <img src="/Places/Taj_Mahal.jpg" alt="Taj Mahal" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700" />
            </div>
          </div>
        </div>

        {/* Stop 3: The Coast (South) */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 group">
          <div className="md:w-1/2 md:text-right md:pr-16 relative">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">The Coast</h2>
            <p className="text-text-secondary font-sans leading-relaxed mb-6">Drift through emerald backwaters under ancient palms, where time slows down to the rhythmic sway of the ocean tide.</p>
            <div className="inline-block border-mughal p-4 bg-white shadow-sm">
              <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-accent-green mb-2">Wellness Retreat</h3>
              <p className="font-serif text-lg text-primary">e-Medical Visa</p>
            </div>
          </div>
          
          <div className="absolute left-[20px] md:left-1/2 transform md:-translate-x-1/2 w-6 h-6 rounded-full bg-accent-green border-4 border-surface z-10 shadow-md"></div>
          
          <div className="md:w-1/2 md:pl-16 relative">
            <div className="relative w-full max-w-sm aspect-[4/5] mx-auto md:mx-0 overflow-hidden border-mughal p-2 bg-white">
              <img src="/Places/Kerala.jpg" alt="Kerala Backwaters" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700" />
            </div>
          </div>
        </div>

      </section>

      {/* Services Section */}
      <section className="bg-white border-t border-border-dark py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-primary mb-4">Essential Services</h2>
            <div className="w-16 h-1 bg-secondary-accent mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-heritage text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center mb-6 bg-surface">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-primary mb-3">Visa Finder</h3>
              <p className="text-text-secondary font-sans text-sm mb-6 flex-1">Answer a few questions to determine the exact visa category required for your journey.</p>
              <Link to="/guide/visa-finder" className="text-secondary-accent font-sans font-bold uppercase tracking-wider text-sm hover:text-primary transition-colors">Start Guide &rarr;</Link>
            </div>
            
            <div className="card-heritage text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center mb-6 bg-surface">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-primary mb-3">e-Visa Application</h3>
              <p className="text-text-secondary font-sans text-sm mb-6 flex-1">Apply online, upload your documents, and receive your Electronic Travel Authorization.</p>
              <Link to="/apply" className="text-secondary-accent font-sans font-bold uppercase tracking-wider text-sm hover:text-primary transition-colors">Apply Now &rarr;</Link>
            </div>
            
            <div className="card-heritage text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center mb-6 bg-surface">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-primary mb-3">Check Status</h3>
              <p className="text-text-secondary font-sans text-sm mb-6 flex-1">Track your application, download your visa, or complete your arrival information.</p>
              <Link to="/status" className="text-secondary-accent font-sans font-bold uppercase tracking-wider text-sm hover:text-primary transition-colors">Track Status &rarr;</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

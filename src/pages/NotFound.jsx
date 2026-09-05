import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[85vh] px-6 py-24 text-center bg-[#FAF7F0] overflow-hidden">
      
      {/* Jali Pattern Overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none">
        <pattern id="jali-404" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="#8B1C1C" strokeWidth="0.5"/>
          <circle cx="20" cy="20" r="14" fill="none" stroke="#8B1C1C" strokeWidth="0.5"/>
          <circle cx="20" cy="20" r="4" fill="#C4762A" opacity="0.5"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#jali-404)" />
      </svg>

      {/* Ornate Corner Accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-[#D4AF37] opacity-60 rounded-tl-xl pointer-events-none" />
      <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-[#D4AF37] opacity-60 rounded-tr-xl pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-[#D4AF37] opacity-60 rounded-bl-xl pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-[#D4AF37] opacity-60 rounded-br-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center">
        
        {/* Artistic Lotus / Mandala Motif */}
        <svg viewBox="0 0 100 100" className="w-32 h-32 mb-6 text-[#C4762A] opacity-90 drop-shadow-md animate-[spin_40s_linear_infinite]" fill="none" stroke="currentColor">
           <path d="M50 10 C 65 30, 85 45, 90 50 C 85 55, 65 70, 50 90 C 35 70, 15 55, 10 50 C 15 45, 35 30, 50 10 Z" strokeWidth="1" />
           <path d="M50 25 C 60 40, 75 48, 75 50 C 75 52, 60 60, 50 75 C 40 60, 25 52, 25 50 C 25 48, 40 40, 50 25 Z" strokeWidth="1" strokeOpacity="0.5" />
           <circle cx="50" cy="50" r="8" fill="currentColor" fillOpacity="0.2" />
           <circle cx="50" cy="50" r="3" fill="currentColor" />
           {[...Array(8)].map((_, i) => (
             <circle key={i} cx={50 + 40 * Math.cos(i * Math.PI / 4)} cy={50 + 40 * Math.sin(i * Math.PI / 4)} r="2" fill="currentColor" />
           ))}
        </svg>

        <span className="text-xs font-sans font-bold uppercase tracking-[0.4em] text-[#8B1C1C] mb-4">
          Path Not Found • Error 404
        </span>
        
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1E2A4F] mb-6 leading-tight">
          Like a mirage in <br className="hidden md:block"/> the Thar Desert.
        </h1>
        
        <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-8" />
        
        <p className="text-base font-sans text-[#4A5568] max-w-md mx-auto mb-10 leading-relaxed font-medium">
          The page you are seeking has vanished like a retreating monsoon. Let us guide you back to familiar shores.
        </p>
        
        <Link
          to="/"
          className="group relative px-10 py-4 bg-[#8B1C1C] text-[#D4AF37] font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#8B1C1C] transition-all duration-500 shadow-xl hover:shadow-2xl rounded-sm overflow-hidden border border-[#D4AF37]/30"
        >
          <span className="relative z-10">Return to Home</span>
          <div className="absolute inset-0 bg-[#D4AF37] transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out" />
        </Link>
      </div>
    </section>
  );
}

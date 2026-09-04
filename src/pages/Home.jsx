import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────────────────────────
   INLINE SVG ILLUSTRATION COMPONENTS
   All vectors are hand-crafted inspired by Indian art, wildlife & architecture.
───────────────────────────────────────────────────────────────────────────── */

/** Mughal Jali (lattice) tiling pattern */
function JaliPattern({ id = 'jali-hero', color = '#1E2A4F', opacity = 0.06 }) {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <pattern id={id} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="28" fill="none" stroke={color} strokeWidth="0.6" opacity={opacity} />
          <circle cx="30" cy="30" r="18" fill="none" stroke={color} strokeWidth="0.4" opacity={opacity} />
          <circle cx="30" cy="30" r="8"  fill="none" stroke={color} strokeWidth="0.8" opacity={opacity} />
          <path d="M30 2 Q40 15 30 30 Q20 15 30 2Z" fill={color} fillOpacity={opacity * 0.6} />
          <path d="M30 58 Q40 45 30 30 Q20 45 30 58Z" fill={color} fillOpacity={opacity * 0.6} />
          <path d="M2 30 Q15 40 30 30 Q15 20 2 30Z" fill={color} fillOpacity={opacity * 0.6} />
          <path d="M58 30 Q45 40 30 30 Q45 20 58 30Z" fill={color} fillOpacity={opacity * 0.6} />
        </pattern>
      </defs>
    </svg>
  );
}

/** Authentic Spirograph / Guilloche Star for Visa */
function GuillocheStar({ className }) {
  const numPaths = 20;
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor">
      {[...Array(numPaths)].map((_, i) => {
        // Radius grows from center outwards
        const baseR = 4 + (i * 42 / numPaths);
        let points = [];
        for (let a = 0; a <= 360; a += 1) {
          const angle = (a * Math.PI) / 180;
          // Base 5-point star shape
          const starShape = 1 + 0.15 * Math.cos(5 * angle);
          // High-frequency wobble
          const wobble = 1.2 * Math.sin(100 * angle);

          const r = (baseR * starShape) + wobble;
          const x = 50 + r * Math.sin(angle);
          const y = 50 - r * Math.cos(angle);
          points.push(`${x},${y}`);
        }
        return <path key={i} d={`M ${points.join(' L ')} Z`} strokeWidth={0.3} opacity={0.6} style={{ mixBlendMode: 'multiply' }} />;
      })}
    </svg>
  );
}

/** Royal Bengal Tiger Image */
function TigerIllustration({ className = '' }) {
  return (
    <div className={`overflow-hidden rounded-xl shadow-md ${className}`}>
      <img src="/tiger.jpg" alt="Royal Bengal Tiger" className="w-full h-auto" />
    </div>
  );
}

/** Peacock Image */
function PeacockIllustration({ className = '' }) {
  return (
    <div className={`overflow-hidden rounded-xl shadow-md ${className}`}>
      <img src="/peacock.jpg" alt="Peacock" className="w-full h-auto" />
    </div>
  );
}

/** Elephant Image */
function ElephantIllustration({ className = '' }) {
  return (
    <div className={`overflow-hidden rounded-xl shadow-md ${className}`}>
      <img src="/elephant.jpg" alt="Elephant" className="w-full h-auto" />
    </div>
  );
}





/** Mughal/Temple Arch - decorative frame */
function MughalArch({ className = '', color = '#1E2A4F', gold = '#D4AF37' }) {
  return (
    <svg viewBox="0 0 200 260" className={className} fill="none">
      {/* Columns */}
      <rect x="10" y="80" width="22" height="180" fill={color} fillOpacity="0.08" stroke={color} strokeWidth="1" strokeOpacity="0.2" />
      <rect x="168" y="80" width="22" height="180" fill={color} fillOpacity="0.08" stroke={color} strokeWidth="1" strokeOpacity="0.2" />
      {/* Column caps */}
      <path d="M8 80 Q21 65 34 80" stroke={gold} strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M166 80 Q179 65 192 80" stroke={gold} strokeWidth="2" fill="none" opacity="0.5" />
      {/* Main arch - Mughal cusped shape */}
      <path d="M10 80 Q10 20 100 5 Q190 20 190 80 Q190 100 175 115 Q165 125 160 115 Q155 105 160 90 Q160 35 100 22 Q40 35 40 90 Q45 105 40 115 Q35 125 25 115 Q10 100 10 80Z"
        stroke={color} strokeWidth="1.5" strokeOpacity="0.25" fill={color} fillOpacity="0.04" />
      {/* Inner arch detail */}
      <path d="M30 82 Q30 38 100 24 Q170 38 170 82 Q170 96 162 106 Q158 112 155 106 Q152 100 157 88 Q157 44 100 32 Q43 44 43 88 Q48 100 45 106 Q42 112 38 106 Q30 96 30 82Z"
        stroke={gold} strokeWidth="1" strokeOpacity="0.3" fill="none" />
      {/* Keystone ornament */}
      <circle cx="100" cy="8" r="8" fill={gold} fillOpacity="0.25" stroke={gold} strokeWidth="1" strokeOpacity="0.5" />
      <circle cx="100" cy="8" r="4" fill={gold} fillOpacity="0.4" />
      {/* Spandrel floral */}
      <circle cx="30" cy="50" r="12" fill={gold} fillOpacity="0.07" stroke={gold} strokeWidth="0.8" strokeOpacity="0.3" />
      <circle cx="170" cy="50" r="12" fill={gold} fillOpacity="0.07" stroke={gold} strokeWidth="0.8" strokeOpacity="0.3" />
      {/* Base platform */}
      <rect x="5" y="258" width="190" height="6" rx="1" fill={color} fillOpacity="0.12" />
      <rect x="0" y="252" width="200" height="8" rx="1" fill={color} fillOpacity="0.08" stroke={color} strokeWidth="0.5" strokeOpacity="0.2" />
    </svg>
  );
}

function TempleGopuram({ className = '' }) {
  return (
    <svg viewBox="0 0 120 220" className={className} fill="none">
      {/* Main tower body tiers */}
      <rect x="35" y="180" width="50" height="40" fill="#8B1C1C" opacity="0.2" stroke="#8B1C1C" strokeWidth="1" />
      <rect x="38" y="158" width="44" height="26" fill="#8B1C1C" opacity="0.2" stroke="#8B1C1C" strokeWidth="0.8" />
      <rect x="42" y="138" width="36" height="24" fill="#8B1C1C" opacity="0.2" stroke="#8B1C1C" strokeWidth="0.8" />
      <rect x="46" y="120" width="28" height="22" fill="#8B1C1C" opacity="0.2" stroke="#8B1C1C" strokeWidth="0.8" />
      <rect x="50" y="104" width="20" height="20" fill="#8B1C1C" opacity="0.2" stroke="#8B1C1C" strokeWidth="0.8" />
      <rect x="53" y="90" width="14" height="18" fill="#8B1C1C" opacity="0.2" stroke="#8B1C1C" strokeWidth="0.8" />
      {/* Top finial */}
      <path d="M57 90 L60 70 L63 90Z" fill="#D4AF37" opacity="0.4" />
      <circle cx="60" cy="68" r="5" fill="#D4AF37" opacity="0.4" />
      <circle cx="60" cy="60" r="3" fill="#D4AF37" opacity="0.5" />
      {/* Arch at base */}
      <path d="M42 180 Q60 165 78 180" stroke="#8B1C1C" strokeWidth="1" fill="none" opacity="0.4" />
      {/* Small decorative bumps on each tier edge */}
      {[180, 158, 138, 120, 104].map((y, i) => (
        <g key={i}>
          <circle cx={38 - i * 4} cy={y} r="3" fill="#D4AF37" opacity="0.3" />
          <circle cx={82 + i * 4} cy={y} r="3" fill="#D4AF37" opacity="0.3" />
        </g>
      ))}
    </svg>
  );
}


/* ─────────────────────────────────────────────────────────────────────────────
   MAIN HOME COMPONENT
───────────────────────────────────────────────────────────────────────────── */

export default function Home() {

  return (
    <div className="w-full bg-[#FAF7F0] overflow-x-hidden">

      {/* ── HERO: Royal Palace Doors ── */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6">

        {/* Jali tiling background */}
        <JaliPattern />
        <div className="absolute inset-0 z-0" style={{ background: 'url(#jali-hero)' }}>
          <svg width="100%" height="100%">
            <rect width="100%" height="100%" fill="url(#jali-hero)" />
          </svg>
        </div>

        {/* Mandala background — very faint, slow spin */}
        <div className="absolute inset-0 flex items-center justify-center z-[25] pointer-events-none">
          <svg viewBox="0 0 400 400" className="w-[140vw] max-w-[900px] h-auto opacity-[0.08] animate-[spin_120s_linear_infinite] text-[#8B1C1C]">
            {/* Outer rings */}
            <circle cx="200" cy="200" r="185" fill="none" stroke="currentColor" strokeWidth="12" />
            <circle cx="200" cy="200" r="172" fill="none" stroke="currentColor" strokeWidth="3" />

            {/* 24 Spokes and Rim Dots */}
            {[...Array(24)].map((_, i) => {
              const rotation = (i * 360) / 24;
              return (
                <g key={`spoke-${i}`} style={{ transform: `rotate(${rotation}deg)`, transformOrigin: "200px 200px" }}>
                  {/* Spoke tapering outwards */}
                  <polygon points="192,180 208,180 202,30 198,30" fill="currentColor" />
                  {/* Dot on the rim between spokes (rotated 7.5 deg) */}
                  <circle cx="200" cy="34" r="5.5" fill="currentColor" style={{ transform: `rotate(7.5deg)`, transformOrigin: "200px 200px" }} />
                </g>
              );
            })}

            {/* Inner Hub */}
            <circle cx="200" cy="200" r="32" fill="none" stroke="currentColor" strokeWidth="12" />
            <circle cx="200" cy="200" r="14" fill="currentColor" />
          </svg>
        </div>

        {/* ── Hero Content ── */}
        <div
          className="relative z-30 flex flex-col items-center gap-6 w-full max-w-3xl px-4 mb-20 sm:mb-32 animate-[fadeIn_1.5s_ease-out]"
        >


          {/* LUXURY PASSPORT CARD */}
          <div
            className="relative flex flex-col justify-between w-full min-h-[400px] sm:min-h-[460px] rounded-2xl overflow-hidden border border-[#D4AF37]/25"
            style={{
              background: 'linear-gradient(160deg, #1E2A4F 0%, #162040 40%, #1E2A4F 70%, #243260 100%)',
              boxShadow: '0 30px 60px rgba(30,42,79,0.6), 0 0 0 1px rgba(212,175,55,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            {/* Guilloche / Security Pattern Overlay - Gold */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q 25 20, 50 10 T 100 10' fill='none' stroke='%23D4AF37' stroke-width='0.3'/%3E%3Cpath d='M0 10 Q 25 0, 50 10 T 100 10' fill='none' stroke='%23D4AF37' stroke-width='0.15'/%3E%3C/svg%3E")` }}
            />

            {/* Radial glow in center */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(212,175,55,0.08) 0%, transparent 70%)' }} />

            {/* Decorative watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06]">
              <img src="/emblem.svg" alt="" aria-hidden="true" className="w-2/3 max-w-[260px] h-auto" style={{ filter: 'brightness(0) invert(1)' }} />
            </div>

            {/* Guilloche Stars (Bottom Right) */}
            <div className="absolute bottom-16 right-4 sm:right-8 opacity-90 pointer-events-none z-0 flex flex-col items-end">
               <GuillocheStar className="w-14 h-14 text-[#FF9933] drop-shadow-[0_0_8px_rgba(255,153,51,0.6)]" />
               <GuillocheStar className="w-10 h-10 text-white -mt-3 mr-8 transform -rotate-12 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
               <GuillocheStar className="w-12 h-12 text-[#138808] -mt-5 mr-1 transform rotate-12 drop-shadow-[0_0_8px_rgba(19,136,8,1)]" />
            </div>

            {/* Repeating text lines as subtle borders */}
            <div className="absolute left-0 w-full h-full pointer-events-none flex flex-col justify-between py-[20%] opacity-[0.07] text-[5px] leading-none overflow-hidden text-[#D4AF37] font-serif tracking-widest">
               <div className="w-[200%] whitespace-nowrap">BHARAT VISA SEVA · REPUBLIC OF INDIA · OFFICIAL VISA PORTAL · IMMIGRATION BUREAU</div>
               <div className="w-[200%] whitespace-nowrap">BHARAT VISA SEVA · REPUBLIC OF INDIA · OFFICIAL VISA PORTAL · IMMIGRATION BUREAU</div>
            </div>

            <div className="relative z-10 flex flex-col flex-1 p-5 sm:p-8 w-full text-[#FAF7F0]">

              {/* Header Row */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xs font-bold font-serif text-[#D4AF37]/80 tracking-[0.3em] uppercase">अखिल भारतीय ई-वीज़ा पोर्टल</h2>
                  <h2 className="text-sm font-bold font-serif text-[#D4AF37] tracking-[0.25em] uppercase mt-0.5">BHARAT VISA SEVA</h2>
                </div>
                <span className="text-xs font-bold font-sans text-white/30 tracking-[0.3em] uppercase border border-white/10 px-2 py-1 rounded">E-Visa</span>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent my-4" />

              {/* Central gateway text */}
              <div className="flex-1 flex flex-col items-center justify-center py-2 z-10 text-center">
                 <p className="text-[10px] font-sans font-bold tracking-[0.5em] text-white/40 uppercase mb-3">Welcome To</p>
                 <h2 className="text-4xl sm:text-5xl font-serif font-light text-white leading-[1.15]">
                    Your Gateway
                 </h2>
                 <h2 className="text-4xl sm:text-5xl font-serif italic font-light text-[#D4AF37] leading-[1.15] mt-1">
                    to India
                 </h2>
                 <p className="text-[11px] font-sans text-white/40 tracking-widest uppercase mt-4"> Discover · Experience · Flourish</p>
              </div>
            </div>

            {/* ACTION BUTTONS (Inside the sticker) */}
            <div className="relative z-10 flex flex-col w-full border-t border-white/10 bg-gradient-to-r from-white/5 to-white/[0.03]">
              <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 pb-3 justify-center">
                <Link to="/guide/visa-finder"
                  className="relative bg-gradient-to-r from-[#D4AF37] to-[#C9933A] text-[#1E2A4F] px-8 py-3.5 font-sans font-bold uppercase tracking-widest text-xs overflow-hidden group shadow-[0_8px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_12px_28px_rgba(212,175,55,0.35)] transition-all duration-300 hover:-translate-y-0.5 text-center rounded-lg">
                  <span className="absolute inset-1 border border-[#1E2A4F]/15 pointer-events-none rounded transition-all duration-300" />
                  <span className="relative z-10 flex items-center justify-center gap-2">Start Application <span className="text-sm">→</span></span>
                </Link>
                <Link to="/status"
                  className="bg-white/[0.06] border border-white/20 text-white/80 px-8 py-3.5 font-sans font-bold uppercase tracking-widest text-xs hover:bg-white/10 hover:text-white hover:border-white/30 transition-all duration-300 hover:-translate-y-0.5 text-center rounded-lg">
                  Check Application Status
                </Link>
              </div>
              
              {/* Subtle direct links */}
              <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 px-6 pb-5 text-[10px] sm:text-[11px] font-sans tracking-widest text-white/50 uppercase">
                <span className="hidden sm:inline opacity-60 font-bold mr-1">Direct Routes:</span>
                <Link to="/flow/voa" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                  <div className="flex gap-1">
                    <img src="https://flagcdn.com/w40/jp.png" className="w-4 rounded-sm opacity-90" alt="Japan"/>
                    <img src="https://flagcdn.com/w40/kr.png" className="w-4 rounded-sm opacity-90" alt="South Korea"/>
                    <img src="https://flagcdn.com/w40/ae.png" className="w-4 rounded-sm opacity-90" alt="UAE"/>
                  </div>
                  On Arrival
                </Link>
                <span className="opacity-30">·</span>
                <Link to="/flow/afghan" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"><img src="https://flagcdn.com/w20/af.png" className="w-4 rounded-sm opacity-90" alt=""/> Afghan</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#FAF7F0] to-transparent z-20 pointer-events-none" />
      </section>

      {/* ── HOW IT WORKS: VISUAL FLOW ── */}
      <section className="bg-white py-24 px-6 relative z-20 border-b border-[#EBE5D9]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-[#C4762A] mb-3">Simple Process</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1E2A4F]">How it works</h2>
          </div>

          <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-10 md:gap-4">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
            
            {/* Steps */}
            {[
              {
                step: '01',
                title: 'Discover',
                desc: 'Find the exact visa route for your nationality and purpose.',
                icon: (
                  <svg className="w-6 h-6 text-[#1E2A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                )
              },
              {
                step: '02',
                title: 'Apply & Pay',
                desc: 'Complete the secure online application and submit payment.',
                icon: (
                  <svg className="w-6 h-6 text-[#1E2A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                )
              },
              {
                step: '03',
                title: 'Receive ETA',
                desc: 'Get your Electronic Travel Authorization delivered via email.',
                icon: (
                  <svg className="w-6 h-6 text-[#1E2A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                )
              },
              {
                step: '04',
                title: 'Travel',
                desc: 'Arrive in India and present your ETA for entry.',
                icon: (
                  <svg className="w-6 h-6 text-[#1E2A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                )
              }
            ].map((s, i) => (
              <div key={s.step} className="relative z-10 flex flex-col items-center text-center flex-1 group">
                <div className="w-20 h-20 rounded-full bg-white border border-[#D4AF37]/30 shadow-[0_8px_20px_rgba(0,0,0,0.04)] flex items-center justify-center mb-6 relative group-hover:scale-105 group-hover:border-[#D4AF37] transition-all duration-300">
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#FAF7F0] text-[#D4AF37] text-[10px] font-bold rounded-full flex items-center justify-center border border-[#D4AF37]/20">
                    {s.step}
                  </div>
                  {s.icon}
                </div>
                <h3 className="font-serif font-bold text-[#1E2A4F] text-lg mb-2">{s.title}</h3>
                <p className="font-sans text-sm text-[#1E2A4F]/70 max-w-[200px]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTINATION CARDS ── */}
      <section className="bg-[#FAF7F0] py-24 px-6 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-[#C4762A] mb-3">A Land of Contrasts</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1E2A4F] mb-4">Where Will Your Journey Take You?</h2>
            <div className="w-20 h-[2px] bg-[#D4AF37] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">            {/* Kashmir — Tiger */}
            <Link to="/tourism" className="group block relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 h-[500px] cursor-pointer">
              <div className="absolute inset-0 w-full h-full bg-[#1E2A4F]">
                <img src="/tiger.jpg" alt="Kashmir Tiger" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out opacity-90 group-hover:opacity-100" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

              <div className="absolute inset-0 p-8 flex flex-col justify-end items-center text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] font-sans mb-3 opacity-90">The North · Kashmir</span>
                <h3 className="text-3xl font-serif font-bold text-white mb-2">Kashmir & the Himalayas</h3>
                <div className="w-12 h-px bg-[#D4AF37] mb-4 opacity-50" />
                <p className="text-sm font-sans text-white/80 leading-relaxed mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Snow leopards, Dal Lake shikaras, and Mughal gardens where saffron blooms each autumn.</p>
                <div className="px-6 sm:px-8 py-3 sm:py-4 border border-[#D4AF37]/50 bg-[#1E2A4F]/30 text-[#D4AF37] font-bold text-[10px] sm:text-xs uppercase tracking-widest group-hover:bg-[#D4AF37] group-hover:text-[#1E2A4F] group-hover:border-[#D4AF37] transition-all duration-500 backdrop-blur-md shadow-lg rounded-sm mt-2">
                  Explore Kashmir
                </div>
              </div>
            </Link>

            {/* Rajasthan — Elephant */}
            <Link to="/tourism" className="group block relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 h-[500px] cursor-pointer md:mt-12">
              <div className="absolute inset-0 w-full h-full bg-[#1E2A4F]">
                <img src="/elephant.jpg" alt="Rajasthan Elephant" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out opacity-90 group-hover:opacity-100" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

              <div className="absolute inset-0 p-8 flex flex-col justify-end items-center text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] font-sans mb-3 opacity-90">The Heartlands · Rajasthan</span>
                <h3 className="text-3xl font-serif font-bold text-white mb-2">Palaces & Forts</h3>
                <div className="w-12 h-px bg-[#D4AF37] mb-4 opacity-50" />
                <p className="text-sm font-sans text-white/80 leading-relaxed mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Royal elephants march towards Jaipur's Amber Fort as it rises above the plains in magnificent sandstone.</p>
                <div className="px-6 sm:px-8 py-3 sm:py-4 border border-[#D4AF37]/50 bg-[#1E2A4F]/30 text-[#D4AF37] font-bold text-[10px] sm:text-xs uppercase tracking-widest group-hover:bg-[#D4AF37] group-hover:text-[#1E2A4F] group-hover:border-[#D4AF37] transition-all duration-500 backdrop-blur-md shadow-lg rounded-sm mt-2">
                  Explore Rajasthan
                </div>
              </div>
            </Link>

            {/* Kerala — Peacock */}
            <Link to="/tourism" className="group block relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 h-[500px] cursor-pointer">
              <div className="absolute inset-0 w-full h-full bg-[#1E2A4F]">
                <img src="/peacock.jpg" alt="Kerala Peacock" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out opacity-90 group-hover:opacity-100" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

              <div className="absolute inset-0 p-8 flex flex-col justify-end items-center text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] font-sans mb-3 opacity-90">The South · Kerala</span>
                <h3 className="text-3xl font-serif font-bold text-white mb-2">Backwaters & Temples</h3>
                <div className="w-12 h-px bg-[#D4AF37] mb-4 opacity-50" />
                <p className="text-sm font-sans text-white/80 leading-relaxed mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">The peacock dances in Periyar's forests as houseboats drift through ancient lush waterways.</p>
                <div className="px-6 sm:px-8 py-3 sm:py-4 border border-[#D4AF37]/50 bg-[#1E2A4F]/30 text-[#D4AF37] font-bold text-[10px] sm:text-xs uppercase tracking-widest group-hover:bg-[#D4AF37] group-hover:text-[#1E2A4F] group-hover:border-[#D4AF37] transition-all duration-500 backdrop-blur-md shadow-lg rounded-sm mt-2">
                  Explore Kerala
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>
    </div>
  );
}

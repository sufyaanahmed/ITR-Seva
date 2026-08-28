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

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN HOME COMPONENT
───────────────────────────────────────────────────────────────────────────── */

export default function Home() {
  const [doorsOpen, setDoorsOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDoorsOpen(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-full bg-[#FAF7F0] overflow-hidden">

      {/* ── HERO: Royal Palace Doors ── */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden">

        {/* Jali tiling background */}
        <JaliPattern />
        <div className="absolute inset-0 z-0" style={{ background: 'url(#jali-hero)' }}>
          <svg width="100%" height="100%">
            <rect width="100%" height="100%" fill="url(#jali-hero)" />
          </svg>
        </div>

        {/* Mandala background — very faint, slow spin */}
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
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

        {/* ── Left Palace Door ── */}
        <div
          className="absolute top-0 left-0 h-full z-40 pointer-events-none"
          style={{
            width: '52%',
            background: 'linear-gradient(to right, #6B1111 0%, #8B1C1C 100%)',
            transition: 'transform 2s cubic-bezier(0.77,0,0.175,1)',
            transform: doorsOpen ? 'translateX(-102%)' : 'translateX(0)',
            boxShadow: doorsOpen ? 'none' : '12px 0 40px rgba(0,0,0,0.35)',
          }}
        >
          {/* Gold inner frame */}
          <div className="absolute inset-3 border border-[#D4AF37]/30" />
          <div className="absolute inset-5 border border-[#D4AF37]/15" />
          {/* Vertical ornament lines */}
          <div className="absolute top-0 right-10 bottom-0 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-transparent" />
          <div className="absolute top-0 right-16 bottom-0 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/20 to-transparent" />
          {/* Jali overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.08]">
            <rect width="100%" height="100%" fill="url(#jali-hero)" />
          </svg>
          {/* Central medallion */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 80 80" className="w-24 h-24 opacity-30">
              <circle cx="40" cy="40" r="36" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
              <circle cx="40" cy="40" r="24" fill="none" stroke="#D4AF37" strokeWidth="1" />
              <circle cx="40" cy="40" r="10" fill="#D4AF37" fillOpacity="0.4" />
              {[...Array(8)].map((_, i) => {
                const a = (i / 8) * Math.PI * 2;
                return <line key={i} x1="40" y1="40" x2={40 + Math.sin(a) * 36} y2={40 - Math.cos(a) * 36} stroke="#D4AF37" strokeWidth="0.8" />;
              })}
            </svg>
          </div>
          {/* Scalloped right edge SVG */}
          <svg className="absolute top-0 right-0 h-full" style={{ width: 40 }} preserveAspectRatio="none" viewBox="0 0 40 1000">
            <path d="M0,0 L40,0 L40,1000 L0,1000
              C15,950 15,900 0,850
              C15,800 15,750 0,700
              C15,650 15,600 0,550
              C15,500 15,450 0,400
              C15,350 15,300 0,250
              C15,200 15,150 0,100
              C15,50 15,25 0,0Z"
              fill="#8B1C1C" />
            <path d="M0,1000 C15,950 15,900 0,850 C15,800 15,750 0,700 C15,650 15,600 0,550 C15,500 15,450 0,400 C15,350 15,300 0,250 C15,200 15,150 0,100 C15,50 15,25 0,0"
              fill="none" stroke="#D4AF37" strokeWidth="3" />
          </svg>
        </div>

        {/* ── Right Palace Door ── */}
        <div
          className="absolute top-0 right-0 h-full z-40 pointer-events-none"
          style={{
            width: '52%',
            background: 'linear-gradient(to left, #6B1111 0%, #8B1C1C 100%)',
            transition: 'transform 2s cubic-bezier(0.77,0,0.175,1)',
            transform: doorsOpen ? 'translateX(102%)' : 'translateX(0)',
            boxShadow: doorsOpen ? 'none' : '-12px 0 40px rgba(0,0,0,0.35)',
          }}
        >
          <div className="absolute inset-3 border border-[#D4AF37]/30" />
          <div className="absolute inset-5 border border-[#D4AF37]/15" />
          <div className="absolute top-0 left-10 bottom-0 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-transparent" />
          <div className="absolute top-0 left-16 bottom-0 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/20 to-transparent" />
          <svg className="absolute inset-0 w-full h-full opacity-[0.08]">
            <rect width="100%" height="100%" fill="url(#jali-hero)" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 80 80" className="w-24 h-24 opacity-30">
              <circle cx="40" cy="40" r="36" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
              <circle cx="40" cy="40" r="24" fill="none" stroke="#D4AF37" strokeWidth="1" />
              <circle cx="40" cy="40" r="10" fill="#D4AF37" fillOpacity="0.4" />
              {[...Array(8)].map((_, i) => {
                const a = (i / 8) * Math.PI * 2;
                return <line key={i} x1="40" y1="40" x2={40 + Math.sin(a) * 36} y2={40 - Math.cos(a) * 36} stroke="#D4AF37" strokeWidth="0.8" />;
              })}
            </svg>
          </div>
          {/* Scalloped left edge SVG */}
          <svg className="absolute top-0 left-0 h-full" style={{ width: 40 }} preserveAspectRatio="none" viewBox="0 0 40 1000">
            <path d="M40,0 L0,0 L0,1000 L40,1000
              C25,950 25,900 40,850
              C25,800 25,750 40,700
              C25,650 25,600 40,550
              C25,500 25,450 40,400
              C25,350 25,300 40,250
              C25,200 25,150 40,100
              C25,50 25,25 40,0Z"
              fill="#8B1C1C" />
            <path d="M40,1000 C25,950 25,900 40,850 C25,800 25,750 40,700 C25,650 25,600 40,550 C25,500 25,450 40,400 C25,350 25,300 40,250 C25,200 25,150 40,100 C25,50 25,25 40,0"
              fill="none" stroke="#D4AF37" strokeWidth="3" />
          </svg>
        </div>

        {/* ── Hero Content (revealed behind the doors) ── */}
        {/* ── Hero Content (revealed behind the doors) ── */}
        <div
          className="relative z-30 flex flex-col items-center gap-8 w-full max-w-[420px]"
          style={{
            transition: 'opacity 1.8s ease 0.8s, transform 1.8s ease 0.8s',
            opacity: doorsOpen ? 1 : 0,
            transform: doorsOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
          }}
        >
          {/* Decorative travel-journal cover; deliberately not an official passport or emblem. */}
          <div 
            className="relative flex flex-col items-center w-full aspect-[88/125] rounded-lg shadow-[20px_20px_50px_rgba(0,0,0,0.8),inset_5px_0_15px_rgba(255,255,255,0.05),inset_-5px_0_15px_rgba(0,0,0,0.4)] overflow-hidden"
            style={{
              backgroundColor: '#0a0d1e',
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' opacity='0.15' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          >
            {/* Darker spine gradient on the left edge */}
            <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />

            <div className="flex flex-col items-center justify-between h-full py-[10%] px-[8%] w-full text-center">
              
              {/* TOP TEXT: independent demo identity */}
              <div className="flex flex-col items-center gap-2 mt-2">
                <p className="uppercase tracking-[0.2em] text-[#F5C518] font-sans font-bold text-[0.55rem] sm:text-[0.65rem] flex items-center gap-2 drop-shadow-md opacity-90">
                  <span className="w-4 h-px bg-[#F5C518]/60 inline-block" />
                  Independent educational prototype
                  <span className="w-4 h-px bg-[#F5C518]/60 inline-block" />
                </p>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#F5C518] leading-tight tracking-wide drop-shadow-md">
                  Explore the visa journey.
                </h1>
              </div>
              
              {/* Original decorative compass-flower; not a Government mark. */}
              <div className="flex flex-col items-center my-4 w-1/3 max-w-[100px] relative" aria-hidden="true">
                <svg viewBox="0 0 120 120" className="w-full h-auto text-[#F5C518] drop-shadow-lg" fill="none">
                  <circle cx="60" cy="60" r="48" stroke="currentColor" strokeWidth="2" opacity="0.75" />
                  <circle cx="60" cy="60" r="34" stroke="currentColor" strokeWidth="1" opacity="0.45" />
                  <path d="M60 10c12 20 12 36 0 50-12-14-12-30 0-50ZM110 60c-20 12-36 12-50 0 14-12 30-12 50 0ZM60 110c-12-20-12-36 0-50 12 14 12 30 0 50ZM10 60c20-12 36-12 50 0-14 12-30 12-50 0Z" fill="currentColor" opacity="0.7" />
                  <path d="M25 25c22 5 33 16 35 35-19-2-30-13-35-35ZM95 25c-5 22-16 33-35 35 2-19 13-30 35-35ZM95 95c-22-5-33-16-35-35 19 2 30 13 35 35ZM25 95c5-22 16-33 35-35-2 19-13 30-35 35Z" fill="currentColor" opacity="0.35" />
                  <circle cx="60" cy="60" r="8" fill="currentColor" />
                </svg>
              </div>

              {/* BOTTOM TEXT & CTA */}
              <div className="flex flex-col items-center gap-4 w-full mb-2">
                <p className="text-[#F5C518]/90 font-serif italic text-xs sm:text-sm leading-relaxed px-2 drop-shadow-md">
                  Learn how route selection, document preparation, and resilient public-service design can work—without submitting real data.
                </p>
                <p className="rounded border border-[#F5C518]/35 bg-black/25 px-3 py-2 text-[0.65rem] font-sans font-bold uppercase tracking-wider text-[#F5C518]">
                  No Government affiliation · synthetic data only
                </p>
                
                <div className="flex flex-col w-full px-4 gap-3 mt-2">
                  <Link to="/guide/visa-finder"
                    className="w-full bg-[#F5C518] text-[#0a0d1e] py-3 font-sans font-bold uppercase tracking-widest text-[0.65rem] sm:text-[0.7rem] shadow-lg hover:shadow-xl transition-shadow text-center rounded-sm">
                    Explore route demo →
                  </Link>
                  <Link to="/status"
                    className="w-full border border-[#F5C518]/40 text-[#F5C518] py-3 font-sans font-bold uppercase tracking-widest text-[0.65rem] sm:text-[0.7rem] hover:bg-[#F5C518]/10 transition-colors text-center rounded-sm">
                    Try synthetic status demo
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#FAF7F0] to-transparent z-20 pointer-events-none" />
      </section>



      {/* ── DESTINATION CARDS ── */}
      <section className="bg-[#FAF7F0] py-24 px-6 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-[#C4762A] mb-3">A Land of Contrasts</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1E2A4F] mb-4">Where Will You Journey?</h2>
            <div className="w-20 h-[2px] bg-[#D4AF37] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* Kashmir — Tiger */}
            <Link to="/guide/visa-finder" className="group block relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 h-[500px] cursor-pointer">
              <div className="absolute inset-0 w-full h-full bg-[#1E2A4F]">
                <img
                  src="/tiger.jpg"
                  alt="Kashmir Tiger"
                  width="682"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  sizes="(min-width: 1280px) 357px, (min-width: 768px) calc((100vw - 8rem) / 3), calc(100vw - 3rem)"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out opacity-90 group-hover:opacity-100"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end items-center text-center transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] font-sans mb-3 opacity-90">The North · Kashmir</span>
                <h3 className="text-3xl font-serif font-bold text-white mb-2">Kashmir & the Himalayas</h3>
                <div className="w-12 h-px bg-[#D4AF37] mb-4 opacity-50" />
                <p className="text-sm font-sans text-white/80 leading-relaxed mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Snow leopards, Dal Lake shikaras, and Mughal gardens where saffron blooms each autumn.</p>
                <div className="px-8 py-4 border border-[#D4AF37] text-[#D4AF37] font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#1E2A4F] transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150 backdrop-blur-sm">
                  Check route eligibility
                </div>
              </div>
            </Link>

            {/* Rajasthan — Elephant */}
            <Link to="/guide/visa-finder" className="group block relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 h-[500px] cursor-pointer md:mt-12">
              <div className="absolute inset-0 w-full h-full bg-[#1E2A4F]">
                <img
                  src="/elephant.jpg"
                  alt="Rajasthan Elephant"
                  width="573"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  sizes="(min-width: 1280px) 357px, (min-width: 768px) calc((100vw - 8rem) / 3), calc(100vw - 3rem)"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out opacity-90 group-hover:opacity-100"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end items-center text-center transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] font-sans mb-3 opacity-90">The Heartlands · Rajasthan</span>
                <h3 className="text-3xl font-serif font-bold text-white mb-2">Palaces & Forts</h3>
                <div className="w-12 h-px bg-[#D4AF37] mb-4 opacity-50" />
                <p className="text-sm font-sans text-white/80 leading-relaxed mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Royal elephants march towards Jaipur's Amber Fort as it rises above the plains in magnificent sandstone.</p>
                <div className="px-8 py-4 border border-[#D4AF37] text-[#D4AF37] font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#1E2A4F] transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150 backdrop-blur-sm">
                  Check route eligibility
                </div>
              </div>
            </Link>

            {/* Kerala — Peacock */}
            <Link to="/guide/visa-finder" className="group block relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 h-[500px] cursor-pointer">
              <div className="absolute inset-0 w-full h-full bg-[#1E2A4F]">
                <img
                  src="/peacock.jpg"
                  alt="Kerala Peacock"
                  width="585"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  sizes="(min-width: 1280px) 357px, (min-width: 768px) calc((100vw - 8rem) / 3), calc(100vw - 3rem)"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out opacity-90 group-hover:opacity-100"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end items-center text-center transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] font-sans mb-3 opacity-90">The South · Kerala</span>
                <h3 className="text-3xl font-serif font-bold text-white mb-2">Backwaters & Temples</h3>
                <div className="w-12 h-px bg-[#D4AF37] mb-4 opacity-50" />
                <p className="text-sm font-sans text-white/80 leading-relaxed mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">The peacock dances in Periyar's forests as houseboats drift through ancient lush waterways.</p>
                <div className="px-8 py-4 border border-[#D4AF37] text-[#D4AF37] font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#1E2A4F] transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150 backdrop-blur-sm">
                  Check route eligibility
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ── CINEMATIC TEMPLE DIVIDER ── */}
      <div className="relative w-full h-[350px] md:h-[450px] overflow-hidden border-t border-[#1E2A4F]/20">
        <img
          src="/taj_mahal_divider.png"
          alt=""
          aria-hidden="true"
          width="5120"
          height="3434"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1222] via-[#0c1222]/30 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-[#D4AF37] font-sans font-bold uppercase tracking-[0.4em] text-xs mb-4 drop-shadow-md">
            Discover
          </p>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-wide drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
            A Timeless Heritage
          </h2>
        </div>
      </div>

      {/* ── SERVICES SECTION ── */}
      <section className="relative py-28 px-6 overflow-hidden">
        {/* Deep Royal Texture Background */}
        <div className="absolute inset-0 z-0 bg-[#0c1222]">
          <img
            src="/royal_indian_texture.jpg"
            alt=""
            aria-hidden="true"
            width="1024"
            height="1024"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            sizes="100vw"
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c1222]/80 via-[#1E2A4F]/60 to-[#0c1222]/90" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-3 font-sans">Your Journey Starts Here</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Essential Services</h2>
            <div className="w-16 h-px bg-[#D4AF37] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg viewBox="0 0 40 40" className="w-10 h-10 drop-shadow-md" fill="none">
                    <circle cx="18" cy="18" r="12" stroke="#D4AF37" strokeWidth="1.5" />
                    <path d="M26 26 L34 34" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
                    <path d="M18 12 L18 24 M12 18 L24 18" stroke="#D4AF37" strokeWidth="1" opacity="0.6" />
                  </svg>
                ),
                title: 'Route Finder Demo',
                desc: 'Answer a few questions for a preliminary route suggestion, then verify it with the official service.',
                link: '/guide/visa-finder',
                cta: 'Explore Demo',
              },
              {
                icon: (
                  <svg viewBox="0 0 40 40" className="w-10 h-10 drop-shadow-md" fill="none">
                    <rect x="8" y="6" width="24" height="28" rx="2" stroke="#D4AF37" strokeWidth="1.5" />
                    <path d="M13 14 L27 14 M13 20 L27 20 M13 26 L20 26" stroke="#D4AF37" strokeWidth="1" opacity="0.7" />
                    <path d="M26 23 L30 27 L26 31" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                  </svg>
                ),
                title: 'Prepare a Demo',
                desc: 'Check the preliminary route first, then prepare a local educational demo without submission or payment.',
                link: '/guide/visa-finder',
                cta: 'Check My Route',
              },
              {
                icon: (
                  <svg viewBox="0 0 40 40" className="w-10 h-10 drop-shadow-md" fill="none">
                    <circle cx="20" cy="20" r="14" stroke="#D4AF37" strokeWidth="1.5" />
                    <path d="M20 12 L20 20 L26 26" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                ),
                title: 'Synthetic Status Demo',
                desc: 'Explore a simulated status journey using synthetic application data; no official records are queried.',
                link: '/status',
                cta: 'Try Status Demo',
              },
            ].map(s => (
              <div key={s.title} className="group relative bg-[#151D36]/70 backdrop-blur-md border border-[#D4AF37]/20 p-10 flex flex-col items-center text-center gap-5 shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all duration-500 overflow-hidden rounded-xl">
                {/* Gold inner border */}
                <div className="absolute inset-2 border border-[#D4AF37]/10 pointer-events-none group-hover:border-[#D4AF37]/30 transition-colors duration-500 rounded-lg" />
                
                <div className="mb-2 p-5 rounded-full bg-gradient-to-br from-[#1E2A4F] to-[#0c1222] border border-[#D4AF37]/30 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  {s.icon}
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#D4AF37]">{s.title}</h3>
                <p className="text-sm font-sans text-white/70 leading-relaxed flex-1">{s.desc}</p>
                <Link to={s.link} className="mt-4 text-xs font-bold font-sans text-white uppercase tracking-widest group-hover:text-[#D4AF37] transition-colors relative inline-block">
                  {s.cta} 
                  <span className="block h-[2px] w-0 bg-[#D4AF37] absolute -bottom-1 left-0 group-hover:w-full transition-all duration-500" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>



    </div>
  );
}

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

/** Temple gopuram silhouette */
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
          <svg viewBox="0 0 400 400" className="w-[140vw] max-w-[900px] h-auto opacity-[0.035] animate-[spin_180s_linear_infinite] text-[#1E2A4F]">
            {[...Array(12)].map((_, i) => {
              const a = (i / 12) * 360;
              const r = a * Math.PI / 180;
              const x2 = 200 + Math.sin(r) * 180;
              const y2 = 200 - Math.cos(r) * 180;
              return <line key={i} x1="200" y1="200" x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.8" />;
            })}
            {[20, 50, 80, 120, 160, 185].map(r => (
              <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="currentColor" strokeWidth={r > 100 ? 0.5 : 1} />
            ))}
            {[...Array(8)].map((_, i) => {
              const a = (i / 8) * Math.PI * 2;
              const px = 200 + Math.sin(a) * 120;
              const py = 200 - Math.cos(a) * 120;
              return <circle key={i} cx={px} cy={py} r="18" fill="none" stroke="currentColor" strokeWidth="0.8" />;
            })}
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
        <div
          className="relative z-30 max-w-4xl flex flex-col items-center gap-4"
          style={{
            transition: 'opacity 1.8s ease 0.8s, transform 1.8s ease 0.8s',
            opacity: doorsOpen ? 1 : 0,
            transform: doorsOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
          }}
        >
          {/* Decorative arch over the text */}

          <p className="uppercase tracking-[0.4em] text-[#C4762A] font-sans font-bold text-xs mb-2 flex items-center gap-3">
            <span className="w-10 h-px bg-[#C4762A] inline-block" />
            Government of India · Not Official
            <span className="w-10 h-px bg-[#C4762A] inline-block" />
          </p>

          <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#1E2A4F] leading-tight">
            India Awaits You.
          </h1>
          <p className="text-lg md:text-2xl font-serif text-[#555] italic max-w-2xl leading-relaxed">
            From the snow-capped Himalayas to the Keralan coast, every journey starts with a visa.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 mt-6">
            <Link to="/guide/visa-finder"
              className="relative bg-[#1E2A4F] text-white px-10 py-4 font-sans font-bold uppercase tracking-widest text-sm overflow-hidden group shadow-lg hover:shadow-xl transition-shadow">
              <span className="absolute inset-1 border border-[#D4AF37]/30 pointer-events-none group-hover:inset-0.5 transition-all duration-300" />
              <span className="relative z-10">Find My Visa →</span>
            </Link>
            <Link to="/status"
              className="border border-[#1E2A4F] text-[#1E2A4F] px-10 py-4 font-sans font-medium uppercase tracking-widest text-sm hover:bg-[#1E2A4F]/5 transition-colors">
              Check Status
            </Link>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#FAF7F0] to-transparent z-20 pointer-events-none" />
      </section>



      {/* ── DESTINATION CARDS ── */}
      <section className="bg-[#FAF7F0] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-[#C4762A] mb-3">A Land of Contrasts</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1E2A4F] mb-4">Where Will You Journey?</h2>
            <div className="w-20 h-[2px] bg-[#D4AF37] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Kashmir — Tiger */}
            <div className="group relative border border-[#1E2A4F]/12 bg-white hover:border-[#C4762A]/40 transition-all duration-500 hover:shadow-lg overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#C4762A] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="p-8 flex flex-col items-center text-center gap-4">
                <TigerIllustration className="w-full" />
                <div className="w-10 h-px bg-[#C4762A]/50" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C4762A] font-sans">The North · Kashmir</span>
                <h3 className="text-2xl font-serif font-bold text-[#1E2A4F]">Kashmir & the Himalayas</h3>
                <p className="text-sm font-sans text-[#666] leading-relaxed">Snow leopards, Dal Lake shikaras, and Mughal gardens where saffron blooms each autumn.</p>
                <Link to="/apply" className="mt-2 text-xs font-bold font-sans text-[#1E2A4F] uppercase tracking-widest hover:text-[#C4762A] transition-colors">
                  e-Tourist Visa →
                </Link>
              </div>
            </div>

            {/* Rajasthan — Elephant */}
            <div className="group relative border border-[#1E2A4F]/12 bg-white hover:border-[#D4AF37]/60 transition-all duration-500 hover:shadow-lg overflow-hidden md:-translate-y-8">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="p-8 flex flex-col items-center text-center gap-4">
                <ElephantIllustration className="w-full" />
                <div className="w-10 h-px bg-[#D4AF37]/60" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] font-sans">The Heartlands · Rajasthan</span>
                <h3 className="text-2xl font-serif font-bold text-[#1E2A4F]">Palaces & Forts</h3>
                <p className="text-sm font-sans text-[#666] leading-relaxed">Royal elephants march towards Jaipur's Amber Fort as it rises above the plains in magnificent sandstone.</p>
                <Link to="/apply" className="mt-2 text-xs font-bold font-sans text-[#1E2A4F] uppercase tracking-widest hover:text-[#C4762A] transition-colors">
                  e-Business Visa →
                </Link>
              </div>
            </div>

            {/* Kerala — Peacock */}
            <div className="group relative border border-[#1E2A4F]/12 bg-white hover:border-[#1B5E88]/40 transition-all duration-500 hover:shadow-lg overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#1B5E88] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="p-8 flex flex-col items-center text-center gap-4">
                <PeacockIllustration className="w-full" />
                <div className="w-10 h-px bg-[#1B5E88]/50" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1B5E88] font-sans">The South · Kerala</span>
                <h3 className="text-2xl font-serif font-bold text-[#1E2A4F]">Backwaters & Temples</h3>
                <p className="text-sm font-sans text-[#666] leading-relaxed">The peacock dances in Periyar's forests as houseboats drift through ancient waterways.</p>
                <Link to="/apply" className="mt-2 text-xs font-bold font-sans text-[#1E2A4F] uppercase tracking-widest hover:text-[#C4762A] transition-colors">
                  e-Medical Visa →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── TEMPLE SILHOUETTE DIVIDER ── */}
      <div className="flex justify-center gap-6 md:gap-16 py-8 bg-[#FAF7F0] border-t border-b border-[#1E2A4F]/08">
        <TempleGopuram className="h-28 w-12 opacity-30" />
        <TempleGopuram className="h-36 w-14 opacity-40" />
        <TempleGopuram className="h-44 w-16 opacity-50" />
        <TempleGopuram className="h-36 w-14 opacity-40" />
        <TempleGopuram className="h-28 w-12 opacity-30" />
      </div>

      {/* ── SERVICES SECTION ── */}
      <section className="bg-[#1E2A4F] py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-3 font-sans">Your Journey Starts Here</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Essential Services</h2>
            <div className="w-16 h-px bg-[#D4AF37] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
                    <circle cx="18" cy="18" r="12" stroke="#D4AF37" strokeWidth="1.5" />
                    <path d="M26 26 L34 34" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
                    <path d="M18 12 L18 24 M12 18 L24 18" stroke="#D4AF37" strokeWidth="1" opacity="0.5" />
                  </svg>
                ),
                title: 'Visa Finder',
                desc: 'Answer 4 questions to discover which visa category fits your journey to India.',
                link: '/guide/visa-finder',
                cta: 'Start Guide',
              },
              {
                icon: (
                  <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
                    <rect x="8" y="6" width="24" height="28" rx="2" stroke="#D4AF37" strokeWidth="1.5" />
                    <path d="M13 14 L27 14 M13 20 L27 20 M13 26 L20 26" stroke="#D4AF37" strokeWidth="1" opacity="0.6" />
                    <path d="M26 23 L30 27 L26 31" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                  </svg>
                ),
                title: 'Apply Online',
                desc: 'Submit your e-Visa application, upload documents, and pay — fully online.',
                link: '/apply',
                cta: 'Apply Now',
              },
              {
                icon: (
                  <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
                    <circle cx="20" cy="20" r="14" stroke="#D4AF37" strokeWidth="1.5" />
                    <path d="M20 12 L20 20 L26 26" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                ),
                title: 'Track Status',
                desc: 'Check your application status, download your ETA, or update arrival details.',
                link: '/status',
                cta: 'Check Status',
              },
            ].map(s => (
              <div key={s.title} className="group border border-white/10 p-8 hover:border-[#D4AF37]/40 transition-all duration-300 flex flex-col items-center text-center gap-4">
                <div className="mb-2">{s.icon}</div>
                <h3 className="text-xl font-serif font-bold text-white">{s.title}</h3>
                <p className="text-sm font-sans text-white/60 leading-relaxed flex-1">{s.desc}</p>
                <Link to={s.link} className="text-xs font-bold font-sans text-[#D4AF37] uppercase tracking-widest hover:text-white transition-colors">
                  {s.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>



    </div>
  );
}

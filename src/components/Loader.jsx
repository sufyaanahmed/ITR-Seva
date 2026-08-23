import React, { useEffect, useState } from 'react';

export default function Loader() {
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState('words'); // 'words', 'done'

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Show loader for a reasonable amount of time to allow animation to play
    const timer1 = setTimeout(() => {
      setPhase('done');
      setTimeout(() => {
        setLoading(false);
        document.body.style.overflow = 'auto';
      }, 700); // Wait for fade out
    }, 1500);
    
    return () => {
      clearTimeout(timer1);
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  if (!loading) return null;

  const positions = [
    { left: '12%', top: '18%' }, { left: '53%', top: '10%' }, { left: '70%', top: '22%' },
    { left: '18%', top: '75%' }, { left: '75%', top: '68%' }, { left: '44%', top: '85%' },
    { left: '82%', top: '42%' }, { left: '27%', top: '20%' }, { left: '85%', top: '79%' },
    { left: '10%', top: '49%' }, { left: '60%', top: '82%' }, { left: '5%', top: '33%' },
    { left: '80%', top: '15%' }, { left: '9%', top: '88%' }, { left: '26%', top: '89%' }
  ];
  
  const words = ['e-Filing', 'Tax Return', 'Income Tax', 'ITR', 'Assessment', 'Refund', 'Secure', 'e-Verify', 'TDS', 'Tax Payment', 'PAN', 'Aadhaar', 'Digital', 'Portal', 'e-Filing'];

  return (
    <section 
      id="welcome-loader" 
      className={`fixed inset-0 z-50 flex items-center justify-center font-serif transition-opacity duration-700 ${phase === 'done' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{ backgroundColor: '#003366', color: '#ffffff' }}
    >
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {words.map((word, i) => (
          <span 
            key={i} 
            className="absolute font-bold text-lg md:text-xl"
            style={{ 
              color: '#93C5FD', // Light blue accent
              left: positions[i]?.left, 
              top: positions[i]?.top,
              animation: `fadeIn 1s ease-out ${i * 0.05}s both`
            }}
          >
            {word}
          </span>
        ))}
      </div>
      
      <div className="relative z-10 text-center scale-100 animate-[scaleIn_0.8s_ease-out_forwards]">
        <img src="/Emblem_of_India.svg" alt="Emblem of India" className="h-[80px] mx-auto mb-6 opacity-90" style={{ filter: 'brightness(0) invert(1)' }} />
        <p className="text-[clamp(3.5rem,8vw,7rem)] font-bold mb-2 leading-none tracking-tight text-white">ITR-Seva</p>
        <p className="text-[0.8rem] font-sans font-bold uppercase tracking-[0.2em] mt-3 text-secondary">Income Tax Department</p>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
}

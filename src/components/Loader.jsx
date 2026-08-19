import React, { useEffect, useState } from 'react';

export default function Loader() {
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState('words'); // 'words', 'done'

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Auto-dismiss the loader after 2.5 seconds
    const timer1 = setTimeout(() => {
      setPhase('done');
      setTimeout(() => {
        setLoading(false);
        document.body.style.overflow = 'auto';
      }, 600); // Wait for fade out
    }, 2500);
    
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
  
  const words = ['Welcome', 'स्वागत', 'സ്വാഗതം', 'স্বাগতম', 'வரவேற்கிறோம்', 'ಸ್ವಾಗತ', 'స్వాగతం', 'સ્વાગત છે', 'ਸੁਆਗਤ ਹੈ', 'स्वागत आहे', 'ସ୍ୱାଗତ', 'خوش آمدید', 'स्वागत छ', 'स्वागतम्', 'Welcome'];

  return (
    <section 
      id="welcome-loader" 
      className={`fixed inset-0 z-50 flex items-center justify-center font-serif transition-opacity duration-700 ${phase === 'done' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{ backgroundColor: '#f4ead9', color: '#4c1f1a' }}
    >
      <div className="absolute inset-0 overflow-hidden opacity-70">
        {words.map((word, i) => (
          <span 
            key={i} 
            className="absolute font-bold text-lg md:text-xl"
            style={{ 
              color: '#742c24',
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
        <p className="text-[clamp(3.5rem,10vw,9rem)] font-bold mb-4 leading-none tracking-tight" style={{ color: '#5e1d17' }} lang="hi">स्वागत है</p>
        <p className="text-[0.72rem] font-sans font-extrabold uppercase tracking-[0.15em] mt-5" style={{ color: '#173a5d' }}>Bharat Visa Portal</p>
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

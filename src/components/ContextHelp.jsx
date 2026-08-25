import React, { useState, useRef, useEffect } from 'react';

export default function ContextHelp({ text }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block ml-2 align-middle" ref={dropdownRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-[#0b2540] hover:text-[#163a5f] bg-blue-50 hover:bg-blue-100 rounded-full w-5 h-5 flex items-center justify-center border border-blue-200 transition focus:outline-none"
        aria-label="Why are we asking this?"
      >
        <span className="font-bold text-xs italic font-serif">i</span>
      </button>
      
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-64 p-4 bg-white border-t-4 border-[#0b2540] shadow-lg z-10 animate-fade-in text-sm font-normal">
          <p className="text-gray-700 leading-relaxed">{text}</p>
        </div>
      )}
    </div>
  );
}

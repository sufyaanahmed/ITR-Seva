import React from 'react';
import { useStore } from '../store';

export default function SmartDocuments() {
  const { state, addDocument } = useStore();
  
  // Logic to determine required documents based on visa category
  let requiredDocs = [];
  
  if (state.data.application_type === 'voa') {
    requiredDocs = [
      { type: 'passport', title: 'Passport (Bio Page)', desc: 'Clear scan of your passport information page.', accepted: '.pdf,.jpg,.jpeg' }
    ];
  } else {
    requiredDocs = [
      { type: 'passport', title: 'Passport (Bio Page)', desc: 'Clear scan of your passport information page.', accepted: '.pdf,.jpg,.jpeg' },
      { type: 'photograph', title: 'Recent Photograph', desc: 'Color photo with a white background, not older than 6 months.', accepted: '.jpg,.jpeg,.png' }
    ];
    
    if (state.data.visa_category === 'business') {
      requiredDocs.push({ type: 'business_card', title: 'Business Card', desc: 'Copy of your business card or letterhead.', accepted: '.pdf,.jpg,.jpeg' });
    } else if (state.data.visa_category === 'medical' || state.data.visa_category === 'medical-attendant') {
      requiredDocs.push({ type: 'hospital_letter', title: 'Hospital Letter', desc: 'Letter from the Indian hospital confirming treatment.', accepted: '.pdf' });
    }

    if (state.data.nationality === 'Afghanistan') {
      requiredDocs.push({ type: 'tazkira', title: 'National ID Card (Tazkira)', desc: 'Scan of your Afghan National ID.', accepted: '.pdf,.jpg,.jpeg' });
    }
  }

  const handleDocUpload = (e, type) => {
    if (e.target.files[0]) {
      addDocument(type, e.target.files[0].name);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 p-4 rounded text-sm text-blue-900 mb-6">
        <strong className="block mb-1">Your Personalized Document Checklist</strong>
        <p>Based on your selection of a <strong>{state.data.visa_category}</strong> visa, please upload the following documents.</p>
      </div>

      <div className="space-y-4">
        {requiredDocs.map((req) => {
          const uploadedDoc = state.docs.find(d => d.type === req.type);
          
          return (
            <div key={req.type} className={`border rounded p-5 transition-colors ${uploadedDoc ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white'}`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex gap-4">
                  <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${uploadedDoc ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {uploadedDoc ? '✓' : '○'}
                  </div>
                  <div>
                    <strong className="text-gray-900 text-lg block mb-1">{req.title}</strong>
                    <p className="text-gray-600 text-sm mb-2">{req.desc}</p>
                    
                    {uploadedDoc ? (
                      <div className="flex items-center gap-2 text-sm text-green-700 font-bold bg-green-100/50 px-2 py-1 rounded inline-flex">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {uploadedDoc.name}
                      </div>
                    ) : (
                      <span className="text-amber-600 text-xs font-bold uppercase tracking-wider bg-amber-50 px-2 py-1 rounded">⚠ Missing</span>
                    )}
                  </div>
                </div>
                
                <label className={`cursor-pointer whitespace-nowrap px-6 py-2 text-sm font-bold rounded shadow-sm transition ${uploadedDoc ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-[#0b2540] text-white hover:bg-[#163a5f]'}`}>
                  {uploadedDoc ? 'Replace File' : 'Upload File'}
                  <input type="file" className="hidden" accept={req.accepted} onChange={(e) => handleDocUpload(e, req.type)} />
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

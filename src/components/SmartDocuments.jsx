import React, { useState } from 'react';
import { useStore } from '../store';

const KB = 1024;
const MB = 1024 * KB;

const jpegPhoto = {
  type: 'photograph',
  title: 'Recent square photograph',
  desc: 'Front-facing, full face, open eyes, plain light/white background, no spectacles, borders, or shadows.',
  accepted: '.jpg,.jpeg,image/jpeg',
  extensions: ['jpg', 'jpeg'],
  mimeTypes: ['image/jpeg'],
  minBytes: 10 * KB,
  maxBytes: MB,
  square: true,
  rule: 'Verified e-Visa rule: JPEG, 10 KB–1 MB, square.',
};

const pdfDocument = (type, title, desc) => ({
  type,
  title,
  desc,
  accepted: '.pdf,application/pdf',
  extensions: ['pdf'],
  mimeTypes: ['application/pdf'],
  minBytes: 10 * KB,
  maxBytes: 300 * KB,
  rule: 'Verified e-Visa rule: PDF, 10–300 KB. Supporting documents must be in English.',
});

const afghanPhoto = {
  ...jpegPhoto,
  minBytes: null,
  maxBytes: null,
  square: false,
  rule: 'The Afghan portal requires a clear recent front-facing white-background photo; its current live size/format limits were not verifiable.',
};

const afghanPdf = (type, title, desc) => ({
  ...pdfDocument(type, title, desc),
  minBytes: null,
  maxBytes: null,
  rule: 'Required evidence is verified, but the Afghan portal’s current file limits were not verifiable. PDF is used as this demo’s safe document convention.',
});

const evisaPurposeDocs = {
  business: [pdfDocument('business_card', 'Business card', 'Applicant business card showing business identity and contact details.')],
  medical: [pdfDocument('hospital_letter', 'Indian hospital letter', 'Letter on the Indian hospital letterhead stating the treatment sought.')],
  'medical-attendant': [pdfDocument('hospital_letter', 'Patient hospital letter', 'Hospital letter linking the attendant to the principal patient.')],
  conference: [
    pdfDocument('conference_invitation', 'Conference invitation', 'Invitation from the conference organiser.'),
    pdfDocument('conference_clearance', 'Conference clearances', 'Applicable political/event clearances required for the selected conference.'),
  ],
  student: [
    pdfDocument('admission_letter', 'Admission letter', 'Admission evidence for the eligible e-Student course/institution.'),
    pdfDocument('financial_guardian_support', 'Financial / guardian support evidence', 'Evidence of financial support and, where applicable, the parent or guardian undertaking for the student.'),
  ],
  family: [pdfDocument('relationship_evidence', 'Relationship evidence', 'Evidence supporting the selected family/dependant category.')],
  transit: [pdfDocument('travel_itinerary', 'Confirmed onward itinerary', 'Travel evidence supporting the transit purpose.')],
  film: [pdfDocument('film_clearance', 'Film/project documents', 'Official project, permission, and production documents for the selected film purpose.')],
  'production-investment': [pdfDocument('production_investment_evidence', 'Production investment evidence', 'Project, investment, approval, and entity evidence required for the selected production-investment purpose.')],
  ayush: [pdfDocument('ayush_letter', 'AYUSH institution/hospital letter', 'Admission or treatment evidence for the selected AYUSH purpose.')],
};

const afghanPurposeDocs = (data) => {
  const category = data.visa_category;
  const purpose = data.afghan_purpose;
  if (category === 'business') {
    if (purpose === 'sports') return [
      afghanPdf('sports_invitation', 'Sports invitation and approvals', 'Invitation plus applicable sports authority approvals.'),
      afghanPdf('business_support', 'Organisation support letter', 'Signed support letter from the relevant organisation.'),
    ];
    if (purpose === 'business-dependant') return [afghanPdf('relationship_evidence', 'Relationship and principal-visa evidence', 'Evidence of relationship to the principal business applicant and their visa/application.')];
    return [
      afghanPdf('india_company_invitation', 'Indian company invitation', 'Invitation letter from the Indian company.'),
      afghanPdf('resident_company_letter', 'Resident-country company letter', 'Original signed company letter from the country of residence.'),
      afghanPdf('chamber_recommendation', 'Chamber recommendation', 'Recommendation from the Afghan or an Indian Chamber of Commerce.'),
    ];
  }
  if (category === 'student') {
    if (purpose === 'student-dependant') return [afghanPdf('relationship_evidence', 'Relationship and student evidence', 'Relationship evidence and the principal student’s admission/visa details.')];
    return [
      afghanPdf('admission_letter', 'Admission / returning-student letter', 'Admission or continuing-enrolment evidence from the Indian institution.'),
      afghanPdf('financial_support', 'Financial support evidence', 'Evidence of funds, sponsorship, or the applicable ICCR scholarship.'),
      afghanPdf('student_undertaking', 'Student undertaking', 'Completed undertaking required for the selected student purpose.'),
    ];
  }
  if (category === 'medical') return [afghanPdf('hospital_letter', 'System-generated hospital invitation', 'Invitation generated by the Indian hospital.'), ...(data.is_minor === 'yes' ? [afghanPdf('minor_consent', 'Parent or guardian consent', 'Consent for the minor patient.')] : [])];
  if (category === 'medical-attendant') return [afghanPdf('hospital_letter', 'Patient hospital invitation', 'Hospital-generated invitation linking the attendant to the principal patient.')];
  if (category === 'entry') return [afghanPdf('entry_purpose_evidence', 'Entry-purpose evidence', 'Evidence matching the selected Entry subtype, such as relationship, clearance, property, student, seaman, cultural, or itinerary records.')];
  if (category === 'un-diplomat') return [afghanPdf('un_diplomat_note', 'UN / diplomatic assignment evidence', 'Official note, assignment, visit, or dependant documentation for the selected subtype.')];
  return [];
};

export const getRequiredDocuments = (data = {}) => {
  const flow = data.application_type;
  if (flow === 'voa') return [];
  if (flow === 'afghan') {
    return [
      afghanPhoto,
      afghanPdf('passport', 'Passport bio page', 'Clear copy of the passport page containing personal particulars.'),
      afghanPdf('tazkira', 'National Identity Card (Tazkira)', 'Clear copy of the applicant’s Tazkira.'),
      ...afghanPurposeDocs(data),
    ];
  }
  if (flow === 'regular') {
    return [
      { ...afghanPhoto, type: 'photograph', title: 'Photograph copy for demo review', desc: 'Mission-specific physical photograph requirements must be checked before filing.', rule: 'Regular/paper visa specifications vary by mission; no universal upload limit is asserted here.' },
      { ...afghanPdf('passport', 'Passport bio page copy', 'Demo copy only. The original passport and mission-specific documents are handled outside this site.'), rule: 'Regular/paper visa supporting requirements vary by mission; no universal upload limit is asserted here.' },
      { ...afghanPdf('purpose_support', 'Purpose-specific supporting evidence', 'Evidence for the selected paper-visa category. Confirm the current checklist with the responsible Indian Mission/Post.'), rule: 'This is a demo completeness check, not a Government upload.' },
    ];
  }
  const evisaDocuments = [
    jpegPhoto,
    pdfDocument('passport', 'Passport bio page', 'PDF containing the passport page with personal particulars.'),
    ...(evisaPurposeDocs[data.visa_category] || []),
  ];
  if (data.visa_category === 'student' && data.student_course_type === 'medical-paramedical') {
    evisaDocuments.push(pdfDocument('medical_course_noc', 'Medical / paramedical course approval or NOC', 'Applicable Ministry of Health and Family Welfare approval or No Objection Certificate for the selected course.'));
  }
  return evisaDocuments;
};

const readImageDimensions = (file) => new Promise((resolve, reject) => {
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => {
    const result = { width: image.naturalWidth, height: image.naturalHeight };
    URL.revokeObjectURL(url);
    resolve(result);
  };
  image.onerror = () => {
    URL.revokeObjectURL(url);
    reject(new Error('The selected JPEG could not be read as an image.'));
  };
  image.src = url;
});

const validateFile = async (file, requirement) => {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  if (!requirement.extensions.includes(extension)) return `Choose a ${requirement.extensions.join(' or ').toUpperCase()} file.`;
  if (file.type && !requirement.mimeTypes.includes(file.type)) return `The file content type (${file.type}) does not match the required format.`;
  if (requirement.minBytes && file.size < requirement.minBytes) return `File must be at least ${Math.round(requirement.minBytes / KB)} KB.`;
  if (requirement.maxBytes && file.size > requirement.maxBytes) return `File must be no larger than ${requirement.maxBytes >= MB ? `${requirement.maxBytes / MB} MB` : `${requirement.maxBytes / KB} KB`}.`;
  if (requirement.square) {
    const dimensions = await readImageDimensions(file);
    if (dimensions.width !== dimensions.height) return `Photo must be square; selected image is ${dimensions.width} × ${dimensions.height}px.`;
    return { ...dimensions, extension };
  }
  return { extension };
};

export default function SmartDocuments() {
  const { state, addDocument, removeDocument } = useStore();
  const [errors, setErrors] = useState({});
  const requiredDocs = getRequiredDocuments(state.data);

  const handleDocument = async (event, requirement) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const validation = await validateFile(file, requirement);
      if (typeof validation === 'string') {
        setErrors((current) => ({ ...current, [requirement.type]: validation }));
        event.target.value = '';
        return;
      }
      addDocument(requirement.type, {
        extension: validation.extension,
        mimeType: file.type,
        size: file.size,
        width: validation.width,
        height: validation.height,
        selectedAt: new Date().toISOString(),
      });
      setErrors((current) => ({ ...current, [requirement.type]: null }));
    } catch (error) {
      setErrors((current) => ({ ...current, [requirement.type]: error.message }));
      event.target.value = '';
    }
  };

  if (state.data.application_type === 'voa') {
    return (
      <div className="border border-blue-200 bg-blue-50 p-5 rounded text-blue-950">
        <strong className="block mb-2">No online VoA document upload</strong>
        <p className="text-sm">This demo prepares Annexure I only. At the airport, carry the completed form, disembarkation card, eligible passport, onward/return ticket, and evidence of sufficient funds. A Visa Officer may request further evidence.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 p-4 rounded text-sm text-blue-950">
        <strong className="block mb-1">Purpose-aware demo checklist</strong>
        <p>Required for the selected <strong>{state.data.visa_category || 'unselected'}</strong> path. File bytes stay in your browser session and are not uploaded or saved; only non-sensitive validation metadata is stored locally.</p>
      </div>

      {requiredDocs.map((requirement) => {
        const remembered = state.docs.find((document) => document.type === requirement.type);
        const selected = remembered?.status === 'selected-this-session' ? remembered : null;
        const inputId = `document-${requirement.type}`;
        const ruleId = `${inputId}-rule`;
        const errorId = `${inputId}-error`;
        return (
          <div key={requirement.type} className={`border rounded p-5 ${selected ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white'}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex gap-4">
                <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${selected ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{selected ? '✓' : '○'}</div>
                <div>
                  <strong className="text-gray-900 text-lg block mb-1">{requirement.title}</strong>
                  <p className="text-gray-600 text-sm">{requirement.desc}</p>
                  <p id={ruleId} className="text-xs text-gray-500 mt-2">{requirement.rule}</p>
                  {selected && <p className="mt-2 text-sm text-green-800 font-bold">Selected locally · {selected.extension?.toUpperCase()} · {selected.size ? `${Math.round(selected.size / KB)} KB` : 'size rule unverified'}</p>}
                  {!selected && remembered?.status === 'needs-reselection' && <p className="mt-2 text-sm font-bold text-amber-800">Previously selected metadata found. Reselect the file because its contents were not stored.</p>}
                  {errors[requirement.type] && <p id={errorId} role="alert" className="mt-2 text-sm font-bold text-red-700">{errors[requirement.type]}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                {selected && <button type="button" onClick={() => removeDocument(requirement.type)} className="px-3 py-2 text-sm font-bold text-red-700 border border-red-200 rounded">Remove</button>}
                <input
                  id={inputId}
                  type="file"
                  className="sr-only peer"
                  accept={requirement.accepted}
                  aria-invalid={Boolean(errors[requirement.type])}
                  aria-describedby={`${ruleId}${errors[requirement.type] ? ` ${errorId}` : ''}`}
                  onChange={(event) => handleDocument(event, requirement)}
                />
                <label htmlFor={inputId} className="cursor-pointer whitespace-nowrap px-5 py-2 text-sm font-bold rounded bg-[#0b2540] text-white hover:bg-[#163a5f] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#0b2540]">
                  {selected ? 'Replace' : 'Choose file'}
                </label>
              </div>
            </div>
          </div>
        );
      })}

      <div className="border-l-4 border-amber-500 bg-amber-50 p-4 text-sm text-amber-950">
        Client checks improve feedback, but are not a security boundary. A production backend must re-check file signatures, size, dimensions/content, malware, language, category rules, and completeness before accepting anything.
      </div>
    </div>
  );
}

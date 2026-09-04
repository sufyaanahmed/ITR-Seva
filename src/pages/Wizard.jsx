import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContextHelp from '../components/ContextHelp';
import SmartDocuments, { getRequiredDocuments } from '../components/SmartDocuments';
import OfficialApplicationDossier from '../components/OfficialApplicationDossier';
import { EVISA_CATEGORIES } from '../data/visaEligibilityRules';
import { getEvisaWizardGate } from '../domain/visaEligibility';
import { useStore } from '../store';
import { syncSyntheticApplication } from '../api/showcaseBackend';

const field = (name, label, type = 'text', options = null, extra = {}) => ({ name, label, type, options, required: true, ...extra });
const yesNo = ['yes', 'no'];
const passportTypes = ['ordinary', 'diplomatic', 'official', 'service', 'other'];
const voaAirports = ['Bangalore', 'Chennai', 'Delhi', 'Hyderabad', 'Kolkata', 'Mumbai'];

const securityFields = [
  field('security_arrested', 'Have you ever been arrested, prosecuted, or convicted by a court?', 'select', yesNo),
  field('security_refused', 'Have you ever been refused entry, deported, or ordered to leave any country?', 'select', yesNo),
  field('security_offences', 'Have you been involved in trafficking, drugs, child abuse, or economic/financial offences?', 'select', yesNo),
  field('security_national_security', 'Have you been involved in cybercrime, terrorism, sabotage, espionage, genocide, political killing, or violence?', 'select', yesNo),
  field('security_advocacy', 'Have you advocated or supported terrorist violence?', 'select', yesNo),
  field('security_asylum', 'Have you sought asylum in any country?', 'select', yesNo),
  field('security_details', 'Details for every “Yes” answer', 'textarea', null, {
    required: (data) => Object.entries(data).some(([key, value]) => key.startsWith('security_') && key !== 'security_details' && value === 'yes'),
    visible: (data) => Object.entries(data).some(([key, value]) => key.startsWith('security_') && key !== 'security_details' && value === 'yes'),
  }),
];

const identityFields = [
  field('surname', 'Surname / family name exactly as in passport'),
  field('given_name', 'Given name(s) exactly as in passport'),
  field('previous_name_used', 'Have you used another name?', 'select', yesNo),
  field('previous_name', 'Previous name(s)', 'text', null, { visible: (data) => data.previous_name_used === 'yes' }),
  field('gender', 'Gender', 'select', ['female', 'male', 'non-binary', 'unspecified']),
  field('date_of_birth', 'Date of birth', 'date'),
  field('place_of_birth', 'Place of birth'),
  field('country_of_birth', 'Country of birth'),
  field('national_id', 'National identity number (enter NA only where the official form permits)'),
  field('religion', 'Religion'),
  field('visible_mark', 'Visible identification mark (or NA)'),
  field('education', 'Educational qualification'),
  field('nationality_acquisition', 'Nationality acquired by', 'select', ['birth', 'naturalisation']),
];

const passportFields = [
  field('passport_number', 'Passport number'),
  field('passport_issue_place', 'Place of issue'),
  field('passport_issue_date', 'Date of issue', 'date'),
  field('passport_expiry_date', 'Date of expiry', 'date'),
  field('other_passport', 'Do you hold another passport or identity certificate?', 'select', yesNo),
  field('other_passport_details', 'Other passport: country, number, issue place/date, nationality and status', 'textarea', null, { visible: (data) => data.other_passport === 'yes' }),
];

const addressFamilyFields = [
  field('present_address', 'Present residential address', 'textarea'),
  field('postal_code', 'Postal code'),
  field('phone_abroad', 'Contact number'),
  field('permanent_same', 'Permanent address is the same', 'select', yesNo),
  field('permanent_address', 'Permanent address', 'textarea', null, { visible: (data) => data.permanent_same === 'no' }),
  field('father_details', 'Father: name, current/previous nationality, place and country of birth', 'textarea'),
  field('mother_details', 'Mother: name, current/previous nationality, place and country of birth', 'textarea'),
  field('marital_status', 'Marital status', 'select', ['single', 'married', 'divorced', 'widowed', 'other']),
  field('spouse_details', 'Spouse: name, current/previous nationality, place and country of birth', 'textarea', null, { visible: (data) => data.marital_status === 'married' }),
  field('pakistan_origin', 'Were you, a parent, or grandparent born in or permanently resident in Pakistan / Pakistan-held territory?', 'select', yesNo),
  field('pakistan_origin_details', 'Pakistan-origin details', 'textarea', null, { visible: (data) => data.pakistan_origin === 'yes' }),
];

const employmentFields = [
  field('occupation', 'Present occupation'),
  field('designation', 'Designation / position'),
  field('employer_name', 'Employer or institution name'),
  field('employer_address', 'Employer or institution address', 'textarea'),
  field('employer_phone', 'Employer phone'),
  field('security_service_employment', 'Have you served in military, police, or a security organisation?', 'select', yesNo),
  field('security_service_details', 'Organisation, designation, rank, place, and service dates', 'textarea', null, { visible: (data) => data.security_service_employment === 'yes' }),
];

const historyReferenceFields = [
  field('places_to_visit', 'Places to visit in India'),
  field('places_to_visit_second', 'Additional places to visit', 'text', null, { required: false }),
  field('tour_operator_used', 'Is this arranged through a hotel or tour operator?', 'select', yesNo),
  field('tour_operator_details', 'Hotel / tour operator name, address and contact', 'textarea', null, { visible: (data) => data.tour_operator_used === 'yes' }),
  field('intended_exit_port', 'Intended exit port'),
  field('visited_india_before', 'Have you visited India before?', 'select', yesNo),
  field('previous_india_details', 'Previous India address, cities, visa number/type, issue place/date', 'textarea', null, { visible: (data) => data.visited_india_before === 'yes' }),
  field('india_refused_before', 'Have you been refused permission to visit India or extend a stay?', 'select', yesNo),
  field('india_refusal_details', 'Refusal / extension-denial details', 'textarea', null, { visible: (data) => data.india_refused_before === 'yes' }),
  field('countries_visited_10y', 'Countries visited in the last 10 years (or None)'),
  field('visited_saarc', 'Visited another SAARC country in the last 3 years?', 'select', yesNo),
  field('saarc_details', 'SAARC country, year, and number of visits', 'textarea', null, { visible: (data) => data.visited_saarc === 'yes' }),
  field('india_reference', 'Reference in India: name, address, and phone', 'textarea'),
  field('home_reference', 'Reference in home country: name, address, and phone', 'textarea'),
];

const afghanPurposes = {
  business: ['business-venture-investor', 'other-business', 'sports', 'business-dependant'],
  student: ['iccr-scholarship', 'new-structured-study', 'returning-student', 'student-dependant'],
  medical: ['patient'],
  'medical-attendant': ['accompanying-patient'],
  entry: ['cultural-visit', 'minor-with-patient', 'indian-pio-oci-family', 'property-owner', 'official-dependant', 'student-guardian', 'dependent-parent-of-student', 'seaman', 'pio-without-oci-family', 'minority-community-visit'],
  'un-diplomat': ['assigned-to-india', 'visiting-india', 'dependant-of-assigned-diplomat', 'dependant-of-visiting-diplomat'],
};

const makeEvisaSteps = () => [
  { id: 'registration', title: 'Registration & route', description: 'This creates a local temporary demo reference. It is not a Government application ID.', fields: [
    field('nationality', 'Passport nationality (from reviewed Finder result)', 'text', null, { readOnly: true }),
    field('passport_type', 'Passport type', 'select', passportTypes),
    field('arrival_port', 'Designated arrival checkpoint (reviewed reference selection needed)', 'text', null, { help: 'The official portal published inconsistent checkpoint counts during review. Verify the current live list; this demo does not assert that arbitrary text is eligible.' }),
    field('email', 'Email address', 'email'),
    field('confirm_email', 'Re-enter email address', 'email'),
    field('expected_arrival_date', 'Expected arrival date', 'date'),
    field('visa_category', 'e-Visa service / purpose (from reviewed Finder result)', 'select', EVISA_CATEGORIES, { readOnly: true }),
    field('student_course_type', 'e-Student course type', 'select', ['general-course', 'medical-paramedical'], { visible: (data) => data.visa_category === 'student', help: 'Medical and paramedical courses can require an additional Ministry approval or NOC.' }),
    field('instructions_ready', 'I have reviewed current official eligibility and have the required documents', 'checkbox'),
  ] },
  { id: 'identity', title: 'Identity', fields: [...identityFields, field('resident_two_years', 'Have you lived in the application country for at least two years?', 'select', yesNo)] },
  { id: 'passport', title: 'Passport', fields: passportFields },
  { id: 'family', title: 'Address & family', fields: addressFamilyFields },
  { id: 'employment', title: 'Employment', fields: employmentFields },
  { id: 'travel', title: 'Travel, history & references', fields: historyReferenceFields },
  { id: 'security', title: 'Security questions', fields: securityFields },
  { id: 'documents', title: 'Photo & documents', description: 'Please ensure your photograph is a square JPEG (10 KB – 1 MB). All other supporting documents must be in PDF format (10 KB – 300 KB) and in English.' },
  { id: 'review', title: 'Review & demo finality' },
];

const makeAfghanSteps = (data) => [
  { id: 'afghan-route', title: 'Afghan category & purpose', description: 'Dedicated Afghan online visa/ETA route. The live form was unavailable during audit, so unpublished fields and file limits are not invented.', fields: [
    field('nationality', 'Nationality', 'text', null, { readOnly: true }),
    field('passport_type', 'Passport type', 'select', passportTypes, { help: 'Diplomatic-passport edge cases need verification; UN Diplomat is a visa category, not a passport type.' }),
    field('visa_category', 'Afghan visa category', 'select', ['business', 'student', 'medical', 'medical-attendant', 'entry', 'un-diplomat']),
    field('afghan_purpose', 'Official category purpose / subtype', 'select', afghanPurposes[data.visa_category] || []),
    field('email', 'Email address', 'email'),
  ] },
  { id: 'identity', title: 'Applicant identity', fields: [...identityFields, field('tazkira_number', 'Tazkira number')] },
  { id: 'passport', title: 'Passport', fields: passportFields },
  { id: 'family', title: 'Address & family', fields: addressFamilyFields },
  { id: 'employment', title: 'Employment / study context', fields: employmentFields },
  { id: 'travel', title: 'Travel & references', fields: [
    field('expected_arrival_date', 'Expected arrival date', 'date'),
    field('places_to_visit', 'Places to visit in India'),
    field('address_in_india', 'Address in India', 'textarea'),
    field('india_reference', 'Reference in India: name, address and phone', 'textarea'),
    field('home_reference', 'Reference in Afghanistan / residence country: name, address and phone', 'textarea'),
    field('principal_applicant_id', 'Principal patient/student/business applicant reference', 'text', null, {
      required: (values) => values.visa_category === 'medical-attendant' || ['business-dependant', 'student-dependant'].includes(values.afghan_purpose),
      visible: (values) => values.visa_category === 'medical-attendant' || ['business-dependant', 'student-dependant'].includes(values.afghan_purpose),
    }),
    field('is_minor', 'Is the applicant a minor?', 'select', yesNo),
  ] },
  { id: 'security', title: 'Security declarations', fields: securityFields },
  { id: 'documents', title: 'Required evidence', description: 'Upload a clear photograph (JPEG/JPG) and all required supporting documents in PDF format.' },
  { id: 'review', title: 'Final review' },
];

const makeVoaSteps = () => [

  { id: 'voa-applicant', title: 'Annexure I — applicant', fields: [
    field('surname', 'Surname / family name'),
    field('given_name', 'Given name(s)'),
    field('date_of_birth', 'Date of birth', 'date'),
    field('previous_nationality', 'Previous nationality (or NA)'),
    field('dual_nationality', 'Do you hold another nationality?', 'select', yesNo),
    field('dual_nationality_details', 'Other / dual nationality details', 'textarea', null, { visible: (data) => data.dual_nationality === 'yes' }),
    field('marital_status', 'Marital status', 'select', ['single', 'married', 'divorced', 'widowed', 'other']),
    field('father_details', 'Father name and nationality', 'textarea'),
    field('mother_details', 'Mother name and nationality', 'textarea'),
    field('spouse_details', 'Spouse name and nationality', 'textarea', null, { visible: (data) => data.marital_status === 'married' }),
    field('occupation', 'Occupation'),
  ] },
  { id: 'voa-passport', title: 'Annexure I — passport & contacts', fields: [
    field('passport_number', 'Passport number'),
    field('passport_expiry_date', 'Passport expiry date', 'date'),
    field('permanent_address', 'Permanent address abroad', 'textarea'),
    field('email', 'Email address', 'email'),
    field('phone_abroad', 'Contact number abroad'),
    field('address_in_india', 'Address in India', 'textarea'),
    field('phone_india', 'Contact number in India'),
    field('india_reference', 'Reference in India: name, address and phone', 'textarea'),
  ] },
  { id: 'voa-travel', title: 'Annexure I — travel', fields: [
    field('arrival_date', 'Arrival date', 'date'),
    field('arrival_flight', 'Arrival flight number'),
    field('arrival_port', 'Designated arrival airport', 'select', voaAirports),
    field('onward_date', 'Return / onward date', 'date'),
    field('onward_flight', 'Return / onward flight number'),
    field('final_destination', 'Final destination'),
  ] },
  { id: 'voa-declaration', title: 'Annexure I — declaration', description: 'The generated copy must still be printed and signed for presentation to the Visa Officer.', fields: [
    field('declaration_place', 'Place of declaration'),
    field('declaration_date', 'Date of declaration', 'date'),
    field('typed_name', 'Applicant name for the prepared form'),
    field('voa_truthful', 'I declare that these details are true and complete', 'checkbox'),
    field('voa_airport_process', 'I understand this prepares a form only; a Visa Officer assesses the request at the airport', 'checkbox'),
    field('voa_nonextendable', 'I understand a granted VoA is non-extendable and non-convertible', 'checkbox'),
  ] },
  { id: 'review', title: 'Review & print preparation' },
];

const makeRegularSteps = () => [
  { id: 'regular-route', title: 'Paper visa route', description: 'This prepares a local checklist. Category, appointment, documents, biometrics, fees, and physical filing depend on the responsible Indian Mission/Post.', fields: [
    field('nationality', 'Passport nationality'),
    field('country_of_application', 'Country / mission where applying'),
    field('passport_type', 'Passport type', 'select', passportTypes),
    field('visa_category', 'Paper visa category', 'select', ['tourist', 'business', 'employment', 'student', 'medical', 'conference', 'entry', 'transit', 'research', 'other']),
    field('email', 'Email address', 'email'),
  ] },
  { id: 'identity', title: 'Identity', fields: identityFields },
  { id: 'passport', title: 'Passport', fields: passportFields },
  { id: 'family', title: 'Address, family & employment', fields: [...addressFamilyFields, ...employmentFields] },
  { id: 'travel', title: 'Travel & references', fields: [field('expected_arrival_date', 'Expected arrival date', 'date'), ...historyReferenceFields] },
  { id: 'security', title: 'Security declarations', fields: securityFields },
  { id: 'documents', title: 'Demo document readiness', description: 'Mission-specific photograph and document requirements vary. Typically, a recent passport-sized photograph (JPEG) and supporting PDFs are required.' },
  { id: 'review', title: 'Review & print handoff' },
];

const getSteps = (type, data) => {
  if (type === 'afghan') return makeAfghanSteps(data);
  if (type === 'voa') return makeVoaSteps();
  if (type === 'regular') return makeRegularSteps();
  return makeEvisaSteps();
};

const isVisible = (item, data) => !item.visible || item.visible(data);
const isRequired = (item, data) => isVisible(item, data) && (typeof item.required === 'function' ? item.required(data) : item.required !== false);

const validateStep = (step, data, docs) => {
  const errors = {};
  (step.fields || []).filter((item) => isVisible(item, data)).forEach((item) => {
    const value = data[item.name];
    if (isRequired(item, data) && (item.type === 'checkbox' ? value !== true : String(value ?? '').trim() === '')) errors[item.name] = 'This field is required.';
    if (item.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())) errors[item.name] = 'Enter a complete email address.';
    if (item.type === 'date' && value && !/^\d{4}-\d{2}-\d{2}$/.test(String(value))) errors[item.name] = 'Enter a valid calendar date.';
    if (item.name.includes('phone') && value) {
      const phone = String(value).trim();
      const digitCount = phone.replace(/\D/g, '').length;
      if (!/^\+?[0-9][0-9 ()-]*$/.test(phone) || digitCount < 7 || digitCount > 20) errors[item.name] = 'Enter a valid phone number using 7–20 digits and common separators.';
    }
  });

  if (data.email && data.confirm_email && String(data.email).trim().toLowerCase() !== String(data.confirm_email).trim().toLowerCase()) errors.confirm_email = 'Email addresses must match.';
  const today = new Date().toISOString().slice(0, 10);
  if (data.date_of_birth && data.date_of_birth >= today) errors.date_of_birth = 'Date of birth must be in the past.';
  if (data.passport_issue_date && data.passport_issue_date > today) errors.passport_issue_date = 'Passport issue date cannot be in the future.';
  if (data.passport_issue_date && data.passport_expiry_date && data.passport_expiry_date <= data.passport_issue_date) errors.passport_expiry_date = 'Passport expiry date must be after its issue date.';
  if (data.expected_arrival_date && data.passport_expiry_date && data.passport_expiry_date <= data.expected_arrival_date) errors.passport_expiry_date = 'Passport must remain valid after the expected arrival date.';
  if (step.id === 'documents') {
    const missing = getRequiredDocuments(data).filter((requirement) => !docs.some((document) => document.type === requirement.type && document.status === 'selected-this-session'));
    if (missing.length) errors.documents = `Select every required item before continuing: ${missing.map((item) => item.title).join(', ')}.`;
  }
  if (step.id === 'registration') {
    if (data.passport_type && data.passport_type !== 'ordinary') errors.passport_type = 'The published e-Visa route excludes Diplomatic, Official, Service, and other non-ordinary travel documents.';
    if (['afghanistan', 'pakistan'].includes(String(data.nationality || '').trim().toLowerCase())) errors.nationality = 'This nationality must use a different official route.';
    if (data.expected_arrival_date) {
      const arrival = new Date(`${data.expected_arrival_date}T00:00:00`);
      const earliest = new Date();
      earliest.setHours(0, 0, 0, 0);
      earliest.setDate(earliest.getDate() + 4);
      const latest = new Date();
      latest.setHours(0, 0, 0, 0);
      latest.setDate(latest.getDate() + 120);
      if (arrival < earliest || arrival > latest) errors.expected_arrival_date = 'Choose a date within the published e-Visa application window (at least 4 days and no more than 120 days ahead).';
    }
  }
  if (step.id === 'family' && data.application_type === 'evisa' && data.pakistan_origin === 'yes') errors.pakistan_origin = 'Pakistani-origin cases require the appropriate regular/paper visa route.';
  if (step.id === 'afghan-route' && data.passport_type && data.passport_type !== 'ordinary') errors.passport_type = 'This passport-type edge case requires confirmation with the official portal or Indian authority before using this demo path.';

  if (step.id === 'voa-travel' && data.passport_expiry_date && data.arrival_date) {
    const expiry = new Date(`${data.passport_expiry_date}T00:00:00`);
    const arrival = new Date(`${data.arrival_date}T00:00:00`);
    arrival.setMonth(arrival.getMonth() + 6);
    if (expiry < arrival) errors.arrival_date = 'The passport must remain valid for at least six months after arrival for the Visa on Arrival route.';
    if (data.onward_date && data.onward_date < data.arrival_date) errors.onward_date = 'Onward date cannot be before arrival.';
  }
  if (step.id === 'review') {
    const missing = getRequiredDocuments(data).filter((requirement) => !docs.some((document) => document.type === requirement.type && document.status === 'selected-this-session'));
    if (missing.length) errors.review_accuracy = `Required document selections changed or are missing: ${missing.map((item) => item.title).join(', ')}.`;
    if (!data.review_accuracy) errors.review_accuracy = 'Confirm that you reviewed the prepared details.';

  }
  return errors;
};

const demoFixture = (type, current) => {
  const futureDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  };
  const common = {
    surname: 'EXAMPLE', given_name: 'DEMO APPLICANT', date_of_birth: '1992-05-14', previous_name_used: 'no', gender: 'unspecified',
    place_of_birth: 'Example City', country_of_birth: type === 'afghan' ? 'Afghanistan' : 'Canada', national_id: 'DEMO-ONLY', religion: 'Not specified', visible_mark: 'NA', education: 'Graduate', nationality_acquisition: 'birth',
    passport_number: 'DEMO-P000001', passport_issue_place: 'Example City', passport_issue_date: '2024-01-15', passport_expiry_date: '2034-01-14', other_passport: 'no',
    present_address: '100 Example Street, Demo City', postal_code: '000000', phone_abroad: '+10000000000', permanent_same: 'yes',
    father_details: 'Demo Parent One; Example nationality; Example City', mother_details: 'Demo Parent Two; Example nationality; Example City', marital_status: 'single', pakistan_origin: 'no',
    occupation: 'Software tester', designation: 'Test analyst', employer_name: 'Example Demonstration Organisation', employer_address: '200 Sample Road, Demo City', employer_phone: '+10000000001', security_service_employment: 'no',
    places_to_visit: 'Delhi and Agra', tour_operator_used: 'no', intended_exit_port: 'Delhi', visited_india_before: 'no', india_refused_before: 'no', countries_visited_10y: 'None', visited_saarc: 'no',
    india_reference: 'Demo Hotel, Example Road, Delhi; +910000000000', home_reference: 'Demo Contact, 100 Example Street; +10000000002',
    security_arrested: 'no', security_refused: 'no', security_offences: 'no', security_national_security: 'no', security_advocacy: 'no', security_asylum: 'no',
    email: 'demo.applicant@example.invalid', confirm_email: 'demo.applicant@example.invalid', expected_arrival_date: futureDate(45), instructions_ready: true, resident_two_years: 'yes',
  };
  if (type === 'voa') return {
    application_type: 'voa', nationality: current.nationality || 'Japan', visa_category: current.visa_category || 'tourism', intended_stay_days: current.intended_stay_days || '14', passport_type: current.passport_type || 'ordinary', no_india_residence_occupation: true, onward_ticket_confirmed: true, sufficient_funds_confirmed: true,
    uae_previous_indian_visa: current.uae_previous_indian_visa || (current.nationality === 'United Arab Emirates' ? 'yes' : 'not_applicable'),
    pakistan_origin: 'no', persona_non_grata: 'no', undesirable_person: 'no', surname: 'EXAMPLE', given_name: 'DEMO TRAVELLER', date_of_birth: '1992-05-14', previous_nationality: 'NA', dual_nationality: 'no', marital_status: 'single',
    father_details: 'DEMO PARENT ONE; JAPAN', mother_details: 'DEMO PARENT TWO; JAPAN', occupation: 'Designer', passport_number: 'DEMO-JP0001', passport_expiry_date: '2034-01-14', permanent_address: '100 Example Street, Tokyo',
    email: 'demo.traveller@example.invalid', phone_abroad: '+81000000000', address_in_india: 'Demo Hotel, Delhi', phone_india: '+910000000000', india_reference: 'Demo Hotel, Example Road, Delhi; +910000000000',
    arrival_date: futureDate(45), arrival_flight: 'DEMO101', arrival_port: 'Delhi', onward_date: futureDate(59), onward_flight: 'DEMO102', final_destination: 'Tokyo', declaration_place: 'Tokyo', declaration_date: futureDate(1), typed_name: 'DEMO TRAVELLER', voa_truthful: true, voa_airport_process: true, voa_nonextendable: true,
  };
  if (type === 'afghan') {
    const category = current.visa_category || 'medical';
    const purpose = current.afghan_purpose || afghanPurposes[category]?.[0] || '';
    return {
      ...common,
      application_type: 'afghan',
      nationality: 'Afghanistan',
      passport_type: current.passport_type || 'ordinary',
      visa_category: category,
      afghan_purpose: purpose,
      tazkira_number: 'DEMO-TAZKIRA-001',
      address_in_india: 'Demo Hospital Guest House, Delhi',
      principal_applicant_id: category === 'medical-attendant' || ['business-dependant', 'student-dependant'].includes(purpose) ? 'DEMO-PRINCIPAL-001' : current.principal_applicant_id,
      is_minor: 'no',
    };
  }
  if (type === 'regular') return { ...common, application_type: 'regular', nationality: 'Canada', country_of_application: 'Canada', passport_type: 'ordinary', visa_category: 'employment' };
  return {
    ...common,
    application_type: 'evisa',
    nationality: current.nationality || 'Canada',
    passport_type: current.passport_type || 'ordinary',
    arrival_port: current.arrival_port || 'Delhi Airport',
    visa_category: current.visa_category || 'tourist',
    student_course_type: current.visa_category === 'student' ? (current.student_course_type || 'general-course') : current.student_course_type,
    eligibility_ruleset_id: current.eligibility_ruleset_id,
    eligibility_reviewed_date: current.eligibility_reviewed_date,
    purpose_intent: current.purpose_intent,
    intended_stay_days: current.intended_stay_days,
    study_in_india_institution: current.study_in_india_institution,
  };
};

export default function Wizard() {
  const { state, updateState, updateData, completeDemo } = useStore();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [backendSync, setBackendSync] = useState({ status: 'idle', message: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const stepHeadingRef = useRef(null);
  const errorSummaryRef = useRef(null);
  const previousStepRef = useRef(state.step);
  const appType = ['evisa', 'afghan', 'voa', 'regular'].includes(state.data.application_type) ? state.data.application_type : 'evisa';
  const steps = getSteps(appType, state.data);
  const stepIndex = Math.min(state.step, steps.length - 1);
  const step = steps[stepIndex];

  useEffect(() => {
    if (state.step !== stepIndex) updateState({ step: stepIndex });
  }, [state.step, stepIndex]);

  useEffect(() => {
    if (previousStepRef.current === stepIndex) return;
    previousStepRef.current = stepIndex;
    stepHeadingRef.current?.focus({ preventScroll: true });
  }, [stepIndex]);

  const evisaGate = appType === 'evisa' ? getEvisaWizardGate(state.data) : { allowed: true, reason: null };
  const evisaRouteBlocked = !evisaGate.allowed;

  if (evisaRouteBlocked) {
    const studyGateMissing = evisaGate.reason === 'study-in-india-required';
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white border border-amber-300 shadow-sm rounded mt-12">
        <p className="text-sm font-bold uppercase tracking-widest text-amber-700 mb-3">Eligibility check required</p>
        <h1 className="text-3xl font-bold mb-4">Return to the Visa Finder</h1>
        <p className="text-text-secondary mb-6">{studyGateMissing
          ? 'The e-Student journey requires confirmation that the admitting institution is registered on the Government Study in India programme.'
          : evisaGate.reason === 'unsupported-category'
            ? 'The saved category is not supported by the current reviewed ruleset. Run the Finder again instead of continuing with stale or invented category data.'
            : 'A current reviewed route-finder result is required before the standard e-Visa demo can start. Opening /apply directly cannot establish eligibility.'}</p>
        <button type="button" onClick={() => navigate('/guide/visa-finder')} className="btn-primary">Check preliminary eligibility</button>
      </div>
    );
  }

  if (state.submitted) {
    return <OfficialApplicationDossier state={state} />;
  }

  const handleNext = async (event) => {
    event.preventDefault();
    const found = validateStep(step, state.data, state.docs);
    setErrors(found);
    if (Object.keys(found).length) {
      window.requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }
    if (stepIndex < steps.length - 1) {
      updateState({ step: stepIndex + 1 });
      window.scrollTo(0, 0);
    } else {
      setBackendSync({ status: 'saving', message: 'Committing the synthetic record to the self-hosted backend…' });
      try {
        const backendRecord = await syncSyntheticApplication({
          data: state.data,
          documents: state.docs,
          attemptId: state.identifiers?.temporaryDemoId,
        });
        completeDemo(appType === 'voa' ? 'voa-form' : 'application-preparation', backendRecord);
        setBackendSync({ status: 'saved', message: backendRecord ? 'Synthetic record committed.' : 'Backend sync is disabled.' });
      } catch (error) {
        setBackendSync({
          status: 'error',
          message: `${error.message}${error.retryable ? ' Retry will reuse the same completion key.' : ''}`,
        });
      }
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setErrors({});
      updateState({ step: stepIndex - 1 });
      setMobileMenuOpen(false);
      window.scrollTo(0, 0);
    }
  };

  const jumpToStep = (index) => {
    if (index <= stepIndex && index !== stepIndex) {
      setErrors({});
      updateState({ step: index });
      setMobileMenuOpen(false);
      window.scrollTo(0, 0);
    }
  };

  const fillDemoData = () => {
    const fixture = demoFixture(appType, state.data);
    Object.entries(fixture).forEach(([name, value]) => updateData(name, value));
    setErrors({});
  };

  const renderField = (item) => {
    if (!isVisible(item, state.data)) return null;
    const required = isRequired(item, state.data);
    const value = state.data[item.name] ?? (item.type === 'checkbox' ? false : '');
    const classes = `input-field w-full ${errors[item.name] ? 'border-red-500' : ''}`;
    const errorId = `${item.name}-error`;
    return (
      <div key={item.name} className={item.type === 'checkbox' ? 'max-w-2xl' : 'max-w-xl'}>
        {item.type === 'checkbox' ? (
          <label htmlFor={item.name} className="flex gap-3 items-start font-medium text-gray-900">
            <input id={item.name} type="checkbox" className="mt-1 h-4 w-4" checked={value === true} aria-invalid={Boolean(errors[item.name])} aria-describedby={errors[item.name] ? errorId : undefined} onChange={(event) => updateData(item.name, event.target.checked)} />
            <span>{item.label}{required && <span className="text-red-600 ml-1">*</span>}</span>
          </label>
        ) : (
          <>
            <label htmlFor={item.name} className="block font-bold mb-1 text-gray-900">{item.label}{required && <span className="text-red-600 ml-1">*</span>}{item.help && <ContextHelp text={item.help} />}</label>
            {item.type === 'select' ? (
              <select id={item.name} required={required} className={classes} value={value} aria-invalid={Boolean(errors[item.name])} aria-describedby={errors[item.name] ? errorId : undefined} onChange={(event) => updateData(item.name, event.target.value)} disabled={item.readOnly}>
                <option value="">Choose an option</option>
                {(item.options || []).map((option) => <option key={option} value={option}>{String(option).replace(/-/g, ' ')}</option>)}
              </select>
            ) : item.type === 'textarea' ? (
              <textarea id={item.name} required={required} className={classes} rows="3" value={value} aria-invalid={Boolean(errors[item.name])} aria-describedby={errors[item.name] ? errorId : undefined} onChange={(event) => updateData(item.name, event.target.value)} readOnly={item.readOnly} />
            ) : (
              <input id={item.name} type={item.type} required={required} className={classes} value={value} aria-invalid={Boolean(errors[item.name])} aria-describedby={errors[item.name] ? errorId : undefined} onChange={(event) => updateData(item.name, event.target.value)} readOnly={item.readOnly} min={item.type === 'number' ? 1 : undefined} />
            )}
          </>
        )}
        {errors[item.name] && <p id={errorId} className="text-sm text-red-700 font-bold mt-1">{errors[item.name]}</p>}
      </div>
    );
  };

  const progressPercent = Math.round(((stepIndex + 1) / steps.length) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 mb-16">
      {/* ── MOBILE / TABLET COMPACT STEP BAR (< 1024px) ── */}
      <div className="lg:hidden mb-6 bg-white border border-border rounded-lg shadow-sm overflow-hidden sticky top-2 z-30">
        <div className="p-3.5 sm:p-4 flex items-center justify-between border-b border-border bg-slate-50/75">
          <div className="pr-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C4762A] block mb-0.5">
              Step {stepIndex + 1} of {steps.length} ({progressPercent}%)
            </span>
            <h2 className="text-sm sm:text-base font-serif font-bold text-gray-900 leading-tight truncate max-w-[220px] sm:max-w-xs">
              {step.title}
            </h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={fillDemoData}
              className="text-[11px] bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 font-bold rounded hover:bg-amber-100 transition-colors"
            >
              Demo Fill
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-1 text-xs font-bold text-[#1E2A4F] bg-white border border-border px-2.5 py-1 rounded shadow-xs hover:bg-slate-50 transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-wizard-steps"
            >
              <span>{mobileMenuOpen ? 'Close' : 'Steps'}</span>
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Continuous progress line */}
        <div className="w-full bg-gray-100 h-1.5">
          <div
            className="bg-[#1E2A4F] h-1.5 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Expandable step list sheet */}
        {mobileMenuOpen && (
          <nav id="mobile-wizard-steps" aria-label="Mobile application preparation steps" className="p-3 bg-white divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {steps.map((item, index) => {
              const isCompleted = index < stepIndex;
              const isCurrent = index === stepIndex;
              const isClickable = index <= stepIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={!isClickable}
                  onClick={() => jumpToStep(index)}
                  className={`w-full text-left py-2.5 px-2 flex items-center justify-between text-xs transition-colors rounded ${
                    isCurrent
                      ? 'bg-slate-100 font-bold text-[#1E2A4F]'
                      : isCompleted
                        ? 'text-gray-700 hover:bg-slate-50 cursor-pointer'
                        : 'text-gray-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCompleted
                        ? 'bg-[#176B45] text-white'
                        : isCurrent
                          ? 'bg-[#1E2A4F] text-white'
                          : 'bg-gray-200 text-gray-600'
                    }`}>
                      {isCompleted ? '✓' : index + 1}
                    </span>
                    <span>{item.title}</span>
                  </div>
                  {isCurrent && <span className="text-[10px] font-bold text-[#C4762A] uppercase">Active</span>}
                </button>
              );
            })}
          </nav>
        )}
      </div>

      {/* ── 2-COLUMN MASTER-DETAIL CONTAINER (DESKTOP & MOBILE WRAPPER) ── */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* ── DESKTOP VERTICAL STEPPER SIDEBAR (≥ 1024px) ── */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-6 bg-white border border-border rounded-lg shadow-sm overflow-hidden" aria-label="Application progress">
          <div className="p-5 border-b border-border bg-slate-50/75">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#C4762A]">
                Step {stepIndex + 1} of {steps.length}
              </span>
              <span className="text-xs font-bold text-gray-600 font-mono">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#1E2A4F] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Vertical Step Timeline */}
          <nav aria-label="Application preparation steps" className="p-4">
            <ol className="relative border-l-2 border-gray-200 ml-3 space-y-5 my-2">
              {steps.map((item, index) => {
                const isCompleted = index < stepIndex;
                const isCurrent = index === stepIndex;
                const isClickable = index <= stepIndex;
                return (
                  <li key={item.id} className="relative pl-6" aria-current={isCurrent ? 'step' : undefined}>
                    <span className={`absolute -left-[11px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors ${
                      isCompleted
                        ? 'bg-[#176B45] border-[#176B45] text-white'
                        : isCurrent
                          ? 'bg-[#1E2A4F] border-[#1E2A4F] text-white shadow-sm ring-4 ring-blue-100'
                          : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      {isCompleted ? '✓' : index + 1}
                    </span>
                    {isClickable ? (
                      <button
                        type="button"
                        onClick={() => jumpToStep(index)}
                        className={`text-left text-xs font-sans transition-colors block w-full focus:outline-none hover:text-primary ${
                          isCurrent
                            ? 'font-bold text-[#1E2A4F] text-sm'
                            : 'text-gray-600'
                        }`}
                      >
                        {item.title}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 font-sans block cursor-not-allowed">
                        {item.title}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* Sidebar Footer Metadata & Demo Action */}
          <div className="p-4 border-t border-border bg-slate-50/50 space-y-3">
            <div className="text-[11px] text-gray-600">
              <span className="block font-bold text-gray-700 uppercase tracking-wider text-[10px] mb-0.5">Reference ID</span>
              <span className="font-mono text-xs text-[#1E2A4F] break-all font-semibold">{state.identifiers?.temporaryDemoId}</span>
            </div>
            <button
              type="button"
              onClick={fillDemoData}
              className="w-full text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 py-2 px-3 font-bold rounded transition-colors text-center shadow-2xs"
            >
              Fill synthetic demo data
            </button>
          </div>
        </aside>

        {/* ── RIGHT MAIN FORM CANVAS ── */}
        <main className="flex-1 w-full bg-white p-6 md:p-10 border border-border rounded-lg shadow-sm">
          <div className="mb-8 border-b border-border pb-6">
            <div className="flex flex-wrap justify-between items-end gap-4 mb-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-1">Independent Demo · Not an official portal</p>
                <h1 ref={stepHeadingRef} tabIndex="-1" className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 focus:outline-none">{step.title}</h1>
              </div>
              <div className="hidden sm:block text-right">
                <span className="text-xs font-bold text-text-secondary uppercase tracking-widest block">Step {stepIndex + 1} of {steps.length}</span>
              </div>
            </div>

            <div className="lg:hidden mt-3 bg-slate-50 border border-slate-200 p-2.5 rounded text-xs text-slate-700">
              <strong>Temporary local demo reference:</strong> <span className="font-mono text-[11px]">{state.identifiers?.temporaryDemoId}</span>
            </div>
          </div>

          {step.description && <p className="text-text-secondary text-sm sm:text-base mb-8 pb-4 border-b border-border leading-relaxed">{step.description}</p>}

          <form onSubmit={handleNext} noValidate>
            {backendSync.status === 'error' && (
              <div role="alert" className="mb-8 border-l-4 border-red-600 bg-red-50 p-5 text-red-950">
                <strong className="block mb-1">The self-hosted backend did not accept the demo record</strong>
                <p className="text-sm">{backendSync.message}</p>
              </div>
            )}
            {Object.keys(errors).length > 0 && (
              <div ref={errorSummaryRef} tabIndex="-1" role="alert" aria-labelledby="wizard-error-heading" className="mb-8 border-l-4 border-red-600 bg-red-50 p-5 text-red-950 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-red-700">
                <h2 id="wizard-error-heading" className="font-bold text-lg mb-2">Check this step before continuing</h2>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {Object.entries(errors).map(([name, message]) => {
                    const label = (step.fields || []).find((item) => item.name === name)?.label
                      || ({ documents: 'Required documents', review_accuracy: 'Review confirmation' })[name]
                      || name.replace(/_/g, ' ');
                    return <li key={name}><a href={`#${name}`} className="font-bold underline">{label}: {message}</a></li>;
                  })}
                </ul>
              </div>
            )}
            {step.fields && <div className="space-y-6">{step.fields.map(renderField)}</div>}
            {step.id === 'documents' && <div id="documents" tabIndex="-1" aria-invalid={Boolean(errors.documents)} aria-describedby={errors.documents ? 'documents-error' : undefined} className="mb-8"><SmartDocuments />{errors.documents && <p id="documents-error" className="mt-4 text-sm font-bold text-red-700">{errors.documents}</p>}</div>}
            {step.id === 'review' && (
              <div className="space-y-6">
                <div className="border border-amber-300 bg-amber-50 p-4 rounded text-sm text-amber-950">
                  <strong className="block mb-1">Review your details</strong>
                  Please ensure all information is accurate before proceeding.
                </div>
                <div className="bg-background p-6 rounded text-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(state.data).filter(([key]) => !['demo_only'].includes(key)).map(([key, value]) => (
                    <div key={key} className="border-b border-border pb-2"><span className="block text-text-secondary text-xs uppercase mb-1">{key.replace(/_/g, ' ')}</span><strong className="break-words">{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || '-'}</strong></div>
                  ))}
                  {state.docs.map((document) => <div key={document.type} className="border-b border-border pb-2"><span className="block text-text-secondary text-xs uppercase mb-1">Document: {document.type.replace(/_/g, ' ')}</span><strong>{document.extension?.toUpperCase()} · {document.status === 'selected-this-session' ? 'validated this session' : 'reselection required'}</strong></div>)}
                </div>
                <div className="space-y-4">
                  {renderField(field('review_accuracy', 'I reviewed every prepared field and document status for accuracy', 'checkbox'))}
                </div>
              </div>
            )}

            <div className="mt-12 flex gap-4 pt-6 border-t border-border">
              {stepIndex > 0 && <button type="button" onClick={handleBack} className="btn-secondary">Back</button>}
              <button type="submit" disabled={backendSync.status === 'saving'} className="btn-primary ml-auto disabled:opacity-60">{backendSync.status === 'saving' ? 'Saving to self-hosted backend…' : stepIndex === steps.length - 1 ? (appType === 'voa' ? 'Prepare printable summary' : 'Complete demo preparation') : 'Save and continue'}</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

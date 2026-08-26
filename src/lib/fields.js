/**
 * The field and stage registry.
 *
 * This is the single source of truth for the application form. It drives:
 *   - the rendered form controls and their labels
 *   - validation
 *   - the review screen's section summaries
 *   - the generated agent documentation (/agent.md, /llms.txt)
 *   - the demo-data filler
 *
 * Every field has a stable `name` (the wire name, snake_case) and a stable
 * DOM id derived from it, so an agent, a screen reader, a browser autofill
 * and an automated test all address the same control the same way.
 *
 * `sensitivity` marks fields that would be personal data in a real service.
 * This prototype asks for them because the real form does, but every one is
 * accompanied by a reminder to use made-up information.
 */

import { EVISA_PORTS, VOA, REGULAR_CATEGORIES, ALL_NATIONALITIES } from './rules/reference.js';

export const fieldId = (name) => `field-${name.replace(/_/g, '-')}`;

const yesNo = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

/**
 * Seven human stages. The technical twelve-step form in the specification is
 * grouped into these because "Stage 3 of 7" is a promise a person can hold in
 * their head, and "Step 8 of 12" is not.
 */
export const STAGES = [
  {
    id: 'setup',
    title: 'Application setup',
    purpose: 'Tell us which visa you are practising with, and where you would be applying from.',
    effort: 'about 1 minute',
    action: 'Choose this visa type',
    groups: [
      {
        legend: 'What you are applying for',
        fields: [
          {
            name: 'visa_category',
            label: 'Visa category',
            type: 'select',
            required: true,
            hint: 'Pick the one that matches your reason for travelling.',
            options: [
              { value: 'tourist', label: 'Tourist' },
              { value: 'business', label: 'Business' },
              { value: 'medical', label: 'Medical treatment' },
              { value: 'medical-attendant', label: 'Medical attendant' },
              { value: 'student', label: 'Student' },
              { value: 'transit', label: 'Transit' },
            ],
          },
          {
            name: 'country_of_application',
            label: 'Country you are applying from',
            type: 'select',
            required: true,
            options: ALL_NATIONALITIES.map((c) => ({ value: c, label: c })),
            hint: 'Where you are living right now, which may not be where your passport is from.',
            autocomplete: 'country-name',
          },
          {
            name: 'indian_mission',
            label: 'Indian Mission or Post',
            type: 'text',
            required: true,
            hint: 'The embassy, high commission or consulate that would handle a paper application.',
            help: 'Only paper applications go through a Mission. Online applications do not.',
            showIf: (d) => d.application_type === 'regular' || d.application_type === 'afghan',
            example: 'High Commission of India, London',
          },
        ],
      },
    ],
  },

  {
    id: 'applicant',
    title: 'Applicant and passport',
    purpose: 'Your identity, your passport, and how you would be contacted.',
    effort: 'about 4 minutes',
    action: 'Save passport details',
    groups: [
      {
        legend: 'Your name',
        note: 'Names need to match the passport exactly. Copy them carefully, including every middle name shown.',
        fields: [
          {
            name: 'given_name',
            label: 'Given name or names',
            type: 'text',
            required: true,
            hint: 'Exactly as printed in the passport, including any middle names.',
            autocomplete: 'given-name',
            sensitivity: 'identity',
            example: 'Amara Chinelo',
          },
          {
            name: 'surname',
            label: 'Family name or surname',
            type: 'text',
            required: true,
            hint: 'If your passport shows no family name, type NA.',
            help: 'Copy this from the machine-readable zone — the two lines of letters and chevrons at the foot of the photo page. That is what a scanner reads.',
            autocomplete: 'family-name',
            sensitivity: 'identity',
            example: 'Okonjo',
          },
          {
            name: 'previous_name',
            label: 'Any name you used before',
            type: 'text',
            required: false,
            hint: 'Leave blank if your name has never changed.',
            sensitivity: 'identity',
          },
        ],
      },
      {
        legend: 'About you',
        fields: [
          {
            name: 'date_of_birth',
            label: 'Date of birth',
            type: 'date',
            required: true,
            hint: 'Day, month, year.',
            autocomplete: 'bday',
            sensitivity: 'identity',
          },
          {
            name: 'gender',
            label: 'Gender',
            type: 'select',
            required: true,
            options: [
              { value: 'female', label: 'Female' },
              { value: 'male', label: 'Male' },
              { value: 'transgender', label: 'Transgender' },
            ],
            help: 'The official form offers these three options, so this prototype mirrors them.',
          },
          {
            name: 'country_of_birth',
            label: 'Country of birth',
            type: 'select',
            required: true,
            options: ALL_NATIONALITIES.map((c) => ({ value: c, label: c })),
            sensitivity: 'identity',
          },
          {
            name: 'place_of_birth',
            label: 'Town or city of birth',
            type: 'text',
            required: true,
            sensitivity: 'identity',
            example: 'Enugu',
          },
          {
            name: 'nationality',
            label: 'Nationality',
            type: 'select',
            required: true,
            options: ALL_NATIONALITIES.map((c) => ({ value: c, label: c })),
            autocomplete: 'country-name',
          },
          {
            name: 'marital_status',
            label: 'Marital status',
            type: 'select',
            required: true,
            options: [
              { value: 'single', label: 'Single' },
              { value: 'married', label: 'Married' },
              { value: 'widowed', label: 'Widowed' },
              { value: 'divorced', label: 'Divorced' },
            ],
          },
          {
            name: 'tazkira_number',
            label: 'National Identity Card (Tazkira) number',
            type: 'text',
            required: true,
            hint: 'Afghan nationals must provide this. A copy is also uploaded later.',
            // Keyed on nationality, not on application type. The previous version
            // showed this field to every regular-visa applicant of any nationality.
            showIf: (d) => d.nationality === 'Afghanistan',
            sensitivity: 'identity',
          },
        ],
      },
      {
        legend: 'Your passport',
        fields: [
          {
            name: 'passport_number',
            label: 'Passport number',
            type: 'text',
            required: true,
            hint: 'Usually near the top right of the photo page.',
            example: 'DEMO123456',
            sensitivity: 'passport',
            validate: { minLength: 5, maxLength: 20 },
          },
          {
            name: 'passport_type',
            label: 'Type of passport',
            type: 'select',
            required: true,
            options: [
              { value: 'ordinary', label: 'Ordinary' },
              { value: 'official', label: 'Official' },
              { value: 'diplomatic', label: 'Diplomatic' },
              { value: 'service', label: 'Service' },
            ],
          },
          {
            name: 'place_of_issue',
            label: 'Place of issue',
            type: 'text',
            required: true,
            example: 'Abuja',
          },
          { name: 'date_of_issue', label: 'Date of issue', type: 'date', required: true },
          {
            name: 'date_of_expiry',
            label: 'Date of expiry',
            type: 'date',
            required: true,
            hint: 'It needs at least six months left when you apply.',
          },
        ],
      },
      {
        legend: 'Where you live',
        fields: [
          { name: 'address_line_1', label: 'Address line 1', type: 'text', required: true, autocomplete: 'address-line1', sensitivity: 'address' },
          { name: 'address_line_2', label: 'Address line 2', type: 'text', required: false, autocomplete: 'address-line2', sensitivity: 'address' },
          { name: 'city', label: 'Town or city', type: 'text', required: true, autocomplete: 'address-level2', sensitivity: 'address' },
          { name: 'postal_code', label: 'Postal code', type: 'text', required: false, autocomplete: 'postal-code', sensitivity: 'address' },
          {
            name: 'country', label: 'Country', type: 'select', required: true,
            options: ALL_NATIONALITIES.map((c) => ({ value: c, label: c })), autocomplete: 'country-name',
          },
          {
            name: 'email', label: 'Email address', type: 'email', required: true,
            hint: 'In the real service every update arrives here, so it is worth checking twice.',
            autocomplete: 'email', inputMode: 'email', sensitivity: 'contact',
            example: 'demo@example.com',
          },
          {
            name: 'mobile', label: 'Mobile number', type: 'tel', required: true,
            autocomplete: 'tel', inputMode: 'tel', sensitivity: 'contact',
            example: '+234 000 000 0000',
          },
        ],
      },
    ],
  },

  {
    id: 'background',
    title: 'Family, work and background',
    purpose: 'Questions about your family, your work, and any earlier visits to India.',
    effort: 'about 3 minutes',
    action: 'Save background details',
    groups: [
      {
        legend: 'Your family',
        fields: [
          { name: 'father_name', label: "Father's full name", type: 'text', required: true, sensitivity: 'identity' },
          { name: 'mother_name', label: "Mother's full name", type: 'text', required: true, sensitivity: 'identity' },
          {
            name: 'parents_nationality', label: "Parents' nationality", type: 'select', required: true,
            options: ALL_NATIONALITIES.map((c) => ({ value: c, label: c })),
          },
          {
            name: 'spouse_name', label: "Spouse's full name", type: 'text', required: true,
            showIf: (d) => d.marital_status === 'married', sensitivity: 'identity',
          },
          {
            name: 'spouse_nationality', label: "Spouse's nationality", type: 'select', required: true,
            options: ALL_NATIONALITIES.map((c) => ({ value: c, label: c })),
            showIf: (d) => d.marital_status === 'married',
          },
          {
            name: 'pakistani_origin',
            label: 'Were you, your parents or your grandparents born in Pakistan, or ever resident there?',
            type: 'radio',
            required: true,
            options: yesNo,
            help: 'The official form asks this, and the answer changes which route applies. In this prototype nothing is checked and nothing leaves your device — answer however you like.',
          },
        ],
      },
      {
        legend: 'Your work',
        fields: [
          {
            name: 'occupation', label: 'Occupation', type: 'select', required: true,
            options: [
              { value: 'employed', label: 'Employed' },
              { value: 'self-employed', label: 'Self-employed' },
              { value: 'student', label: 'Student' },
              { value: 'retired', label: 'Retired' },
              { value: 'homemaker', label: 'Homemaker' },
              { value: 'not-employed', label: 'Not currently working' },
            ],
          },
          {
            name: 'employer_name', label: 'Employer or business name', type: 'text', required: true,
            showIf: (d) => ['employed', 'self-employed'].includes(d.occupation),
            autocomplete: 'organization',
          },
          {
            name: 'employer_address', label: 'Employer address', type: 'text', required: true,
            showIf: (d) => ['employed', 'self-employed'].includes(d.occupation),
          },
          {
            name: 'previous_occupation', label: 'Occupation before you retired', type: 'text', required: false,
            showIf: (d) => d.occupation === 'retired',
          },
        ],
      },
      {
        legend: 'Earlier visits',
        fields: [
          { name: 'visited_india_before', label: 'Have you visited India before?', type: 'radio', required: true, options: yesNo },
          {
            name: 'previous_visa_number', label: 'Your previous visa number', type: 'text', required: false,
            showIf: (d) => d.visited_india_before === 'yes', sensitivity: 'passport',
          },
          {
            name: 'previous_places_visited', label: 'Places you visited then', type: 'text', required: false,
            showIf: (d) => d.visited_india_before === 'yes',
          },
          {
            name: 'visited_saarc',
            label: 'Have you visited any SAARC country in the last three years?',
            type: 'radio',
            required: true,
            options: yesNo,
            help: 'SAARC is Afghanistan, Bangladesh, Bhutan, India, Maldives, Nepal, Pakistan and Sri Lanka.',
          },
          {
            name: 'saarc_countries_visited', label: 'Which ones, and when', type: 'text', required: true,
            showIf: (d) => d.visited_saarc === 'yes',
          },
        ],
      },
    ],
  },

  {
    id: 'travel',
    title: 'Travel plans and references',
    purpose: 'When you plan to arrive, where you will stay, and someone who can vouch for you in India.',
    effort: 'about 3 minutes',
    action: 'Save travel plans',
    groups: [
      {
        legend: 'Your trip',
        fields: [
          {
            name: 'expected_arrival_date', label: 'Expected date of arrival', type: 'date', required: true,
            hint: 'For an e-Visa, this must be at least four days after you apply.',
          },
          { name: 'expected_departure_date', label: 'Expected date of departure', type: 'date', required: true },
          {
            name: 'port_of_arrival',
            label: 'Where you will arrive in India',
            type: 'select',
            required: true,
            hint: 'An e-Visa only works at ports on the official list.',
            options: (d) =>
              (d.application_type === 'voa' ? VOA.airports : EVISA_PORTS.airports).map((p) => ({
                value: p, label: p,
              })),
          },
          {
            name: 'places_to_visit', label: 'Places you plan to visit', type: 'text', required: true,
            example: 'Delhi, Agra, Jaipur',
          },
          {
            name: 'address_in_india', label: 'Where you will stay', type: 'text', required: true,
            hint: 'A hotel address is fine.', sensitivity: 'address',
          },
        ],
      },
      {
        legend: 'Your reference in India',
        note: 'Someone in India who could confirm your visit. If you have no personal contact, your hotel works.',
        fields: [
          { name: 'reference_name', label: 'Name of your reference', type: 'text', required: true, sensitivity: 'identity' },
          { name: 'reference_address', label: 'Their address', type: 'text', required: true, sensitivity: 'address' },
          { name: 'reference_phone', label: 'Their phone number', type: 'tel', required: true, inputMode: 'tel', sensitivity: 'contact' },
        ],
      },
    ],
  },

  { id: 'documents', title: 'Documents', purpose: 'Choose the demo files that stand in for your real documents.', effort: 'about 2 minutes', action: 'Save my document list', groups: [] },
  { id: 'review', title: 'Review and resolve', purpose: 'Check everything, and fix anything that looks wrong, before you commit.', effort: 'about 2 minutes', action: 'Review demo application', groups: [] },
  { id: 'submit', title: 'Simulated payment and submission', purpose: 'Practise the payment and lock the application, exactly as the real service would.', effort: 'about 1 minute', action: 'Continue to submission', groups: [] },
];

export const STAGE_IDS = STAGES.map((s) => s.id);
export const FORM_STAGES = STAGES.filter((s) => s.groups.length > 0);

export function getStage(id) {
  return STAGES.find((s) => s.id === id);
}

/** Fields on a stage that currently apply, given the data entered so far. */
export function visibleFields(stage, data = {}) {
  if (!stage?.groups) return [];
  return stage.groups.flatMap((g) => g.fields.filter((f) => !f.showIf || f.showIf(data)));
}

/** Options for a field, which may depend on other answers. */
export function optionsFor(field, data = {}) {
  return typeof field.options === 'function' ? field.options(data) : field.options || [];
}

/** Every field across every stage — used by the agent schema generator. */
export function allFields() {
  return STAGES.flatMap((s) =>
    (s.groups || []).flatMap((g) =>
      g.fields.map((f) => ({ ...f, stage: s.id, id: fieldId(f.name) })),
    ),
  );
}

/**
 * Required document types, derived from what the traveller has told us.
 * Mirrors the official lists rather than guessing.
 */
export function requiredDocuments(data = {}) {
  if (data.application_type === 'voa') {
    return [{ type: 'passport', title: 'Passport photo page', desc: 'The page showing your photo and details.', accept: '.pdf,.jpg,.jpeg' }];
  }
  const docs = [
    { type: 'passport', title: 'Passport photo page', desc: 'A clear scan of the page showing your photo and details, as a PDF.', accept: '.pdf' },
    { type: 'photograph', title: 'Recent photograph', desc: 'Front-facing, on a white or light background, as a JPEG.', accept: '.jpg,.jpeg' },
  ];
  if (data.visa_category === 'business') {
    docs.push({ type: 'business_document', title: 'Business document', desc: 'A business card, or a letter from the company you are visiting.', accept: '.pdf,.jpg,.jpeg' });
  }
  if (data.visa_category === 'medical' || data.visa_category === 'medical-attendant') {
    docs.push({ type: 'medical_document', title: 'Letter from the hospital in India', desc: 'The invitation letter the hospital generates.', accept: '.pdf' });
  }
  if (data.nationality === 'Afghanistan') {
    docs.push({ type: 'tazkira', title: 'National Identity Card (Tazkira)', desc: 'A scan showing your name, date of birth, nationality and expiry date. This one is mandatory.', accept: '.pdf,.jpg,.jpeg' });
  }
  return docs;
}

export { REGULAR_CATEGORIES };

/**
 * Reference data transcribed from the official sources on REVIEWED_AT.
 *
 * Rules of the house:
 *  - Names are kept in the government's own spelling, typos included, so a
 *    traveller comparing this list against the official page sees the same
 *    strings. Search aliases are added separately rather than "correcting" them.
 *  - We publish the list, never a count. Our transcription may have merged an
 *    ampersand-joined entry, and a wrong count reads as authority it hasn't earned.
 *  - Fees and processing times are deliberately absent. See NON_CLAIMS.
 */

import { SOURCES } from './sources.js';

/* ------------------------------------------------------------------------ */
/* e-Visa                                                                    */
/* ------------------------------------------------------------------------ */

/**
 * Countries and territories whose passport holders may apply for an e-Visa,
 * per the eligible list published on the official e-Visa page.
 * Source: SOURCES.evisa
 */
export const EVISA_ELIGIBLE = [
  'Albania', 'Andorra', 'Angola', 'Anguilla', 'Antigua & Barbuda', 'Argentina',
  'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas',
  'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin',
  'Bolivia', 'Bosnia & Herzegovina', 'Botswana', 'Brazil', 'Brunei',
  'Bulgaria', 'Burundi', 'Canada', 'Cambodia', 'Cameroon Union Republic',
  'Cape Verde', 'Cayman Island', 'Chile', 'Colombia', 'Comoros',
  'Cook Islands', 'Costa Rica', "Cote d'lvoire", 'Croatia', 'Cuba', 'Cyprus',
  'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
  'Ecuador', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia',
  'Eswatini', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia',
  'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Grenada', 'Guatemala',
  'Guernsey', 'Guinea', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland',
  'Indonesia', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan',
  'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait',
  'Kyrgyzstan', 'Laos', 'Latvia', 'Lesotho', 'Liberia', 'Liechtenstein',
  'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia',
  'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
  'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat',
  'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Netherlands',
  'New Zealand', 'Nicaragua', 'Niger Republic', 'Niue Island', 'Norway',
  'Oman', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay',
  'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Republic of Korea',
  'Romania', 'Russia', 'Rwanda', 'Saint Christopher and Nevis', 'Saint Lucia',
  'Saint Vincent & the Grenadines', 'Samoa', 'San Marino', 'Senegal', 'Serbia',
  'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia',
  'Solomon Islands', 'South Africa', 'Spain', 'Sri Lanka', 'Suriname',
  'Sweden', 'Switzerland', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand',
  'Togo', 'Tonga', 'Trinidad & Tobago', 'Turks & Caicos Island', 'Tuvalu',
  'UAE', 'Ukraine', 'United Kingdom', 'Uruguay', 'USA', 'Uzbekistan',
  'Vanuatu', 'Vatican City-Holy See', 'Venezuela', 'Vietnam', 'Zambia',
  'Zimbabwe',
];

/**
 * Names a traveller is likely to type, mapped to the official list entry.
 * This is a search convenience only — it never changes an eligibility outcome.
 */
export const NATIONALITY_ALIASES = {
  'united states': 'USA',
  'united states of america': 'USA',
  america: 'USA',
  'u.s.a.': 'USA',
  us: 'USA',
  uk: 'United Kingdom',
  'great britain': 'United Kingdom',
  britain: 'United Kingdom',
  england: 'United Kingdom',
  scotland: 'United Kingdom',
  wales: 'United Kingdom',
  'south korea': 'Republic of Korea',
  korea: 'Republic of Korea',
  'korea, south': 'Republic of Korea',
  'united arab emirates': 'UAE',
  emirates: 'UAE',
  'north macedonia': 'Macedonia',
  'ivory coast': "Cote d'lvoire",
  "cote d'ivoire": "Cote d'lvoire",
  'côte d’ivoire': "Cote d'lvoire",
  cameroon: 'Cameroon Union Republic',
  niger: 'Niger Republic',
  'st kitts and nevis': 'Saint Christopher and Nevis',
  'saint kitts and nevis': 'Saint Christopher and Nevis',
  'st lucia': 'Saint Lucia',
  'st vincent and the grenadines': 'Saint Vincent & the Grenadines',
  'vatican city': 'Vatican City-Holy See',
  'holy see': 'Vatican City-Holy See',
  'trinidad and tobago': 'Trinidad & Tobago',
  'antigua and barbuda': 'Antigua & Barbuda',
  'bosnia and herzegovina': 'Bosnia & Herzegovina',
  czechia: 'Czech Republic',
  swaziland: 'Eswatini',
  burma: 'Myanmar',
  holland: 'Netherlands',
  'cape verde islands': 'Cape Verde',
  'turks and caicos': 'Turks & Caicos Island',
  niue: 'Niue Island',
  'cayman islands': 'Cayman Island',
};

/**
 * Nationalities a traveller may well hold that are NOT on the eligible list.
 * We keep this so the finder can name the reason ("your passport is not on the
 * published list") rather than silently having no rule. It is a convenience for
 * copy, not an authority — absence from EVISA_ELIGIBLE is what decides.
 */
export const COMMON_NON_EVISA = [
  'Afghanistan', 'Algeria', 'Bhutan', 'Burkina Faso', 'Central African Republic',
  'Chad', 'China', 'Congo', 'Democratic Republic of the Congo', 'Egypt',
  'Ethiopia', 'Guinea-Bissau', 'Iran', 'Iraq', 'Lebanon', 'Libya', 'Maldives',
  'Nepal', 'Nigeria', 'North Korea', 'Pakistan', 'Saudi Arabia', 'Somalia',
  'South Sudan', 'Sudan', 'Syria', 'Timor-Leste', 'Turkey', 'Turkmenistan',
  'Uganda', 'Yemen',
];

/** Everything the finder offers in its nationality picker. */
export const ALL_NATIONALITIES = [...EVISA_ELIGIBLE, ...COMMON_NON_EVISA].sort((a, b) =>
  a.localeCompare(b),
);

/**
 * e-Visa sub-types with the codes exactly as printed on the official page.
 * `validity` is the official wording, not our paraphrase.
 */
export const EVISA_SUBTYPES = [
  { code: 'e-T1 V', name: 'e-Tourist Visa', validity: '30 days, 1 year or 5 years, multiple entry', purpose: 'tourism' },
  { code: 'e-T2 V', name: 'e-Tourist Visa', validity: '6 months, multiple entry', purpose: 'tourism' },
  { code: 'e-B1 V', name: 'e-Business Visa', validity: '1 year, multiple entry', purpose: 'business' },
  { code: 'e-B5 V', name: 'e-Business Visa', validity: '30 days from arrival, multiple entry', purpose: 'business' },
  { code: 'e-B6 V', name: 'e-Business Visa', validity: '1 year, multiple entry', purpose: 'business' },
  { code: 'e-M1 V', name: 'e-Medical Visa', validity: '1 year from arrival, multiple entry', purpose: 'medical' },
  { code: 'e-M3 V', name: 'e-Medical Visa', validity: '1 year from arrival, multiple entry', purpose: 'medical' },
  { code: 'e-M2 V', name: 'e-Medical Attendant Visa', validity: '1 year from arrival, multiple entry', purpose: 'medical-attendant' },
  { code: 'e-M4 V', name: 'e-Medical Attendant Visa', validity: '1 year from arrival, multiple entry', purpose: 'medical-attendant' },
  { code: 'e-S V', name: 'e-Student Visa', validity: '1 year, multiple entry', purpose: 'study' },
  { code: 'e-TR V', name: 'e-Transit Visa', validity: '30 days from first arrival, multiple entry', purpose: 'transit' },
  { code: 'e-X1 V', name: 'e-Miscellaneous Visa (3 months)', validity: '3 months from first entry, multiple entry', purpose: 'miscellaneous' },
  { code: null, name: 'e-Production Investment Visa', validity: '6 months, multiple entry', purpose: 'film' },
  { code: 'e-SX V', name: 'e-Family Visa', validity: '1 year, multiple entry', purpose: 'family' },
];

/**
 * Conditions printed on the official e-Visa page. Rendered wherever we name an
 * e-Visa path, because these are the things that actually stop people.
 */
export const EVISA_CONDITIONS = [
  'Your passport must have at least six months of validity when you apply.',
  'You need a return or onward ticket, and enough money for your stay.',
  'Apply at least four days before you arrive. For e-Medical and e-Medical Attendant visas there is a 120-day window.',
  'An e-Visa cannot be extended, and it cannot be converted to another visa type once you are in India.',
  'An e-Visa is not valid for Protected, Restricted or Cantonment Areas. Those need a separate permit.',
  'You must travel on the same passport you applied with.',
  'Carry a printed copy of your Electronic Travel Authorization when you travel.',
  'Your fingerprints and photograph are taken at immigration when you arrive.',
];

export const EVISA_STAY_LIMITS = [
  'A single continuous stay must not exceed 180 days.',
  'On a 1-year or 5-year e-Tourist Visa, total stay in one calendar year must not exceed 180 days.',
  'Staying beyond 180 days means registering with the local FRRO or FRO within two weeks of day 180.',
];

/** Verbatim exclusions from the official e-Visa page. */
export const EVISA_EXCLUSIONS = [
  {
    id: 'pakistani-origin',
    label: 'People of Pakistani origin, or holding a Pakistani passport',
    detail:
      'The official page states that foreigners of Pakistani origin or holding a Pakistani passport are not eligible for an e-Visa, and should apply for a regular visa at an Indian Mission.',
  },
  {
    id: 'diplomatic-passport',
    label: 'Diplomatic or official passport holders, and laissez-passer holders',
    detail: 'The e-Visa system does not accept these travel documents.',
  },
  {
    id: 'endorsed-passport',
    label: "People endorsed on a parent's or spouse's passport",
    detail: 'Each applicant needs their own separate passport.',
  },
  {
    id: 'non-passport',
    label: 'Holders of international travel documents that are not passports',
    detail: 'Only a passport is accepted for an e-Visa.',
  },
];

export const EVISA_PORTS = {
  airports: [
    'Ahmedabad', 'Amritsar', 'Bagdogra', 'Bengaluru', 'Bhopal', 'Bhubaneswar',
    'Calicut', 'Chandigarh', 'Chennai', 'Cochin', 'Coimbatore', 'Delhi',
    'Gaya', 'Goa (Dabolim)', 'Goa (Mopa)', 'Guwahati', 'Hyderabad', 'Indore',
    'Jaipur', 'Kannur', 'Kolkata', 'Lucknow', 'Madurai', 'Mangalore', 'Mumbai',
    'Nagpur', 'Navi Mumbai', 'Port Blair', 'Pune', 'Surat', 'Thiruvananthapuram',
    'Tirupati', 'Trichy', 'Varanasi', 'Vijayawada', 'Visakhapatnam',
  ],
  seaports: [
    'Agatti', 'Alang', 'Bedi Bandar', 'Bhavnagar', 'Calicut', 'Chennai',
    'Cochin', 'Cuddalore', 'Dahej', 'Dhamra', 'Haldia', 'Hazira', 'Kakinada',
    'Kamarajar', 'Kandla', 'Karaikal', 'Kattupalli', 'Kolkata', 'Kollam',
    'Krishnapatnam', 'Mandvi', 'Mormugao', 'Mumbai', 'Mundra', 'Nagapattinam',
    'New Mangalore', 'Nhava Sheva', 'Paradeep', 'Pipavav', 'Porbandar',
    'Port Blair', 'Sikka', 'Tuna Tekra', 'Tuticorin', 'Vallarpadam',
    'Vishakapatnam', 'Vizhinjam', 'Vizhinjam International',
  ],
  landCheckPosts: [
    'Agartala', 'Attari', 'Darranga', 'Dawki', 'Gede', 'Ghojadanga',
    'Haridaspur', 'Jaigaon', 'Jogbani', 'Moreh', 'Raxaul', 'Rupaidiha',
  ],
  exitNote: 'You may leave from any Indian Immigration Check Post — exit is not restricted to this list.',
};

/**
 * Fee rules only. The official page publishes no amount here, and amounts change.
 * We link to the official fee page instead of printing a number.
 */
export const EVISA_FEE_RULES = [
  'The fee depends on your country or territory.',
  'A bank transaction charge of 3% is added to the fee.',
  'The fee is not refunded, whether or not the visa is granted — it pays for the review, not the outcome.',
  'Pay at least four days before you travel, or the application will not be processed.',
];

/* ------------------------------------------------------------------------ */
/* Visa on Arrival                                                           */
/* ------------------------------------------------------------------------ */

export const VOA = {
  nationalities: ['Japan', 'Republic of Korea', 'UAE'],
  uaeCondition:
    'UAE nationals may seek Visa on Arrival only if they have previously held an Indian e-Visa or a regular/paper visa. First-time travellers from the UAE apply in advance.',
  purposes: ['tourism', 'business', 'conference', 'medical'],
  maxDays: 60,
  airports: ['Bengaluru', 'Chennai', 'Delhi', 'Hyderabad', 'Kolkata', 'Mumbai'],
  fee: 'Rs. 2,000 or the equivalent in foreign currency, per passenger including children',
  entries: 'Double entry is possible, at the Immigration Officer’s discretion.',
  exclusions: [
    'People born in Pakistan or resident in Pakistan, and those whose parents or grandparents were born in or resident in Pakistan.',
    'Diplomatic and official passport holders.',
  ],
  discretionNote:
    'Visa on Arrival is decided at the airport by an Immigration Officer on the day you land. It is a facility you may ask for, never something you are guaranteed.',
};

/* ------------------------------------------------------------------------ */
/* Regular / paper visas                                                     */
/* ------------------------------------------------------------------------ */

export const REGULAR_CATEGORIES = [
  'Business', 'Diplomatic', 'Work', 'Family (for dependents)', 'Journalist',
  'Medical', 'Official', 'Pakistan Specific', 'Student', 'Tourist', 'Transit',
  'Miscellaneous',
];

/* ------------------------------------------------------------------------ */
/* Afghan nationals                                                          */
/* ------------------------------------------------------------------------ */

export const AFGHAN = {
  portalUrl: SOURCES.afghan.url,
  categories: [
    'Business Visa', 'Student Visa', 'Medical Visa', 'Medical Attendant Visa',
    'Entry Visa', 'UN Diplomat Visa',
  ],
  // Worth stating explicitly: the absence of tourism is the single fact most
  // likely to surprise an Afghan traveller, and the old prototype filed every
  // Afghan applicant as a tourist.
  tourismAvailable: false,
  documents: [
    'National Identity Card (Tazkira), showing your name, date of birth, nationality and expiry date. This upload is mandatory.',
    'A recent front-facing photograph on a white background.',
    'The photo and bio page of your passport.',
  ],
  notes: [
    'Each application form covers one person. Apply separately for each traveller.',
    'Supporting documents such as invitation letters should be in English.',
    'Once the form is submitted, it cannot be modified.',
    'You must travel on the passport you applied with.',
    'Biometrics are captured at immigration on arrival.',
  ],
};

/* ------------------------------------------------------------------------ */
/* e-Arrival Card                                                            */
/* ------------------------------------------------------------------------ */

export const EARRIVAL = {
  url: SOURCES.earrival.url,
  isNotAVisa: true,
  window: 'within 72 hours before you arrive in India',
  windowConfidence: 'medium',
  appliesTo:
    'All foreign nationals visiting India, and — since 1 October 2025 — OCI cardholders as well.',
  summary:
    'A short online form about your flight and where you are staying. It replaces the paper card that used to be handed out on the plane.',
};

/* ------------------------------------------------------------------------ */
/* Things this prototype must never claim                                    */
/* ------------------------------------------------------------------------ */

/**
 * Kept in code rather than in a document so it shows up in review when someone
 * is tempted. Each of these was in the previous version of this prototype.
 */
export const NON_CLAIMS = [
  'How long processing takes. The official e-Visa page states no processing time. "3–5 business days" and "within 72 hours" were both invented.',
  'A fee amount, except by linking to the official fee page.',
  'That anyone is eligible. Only the Bureau of Immigration or an Indian Mission decides that.',
  'How likely an approval is.',
  'That a granted visa guarantees entry. The Immigration Officer at the port decides admission.',
  'That Visa on Arrival is an entitlement. It is granted at the airport, at an officer’s discretion.',
  'That this prototype has a support team.',
  'That the paper disembarkation card has been withdrawn. We could not verify it.',
  'A count of eligible countries. We publish the list instead.',
];

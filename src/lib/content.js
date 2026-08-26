/**
 * Editorial content, kept as data rather than JSX so it can be reviewed for
 * accuracy without reading component code, and so a copy change never risks
 * a layout change.
 *
 * Every factual claim here traces to src/lib/rules/. Anything that could not
 * be verified against a primary official source is simply absent.
 */

import { SOURCES } from './rules/sources.js';
import {
  EVISA_CONDITIONS, EVISA_STAY_LIMITS, EVISA_EXCLUSIONS, EVISA_FEE_RULES,
  EVISA_PORTS, VOA, AFGHAN, REGULAR_CATEGORIES, EARRIVAL,
} from './rules/reference.js';

/* ------------------------------------------------------------------ */
/* Visa route briefings                                                */
/* ------------------------------------------------------------------ */

export const PATHS = {
  evisa: {
    id: 'evisa',
    name: 'e-Visa',
    strapline: 'Applied for online, before you travel.',
    intro:
      'The e-Visa is applied for entirely online — no embassy visit, no posting your passport away. It is open to passport holders from a published list of countries and territories, and it covers tourism, business, medical travel, study, transit and a few other purposes.',
    source: SOURCES.evisa,
    conditions: EVISA_CONDITIONS,
    limits: EVISA_STAY_LIMITS,
    exclusions: EVISA_EXCLUSIONS.map((e) => `${e.label}. ${e.detail}`),
    fees: EVISA_FEE_RULES,
    ports: EVISA_PORTS,
    documents: [
      'A recent front-facing photograph on a white or light background, as a JPEG.',
      'The passport data page — the one with your photo and details — as a PDF.',
      'Anything else your particular visa category asks for.',
    ],
  },
  voa: {
    id: 'voa',
    name: 'Visa on Arrival',
    strapline: 'Asked for at the airport, on the day you land.',
    intro:
      'Visa on Arrival is a facility, not an entitlement. It is available to nationals of Japan, the Republic of Korea, and — with one condition — the UAE. An Immigration Officer at one of six airports decides on the day, and can decline.',
    source: SOURCES.voa,
    conditions: [
      `Available to nationals of ${VOA.nationalities.join(', ')}.`,
      VOA.uaeCondition,
      `For ${VOA.purposes.join(', ')} travel only.`,
      `For a stay of no more than ${VOA.maxDays} days.`,
      VOA.entries,
      `The fee is ${VOA.fee}.`,
      VOA.discretionNote,
    ],
    exclusions: VOA.exclusions,
    ports: { airports: VOA.airports },
    documents: ['The passport you will travel on.'],
  },
  regular: {
    id: 'regular',
    name: 'Regular (paper) visa',
    strapline: 'Applied for through an Indian Mission or Post.',
    intro:
      'When there is no online route — because of the passport, the purpose, or the length of stay — India issues one of twelve regular visa categories through its embassies, high commissions and consulates. A person reviews the whole file, and your passport is handled in person. It takes longer, so start earlier.',
    source: SOURCES.categories,
    conditions: [
      `The published categories are: ${REGULAR_CATEGORIES.join(', ')}.`,
      'Requirements, appointment procedures and fees vary by category and by Mission. Check the relevant Mission’s own instructions.',
      'Your passport is submitted physically, so plan around being without it.',
    ],
    exclusions: [],
    documents: [
      'A passport with enough validity and blank pages for the visa.',
      'A recent photograph meeting the Mission’s stated format.',
      'Whatever supporting documents your category requires.',
    ],
  },
  afghan: {
    id: 'afghan',
    name: 'Visa for Afghan nationals',
    strapline: 'Applied for through a separate official portal.',
    intro:
      'Afghan nationals do not use the general e-Visa system. The Government of India runs a separate portal with six categories. Tourism is not among them — that surprises people, and it is better to know now than after filling in a form.',
    source: SOURCES.afghan,
    conditions: [
      `The categories currently listed are: ${AFGHAN.categories.join(', ')}.`,
      ...AFGHAN.notes,
    ],
    exclusions: ['There is no tourist category listed for Afghan nationals.'],
    documents: AFGHAN.documents,
  },
};

export const PATH_LIST = Object.values(PATHS);

/* ------------------------------------------------------------------ */
/* Glossary                                                            */
/* ------------------------------------------------------------------ */

export const GLOSSARY = [
  { term: 'ETA (Electronic Travel Authorization)', body: 'The document you get by email if an e-Visa is granted. Print it and carry it — you will be asked for it when you travel.' },
  { term: 'e-Visa', body: 'A visa applied for online, without visiting an embassy or posting your passport. It cannot be extended, and it cannot be changed to another visa type once you are in India.' },
  { term: 'Visa on Arrival', body: 'A visa you ask for at the airport in India instead of before you fly. Only nationals of Japan, the Republic of Korea and the UAE can use it, and the officer at the airport decides on the day.' },
  { term: 'Port of entry', body: 'The specific airport, seaport or land crossing where you are allowed to enter India. An e-Visa only works at ports on the official list, so check yours before booking.' },
  { term: 'Tazkira', body: 'Afghanistan’s national identity card. If you are an Afghan national applying for an Indian visa, you must upload a copy — it is not optional.' },
  { term: 'SAARC', body: 'A group of eight South Asian countries: Afghanistan, Bangladesh, Bhutan, India, Maldives, Nepal, Pakistan and Sri Lanka. Application forms sometimes ask whether you have travelled to any of them.' },
  { term: 'Mission or Post', body: 'An Indian embassy, high commission or consulate in your country. It is where paper visa applications are decided, and where to go when there is no online route.' },
  { term: 'Gratis', body: 'A visa issued free of charge. It applies to certain nationalities and categories, and it is decided by the rules — you cannot request it.' },
  { term: 'Biometrics', body: 'Your fingerprints and a photograph of your face. India takes these at immigration when you arrive, so expect a short extra step at the counter.' },
  { term: 'OCI (Overseas Citizen of India)', body: 'A lifelong travel and residence status for people of Indian origin who hold another country’s passport. It is not Indian citizenship, and OCI holders still file the e-Arrival Card.' },
  { term: 'e-Arrival Card', body: 'A short online form about your flight and where you are staying, filed shortly before you reach India. It replaces the paper card that used to be handed out on the plane. It is not a visa and it does not let you enter India on its own.' },
  { term: 'Naturalisation', body: 'Becoming a citizen of a country you were not born in. Forms ask about it because your birth country and your current nationality can differ, and both can matter.' },
  { term: 'Machine-readable zone', body: 'The two lines of letters, numbers and chevrons at the foot of your passport photo page. A scanner reads it, so that part of the page must be clean and undamaged.' },
  { term: 'Double entry', body: 'A visa that lets you enter India twice — useful if you plan a short trip to a neighbouring country and back. Single entry means once only; if you leave, the visa is finished.' },
  { term: 'FRRO', body: 'The Foreigners Regional Registration Office. You must register there if you stay in India longer than 180 days at a stretch, within two weeks of day 180.' },
];

/* ------------------------------------------------------------------ */
/* Help                                                                */
/* ------------------------------------------------------------------ */

export const FAQ = [
  {
    q: 'Is this a real visa service?',
    a: 'No. Visa-Seva is a hackathon prototype. It is not connected to the Government of India, it cannot receive an application, and it issues nothing. The real service is at indianvisaonline.gov.in, it is free to start, and it needs no intermediary.',
  },
  {
    q: 'Where does what I type here go?',
    a: 'Into your own browser, and nowhere else. There is no server behind this page, no account, and nobody at the other end. That also means nothing is backed up — clear your browser data and it is gone. Please use made-up details.',
  },
  {
    q: 'How long does a real visa take to process?',
    a: 'The official e-Visa page does not publish a processing time. Apply early, leave room for questions or additional documents, and check the official portal for the current position rather than relying on an unofficial estimate.',
  },
  {
    q: 'What does an e-Visa actually cost?',
    a: 'The fee depends on your country or territory, a 3% bank transaction charge is added, and it is not refunded whether or not the visa is granted. Because the amount changes, we link to the official fee information rather than printing a number that might be wrong.',
  },
  {
    q: 'Am I eligible for an e-Visa?',
    a: 'Nobody on a website can tell you that — only the Bureau of Immigration or an Indian Mission decides. What we can do is show you what the published rules say for someone with your answers, tell you which source that came from, and when a person last read it.',
  },
  {
    q: 'What is the e-Arrival Card, and is it a visa?',
    a: 'It is not a visa. It is a short arrival declaration about your flight and where you are staying, replacing the paper card that used to be filled in on the plane. It is filed on the official government site shortly before you arrive. Having one does not let you enter India; having a visa and being admitted by an officer does.',
  },
  {
    q: 'Can I get help from you?',
    a: 'Visa-Seva has no support team. The Government of India publishes a real e-Visa helpline; the verified contact details are listed below.',
  },
];

/* ------------------------------------------------------------------ */
/* Discover India                                                      */
/* ------------------------------------------------------------------ */

/**
 * Three plates, not twenty-seven cards.
 *
 * Code-drawn studies of Indian architectural and landscape rhythms add
 * atmosphere without shipping an unverified photograph or implying that an
 * image is evidence for a service claim.
 */
export const PLATES = [
  {
    motif: 'stepwell',
    title: 'The stepwell at dusk',
    body: 'India builds downwards as readily as upwards. A stepwell is a piece of infrastructure — a way to reach water in a dry season — that generations of masons treated as an occasion for geometry. The pattern in this prototype’s borders comes from the same instinct: a lattice that is doing a job while being worth looking at.',
    caption: 'Gujarat — a code-drawn study of stepwell geometry',
  },
  {
    motif: 'water',
    title: 'Still water in winter',
    body: 'A lake under snow, a boat tied up for the season, a morning allowed to arrive slowly. India welcomes through moments of quiet as surely as through celebration — space to look, listen and find your own pace.',
    caption: 'Kashmir — a code-drawn study of winter water',
  },
  {
    motif: 'rail',
    title: 'The slow train',
    body: 'The Nilgiri railway climbs about 1,300 metres in five hours, which is slower than walking downhill and entirely the point. Plenty of India is arranged around the idea that arriving is not the only part of a journey worth having. Your visa is one step; the journey is only beginning.',
    caption: 'Ooty, the Nilgiris — a code-drawn study of the mountain railway',
  },
];

/* ------------------------------------------------------------------ */
/* Before you travel                                                   */
/* ------------------------------------------------------------------ */

export const TRAVEL_CHECKLIST = [
  {
    id: 'print-eta',
    title: 'Carry a printed copy of your authorisation',
    body: 'A digital copy is usually accepted, but paper does not run out of battery at a check-in desk. The official e-Visa page says to carry a copy of the ETA with you when you travel.',
    source: SOURCES.evisa,
  },
  {
    id: 'same-passport',
    title: 'Travel on the same passport you applied with',
    body: 'Not a renewed one, not a second one — the same physical book. If a passport was renewed after the visa was issued, carry the old one as well.',
    source: SOURCES.evisa,
  },
  {
    id: 'port',
    title: 'Arrive at a port on the list',
    body: 'An e-Visa only works at the designated airports, seaports and land check posts. Leaving is unrestricted — you may depart from any Indian Immigration Check Post.',
    source: SOURCES.evisa,
  },
  {
    id: 'earrival',
    title: 'File the e-Arrival Card',
    body: `${EARRIVAL.summary} It is filed ${EARRIVAL.window}, on the official government site. It is not a visa and it does not, on its own, let you into India.`,
    source: SOURCES.earrivalWindow,
    external: EARRIVAL.url,
    externalLabel: 'Open the official e-Arrival Card service',
  },
  {
    id: 'funds',
    title: 'Have a return ticket and enough money for the stay',
    body: 'The official page states this as a condition, and it is the kind of thing that is easy to overlook when a visa has already been granted.',
    source: SOURCES.evisa,
  },
  {
    id: 'biometrics',
    title: 'Expect fingerprints and a photograph on arrival',
    body: 'Biometrics are captured at immigration when you land. It is routine, it is quick, and it is not a sign that anything is wrong.',
    source: SOURCES.evisa,
  },
];

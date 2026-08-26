/**
 * Source register.
 *
 * Every material rule in this prototype cites one of these. Each entry records
 * the exact URL a human read, the date they read it, and how much of it we
 * were able to verify. Nothing in `src/lib/rules/` may assert a fact that is
 * not traceable to a row here.
 *
 * These pages are NEVER fetched at runtime. They were reviewed by hand and
 * transcribed. Visa rules change without notice, so every surface that renders
 * a rule must also render its `reviewedAt` date and a link to its source.
 */

export const REVIEWED_AT = '2026-08-26';

/** Human-readable form of REVIEWED_AT, e.g. "26 August 2026". */
export const REVIEWED_AT_LABEL = '26 August 2026';

export const SOURCES = {
  evisa: {
    id: 'evisa',
    title: 'e-Visa — Bureau of Immigration, Government of India',
    url: 'https://www.indianvisaonline.gov.in/evisa/tvoa.html',
    establishes:
      'e-Visa sub-types and codes, the eligible countries list, application timing, ports of entry, exclusions, stay limits and fee rules.',
    reviewedAt: REVIEWED_AT,
    confidence: 'high',
    // The page footer reads "Updated as on May 16, 2019" yet lists airports and
    // visa types introduced well after that date. Its own stamp is unreliable,
    // so we record the date we read it instead.
    note: 'The page carries an unreliable self-reported update date. reviewedAt is our own read date.',
  },
  voa: {
    id: 'voa',
    title: 'Visa on Arrival — Indian Visa Online',
    url: 'https://www.indianvisaonline.gov.in/visa/visa-on-arrival.html',
    establishes:
      'Which nationalities may seek Visa on Arrival, the UAE prior-visa condition, permitted purposes, the 60-day limit, the six designated airports, the fee and the exclusions.',
    reviewedAt: REVIEWED_AT,
    confidence: 'high',
  },
  categories: {
    id: 'categories',
    title: 'Visa categories — Indian Visa Online',
    url: 'https://www.indianvisaonline.gov.in/visa/visa-category.html',
    establishes: 'The twelve regular (paper) visa categories issued through Indian Missions and Posts.',
    reviewedAt: REVIEWED_AT,
    confidence: 'high',
  },
  portal: {
    id: 'portal',
    title: 'Indian Visa Online — official portal',
    url: 'https://indianvisaonline.gov.in/',
    establishes:
      'The canonical entry point for every real application, and the official advisory against paying intermediaries.',
    reviewedAt: REVIEWED_AT,
    confidence: 'high',
  },
  afghan: {
    id: 'afghan',
    title: 'Visa for Afghanistan — Indian Visa Online',
    url: 'https://indianvisaonline.gov.in/avisa/',
    establishes:
      'That Afghan nationals apply through a separate portal, the six categories available to them, and the mandatory Tazkira upload.',
    reviewedAt: REVIEWED_AT,
    confidence: 'high',
  },
  earrival: {
    id: 'earrival',
    title: 'e-Arrival Card — Indian Visa Online',
    url: 'https://indianvisaonline.gov.in/earrival/',
    establishes: 'The official place to file the e-Arrival Card.',
    reviewedAt: REVIEWED_AT,
    confidence: 'medium',
    note: 'The URL is linked from the official portal home page and is high confidence. The page itself is a client-rendered app whose content we could not read, so its detail is cited from the mission notices below instead.',
  },
  earrivalOci: {
    id: 'earrivalOci',
    title: 'Digitization of Disembarkation Card — Consulate General of India, San Francisco',
    url: 'https://www.cgisf.gov.in/section/public-advisories/digitization-of-disembarkation-card-for-foreign-nationals-visiting-india/',
    establishes:
      'That from 1 October 2025 all foreign nationals, including OCI cardholders, complete the e-Arrival Card before entering India.',
    reviewedAt: REVIEWED_AT,
    confidence: 'high',
  },
  earrivalWindow: {
    id: 'earrivalWindow',
    title: 'e-Arrival Card notice — Permanent Mission of India to the United Nations',
    url: 'https://pmindiaun.gov.in/notice/Mzkx',
    establishes: 'The 72-hour filing window before arrival in India.',
    reviewedAt: REVIEWED_AT,
    confidence: 'medium',
    note: 'Official Government of India mission domain, but the notice is undated and we could not corroborate the 72-hour figure on boi.gov.in, which returned 404 on every path tried on the review date. Treat the window as guidance and confirm officially.',
  },
};

/**
 * The official e-Visa helpline. This is a real contact published by the
 * Government of India. This prototype has no support team of its own and must
 * never pretend otherwise — every "contact us" path ends here.
 */
export const OFFICIAL_CONTACT = {
  phones: ['+91 8278087808', '+91 11 24300666'],
  email: 'indian-evisa@gov.in',
  source: SOURCES.evisa,
};

/**
 * Reproduced from the official portal. Worth repeating verbatim because the
 * single most common harm around visa services is an intermediary charging for
 * something the government provides free.
 */
export const INTERMEDIARY_WARNING =
  'The Government of India does not authorise any agent or intermediary to charge fees for emergency visas, express visas, e-Visas or the e-Arrival Card. Services are completely online and no facilitator is required.';

export const SOURCE_LIST = Object.values(SOURCES);

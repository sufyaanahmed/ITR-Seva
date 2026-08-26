/**
 * The route and service registry — one source of truth.
 *
 * Read by: App.jsx (route table + lazy chunk boundaries), the header and
 * footer navigation, breadcrumbs, the document title setter, the sitemap page,
 * the agent-documentation generator, and the route smoke tests.
 *
 * `component` stays a thunk rather than a resolved module so that
 * scripts/generate-agent-docs.mjs can read every other key in plain Node
 * without needing a JSX transform.
 */

export const SITE_NAME = 'Visa-Seva';
export const SITE_TAGLINE = 'Prototype';

export const ROUTES = [
  /* ---- Public service routes ------------------------------------------ */
  {
    id: 'home',
    path: '/',
    title: 'Plan your Indian visa',
    navLabel: 'Home',
    description: 'Choose a task: find a likely visa path, start or resume a demo application, or track one.',
    group: 'service',
    nav: [],
    parent: null,
    heading: 'Plan your Indian visa',
    component: () => import('../pages/Home.jsx'),
  },
  {
    id: 'find',
    path: '/find/q/:step',
    title: 'Find my visa',
    navLabel: 'Find my visa',
    description: 'Six questions that produce a conservative, sourced suggestion of the likely visa path.',
    group: 'guide',
    nav: ['header', 'footer'],
    parent: 'home',
    heading: 'Find my visa',
    agentActions: ['ANSWER_FINDER_QUESTION', 'EVALUATE_VISA_PATH'],
    component: () => import('../pages/Find.jsx'),
  },
  {
    id: 'find-result',
    path: '/find/result',
    title: 'Your likely visa path',
    description: 'The suggested route, why it was suggested, the source it cites, and when that source was read.',
    group: 'guide',
    nav: [],
    parent: 'find',
    heading: 'Your likely visa path',
    agentActions: ['START_APPLICATION'],
    component: () => import('../pages/FindResult.jsx'),
  },
  {
    id: 'start',
    path: '/start',
    title: 'Start or resume',
    navLabel: 'Start or resume',
    description: 'The only place a demo application is created, and where a saved draft is picked up again.',
    group: 'service',
    nav: ['header', 'footer'],
    parent: 'home',
    heading: 'Start or resume an application',
    agentActions: ['START_APPLICATION', 'RESUME_APPLICATION'],
    component: () => import('../pages/Start.jsx'),
  },
  {
    id: 'track',
    path: '/track',
    title: 'Track an application',
    navLabel: 'Track application',
    description: 'Look up a demo application using its application ID and access code.',
    group: 'service',
    nav: ['header', 'footer'],
    parent: 'home',
    heading: 'Track an application',
    agentActions: ['CHECK_STATUS'],
    component: () => import('../pages/Track.jsx'),
  },
  {
    id: 'requirements',
    path: '/requirements',
    title: 'Documents and requirements',
    navLabel: 'Documents and requirements',
    description: 'What each visa route asks for, readable before starting anything.',
    group: 'guide',
    nav: ['header', 'footer'],
    parent: 'home',
    heading: 'Documents and requirements',
    component: () => import('../pages/Requirements.jsx'),
  },
  {
    id: 'requirements-path',
    path: '/requirements/:pathId',
    title: 'Requirements',
    description: 'The document list, conditions and official source for one visa route.',
    group: 'guide',
    nav: [],
    parent: 'requirements',
    heading: 'Requirements',
    component: () => import('../pages/RequirementsPath.jsx'),
  },
  {
    id: 'before-you-travel',
    path: '/before-you-travel',
    title: 'Before you travel',
    navLabel: 'Before you travel',
    description: 'Arrival readiness: what to carry, which ports accept an e-Visa, and what the e-Arrival Card is.',
    group: 'guide',
    nav: ['header', 'footer'],
    parent: 'home',
    heading: 'Before you travel',
    component: () => import('../pages/BeforeYouTravel.jsx'),
  },
  {
    id: 'help',
    path: '/help',
    title: 'Help',
    navLabel: 'Help',
    description: 'Common questions, a plain-language glossary, and the real official contacts.',
    group: 'info',
    nav: ['header', 'footer'],
    parent: 'home',
    heading: 'Help',
    component: () => import('../pages/Help.jsx'),
  },
  {
    id: 'your-data',
    path: '/help/your-data',
    title: 'Your data on this device',
    description: 'Exactly what is stored in this browser, why, and how to clear it.',
    group: 'info',
    nav: ['footer'],
    parent: 'help',
    heading: 'Your data on this device',
    agentActions: ['CLEAR_DEMO_DATA'],
    component: () => import('../pages/YourData.jsx'),
  },
  {
    id: 'discover',
    path: '/discover-india',
    title: 'Discover India',
    navLabel: 'Discover India',
    description: 'A short editorial on the country the visa is for. Not part of any application task.',
    group: 'info',
    nav: ['footer'],
    parent: 'home',
    heading: 'Discover India',
    component: () => import('../pages/Discover.jsx'),
  },

  /* ---- Judge / reviewer surface --------------------------------------- */
  {
    id: 'demo',
    path: '/demo',
    title: 'Demo scenarios',
    navLabel: 'Demo scenarios',
    description: 'Seeded lifecycle scenarios and accessibility modes, for reviewers and testers.',
    group: 'demo',
    nav: [],
    parent: 'home',
    heading: 'Demo scenarios',
    agentActions: ['LOAD_DEMO_SCENARIO', 'SET_CONNECTION_MODE'],
    component: () => import('../pages/Demo.jsx'),
  },

  /* ---- Application-scoped --------------------------------------------- */
  {
    id: 'application',
    path: '/application/:appId',
    title: 'Your application',
    description: 'The dashboard for one demo application: status, next action, stages and record actions.',
    group: 'application',
    nav: [],
    parent: 'home',
    heading: 'Your application',
    agentActions: ['READ_APPLICATION_STATE'],
    component: () => import('../pages/Application.jsx'),
  },
  {
    id: 'application-stage',
    path: '/application/:appId/stage/:stageId',
    title: 'Application stage',
    description: 'One stage of the demo application form.',
    group: 'application',
    nav: [],
    parent: 'application',
    heading: 'Application stage',
    agentActions: ['EDIT_FIELD', 'SAVE_APPLICATION', 'NEXT_STAGE', 'PREVIOUS_STAGE', 'SELECT_DOCUMENT'],
    component: () => import('../pages/Stage.jsx'),
  },
  {
    id: 'application-review',
    path: '/application/:appId/review',
    title: 'Review and resolve',
    description: 'Issues first, then a full read-only summary with per-section edit links.',
    group: 'application',
    nav: [],
    parent: 'application',
    heading: 'Review and resolve',
    agentActions: ['REVIEW_APPLICATION'],
    component: () => import('../pages/Review.jsx'),
  },
  {
    id: 'application-payment',
    path: '/application/:appId/payment',
    title: 'Simulated payment',
    description: 'A fee breakdown and a simulated payment. This page has no field that accepts card details.',
    group: 'application',
    nav: [],
    parent: 'application',
    heading: 'Simulated payment',
    agentActions: ['SIMULATE_PAYMENT'],
    component: () => import('../pages/Payment.jsx'),
  },
  {
    id: 'application-submit',
    path: '/application/:appId/submit',
    title: 'Confirm submission',
    description: 'The single commitment gate. Requires an explicit human confirmation.',
    group: 'application',
    nav: [],
    parent: 'application',
    heading: 'Confirm submission',
    agentActions: ['CONFIRM_SUBMIT'],
    component: () => import('../pages/Submit.jsx'),
  },
  {
    id: 'application-status',
    path: '/application/:appId/status',
    title: 'Application status',
    description: 'Status, next action and the timeline derived from the record’s own events.',
    group: 'application',
    nav: [],
    parent: 'application',
    heading: 'Application status',
    agentActions: ['READ_APPLICATION_STATE'],
    component: () => import('../pages/Status.jsx'),
  },
  {
    id: 'application-documents-requested',
    path: '/application/:appId/documents-requested',
    title: 'Documents requested',
    description: 'Respond to a request for a replacement document.',
    group: 'application',
    nav: [],
    parent: 'application-status',
    heading: 'Documents requested',
    agentActions: ['SELECT_DOCUMENT', 'RESUBMIT_DOCUMENTS'],
    component: () => import('../pages/DocumentsRequested.jsx'),
  },
  {
    id: 'application-print',
    path: '/application/:appId/print',
    title: 'Print demo application',
    description: 'A printable copy of the demo record, watermarked as a prototype on every page.',
    group: 'application',
    nav: [],
    parent: 'application',
    heading: 'Demo application record',
    agentActions: ['PRINT_APPLICATION'],
    component: () => import('../pages/Print.jsx'),
  },

  /* ---- System ---------------------------------------------------------- */
  {
    id: 'site-map',
    path: '/site-map',
    title: 'Site map',
    description: 'Every route in this prototype, grouped, with a one-line purpose.',
    group: 'info',
    nav: ['footer'],
    parent: 'home',
    heading: 'Site map',
    component: () => import('../pages/SiteMap.jsx'),
  },
  {
    id: 'not-found',
    path: '*',
    title: 'Page not found',
    description: 'Recovery page for an address that does not exist.',
    group: 'system',
    nav: [],
    parent: 'home',
    heading: 'This page is not here',
    component: () => import('../pages/NotFound.jsx'),
  },
];

/**
 * Old paths kept alive as redirects. The previous version of this prototype
 * shipped these, and links to them may exist; a moved page should never become
 * a 404.
 */
export const REDIRECTS = [
  { from: '/guide/visa-finder', to: '/find/q/1' },
  { from: '/find', to: '/find/q/1' },
  { from: '/flow/normal', to: '/requirements/evisa' },
  { from: '/flow/voa', to: '/requirements/voa' },
  { from: '/flow/regular', to: '/requirements/regular' },
  { from: '/flow/afghan', to: '/requirements/afghan' },
  { from: '/tourism', to: '/discover-india' },
  { from: '/resume', to: '/start' },
  { from: '/service', to: '/start' },
  // /apply, /dashboard and /status need the active application id, so they are
  // resolved at runtime by ActiveApplicationRedirect rather than statically.
];

export const byId = Object.fromEntries(ROUTES.map((r) => [r.id, r]));

export const navRoutes = (where) => ROUTES.filter((r) => r.nav?.includes(where));

/** Breadcrumb chain, root first. */
export function crumbs(id) {
  const out = [];
  for (let r = byId[id]; r; r = r.parent ? byId[r.parent] : null) out.unshift(r);
  return out;
}

/** The document title for a route. */
export function pageTitle(route) {
  if (!route) return `${SITE_NAME} — ${SITE_TAGLINE}`;
  if (route.id === 'home') return `${SITE_NAME} — Indian visa guidance (${SITE_TAGLINE})`;
  return `${route.title} — ${SITE_NAME} (${SITE_TAGLINE})`;
}

/** Match a pathname to a registry entry. Used by the shell and by tests. */
export function routeForPath(pathname) {
  const segs = pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  let fallback = byId['not-found'];
  for (const r of ROUTES) {
    if (r.path === '*') continue;
    const rs = r.path.split('/').filter(Boolean);
    if (rs.length !== segs.length) continue;
    if (rs.every((s, i) => s.startsWith(':') || s === segs[i])) return r;
  }
  if (segs.length === 0) return byId.home;
  return fallback;
}

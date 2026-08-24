# Implementation decisions and release record

This is the reasoning record for KarSaathi’s Build What Moves India submission. It distinguishes the implemented product from future ideas and lists the evidence and release work still required.

Baseline audited: commit `c3ba343` on 25 August 2026. Post-audit hardening listed below is present in the working branch and must be committed and pushed before it is treated as shipped.

Local evidence on the post-audit hardening tree: `npm ci`, lint, 6 test files / 39 tests, production build, and `npm audit` pass; npm reported 0 known vulnerabilities on 25 August 2026. A local rendered-browser pass covered the happy/uncertain outcomes, 404 recovery, 390/768/1440 px overflow, 44 px question targets, mobile progress, and console warnings/errors. Public deployment and the remaining manual accessibility/release gates stay open.

## Decision 1 — Solve readiness, not e-filing

**Implemented:** KarSaathi helps one fictional first-time salaried taxpayer understand four records, resolve two evidence issues, answer filing questions, view a likely route and illustrative regime comparison, and leave with a Tax Health report.

**Why:** The [Builder Brief](https://buildwhatmovesindia.com/brief) rewards one clear problem, a complete citizen journey, usability, end-to-end thinking, and honesty. A pre-filing readiness journey can be completed safely without a live government integration.

**Rejected alternatives:** Rebuilding the Income Tax portal; retaining login, payments, refund status, grievances, company/firm dashboards, or the old 18-step filing simulation.

**Evidence:** `src/App.jsx`, `src/pages/Home.jsx`, `src/pages/Journey.jsx`, and the removal of legacy public/dashboard routes from the shipped route tree.

**Risk / remaining work:** The problem evidence is official-document research plus anecdotal signals, not moderated citizen interviews. Run usability sessions with first-time filers after the hackathon.

## Decision 2 — Use one immediate fictional scenario

**Implemented:** Rahul Sharma is a bundled, deterministic persona. The product has no account, credential, identifier, document-upload, payment, OTP, or real-data entry path.

**Why:** It removes setup friction and complies with the brief’s synthetic-data requirement. A judge can start immediately and reproduce the same outcome.

**Rejected alternatives:** Persona selection, mock authentication, user-entered PAN, real uploads, OCR, or sample credentials.

**Evidence:** `src/data/demoPersona.js`, `src/pages/Privacy.jsx`, and the absence of login/upload routes in `src/App.jsx`.

**Risk / remaining work:** The one scenario cannot establish broad tax coverage. Keep the scope label visible and never market it as a general filing product.

## Decision 3 — Keep one linear five-step citizen path

**Implemented:** Sample documents → compare records → quick questions → result → readiness report. The homepage has one primary demo action. The post-audit version locks future steps, redirects direct deep links that lack prerequisites, presents seven labelled questions in one predictable section, and accepts “Not sure” as a valid needs-attention outcome.

**Why:** This is familiar to a low-confidence user, limits cognitive load, and ensures the video can show the whole value loop.

**Rejected alternatives:** Dashboard navigation, a service catalogue, multi-page branching questionnaires, and forcing a confident answer.

**Evidence:** `src/components/StepNav.jsx`, `src/pages/Journey.jsx`, `src/context/AppContext.jsx`, and `src/test/appJourney.test.jsx`.

**Risk / remaining work:** Automated tests cover the supported happy path, one guarded deep link, malformed saved state, and a “Not sure” report. They do not exhaust browser history, every deep link, print/export, or reset/resume combinations. Complete the manual release checklist below and add broader regression tests after submission.

## Decision 4 — Treat reconciliation as the core interaction

**Implemented:** Five normalized evidence groups expose three matches and two deliberate issues: a repeated AIS savings-interest entry and fixed-deposit interest absent from AIS. A user can record the safe demo resolution or leave an item unresolved; Tax Health changes accordingly. Post-audit validation ignores malformed or stale persisted resolutions.

**Why:** It demonstrates something more useful than static tax content while remaining understandable and deterministic.

**Rejected alternatives:** Automatically correcting AIS, claiming to send AIS feedback, hiding discrepancies, or building separate AIS/26AS mini-products.

**Evidence:** `src/domain/reconciliation.js`, `src/data/demoPersona.js`, `src/test/reconciliation.test.js`, and `src/test/readinessReport.test.js`.

**Risk / remaining work:** The resolutions are teaching choices, not a complete evidence-audit process. Production use would need provenance, audit trails, document verification, and qualified tax review.

## Decision 5 — Keep decisions deterministic; use AI only to explain

**Implemented:** JavaScript rules own reconciliation, the indicative ITR route, tax comparison, and readiness state. The optional `/api/guidance` endpoint uses the OpenAI Responses API and Structured Outputs to explain one of three preset topics from a supplied official fact. The API key stays server-side, `store` is false, citations are replaced with the canonical supplied citation, and the client falls back to local copy.

Post-audit hardening allowlists topic/language/context, validates model output again on the server, bounds rate-limit memory, hashes rate keys, and sends `no-store` and `nosniff` response headers.

**Why:** AI adds plain-language value without becoming the authority for money or eligibility. The core journey remains useful offline and without a key. Official OpenAI documentation confirms that `gpt-5.4-mini` supports the Responses API and Structured Outputs.

**Rejected alternatives:** Chat-first UX, free-form tax questions, model-calculated tax, model-selected ITR forms, or exposing an API key to Vite.

**Evidence:** `api/guidance.js`, `src/components/AssistantPanel.jsx`, `src/pages/Methodology.jsx`, `.env.example`, and `src/test/guidanceApi.test.js`.

**Risk / remaining work:** The in-memory limiter is best-effort per warm serverless instance, not a distributed production quota. A production service needs an external rate-limit store, abuse monitoring, budget alerts, model-version evaluation, and a tested Hindi content review. The visible journey itself is English; Hindi is not claimed as a complete localisation.

## Decision 6 — Make form guidance conservative

**Implemented:** Seven high-signal questions produce one of three results: likely ITR-1 candidate, professional/different-form review, or insufficient information. Complex or unknown answers do not receive a confident simple result. Post-audit input validation rejects invalid types and impossible values.

**Why:** A safe false negative is preferable to an unsafe filing recommendation. The official ITR page says its own overview is not exhaustive.

**Rejected alternatives:** Inferring a form from salary alone, claiming legal certainty, or modelling every ITR schedule.

**Evidence:** `src/domain/filingRecommendation.js`, `src/test/filingRecommendation.test.js`, and the dated source link in the result UI.

**Risk / remaining work:** This is a routing aid, not a complete eligibility engine. A qualified reviewer must approve the question set and wording before use beyond the fictional demo.

## Decision 7 — Show a bounded visual tax comparison

**Implemented:** A pure calculator compares old and new regimes for Rahul’s supported salary and ordinary bank-interest case. It models the selected slab/rebate/cess assumptions and supported Section 80C/80D deductions, blocks named complex-income categories, and exposes its arithmetic. Post-audit hardening validates numeric inputs, caps the salary standard deduction at salary, and automatically blocks income above ₹50 lakh because surcharge is not modelled.

**Why:** A small comparison helps the user understand consequences without turning KarSaathi into an open-ended tax calculator.

**Rejected alternatives:** A flat percentage, sliders and editable slabs, special-rate calculations, surcharge modelling, or presenting a payable/refund figure.

**Evidence:** `src/domain/taxCalculator.js`, `src/test/taxCalculator.test.js`, `src/data/officialSources.js`, and the result screen.

**Risk / remaining work:** The illustration is intentionally incomplete. It does not model all exemptions or deductions, including a possible Section 80TTA treatment, nor every age/family nuance, marginal-relief edge, statutory rounding rule, or tax-credit/payable computation. A qualified tax professional must validate every rule and the Rahul output before recording the final video. Keep “illustrative” and “not tax advice” visible.

## Decision 8 — Persist only local demo progress

**Implemented:** Versioned local storage holds language, fictional answers, fictional resolutions, and started state. Invalid JSON, malformed version-1 shapes, or another schema version fall back to safe values. Storage write failures do not break the demo. Reset removes answers and resolutions while preserving the language choice.

**Why:** A judge can refresh/resume without a database, and no real personal data is collected.

**Rejected alternatives:** Accounts, cookies, analytics, server storage, and background tracking.

**Evidence:** `src/context/AppContext.jsx` and `src/pages/Privacy.jsx`.

**Risk / remaining work:** A malformed-storage regression test exists, but there is no version-migration test. Add migrations and migration tests if the schema evolves rather than accepting arbitrary version-1 properties indefinitely.

## Decision 9 — Prefer accessible, low-bandwidth primitives

**Implemented:** Semantic landmarks, skip link, focus styles, labelled fieldsets, status words plus colour, reduced-motion handling, responsive evidence cards, small system-font assets, print CSS, JSON export, an error boundary, and a 404 page. Post-audit changes add a compact mobile step-progress view, locked-step semantics, safer deep-route guards, and explicit new-tab labels.

**Why:** The brief explicitly includes mobile users, slower connections, and people with limited digital experience.

**Rejected alternatives:** Splash loaders, video backgrounds, decorative animation, desktop-only tables, and a large component library.

**Evidence:** `src/index.css`, `src/components/AppShell.jsx`, `src/components/ErrorBoundary.jsx`, `src/pages/NotFound.jsx`, and `src/pages/Journey.jsx`.

**Risk / remaining work:** There is no automated accessibility audit. Local rendered QA confirmed the happy and “Not sure” paths, mobile progress/touch sizing, no horizontal overflow at 390/768/1440 px, 404 recovery, and no captured console warnings/errors. Keyboard-only navigation, a real 200% browser zoom, screen-reader smoke, print/export, and every check on the exact deployment remain required.

## Decision 10 — Deploy as a Vercel SPA plus one serverless endpoint

**Implemented:** `vercel.json` provides SPA rewrites while leaving `/api/guidance` available as a function. Security headers include `nosniff`, referrer policy, permissions policy, and—post audit—CSP plus frame denial.

**Why:** It is a minimal deployment shape for a public browser link and keeps the optional API key off the client.

**Rejected alternatives:** A database-backed backend, container platform, or a client-side OpenAI call.

**Evidence:** `vercel.json`, `api/guidance.js`, `.env.example`, and the production Vite build.

**Risk / remaining work:** PR #1’s Vercel status is currently failing because the repository/account authorization is not connected. This is an external deployment blocker even though the local build passes. Reconnect Vercel or deploy the same commit through an authorised project, then verify root, deep routes, API fallback/configured mode, headers, and the signed-out public link.

## Decision 11 — Add repeatable quality gates without hiding an auth gap

**Implemented:** ESLint, Vitest, React Testing Library, and a deterministic `test:run` script. The repeatable release sequence is `npm ci`, lint, `test:run`, build, audit, and rendered-browser QA. Deployment headers add a second lightweight release guard.

**Why:** Judges need a working build, and a PR should not rely only on one laptop’s environment.

**Rejected alternatives:** Manual-only validation, treating the watch-mode test command as a release check, or silently expanding GitHub OAuth permissions.

**Evidence:** `eslint.config.js`, `vitest.config.js`, `src/test/`, `package.json`, `vercel.json`, and the verification records below.

**Risk / remaining work:** A GitHub Actions workflow was prepared, but GitHub refused the push because the active OAuth session has repository scope without the separate `workflow` scope. It was removed rather than requesting broader account authority implicitly. An authorised maintainer should add CI that runs the documented sequence. `npm ci` also prints an ESLint support/deprecation warning even though the vulnerability audit is clean; move to a supported ESLint release after checking plugin compatibility.

## Decision 12 — Defer unrelated attractive features

**Implemented now:** trustworthy homepage, tax journey, personalised questions, embedded visual concepts, reconciliation, Tax Health, scoped regime comparison, print/JSON report, and preset explanations.

**Deferred:** Notice Simplifier, “Where Does My Tax Go?”, uploads/OCR, comprehensive calculators, full Hindi localisation, real accounts, payments, filing, e-verification, and government integration.

**Why:** The FAQ says every demonstrated feature must work. These ideas create separate user journeys or safety obligations and would dilute the three-minute core path.

**Evidence:** `README.md`, `docs/research.md`, and the small public route surface in `src/App.jsx`.

## PR rationale

PR #1 should be evaluated as a substantial product replacement, not a cosmetic change to the inherited portal clone:

- the old official-looking, multi-service simulation is removed from the shipped route tree;
- the citizen problem and target user are explicit;
- the primary path is complete with deterministic state changes;
- synthetic/mock boundaries and previous-project provenance are disclosed;
- Codex contribution is documented;
- backend/API, privacy, scaling, and failure behaviour are considered;
- automated checks cover the central domain and happy-path journey.

Before merge, update the PR verification section to the final commit’s test count and link the successful deployment checks. Do not call the product release-ready while the deployment status is failing.

## Final execution checklist

### Commit and PR

- [ ] Review the post-`c3ba343` hardening diff; commit and push it.
- [ ] Have an authorised maintainer add CI for the documented clean install, lint, test, build, and audit sequence.
- [ ] Confirm the PR is mergeable and every required check is green.
- [ ] Update the PR body with the final SHA, exact test count, deployment URL, and this decision log.
- [ ] Keep the known tax and production limitations in the PR; do not describe the prototype as filing-ready software.

### Clean validation on the final SHA

- [x] `npm ci` — passed locally on 25 August 2026.
- [x] `npm run lint` — passed on the post-audit hardening tree.
- [x] `npm run test:run` — 6 files, 39 tests passed on the post-audit hardening tree.
- [x] `npm run build` — passed on the post-audit hardening tree.
- [x] `npm audit` — 0 known vulnerabilities reported on 25 August 2026.
- [x] `git diff --check` — passed.
- [ ] Confirm a clean working tree after the hardening/docs commit.

### Tax and content review

- [ ] Qualified reviewer checks AY 2026–27 ITR-1 routing copy.
- [ ] Qualified reviewer checks slabs, standard deductions, 87A rebates, marginal relief, cess, Section 80C/80D scope, excluded deductions/exemptions, and rounding.
- [ ] Confirm every official link still resolves and every access date is accurate.
- [ ] Confirm the fictional identifiers and amounts cannot be mistaken for real records.
- [ ] Verify the under-250-word summary still matches the deployed behaviour.

### Deployment

- [ ] Resolve the Vercel GitHub authorization failure or use another authorised public deployment.
- [ ] Deploy the final PR head, not only `c3ba343`.
- [ ] Configure `OPENAI_API_KEY` and `OPENAI_MODEL` only if the optional AI mode will be demonstrated.
- [ ] Verify `/`, `/demo/documents`, `/demo/report` redirect/guard behaviour, `/methodology`, `/privacy`, and an unknown route while signed out.
- [ ] Verify `/api/guidance` in offline mode and configured AI mode; ensure no secret appears in client assets or browser logs.
- [ ] Verify CSP/frame/referrer/permissions/content-type headers on the public URL.
- [ ] Test the public URL in an incognito window with no access request.

### Citizen and accessibility QA

- [ ] Complete fresh, unresolved, resolved, “Not sure,” complex-case, refresh/resume, reset, back/forward, print, JSON export, and 404 paths.
- [ ] Test keyboard-only operation and visible focus.
- [x] Test 390 px, 768 px, and 1440 px locally with no horizontal overflow; repeat on deployment and test true 200% browser zoom.
- [ ] Check reduced motion, status announcements, mobile evidence records, and print output.
- [x] Confirm no browser console warnings/errors on the local happy/uncertain path; repeat on the exact deployed video path.
- [ ] Test on a throttled connection; confirm offline explanation fallback is useful.

### Submission

- [ ] Record the exact deployed path in under one minute as the citizen.
- [ ] Use minute two for architecture, Codex contribution, safety, and product decisions.
- [ ] Keep the final video at or below two minutes and test its public link while signed out.
- [ ] Add the final application URL, video URL, deployed SHA, and validation timestamp to `docs/judge-checklist.md`.
- [ ] Complete solo/team registration details and use the same registered email throughout.
- [ ] Submit before 28 August 2026 at 8:00 PM IST; the official site states there is no grace period.

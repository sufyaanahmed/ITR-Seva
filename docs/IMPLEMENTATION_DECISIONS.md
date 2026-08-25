# Implementation decisions and release record

This is the reasoning record for KarSaathi’s Build What Moves India submission. It distinguishes the implemented product from future ideas and lists the evidence and release work still required.

Baseline audited: commit `c3ba343` on 25 August 2026. Post-audit hardening listed below is present in the working branch and must be committed and pushed before it is treated as shipped.

Local evidence: the pre-expansion hardening tree passed 39 tests; the integrated three-profile tree passes lint, 9 test files / 56 tests, production build, diff checks, and a current npm audit with 0 known vulnerabilities on 25 August 2026. Responsive rendered QA covered the selector, company and LLP results, 390/768/1440 px overflow, 46 px selector actions, copy isolation, and console warnings/errors. Public deployment and the remaining manual accessibility/release gates stay open.

**Feedback-driven iteration status:** stakeholder feedback on 25 August 2026 correctly identified that the prototype assumed one taxpayer type. The integrated iteration adds three bounded synthetic journeys—individual, domestic private company, and firm/LLP—without changing the five-step mental model. Local lint, 56 tests, production build, diff checks, and responsive browser QA pass. Qualified tax-content review and deployed verification remain pending.

## Decision 1 — Solve readiness, not e-filing

**Implemented in the feedback iteration:** KarSaathi supports three bounded fictional readiness journeys: a salaried individual, a domestic private company, and a partnership firm/LLP. Each helps the user understand relevant records, compare or review the record pack, answer high-signal questions, view a likely return route, and leave with a Tax Health report. Only the individual sample includes the scoped regime illustration.

**Why:** The [Builder Brief](https://buildwhatmovesindia.com/brief) rewards one clear problem, a complete citizen journey, usability, end-to-end thinking, and honesty. A pre-filing readiness journey can be completed safely without a live government integration.

**Rejected alternatives:** Rebuilding the Income Tax portal; retaining login, payments, refund status, grievances, broad company/firm dashboards, or the old 18-step filing simulation.

**Evidence:** `src/App.jsx`, `src/pages/Home.jsx`, `src/pages/DemoSelector.jsx`, `src/pages/Journey.jsx`, `src/pages/EntityJourney.jsx`, integration tests, and responsive rendered QA.

**Risk / remaining work:** The problem evidence is official-document research plus stakeholder and anecdotal signals, not moderated research across all three audiences. Run usability sessions with individuals, small-company operators and firm/LLP preparers after the hackathon.

## Decision 2 — Use three explicit, bounded fictional scenarios

**Implemented in the feedback iteration:** A selector offers Rahul Sharma (individual), Aster Components Private Limited (domestic company), and Mehta & Rao Advisory LLP (firm/LLP). All are bundled and deterministic. The product still has no account, credential, identifier, document-upload, payment, OTP, or real-data entry path.

**Why:** The original single Rahul scenario was clear but implicitly treated one user type as the whole product. Three explicit samples answer the stakeholder feedback while preserving synthetic data, reproducibility and immediate entry. A concrete LLP is used instead of claiming that one generic “non-company” flow covers materially different entities.

**Rejected alternatives:** Mock authentication; user-entered PAN; real uploads; OCR; sample credentials; an unbounded taxpayer wizard; or one “non-company” card that silently claims to cover firms, LLPs, HUFs, trusts, societies, AOPs and BOIs.

**Evidence:** `src/data/demoPersona.js`, `src/data/journeyProfiles.js`, `src/pages/DemoSelector.jsx`, `src/components/DemoRouteGuards.jsx`, `src/pages/Privacy.jsx`, the integration suite, and the absence of login/upload routes.

**Risk / remaining work:** Three samples still do not establish broad tax coverage. Keep the boundaries visible, describe the third sample as firm/LLP rather than universal non-company guidance, and never market KarSaathi as a general filing product.

## Decision 3 — Keep one linear five-step citizen path

**Implemented in the feedback iteration:** Every profile uses Sample records → compare/review records → quick questions → likely route → readiness report. The homepage retains one primary action leading to the profile selector. Future steps remain locked, guarded links validate the active profile’s prerequisites, and “Not sure” remains a valid needs-attention outcome.

**Why:** This is familiar to a low-confidence user, limits cognitive load, and ensures the video can show the whole value loop.

**Rejected alternatives:** Dashboard navigation, a service catalogue, multi-page branching questionnaires, and forcing a confident answer.

**Evidence:** `src/components/StepNav.jsx`, `src/pages/DemoSelector.jsx`, `src/pages/Journey.jsx`, `src/pages/EntityJourney.jsx`, `src/context/AppContext.jsx`, journey integration tests, and responsive rendered QA.

**Risk / remaining work:** The earlier tests cover only the individual happy path, one guarded deep link, malformed saved state, and a “Not sure” report. Add and pass tests for selection, all three paths, cross-profile isolation, no copy leakage, legacy routes, version migration, entity no-estimate states, browser history, print/export, and reset/resume before claiming this decision validated.

## Decision 4 — Treat reconciliation as the core interaction

**Implemented in the feedback iteration:** The individual retains five normalized evidence groups, its repeated AIS savings-interest entry, and missing fixed-deposit interest. The company and firm/LLP samples use a simpler three-item review pack: each record check can be marked “Looks ready,” “Add to review list,” or “Not sure.” A user therefore resolves concrete individual mismatches but never pretends to reconcile unseen entity figures. Tax Health changes from the selected profile’s bounded decisions, and unrelated saved IDs do not satisfy another profile’s checks.

**Why:** It demonstrates something more useful than static tax content while remaining understandable and deterministic. Entity review uses honest checklist state because the prototype does not display enough underlying entity evidence to support a monetary reconciliation.

**Rejected alternatives:** Automatically correcting AIS, claiming to send AIS feedback, hiding discrepancies, or building separate AIS/26AS mini-products.

**Evidence:** `src/data/demoPersona.js`, `src/data/journeyProfiles.js`, `src/domain/reconciliation.js`, `src/domain/entityJourney.js`, and the passing 56-test integrated suite.

**Risk / remaining work:** The resolutions are teaching choices, not a complete evidence-audit process. Production use would need provenance, audit trails, document verification, and qualified tax review.

## Decision 5 — Keep decisions deterministic; use AI only to explain

**Implemented:** JavaScript rules own reconciliation, the indicative ITR route, tax comparison, and readiness state. The optional `/api/guidance` endpoint uses the OpenAI Responses API and Structured Outputs to explain one of three preset topics from a supplied official fact. The API key stays server-side, `store` is false, citations are replaced with the canonical supplied citation, and the client falls back to local copy.

Post-audit hardening allowlists topic/language/context, validates model output again on the server, bounds rate-limit memory, hashes rate keys, and sends `no-store` and `nosniff` response headers.

**Why:** AI adds plain-language value without becoming the authority for money or eligibility. The core journey remains useful offline and without a key. Official OpenAI documentation confirms that `gpt-5.4-mini` supports the Responses API and Structured Outputs.

**Rejected alternatives:** Chat-first UX, free-form tax questions, model-calculated tax, model-selected ITR forms, or exposing an API key to Vite.

**Evidence:** `api/guidance.js`, `src/components/AssistantPanel.jsx`, `src/pages/Methodology.jsx`, `.env.example`, and `src/test/guidanceApi.test.js`.

**Risk / remaining work:** The in-memory limiter is best-effort per warm serverless instance, not a distributed production quota. A production service needs an external rate-limit store, abuse monitoring, budget alerts, model-version evaluation, and a tested Hindi content review. The visible journey itself is English; Hindi is not claimed as a complete localisation.

## Decision 6 — Make profile-specific form guidance conservative

**Implemented in the feedback iteration:** Profile-specific high-signal questions produce one of three result classes: a likely bounded return route, professional/different-form review, or insufficient information. The individual path may indicate ITR-1; the domestic-company path may indicate ITR-6 only within its stated Section 11 and profile boundary; the firm/LLP path may indicate ITR-5 only within its stated firm/LLP boundary. Complex, invalid or unknown answers do not receive a confident simple result.

**Why:** A safe false negative is preferable to an unsafe filing recommendation. The official ITR page says its own overview is not exhaustive.

**Rejected alternatives:** Inferring a form from salary alone, claiming legal certainty, or modelling every ITR schedule.

**Evidence:** `src/domain/filingRecommendation.js`, `src/domain/entityJourney.js`, their tests, `src/data/officialSources.js`, `src/data/journeyProfiles.js`, and the dated Income Tax Department link in each result UI. The integrated suite passes locally.

**Risk / remaining work:** These are routing aids, not complete eligibility engines. A qualified reviewer must approve all three question sets, exclusions, source dates and wording. In particular, do not infer that every partnership firm uses ITR-5 or that all non-company entities share the LLP path.

## Decision 7 — Calculate only where the prototype has a defensible boundary

**Implemented:** A pure calculator compares old and new regimes only for Rahul’s supported salary and ordinary bank-interest case. Company and firm/LLP result screens deliberately return an explanatory “not offered” state and no tax amount. The individual calculator models the selected slab/rebate/cess assumptions and supported Section 80C/80D deductions, blocks named complex-income categories, and exposes its arithmetic.

**Why:** A small individual comparison helps explain consequences without becoming an open-ended tax calculator. Reusing it for organisations or adding a superficial entity-rate calculation would ignore elections, entity facts, MAT and other rules and would create false precision.

**Rejected alternatives:** A flat entity percentage, copying the individual calculator into organisation journeys, sliders and editable slabs, special-rate calculations, surcharge/MAT modelling, or presenting a payable/refund figure.

**Evidence:** `src/domain/taxCalculator.js`, `src/domain/entityJourney.js`, their tests, `src/data/officialSources.js`, `src/data/journeyProfiles.js`, and the profile-specific result screens. Rendered QA confirmed both entity results omit a calculator and individual copy.

**Risk / remaining work:** The individual illustration remains intentionally incomplete. A qualified tax professional must validate every rule and the Rahul output before recording. Confirm that company and firm/LLP screens never render zero tax, reuse Rahul assumptions, describe omission as an error, or count the intentional no-estimate state as a readiness blocker.

## Decision 8 — Persist only isolated local demo progress

**Implemented in the feedback iteration:** Version-2 local storage holds the language choice plus separate fictional started, answer and resolution state for individual, company and firm/LLP journeys. A valid version-1 Rahul session migrates only into the individual slot. Invalid JSON, unknown profiles, malformed values and cross-profile resolution actions fall back safely. Reset clears only the selected sample while preserving language and other sample progress.

**Why:** A judge can switch samples and refresh/resume without a database, while profile isolation prevents Rahul answers or resolution IDs from leaking into an entity journey.

**Rejected alternatives:** Accounts, cookies, analytics, server storage, and background tracking.

**Evidence:** `src/context/AppContext.jsx`, `src/test/stateAndRouting.test.jsx`, and `src/pages/Privacy.jsx`. Migration, malformed-state, isolation, and per-profile reset tests pass.

**Risk / remaining work:** Safe v1 migration, malformed v2 recovery, cross-profile isolation, and per-profile reset are tested. A targeted storage-write-failure test and future schema migrations remain open.

## Decision 9 — Prefer accessible, low-bandwidth primitives

**Implemented:** Semantic landmarks, skip link, focus styles, labelled fieldsets, status words plus colour, reduced-motion handling, responsive evidence cards, small system-font assets, print CSS, JSON export, an error boundary, and a 404 page. Post-audit changes add a compact mobile step-progress view, locked-step semantics, safer deep-route guards, and explicit new-tab labels.

**Why:** The brief explicitly includes mobile users, slower connections, and people with limited digital experience.

**Rejected alternatives:** Splash loaders, video backgrounds, decorative animation, desktop-only tables, and a large component library.

**Evidence:** `src/index.css`, `src/components/AppShell.jsx`, `src/components/ErrorBoundary.jsx`, `src/pages/NotFound.jsx`, and `src/pages/Journey.jsx`.

**Risk / remaining work:** There is no automated accessibility audit. Local rendered QA covered the selector plus company and LLP results, 46 px selector actions, mobile progress, no horizontal overflow at 390/768/1440 px, no entity/individual copy leakage, and no captured console warnings/errors. Keyboard-only navigation, a real 200% browser zoom, screen-reader smoke, print/export, and every check on the exact deployment remain required.

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

**Why:** The FAQ says every demonstrated feature must work. These ideas create separate safety obligations and would dilute the short five-step path shared by the three selected samples.

**Evidence:** `README.md`, `docs/research.md`, and the small public route surface in `src/App.jsx`.

## Decision 13 — Respond to the single-user-type feedback without rebuilding a portal

**Feedback:** “This only has one flow … it only assumes one type of user.” The criticism was valid: the original navigation, fixtures, state, questions, recommendations, result copy and tests all assumed Rahul, a salaried individual.

**Implemented in the feedback iteration:** The homepage leads to one plain-language selector with three explicit fictional options: individual, domestic private company, and firm/LLP. The selected profile drives records, questions, mismatch actions, route indication, report copy and next steps while shared components keep the interaction identical. Canonical routes carry the profile ID, old `/demo/<step>` links redirect to the individual equivalent, and version-2 local state isolates progress per profile.

**Why:** The smallest credible response is not three unrelated applications. It is one familiar workflow with three truthful content models. This lets a low-confidence user first answer “whose return is this?” and then see only relevant material, while judges can compare the paths without relearning the interface.

**Deliberate boundaries:** The company example is a bounded domestic private company. The third option is a bounded partnership firm/LLP example, not universal “non-company” coverage. Company and firm/LLP calculations are omitted because a short generic calculator would be misleading; their result screens explain the omission and continue to a useful readiness report.

**Rejected alternatives:** Three dashboards; a large entity taxonomy; dynamic form builders; making the user enter real facts; relabelling Rahul without changing logic; a universal “non-company” answer; or displaying guessed entity tax.

**Evidence:** The integrated profile selector, registry, profile-aware route tree, scoped state, domain rules, reports, 56-test suite, production build, responsive rendered QA, and this decision record.

**Risk / remaining work:** Three demos may look broad even though each is narrow. The copy-leak scan, three-flow automated matrix, and responsive mobile pass are complete locally. Keep “fictional sample,” “likely route,” “not tax advice,” and profile limits close to the relevant decision; qualified primary-source review, keyboard QA, and public deep-link verification remain required.

## PR rationale

PR #1 should be evaluated as a substantial product replacement, not a cosmetic change to the inherited portal clone:

- the old official-looking, multi-service simulation is removed from the shipped route tree;
- the citizen problem and target user are explicit;
- the same primary path supports three explicitly bounded taxpayer samples with deterministic, isolated state changes;
- synthetic/mock boundaries and previous-project provenance are disclosed;
- Codex contribution is documented;
- backend/API, privacy, scaling, and failure behaviour are considered;
- automated checks cover the central domain, state migration/isolation, all three happy paths, and entity uncertainty.

Before merge, update the PR verification section to the final commit’s 56-test count and link successful deployment checks. Do not call the product release-ready while qualified tax review or deployment verification is pending.

## Final execution checklist

### Commit and PR

- [ ] Review the post-`c3ba343` hardening diff; commit and push it.
- [ ] Have an authorised maintainer add CI for the documented clean install, lint, test, build, and audit sequence.
- [ ] Confirm the PR is mergeable and every required check is green.
- [ ] Update the PR body with the final SHA, exact test count, deployment URL, and this decision log.
- [ ] Keep the known tax and production limitations in the PR; do not describe the prototype as filing-ready software.
- [ ] Explain the feedback-driven expansion and the intentional firm/LLP and entity-calculation boundaries in the PR body.

### Integrated local checks

- [x] `npm ci` — passed locally on 25 August 2026.
- [x] `npm run lint` — passed on the integrated three-profile tree.
- [x] `npm run test:run` — 9 files, 56 tests passed on the integrated three-profile tree.
- [x] `npm run build` — passed on the integrated three-profile tree.
- [x] `npm audit` — 0 known vulnerabilities reported on 25 August 2026.
- [x] `git diff --check` — passed.
- [ ] Confirm a clean working tree after the hardening/docs commit.

### Tax and content review

- [ ] Qualified reviewer checks AY 2026–27 ITR-1 routing copy.
- [ ] Qualified reviewer checks the bounded AY 2026–27 ITR-6 and ITR-5 route copy, exclusions and escalation wording.
- [ ] Qualified reviewer checks slabs, standard deductions, 87A rebates, marginal relief, cess, Section 80C/80D scope, excluded deductions/exemptions, and rounding.
- [ ] Confirm every official link still resolves and every access date is accurate.
- [ ] Confirm the fictional identifiers and amounts cannot be mistaken for real records.
- [ ] Verify the under-250-word summary still matches the deployed behaviour.
- [ ] Confirm company and firm/LLP pages explain that no entity estimate is offered and never render zero or individual assumptions.

### Deployment

- [ ] Resolve the Vercel GitHub authorization failure or use another authorised public deployment.
- [ ] Deploy the final PR head, not only `c3ba343`.
- [ ] Configure `OPENAI_API_KEY` and `OPENAI_MODEL` only if the optional AI mode will be demonstrated.
- [ ] Verify `/`, `/demo`, all canonical `/demo/<profile>/<step>` paths, legacy `/demo/documents` and `/demo/report` compatibility/guards, `/methodology`, `/privacy`, and unknown profile/route recovery while signed out.
- [ ] Verify `/api/guidance` in offline mode and configured AI mode; ensure no secret appears in client assets or browser logs.
- [ ] Verify CSP/frame/referrer/permissions/content-type headers on the public URL.
- [ ] Test the public URL in an incognito window with no access request.

### Citizen and accessibility QA

- [ ] Complete selection plus fresh, unresolved, resolved, “Not sure,” complex-case, refresh/resume, per-profile reset, profile switching, back/forward, print, JSON export, and 404 paths across all three samples.
- [ ] Confirm version-1 Rahul progress migrates only to individual and no names, records, answers or resolutions leak across profiles.
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

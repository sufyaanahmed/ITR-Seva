# Visa-Seva UI/UX Maxxing Plan

## Product north star

Visa-Seva should be a calm, trustworthy, low-bandwidth-friendly prototype that helps a traveller:

`Choose the right path -> Understand requirements -> Prepare a fictional demo application -> Save/resume -> Review -> Simulate submission/payment -> Track and act`

It should retain its memorable Indian editorial/heritage character while behaving like a precise public-service tool. A traveller should never confuse the prototype with an official government service or mistake its recommendation for authoritative immigration advice.

## Implementation status — verification iteration complete

The strategy below began as the audit of commit `379dc4d`. It has now been implemented and reviewed again by independent design, service-flow, and accessibility/engineering reviewers.

- The shell, finder, application lifecycle, display preferences, demo scenarios, print record, local-data controls, source register, machine-readable agent interface, and automated quality gates are implemented.
- Reviewer scenarios and a person's saved application are separate records; a fixture can never conceal or overwrite the saved draft.
- Visa on Arrival, regular-paper, and Afghan-national routes are guidance-only. The product does not invent an online application for an airport facility or a separate official route.
- The interface and progress ledger now use the same seven-stage journey from setup through simulated submission.
- Unverified travel imagery has been removed from the shipped product and replaced with restrained, code-drawn motifs.
- Verification passes: lint, 65 unit/contract tests, production build, and 20 desktop/mobile browser checks. The reproducible commands are documented in the repository README.

## Original repository baseline

- Repository: `https://github.com/sufyaanahmed/Visa-Seva.git`
- Audited commit: `379dc4d`
- Branch: `main`, aligned with `origin/main`
- Stack: React 19, React Router 7, Vite 8, Tailwind CSS 3, localStorage/IndexedDB
- Build: passes with `npm run build`
- Automated tests/lint: not currently configured

## What is worth preserving

- A distinctive ivory, indigo, terracotta, serif-led heritage design direction.
- A useful four-question Visa Finder concept.
- Separate Afghan, Visa-on-Arrival, e-Visa, and regular/paper paths.
- A readable six-step demo application with contextual help and local autosave.
- Personalised document requirements.
- A visually clear application dashboard and status timeline.
- The intent to support elderly users, low connectivity, accessibility, and AI agents through one semantic experience.

## Critical current-state findings

### Trust and safety

1. The specification requires a persistent “hackathon prototype—not official” banner on every page, but the UI only has a low-visibility footer sentence. The header uses the Indian emblem and the homepage says “Government of India,” creating a much stronger official impression than the disclaimer.
2. The Visa Finder presents deterministic eligibility decisions from a small hard-coded rule set. That is unsafe for changeable immigration rules.
3. Current Visa-on-Arrival logic only recognises Japan; the official portal also lists South Korea and conditionally eligible UAE nationals. Other conditions are also omitted.
4. Almost every nationality falls through to “eligible for e-Visa,” even when the official eligibility list or passport/origin restrictions may not support that conclusion.
5. Status can be queried by passport number alone in the demo. A real implementation would require stronger verification and privacy controls.
6. Personal/passport-like data is continuously persisted in localStorage and IndexedDB without a clear retention, clear-data, or device-sharing warning.

### Broken product loop

1. A submission ID is generated randomly during render, is not persisted, and cannot be looked up in the status mock database.
2. Payment simulation, document re-upload, print/PDF, deterministic resume access, and e-Arrival are absent despite being primary specification goals.
3. “Download PDF,” “Start e-Arrival,” “Contact Support,” “Accessibility,” and the language selector look functional but do nothing.
4. The e-Arrival announcement links back to generic status rather than a deliberate in-app explanation or the official e-Arrival destination.
5. `/demo` exists only as an unused placeholder component; there is no routed demo launcher or judge-ready scenario selection.
6. There is no 404 state, so unknown URLs render an empty shell.

### Navigation and responsive UX

1. The mobile header expands into a very tall vertical list instead of a compact menu.
2. The mobile homepage is over 5,500 px tall because editorial destination content dominates the service journey.
3. “Before You Travel” routes to application status, mixing two different tasks.
4. “My Application” always shows a default draft—even before the user intentionally starts one.
5. The full 3.1-second blocking welcome animation runs on hard entry to every route and ignores reduced-motion and low-bandwidth goals.
6. The footer’s blue text on a dark navy background has very low contrast.

### Forms and accessibility

1. Required fields rely mostly on native validation; there is no inline error model, error summary, or focus management.
2. The application lacks several steps and field groups described by its own specification.
3. The progress strip horizontally overflows instead of providing a compact mobile stage pattern.
4. Select options expose machine strings such as `single`, `married`, and `other` instead of polished human copy.
5. The Accessibility control has no behaviour; there is no text-size, contrast, spacing, motion, or read-aloud implementation.
6. Hindi is offered but does not change the interface.
7. No skip link, route-aware page titles, active navigation state, or not-found recovery is implemented.

### Architecture and delivery

1. Route components are eagerly imported; the tourism catalogue and application experience ship together.
2. There is no service worker, offline indicator, sync queue, data-saver mode, or network simulation despite the product promise.
3. `/agent.md` and `/llms.txt` are repository files, not verified public routes/assets; the documented route/action/field registries are not implemented.
4. UI structure, content, rules, and demo data are embedded directly in components, making policy drift likely.
5. No tests protect eligibility decisions, persistence, routing, form behaviour, accessibility, or the end-to-end demo.

## Strategy

### Phase 0 — Make the prototype safe and internally honest

- Replace “Government of India” brand claims with “Visa-Seva — Hackathon Prototype” or equivalent neutral language.
- Do not use the national emblem as the primary product logo. If retained for contextual demonstration, ensure it cannot be mistaken for official endorsement.
- Add a persistent, compact prototype strip to every public and application screen: “Prototype only — not an official visa service. Do not enter real personal or passport information.”
- Repeat the boundary before any document selection, payment simulation, submission, PDF, or status result.
- Add a visible “Go to the official Indian Visa portal” external link with an external-site label.
- Add a clear local-data panel: what is stored, on which device, for how long, and a “Clear demo data” action with confirmation.
- Rename all actions honestly: “Select demo file,” “Simulate payment,” “Generate demo application,” and “View demo status.”

Exit criteria: no page implies official affiliation; every commitment point is explicitly fictional; a shared-device user can understand and clear locally stored data.

### Phase 1 — Establish sourced, conservative guidance

- Move visa rules into versioned data modules instead of component conditionals.
- Every rule must include an official source URL, `reviewedAt` date, short rationale, and confidence/coverage state.
- Model Visa Finder results as `likely path`, `needs official confirmation`, or `insufficient information`—not guaranteed eligibility.
- Add relevant screening questions: passport type, Pakistani origin/ancestry where applicable, purpose, duration, prior Indian visa for conditional UAE VoA, and other conditions supported by official guidance.
- Provide a “Why this result?” explanation and “Check current official requirements” action.
- If the rules do not cover a case, route to official guidance instead of defaulting to e-Visa.
- Add unit tests for every decision branch, boundary condition, and fallback.
- Surface “Rules checked on [date]” anywhere a recommendation is shown.

Exit criteria: no unsupported eligibility promise; official sources are one click away; rules are testable and date-stamped.

### Phase 2 — Rebuild information architecture around traveller jobs

Recommended top-level navigation:

- Find my visa
- Start / resume application
- Track application
- Documents & requirements
- Before you travel
- Help
- Demo scenarios

Changes:

- Use a compact mobile menu with clear open/close state, focus trap, Escape support, and 44 px targets.
- Separate “Track application” from “Before you travel.”
- Put tourism storytelling after core service entry points, or move it to Discover India. Keep only one compact editorial teaser on the service homepage.
- Make homepage hierarchy: prototype boundary -> task selection -> how the demo works -> requirements/trust -> optional destination storytelling.
- Show Resume only when a real local draft exists; default state should not pretend a draft has been started.
- Add route-aware active navigation, breadcrumbs on deep flows, page titles, skip link, and 404 recovery.
- Create one route/service registry used by header, footer, cards, sitemap, agent metadata, and smoke tests.

Exit criteria: a first-time user can choose Find, Apply, Resume, or Track within five seconds on desktop or mobile; no navigation label leads to an unrelated task.

### Phase 3 — Complete one coherent demo lifecycle

Create a deterministic local demo data layer with entities for application, applicant, documents, payment, events, and verification/access code.

Lifecycle:

`Not started -> Draft -> Ready for review -> Submitted (demo) -> Payment pending/paid (demo) -> Processing -> Documents required / Granted / Refused`

Requirements:

- Generate and persist one stable demo application ID on start or submission.
- Make that same record appear in dashboard, resume, status, re-upload, print, and demo scenario screens.
- Add deterministic demo access codes and never use passport number alone as the only lookup factor.
- Add a demo scenario launcher for Granted, Processing, Documents Required, Refused, Offline Draft, and Low Vision/Elderly modes.
- Implement simulated payment with a clearly fictional summary, success/failure paths, and no real payment fields.
- Implement document-required and re-upload flows with fictional/demo-file warnings.
- Implement printable/downloadable demo application and ETA artifacts visibly watermarked “HACKATHON PROTOTYPE — NOT AN OFFICIAL VISA DOCUMENT.”
- Implement e-Arrival as an explanatory handoff to the official source, not a fake submission.
- Ensure status timeline events are derived from the application record instead of hard-coded markup.

Exit criteria: one application can travel end-to-end through all surfaces without IDs, progress, documents, or status contradicting each other.

### Phase 4 — Maximise the application UX

Group the form into human stages while keeping stable semantic sub-routes:

1. Application setup
2. Applicant and passport
3. Family, work, and background
4. Travel and references
5. Documents
6. Review, declaration, simulated payment, and submission

Within the flow:

- Use one focused section per screen on mobile; do not show a wide scrolling step strip.
- Add “Saved locally at [time],” “Save and exit,” and a clear return-to-dashboard action.
- Use inline validation on blur plus a focused error summary on continue.
- Preserve data on errors and back navigation.
- Add field formats, examples, autocomplete tokens, input modes, and accessible description/error relationships.
- Explain why sensitive fields are requested and remind users to use fictional information in this prototype.
- Add conditional sections rather than asking irrelevant questions.
- Provide section-level review/edit links and highlight missing/conflicting information.
- Require an explicit final declaration that submission is simulated.
- Move focus to the next screen heading and announce save/validation states through an ARIA live region.

Exit criteria: all supported paths are keyboard-completable, resumable, and understandable at 320 px and 200% zoom; no required field advances with invalid data.

### Phase 5 — Refine the heritage design system

Preserve the cultural/editorial DNA, but make service clarity dominant.

- Keep ivory paper surfaces, deep indigo, terracotta emphasis, restrained jali patterns, and editorial serif headings.
- Use the serif sparingly for top-level storytelling and section headings; use the sans face for all transactional copy, fields, tables, and status information.
- Remove decorative patterns behind dense forms and low-contrast text.
- Standardise tokens for colour, typography, spacing, radii, borders, shadows, motion, breakpoints, and content widths.
- Standardise components: buttons, links, fields, radios, checkboxes, banners, alerts, status badges, timelines, cards, empty states, error summaries, step navigation, dialogs, toasts, skeletons, tables, and mobile records.
- Use status text and icons alongside colour.
- Keep animation under 200 ms for functional feedback; remove the blocking splash and honor `prefers-reduced-motion`.
- Self-host fonts or provide system fallbacks so the service remains legible offline.
- Fix footer contrast and validate all combinations to WCAG 2.2 AA.

Exit criteria: the product remains unmistakably Visa-Seva but works when imagery, web fonts, motion, and high bandwidth are unavailable.

### Phase 6 — Make accessibility controls real

- Replace the inert Accessibility button with a panel for text size, high contrast, increased spacing, reduced motion, and reset.
- Persist preferences separately from application data.
- Implement skip navigation, visible focus, correct landmarks, logical headings, and current-page announcements.
- Ensure all status/progress information is available without colour or animation.
- Provide 44 px targets and prevent hover-only information.
- Make file controls, date fields, error summaries, timelines, accordions, and dialogs screen-reader usable.
- Either implement Hindi end-to-end with correctly isolated user-entered data or remove the selector until it works.
- Test keyboard-only, VoiceOver/NVDA smoke paths, 200% zoom, high contrast, and reduced motion.

Exit criteria: accessibility is an operable feature, not a visual promise.

### Phase 7 — Deliver the low-connectivity promise

- Lazy-load route bundles and the tourism gallery.
- Use responsive image sizes, modern formats, dimensions, and lazy loading; do not preload tourism assets for application tasks.
- Add a service worker/app shell only if its update and stale-content behaviour can be made safe and testable.
- Add online/offline detection, an explicit local-save state, sync queue semantics, and recovery messaging.
- Add Data Saver mode that disables decorative images, web fonts, and non-essential motion.
- Provide an in-app network simulator for demo scenarios.
- Never imply server sync when data is only local.
- Set performance budgets for initial JS, CSS, fonts, images, and interaction latency.

Exit criteria: previously loaded draft steps remain usable offline; no data is lost during network changes; the core application does not depend on tourism media.

### Phase 8 — Make the same UI agent-operable

- Serve `/agent.md` and `/llms.txt` intentionally and keep them aligned with the actual route registry.
- Define application/field/action schemas in code and generate documentation from them.
- Give every field a stable ID/name, label, description, validation contract, and sensitivity classification.
- Add machine-readable application state and allowed actions without exposing secret or unnecessary personal data.
- Require explicit human confirmation for simulated submit, payment, deletion, and document selection.
- Add tests that an automated browser can discover, fill, review, and stop before commitment.

Exit criteria: human and agent paths share the same controls, validation, state, and confirmation boundaries.

### Phase 9 — Quality gates

- Add ESLint and formatting checks.
- Add unit tests for rule decisions, state transitions, validation, persistence, and status derivation.
- Add component/integration tests for finder, wizard, resume, payment, re-upload, print, accessibility preferences, and data clearing.
- Add browser tests for each supported visa path and demo scenario.
- Add automated accessibility smoke tests plus a manual checklist.
- Test at 320, 390, 768, 1024, and 1440 px; 200% zoom; keyboard-only; reduced motion; offline; and Data Saver.
- Require zero console errors, zero unknown-route blank pages, zero inert visible controls, and zero document-level horizontal overflow.

## Delivery slices

### Slice 1 — Trust and shell

Persistent prototype identity, official handoff, mobile navigation, homepage hierarchy, route registry, 404, loader removal, real/removed language and accessibility controls.

### Slice 2 — Safe finder

Versioned sourced rules, conservative results, missing screening questions, official confirmation, rule tests.

### Slice 3 — Coherent demo lifecycle

Deterministic record/ID/access code, dashboard/resume/status integration, demo scenarios, state machine.

### Slice 4 — Application completion

Accessible validation, stage navigation, conditional fields, review/edit, documents, simulated payment, submission, print/PDF, re-upload.

### Slice 5 — Resilience and agent support

Offline/data saver/network simulation, route splitting/media optimisation, generated agent metadata, end-to-end and accessibility gates.

### Slice 6 — Visual refinement

Consolidated design tokens/components, microcopy, responsive polish, motion/contrast tuning, tourism separation.

## Prototype success measures

- 100% of visible controls have a deliberate working or explicitly unavailable state.
- 100% of eligibility outcomes expose date-stamped official sources and a conservative disclaimer.
- One stable application ID works across application, dashboard, resume, status, re-upload, and print.
- A new traveller reaches a safe likely-path result in under 90 seconds.
- A returning traveller resumes a draft in under 15 seconds.
- Zero horizontal overflow at 320 px or 200% zoom.
- All happy paths are keyboard-completable.
- Core draft work survives refresh and offline transitions without false sync claims.
- Major routes produce no console errors and pass automated smoke/accessibility tests.
- Every simulated artefact and commitment screen says it is not official.

## Official content anchors

Use primary sources only for eligibility and procedural claims:

- [Authorized Indian Visa Online portal](https://www.indianvisaonline.gov.in/)
- [Official e-Visa information and eligibility](https://www.indianvisaonline.gov.in/evisa/tvoa.html)
- [Official Visa-on-Arrival information](https://www.indianvisaonline.gov.in/visa/visa-on-arrival.html)
- [Official visa categories](https://www.indianvisaonline.gov.in/visa/visa-category.html)

Do not scrape these sources at runtime. Maintain reviewed, versioned prototype rules and direct users to official confirmation.

## Copy/paste implementation prompt

```text
You are improving the React/Vite repository at the current checkout into an exceptional Visa-Seva hackathon prototype.

Read before changing anything:
- UI_UX_MAXXING_PLAN.md
- agent.md (product source of truth)
- design.md
- normal.md, afghan.md, and uae.md
- package.json
- src/App.jsx, src/store.jsx, src/index.css
- every file under src/components and src/pages

Repository baseline:
- React 19, React Router 7, Vite 8, Tailwind CSS 3.
- Front-end-only prototype using localStorage and IndexedDB.
- Preserve existing user changes and do not perform Git history operations.
- Do not integrate real government systems, authentication, payment, or submission APIs.
- Do not collect or encourage real passport, identity, payment, or medical data.

Mission:
Create a trustworthy, accessible, mobile-first, low-connectivity-friendly, agent-operable visa-service demo with one coherent fictional lifecycle: find a likely visa path, understand requirements, start and resume a draft, select demo documents, review, simulate payment/submission, receive a stable demo ID, track status, respond to document requests, and print a visibly watermarked demo artefact.

Preserve the strongest part of the current product: its ivory/indigo/terracotta Indian editorial and heritage identity. Make service clarity more important than decoration, and never imply that the prototype is an official Government of India portal.

Implement in this order:

1. Establish safety and trust.
   - Add a persistent “Hackathon prototype — not an official visa service. Do not enter real personal or passport information.” strip to every screen.
   - Remove or neutralise “Government of India” branding and any primary-logo use of the national emblem that could imply affiliation.
   - Add a clearly labelled external link to the official Indian Visa Online portal.
   - Add local-data disclosure, retention explanation, shared-device warning, and confirmed Clear demo data action.
   - Rename upload/payment/submission actions to state that they are simulations.

2. Fix the experience shell.
   - Replace the broken mobile link column with an accessible compact menu.
   - Split Track application from Before you travel.
   - Add route metadata, active states, breadcrumbs, skip link, per-route titles, 404, and route smoke tests.
   - Remove the 3.1-second blocking Loader; use no fake waiting state.
   - Either implement Accessibility and Hindi fully or remove the inert controls until they work.
   - Fix footer contrast and all WCAG 2.2 AA violations.

3. Make Visa Finder conservative and sourced.
   - Extract all eligibility logic from VisaFinder.jsx into versioned, testable rule/data modules.
   - Each rule needs an official source URL, reviewedAt date, rationale, and coverage/confidence state.
   - Add the screening questions needed by sourced rules, including passport type and relevant origin/prior-visa conditions.
   - Never default an uncovered nationality to e-Visa.
   - Return “Likely path—confirm officially,” “Needs official review,” or “Insufficient information,” not guaranteed eligibility.
   - Show why, what conditions matter, when rules were reviewed, and a direct official-confirmation action.
   - Add comprehensive decision-table tests.

4. Build one deterministic local demo model and state machine.
   - Model applications, applicant sections, documents, payments, timeline events, status, and a fictional access code.
   - Default to no application, not an automatic draft.
   - Generate and persist one stable demo application ID.
   - Use the same record in application, dashboard, resume, status, re-upload, print, and demo scenarios.
   - Do not allow status lookup by passport number alone; require the fictional application ID plus fictional access code.
   - Provide Granted, Processing, Documents Required, Refused, Offline Draft, and Elderly/Low Vision demo scenarios.

5. Complete the core application journey.
   - Organise it into Application setup; Applicant and passport; Family/work/background; Travel/references; Documents; Review/declaration/payment/submission.
   - Keep stable semantic sub-routes and stable field IDs/names.
   - Add conditional questions, field hints, formats, autocomplete/inputmode, inline errors, focused error summary, save timestamp, Save and exit, review/edit links, and safe back navigation.
   - Preserve data across validation errors, refresh, and back navigation.
   - Move focus to each new screen heading and announce save/error/status changes through ARIA live regions.
   - Require explicit human confirmation before simulated submission.

6. Complete the demo lifecycle.
   - Implement a payment simulation with no real card/bank fields and clear success/failure paths.
   - Implement documents-required and demo re-upload states.
   - Implement print/download for demo application and ETA; watermark every page “HACKATHON PROTOTYPE — NOT AN OFFICIAL VISA DOCUMENT.”
   - Implement e-Arrival as an explanatory link to the official service, not a fake local submission.
   - Derive dashboard progress and status timelines from the application record.

7. Refine the design system.
   - Preserve ivory paper, deep indigo, terracotta accents, restrained jali patterns, and editorial serif headings.
   - Use sans typography for transactions and dense information.
   - Centralise colour, type, spacing, borders, shadows, motion, breakpoints, and task-width tokens.
   - Standardise button/link/field/status/timeline/error/dialog/toast/table/mobile-record states.
   - Never use colour alone for status.
   - Keep functional motion under 200 ms and honour prefers-reduced-motion.
   - Ensure the core service works without imagery or remote fonts.

8. Implement accessibility and resilience as real capabilities.
   - Build working text-size, high-contrast, increased-spacing, reduced-motion, and reset preferences.
   - Test keyboard, visible focus, landmarks, headings, target sizes, screen-reader names/states, 200% zoom, and high contrast.
   - Lazy-load routes and tourism content; optimise responsive images.
   - Add explicit online/offline state, honest local-save/sync language, Data Saver, and a demo network simulator.
   - Previously loaded draft steps must remain usable offline without data loss.

9. Make the same UI agent-operable.
   - Serve /agent.md and /llms.txt intentionally.
   - Centralise route, field, action, validation, sensitivity, and state schemas; generate agent documentation from them.
   - Require explicit human confirmation for simulated submit, payment, deletion, and document selection.
   - Add automated browser tests proving an agent can discover, fill, review, and stop before commitment.

10. Verify thoroughly.
   - Add lint/format checks, unit tests, integration tests, browser journey tests, and accessibility smoke tests.
   - Verify at 320, 390, 768, 1024, and 1440 px; 200% zoom; keyboard-only; reduced motion; offline; and Data Saver.
   - Run build, lint, tests, and major-route visual QA.
   - Fix all console errors, inert controls, unknown-route blank screens, and document-level horizontal overflow.

Content requirements:
- Use only primary official Indian visa sources for rules and procedural claims.
- Store reviewed prototype rules locally with source URL and reviewedAt metadata; do not scrape official sites at runtime.
- Current official anchors are listed in UI_UX_MAXXING_PLAN.md.
- Treat the result as guidance, not immigration or legal advice.

Constraints:
- Do not clone the official government site.
- Do not add gratuitous gradients, glassmorphism, excessive cards, heavy shadows, or decorative animation.
- Do not make this look like generic SaaS, a travel-booking marketplace, or an AI chatbot.
- Do not use non-functional controls or dead links.
- Do not fabricate submission, payment, support availability, processing times, approvals, or live status.
- Keep fictional demo data obviously fictional.
- Preserve unrelated work and avoid unnecessary dependencies/refactors.

Definition of done:
- Build, lint, tests, and accessibility smoke checks pass.
- Every visible control works or is explicitly marked unavailable.
- Mobile navigation is compact and usable; no overflow at 320–430 px.
- Finder outcomes are conservative, sourced, date-stamped, and tested.
- One stable demo application works across every lifecycle surface.
- Supported flows work with keyboard only and at 200% zoom.
- Offline/local-save behaviour is honest and recoverable.
- Every commitment and generated artefact is clearly a non-official simulation.
- Provide a concise completion report with changed files, verified journeys/viewports, command results, source-review date, and intentionally deferred work.
```

# Visa Flow Implementation Report

**Completed:** 27 August 2026

**Basis:** The three official-flow audits in [`plans/flow-audits`](./flow-audits/README.md)

## Implemented

- Separate state and journeys for standard e-Visa, Afghan national, Visa-on-Arrival, and regular/paper visa preparation.
- Reviewed, effective-dated route-finder rules with conservative fallback to official review.
- Japan, South Korea, and qualifying UAE Visa-on-Arrival routing, including the UAE prior-visa condition and exact 60-day boundary.
- Dedicated Afghan category and subtype handling with no unsupported tourist fallback.
- Full material identity, passport, family, employment, travel, history, reference, security, declaration, document, review, and preparation stages.
- Temporary and final local demo references that are explicitly not Government application IDs.
- Purpose-aware document requirements and current-session file validation metadata.
- e-Visa JPEG/PDF type and size checks where verified by the official audit.
- e-Student admission, financial-support, and conditional medical/paramedical approval evidence.
- Visa-on-Arrival Annexure I preparation and official-form handoff without claiming online submission or approval.
- Composite synthetic status lookup with non-enumerating failure behavior.
- Separate e-Arrival guidance and safe official-service handoff.
- Accessible error summary, field error associations, keyboard-operable uploads, step focus management, and reduced-motion-aware step navigation.
- Current-tab session-only draft storage, visible save failures, and confirmed erasure of current and legacy browser data.
- Persistent, above-the-fold independent-prototype and synthetic-data warnings.
- De-officialized branding and action labels.
- Lazy-loaded route chunks and deferred below-fold Home media.
- Caddy SPA configuration with compression, blocked operational paths, CSP, clickjacking protection, content-type/referrer/permissions headers, conditional public HTTPS HSTS, and caching rules.

## Automated verification

- `npm test`: 35 passing tests, 0 failures, 0 TODOs.
- `npm run build`: passing Vite production build.
- `git diff --check`: clean.
- Initial JavaScript reduced from approximately 118.7 KB gzip to 82.9 KB gzip through route splitting.
- Dedicated tests cover eligibility routing, direct-wizard gates, Visa-on-Arrival boundaries, e-Student routing, purpose-aware document requirements, document invalidation, and refresh/reselection behavior.

## QA findings resolved

- Afghan applications are no longer stored as `regular + tourist`.
- Regular applications no longer receive Afghan/Tazkira logic.
- Medical Attendant retains its selected route and requires a principal-patient reference.
- Synthetic data no longer overwrites e-Student, Afghan subtype, South Korea VoA, or UAE VoA route identity.
- Direct `/apply` navigation cannot bypass the reviewed e-Visa ruleset and Study in India gate.
- Production Investment is consistent across routing, wizard, evidence, and tests.
- Stale or rehydrated document metadata cannot satisfy current-session document requirements.
- Changing a route-driving field invalidates prior document selections.
- Status lookup no longer accepts a single passport number or fabricates official processing events.
- The UI no longer claims to submit, approve, track, download, or amend a real Government application.

## Remaining limitations

- This is still a frontend-only educational prototype. Eligibility, authorization, validation, state transitions, IDs, rate limits, audit logs, and document inspection remain client-controlled until the Rust/PostgreSQL backend is implemented.
- A production backend must validate file signatures and content, parse PDFs/images safely, apply malware scanning, enforce authoritative effective-dated rules, protect stored data, and provide idempotent state transitions.
- Afghan live Apply/Status routes were unavailable during the audit, the standard form was blocked beyond page one by CAPTCHA, and official port information was internally inconsistent. Those uncertainties remain labeled in the UI.
- Caddy is not installed on the current machine, and Docker was not running, so native `caddy validate` could not be executed. The configuration received structural review only.
- The final browser-control binding was unavailable. An earlier browser QA wave covered the principal synthetic flows, and final changes were verified by tests/build/static checks, but a final visual/browser-console pass is still recommended when Browser is available.
- Home has approximately 3.43 MiB of deferred raster media, and the full public raster inventory is approximately 19.94 MiB. Binary resizing/conversion remains necessary to meet the final media budget.

## Next engineering phase

Implement the Rust/Axum/PostgreSQL backend described in [`backend-capacity-plan.md`](./backend-capacity-plan.md), then replace the current local state with authenticated server-side drafts, durable workflow transitions, idempotent submission, secure document storage, official-reference data ingestion, observability, and the defined load-test suite.

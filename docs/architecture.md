# Architecture and safety boundaries

Last updated: 25 August 2026.

## Product boundary

KarSaathi is a client-first, synthetic-data prototype for one citizen journey. It helps a fictional salaried taxpayer understand records, reconcile two known mismatches, answer relevant filing questions, view a scoped regime comparison, and produce a Tax Health summary.

It is deliberately not an e-filing system. It has no taxpayer accounts, document upload, identity verification, payments, government API, AIS feedback, or return submission.

## Runtime shape

```text
Bundled Rahul fixture
        |
        v
React journey UI <--> versioned demo state in browser
        |                         |
        v                         v
Pure domain rules --------> Tax Health/readiness report
  - reconciliation
  - eligibility questions
  - indicative recommendation
  - scoped regime estimate
```

The production build is static and can be served by a conventional web host with SPA fallback. The useful path must not depend on a model, database, or government service.

## Responsibilities

### Presentation

React pages and small components own navigation, progressive disclosure, input labels, focus handling, responsive comparison views, and print presentation. They should display decisions returned by domain modules, not encode tax logic inline.

### Domain

Pure functions own:

- comparison of evidence values;
- mismatch state and user resolution;
- supported/unsupported-case classification;
- reasons for an indicative ITR recommendation;
- illustrative old/new-regime calculations;
- readiness blockers and next actions.

Each result should carry human-readable reasons and source/assumption metadata. Domain functions must be deterministic: the same fixture and answers produce the same result.

### Fixtures

Bundled source documents and Rahul’s profile are fictional. Stable IDs make the demo repeatable and the tests meaningful. Fixtures must contain conspicuous synthetic labels and no number intended to resemble a real PAN, Aadhaar, account, acknowledgement, or payment identifier.

### State and storage

Only the language choice, fictional answers, two fictional reconciliation decisions, and journey-started state are stored in the browser. Persisted data has a schema version and safe defaults. Reset removes answers and resolutions while preserving the language choice. No analytics or remote persistence is used.

## Trust model

KarSaathi treats all displayed evidence as synthetic input, not authoritative data. Rules and calculations are code, not model output. Unsupported answers produce escalation rather than a guessed simple result. The interface distinguishes:

- a source fact;
- an assumption;
- a user decision;
- an illustrative estimate;
- an official next step outside KarSaathi.

External links must open the canonical official page and state that the user is leaving the prototype.

## Optional OpenAI extension

The optional explanation endpoint can rewrite a deterministic result in plainer English or Hindi using only curated official-source snippets and synthetic session context. When enabled:

- keep `OPENAI_API_KEY` server-side;
- use a structured response schema;
- send no real user data;
- enforce allowlists, length limits, timeout, output validation, and best-effort per-instance rate limiting;
- cite only supplied sources;
- label generated text;
- fall back to local deterministic copy on error or missing configuration.

The model must not calculate tax, choose an ITR form, invent a notice response, or change readiness state.

## Failure modes

| Failure | Safe behaviour |
| --- | --- |
| Browser storage is invalid | Discard it and restart the fictional demo |
| User selects a complex case | Stop the simple recommendation and suggest qualified help |
| Evidence is unresolved | Tax Health remains “needs attention” |
| Rule set is stale or unverified | Show its date and do not imply current legal accuracy |
| Optional model request fails | Show local explanation; journey remains usable |
| Official external site is unavailable | Keep the report usable and identify the intended destination |

## Testing strategy

- Unit tests cover domain boundaries, mismatch resolution, malformed inputs, unsupported cases, rounding, and the optional guidance request/output boundary.
- An integration test covers Rahul’s supported path from fresh start to resolved Tax Health report.
- The suite includes guarded-route, malformed-storage, and uncertain-answer cases. Storage migration, exhaustive route smoke, accessibility automation, and exhaustive browser-history/print/export cases are not yet implemented.
- Final manual QA must cover keyboard use, 390 px, 768 px, 1440 px, 200% zoom, reduced motion, print/JSON export, deep-link guards, refresh/resume/reset, and browser-console errors on the deployed build.

## Delivery controls

The repository exposes reproducible clean-install, lint, deterministic test, and production-build commands. Vercel supplies SPA rewrites and the optional serverless endpoint. Deployment headers apply content-type protection, referrer and permissions policies, clickjacking protection, and a restrictive CSP compatible with the current self-hosted bundle.

These controls do not prove deployment readiness by themselves. The public link, signed-out access, deep-route behaviour, response headers, and optional endpoint still require post-deployment checks. Repository CI should run the same command set once an authorised maintainer can publish workflow files.

## Safe path to production

A real service would require legal and tax review, threat modelling, accessibility audit, content governance, data-protection impact assessment, secure identity and consent design, incident response, observability, and an approved integration agreement. Rules would be versioned by tax period and reviewed by qualified professionals. Sensitive uploads would require explicit purpose limitation, encryption, retention controls, deletion, and audit logs.

None of those production capabilities is implied by this prototype.

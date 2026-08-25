# Architecture and safety boundaries

Last updated: 25 August 2026.

## Product boundary

KarSaathi is a client-first, synthetic-data prototype for three bounded return-readiness journeys: a salaried individual, a domestic private company, and a partnership firm/LLP. The samples share one five-step interaction—records, comparison/review, questions, likely route, and readiness report—but use profile-specific fixtures, questions, explanations and next steps.

The firm/LLP sample is one concrete non-company case, not a universal model for every non-company taxpayer. HUFs, trusts, societies, AOPs, BOIs, cooperative societies and other entities can have different return forms and obligations.

It is deliberately not an e-filing system. It has no taxpayer accounts, document upload, identity verification, payments, government API, AIS feedback, or return submission.

## Runtime shape

```text
Selected synthetic profile fixture
        |
        v
Profile configuration --> React journey UI <--> version-2 demo state in browser
        |                         |
        v                         v
Pure domain rules --------> Tax Health/readiness report
  - reconciliation
  - profile-specific readiness questions
  - indicative return-route recommendation
  - scoped individual-only regime estimate
```

The production build is static and can be served by a conventional web host with SPA fallback. The useful path must not depend on a model, database, or government service.

## Responsibilities

### Presentation

React pages and small components own navigation, progressive disclosure, input labels, focus handling, responsive comparison views, and print presentation. They should display decisions returned by domain modules, not encode tax logic inline.

### Domain

Pure functions own:

- comparison of evidence values and mismatch resolution for the individual sample;
- checked/needs-attention/not-sure record-pack review for the entity samples;
- profile-specific supported/unsupported-case classification;
- reasons for an indicative ITR recommendation;
- illustrative old/new-regime calculations for the bounded individual sample only;
- readiness blockers and next actions.

Each result should carry human-readable reasons and source/assumption metadata. Domain functions must be deterministic: the same profile fixture and answers produce the same result. Company and firm/LLP flows return an intentional `not_offered` calculation state rather than a zero, error, or invented estimate; that state must not become a readiness blocker.

### Fixtures

All three profiles and their bundled source documents are fictional. Stable profile-prefixed IDs make the demo repeatable, prevent cross-profile collisions, and keep tests meaningful. Fixtures must contain conspicuous synthetic labels and no number intended to resemble a real PAN, Aadhaar, account, acknowledgement, or payment identifier.

### State and storage

Only the language choice and fictional progress are stored in the browser. Version-2 state keeps separate `started`, answer and resolution data for the individual, company and firm/LLP journeys. A migration may import a valid version-1 Rahul session into the individual slot; malformed shapes fall back safely, unknown profiles are ignored, and invalid saved answer/action values cannot satisfy domain checks. Reset clears only the selected sample while preserving the language choice and other sample progress. No analytics or remote persistence is used.

Legacy `/demo/<step>` links remain compatible by redirecting to the corresponding individual step. New canonical routes include the profile, `/demo/<profile>/<step>`, so profile identity is explicit and deep-link guards can validate prerequisites within that profile only.

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
| Browser storage is invalid | Discard invalid fields and restart the affected fictional journey safely |
| Version-1 progress is present | Migrate valid Rahul progress into the individual journey only |
| Unknown profile or old demo route is opened | Redirect safely to the selector or compatible individual route |
| User selects a complex case | Stop the simple recommendation and suggest qualified help |
| Evidence is unresolved | Tax Health remains “needs attention” |
| Company or firm/LLP calculation is requested | Explain that an entity estimate is not offered; do not guess |
| Rule set is stale or unverified | Show its date and do not imply current legal accuracy |
| Optional model request fails | Show local explanation; journey remains usable |
| Official external site is unavailable | Keep the report usable and identify the intended destination |

## Testing strategy

- Unit tests cover domain boundaries, mismatch resolution, malformed inputs, unsupported cases, rounding, and the optional guidance request/output boundary.
- Integration tests must cover the supported individual, company and firm/LLP paths from selection to Tax Health report, including the intentional entity no-estimate state.
- The integrated suite covers individual and entity domain boundaries, all three happy paths, entity uncertainty, guarded routes, malformed storage, profile isolation, version-1 migration, legacy-route compatibility, and cross-profile copy leakage. Automated accessibility, exhaustive browser history, print, export, and public-deployment checks remain open.
- Final manual QA must cover keyboard use, 390 px, 768 px, 1440 px, 200% zoom, reduced motion, print/JSON export, deep-link guards, refresh/resume/reset, and browser-console errors on the deployed build.

## Delivery controls

The repository exposes reproducible clean-install, lint, deterministic test, and production-build commands. Vercel supplies SPA rewrites and the optional serverless endpoint. Deployment headers apply content-type protection, referrer and permissions policies, clickjacking protection, and a restrictive CSP compatible with the current self-hosted bundle.

These controls do not prove deployment readiness by themselves. The integrated three-journey tree passes local lint, 56 tests, production build, diff checks, and responsive rendered QA. The public link, signed-out access, profile selection, legacy and canonical deep routes, response headers, and optional endpoint still require post-deployment checks. Repository CI should run the same command set once an authorised maintainer can publish workflow files.

## Safe path to production

A real service would require legal and tax review, threat modelling, accessibility audit, content governance, data-protection impact assessment, secure identity and consent design, incident response, observability, and an approved integration agreement. Rules would be versioned by tax period and reviewed by qualified professionals. Sensitive uploads would require explicit purpose limitation, encryption, retention controls, deletion, and audit logs.

None of those production capabilities is implied by this prototype.

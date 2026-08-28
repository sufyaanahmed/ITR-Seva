# Indian Visa Flow Verification Summary

**Review date:** 27 August 2026

**Scope:** The repository's Afghan-national, Visa-on-Arrival, and standard e-Visa Markdown specifications and their corresponding React flows.

**Method:** Three independent reviews compared the repository with current Government of India pages and safely walked accessible official/local form screens using synthetic data. No real application was submitted, no identity document was uploaded, no payment was attempted, and no CAPTCHA was solved or bypassed.

## Audit reports

- [Afghan-national flow audit](./afghan-flow-audit.md)
- [Visa-on-Arrival flow audit](./uae-flow-audit.md)
- [Standard e-Visa flow audit](./normal-flow-audit.md)

## Overall verdict

The three Markdown briefs are useful foundations and are substantially closer to the official processes than the current React application. None of the implemented flows is currently accurate enough to describe as a faithful end-to-end reproduction.

| Flow | Markdown specification | React implementation |
| --- | --- | --- |
| Afghan national | Directionally correct but missing mandatory photo, category subtypes, application-ID/finality rules, and several purpose-specific requirements | Materially incorrect: stored as `regular + tourist`, no category/subtype choice, shared regular/Afghan logic, incomplete document enforcement |
| Visa on Arrival | Broadly correct but missing explicit exclusions, non-extendable/non-convertible status, detailed form requirements, and mandatory e-Arrival step | Materially incorrect: only Japan+tourism is routed, South Korea/UAE gates are missing, duration can exceed 60 days, official form fields are absent, and the UI fabricates submission |
| Standard e-Visa | Captures much of the older form order but misses current purposes, exact upload/payment/recovery rules, arrival conditions, and temporary/final ID distinction | Materially incomplete: recommends e-Visa to ineligible nationalities, hard-codes tourist, omits most fields/security questions, accepts wrong file types, and fabricates submission/status events |

## Cross-flow release blockers

1. **Separate the application types.** Afghan, ordinary e-Visa, regular/paper visa, and Visa-on-Arrival require distinct state models and schemas. `regular || afghan` must not be used as an eligibility shortcut.
2. **Replace hard-coded recommendations.** Nationality, passport type, origin restrictions, purpose, duration, port, category, and effective dates must be validated against reviewed reference data rather than broad country lists and a few `if` branches.
3. **Do not simulate government submission.** A local `submitted: true` flag and random application ID must not be represented as an official submission. Visa-on-Arrival should generate a faithful Annexure I form, not an application receipt.
4. **Implement authoritative conditional forms.** The present shared wizard omits material identity, family, employment, history, reference, security, declaration, and category-specific fields.
5. **Enforce documents server-side.** File MIME type, extension, size, dimensions/content, category rules, malware controls, and completeness must be enforced by the backend. Filenames alone are insufficient.
6. **Build a real application state machine.** Draft, temporary ID, review, final submission, payment, scrutiny/re-upload, decision, print, and arrival-readiness states need durable backend transitions and idempotency.
7. **Protect status information.** Never expose applicant/status data from a single guessable passport number or random client-generated ID. Use verified composite credentials, throttling, and enumeration protection.
8. **Model e-Arrival separately.** It is mandatory arrival information within the published pre-arrival window, not a visa and not a substitute for e-Visa, the Afghan visa route, or the Visa-on-Arrival form.
9. **Use effective-dated official reference data.** Eligibility, categories, purposes, ports, documents, fees, validity, and entry rules can change and are sometimes inconsistent across pages on the official portal.
10. **Preserve the demo boundary.** The project must state clearly that it is not an authorized Government of India submission portal and hand users to official services for real applications.

## Flow-specific P0 changes

### Afghan-national route

- Introduce a distinct `application_type: 'afghan'`.
- Remove the unsupported default Tourist category.
- Require one of the six published categories and its applicable subtype.
- Add mandatory photograph, passport bio page, Tazkira, and purpose-specific documents.
- Block submission until mandatory evidence is present.
- Add durable application IDs, final-review immutability, ETA/`GRANTED`, passport continuity, biometrics, and e-Arrival guidance.

### Visa on Arrival

- Support Japan, South Korea, and qualifying UAE nationals.
- Add the UAE prior-Indian-visa condition.
- Enforce the four published purposes, maximum 60-day stay, passport rules, six airports, and all published exclusions.
- Map all official Annexure I fields and declaration.
- Replace fake submission with a printable form-generation flow.
- Add the separate mandatory e-Arrival handoff.

### Standard e-Visa

- Replace the world-country list with current eligibility data and explicit Afghan/Pakistani-origin routing.
- Replace the five-purpose finder with effective-dated current services and sub-purposes.
- Rebuild the wizard around the official registration, identity/passport, family/employment, travel/history/reference, security, upload, verification, payment, decision, and arrival stages.
- Enforce current JPEG/PDF and size/content rules on the server.
- Distinguish temporary and final application IDs.
- Add payment verification/recovery, print, status, and re-upload states without inventing service-level processing promises.

## Verification limitations

- The standard e-Visa live registration page required a CAPTCHA after its first page. Later stages were compared with the official sample form and current public instructions rather than bypassing the CAPTCHA.
- The dedicated Afghan portal's Apply and Status links returned the portal's own invalid-URL page during the review, and its Print route timed out. Exact live fields, payment behavior, and lookup credentials remain unverifiable.
- The standard status endpoint redirected to the e-Visa landing page during the review. Exact current lookup controls must be rechecked when the official route is functional.
- The official e-Visa site exposed internally inconsistent port counts across its FAQ, designated-checkpost panel, and live registration control. Ports should therefore be managed as reviewed, effective-dated data rather than copied into JSX.

## Recommended next step

Translate these audits into a versioned domain model and field/rule matrix before backend implementation. The matrix should define, for every flow and purpose, eligibility gates, form fields, conditional branches, required evidence, state transitions, arrival requirements, official source URL, and last-reviewed/effective date. Only then should the React wizard and Rust API contracts be rebuilt.

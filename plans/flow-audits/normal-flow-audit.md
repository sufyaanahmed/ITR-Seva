# Standard Indian e-Visa flow audit

**Audit scope:** `normal.md`, `src/pages/flows/NormalFlow.jsx`, the shared application wizard and related routing/status/document components

**Official-site access date:** 27 August 2026 (Asia/Kolkata)

**Outcome:** the Markdown guide captures much of the old core form, but the React implementation is only a coarse demo and does **not** depict the current end-to-end Indian e-Visa journey with sufficient fidelity.

## Method and limitations

I inspected the public Government of India e-Visa portal in the in-app browser, opened the current registration form, read its live nationality, passport, arrival-port and visa-purpose controls, opened the current Instructions, FAQ, and authorized-checkpost panels, and inspected the official sample application PDF linked by the portal.

The live registration form presents a CAPTCHA on page 1. I did not solve or bypass it, submit an application, upload a document, or enter payment details. Therefore, post-CAPTCHA screens were verified against the official sample application still linked by the Government portal, the portal's current instructions/FAQ, and the current live purpose/document lists. The sample PDF was created in 2019 and visibly contains older category names, so it is authoritative for the broad page/field order but not for the current category catalogue. The public `StatusEnquiry` endpoint redirected to `/evisa/tvoa.html` during this audit, so the exact current status-form fields could not be interactively confirmed.

## Official sources

- [Government of India e-Visa portal](https://indianvisaonline.gov.in/evisa/) — current instructions, FAQs, eligibility list, document rules, payment rules, post-grant conditions, and designated ports.
- [Live e-Visa registration page](https://indianvisaonline.gov.in/evisa/Registration) — current page-one controls and current purpose catalogue.
- [Official sample e-Visa application](https://indianvisaonline.gov.in/evisa/images/SampleForm.pdf) — nine form screens across eight PDF pages; still linked by the portal, though the PDF metadata and screenshots are from 2019.
- [Current country/territory-wise e-Tourist fee schedule](https://indianvisaonline.gov.in/evisa/images/Etourist_fee_final.pdf) — dated 9 July 2026.
- [Current fee schedule for e-Business, e-Medical, e-Medical Attendant and e-Conference](https://indianvisaonline.gov.in/evisa/images/eTV_revised_fee_final.pdf) — dated 15 April 2026.
- [Status enquiry endpoint](https://indianvisaonline.gov.in/evisa/StatusEnquiry) — redirected to the portal landing page (`/evisa/tvoa.html`) on 27 August 2026.

## Executive findings

### Correct

- `normal.md` correctly identifies a four-day minimum lead time for the mainstream e-Tourist/e-Business/e-Medical/e-Medical Attendant/e-Conference flows. The current FAQ also says these applications can be made up to 120 days before travel.
- The guide correctly calls for a front-facing JPEG photo on a plain light/white background, a PDF passport bio page, category-specific supporting documents, nationality/passport type/arrival port/DOB/email/arrival date/purpose on the first screen, a temporary application ID, applicant/passport/address/family/travel/reference/security sections, photo/document upload, verification, payment, and ETA/status handling.
- The guide's statement that Malaysian nationals pay no fee for the 30-day e-Tourist visa is current: the 9 July 2026 official fee schedule lists USD 0 for both seasonal 30-day columns.
- The portal does send submission and decision information to the supplied email address and allows an unfinished application to be resumed using its temporary ID.
- The broad order in `normal.md` agrees with the official sample: registration → applicant/passport → address/family/employment → visa/travel/history/references → security declaration → photo → documents → verification → final application ID/payment → ETA/status.

### Missing

- `normal.md` omits the upper application window of **120 days**, passport eligibility (six months' validity at application, at least two blank pages), return/onward ticket, sufficient funds, one passport per traveller, and the exclusion of diplomatic/official, laissez-passer and international-travel-document holders.
- The page-one guide omits **re-enter email**, the CAPTCHA, and the required acknowledgement that instructions were read and documents are ready.
- It does not distinguish the **Temporary Application ID** used to resume an unfinished form from the **final Application ID** used for payment, printing and status enquiry.
- It omits the exact document constraints: JPEG photo 10 KB–1 MB and square; passport/supporting PDFs 10–300 KB; full face, open eyes, no spectacles, no borders or shadows; and English-language supporting documents.
- It omits many current purpose/category branches and their evidence requirements, including e-Student, e-Family, e-Transit, e-Miscellaneous/entry, e-Production Investment, e-Film, e-Conference, e-Ayush and attendant, mountaineering, sports, short courses, and voluntary work.
- It does not spell out the six mandatory background/security questions or the declaration that follows them.
- It omits payment facts: country/category-specific fee, extra 3% bank charge, payment at least four days before travel, non-refundability, payment status potentially taking up to two hours, and the separate Verify Payment/Pay Fee recovery route.
- It omits document re-upload after scrutiny, Print Application, Complete Partially Filled Application, and the 24-hour document/image re-upload email described on the portal.
- It omits the most important arrival conditions: ETA must show **GRANTED** before departure; biometrics are captured at immigration; e-Visa is non-extendable/non-convertible; it is not valid for Protected/Restricted/Cantonment areas without permission; yellow-fever rules; and the requirement to travel on the passport used for the application (or carry both old and new passports when applicable).
- It omits the current e-Arrival Card notice shown on the portal.

### Outdated

- `normal.md` says a 30-day e-Tourist visa is "double-entry". The current official FAQ describes it as allowing **multiple entries** during its validity period. Use the official current wording rather than preserving the historical double-entry label.
- The guide treats nine categories as a stable flat list without naming them. The current portal is internally inconsistent: its Instructions panel calls out nine subcategories, the homepage exposes eight top-level labels, and the live purpose dropdown contains many finer-grained current purposes, including newer e-Student/e-Transit/e-Family/e-Miscellaneous/e-Production Investment routes. Categories and purposes should be server-managed, effective-dated reference data rather than hard-coded copy.
- The official sample PDF remains useful for ordering, but its screenshots and metadata are from 2019. Any exact duration, entry count, category name or port count taken only from that PDF must not be treated as current.

### Incorrect or misleading

- `normal.md` says a digital ETA copy is accepted. The current official process tells the applicant to **print the ETA and present it** at immigration; the instructions say to carry a copy. The project should not promise digital-only acceptance without a current official source.
- `normal.md` says processing "typically takes 3–5 business days." The current official FAQ does not publish that service-level promise; it only says the decision is emailed and status can be checked. Present this as **unverified** or remove it instead of guaranteeing a duration.
- The guide says fee links are "provided in the description," but `normal.md` contains no fee links.
- "Click Save and Continue, as the website may become unresponsive" is anecdotal rather than procedural. The actual purpose of Save and Continue/Temporarily Exit is to persist the form; robustness guidance should not assert an outage.

### Unverifiable during this audit

- The exact current post-CAPTCHA field labels and conditional rules could not be walked live without solving the CAPTCHA. They were cross-checked against the Government's linked sample and current instruction data, but should be rechecked manually whenever the official form changes.
- The exact inputs and button text on the current status page were not available because `StatusEnquiry` returned an HTTP 302 to `/evisa/tvoa.html` on the access date.
- The portal did not publish a current 3–5-business-day processing commitment in the accessible instructions or FAQ.

## Canonical user journey to depict

1. **Eligibility and route selection**
   - Confirm the passport nationality appears in the current Government e-Visa eligibility list.
   - Reject or redirect Pakistani-passport/Pakistani-origin cases to a regular visa. Afghan nationals use the separate Afghan portal.
   - Enforce passport/travel-document eligibility, six-month validity, two blank pages, onward/return ticket and sufficient-funds conditions.
   - Select a valid purpose and duration from effective-dated official reference data.
2. **Application registration (before the temporary ID)**
   - Nationality/region, passport type, designated arrival port, date of birth, email, re-enter email, expected arrival date, and exact e-Visa purpose.
   - Instruction/document acknowledgement and CAPTCHA on the Government portal.
3. **Temporary Application ID issued**
   - Explain that it resumes a partially filled application and is not yet the final payment/status identifier.
4. **Applicant and passport details**
   - Passport-exact surname/given names, prior-name details, gender, birth place/country, national ID, religion, visible mark, education, nationality acquisition, two-year residence question.
   - Passport number, issue place/date, expiry date, plus other-passport/identity-certificate details when applicable.
5. **Address, family, spouse and employment**
   - Full present and permanent addresses, postal code and contact numbers; same-address control.
   - Separate father and mother names, current/previous nationalities, places/countries of birth; marital/spouse conditional details; Pakistan-origin gate.
   - Current occupation/employer details and military/police/security conditional details.
6. **Visa/travel/history/references**
   - Places to visit (including second line), hotel/tour-operator conditional details, system-derived validity/entry count, selected arrival port and intended exit port.
   - Previous India visit and visa details, previous refusal/extension denial, countries visited in ten years, SAARC visits in three years with conditional details.
   - India reference and home-country reference, each with name, address and phone.
7. **Security declarations**
   - Arrest/prosecution/conviction; refusal/deportation; trafficking/drugs/child abuse/economic or financial offences; cybercrime/terrorism/sabotage/espionage/genocide/political killing/violence; advocacy of terrorist violence; asylum.
   - Require details for Yes answers and an explicit correctness/deportation/blacklisting declaration.
8. **Photo and supporting documents**
   - Photo first, then passport bio page and purpose-dependent PDFs. Enforce type, size, content, language and required-document rules server-side.
9. **Review and verification**
   - Show every entered field and uploaded-document status, with Modify and Verified and Continue paths.
10. **Final application and payment**
    - Issue the final Application ID; allow Pay Now/Pay Later where applicable; show non-refundable disclaimer and fee breakdown including bank charge; expose payment verification/recovery.
11. **Decision and travel**
    - Email acknowledgement and later Granted/Rejected decision; status, print and re-upload routes.
    - Before travel, show ETA `GRANTED`, print ETA, passport(s), entry-port constraints, e-Arrival Card, yellow-fever rule, biometrics, and non-extendable/non-convertible/protected-area notices.

## Markdown specification audit (`normal.md`)

| Location | Classification | Finding | Concrete correction |
|---|---|---|---|
| Lines 5–7 | Correct but incomplete | Nine-subcategory wording and four-day minimum broadly match the current Instructions/FAQ for mainstream routes. | Name the routes, add the 120-day window, and note that live purpose rules are authoritative. |
| Lines 9–17 | Correct but incomplete | Basic photo/passport/category-document list is right. | Add exact formats/sizes/specs and purpose-dependent checklist. |
| Lines 20–41 | Missing | Re-enter email, instruction acknowledgement, CAPTCHA, live purpose granularity and temporary/final ID distinction are absent. | Add these explicitly and define both IDs. |
| Lines 43–68 | Correct | The applicant-detail topics closely match the official sample. | Add conditional prior-name detail behavior and server-side validation rules. |
| Lines 70–105 | Correct but incomplete | Passport/address/family/employment concepts are largely right. | Add passport issue place, full other-passport details, postal code, separate father/mother fields, spouse conditionality, and full employer/security-service conditionals. |
| Lines 108–135 | Correct but incomplete | Travel history, SAARC and reference concepts match the official sample. | Add previous-visa fields, refusal details, tour-operator conditionals, second place-to-visit line, and exact six security questions. |
| Lines 137–143 | Missing | Format is mentioned but size/content/language constraints are absent. | Add 10 KB–1 MB square JPEG and 10–300 KB PDF constraints, plus category-specific PDFs. |
| Lines 145–153 | Partly correct / unverifiable | Malaysian 30-day fee is currently USD 0, but 3–5 business days is not a current published guarantee. | Link the 2026 fee schedules; remove the SLA or clearly label it non-official. |
| Lines 155–161 | Incorrect / unverifiable | Status mechanics could not be confirmed live; digital-only ETA acceptance is not supported by the official instructions. | Require a printed ETA, say it must show GRANTED, and recheck the live status form before reproducing its fields. |

## React implementation audit

### Routing and eligibility (`src/pages/guide/VisaFinder.jsx`)

| Classification | Finding | Impact |
|---|---|---|
| Incorrect — critical | `allCountries` contains the whole world, while the official e-Visa registration country list is a restricted eligible set. With only Afghanistan and Pakistan specially handled, many ineligible passports (for example Algeria, Bangladesh, Bhutan, Nepal, Iran and Iraq) are recommended e-Visa. | Users are sent into an unavailable or legally incorrect route. |
| Outdated — high | `Study` is always routed to regular/paper visa even though the live portal now offers multiple e-Student purposes for institutions registered on Study in India. | Eligible students receive the wrong recommendation. |
| Missing — high | The finder offers only tourism, business, medical, employment and study. It has no e-Transit, attendant, family/dependent, conference, film, production investment, miscellaneous/entry, Ayush, mountaineering, sports, short-course or volunteer branches. | Large parts of the live purpose catalogue cannot be represented. |
| Incorrect — high | Any trip over six months is routed to paper visa, although e-Tourist one-year/five-year products concern visa validity rather than a blanket six-month form answer, and per-visit stay rules vary. | It conflates visa validity, intended trip length and permitted continuous stay. |
| Missing — high | Pakistani origin is not asked by the finder even though the FAQ excludes not just Pakistani passports but certain parent/grandparent Pakistan-origin cases. | Ineligible applicants can be recommended e-Visa. |

### Briefing (`src/pages/flows/NormalFlow.jsx`)

| Classification | Finding | Impact |
|---|---|---|
| Missing — high | It reduces the application to three visible stages and omits eligibility, registration, family/employment, travel/history/references, security, verification, payment, ETA and arrival. | The advertised flow is materially incomplete. |
| Incorrect — high | `startApplication` hard-codes `visa_category: 'tourist'` and has no nationality/purpose/arrival-port state. | Starting here silently makes every applicant a tourist. |
| Unverifiable | It repeats the 3–5-business-day processing claim. | The UI presents an unsupported official-looking SLA. |

### Wizard (`src/pages/Wizard.jsx`)

| Classification | Finding | Impact |
|---|---|---|
| Incorrect — critical | The comment calls the flow "exhaustive," but it has six coarse steps and only a small fraction of mandatory/conditional fields. | The demo can claim completion while omitting legally significant data. |
| Missing — critical | No email/confirmation, passport type/issue place, nationality acquisition, gender/birth details, national ID/religion/visible mark/education, other passport, full address/contacts, separate parent/spouse details, employment detail, previous India/visa/refusal/country history, references, exact security questions or declaration. | It does not reproduce the official application. |
| Incorrect — high | Arrival port is free text and described as only an airport or seaport. The current registration control is a constrained list and includes designated landports. | Invalid ports are accepted; current land entry is omitted. |
| Incorrect — high | A departure date is required even though the official sample instead displays system-derived visa duration/entries and asks for an expected exit port. | Wrong field collected while a real field is absent. |
| Incorrect — high | Advancing from Documents does not require any upload; final Submit simply sets local state and fabricates a random ID. | The app depicts successful submission without validation, payment, persistence, or idempotency. |
| Incorrect — medium | `country_of_application` is a free-text first field not present on the live registration screen in that form, while nationality is missing when NormalFlow is used directly. | Country and nationality semantics are confused. |
| Incorrect — medium | The demo data names a real public person and company instead of clearly fictional synthetic data. | Avoidable privacy/reputational ambiguity in screenshots and tests. |

### Documents (`src/components/SmartDocuments.jsx`)

| Classification | Finding | Impact |
|---|---|---|
| Incorrect — critical | Passport upload accepts `.jpg`/`.jpeg`; official passport and supporting documents must be PDF. The photo accepts PNG; official photo format is JPEG. | Client allows files the Government flow rejects. |
| Missing — critical | No 10 KB–1 MB photo limit, square-dimension/face checks, or 10–300 KB PDF checks; no server-side MIME/content validation. Only the filename is stored. | Upload behavior does not exercise the real security or validation path. |
| Missing — high | Category-specific documents cover only business and medical/attendant, and the business requirement is oversimplified. | Most current routes cannot be completed correctly. |
| Incorrect — medium | Afghan-specific document logic checks `state.data.nationality`, but the NormalFlow entry point does not set nationality and Afghan nationals belong in a separate flow. | Dead/inconsistent cross-flow behavior. |

### Status and post-grant (`src/pages/Status.jsx`)

| Classification | Finding | Impact |
|---|---|---|
| Incorrect — critical | Status lookup accepts **either** application ID or passport number. `normal.md` says both; the official live page could not be verified, but exposing results by passport number alone is an unsafe enumeration design. | Personal/status data can be guessed and disclosed. |
| Incorrect — high | The timeline always states fee received and documents verified, regardless of the mock record's actual state. | It fabricates process events. |
| Missing — high | The Download PDF and Start e-Arrival buttons have no actual action and there is no Print Application, Verify Payment, Pay Later or Re-upload path. | The end-to-end flow stops at display-only UI. |
| Correct but incomplete | Requiring a printed ETA and showing an e-Arrival Card reminder align broadly with the current portal. | Add GRANTED verification, passport, port, biometrics, yellow fever, old/new passport and restricted-area notices. |

## Port findings

The project's arrival-port free text should be replaced with effective-dated reference data served by the backend. On 27 August 2026:

- The portal's designated-checkpost panel said **36 airports**, **38 seaports**, and listed **12 landports** for entry.
- The same page's FAQ still said 33 airports and 19 seaports and said land-border entry was not allowed.
- The live registration dropdown exposed airports, seaports and landports and included newer values such as Navi Mumbai Airport, Vizhinjam International Seaport, Darranga Landport and Gede Landport.

This official-site inconsistency is exactly why port lists must not be copied into JSX. Store a source URL, retrieval/effective date, status, display name and official code; update from a reviewed Government snapshot and keep the prior version for auditability.

## Prioritized corrections

### P0 — required before describing the demo as faithful

1. Replace the world-country recommendation with a current eligible-nationality dataset and explicit Afghan/Pakistani-passport/Pakistani-origin gates.
2. Replace the hard-coded purpose mapping with current, effective-dated visa services and sub-purposes, including e-Student and all other live branches.
3. Rebuild the wizard around the canonical journey above with mandatory/conditional schemas; do not share the same reduced field set across e-Visa, regular, Afghan and VoA.
4. Make final submission a backend transaction with validation, durable IDs, idempotency and a real state machine; never transition to Submitted solely in browser state.
5. Enforce document MIME, extension, size, count and category rules on the server. Do not store only filenames.
6. Require a secure composite status credential (at minimum the exact official fields once revalidated), add throttling/enumeration protection, and return stored state events rather than a fabricated timeline.

### P1 — required for a credible current-flow showcase

1. Add temporary-save/resume, verification/modify, final application ID, Pay Now/Pay Later, payment verification, print and re-upload states.
2. Replace free-text ports with reviewed reference data and handle official discrepancies explicitly.
3. Add fee schedules and rules as versioned data; show non-refundability and 3% bank charge. Remove the unsupported 3–5-day promise.
4. Add the complete arrival-readiness checklist and current official warnings.
5. Update `normal.md` with links, exact constraints, temporary/final ID distinction and the full current journey.

### P2 — UX and maintenance

1. Use clearly fictional synthetic identities in demo-fill data.
2. Present progressive disclosure for long conditional sections without changing the legal field set.
3. Add source/effective-date labels to eligibility, category, fee and port reference data and an operator workflow for reviewed updates.
4. Add automated fixtures for every purpose, conditional Yes branch, upload boundary, payment state, re-upload state and status lookup failure.

## Acceptance checks for the corrected normal flow

- An ineligible nationality cannot reach e-Visa submission, and Pakistani-origin rules cannot be bypassed by choosing a different nationality label.
- Every live purpose has a deterministic route and checklist; Study no longer always means paper visa.
- The registration screen contains all live page-one fields and validates dates, duplicate email, passport type and designated port.
- Temporary and final application IDs have distinct formats, lifecycle states and permissions.
- All official sample sections and six security questions are present with conditional validation.
- JPEG/PDF types and official byte limits are enforced server-side, and missing documents block verification/submission.
- Verification shows all persisted fields and immutable uploaded-document hashes before submission.
- Duplicate submit/payment retries do not create duplicate applications or payments.
- Status lookup cannot be performed by passport number alone and resists enumeration/rate abuse.
- The post-grant screen requires `GRANTED`, printable ETA and current arrival conditions, and never promises a processing duration not published by the Government.

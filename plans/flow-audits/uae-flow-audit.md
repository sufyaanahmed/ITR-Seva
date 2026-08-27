# Visa-on-Arrival flow audit: Japan, South Korea, and UAE

**Audit date:** 27 August 2026

**Scope:** `uae.md`, `src/pages/flows/VoaFlow.jsx`, the Visa-on-Arrival branch in `src/pages/guide/VisaFinder.jsx`, the VoA steps in `src/pages/Wizard.jsx`, and the e-Arrival references in `src/App.jsx` and `src/pages/Status.jsx`.

**Method:** Compared the specification and React implementation with the current Government of India visa portal, expanded the full official Visa-on-Arrival conditions, inspected the official Annexure I form, inspected the live e-Arrival form without entering or submitting data, and walked the local React VoA flow with synthetic demo data only through its review screen. No application was submitted, no document was uploaded, no payment was attempted, and no CAPTCHA was solved.

## Executive conclusion

`uae.md` captures the main published Visa-on-Arrival decision path substantially correctly: the three eligible nationalities, the special UAE prior-visa condition, permitted purposes, maximum duration, six airports, fee, and possible double entry all agree with the current official page.

The React implementation does **not** faithfully implement that specification. It presents an informational checklist rather than enforcing eligibility; the Visa Finder recognizes only Japanese tourism; the generated wizard omits most fields on the official Annexure I; and its final action is labelled `Submit Application` even though the official process is an application at the arrival visa counter. The implementation also fails to incorporate the now-required e-Arrival Card into the VoA journey.

The current build should therefore be treated as a visual prototype, not an accurate end-to-end VoA application flow.

## Official sources

All sources below are Government of India / Bureau of Immigration pages and were accessed on **27 August 2026**.

1. [India Visa Online home page](https://indianvisaonline.gov.in/) — current VoA nationalities and UAE condition; current mandatory e-Arrival advisory.
2. [Visa on Arrival](https://indianvisaonline.gov.in/visa/visa-on-arrival.html) — eligibility, exclusions, validity, airports, fee, and airport procedure.
3. [Annexure I: Application Form for Visa on Arrival (PDF)](https://indianvisaonline.gov.in/visa/image/VOA_FORM.pdf) — authoritative fields and declaration for the physical VoA form.
4. [e-Arrival Card](https://indianvisaonline.gov.in/earrival/) — current online arrival-card form and its required field groups.

The older URL `https://indianvisaonline.gov.in/visa/voa.html` currently returns a Government of India 500/404 error page. The project should link only to the current `visa-on-arrival.html` path.

## Authoritative current flow

1. The traveller is a citizen of **Japan**, **South Korea**, or the **United Arab Emirates**.
2. A UAE citizen is eligible only if they previously obtained an Indian e-Visa or regular/paper visa. The official page advises a first-time UAE visitor to obtain an e-Visa or regular/paper visa instead.
3. The visit is for **business, tourism, conference, or medical purposes** and does not exceed **60 days**.
4. The traveller has no residence or occupation in India, has a passport with at least six months' validity, has assured financial standing (including a return/onward ticket and sufficient funds), is not persona non grata, and is not considered undesirable.
5. The facility is unavailable when the traveller or either parent or grandparent was born in or was a permanent resident of Pakistan. The official UAE section additionally says Pakistan-origin UAE nationals are ineligible.
6. Diplomatic and Official passport holders are ineligible.
7. The traveller completes the mandatory **e-Arrival Card online within 72 hours before arrival**. The official home page explicitly says this is arrival information and not a visa.
8. The traveller arrives at one of six designated international airports: Bangalore, Chennai, Delhi, Hyderabad, Kolkata, or Mumbai.
9. The traveller presents a completed Annexure I VoA Application Form and a completed disembarkation card to the Visa Officer. The form may be downloaded and printed in advance, completed on arrival, or obtained from the airline on board.
10. The fee is **Rs. 2,000 or equivalent foreign currency per passenger, including children**, payable before grant.
11. The Immigration Officer may grant a **double-entry** VoA valid up to **60 days**. It is **non-extendable and non-convertible**.

## Findings for `uae.md`

### Correct

- **Eligible nationalities:** Lines 4–5 correctly identify Japan, South Korea, and UAE.
- **UAE condition:** Lines 15–26 correctly require a previous Indian e-Visa or regular/paper visa and direct an ineligible first-time UAE visitor to those alternatives.
- **Purposes and duration:** Lines 34–43 correctly list tourism, business, conference, and medical purposes and the 60-day maximum.
- **Core eligibility:** Lines 46–54 correctly include no residence/occupation in India, six-month passport validity, return/onward travel, and sufficient funds.
- **Passport class:** Lines 65–71 correctly exclude Diplomatic/Official passports.
- **Entry points:** Lines 77–83 match the six airports currently published by the Bureau of Immigration.
- **Airport paperwork:** Lines 86–87 correctly include the VoA form and disembarkation card.
- **Fee:** Lines 93–95 correctly state Rs. 2,000 per passenger, including children.
- **Grant:** Lines 102–109 correctly describe a possible double-entry VoA valid up to 60 days.

### Missing or incomplete

- **e-Arrival Card:** The current official portal requires foreign nationals and OCI/eOCI cardholders to submit an e-Arrival Card within 72 hours before arrival. This is a separate online arrival-information step and should appear before travel/arrival. It does not replace the VoA form or constitute a visa.
- **Pakistan-origin exclusion:** `Are you excluded from the scheme?` at line 57 is too vague. The flow should explicitly ask whether the applicant, either parent, or any grandparent was born in or was a permanent resident of Pakistan. This rule is important enough to be a visible disqualifying branch.
- **Other published exclusions:** The flow should explicitly cover persona-non-grata and undesirable-person conditions, or clearly state that these are assessed by the Government rather than presenting an unanswerable generic exclusion question.
- **Non-extendable/non-convertible:** This material condition is absent and should be shown before the traveller relies on VoA.
- **Foreign-currency fee option:** The official page allows Rs. 2,000 **or equivalent foreign currency**. The Markdown mentions only rupees.
- **Form timing/options:** The official page says the form may be downloaded/printed in advance, filled on arrival, or obtained from the airline. The Markdown could explain these alternatives rather than implying it must first be completed at the airport.
- **Evidence for prior UAE visa:** The official page states the eligibility condition but does not enumerate what proof is accepted on this page. The product should avoid inventing a required-document list and instead tell travellers to retain prior visa details/evidence and verify current requirements.

### Incorrect or potentially misleading

- **`Submit documents to Visa Officer` (line 90):** The official procedure specifically requires submission of the completed VoA form and disembarkation card. It does not publish a general supporting-document checklist on this page. Rename this to the specific items, while separately noting that passport, return/onward ticket, and proof of funds may be needed to demonstrate eligibility.
- **`Entry denied` branch (line 107):** Refusal is a reasonable practical outcome, but the reviewed official page does not describe a formal denial workflow or the wording `follow instructions`. Mark this outcome as a product explanation rather than an official procedural step, or link to an authoritative refusal/entry direction if one is found.

### Outdated

- No core rule in `uae.md` was found to be outdated as of the audit date. The material change/omission is the newly prominent mandatory e-Arrival requirement.

### Unverifiable from the reviewed official material

- The exact documents requested by an individual Visa Officer beyond the published form, disembarkation card, passport-validity condition, return/onward ticket, and sufficient funds.
- The exact payment methods or currencies accepted at each airport.
- A detailed refusal/appeal process for an unsuccessful on-arrival assessment.

## Findings for the React implementation

### Correct

- `VoaFlow.jsx` correctly names the three eligible nationalities and the UAE prior-visa condition.
- It correctly lists the six airports and the Rs. 2,000 fee.
- `Wizard.jsx` restricts the port selector to the six official airports.
- The site-wide banner in `App.jsx` accurately says an e-Arrival Card must be completed online within 72 hours before arrival and distinguishes the travel-preparation context.

### Critical defects

1. **The Visa Finder implements the wrong eligibility decision.**
   - `VisaFinder.jsx:80–86` recommends VoA only for a **Japanese** passport plus **tourism**.
   - It never recommends VoA for South Korean citizens or qualifying UAE citizens.
   - It omits business, conference, and medical VoA purposes.
   - It has no UAE prior-e-Visa/regular-visa question.
   - Its `1 to 6 months` duration bucket combines eligible stays of up to 60 days with ineligible stays over 60 days. Because the Japanese-tourism condition is evaluated before the duration branch, it can recommend VoA for a stay longer than 60 days.

2. **The VoA briefing does not actually check eligibility.**
   - `VoaFlow.jsx:35–51` renders green check marks and question-shaped text, not controls or branching decisions.
   - Any visitor can click `Start My Application`, regardless of nationality, prior UAE visa, purpose, duration, Pakistan origin, passport class, validity, residence/occupation, onward travel, funds, persona-non-grata status, or undesirability.

3. **The wizard cannot generate the official Annexure I form accurately.**
   - The four-step VoA wizard collects only country of application, split name, date of birth, marital status, passport number, issue/expiry dates, arrival date, arrival airport, and address in India.
   - It omits official Annexure I fields: flight number; nationality; father name/nationality; mother name/nationality; spouse name/nationality; previous nationality; other/dual nationality; Pakistan-origin details; purpose; occupation; permanent address abroad; email; contact numbers in India and abroad; Indian reference name/address/phone; return/onward date and flight; final destination; declaration; place; date; and signature.
   - Conversely, country of application, passport issue date, passport expiry date, expected arrival date, and selected airport are not fields on the reviewed Annexure I. They may be useful product fields but must not be presented as a complete mapping to the official form.

4. **The final action misrepresents the official process.**
   - The review screen says `Submit Application`, and `Wizard.jsx:68–74` then displays `Application Submitted (Demo)` with a generated application ID.
   - The official VoA process reviewed here is an application assessed and granted at the airport. The local product may prepare/download the Annexure I form, but it should not imply that it submits a VoA application or grants a pre-arrival application ID.

5. **The e-Arrival journey is a dead end.**
   - The global e-Arrival banner links to the local `/status` page rather than to a dedicated explanation or the official e-Arrival service.
   - `Status.jsx` shows `Start e-Arrival` only for a granted mock application, and the button has no action.
   - A VoA traveller would not normally have the mock `GRANTED` application status before arrival, so this placement hides the mandatory e-Arrival step from the audience that needs it.

### High-priority defects

- **Missing official conditions:** The briefing omits permitted purposes, 60-day maximum, passport-validity rule, no-residence/occupation rule, return/onward ticket, funds, Pakistan-origin exclusion, Diplomatic/Official passport exclusion, persona-non-grata/undesirable-person conditions, double-entry nature, and non-extendable/non-convertible status.
- **Tourist is silently hard-coded:** `VoaFlow.jsx:13–16` initializes every VoA as `visa_category: 'tourist'`, excluding valid business, conference, and medical journeys.
- **No six-month validity validation:** The wizard captures expiry date but does not validate at least six months' validity.
- **No UAE-specific proof/reference capture:** The application state neither records the applicant's qualifying prior Indian visa nor prevents a first-time UAE traveller from proceeding.
- **No official PDF output:** The UI promises to `Generate VoA Form`, but the inspected code provides only a generic review screen and then a fake submission receipt. There is no Annexure I PDF generation/download.
- **No arrival checklist:** It does not tell the traveller to bring the completed official form, disembarkation card, passport, onward/return ticket, or evidence of sufficient funds.

### Medium-priority defects

- **Demo data pollutes the VoA review:** `fillDemoData()` adds fields from other application types (`tazkira_number`, `parents_nationality`, `employer_name`, `visited_saarc`, etc.) to shared state. Although these controls are not shown in the four VoA steps, they appear on the final review screen.
- **Synthetic identity is not nationality-consistent:** The demo uses `country_of_application: United States` and does not set an eligible nationality, so it does not exercise the real VoA gate.
- **Terminology mismatch:** `Country where you are applying` suggests a pre-arrival application jurisdiction, while the official VoA application is presented at an Indian arrival counter.
- **No distinction between form preparation and government decision:** The product needs conspicuous copy stating that generating a form does not confer eligibility or approval and that the Immigration Officer makes the decision on arrival.
- **No external-service boundary:** If the product links to the official e-Arrival form, it should clearly warn that the traveller is leaving the demo portal for the Government of India service. The portal should not impersonate or proxy the official submission.

### Unverifiable implementation claims

- `Generate your pre-filled VoA form to bring to the airport` could not be verified because no PDF-generation code or download control exists in the reviewed flow.
- `Submit documents` is not backed by a product-side checklist or a complete official document inventory.

## Official Annexure I field comparison

| Official field/group | `uae.md` | React wizard |
|---|---|---|
| Name, date of birth, nationality, passport number | Implicitly `documents`/form only | Partial: name, DOB, passport; nationality missing |
| Arrival flight number | Missing | Missing |
| Father and mother names/nationalities | Missing | Missing |
| Marital status; spouse name/nationality | Missing | Partial: marital status only |
| Previous and dual/other nationality | Missing | Missing |
| Pakistan-origin details for parents/grandparents | Generic exclusion only | Missing for VoA |
| Purpose and occupation | Eligibility purpose listed | Missing; tourist silently hard-coded |
| Address in India and permanent address abroad | Missing | Partial: India address only |
| Email and India/abroad contact numbers | Missing | Missing |
| Reference in India | Missing | Missing |
| Return/onward date, flight, final destination | Eligibility mentions ticket | Missing from visible VoA steps |
| Declaration, place, date, signature | Missing | Missing |
| Disembarkation card | Present | Missing from React journey |

## Live-flow verification notes

The local React flow was opened at `/flow/voa`, then `Start My Application` was selected. Synthetic demo data was used to advance through Personal details, Passport details, Arrival Details, and Generate VoA Form. The following behaviors were observed:

- No eligibility response is required before the application starts.
- The arrival step contains only arrival date, one of six airports, and India address.
- The review reveals hidden cross-flow demo fields that the VoA user never reviewed or edited.
- The only final control is `Submit Application`; there is no `Download Annexure I` action.
- Testing stopped before that local submit action.

The official e-Arrival page was inspected without entering any data. It currently contains:

- full name, nationality/region, passport number, and purpose;
- arrival date and countries visited in the previous six days;
- address, state, and district in India;
- email, contact number, optional emergency contact, and additional-member support;
- CAPTCHA and an accuracy declaration.

These fields belong to a separate e-Arrival process and should not be conflated with Annexure I.

## Prioritized corrections

### P0 — required before claiming flow accuracy

1. Replace the Visa Finder branch with a complete decision model for Japan, South Korea, and UAE, including the UAE prior-visa gate, all four allowed purposes, and an exact `<= 60 days` duration check.
2. Turn the VoA briefing into enforceable eligibility questions with explicit ineligible outcomes; do not show decorative green checks before answers exist.
3. Replace `Submit Application` and the fake application ID with `Generate / Download VoA Application Form (Annexure I)`. State clearly that this is form preparation, not government submission or approval.
4. Map every official Annexure I field and declaration into the VoA form generator, or link directly to the official blank PDF if complete, trustworthy generation is not yet implemented.
5. Add the mandatory e-Arrival Card as a separate pre-travel step, link to the official Government of India service, and label it `arrival information, not a visa`.

### P1 — required for a robust traveller journey

1. Add all published disqualifiers and conditions, including Pakistan birth/permanent-residence ancestry, Diplomatic/Official passports, persona non grata, undesirable person, non-extendable, and non-convertible.
2. Validate six-month passport validity and require explicit acknowledgements for onward/return travel, funds, no residence/occupation in India, and correct purpose/duration.
3. Add a clear airport checklist: official VoA form, disembarkation card, passport, return/onward ticket, and sufficient-funds evidence; do not invent unverified requirements.
4. Record the previous visa condition for UAE travellers and tell them what is known versus what must be confirmed with the official portal/airport.
5. Remove shared demo fields from VoA state and provide a nationality-consistent synthetic fixture for Japan, South Korea, and returning UAE scenarios.

### P2 — quality and maintenance

1. Add content-level tests for each permitted nationality/purpose and each ineligible branch.
2. Add a source-and-review-date footer to regulatory guidance so maintainers know when the rules were last verified.
3. Add a scheduled manual review of all official links, especially the VoA page, Annexure PDF, airport list, fee, and e-Arrival requirements.
4. Keep the public disclaimer visible and avoid Government-of-India visual/wording cues that could imply the prototype is an authorized submission portal.

## Recommended acceptance tests

- Japanese tourist, 14 days, ordinary passport, all conditions met → eligible.
- South Korean business visitor, 45 days, ordinary passport, all conditions met → eligible.
- UAE medical visitor, 30 days, prior Indian e-Visa → eligible.
- UAE first-time visitor → VoA ineligible; route to e-Visa/regular visa.
- Any eligible nationality, conference, exactly 60 days → eligible.
- Any purpose, 61 days → VoA ineligible.
- Diplomatic or Official passport → VoA ineligible.
- Applicant/parent/grandparent born in or permanently resident of Pakistan → VoA ineligible.
- Passport validity below six months → VoA ineligible.
- Arrival at a non-designated airport → VoA unavailable for that arrival.
- Eligible traveller completes every Annexure I field and receives a faithful printable form, not a fake government submission receipt.
- Eligible traveller sees and can open the official e-Arrival service within the 72-hour pre-arrival window.

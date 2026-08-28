# Afghan-national visa flow audit

**Audit date:** 2026-08-27 (Asia/Kolkata)

**Scope:** `afghan.md`, `src/pages/flows/AfghanFlow.jsx`, and the connected finder, wizard, document, dashboard, and status components.

**Verdict:** The Markdown brief is directionally accurate and is based on the right Government of India portal, but it omits several mandatory requirements and important category variants. The React implementation does **not** faithfully implement the Afghan-national route. It labels it as a regular visa, defaults it to a non-existent Afghan `tourist` category, offers no Afghan category/purpose selection, and submits a generic, under-specified form.

## Evidence and limitations

### Official sources accessed

All official pages below were checked on **2026-08-27**:

- Government of India authorized visa portal: <https://www.indianvisaonline.gov.in/>
- Dedicated Visa for Afghanistan portal: <https://www.indianvisaonline.gov.in/avisa/index.html>
- Standard e-Visa portal, which directs Afghan nationals to the dedicated Afghan portal: <https://www.indianvisaonline.gov.in/evisa/>
- Ministry of External Affairs 2021 press release: <https://www.mea.gov.in/press-releases.htm?dtl/34200/owing+to+prevailing+security+situation+in+afghanistan+all+afghan+nationals+henceforth+must+travel+to+india+only+on+evisa=>
- Ministry of Home Affairs copy of the same 2021 announcement: <https://www.mha.gov.in/sites/default/files/AfghanEvisa_25082021.pdf>
- MEA visa-exemption agreement list (relevant to diplomatic-passport edge cases): <https://www.mea.gov.in/bvwa-passport-only.htm>

The current portal homepage presents four distinct paths: regular/paper visa, standard e-Visa, Visa on Arrival, and **AFGHAN Visa (For Afghanistan Nationals)**. The standard e-Visa page explicitly sends Afghan nationals to the dedicated Afghan portal. The dedicated portal issues an application ID, refers to an Electronic Travel Authorization (ETA), and requires the applicant to confirm `GRANTED` before travel. Therefore, the safest product wording is **“dedicated Afghan online visa/ETA route”**. It should not be represented as the ordinary regular/paper process.

The 2021 MEA/MHA notice called the emergency route an `e-Emergency X-Misc visa` and said Afghan nationals must travel only on e-Visa. That announcement is useful historical context, but the **current dedicated portal** is the controlling source for the categories now displayed.

### Browser limitation

The dedicated portal landing page, category data, and expanded instructions were accessible in the browser. Its current `Apply here for Visa` and `Check your Visa Status` links redirected to the Government portal's own `invalid_url.html`; `PrintApplication` also timed out during the audit. No CAPTCHA was solved, no identity data was entered, and no application was submitted.

Consequently, the exact live registration fields, live status-query fields, file constraints, payment behavior, final confirmation, and re-upload prompts are marked **unverifiable**. They must not be invented from the ordinary regular-visa or standard e-Visa form.

## Official flow observed

1. From the authorized portal, an Afghan national is directed to the dedicated `Visa for Afghanistan` portal rather than the ordinary e-Visa or regular/paper form.
2. The applicant chooses one of six published categories and then the applicable purpose/subtype:
   - Business Visa
   - Student Visa
   - Medical Visa
   - Medical Attendant Visa
   - Entry Visa
   - UN Diplomat Visa
3. Before applying, the applicant prepares a recent front-facing white-background photograph, passport bio page, National Identity Card (Tazkira), and the category/purpose-specific documents. The portal says the photo and documents must be clear, and documents such as invitation letters and business cards must be in English.
4. One application is completed per person. The applicant may save an unfinished application and resume it later.
5. The applicant must review the form before final submission. The portal explicitly says that no further modification is allowed after submission.
6. The applicant retains the generated Application ID. The landing page provides separate actions to resume a partial application, print an application, check visa status, and re-upload data.
7. Before travel, the applicant confirms that the ETA status is `GRANTED`, carries a copy of the ETA, and travels on the passport used for the application. If the ETA is on an old passport, the old passport must also be carried with the new one.
8. Biometrics are captured at immigration on arrival.
9. The e-Arrival Card is a separate arrival-information requirement, not a visa, and the authorized portal says foreign nationals and OCI cardholders may complete it within 72 hours before arrival.

## Category and document coverage

The current Afghan portal provides significantly more detail than either the brief page or implementation.

| Category | Current official variants | Published entry/validity highlights | Audit assessment |
|---|---|---|---|
| Business | Business venture/investor; other business; paid sports persons/coaches; dependants of the first two groups | Multiple; generally 1 year, sports up to 6 months/assignment, dependants co-terminus | `afghan.md` captures only the common company-letter route. Sports and dependant variants are **missing**. React has no category selection and cannot represent any variant. |
| Student | ICCR scholarship; new full-time structured study; returning student; spouse/children of higher-education/research student | Four entries; course-linked, or up to 1 year/co-terminus for dependants | `afghan.md` covers common study documents but omits returning-student and dependant variants and exact entry terms. React has no student document rules. |
| Medical | Patient | Triple entry, 2 months | The Markdown summary is **correct**. React would only add a generic hospital letter if `medical` were selected, but the Afghan flow never lets the user select it. |
| Medical Attendant | Afghan national accompanying the principal patient | Triple entry, 2 months, co-terminus with the patient | The Markdown summary is **correct**. React cannot select the category from the Afghan flow. |
| Entry | Ten distinct purposes, including cultural visit, minor with patient, specified family/PIO/OCI relations, qualifying property owner, official dependant, guardian/parent of student, seaman, and specified Afghan minority visits | Varies: single/multiple; 30 days, 2 months, 3 months, 1 year, or co-terminus | `afghan.md` usefully lists all ten at a high level, but purpose-specific documents and entry/validity values are **missing**. React has no Entry Visa model. |
| UN Diplomat | Assigned to India; visiting India; dependant of assigned diplomat; dependant of visiting diplomat | Single; 3 months for assignment cases and 30 days for visit cases | The category name is present in the Markdown and React briefing, but all purpose, document, and duration details are **missing**. |

Across the category variants, optional proof of Afghan residence and optional proof of occupation are repeatedly listed. Required additional documents vary by purpose, including company and chamber letters, sports approvals, admissions/financial evidence, relationship certificates, hospital-generated invitations, MHA/MEA clearances, RBI/property evidence, CDC pages, Indian/OCI/PIO relationship evidence, and travel itinerary.

## Audit of `afghan.md`

The repository file is named lowercase `afghan.md` (not `Afghan.md`).

### Correct

- **Dedicated route:** Lines 3–5 correctly say Afghan applicants use a dedicated Afghan portal rather than the standard e-Visa application UI.
- **Six categories:** Lines 7–24 exactly match the current dedicated portal.
- **Common identity documents:** Lines 26–32 correctly identify the passport bio page and Tazkira as mandatory common documents.
- **Business, student, medical, attendant, and Entry summaries:** Lines 34–137 accurately summarize the common cases, and the medical/attendant validity details match the portal.
- **One application per person and exact personal data:** Lines 139–156 match the portal instructions.
- **Resume, print, status, and re-upload capabilities:** Lines 158–173 reflect the actions exposed by the portal.
- **Travel requirements:** Lines 175–183 correctly capture `GRANTED`, ETA, passport continuity, and arrival biometrics.
- **e-Arrival distinction:** Lines 185–189 correctly explain that the e-Arrival Card is not a visa and is separate from the visa application.

### Missing

- **Mandatory photograph:** The portal says a recent front-facing white-background photograph is mandatory alongside the passport page and Tazkira. Lines 26–32 omit it from the common prerequisites.
- **Save/review/no-edits rule:** The portal says an unfinished form can be saved, applicants must verify details before submission, and submitted forms cannot be modified. The brief mentions continuing a partial form but not the important finality warning.
- **Application ID retention:** The portal expressly tells applicants to retain the automatically generated Application ID for future communication.
- **Category purpose selection:** The brief lists top-level categories but does not explain that Business, Student, Entry, and UN Diplomat each have several official purposes with different documents, entry counts, and validity.
- **Business sports and dependant routes; Student returning/dependant routes; UN Diplomat details:** These are absent, as summarized in the category table above.
- **Clear-upload warning:** The portal warns that unclear photographs/documents can cause rejection.
- **Explicit official links:** The “Official Website” section should contain the actual authorized homepage and dedicated Afghan portal links.
- **Passport-type edge case:** MEA currently lists a 30-day visa-exemption agreement for Afghan diplomatic passports. The exact operational scope relative to the Afghan portal and UN-diplomat category requires policy/legal verification, but the product should at least ask passport type and avoid treating every Afghan passport identically.

### Incorrect or misleading

- **Post-submission completion/correction wording:** Lines 158–173 place “Complete an application” under “After Submitting” and say to follow correction instructions. The official portal distinguishes resuming an unfinished form from final submission and says no modifications are allowed after submission. Re-upload is a separate action; it should not be presented as general editing.
- **“May need” for purpose-required documents:** The Business and Student sections use tentative wording. The portal lists documents as required for a selected purpose, while residence and occupation evidence are explicitly optional. The brief should distinguish required versus optional per subtype.
- **ETA qualification:** Line 179 says “where applicable.” The Afghan portal's own instruction tells the applicant to carry the ETA. Unless a verified subtype exception exists, the Afghan flow should state the portal instruction directly rather than weaken it.

### Outdated

No clearly outdated category or validity statement was found. The content needs completeness and precision changes rather than a wholesale policy rewrite.

### Unverifiable

- Whether a fee is charged, the payment method, or whether a separate payment-verification step exists on the Afghan route.
- The precise current form fields and client/server validation.
- Current upload extensions, file sizes, dimensions, and PDF page limits.
- Exact live status-query credentials and status vocabulary beyond the expressly published `GRANTED` travel check.
- Whether all Afghan ETA categories use the same authorized entry/exit checkpoints as the standard e-Visa system.
- Processing-time guarantees.

These subjects should remain absent or explicitly caveated until the live route works or an official current instruction document is obtained.

## Audit of the React implementation

### Correct

- `VisaFinder.jsx` recognizes Afghanistan as a special branch and routes to `/flow/afghan`.
- `AfghanFlow.jsx` displays the six current categories.
- The briefing includes passport bio page, Tazkira, one-application-per-person, English-language documents, and arrival biometrics.
- `SmartDocuments.jsx` includes a photograph, passport bio page, and Tazkira when nationality is Afghanistan.
- The generic wizard offers saving locally, review, submission, and a demo Application ID concept.

### Incorrect — release-blocking

1. **Afghan is mislabeled as regular/paper.** `AfghanFlow.jsx:11–15` writes `type: 'regular'` and `application_type: 'regular'`. `Dashboard.jsx:42` therefore displays “Regular Visa Application.” The current public portal provides a separate Afghan online/ETA path; it is not the ordinary mission/VAC paper flow.
2. **A non-existent Tourist category is selected.** `AfghanFlow.jsx:15` hard-codes `visa_category: 'tourist'`, but the current Afghan portal lists no Tourist Visa. For example, only a narrow Entry Visa purpose is published for specified Afghan minority-community visits; a generic Afghan tourism application must not be implied.
3. **There is no category or purpose/subtype selection.** The briefing cards are static. Clicking Start jumps straight into a generic form. This prevents the system from establishing eligibility, entry count, validity, or the right document list.
4. **The finder ignores the selected purpose for Afghan applicants.** `VisaFinder.jsx:73–79` sends every Afghan answer to the same generic branch, including unsupported purposes, without explaining that the official Afghan portal's published categories are limited.
5. **The wizard conflates all regular applications with Afghan applications.** `Wizard.jsx:10` defines `isAfghan` as `regular || afghan`, causing ordinary regular applicants to receive a mandatory Tazkira field and preventing a distinct Afghan data model.
6. **Submission succeeds without mandatory documents.** The document step shows “Missing,” but `Wizard.jsx:109–116` advances or submits without document completeness checks. The browser can report a successful demo submission with no passport, photo, Tazkira, or purpose document.

### Missing — high priority

- **Afghan application type:** Use a distinct `afghan` type throughout state, routing, dashboard labeling, metrics, and persistence.
- **Purpose-aware rules:** Implement all six categories and their published subtypes, entry/validity display, required documents, and optional residence/occupation evidence.
- **Mandatory-photo briefing:** `AfghanFlow.jsx:47–53` lists only passport and Tazkira even though the official page also makes the photograph mandatory.
- **Required category documents:** `SmartDocuments.jsx` only knows generic Business and Medical/Medical Attendant extras. It has no Student, Entry, or UN Diplomat rules, no Business subtype rules, and no Medical minor-consent rule.
- **No-edits finality checkpoint:** The review step needs a clear “cannot modify after final submission” warning and explicit acknowledgement. Re-upload must be modeled separately from editing submitted values.
- **Application ID lifecycle:** The official concept is a durable ID used to resume and communicate. The app generates `Math.random()` inside render (`Wizard.jsx:72`), so the displayed ID can change and is not connected to Resume or Status.
- **Afghan status record/flow:** `Status.jsx` contains no Afghan sample. Its invented “Documents Verified” timeline is not evidenced by the Afghan portal and should not be presented as an official sequence.
- **Travel details:** The implemented Afghan briefing omits `GRANTED`, carrying the ETA, old/new passport behavior, and the separate e-Arrival Card. `Status.jsx` includes some of these only for unrelated hard-coded samples, and its buttons have no action.
- **Official handoff/link:** The demo should clearly identify itself and link the user to the dedicated official Afghan portal for an actual application.
- **Security/validation:** Filename-only uploads, no file validation, and lookup by Application ID **or** passport alone are not suitable representations of a robust production workflow. Exact official status credentials remain unverifiable, but the demo should require at least two non-public factors and avoid returning applicant identity on a guessed reference.

### Unverifiable implementation details

The generic wizard's field list cannot be declared an accurate clone of the live Afghan form because the current registration route was inaccessible. It is plainly incomplete for the published journey because it lacks category/purpose selection and purpose-specific supporting data; all other field-by-field corrections should be made only after the official registration form becomes accessible.

The app should not add a fee/payment step for Afghan applications until current official evidence confirms it.

## Prioritized corrections

### P0 — correct eligibility and routing before backend integration

1. Introduce `application_type: 'afghan'`; never store this route as `regular`.
2. Remove the `tourist` default. Require selection from the six current categories, followed by an official purpose/subtype.
3. For purposes not present on the Afghan portal, stop the wizard and direct the user to the official portal/appropriate Indian authority instead of silently inventing a category.
4. Separate ordinary regular-visa logic from Afghan logic in `Wizard.jsx`.
5. Block final submission until the mandatory common and selected-purpose documents are present.

### P1 — make the journey faithful

1. Add a purpose-driven schema for eligibility, entry count, validity, required/optional evidence, conditional consent/clearance documents, and dependants.
2. Add mandatory photo and upload-clarity/English-language instructions to the briefing and checklist.
3. Add save/resume semantics with a stable draft/application ID.
4. Add a final review warning that submitted application data cannot be modified; keep requested re-upload as a separate post-submission workflow.
5. Model print, status, and re-upload as distinct routes, while marking any unverified exact fields as demo approximations.
6. Replace the invented status timeline with only verified states, or label it explicitly as a fictional service model.

### P2 — arrival and edge-case completeness

1. Add the `GRANTED` check, printable ETA, passport-used-for-application rule, old-passport rule, arrival biometrics, and separate e-Arrival Card reminder.
2. Ask passport type and send diplomatic/official cases to a verified exception flow; do not conflate an Afghan diplomatic-passport waiver with the UN Diplomat category.
3. Add direct, visible links to the authorized homepage and dedicated Afghan portal with a last-verified date.
4. Re-check the live registration, payment, status, re-upload, and print pages when the Government portal route is functional, then update the exact forms and tests.

## Recommended acceptance tests

- Selecting Afghanistan never creates a `regular` or `tourist` application.
- Every published top-level category and purpose displays the matching official entry/validity and document checklist.
- Unsupported Tourist or Employment purposes cannot reach submission.
- Medical minor requires parent-consent evidence; Medical Attendant is linked to a principal patient; dependant routes require relationship evidence.
- Final submission is blocked without photo, passport bio page, Tazkira, and all purpose-required evidence.
- Optional residence/occupation evidence is visibly optional and does not block submission.
- A stable ID survives refresh and can resume the same draft.
- Final review warns that submitted data cannot be modified; re-upload does not reopen form fields.
- Status lookup does not disclose an applicant profile from a single guessable identifier.
- Granted travel guidance includes ETA, `GRANTED`, passport continuity, biometrics, and e-Arrival Card as a separate requirement.

## Bottom line

`afghan.md` is a useful foundation and is mostly correct, but it needs the mandatory photograph, save/review/finality rules, category subtypes, and clearer required-versus-optional wording. The React implementation needs redesign rather than small copy edits. Its current `regular + tourist` state is directly at odds with the dedicated Afghan portal and can produce a seemingly successful application for a visa category the Government portal does not offer.

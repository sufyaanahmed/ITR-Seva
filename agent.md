# Bharat Visa Portal

## Complete Agent & Product Specification

> **Project:** Bharat Visa Portal — OpenAI Hackathon Prototype
> **Repository:** `visa-seva`
> **Repository name:** `https://github.com/sufyaanahmed/visa-seva.git`
> **Status:** Functional prototype / demo
> **Purpose:** Reconstruct the user-facing information architecture and workflows of an Indian visa portal as a modern, accessible, low-connectivity, agent-friendly application.
>
> **Important:** This is a hackathon prototype. It is **not an official Government of India website**, must not imply government affiliation, and must not submit real visa applications or process real payments.

---

# 1. Product Vision

Build a modern visa application portal that can be used equally well by:

* A normal web user
* An elderly user
* A user with low vision
* A screen-reader user
* A keyboard-only user
* A user on a low-end Android phone
* A user with poor or intermittent connectivity
* An AI browser agent
* ChatGPT / Claude / Codex-style agents

The core principle is:

```text
                    ONE APPLICATION
                          |
          ┌───────────────┼───────────────┐
          ↓               ↓               ↓
        Human          Elderly         AI Agent
          ↓               ↓               ↓
          └───────────────┼───────────────┘
                          ↓
                  Same data model
                  Same workflows
                  Same application
```

Do not build separate experiences for humans and agents.

Build one semantic, accessible application that both can understand.

---

# 2. Primary Goals

The prototype must:

1. Reconstruct the major information architecture of the Indian Visa Online experience.
2. Provide functional demo workflows.
3. Provide a realistic multi-step application wizard.
4. Support save/resume.
5. Support document uploads using fictional/demo files.
6. Support simulated payments.
7. Support application status tracking.
8. Support document re-upload.
9. Support printing/download of demo applications.
10. Work on mobile.
11. Work under poor connectivity.
12. Preserve drafts when offline.
13. Be usable by elderly users.
14. Meet WCAG 2.2 AA-oriented accessibility requirements.
15. Be highly discoverable and operable by AI agents.
16. Provide `/agent.md` as the canonical agent-readable specification.
17. Provide `/llms.txt` as a lightweight discovery document.

---

# 3. Non-Goals

Do NOT:

* Submit applications to the real Indian government.
* Call real government visa APIs.
* Process real payments.
* Store real credit/debit card information.
* Require real passport documents.
* Imply official government affiliation.
* Reproduce government authentication systems.
* Attempt to bypass government security controls.
* Store sensitive real-world identity data unnecessarily.

All data used in the demo should be fictional.

---

# 4. Prototype Disclaimer

Every page must display a persistent but unobtrusive banner:

```text
HACKATHON PROTOTYPE — NOT AN OFFICIAL GOVERNMENT WEBSITE
```

The application PDF should also contain:

```text
HACKATHON PROTOTYPE
NOT AN OFFICIAL VISA DOCUMENT
```

---

# 5. Site Map

```text
/
│
├── /visa
│   ├── /visa/apply
│   ├── /visa/apply/mission
│   ├── /visa/apply/applicant
│   ├── /visa/apply/passport
│   ├── /visa/apply/address
│   ├── /visa/apply/family
│   ├── /visa/apply/employment
│   ├── /visa/apply/travel
│   ├── /visa/apply/previous-visits
│   ├── /visa/apply/references
│   ├── /visa/apply/documents
│   ├── /visa/apply/review
│   ├── /visa/apply/submitted
│   ├── /visa/resume
│   ├── /visa/status
│   ├── /visa/print
│   ├── /visa/reupload
│   ├── /visa/categories
│   ├── /visa/provisions
│   └── /visa/instructions
│
├── /evisa
│   ├── /evisa/apply
│   ├── /evisa/apply/mission
│   ├── /evisa/apply/applicant
│   ├── /evisa/apply/passport
│   ├── /evisa/apply/address
│   ├── /evisa/apply/family
│   ├── /evisa/apply/employment
│   ├── /evisa/apply/travel
│   ├── /evisa/apply/previous-visits
│   ├── /evisa/apply/references
│   ├── /evisa/apply/documents
│   ├── /evisa/apply/payment
│   ├── /evisa/apply/review
│   ├── /evisa/apply/submitted
│   ├── /evisa/resume
│   ├── /evisa/status
│   ├── /evisa/print
│   ├── /evisa/reupload
│   ├── /evisa/eligibility
│   ├── /evisa/documents
│   ├── /evisa/faq
│   └── /evisa/checkpoints
│
├── /afghanistan
│   ├── /afghanistan/apply
│   ├── /afghanistan/resume
│   ├── /afghanistan/status
│   ├── /afghanistan/print
│   └── /afghanistan/reupload
│
├── /demo
│
├── /help
│   └── /help/contact
│
├── /agent.md
├── /llms.txt
└── /site-map.md
```

---

# 6. Home Page

## Route

```text
/
```

The homepage must be extremely simple.

Primary options:

```text
Apply for a Visa
Continue My Application
Check Application Status
Get Help
```

Visa choices:

```text
Regular / Paper Visa
e-Visa
Afghanistan Visa
```

Example:

```text
Welcome to Bharat Visa Portal

What would you like to do?

┌─────────────────────────────────┐
│ Apply for a Visa                │
│ Start a new application         │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Continue My Application         │
│ Continue an application I saved │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Check Application Status        │
│ See the status of my application│
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Get Help                        │
│ Help completing your application│
└─────────────────────────────────┘
```

Do not overwhelm users with a large navigation menu.

---

# 7. Main Services

## Regular / Paper Visa

```text
/visa
```

Actions:

```text
START_REGULAR_APPLICATION
RESUME_REGULAR_APPLICATION
CHECK_REGULAR_STATUS
PRINT_REGULAR_APPLICATION
REUPLOAD_REGULAR_DOCUMENTS
```

## e-Visa

```text
/evisa
```

Actions:

```text
START_EVISA_APPLICATION
RESUME_EVISA_APPLICATION
PAY_EVISA_FEE
VERIFY_PAYMENT
CHECK_EVISA_STATUS
PRINT_EVISA
REUPLOAD_EVISA_DOCUMENTS
```

## Afghanistan Visa

```text
/afghanistan
```

Actions:

```text
START_AFGHANISTAN_APPLICATION
RESUME_AFGHANISTAN_APPLICATION
CHECK_AFGHANISTAN_STATUS
PRINT_AFGHANISTAN_APPLICATION
REUPLOAD_AFGHANISTAN_DOCUMENTS
```

---

# 8. Visa Categories

Support at minimum:

```text
Tourist Visa
Business Visa
Medical Visa
Medical Attendant Visa
Student Visa
Transit Visa
Film Visa
Miscellaneous Visa
Entry Visa
```

For e-Visa, initially fully implement:

```text
e-Tourist
e-Business
e-Medical
e-Medical Attendant
```

Other categories can use the same wizard with different configuration.

Visa categories must be represented as data rather than hard-coded into components.

Example:

```json
{
  "category_id": "tourist",
  "name": "Tourist Visa",
  "application_type": "evisa",
  "description": "Travel for tourism and permitted related activities."
}
```

---

# 9. Application Wizard

The wizard is the most important component.

Default structure:

```text
1. Mission / Visa Type
2. Applicant Details
3. Passport Details
4. Address Details
5. Family Details
6. Employment / Occupation
7. Travel Details
8. Previous India Visits
9. References
10. Documents
11. Review
12. Submission
```

Steps may vary according to visa category.

---

# 10. Persistent Progress

Always display:

```text
Step 3 of 12
```

and a semantic progress indicator:

```text
✓ Visa type
✓ Personal details
● Passport
○ Travel
○ Documents
○ Review
```

Never communicate progress using color alone.

---

# 11. Step 1 — Mission / Visa Type

Fields:

```text
application_type
visa_category
visa_subcategory
country_of_application
indian_mission
purpose_of_visit
```

Example:

```json
{
  "application_type": "evisa",
  "visa_category": "tourist",
  "visa_subcategory": "e-tourist-30-day",
  "country_of_application": "United States",
  "purpose_of_visit": "Tourism"
}
```

---

# 12. Step 2 — Applicant Details

Fields:

```text
surname
given_name
middle_name
previous_name
gender
date_of_birth
place_of_birth
country_of_birth
nationality
nationality_at_birth
citizenship_id
marital_status
```

Rules:

* Preserve the exact spelling supplied by the user.
* Never invent a name.
* Never automatically transliterate identity information.
* Explain difficult fields in plain language.

Example:

```text
Full name

Enter your name exactly as it appears on your passport.
```

---

# 13. Step 3 — Passport Details

Fields:

```text
passport_number
passport_type
country_of_passport
place_of_issue
date_of_issue
date_of_expiry
nationality_on_passport
```

Validation:

```text
passport_number is required
date_of_issue < date_of_expiry
passport cannot be expired where applicable
```

Uploaded passport information must correspond to entered passport information.

---

# 14. Step 4 — Address

Fields:

```text
address_line_1
address_line_2
city
state
postal_code
country
phone
mobile
email
```

Never infer an address.

If required information is missing, ask the user.

---

# 15. Step 5 — Family

Fields:

```text
father_name
mother_name
spouse_name
spouse_nationality
spouse_place_of_birth
```

Conditional fields:

```text
IF marital_status == married
THEN show spouse fields
```

---

# 16. Step 6 — Employment

Fields:

```text
occupation
employer_name
employer_address
employer_phone
previous_occupation
```

Only show fields relevant to the selected visa category.

---

# 17. Step 7 — Travel

Fields:

```text
expected_arrival_date
expected_departure_date
port_of_arrival
port_of_exit
places_to_visit
address_in_india
hotel_name
hotel_address
hotel_phone
```

Example:

```json
{
  "expected_arrival_date": "2026-11-14",
  "expected_departure_date": "2026-11-26",
  "port_of_arrival": "Delhi",
  "places_to_visit": [
    "Delhi",
    "Agra",
    "Jaipur"
  ]
}
```

---

# 18. Step 8 — Previous India Visits

Fields:

```text
visited_india_before
previous_visa_number
previous_visa_type
previous_arrival_date
previous_departure_date
previous_places_visited
previous_address
```

Conditional behavior:

```text
IF visited_india_before == false
SKIP previous visit details
```

---

# 19. Step 9 — References

Fields:

```text
reference_in_india
reference_name
reference_address
reference_phone
reference_email
```

Category-specific examples:

```text
Tourist → hotel/accommodation
Business → business reference
Medical → hospital/medical institution
```

---

# 20. Step 10 — Documents

Supported document types:

```text
passport
photograph
supporting_document
invitation_letter
business_document
medical_document
other_document
```

Document object:

```json
{
  "id": "doc_demo_001",
  "type": "passport",
  "filename": "passport.pdf",
  "status": "uploaded",
  "verified": false
}
```

All files are demo/local files.

Do not send them to external government systems.

---

# 21. Document UX

Display:

```text
Required Documents

✓ Passport
✓ Photograph
○ Supporting Document

[ Upload ]
```

After upload:

```text
passport.pdf

✓ Uploaded
✓ Correct file type
✓ File size valid

[ Replace ]
[ Remove ]
```

---

# 22. Step 11 — Review

Show a complete summary.

Example:

```text
APPLICATION REVIEW

Applicant
John Smith
United States

Passport
DEMO123456
Expires: 2030-04-18

Visa
e-Tourist Visa

Travel
14 Nov 2026 → 26 Nov 2026

Documents
✓ Passport
✓ Photograph

[ EDIT ]
[ SAVE ]
[ SUBMIT APPLICATION ]
```

Before final submission, require explicit user confirmation.

---

# 23. Step 12 — Submission

On confirmed submission:

```text
SUBMIT_APPLICATION
```

Generate an Application ID:

```text
DEMO2026A00001
```

Store:

```json
{
  "application_id": "DEMO2026A00001",
  "status": "SUBMITTED",
  "submitted_at": "2026-08-19T12:00:00+05:30"
}
```

Never submit without explicit confirmation.

---

# 24. Application State Machine

```text
DRAFT
  ↓
SUBMITTED
  ↓
DOCUMENTS_PENDING
  ↓
DOCUMENTS_VERIFIED
  ↓
UNDER_REVIEW
  ├──→ DOCUMENTS_REQUIRED
  │         ↓
  │   DOCUMENTS_REUPLOADED
  │         ↓
  │    UNDER_REVIEW
  │
  ├──→ REJECTED
  │
  └──→ APPROVED
           ↓
       VISA_ISSUED
```

e-Visa payment path:

```text
SUBMITTED
    ↓
PAYMENT_PENDING
    ↓
PAYMENT_SUCCESS
    ↓
UNDER_REVIEW
    ↓
ETA_GRANTED
```

---

# 25. Save / Resume

The user must be able to save at any point.

Actions:

```text
SAVE_APPLICATION
RESUME_APPLICATION
```

Resume page:

```text
Application ID
[ DEMO2026D00001 ]

Passport Number
[ DEMO123456 ]

Access Code
[ ******** ]

[ Continue ]
```

For the demo, use deterministic fictional access codes.

---

# 26. Auto-Save

Automatically save meaningful changes.

Display:

```text
✓ Saved just now
```

or:

```text
Saving...
```

Never silently discard user input.

---

# 27. Offline Draft

Application data must be saved locally using IndexedDB.

Architecture:

```text
User edits form
      ↓
Local IndexedDB
      ↓
Connection restored
      ↓
Sync queue
      ↓
Demo server
```

If offline:

```text
⚠ You're offline.

Your application is safe on this device.

You can continue filling the form.
We will save your changes when your connection returns.
```

The user must be able to continue editing previously loaded content while offline.

---

# 28. Connection States

Support:

```text
ONLINE
OFFLINE
CONNECTING
SYNCING
SYNC_FAILED
```

Examples:

```text
✓ Connected

You're offline. Your draft is saved on this device.

Saving your changes...

✓ Changes saved

We couldn't save to the server.
Your information is still saved on this device.
[ Try again ]
```

Never lose data because of network failure.

---

# 29. Low-Bandwidth Mode

Provide:

```text
Data Saver
```

When enabled:

* No decorative images
* No unnecessary animations
* No video
* No external fonts
* Minimal JavaScript
* Minimal API requests
* Lazy-load nonessential resources
* Compress required assets
* Prefer system fonts
* Cache static assets

The core application must work without images.

---

# 30. Network Simulation

Create:

```text
/demo
```

with:

```text
Connection Simulation

○ Fast
○ 4G
○ 3G
○ Slow 3G
○ Offline
```

This allows judges to demonstrate resilience.

---

# 31. Status Checking

Route:

```text
/visa/status
/evisa/status
```

Inputs:

```text
application_id
passport_number
```

Action:

```text
CHECK_STATUS
```

Example:

```text
APPLICATION STATUS

Application ID:
DEMO2026A00001

Applicant:
John Smith

Visa Type:
e-Tourist Visa

STATUS:
GRANTED
```

Timeline:

```text
✓ Application Submitted
✓ Documents Verified
✓ Payment Confirmed
✓ Application Reviewed
✓ Visa Granted
```

---

# 32. Demo Applications

Seed fictional applications.

## Granted

```json
{
  "application_id": "DEMO2026A00001",
  "passport_number": "DEMO123456",
  "applicant": "John Smith",
  "nationality": "United States",
  "visa_type": "e-Tourist Visa",
  "status": "GRANTED"
}
```

## Under Review

```json
{
  "application_id": "DEMO2026A00002",
  "passport_number": "DEMO123457",
  "applicant": "Sarah Williams",
  "nationality": "United Kingdom",
  "visa_type": "e-Business Visa",
  "status": "UNDER_REVIEW"
}
```

## Documents Required

```json
{
  "application_id": "DEMO2026A00003",
  "passport_number": "DEMO123458",
  "applicant": "Michael Brown",
  "nationality": "Australia",
  "visa_type": "e-Medical Visa",
  "status": "DOCUMENTS_REQUIRED"
}
```

## Rejected

```json
{
  "application_id": "DEMO2026A00004",
  "passport_number": "DEMO123459",
  "applicant": "Alex Johnson",
  "nationality": "Canada",
  "visa_type": "Regular Tourist Visa",
  "status": "REJECTED"
}
```

---

# 33. Re-upload

Route:

```text
/visa/reupload
/evisa/reupload
```

Inputs:

```text
application_id
passport_number
access_code
```

Example:

```text
Documents Requested

Passport
✓ Existing

Photograph
⚠ Re-upload required

Supporting Document
✓ Existing

[ Upload New Photograph ]
```

---

# 34. Print Application

Route:

```text
/visa/print
/evisa/print
```

Output:

```text
INDIA VISA APPLICATION

Application ID: DEMO2026A00001

Applicant:
John Smith

Passport:
DEMO123456

Visa:
e-Tourist Visa

...

HACKATHON PROTOTYPE
NOT AN OFFICIAL VISA DOCUMENT
```

Provide:

```text
PRINT_APPLICATION
DOWNLOAD_APPLICATION
```

---

# 35. Simulated Payment

Never process real payments.

Display:

```text
VISA FEE

Visa Fee             ₹2,000
Service Charge         ₹500
----------------------------
Total                 ₹2,500

[ SIMULATE PAYMENT ]
```

After action:

```text
PAYMENT SUCCESSFUL

Transaction ID:
DEMO-TXN-839201

Application:
DEMO2026A00001
```

---

# 36. Agent-Friendly Architecture

The application must be understandable by an AI agent without visual guessing.

Expose:

```text
/agent.md
/llms.txt
/site-map.md
```

Recommended additional files:

```text
/agent/
├── application.md
├── workflows.md
├── forms.md
├── fields.md
├── actions.md
├── documents.md
├── demo-data.md
└── faq.md
```

`/agent.md` is the canonical entry point.

---

# 37. Agent Instructions

An agent should be able to:

1. Discover `/agent.md`.
2. Understand the site's navigation.
3. Determine the appropriate visa flow.
4. Read the application schema.
5. Fill information supplied by the user.
6. Identify missing required information.
7. Ask the user only for missing information.
8. Navigate through the wizard.
9. Upload user-provided documents.
10. Validate the form.
11. Review the application.
12. Ask for final confirmation.
13. Submit the demo application.
14. Return the Application ID.

Never invent personal information.

Never invent passport information.

Never invent dates.

Never invent addresses.

Never invent employment history.

Never fabricate documents.

---

# 38. Agent Action Registry

Use a stable action vocabulary:

```text
START_REGULAR_APPLICATION
START_EVISA_APPLICATION
START_AFGHANISTAN_APPLICATION

SAVE_APPLICATION
RESUME_APPLICATION

NEXT_STEP
PREVIOUS_STEP

UPLOAD_DOCUMENT
REMOVE_DOCUMENT
REPLACE_DOCUMENT

REVIEW_APPLICATION
SUBMIT_APPLICATION

CHECK_STATUS
REUPLOAD_DOCUMENT

VERIFY_PAYMENT
SIMULATE_PAYMENT

PRINT_APPLICATION
DOWNLOAD_APPLICATION
```

---

# 39. Agent Field Registry

Every field must expose:

```text
id
name
label
type
required
description
validation
step
```

Example:

```json
{
  "id": "passport-number",
  "name": "passport_number",
  "label": "Passport number",
  "type": "text",
  "required": true,
  "description": "Enter the number printed on your passport.",
  "step": "passport"
}
```

---

# 40. Semantic HTML Contract

Use real HTML controls.

Good:

```html
<label for="passport-number">
  Passport number
</label>

<input
  id="passport-number"
  name="passport_number"
  type="text"
/>
```

Bad:

```html
<div onclick="...">
  Passport Number
</div>
```

Every important control must have:

```text
stable ID
stable name
semantic label
agent metadata
validation
```

---

# 41. Agent Metadata

Expose page metadata:

```html
<meta
  name="agent-page"
  content="evisa-application"
/>

<meta
  name="agent-purpose"
  content="Complete an e-Visa application"
/>
```

Interactive elements:

```html
<input
  id="applicant-given-name"
  name="given_name"
  data-agent-field="given_name"
/>

<button
  id="continue-applicant"
  data-agent-action="NEXT_STEP"
>
  Continue
</button>
```

---

# 42. Machine-Readable Site Index

Create:

```text
/llms.txt
```

Example:

```text
# Bharat Visa Portal

This is a hackathon prototype.

## Main services

/visa
/evisa
/afghanistan

## Application

/visa/apply
/evisa/apply

## Actions

START_REGULAR_APPLICATION
START_EVISA_APPLICATION
RESUME_APPLICATION
CHECK_STATUS
REUPLOAD_DOCUMENT
PRINT_APPLICATION

## Agent documentation

/agent.md
/agent/application.md
/agent/workflows.md
/agent/forms.md
/agent/fields.md
/agent/actions.md
```

---

# 43. Conversational Agent Example

User:

> I'm a US citizen going to India for 12 days for tourism.

Agent extracts only known information:

```json
{
  "purpose_of_visit": "tourism",
  "nationality": "United States",
  "trip_duration": 12
}
```

The agent may recommend an appropriate demo flow based on the application's configured eligibility data.

It must not fabricate:

```text
passport number
date of birth
passport expiry
home address
employment
photograph
```

It asks for those when required.

---

# 44. Final Confirmation

Before submission:

```text
Your application is ready.

Please review your information.

[ Review application ]

After you submit, the application will be locked.

[ Go back ]
[ Submit application ]
```

An agent must never bypass this confirmation.

---

# 45. Accessibility

The application must target WCAG 2.2 AA-oriented design.

Primary accessibility principles:

```text
Perceivable
Operable
Understandable
Robust
```

Accessibility is a core product requirement.

---

# 46. Elderly User Requirements

The application must work for users who:

* Have reduced vision
* Have limited computer experience
* Make mistakes while filling forms
* Need more time
* Use touch devices
* Need help understanding terminology

Design for the least-confident user.

The UI must be:

```text
Simple
Forgiving
Readable
Predictable
Recoverable
```

---

# 47. Typography

Default:

```text
Body: 18px minimum
Important instructions: 18–20px
Headings: 28px+
Primary buttons: 18px+
```

The layout must remain usable at:

```text
125%
150%
200%
```

browser zoom.

---

# 48. Touch Targets

Minimum:

```text
44 × 44 px
```

Preferred:

```text
48 × 48 px
```

Primary buttons should be large.

Avoid tiny controls and tiny links.

---

# 49. High Contrast

Use:

```text
White background
Near-black text
Dark blue primary action
Dark red errors
Dark green success
Dark amber warnings
```

Never communicate meaning using color alone.

Example:

```text
⚠ Error: Enter your passport number.
```

not merely:

```text
red border
```

---

# 50. Plain Language

Use simple sentences.

Bad:

```text
Proceed to furnish the requisite particulars.
```

Good:

```text
Enter your details.
```

Bad:

```text
Upload supporting documentation.
```

Good:

```text
Upload your supporting document.
```

Explain unfamiliar terms.

---

# 51. One Section at a Time

Do not create giant forms.

Preferred:

```text
STEP 3 OF 12

Passport details

Passport number
[________________]

Date of issue
[________________]

Date of expiry
[________________]

[ Save and continue ]
```

---

# 52. Help Mode

Persistent button:

```text
Need help?
```

Example:

```text
What is a passport number?

It is the number printed on the main information page of your passport.

Example:
A1234567
```

Help must not obscure the form.

---

# 53. Language Support

Initial languages:

```text
English
Hindi
```

Architecture must allow:

```text
Kannada
Tamil
Telugu
Malayalam
Bengali
Marathi
Gujarati
Punjabi
```

Do not hard-code UI text.

Use translation keys:

```text
visa.application.passport.title
visa.application.passport.number
visa.application.continue
```

Changing language must not lose form data.

---

# 54. User Data Must Not Be Translated

If a user enters:

```text
José María García
```

store exactly that.

Never automatically translate or transliterate identity information.

---

# 55. Accessible Forms

Every input requires a visible semantic label.

Use:

```html
<label for="passport-number">
  Passport number
</label>
<input
  id="passport-number"
  name="passport_number"
  required
  aria-required="true"
/>
```

Never use placeholder text as the only label.

---

# 56. Required Fields

Display:

```text
Passport number
Required
```

and use appropriate HTML semantics:

```text
required
aria-required="true"
```

Do not rely only on an asterisk.

---

# 57. Validation

Validate progressively.

Do not wait until final submission to show every error.

Errors should:

* Explain what is wrong.
* Explain how to fix it.
* Preserve existing input.
* Be associated with the relevant field.

Example:

```text
⚠ Please enter your passport number.
```

---

# 58. Error Summary

For multiple errors:

```text
Please fix these 2 problems:

1. Enter your date of birth.
2. Enter a valid passport number.
```

Provide links to the relevant fields.

Move focus to the first invalid field when appropriate.

---

# 59. Keyboard Support

Everything must work with:

```text
TAB
SHIFT + TAB
ENTER
SPACE
ARROW KEYS
ESCAPE where appropriate
```

Requirements:

```text
Logical focus order
Visible focus
No keyboard traps
All controls keyboard accessible
```

---

# 60. Screen Reader Support

Use semantic:

```html
<header>
<nav>
<main>
<section>
<form>
<fieldset>
<legend>
<label>
<button>
```

Avoid generic div-based controls.

Every meaningful image needs appropriate alternative text.

Decorative images should be ignored.

---

# 61. Focus Management

When moving between wizard steps:

```text
Step 2 → Step 3
```

move focus to:

```text
Step 3 of 12
Passport details
```

Screen readers must immediately understand that the content changed.

---

# 62. Live Status Messages

Use appropriate ARIA live regions for:

```text
Saving...
Application saved.
Connection lost.
Connection restored.
Document uploaded.
Payment completed.
```

---

# 63. Reduce Motion

Respect:

```text
prefers-reduced-motion
```

When enabled:

* Remove animations.
* Remove decorative transitions.
* Avoid moving content.
* Avoid parallax.
* Use immediate state changes.

---

# 64. No Hover-Only Information

Everything must work via:

```text
Mouse
Keyboard
Touch
Screen reader
Voice input
AI agent
```

---

# 65. No Unnecessary Popups

Avoid modal dialogs.

When confirmation is necessary, use clear text:

```text
Submit application?

After submission, you will not be able to edit this application.

[ Go back ]
[ Submit application ]
```

---

# 66. Voice Input

Use standard HTML inputs.

Do not replace normal inputs with canvas/custom controls.

This allows operating system and browser voice input to work naturally.

---

# 67. Read Aloud

Optional feature:

```text
🔊 Read this page aloud
```

Use browser/device speech capabilities where available.

The application must remain usable without it.

---

# 68. No Auto-Playing Media

Never automatically play:

* Video
* Audio
* Sound effects

---

# 69. No Unexpected Timeouts

Do not expire an application while the user is actively filling it.

If a session expires:

```text
Your online session has expired.

Your draft is safe.

[ Continue application ]
```

Never erase the draft.

---

# 70. Responsive Mobile Design

Primary target:

```text
Android phone
```

Support:

```text
320px+
```

width.

The application must work without horizontal scrolling.

---

# 71. Low-End Device Support

Avoid unnecessary:

* Animations
* Large images
* Web fonts
* Third-party scripts
* Large bundles
* Complex visual effects

Prefer system fonts.

---

# 72. Progressive Enhancement

The application should be fundamentally usable through standard HTML.

Architecture:

```text
Semantic HTML
      +
CSS
      +
JavaScript enhancement
      +
Offline support
      +
Agent metadata
```

Do not make every piece of content dependent on JavaScript.

---

# 73. Performance Budget

The application should prioritize fast first content.

Avoid loading:

```text
analytics
large UI libraries
maps
videos
chat widgets
external fonts
```

unless genuinely necessary.

---

# 74. Accessibility Settings

Provide:

```text
Accessibility
```

with:

```text
Text size
○ Normal
○ Large
○ Extra Large

Contrast
○ Standard
○ High Contrast

Motion
○ Standard
○ Reduce Motion

Language
English
Hindi

Read aloud
On / Off

Data Saver
On / Off
```

Persist preferences locally.

---

# 75. Accessibility Demo

Create an explicit elderly-user scenario:

```text
72-year-old user
Low vision
Android phone
Slow connection
Limited computer experience
```

The complete flow must be possible:

```text
Open portal
↓
Increase text size
↓
Choose language
↓
Start application
↓
Understand each question
↓
Auto-save
↓
Lose connection
↓
Continue filling
↓
Reconnect
↓
Synchronize
↓
Review
↓
Confirm
↓
Submit
```

---

# 76. Low-Connectivity Demo

Judges should be able to simulate:

```text
Fast
4G
3G
Slow 3G
Offline
```

Offline experience:

```text
OFFLINE

Your application is still available.

✓ Draft saved locally.

You can continue filling the form.
```

---

# 77. Security & Privacy

Because this is a prototype:

```text
NO REAL PAYMENTS
NO REAL VISA SUBMISSIONS
NO GOVERNMENT API CALLS
NO REAL PASSPORT STORAGE
NO REAL CARD DATA
NO GOVERNMENT AUTHENTICATION
```

Demo documents should be synthetic.

---

# 78. Agent Safety

Agents may:

* Navigate
* Read fields
* Fill fields
* Validate fields
* Upload user-provided demo files
* Save drafts
* Review data

Agents must not:

* Invent information
* Invent documents
* Submit without confirmation
* Make irreversible decisions without user approval
* Process real payments
* Send information to government systems

---

# 79. Agent + Accessibility Architecture

The same semantic field should serve:

```text
Human
Screen reader
Voice input
Browser autofill
Automated test
AI agent
```

Example:

```json
{
  "id": "passport-number",
  "name": "passport_number",
  "label": "Passport number",
  "type": "text",
  "required": true,
  "description": "Enter the number printed on your passport.",
  "validation": {
    "minLength": 5,
    "maxLength": 20
  }
}
```

---

# 80. Demo Page

Route:

```text
/demo
```

Provide:

```text
Demo: Granted e-Visa
Demo: Application Under Review
Demo: Documents Required
Demo: Rejected Application
Demo: Regular Visa
Demo: Start New Application
```

Demo data must be fictional.

---

# 81. Persona Testing

The implementation should explicitly test three personas.

## Persona A — Elderly

```text
Large text
High contrast
Simple language
Touch
Language selection
Help mode
```

## Persona B — Low Connectivity

```text
Slow 3G
Offline
Local draft
Reconnect
Sync
Submit
```

## Persona C — AI Agent

```text
Discover /agent.md
↓
Understand application
↓
Read field schema
↓
Fill known fields
↓
Ask missing questions
↓
Navigate
↓
Review
↓
Request confirmation
↓
Submit
```

---

# 82. Acceptance Criteria — Core

The implementation is complete when a judge can:

## New e-Visa

```text
Home
→ e-Visa
→ Apply
→ Fill application
→ Upload demo documents
→ Simulate payment
→ Review
→ Confirm
→ Submit
→ Receive Application ID
```

## Resume

```text
Resume
→ Enter demo ID
→ Continue
→ Edit
→ Save
```

## Status

```text
Status
→ Application ID
→ Passport Number
→ View status
```

## Re-upload

```text
Re-upload
→ Application ID
→ Passport
→ Access Code
→ Upload
→ Save
```

## Print

```text
Print
→ Application ID
→ Preview
→ Download PDF
```

---

# 83. Acceptance Criteria — Accessibility

Required:

```text
✓ Large readable text
✓ High contrast
✓ No color-only information
✓ 200% zoom works
✓ Mobile responsive
✓ Keyboard navigation
✓ Visible focus
✓ Screen-reader labels
✓ Logical headings
✓ Accessible errors
✓ Large touch targets
✓ Plain language
✓ No unexpected timeouts
✓ User data preserved after errors
```

---

# 84. Acceptance Criteria — Connectivity

Required:

```text
✓ Local draft storage
✓ Offline editing
✓ Connection status
✓ Sync queue
✓ Automatic synchronization
✓ No data loss
✓ Data Saver
✓ Minimal initial payload
✓ Offline demo
```

---

# 85. Acceptance Criteria — Agent

Required:

```text
✓ /agent.md exists
✓ /llms.txt exists
✓ Stable URLs
✓ Stable field IDs
✓ Stable field names
✓ Semantic labels
✓ Agent action registry
✓ Field registry
✓ Workflow documentation
✓ Agent can discover application
✓ Agent can fill known information
✓ Agent can identify missing information
✓ Agent cannot accidentally submit without confirmation
```

---

# 86. Recommended Repository Structure

```text
bharat-visa-portal/
│
├── app/
│   ├── page
│   ├── visa/
│   ├── evisa/
│   ├── afghanistan/
│   ├── demo/
│   └── help/
│
├── components/
│   ├── application/
│   ├── accessibility/
│   ├── forms/
│   ├── documents/
│   ├── status/
│   └── navigation/
│
├── lib/
│   ├── application/
│   ├── validation/
│   ├── offline/
│   ├── sync/
│   ├── agent/
│   └── demo/
│
├── public/
│   └── demo-documents/
│
├── agent.md
├── llms.txt
├── site-map.md
│
├── agent/
│   ├── application.md
│   ├── workflows.md
│   ├── forms.md
│   ├── fields.md
│   ├── actions.md
│   ├── documents.md
│   ├── demo-data.md
│   └── faq.md
│
└── README.md
```

---

# 87. Suggested Technology

Use a lightweight modern stack.

Recommended:

```text
Next.js
TypeScript
React
Tailwind CSS
SQLite
Prisma
IndexedDB
Service Worker / PWA
Playwright
axe
```

Do not add technologies unless they provide clear value.

---

# 88. Implementation Order

Build in this order.

## P0

```text
1. Project structure
2. Global layout
3. Home page
4. Regular Visa landing
5. e-Visa landing
6. Application state model
7. Application wizard
8. Applicant fields
9. Passport fields
10. Travel fields
11. Documents
12. Review
13. Submission
14. Application ID
15. Status
16. Save/resume
17. Demo database
18. Semantic HTML
19. Agent metadata
20. /agent.md
21. /llms.txt
```

## P1

```text
22. Payment simulation
23. Re-upload
24. Print/download
25. Afghanistan Visa
26. Eligibility
27. FAQ
28. Visa categories
29. Accessibility settings
30. Offline mode
31. Sync
32. Data Saver
33. Demo network simulation
34. Hindi
35. Help mode
```

## P2

```text
36. Additional visa categories
37. Additional languages
38. Advanced conditional fields
39. More demo scenarios
40. PDF improvements
41. Agent API
42. MCP integration
```

---

# 89. Testing Matrix

Test:

```text
Browser:
Chrome
Safari
Firefox

Device:
Desktop
Android
iPhone

Input:
Mouse
Keyboard
Touch
Voice input

Accessibility:
Screen reader
200% zoom
High contrast
Reduced motion

Network:
Fast
3G
Slow 3G
Offline

User:
Normal
Elderly
Low vision
Low digital literacy
AI agent
```

---

# 90. Final Product Definition

The finished product should feel like:

> A modern, functional visa application service that a human can use normally, an elderly user can understand, a person on a poor connection can complete, and an AI agent can discover and operate through semantic HTML and explicit Markdown instructions.

The architecture should result in:

```text
Accessible
       +
Offline-capable
       +
Mobile-friendly
       +
Agent-readable
       +
Agent-operable
       +
Human-controlled
       =
Inclusive visa application platform
```

---

# 91. Codex Instructions

Implement this specification as the source of truth.

Do not ask for clarification unless a requirement is genuinely ambiguous.

Prioritize working end-to-end flows over visual perfection.

The application must be functional with fictional demo data.

Do not integrate real government systems.

Do not integrate real payment systems.

Do not collect unnecessary real personal information.

Implement semantic HTML from the beginning.

Implement accessibility from the beginning.

Implement offline draft storage from the beginning.

Implement agent metadata from the beginning.

Do not treat accessibility, offline support, or agent support as post-launch features.

The final local development experience should be:

```text
install dependencies
↓
start development server
↓
open portal
↓
run complete demo
```

The primary demonstration should be:

```text
Human user
     ↓
Accessible application
     ↓
Offline-capable workflow
     ↓
AI agent can understand the same application
     ↓
User remains in control
```

End of specification.

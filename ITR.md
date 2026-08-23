# ITR.md

# Income Tax India e-Filing Portal

## React Application Transformation Specification

**Document purpose:** This document is the single source of truth for transforming an existing React.js visa portal into an Income Tax India e-Filing Portal-style application.

**Source:** Income Tax Department, Ministry of Finance, Government of India

**Official e-Filing Portal:**
https://www.incometax.gov.in/

**Official e-Filing Services:**
https://eportal.incometax.gov.in/

**Sitemap source:**
https://www.incometax.gov.in/iec/foportal/using-the-portal/sitemap

**Last sitemap review:** 23 August 2026

---

# PART 1 — PROJECT TRANSFORMATION

## Objective

The existing project is a React.js visa portal.

Transform the entire application into a professional **Income Tax India e-Filing Portal-style application**.

This is a complete domain transformation.

The application must no longer appear to be a visa portal.

Replace:

* visa branding
* travel terminology
* passport terminology
* immigration terminology
* embassy terminology
* destination terminology
* visa application workflows
* travel dashboards
* visa forms
* visa mock data
* visa routes
* visa icons
* visa imagery
* visa-specific components

with an Income Tax / e-Filing domain.

---

# PART 2 — IMPORTANT IMPLEMENTATION RULES

## 1. Inspect Before Modifying

Before changing code:

* inspect the complete project
* inspect `package.json`
* inspect the source directory
* inspect routing
* inspect components
* inspect pages
* inspect services
* inspect state management
* inspect styling
* inspect assets
* inspect authentication
* inspect forms
* inspect mock data
* inspect API integrations

Understand the existing architecture before making changes.

Do not blindly rewrite the project.

Reuse technically useful infrastructure where appropriate.

---

## 2. This File Is the Source of Truth

Use this file to determine:

* information architecture
* navigation
* pages
* routes
* taxpayer categories
* services
* terminology
* visual direction
* content structure
* official external links
* application behavior
* transformation requirements

Do not invent a completely unrelated architecture.

---

## 3. Do Not Simply Rename the Visa Portal

A superficial replacement such as:

`Visa → Tax`

is NOT sufficient.

The transformation must affect:

```text
Brand
Information Architecture
Navigation
Routes
Pages
Components
Forms
Workflows
Dashboard
Mock Data
Terminology
Icons
Visual Design
Metadata
Content
```

The finished application should look and behave like a tax e-Filing portal.

---

# PART 3 — BRAND & VISUAL DESIGN

## Design Direction

Create a serious, trustworthy, institutional Indian government-style interface.

Design characteristics:

* professional
* clean
* accessible
* information-dense but readable
* finance-oriented
* government-oriented
* trustworthy
* responsive

Preferred visual language:

* white/light backgrounds
* deep blue/navy
* blue primary actions
* restrained saffron/orange accents
* subtle green accents
* neutral gray backgrounds
* clean borders
* restrained shadows
* professional typography

Avoid:

* neon colors
* excessive gradients
* gaming aesthetics
* excessive glassmorphism
* flashy startup-style UI
* excessive animations
* travel imagery
* visa imagery
* unnecessary decorative elements

---

# PART 4 — BRANDING

Use an Income Tax India / e-Filing themed identity.

Header identity should communicate:

**Income Tax Department**

**Government of India**

**e-Filing**

If the project is not actually operated by the Government of India, do not falsely represent it as the official government portal.

Use an appropriate designation such as:

> Income Tax e-Filing Portal — Demo

when necessary.

Do not fabricate government credentials or claims.

---

# PART 5 — MAIN INFORMATION ARCHITECTURE

The primary navigation should follow this structure.

```text
Home

Individual / HUF
├── Salaried Employees
├── Business / Profession
├── Senior / Super Senior Citizen
├── Non Resident
└── Hindu Undivided Family (HUF)

Company
├── Domestic Company
└── Foreign Company

Non-Company
├── AOP / BOI / Trust / AJP
├── Firm / LLP
└── Local Authority

Tax Professionals & Others
├── Chartered Accountants
├── e-Return Intermediaries
├── External Agency
└── Tax Deductor & Collector

Downloads

Help

About Us

Contact Us
```

---

# PART 6 — HOMEPAGE

The homepage must be redesigned as an Income Tax e-Filing homepage.

## Hero

Use a message similar in purpose to:

> Income Tax e-Filing Portal

> File your Income Tax Return, make tax payments, verify returns and access income-tax services online.

Primary actions:

* Login
* Register

Quick services:

* e-Verify Return
* Link Aadhaar
* Check Refund Status
* e-Pay Tax
* Verify PAN
* Know TAN Details

---

# PART 7 — QUICK SERVICES

Create a prominent quick-services section.

Services:

1. Login
2. Register
3. e-Verify Return
4. Link Aadhaar
5. Check Refund Status
6. e-Pay Tax
7. Verify PAN
8. Know TAN Details

Each service should have:

* icon
* title
* description
* action

Use the official URLs listed in this document for external services.

---

# PART 8 — TAXPAYER CATEGORIES

Create a taxpayer-category section.

## Individual / HUF

* Salaried Employees
* Business / Profession
* Senior / Super Senior Citizen
* Non Resident
* HUF

## Company

* Domestic Company
* Foreign Company

## Non-Company

* AOP / BOI / Trust / AJP
* Firm / LLP
* Local Authority

## Tax Professionals & Others

* Chartered Accountants
* e-Return Intermediaries
* External Agency
* Tax Deductor & Collector

---

# PART 9 — USER DASHBOARD

If the existing project has a logged-in dashboard, transform it into a tax dashboard.

Remove visa concepts.

Dashboard modules can include:

## Overview

* PAN
* Assessment Year
* Filing Status
* Outstanding Demand
* Refund Status
* Recent Activity

## Actions

* File Income Tax Return
* e-Verify Return
* Pay Tax
* Download ITR
* View Filed Returns
* Check Refund
* Submit Grievance

## Alerts

* Filing deadlines
* Pending actions
* Notices
* Payment reminders

Use fake/demo data unless a real backend exists.

Clearly distinguish demo data from actual government data.

---

# PART 10 — ITR FILING WORKFLOW

Create a multi-step Income Tax Return workflow if the original application contains a workflow/form system.

Suggested flow:

```text
Personal Information
        ↓
Income Details
        ↓
Deductions
        ↓
Tax Computation
        ↓
Taxes Paid
        ↓
Review
        ↓
Submit
        ↓
e-Verify
```

Possible income sources:

* Salary
* House Property
* Business / Profession
* Capital Gains
* Other Sources

Possible deduction sections:

* Chapter VI-A
* Other applicable deductions

Do not hard-code legal tax rules unless verified against current official material.

If the calculation is only a demo, label it as an estimate/demo.

---

# PART 11 — TAX CALCULATOR

If the existing application contains a calculator, transform it into:

**Income Tax Calculator**

Possible inputs:

* Assessment Year
* Taxpayer Type
* Age Category
* Gross Income
* Salary Income
* House Property Income
* Business / Profession Income
* Capital Gains
* Other Income
* Deductions
* Taxes Already Paid

Outputs:

* Total Income
* Taxable Income
* Estimated Tax
* Tax Already Paid
* Estimated Balance / Refund

Do not present unverified calculations as legally authoritative.

---

# PART 12 — DOWNLOADS

Create a Downloads area.

Categories:

* Income Tax Returns
* Income Tax Forms
* DSC Management Utility

Official destinations:

### Income Tax Returns

https://www.incometax.gov.in/iec/foportal/downloads/income-tax-returns

### Income Tax Forms

https://www.incometax.gov.in/iec/foportal/downloads/income-tax-forms

### DSC Management Utility

https://www.incometax.gov.in/iec/foportal/downloads/dsc-management-utility

---

# PART 13 — HELP CENTRE

Create a professional help centre.

Topics:

* Filing Returns
* Registration
* Login
* e-Verification
* PAN
* Aadhaar
* Refunds
* Tax Payments
* Forms
* Technical Help
* Grievances

Include:

* search
* FAQs
* topic navigation
* manuals
* videos

Official Help:

https://www.incometax.gov.in/iec/foportal/help

---

# PART 14 — CONTACT & GRIEVANCES

## Helpdesk

https://www.incometax.gov.in/iec/foportal/contact-us

## Submit Grievance

https://eportal.incometax.gov.in/iec/foservices/#/fo-greivance/submit

## View Grievance

https://eportal.incometax.gov.in/iec/foservices/#/fo-greivance/view

Do not invent phone numbers, email addresses, or government offices.

---

# PART 15 — ABOUT US

Include:

* About the Portal
* History of Direct Taxation
* Vision, Mission & Values
* Who We Are
* Right to Information
* Organization & Functions
* e-Filing Calendar
* Taxpayer Charter

Official links:

### About the Portal

https://www.incometax.gov.in/iec/foportal/about-portal

### History of Direct Taxation

https://www.incometaxindia.gov.in/history-of-direct-taxation

### Who We Are

https://www.incometaxindia.gov.in/who-we-are

### RTI

https://www.incometaxindia.gov.in/right-to-information

### Organization & Functions

https://www.incometaxindia.gov.in/cbdt

### e-Filing Calendar

https://eportal.incometax.gov.in/iec/foservices/#/TaxCalc/calender

---

# PART 16 — ROUTES

Use the existing routing system where possible.

Recommended routes:

```text
/
 /login
 /register
 /dashboard

 /individual
 /individual/salaried
 /individual/business-profession
 /individual/senior-citizen
 /individual/non-resident
 /individual/huf

 /company
 /company/domestic
 /company/foreign

 /non-company
 /non-company/aop-boi-trust-ajp
 /non-company/firm-llp
 /non-company/local-authority

 /tax-professionals
 /tax-professionals/chartered-accountants
 /tax-professionals/eri
 /tax-professionals/external-agency
 /tax-professionals/tax-deductor

 /returns
 /returns/file
 /returns/status

 /tax-payment
 /refund
 /pan
 /aadhaar
 /tan

 /downloads
 /help
 /contact
 /grievance
 /about
```

Adapt these to the project's existing routing architecture.

---

# PART 17 — TAXPAYER ROUTING

Use this mapping.

| User Type                        | Section                                      |
| -------------------------------- | -------------------------------------------- |
| Salaried person                  | Individual → Salaried Employees              |
| Business/professional individual | Individual → Business / Profession           |
| Senior citizen                   | Individual → Senior / Super Senior Citizen   |
| Non-resident individual          | Individual → Non Resident                    |
| HUF                              | Individual → HUF                             |
| Domestic company                 | Company → Domestic Company                   |
| Foreign company                  | Company → Foreign Company                    |
| Partnership firm                 | Non-Company → Firm / LLP                     |
| LLP                              | Non-Company → Firm / LLP                     |
| Trust                            | Non-Company → AOP / BOI / Trust / AJP        |
| AOP                              | Non-Company → AOP / BOI / Trust / AJP        |
| BOI                              | Non-Company → AOP / BOI / Trust / AJP        |
| AJP                              | Non-Company → AOP / BOI / Trust / AJP        |
| Local authority                  | Non-Company → Local Authority                |
| Chartered Accountant             | Tax Professionals → Chartered Accountants    |
| ERI                              | Tax Professionals → e-Return Intermediaries  |
| Tax deductor                     | Tax Professionals → Tax Deductor & Collector |

---

# PART 18 — TASK ROUTING

When a user asks:

### "How do I file my return?"

Use the relevant taxpayer's **Guidance to file Tax Return** page.

### "Which ITR form should I use?"

Use the relevant **Return / Forms applicable to me** page.

### "What are the tax slabs?"

Use the relevant **Tax Slabs** page.

### "What deductions can I claim?"

Use the relevant **Deductions** page.

### "I want to check my refund."

Use:

https://eportal.incometax.gov.in/iec/foservices/#/know-refund-status/user-information

### "I want to e-verify my return."

Use:

https://eportal.incometax.gov.in/iec/foservices/#/pre-login/eVerifyReturn-bl

### "I want to link Aadhaar."

Use:

https://eportal.incometax.gov.in/iec/foservices/#/pre-login/bl-link-aadhaar

### "I want to verify PAN."

Use:

https://eportal.incometax.gov.in/iec/foservices/#/pre-login/verifyYourPAN

### "I want to know my TAN."

Use:

https://eportal.incometax.gov.in/iec/foservices/#/pre-login/knowYourTAN

### "I want to pay tax."

Use:

https://eportal.incometax.gov.in/iec/foservices/#/e-pay-tax-prelogin/user-details

### "I want to register."

Use:

https://eportal.incometax.gov.in/iec/foservices/#/pre-login/register

### "I want to login."

Use:

https://eportal.incometax.gov.in/iec/foservices/#/login

---

# PART 19 — INDIVIDUAL / HUF INFORMATION

## Salaried Employees

Tax return guidance:

https://www.incometax.gov.in/iec/foportal/help/all-topics/tax-payer/individual/how-to-file-tax-returns

Returns/forms:

https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1#returnsandforms

Tax slabs:

https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1#taxslabs

Deductions:

https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1#taxdeductions

---

## Business / Profession

Guidance:

https://www.incometax.gov.in/iec/foportal/help/all-topics/tax-payer/individual/business-professional/how-to-file-tax-returns

Returns/forms:

https://www.incometax.gov.in/iec/foportal/help/individual-business-profession#returnsandforms

Tax slabs:

https://www.incometax.gov.in/iec/foportal/help/individual-business-profession#taxslabs

Deductions:

https://www.incometax.gov.in/iec/foportal/help/individual-business-profession#taxdeductions

---

## Senior / Super Senior Citizen

Guidance:

https://www.incometax.gov.in/iec/foportal/help/all-topics/tax-payer/individual/senior-and-super-senior-citizens/how-to-file-tax-returns

Returns/forms:

https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-2#returnsandforms

Tax slabs:

https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-2#taxslabs

Deductions:

https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-2#taxdeductions

---

## Non Resident

Guidance:

https://www.incometax.gov.in/iec/foportal/help/all-topics/tax-payer/individual/non-resident/how-to-file-tax-returns

Returns/forms:

https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-0#returnsandforms

Tax slabs:

https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-0#taxslabs

Deductions:

https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-0#taxdeductions

---

## HUF

Guidance:

https://www.incometax.gov.in/iec/foportal/help/huf/how-to-file-tax-returns

Returns/forms:

https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable#returnsandforms

Tax slabs:

https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable#taxslabs

Deductions:

https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable#taxdeductions

---

# PART 20 — COMPANY

## Domestic Company

Returns/forms:

https://www.incometax.gov.in/iec/foportal/help/company/return-applicable#returnsandforms

Tax slabs:

https://www.incometax.gov.in/iec/foportal/help/company/return-applicable#taxslabs

Deductions:

https://www.incometax.gov.in/iec/foportal/help/company/return-applicable#taxdeductions

---

## Foreign Company

Returns/forms:

https://www.incometax.gov.in/iec/foportal/help/company/return-applicable-0#returnsandforms

Tax slabs:

https://www.incometax.gov.in/iec/foportal/help/company/return-applicable-0#taxslabs

Deductions:

https://www.incometax.gov.in/iec/foportal/help/company/return-applicable-0#taxdeductions

---

# PART 21 — NON-COMPANY

## AOP / BOI / Trust / AJP

Returns/forms:

https://www.incometax.gov.in/iec/foportal/help/non-company/return-applicable-0#returnsandforms

Tax slabs:

https://www.incometax.gov.in/iec/foportal/help/non-company/return-applicable-0#taxslabs

Deductions:

https://www.incometax.gov.in/iec/foportal/help/non-company/return-applicable-0#taxdeductions

---

## Firm / LLP

Guidance:

https://www.incometax.gov.in/iec/foportal/help/firm-llp/how-to-file-tax-returns

Returns/forms:

https://www.incometax.gov.in/iec/foportal/help/partnership-firm-llp#returnsandforms

Tax slabs:

https://www.incometax.gov.in/iec/foportal/help/partnership-firm-llp#taxslabs

Deductions:

https://www.incometax.gov.in/iec/foportal/help/partnership-firm-llp#taxdeductions

---

## Local Authority

Returns/forms:

https://www.incometax.gov.in/iec/foportal/help/non-company/return-applicable#returnsandforms

Tax slabs:

https://www.incometax.gov.in/iec/foportal/help/non-company/return-applicable#taxslabs

Deductions:

https://www.incometax.gov.in/iec/foportal/help/non-company/return-applicable#taxdeductions

---

# PART 22 — TAX PROFESSIONALS

## Chartered Accountants

Registration:

https://www.incometax.gov.in/iec/foportal/help/ca/registration

Services:

https://www.incometax.gov.in/iec/foportal/help/ca/servicesavailable

## e-Return Intermediaries

API specifications:

https://www.incometax.gov.in/iec/foportal/api-specifications

ERI list:

https://eportal.incometax.gov.in/iec/foservices/#/eriList

## External Agencies

https://www.incometax.gov.in/iec/foportal/central-state-government-approved-undertaking-agency

RBI approved banks:

https://www.incometax.gov.in/iec/foportal/rbi-approved-banks

## Tax Deductors & Collectors

Registration:

https://www.incometax.gov.in/iec/foportal/help/taxdeductor/registration

Services:

https://www.incometax.gov.in/iec/foportal/help/taxdeductor/servicesavailable

---

# PART 23 — PORTAL SERVICES

## Login

https://eportal.incometax.gov.in/iec/foservices/#/login

## Registration

https://eportal.incometax.gov.in/iec/foservices/#/pre-login/register

## e-Verify Return

https://eportal.incometax.gov.in/iec/foservices/#/pre-login/eVerifyReturn-bl

## Link Aadhaar

https://eportal.incometax.gov.in/iec/foservices/#/pre-login/bl-link-aadhaar

## Refund Status

https://eportal.incometax.gov.in/iec/foservices/#/know-refund-status/user-information

## e-Pay Tax

https://eportal.incometax.gov.in/iec/foservices/#/e-pay-tax-prelogin/user-details

## Verify PAN

https://eportal.incometax.gov.in/iec/foservices/#/pre-login/verifyYourPAN

## Know TAN

https://eportal.incometax.gov.in/iec/foservices/#/pre-login/knowYourTAN

---

# PART 24 — USING THE PORTAL

Website Policies:

https://www.incometax.gov.in/iec/foportal/using-the-portal/webSitePolicies

Accessibility:

https://www.incometax.gov.in/iec/foportal/using-the-portal/accessibility-statement

Browser Support:

https://www.incometax.gov.in/iec/foportal/using-the-portal/browser-support

Sitemap:

https://www.incometax.gov.in/iec/foportal/using-the-portal/sitemap

---

# PART 25 — RELATED SITES

Income Tax India:

https://www.incometaxindia.gov.in/

Protean:

https://www.protean-tinpan.com/

TRACES:

https://traces.tdscpc.gov.in/

---

# PART 26 — FOOTER

Create a structured footer containing:

## About

* About Portal
* History
* Vision, Mission & Values
* Who We Are
* RTI
* Organization & Functions

## Services

* Login
* Register
* e-Verify
* Link Aadhaar
* Refund Status
* e-Pay Tax
* PAN
* TAN

## Resources

* Income Tax Returns
* Income Tax Forms
* DSC Utility
* Help
* User Manuals

## Portal

* Website Policies
* Accessibility
* Browser Support
* Sitemap

## Support

* Helpdesk
* Submit Grievance
* View Grievance

---

# PART 27 — VISA PORTAL CLEANUP

Search the complete codebase for visa-specific content.

Look for terms including:

```text
visa
passport
embassy
immigration
traveller
travel
destination
consulate
tourist
student visa
work visa
visa application
visa status
travel date
country of travel
appointment
```

Remove or transform inappropriate occurrences.

Also check:

* page titles
* meta descriptions
* alt text
* placeholders
* button labels
* notifications
* mock data
* localStorage keys
* API names
* component names
* route names
* test fixtures
* seed data

---

# PART 28 — DATA MODEL

Replace visa entities with appropriate tax concepts.

Possible replacements:

```text
VisaApplication
    ↓
IncomeTaxReturn

Applicant
    ↓
Taxpayer

VisaStatus
    ↓
FilingStatus

TravelDate
    ↓
AssessmentYear / FilingDate

VisaDocument
    ↓
TaxDocument

VisaPayment
    ↓
TaxPayment

VisaAppointment
    ↓
Tax Filing / Verification Action
```

Only implement entities actually required.

---

# PART 29 — SECURITY

This is a tax-related application.

Never use real taxpayer information for demo functionality.

Do not request or expose:

* real PAN
* real Aadhaar
* real bank accounts
* passwords
* OTPs
* tax documents
* government credentials

Use fake/demo data.

Do not claim that demo submissions are actually filed with the Income Tax Department.

---

# PART 30 — ACCESSIBILITY

Implement:

* semantic HTML
* keyboard navigation
* visible focus states
* accessible labels
* appropriate ARIA
* sufficient contrast
* responsive typography
* accessible forms
* accessible navigation
* accessible dialogs
* meaningful validation errors

---

# PART 31 — RESPONSIVE DESIGN

The application must work on:

* desktop
* laptop
* tablet
* mobile

Responsive behavior must be intentionally designed for:

* navbar
* menus
* cards
* tables
* forms
* dashboard
* filing workflow
* footer

---

# PART 32 — SEO

Remove visa-related metadata.

Use appropriate metadata.

Suggested title:

> Income Tax e-Filing Portal

Suggested description:

> Income Tax e-Filing portal interface for income tax returns, payments, refunds, PAN services, forms and taxpayer support.

---

# PART 33 — CODE QUALITY

Prefer:

* reusable components
* reusable layouts
* reusable forms
* centralized constants
* reusable cards
* reusable tables
* clean routing
* maintainable state management
* minimal duplication

Do not create one enormous component containing the entire application.

Reuse existing libraries when appropriate.

Do not add unnecessary dependencies.

---

# PART 34 — BUILD & VALIDATION

Before considering the work complete, run the project's available validation commands.

At minimum:

```bash
npm install
npm run build
```

If available:

```bash
npm run lint
npm run test
```

Fix:

* build errors
* TypeScript errors
* lint errors
* broken imports
* broken routes
* missing assets
* console errors

---

# PART 35 — ACCEPTANCE CRITERIA

The transformation is complete only when:

* [ ] Visa branding is gone.
* [ ] Visa terminology is gone.
* [ ] Visa routes are replaced.
* [ ] Tax-oriented navigation exists.
* [ ] Homepage is tax-oriented.
* [ ] Individual/HUF section exists.
* [ ] Company section exists.
* [ ] Non-Company section exists.
* [ ] Tax Professionals section exists.
* [ ] Downloads exists.
* [ ] Help exists.
* [ ] Contact exists.
* [ ] Grievance exists.
* [ ] About section exists.
* [ ] Tax dashboard exists where appropriate.
* [ ] ITR filing workflow exists where appropriate.
* [ ] Tax calculator exists where appropriate.
* [ ] Official URLs are correctly referenced.
* [ ] Mobile layout works.
* [ ] Accessibility has been considered.
* [ ] Demo data is clearly fake/demo data.
* [ ] No real government submission is falsely claimed.
* [ ] Build succeeds.
* [ ] Major routes work.
* [ ] No obvious console errors remain.
* [ ] The application feels like an Income Tax e-Filing portal rather than a visa application.

---

# PART 36 — IMPLEMENTATION PRIORITY

When making implementation decisions, follow this priority:

```text
1. Existing project architecture
2. This ITR.md specification
3. Official URLs provided here
4. Reusable existing components
5. Visual consistency
6. Accessibility
7. Responsive behavior
8. Code cleanliness
```

Do not sacrifice application functionality merely to reproduce a visual design.

---

# PART 37 — FINAL INSTRUCTION TO THE CODING AGENT

Read this entire `ITR.md` file before modifying the project.

Then:

1. Inspect the existing React application.
2. Identify its architecture.
3. Identify reusable infrastructure.
4. Identify visa-specific functionality.
5. Plan the migration.
6. Transform the application into the Income Tax e-Filing domain.
7. Implement the new navigation and pages.
8. Implement the new visual system.
9. Replace visa data/models/content.
10. Connect official navigation URLs where specified.
11. Make the application responsive and accessible.
12. Build the project.
13. Fix all errors.
14. Verify the major routes.
15. Do not stop at the homepage.

The final result must be a coherent, polished **Income Tax India e-Filing Portal-style React application**.

Do not merely rename the existing visa application.

Perform a complete domain-level transformation.

# PART 40 — MAJOR APPLICATION WORKFLOWS

This section defines the major workflows that the React application should implement.

These workflows are based on the Income Tax Department's current e-Filing portal structure and official user manuals.

The application is a **demo/interface implementation** unless a real backend integration exists.

Do not claim that a demo action actually submits information to the Government of India.

---

# WORKFLOW 1 — HOME / PRE-LOGIN SERVICE DISCOVERY

## Purpose

Allow an unregistered or logged-out user to discover and access common Income Tax services.

## Entry

```text
/
```

## Main Actions

Display:

* Login
* Register
* e-Verify Return
* Link Aadhaar
* e-Pay Tax
* Verify PAN
* Know TAN Details
* ITR Status
* Help
* Downloads

## Flow

```text
Home
  │
  ├── Login
  │
  ├── Register
  │
  ├── e-Verify Return
  │
  ├── Link Aadhaar
  │
  ├── e-Pay Tax
  │
  ├── Verify PAN
  │
  ├── Know TAN
  │
  ├── ITR Status
  │
  └── Help
```

## UI Requirements

Use prominent Quick Links.

Services should be accessible without requiring login when the official service supports pre-login access.

---

# WORKFLOW 2 — USER REGISTRATION

## Purpose

Create a new e-Filing user account.

## Entry

```text
Home
→ Register
```

## Flow

```text
Select User Type
       ↓
Enter PAN / User Identification
       ↓
Validate Details
       ↓
Enter Contact Details
       ↓
Mobile / Email Verification
       ↓
Set Login Credentials
       ↓
Confirmation
       ↓
Registration Complete
       ↓
Login
```

## User Types

The UI should support appropriate taxpayer categories such as:

* Individual
* HUF
* Company
* Firm / LLP
* Trust / AOP / BOI
* Other applicable entities
* Tax Professional
* Tax Deductor / Collector

Do not expose options that are not supported by the application's demo backend.

## Validation

Show:

* required fields
* invalid PAN
* invalid email
* invalid mobile
* duplicate account
* OTP failure
* OTP expiry
* password validation
* successful registration

---

# WORKFLOW 3 — LOGIN

## Entry

```text
Home
→ Login
```

## Flow

```text
Enter User ID
       ↓
Enter Password
       ↓
Captcha / Security Step if applicable
       ↓
Authentication
       ↓
Dashboard
```

## Error States

Implement:

* invalid credentials
* account unavailable
* incorrect password
* session expired
* locked/restricted account
* service unavailable

## Additional Actions

Provide:

* Forgot Password
* Forgot User ID
* Register
* Help

---

# WORKFLOW 4 — DASHBOARD

## Purpose

Provide a logged-in taxpayer with a central control centre.

Official portal documentation describes dashboard navigation around areas including e-File, Authorized Partners, Services, AIS, Pending Actions, Grievances and Help.

## Layout

```text
Header
│
├── Dashboard
├── e-File
├── Authorized Partners
├── Services
├── AIS
├── Pending Actions
├── Grievances
└── Help
```

## Dashboard Cards

### Profile

* Name
* Masked PAN
* User Type
* Residential Status
* Aadhaar Link Status

### Return

* Current Assessment Year / Tax Year
* Filing Status
* Verification Status
* Last Filed Return

### Tax

* Tax Payable
* Tax Paid
* Outstanding Demand
* Refund Status

### Actions

* File Return
* Resume Filing
* e-Verify
* Pay Tax
* View Filed Returns
* Download ITR-V
* View Forms

### Alerts

* Pending verification
* Pending payment
* Pending action
* Important notices
* Filing reminders

---

# WORKFLOW 5 — FILE INCOME TAX RETURN

This is one of the primary workflows.

Official ITR manuals describe the process as selecting the assessment year, selecting online filing, selecting/resuming the applicable ITR, reviewing pre-filled information, entering income/deductions, reviewing tax computation, paying any liability, previewing, validating and verifying the return.

## Entry

```text
Dashboard
→ e-File
→ Income Tax Returns
→ File Income Tax Return
```

## Flow

```text
Select Assessment Year
        ↓
Select Filing Mode
        ↓
Select ITR
        ↓
Check Documents Required
        ↓
Review Pre-filled Information
        ↓
Personal / General Information
        ↓
Income
        ↓
Deductions
        ↓
Tax Details
        ↓
Tax Computation
        ↓
Payment if Required
        ↓
Preview Return
        ↓
Validation
        ↓
Verification
        ↓
Submit / e-Verify
        ↓
Acknowledgement
```

---

# WORKFLOW 6 — START NEW RETURN / RESUME RETURN

When entering the filing flow, provide:

```text
Start New Filing
Resume Filing
```

## Resume Filing

Display:

* Assessment Year
* ITR
* Last saved date
* Completion percentage
* Last completed section

Example:

```text
ITR-1
AY 2026-27

Progress: 64%

Last completed:
Income Details

[Resume Filing]
[Discard Draft]
```

## Discard Draft

Require confirmation:

> Are you sure you want to discard this saved return?

Actions:

* Cancel
* Discard

---

# WORKFLOW 7 — SELECT ASSESSMENT YEAR / TAX YEAR

## Flow

```text
Filing
  ↓
Select Assessment Year / Tax Year
  ↓
Select Filing Mode
  ↓
Continue
```

Show:

* year
* filing period
* applicable return options

Do not hard-code legal applicability rules without verifying current official information.

---

# WORKFLOW 8 — SELECT ITR FORM

## Flow

```text
Taxpayer Type
      ↓
Income Profile
      ↓
Eligible ITR Forms
      ↓
Select ITR
      ↓
Continue
```

Possible demo forms:

* ITR-1
* ITR-2
* ITR-3
* ITR-4
* ITR-5
* ITR-6
* ITR-7

The UI should not claim that a particular user is legally eligible for a form unless the eligibility rules are implemented and verified.

---

# WORKFLOW 9 — PRE-FILLED DATA REVIEW

The official filing flow uses pre-filled taxpayer information that the user reviews and can edit where applicable.

## Flow

```text
Pre-filled Data
      ↓
Review
      ↓
Edit if Required
      ↓
Confirm Section
```

## Sections

Possible sections:

* Personal Information
* Contact Information
* Bank Details
* Employer Information
* PAN
* Aadhaar Status
* Residential Status

## UI

Each section should support:

```text
✓ Verified
⚠ Needs Review
✎ Edit
```

---

# WORKFLOW 10 — INCOME DETAILS

## Purpose

Collect income information.

## Main Categories

```text
Salary
House Property
Business / Profession
Capital Gains
Other Sources
```

## Flow

```text
Select Income Source
       ↓
Enter Details
       ↓
Calculate Subtotal
       ↓
Save
       ↓
Next Income Source
```

## Example

```text
Salary Income

Gross Salary
Exempt Allowances
Professional Tax
Standard Deduction
TDS

[Save & Continue]
```

---

# WORKFLOW 11 — DEDUCTIONS

## Purpose

Collect applicable deductions.

## Flow

```text
Deductions
    ↓
Select Category
    ↓
Enter Amount
    ↓
Validate Limit
    ↓
Save
    ↓
Continue
```

Possible categories:

* Chapter VI-A
* Other applicable deductions

Do not implement tax-law limits as static assumptions unless verified.

---

# WORKFLOW 12 — TAX COMPUTATION

## Purpose

Display a transparent summary of the return calculation.

## Flow

```text
Income
  ↓
Gross Total Income
  ↓
Deductions
  ↓
Total / Taxable Income
  ↓
Tax Calculation
  ↓
Tax Credits
  ↓
Tax Already Paid
  ↓
Final Result
```

## Possible Results

### Tax Payable

```text
Tax Liability
₹XX,XXX

[Pay Now]
[Pay Later]
```

### No Demand / No Refund

```text
No additional tax payable.

[Preview Return]
```

### Refund

```text
Estimated Refund
₹XX,XXX

[Preview Return]
```

Official filing manuals describe these three branches after tax computation.

---

# WORKFLOW 13 — PAY TAX DURING ITR FILING

If tax is payable:

```text
Tax Computation
      ↓
Tax Payable
      ↓
Pay Now / Pay Later
```

## Pay Now

```text
Pay Now
  ↓
e-Pay Tax
  ↓
Create / Complete Payment
  ↓
Payment Success
  ↓
Return to ITR Filing
  ↓
Continue Filing
```

The official filing workflow redirects users to e-Pay Tax and returns them to the filing flow after successful payment.

---

# WORKFLOW 14 — PREVIEW RETURN

## Flow

```text
Completed Return
      ↓
Preview
      ↓
Show Complete Return Summary
      ↓
User Review
      ↓
Declaration
      ↓
Proceed to Validation
```

## Preview Should Show

* taxpayer details
* income summary
* deductions
* tax computation
* taxes paid
* refund / payable amount
* bank information
* declarations

Allow:

```text
[Edit Return]
[Proceed to Validation]
```

---

# WORKFLOW 15 — RETURN VALIDATION

## Flow

```text
Preview
  ↓
Internal Validation
  ↓
Errors?
 ├── Yes → Show Errors → Edit Return
 └── No
       ↓
Upload-Level / Final Validation
       ↓
Proceed to Verification
```

Official ITR workflows include validation stages and require correction if validation errors are found.

## Error UI

Display:

```text
Validation Errors (3)

⚠ Schedule Salary:
   Required field missing.

⚠ Bank Details:
   Account number needs verification.

⚠ Tax Paid:
   TDS amount does not match available data.

[Go to Error]
```

---

# WORKFLOW 16 — E-VERIFY RETURN

e-Verification is a mandatory stage for completing the return process, with e-Verify Now being the recommended route in the official manuals.

## Entry

```text
Return
→ Verification
```

## Options

Possible verification methods include:

* Aadhaar OTP
* DSC
* EVC through Bank Account
* EVC through Demat Account
* Net Banking
* Other currently supported official methods

The official e-Verify manual lists these verification routes.

## Flow

```text
Select Verification Method
        ↓
Authenticate
        ↓
OTP / DSC / EVC / Bank Authentication
        ↓
Verify
        ↓
Success
        ↓
Acknowledgement
```

## Success Screen

Display:

```text
Return Successfully Verified

Acknowledgement Number
XXXXXXXXXXXX

Transaction ID
XXXXXXXXXXXX

Assessment Year
2026-27

[Download Acknowledgement]
[Go to Dashboard]
```

---

# WORKFLOW 17 — E-VERIFY LATER

If the user chooses:

```text
e-Verify Later
```

show:

```text
Return Submitted

Verification Required

Your return has been submitted but must be verified within the applicable verification period.

[Verify Now]
[Go to Dashboard]
```

The official manuals currently state a 30-day verification period for the described filing flows.

For production tax software, verify the applicable current rule before displaying a legal deadline.

---

# WORKFLOW 18 — PRE-LOGIN ITR STATUS

The official ITR Status service can be accessed pre-login using an acknowledgement number and mobile OTP.

## Flow

```text
Home
→ ITR Status
→ Enter Acknowledgement Number
→ Enter Mobile Number
→ Send OTP
→ Enter OTP
→ View Status
```

## OTP

Implement:

* 6-digit OTP
* countdown
* resend
* expiry
* invalid OTP
* attempt limit

The official manual specifies a 15-minute OTP validity and three attempts.

## Result

Display:

* Assessment Year
* ITR Type
* Filing Date
* Verification Status
* Processing Status
* Refund Status
* Latest Action

---

# WORKFLOW 19 — VIEW FILED RETURNS

## Entry

```text
Dashboard
→ e-File
→ Income Tax Returns
→ View Filed Returns
```

## Flow

```text
Filed Returns
      ↓
Filter by Year
      ↓
Select Return
      ↓
Return Details
```

## Return Details

Display:

* Assessment Year
* ITR Form
* Filing Date
* Acknowledgement Number
* Verification Status
* Processing Status
* Refund
* Tax Paid

## Downloads

Allow demo links/buttons for:

* ITR-V Acknowledgement
* Filed ITR PDF
* Uploaded JSON
* Intimation Order

The official ITR Status documentation identifies these downloadable records.

---

# WORKFLOW 20 — E-PAY TAX

The official e-Pay Tax system uses a **Challan Reference Number (CRN)** as part of the payment flow. A challan is created before payment and the user then selects a payment mode.

## Entry

```text
Home
→ e-Pay Tax
```

or:

```text
Dashboard
→ e-File
→ e-Pay Tax
```

## Flow

```text
Select Income Tax Act
        ↓
Select Payment Category
        ↓
Enter Tax Details
        ↓
Enter Tax Amount / Breakup
        ↓
Select Payment Mode
        ↓
Review
        ↓
Generate Challan / CRN
        ↓
Pay
        ↓
Payment Result
        ↓
Receipt
```

---

# WORKFLOW 21 — E-PAY TAX: PRE-LOGIN

## Flow

```text
e-Pay Tax
   ↓
PAN / TAN
   ↓
Mobile Number
   ↓
OTP
   ↓
Select Applicable Act
   ↓
Select Payment Category
   ↓
Tax Details
   ↓
Payment Mode
   ↓
Preview
   ↓
Payment
```

The official documentation supports pre-login e-Pay Tax access.

---

# WORKFLOW 22 — CREATE CHALLAN / CRN

## Flow

```text
New Payment
      ↓
Select Applicable Act
      ↓
Select Payment Tile
      ↓
Enter Applicable Details
      ↓
Enter Tax Breakup
      ↓
Select Payment Mode
      ↓
Preview
      ↓
Generate CRN
      ↓
Pay
```

## CRN Screen

Display:

```text
Challan Reference Number
CRN-XXXXXXXXXXXX

Amount
₹XX,XXX

Valid Till
DD/MM/YYYY

Payment Mode
Payment Gateway

[Proceed to Payment]
```

The official portal states that every generated challan has a unique CRN and that the payment mode is selected during challan creation.

---

# WORKFLOW 23 — TAX PAYMENT METHODS

The interface should support the following as selectable demo payment methods where appropriate:

* Net Banking
* Debit Card
* Payment Gateway
* UPI
* RTGS / NEFT
* Pay at Bank Counter

The official e-Pay Tax documentation currently lists these payment routes, subject to eligibility and bank availability.

For the demo application:

```text
Payment Method
    ↓
Payment Confirmation
    ↓
Success / Failure
```

Never collect real banking credentials.

---

# WORKFLOW 24 — PAYMENT SUCCESS

## Success

```text
Payment Successful

CRN
XXXXXXXX

Amount
₹XX,XXX

Transaction ID
XXXXXXXX

Date
DD/MM/YYYY
```

Actions:

* Download Challan Receipt
* View Payment History
* Return to Filing
* Go to Dashboard

The official portal makes payment history and challan receipts available after successful payment.

---

# WORKFLOW 25 — PAYMENT FAILURE

Display:

```text
Payment Failed

Your payment could not be completed.

Possible reasons:
- Bank declined transaction
- Payment gateway error
- Session expired
- Transaction timed out

[Retry]
[Choose Another Method]
[View Challan]
```

Do not mark a payment as successful unless the backend confirms it.

---

# WORKFLOW 26 — PAYMENT HISTORY

## Entry

```text
Dashboard
→ e-Pay Tax
→ Payment History
```

## Display

Table:

| Date       | CRN    | Type            |  Amount | Mode | Status  |
| ---------- | ------ | --------------- | ------: | ---- | ------- |
| DD/MM/YYYY | CRN... | Self Assessment | ₹XX,XXX | UPI  | Success |

Actions:

* View Details
* Download Receipt

---

# WORKFLOW 27 — LINK PAN WITH AADHAAR

The official service supports both pre-login and post-login linking. The current manual describes validation, fee payment where applicable, submission, OTP verification and status checking.

## Main Flow

```text
Link Aadhaar
      ↓
Enter PAN
      ↓
Enter Aadhaar
      ↓
Validate
      ↓
Already Linked?
 ├── Yes → Show Status
 └── No
       ↓
Payment Required?
 ├── Yes → e-Pay Tax
 │           ↓
 │        Payment
 │           ↓
 │        Return to Link Aadhaar
 │
 └── No
       ↓
Enter Required Details
       ↓
OTP
       ↓
Submit
       ↓
Link Request Submitted
       ↓
Check Status
```

---

# WORKFLOW 28 — LINK AADHAAR STATUS

## Pre-login

```text
Link Aadhaar
→ View Status
→ PAN
→ Aadhaar
→ Validate
→ Status
```

## Possible Results

```text
Successfully Linked
```

```text
Linking In Progress
```

```text
Linking Failed
```

```text
PAN Already Linked With Another Aadhaar
```

The official manual explicitly provides status handling for successful, pending and failed linking scenarios.

---

# WORKFLOW 29 — VERIFY PAN

## Entry

```text
Home
→ Verify Your PAN
```

## Flow

```text
PAN
  ↓
Name / Date of Birth / Required Details
  ↓
Captcha / Validation
  ↓
Submit
  ↓
PAN Status
```

## Result

Show:

* PAN status
* masked name where appropriate
* validity
* relevant status information

Never use real PAN data in the demo.

---

# WORKFLOW 30 — KNOW TAN DETAILS

## Entry

```text
Home
→ Know TAN Details
```

## Flow

```text
TAN Search
    ↓
Enter TAN / Search Criteria
    ↓
Validate
    ↓
Search
    ↓
TAN Details
```

Display appropriate demo information.

---

# WORKFLOW 31 — MY BANK ACCOUNT

The official My Bank Account service allows registered users to add/pre-validate accounts, remove accounts, nominate an account for refund, enable/disable EVC where supported, and revalidate failed accounts.

## Entry

```text
Dashboard
→ Profile
→ My Bank Account
```

## Main Tabs

```text
Added Accounts
Failed Accounts
Removed Accounts
```

## Actions

```text
Add Bank Account
Pre-Validate
Nominate for Refund
Remove Nomination
Enable EVC
Disable EVC
Revalidate
Remove Account
```

---

# WORKFLOW 32 — ADD / PRE-VALIDATE BANK ACCOUNT

## Flow

```text
Add Bank Account
      ↓
Bank Account Number
      ↓
Confirm Account Number
      ↓
IFSC
      ↓
Account Type
      ↓
Validate
      ↓
Verification
      ↓
Validation in Progress
      ↓
Validated / Failed
```

The official service requires appropriate bank/PAN association and verification methods depending on the account/user.

---

# WORKFLOW 33 — NOMINATE BANK ACCOUNT FOR REFUND

## Flow

```text
My Bank Account
      ↓
Select Validated Account
      ↓
Nominate for Refund
      ↓
Confirm
      ↓
Success
```

Display:

```text
✓ This bank account is nominated to receive Income Tax refunds.
```

The official manual provides a nomination toggle and confirmation flow.

---

# WORKFLOW 34 — REMOVE REFUND NOMINATION

```text
Bank Account
      ↓
Nominate for Refund
      ↓
Toggle Off
      ↓
Confirm
      ↓
Success
```

---

# WORKFLOW 35 — EVC BANK ACCOUNT

Where supported:

```text
Bank Account
      ↓
Enable EVC
      ↓
Confirm
      ↓
Verification
      ↓
EVC Enabled
```

Also support:

```text
Disable EVC
```

The official My Bank Account service provides enable/disable EVC functionality for supported individual taxpayer accounts.

---

# WORKFLOW 36 — REFUND STATUS

## Entry

```text
Home
→ Check Refund Status
```

## Flow

```text
PAN / Required Identifier
      ↓
Assessment Year / Return Details
      ↓
Mobile Verification if applicable
      ↓
View Refund Status
```

## Status Examples

```text
Refund Not Due
Refund Determined
Refund Issued
Refund Failed
Refund Reissued
Refund Pending
```

Use official current status terminology when implementing real integration.

---

# WORKFLOW 37 — DOWNLOAD ITR / DOCUMENTS

## Entry

```text
Dashboard
→ Filed Returns
→ Select Return
```

## Documents

Allow:

```text
Download ITR-V
Download ITR PDF
Download JSON
Download Intimation Order
Download Challan
Download Receipt
```

Use demo files if there is no backend.

---

# WORKFLOW 38 — FILE INCOME TAX FORMS

The dashboard's e-File menu includes Income Tax Forms in addition to Income Tax Returns.

## Flow

```text
Dashboard
→ e-File
→ Income Tax Forms
→ File Income Tax Form
→ Select Form
→ Enter Details
→ Validate
→ Preview
→ Submit
→ Verify if Required
```

---

# WORKFLOW 39 — VIEW FILED FORMS

```text
Dashboard
→ e-File
→ Income Tax Forms
→ View Filed Forms
```

Display:

* Form Number
* Filing Date
* Status
* Acknowledgement
* Assessment / Tax Year
* Actions

Actions:

* View
* Download
* Track Status

---

# WORKFLOW 40 — PROFILE MANAGEMENT

## Entry

```text
Dashboard
→ My Profile
```

## Sections

```text
Personal Details
Contact Details
Bank Accounts
PAN / Aadhaar
Residential Status
Jurisdiction
Authorized Partners
Security
```

## Actions

* Edit Profile
* Update Contact Details
* Manage Bank Accounts
* Link Aadhaar
* View Jurisdiction
* Manage Authorized Partners

---

# WORKFLOW 41 — AUTHORIZED PARTNERS

The official dashboard includes an Authorized Partners area for relationships such as CA, ERI or TRP.

## Flow

```text
Dashboard
→ Authorized Partners
      ↓
Add Partner
      ↓
Select Partner Type
      ↓
Enter Partner Details
      ↓
Send Authorization
      ↓
Pending
      ↓
Accepted / Rejected
```

Possible partner types:

* Chartered Accountant
* ERI
* Tax Return Preparer

---

# WORKFLOW 42 — AUTHORIZE ANOTHER PERSON

The Income Tax Department provides a workflow for authorizing another person to act on behalf of the taxpayer in applicable situations.

## Flow

```text
Authorized Partners
      ↓
Authorize Another Person
      ↓
Enter Person Details
      ↓
Specify Authorization
      ↓
Submit
      ↓
Verification
      ↓
Authorization Active
```

---

# WORKFLOW 43 — AIS / TAX INFORMATION

The official dashboard navigation includes AIS.

## Flow

```text
Dashboard
→ AIS
      ↓
Select Tax Year
      ↓
View Information
      ↓
Select Transaction
      ↓
View Details
```

Possible demo sections:

* Salary information
* Interest
* Securities
* TDS
* Other reported information

If implemented as a demo, use synthetic data.

---

# WORKFLOW 44 — PENDING ACTIONS

The official dashboard includes Pending Actions / Worklist / e-Proceedings / Compliance.

## Flow

```text
Dashboard
→ Pending Actions
      ↓
Worklist
```

Categories:

* Pending Verification
* e-Proceedings
* Compliance
* Notices
* Other Actions

Each item should show:

```text
Action
Due Date
Priority
Status
```

Actions:

```text
[View]
[Respond]
[Complete]
```

---

# WORKFLOW 45 — GRIEVANCE

## Entry

```text
Dashboard
→ Grievances
→ Submit Grievance
```

## Flow

```text
Select Department / Category
      ↓
Select Subcategory
      ↓
Enter Subject
      ↓
Describe Issue
      ↓
Attach Document if Supported
      ↓
Review
      ↓
Submit
      ↓
Grievance Number
```

## Success

```text
Grievance Submitted

Grievance Number:
GRV-XXXXXXXX

[View Grievance]
```

---

# WORKFLOW 46 — VIEW GRIEVANCE

```text
Grievances
→ View Grievance
      ↓
Enter Grievance Number
      ↓
Search
      ↓
Grievance Details
```

Display:

* grievance number
* created date
* category
* status
* assigned department
* latest response
* timeline

Possible statuses:

```text
Submitted
Under Process
Awaiting Response
Resolved
Closed
```

---

# WORKFLOW 47 — SERVICE REQUEST

Create a reusable service-request pattern.

```text
Select Service
      ↓
Enter Request Details
      ↓
Attach Supporting Document
      ↓
Review
      ↓
Submit
      ↓
Request Number
      ↓
Track Status
```

Use this pattern for appropriate portal services.

---

# WORKFLOW 48 — HELP / KNOWLEDGE BASE

## Entry

```text
Help
```

## Flow

```text
Help Home
      ↓
Search
      ↓
Select Topic
      ↓
Article
      ↓
Related Articles
```

Categories:

* Registration
* Login
* Filing Returns
* e-Verification
* e-Pay Tax
* PAN
* Aadhaar
* Refund
* Bank Account
* Forms
* Grievances
* Technical Issues

---

# WORKFLOW 49 — DOWNLOADS

```text
Downloads
    ↓
Select Category
    ↓
Document List
    ↓
Document Details
    ↓
Download
```

Categories:

* Income Tax Returns
* Income Tax Forms
* DSC Management Utility
* Other official resources

---

# WORKFLOW 50 — NOTIFICATION CENTRE

Create a notification system for the dashboard.

## Types

```text
Information
Success
Warning
Action Required
Deadline
System
```

Example:

```text
⚠ Action Required

Your Income Tax Return is pending verification.

[Verify Now]
```

---

# WORKFLOW 51 — SESSION / SECURITY

Implement realistic demo session behavior.

## Flow

```text
Login
 ↓
Session Created
 ↓
Dashboard
 ↓
Inactivity
 ↓
Session Warning
 ↓
Continue Session / Logout
```

If session expires:

```text
Your session has expired.

[Login Again]
```

Never store real credentials in frontend storage.

---

# WORKFLOW 52 — GLOBAL SEARCH

The portal should support a global search.

## Search Targets

Search:

* services
* help articles
* forms
* taxpayer categories
* downloads
* portal pages

Example:

```text
Search: "refund"

Results:

Check Refund Status
Refund Help
Bank Account for Refund
Refund FAQs
```

---

# WORKFLOW 53 — ERROR HANDLING

Every major workflow must support:

### Loading

```text
Loading...
```

### Empty

```text
No records found.
```

### Validation Error

```text
Please correct the highlighted fields.
```

### Network Error

```text
Unable to connect to the service.
Please try again.
```

### Authentication Error

```text
Your session has expired.
```

### Success

```text
Your request was completed successfully.
```

---

# WORKFLOW 54 — GENERAL FORM PATTERN

All tax forms should follow a consistent structure.

```text
Page Header
      ↓
Progress Indicator
      ↓
Section Header
      ↓
Form Fields
      ↓
Validation
      ↓
Save
      ↓
Continue
```

Buttons:

```text
[Back]
[Save Draft]
[Save & Continue]
[Cancel]
```

Long forms should support draft persistence.

---

# WORKFLOW 55 — DRAFT / SAVE SYSTEM

Long-running workflows such as ITR filing should support saving progress.

## Flow

```text
Form
 ↓
Save Draft
 ↓
Draft Saved
 ↓
Leave Page
 ↓
Return Later
 ↓
Resume Filing
```

Show:

```text
Last saved:
23 Aug 2026, 7:42 PM
```

---

# WORKFLOW 56 — CONFIRMATION PATTERN

Destructive operations should require confirmation.

Examples:

* Delete draft
* Remove bank account
* Remove refund nomination
* Cancel filing
* Remove authorized partner

Pattern:

```text
Are you sure?

This action cannot be undone.

[Cancel]
[Confirm]
```

---

# WORKFLOW 57 — MOBILE WORKFLOW

All workflows must remain usable on mobile.

For long forms:

```text
Step 1 of 8

Personal Information

[Fields]

[Save & Continue]
```

Use:

* sticky bottom action bar where appropriate
* collapsible sections
* mobile-friendly tables
* accessible OTP input
* large touch targets

---

# PART 58 — WORKFLOW STATE MODEL

Use consistent states across workflows.

```text
idle
loading
draft
in_progress
validation_pending
validation_failed
payment_pending
payment_success
payment_failed
verification_pending
verification_success
verification_failed
submitted
processing
completed
rejected
expired
cancelled
```

Not every workflow needs every state.

---

# PART 59 — WORKFLOW COMPONENTS

Build reusable React components for common workflow patterns.

Recommended components:

```text
AppHeader
GovernmentHeader
MainNavigation
QuickLinks
ServiceCard
TaxpayerCategoryCard

PageHeader
Breadcrumbs
StepIndicator
WorkflowLayout

FormSection
FormField
CurrencyInput
PanInput
AadhaarInput
OtpInput
IfscInput

ValidationSummary
InlineError
SuccessMessage
WarningMessage

ReviewPanel
ConfirmationDialog
SaveDraftButton

StatusBadge
Timeline
NotificationPanel

DataTable
FilterBar
SearchBar

PaymentSummary
PaymentMethodSelector
ChallanCard
ReceiptCard

DocumentCard
DownloadButton

DashboardCard
PendingActionCard
```

Reuse these components across workflows.

---

# PART 60 — WORKFLOW NAVIGATION RULE

Users should always know:

1. Where they are.
2. What they have completed.
3. What remains.
4. What happens next.
5. Whether their information has been saved.
6. Whether an action succeeded.
7. Whether an action requires attention.

Use:

* breadcrumbs
* step indicators
* status badges
* progress indicators
* clear primary actions
* confirmation screens

---

# PART 61 — MAJOR WORKFLOW PRIORITY

If development time is limited, implement workflows in this order:

## Priority 1 — Core

```text
1. Login
2. Dashboard
3. File ITR
4. Tax Computation
5. Pay Tax
6. e-Verify
7. View Filed Returns
8. ITR Status
```

## Priority 2 — Essential Services

```text
9. Register
10. Link Aadhaar
11. Verify PAN
12. Refund Status
13. My Bank Account
14. Downloads
15. Help
16. Grievance
```

## Priority 3 — Advanced

```text
17. Income Tax Forms
18. Authorized Partners
19. Authorize Another Person
20. AIS
21. Pending Actions
22. e-Proceedings
23. Service Requests
24. TAN Services
25. Advanced professional workflows
```

---

# PART 62 — DEMO DATA REQUIREMENTS

Since this React application may not have real government integrations, create realistic but entirely synthetic data.

Example:

```text
PAN:
ABCDE1234F

Assessment Year:
2026-27

Acknowledgement:
123456789012345

CRN:
CRN202608230001

Transaction ID:
TXN202608230001
```

Clearly label demo environments where appropriate.

Never use real taxpayer information.

---

# PART 63 — IMPORTANT LEGAL / PRODUCT RULE

This application is a UI/demo implementation unless connected to an authorized backend.

Never display:

> "Your return has been filed with the Government of India"

unless the application has actually completed a real authorized submission.

Instead use:

> "Demo submission completed"

or:

> "Return submission simulated successfully"

Similarly, payment flows should use:

> "Demo payment successful"

unless a real payment gateway confirms the transaction.

---

# PART 64 — OFFICIAL WORKFLOW REFERENCES

The implementation should be periodically checked against the official Income Tax Department documentation.

Important official references include:

* ITR-2 online filing workflow
* ITR-4 online filing workflow
* ITR-1 online filing workflow
* e-Verify workflow
* e-Pay Tax workflow
* PAN–Aadhaar linking workflow
* ITR Status workflow
* My Bank Account workflow
* Dashboard / Worklist workflow

These references establish the major workflow patterns used by the current portal.

---

# PART 65 — WORKFLOW IMPLEMENTATION PRINCIPLE

The application should be designed as a collection of interconnected workflows rather than a collection of static pages.

The relationship should be:

```text
HOME
 │
 ├── Authentication
 │      ├── Register
 │      └── Login
 │             ↓
 │         DASHBOARD
 │             │
 │             ├── File ITR
 │             │      ├── Tax Computation
 │             │      ├── Pay Tax
 │             │      ├── Preview
 │             │      ├── Validate
 │             │      └── e-Verify
 │             │
 │             ├── Filed Returns
 │             │
 │             ├── ITR Status
 │             │
 │             ├── Profile
 │             │      ├── Aadhaar
 │             │      ├── Bank Account
 │             │      └── Authorized Partners
 │             │
 │             ├── e-Pay Tax
 │             │      ├── Create Challan
 │             │      ├── Payment
 │             │      └── Payment History
 │             │
 │             ├── AIS
 │             │
 │             ├── Pending Actions
 │             │
 │             ├── Grievances
 │             │
 │             └── Help
 │
 └── Pre-login Services
        ├── e-Verify
        ├── Link Aadhaar
        ├── e-Pay Tax
        ├── Verify PAN
        ├── Know TAN
        └── ITR Status
```

The goal is to make the React application feel like a **real end-to-end e-Filing product**, not merely a collection of tax-themed screens.

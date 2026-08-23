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

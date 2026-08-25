# KarSaathi

**Know what needs attention before you file.**

KarSaathi is an independent hackathon prototype that turns confusing tax records into three short, guided readiness journeys. A visitor can explore a fictional salaried individual, a fictional domestic private company, or a fictional LLP; each path uses the same five-step pattern and ends with clear next steps.

> Independent prototype — not affiliated with or endorsed by the Income Tax Department or the Government of India. The demo uses fictional data only. Do not enter real PAN, Aadhaar, passwords, OTPs, bank details, payment information, or tax documents.

## The problem

A person preparing a return may have several records but still not know:

- what each record means;
- why values differ;
- which questions affect the likely return form for that taxpayer type;
- whether anything needs attention before moving to the official portal.

KarSaathi focuses on that moment before filing. It does not imitate the government portal and it never claims to file, verify, or pay tax.

## Three bounded samples, one simple journey

Start by choosing the closest fictional sample:

- **Individual:** Rahul Sharma, a salaried resident with ordinary bank interest.
- **Company:** Aster Components Private Limited, a domestic private company.
- **Firm / LLP:** Mehta & Rao Advisory LLP, a non-company entity represented by one concrete LLP sample.

Every sample follows the same five-step mental model:

1. Understand the synthetic records.
2. Compare or review whether the important records have been checked together.
3. Answer only high-signal readiness questions.
4. Review an explainable, non-binding return-route indication.
5. Leave with a Tax Health report and clear next steps.

The individual sample retains a tightly scoped visual old/new-regime illustration. Company and firm/LLP tax calculations are deliberately not offered: elections, entity facts and rules outside this short flow would make a simple number misleading. “Firm / LLP” is not a universal non-company journey; HUFs, trusts, societies, AOPs, BOIs and other entities may require different forms and checks.

No sign-up, credentials, upload, or real personal information is required.

## What works and what is simulated

| Area | Prototype behaviour | Boundary |
| --- | --- | --- |
| Guided tax journeys | One shared five-step interaction for individual, domestic-company, and firm/LLP samples | Three bounded fictional examples, not general taxpayer coverage |
| Document guide | Explains the records relevant to the selected sample | Documents are bundled synthetic fixtures, not uploaded files |
| Personalised guidance | Deterministic, profile-specific questions support clear, uncertain, and complex answers | It is not a binding filing-form determination |
| Reconciliation and record checks | The individual resolves seeded mismatches; entity samples build a checked/needs-attention review pack | No connection to AIS, TRACES, a bank, or the e-Filing portal |
| Tax Health | Plain-language snapshot of matched and unresolved items | “Health” is a readiness summary, not government status |
| Regime comparison | Illustrative, scoped individual comparison with stated assumptions | No company or firm/LLP tax calculation; not a return computation or advice |
| Plain-language explainer | Three preset, cited topics use server-side AI when configured and local fallback otherwise | It cannot change calculations, recommendations, or readiness |
| Progress | Version-2 browser state isolates progress for each fictional journey and migrates safe legacy individual progress | Reset affects the selected sample; there is no taxpayer account |

Anything not explicitly shown as working is outside this prototype. A notice simplifier and “Where does my tax go?” visualisation are future ideas, not MVP features. Official filing must happen on the [Income Tax e-Filing portal](https://www.incometax.gov.in/).

## Product principles

- One obvious next action per screen.
- Familiar words before tax jargon; define jargon where unavoidable.
- Mobile-first, keyboard-operable, and useful on slower connections.
- Deterministic rules for recommendations and calculations.
- Visible source, assumption, and prototype labels.
- Honest escalation when the scenario is outside the supported scope.
- No government logos, private APIs, live systems, or real citizen data.

## Local development

Requirements: a current Node.js LTS release and npm.

```bash
npm ci
npm run dev
```

Vite prints the local URL. The core demo works without credentials.

Quality checks:

```bash
npm run lint
npm run test -- --run
npm run build
```

If an optional server-side OpenAI explainer is enabled, copy `.env.example` to an uncommitted local environment file and add the server-only values described there. Never expose a secret through a `VITE_` variable. The deterministic demo must remain useful when no API key is configured.

## Architecture

KarSaathi is a small React and Vite application. Selected-profile fixtures and configuration supply fictional records, questions, return-route copy, report copy and calculation policy; shared components preserve one predictable interaction. UI state is separated from pure domain rules so that reconciliation, recommendation, and the supported individual illustration can be tested without the interface. Bundled fixtures are synthetic and deterministic. Version-2 browser storage isolates fictional progress by journey and safely imports valid legacy individual progress.

See [docs/architecture.md](docs/architecture.md) for boundaries and data flow, and [docs/IMPLEMENTATION_DECISIONS.md](docs/IMPLEMENTATION_DECISIONS.md) for the choices, rejected alternatives, evidence, risks, PR rationale, and release gates.

## Privacy and safety

- The product uses only three bundled fictional samples: an individual, a domestic private company, and a partnership firm/LLP.
- It does not request real identifiers, credentials, payments, or files.
- It does not access, scrape, reverse-engineer, or test a government system.
- It does not submit a return or send feedback to AIS.
- Reset removes locally saved demo progress.
- External official links are clearly presented as leaving the prototype.

## Built for Build What Moves India 2026

The cloned repository began as a broad, official-looking ITR portal simulation and earlier still as a visa-portal starter. For this hackathon it was substantially reframed as a narrow, independent readiness assistant: new brand and information architecture, a synthetic end-to-end citizen journey, deterministic tax-domain logic, accessibility and mobile work, tests, safety boundaries, and submission documentation.

Codex was meaningfully used to audit the starting repository, research official sources, define scope, refactor the application, implement and test all three journeys, identify failure states, and perform responsive browser QA. The integrated local build passes lint, 56 automated tests, production build, and diff checks; public-deployment and qualified tax-review gates remain open. See [docs/codex-build-log.md](docs/codex-build-log.md).

The build follows the official [Builder Brief](https://buildwhatmovesindia.com/brief) and [FAQ](https://buildwhatmovesindia.com/faq), accessed 25 August 2026. Submission materials are in [`docs/`](docs/).

## Research and tax-content limits

Tax guidance is time-sensitive. KarSaathi’s rule text and demo assumptions must be checked against current official material before a public release. The source register, access dates, evidence, and open validation items are documented in [docs/research.md](docs/research.md).

This prototype is educational. It is not tax, financial, or legal advice.

## Third-party software

Open-source software and its purpose are disclosed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). The product UI uses no Government of India emblem or official brand asset.

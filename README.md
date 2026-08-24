# KarSaathi

**Know what needs attention before you file.**

KarSaathi is an independent hackathon prototype for first-time salaried Indian taxpayers. It turns a confusing set of tax records into one short, guided readiness journey: understand the documents, answer a few relevant questions, reconcile two seeded mismatches, and leave with clear next steps.

> Independent prototype — not affiliated with or endorsed by the Income Tax Department or the Government of India. The demo uses fictional data only. Do not enter real PAN, Aadhaar, passwords, OTPs, bank details, payment information, or tax documents.

## The problem

A first-time filer may have a Form 16, AIS, Form 26AS, and bank-interest information, but still not know:

- what each record means;
- why values differ;
- which questions affect the likely ITR form;
- whether anything needs attention before moving to the official portal.

KarSaathi focuses on that moment before filing. It does not imitate the government portal and it never claims to file, verify, or pay tax.

## The simple journey

1. Start immediately with Rahul Sharma, a fictional salaried taxpayer.
2. Learn what the synthetic records contribute through small visual explanations.
3. Compare the same income items across sources and resolve the two seeded mismatches.
4. Answer only the questions that affect this supported case.
5. Review an explainable Tax Health result, an indicative ITR recommendation, a tightly scoped visual regime comparison, and next steps.

No sign-up, credentials, upload, or real personal information is required.

## What works and what is simulated

| Area | Prototype behaviour | Boundary |
| --- | --- | --- |
| Guided tax journey | Interactive, browser-based flow | Covers a fictional salaried resident scenario only |
| Document guide | Explains Form 16, AIS, Form 26AS, and bank-interest evidence | Documents are bundled synthetic fixtures, not uploaded files |
| Personalised guidance | Seven deterministic, high-signal questions support clear, uncertain, and complex answers | It is not a binding filing-form determination |
| Reconciliation | User decisions change mismatch and readiness state | No connection to AIS, TRACES, a bank, or the e-Filing portal |
| Tax Health | Plain-language snapshot of matched and unresolved items | “Health” is a readiness summary, not government status |
| Regime comparison | Illustrative, scoped visual comparison with stated assumptions | Not a return computation or professional advice |
| Plain-language explainer | Three preset, cited topics use server-side AI when configured and local fallback otherwise | It cannot change calculations, recommendations, or readiness |
| Progress | Synthetic demo state may persist locally in the browser | Reset clears the local demo; there is no taxpayer account |

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

KarSaathi is a small React and Vite application. UI state is separated from pure domain rules so that reconciliation, recommendation, and illustrative calculations can be tested without the interface. Bundled fixtures are synthetic and deterministic. Browser storage holds only versioned fictional demo progress.

See [docs/architecture.md](docs/architecture.md) for boundaries and data flow, and [docs/IMPLEMENTATION_DECISIONS.md](docs/IMPLEMENTATION_DECISIONS.md) for the choices, rejected alternatives, evidence, risks, PR rationale, and release gates.

## Privacy and safety

- The product uses only the bundled fictional Rahul scenario.
- It does not request real identifiers, credentials, payments, or files.
- It does not access, scrape, reverse-engineer, or test a government system.
- It does not submit a return or send feedback to AIS.
- Reset removes locally saved demo progress.
- External official links are clearly presented as leaving the prototype.

## Built for Build What Moves India 2026

The cloned repository began as a broad, official-looking ITR portal simulation and earlier still as a visa-portal starter. For this hackathon it was substantially reframed as a narrow, independent readiness assistant: new brand and information architecture, a synthetic end-to-end citizen journey, deterministic tax-domain logic, accessibility and mobile work, tests, safety boundaries, and submission documentation.

Codex was meaningfully used to audit the starting repository, research official sources, define scope, refactor the application, implement and test the domain journey, identify failure states, and prepare the submission. See [docs/codex-build-log.md](docs/codex-build-log.md).

The build follows the official [Builder Brief](https://buildwhatmovesindia.com/brief) and [FAQ](https://buildwhatmovesindia.com/faq), accessed 25 August 2026. Submission materials are in [`docs/`](docs/).

## Research and tax-content limits

Tax guidance is time-sensitive. KarSaathi’s rule text and demo assumptions must be checked against current official material before a public release. The source register, access dates, evidence, and open validation items are documented in [docs/research.md](docs/research.md).

This prototype is educational. It is not tax, financial, or legal advice.

## Third-party software

Open-source software and its purpose are disclosed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). The product UI uses no Government of India emblem or official brand asset.

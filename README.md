# Visa-Seva

Visa-Seva is a fictional hackathon prototype exploring what a calm, transparent and distinctly Indian visa journey could feel like. It is not affiliated with the Government of India, does not submit visa applications, and must only be used with invented information.

The product includes:

- a conservative, source-linked visa-path finder;
- public document and arrival guidance;
- a complete local-only demo application journey;
- deterministic draft, payment, processing, document-request, granted and refused states;
- accessible display modes, Data Saver, offline messaging and print-safe prototype watermarks;
- machine-readable route and action documentation at `/agent.md` and `/llms.txt`.

## Run locally

```sh
npm install
npm run dev
```

## Verify

```sh
npm run verify
npm run test:e2e
```

`npm run verify` runs lint, 65 unit/contract tests and the production build. The browser suite runs 20 desktop/mobile Chromium checks covering serious/critical axe findings, keyboard focus, mobile overflow, save/scenario isolation, destructive replacement confirmation, legacy-draft recovery, print output, agent documents, tracking and 404 recovery (with two desktop-only skips for mobile-specific assertions).

## Architecture

- `src/lib/routes.js` is the route, navigation, breadcrumb and agent-action registry.
- `src/lib/rules/` contains the reviewed visa guidance and official-source register.
- `src/lib/application.js` owns application identity, validation, progress and lifecycle transitions.
- `src/state/` separates locally saved demo records from accessibility preferences.
- `src/ui/` contains the accessible visual primitives used across every journey.
- `src/pages/Demo.jsx` exposes six deterministic reviewer scenarios.

Demo application data stays in the current browser. Chosen files are never uploaded or retained; only fictional filename metadata is stored. Real Indian visa services are available at [indianvisaonline.gov.in](https://indianvisaonline.gov.in/).

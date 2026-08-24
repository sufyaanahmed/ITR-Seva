# Codex build log

This file documents how Codex was meaningfully involved in the KarSaathi prototype. It is not a claim that every suggestion was accepted without human judgment. Update the verification section with final command results and commit references before submission.

## Starting condition

The inherited repository was a broad React simulation of the Income Tax e-Filing portal and retained traces of an earlier visa portal. It used official-looking branding and the State Emblem, linked to undeclared or placeholder routes, contained fake payment/status-style experiences, mixed UI and tax logic, and had no automated lint or test suite. The filing screen and layout also had Rules of Hooks, routing, and small-screen risks.

## Meaningful Codex contributions

### Repository audit

Codex inspected the route tree, state management, dashboard pages, filing logic, dependencies, visual assets, build behaviour, and repository history. It identified broken routes, conditional-hook risks, official-affiliation concerns, fake-success behaviour, broad scope, simplistic calculation assumptions, mobile layout problems, and missing quality/submission artifacts.

### Product framing

Codex mapped the official Build What Moves India judging criteria to a narrower product: one complete pre-filing readiness journey for a fictional first-time salaried citizen. With the builder, it evaluated proposed features and kept the trustworthy homepage, guided tax journey, personalised questions, embedded visual concepts, evidence reconciliation, Tax Health, and a scoped visual regime comparison. Notice simplification and “Where does my tax go?” were deliberately deferred to keep the MVP simple and fully working.

### Research and safety

Codex checked the official Builder Brief and FAQ, the Income Tax Department’s AIS FAQ, salaried-individual form guidance, tax estimator material, and FY/AY versus Tax Year guidance. It translated those sources into explicit boundaries: independent branding, synthetic data only, no live government integration, no filing/payment claims, dated assumptions, reasoned recommendations, and escalation for unsupported cases.

### Engineering

Codex helped restructure the application around a small route surface and accessible application shell; separate deterministic fixtures and domain rules from React; implement reconciliation, recommendation, calculation, and readiness behaviour; add error/404 states and versioned demo persistence; and remove irrelevant portal breadth and loading effects.

### Testing and QA

Codex added lint/test tooling and designed checks for reconciliation, unsupported cases, tax boundaries and rounding, storage, routes, and the end-to-end Rahul path. It also reviewed keyboard flow, focus, status semantics, narrow screens, 200% zoom, print, reset/resume, offline behaviour, and console errors.

### Submission work

Codex rewrote the README and design direction, documented architecture and research, recorded third-party software, prepared the under-250-word summary, wrote a timed two-minute demo script, and produced a judge checklist.

## Human decisions

The builder set the simplicity rule, required a familiar low-friction experience, chose to use subagents for bounded workstreams, approved the KarSaathi direction, and is responsible for final tax review, deployment, recording, registration details, and submission.

## Verification record

Fill this from the final clean working tree rather than from an intermediate run.

| Check | Result | Date/time (IST) |
| --- | --- | --- |
| `npm ci` | Pass | 25 Aug 2026 |
| `npm run lint` | Pass | 25 Aug 2026 |
| `npm run test -- --run` | Pass — 5 files, 23 tests | 25 Aug 2026 |
| `npm run build` | Pass | 25 Aug 2026 |
| 390 px journey QA | Pass — no horizontal overflow; mobile evidence cards active | 25 Aug 2026 |
| Keyboard and 200% zoom QA | Pending final run | — |
| Public signed-out link | Pending deployment | — |
| Exact two-minute path | Pending recording | — |

## Traceability

The Git history and pull request provide the authoritative file-level record. The final pull request description should summarise the audit, product pivot, domain/tests, safety changes, validation results, and known limitations, and link to this log.

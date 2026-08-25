# Codex build log

This file documents how Codex was meaningfully involved in the KarSaathi prototype. It is not a claim that every suggestion was accepted without human judgment. Update the verification section with final command results and commit references before submission.

## Starting condition

The inherited repository was a broad React simulation of the Income Tax e-Filing portal and retained traces of an earlier visa portal. It used official-looking branding and the State Emblem, linked to undeclared or placeholder routes, contained fake payment/status-style experiences, mixed UI and tax logic, and had no automated lint or test suite. The filing screen and layout also had Rules of Hooks, routing, and small-screen risks.

## Meaningful Codex contributions

### Repository audit

Codex inspected the route tree, state management, dashboard pages, filing logic, dependencies, visual assets, build behaviour, and repository history. It identified broken routes, conditional-hook risks, official-affiliation concerns, fake-success behaviour, broad scope, simplistic calculation assumptions, mobile layout problems, and missing quality/submission artifacts.

### Product framing

Codex mapped the official Build What Moves India judging criteria to a narrow readiness product. The first iteration delivered one complete path for a fictional salaried citizen. Stakeholder feedback then identified that the route tree, fixtures, state and copy assumed one taxpayer type. Codex helped design a feedback-driven expansion to three bounded synthetic examples—individual, domestic private company, and firm/LLP—while preserving the same five-step interaction and one obvious action per screen. Notice simplification, “Where does my tax go?”, broad non-company coverage and entity tax calculators remain deliberately deferred.

### Research and safety

Codex checked the official Builder Brief and FAQ, the Income Tax Department’s AIS FAQ, salaried-individual, domestic-company, partnership firm/LLP and other non-company form guidance, tax estimator material, and FY/AY versus Tax Year guidance. It translated those sources into explicit boundaries: independent branding, synthetic data only, no live government integration, no filing/payment claims, dated assumptions, reasoned recommendations, bounded entity examples, no guessed entity tax, and escalation for unsupported cases.

### Engineering

Codex helped restructure the application around a small route surface and accessible application shell; separate deterministic fixtures and domain rules from React; implement reconciliation, recommendation, calculation, and readiness behaviour; add error/404 states and versioned demo persistence; and remove irrelevant portal breadth and loading effects. For the feedback iteration, it designed a profile registry, profile-aware canonical routes with legacy individual compatibility, version-2 isolated local state, profile-specific evidence/questions/reports, and an intentional no-estimate state for organisation journeys.

### Testing and QA

Codex added lint/test tooling and checks for reconciliation, unsupported cases, tax boundaries and rounding, storage, routes, all three end-to-end paths, profile isolation, v1 migration, legacy routes, no cross-profile copy leakage, entity no-estimate behaviour, and per-profile reset.

### Submission work

Codex rewrote the README and design direction, documented architecture and research, recorded third-party software, prepared the under-250-word summary, wrote a timed two-minute demo script, and produced a judge checklist.

## Human decisions

The builder set the simplicity rule, required a familiar low-friction experience, chose to use subagents for bounded workstreams, approved the KarSaathi direction, and is responsible for final tax review, deployment, recording, registration details, and submission.

## Verification record

This records both the historical baseline and the integrated three-journey local evidence. Public-deployment evidence must still be added before submission.

| Check | Result | Date/time (IST) |
| --- | --- | --- |
| `npm ci` | Pass | 25 Aug 2026 |
| `npm run lint` | Pass on post-audit hardening tree | 25 Aug 2026 |
| `npm run test:run` | Pass — 6 files, 39 tests on post-audit hardening tree | 25 Aug 2026 |
| `npm run build` | Pass on post-audit hardening tree | 25 Aug 2026 |
| `npm audit` | Pass — 0 known vulnerabilities reported | 25 Aug 2026 |
| Local rendered journey QA | Pass — happy/uncertain outcomes, 404, mobile progress, 390/768/1440 px overflow, no captured console warnings/errors | 25 Aug 2026 |
| Independent keyboard and 200% zoom re-check | Pending final deployed run | — |
| Public signed-out link | Pending deployment | — |
| Exact two-minute path | Pending recording | — |
| Integrated lint | Pass | 25 Aug 2026 |
| Integrated `npm run test:run` | Pass — 9 files, 56 tests | 25 Aug 2026 |
| Integrated production build and `git diff --check` | Pass | 25 Aug 2026 |
| Integrated `npm audit --audit-level=high` | Pass — 0 known vulnerabilities | 25 Aug 2026 |
| Integrated selector/company/firm-LLP browser matrix | Pass — 390/768/1440 px, no overflow, 46 px selector actions, no captured warnings/errors | 25 Aug 2026 |
| Profile isolation, v1 migration and legacy routes | Pass — automated suite | 25 Aug 2026 |

## Traceability

The Git history and pull request provide the authoritative file-level record. The final pull request description should summarise the audit, product pivot, domain/tests, safety changes, validation results, and known limitations, and link to this log.

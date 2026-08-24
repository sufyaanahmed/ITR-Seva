# Judge and submission checklist

## Exact public demo path

1. Open the public root URL in a private/incognito window.
2. Confirm the page loads without access approval, login, or credentials.
3. Select **Start guided demo**.
4. Review the fictional Rahul records and embedded tax-journey explanation.
5. Find and resolve the seeded missing-interest and possible-duplicate issues.
6. Complete the seven supported filing questions.
7. Review the indicative filing route and scoped visual regime comparison, then create the Tax Health report.
8. Confirm the report reflects the resolutions and gives consistent next actions.
9. Follow only the clearly marked official external link if desired; KarSaathi itself must never imply a filing or government update.

Expected outcome: the journey ends with Rahul’s synthetic evidence reconciled, an explainable readiness result, and a clear handoff. A complex answer must produce an honest unsupported/professional-review path rather than the simple result.

## Working build

- [ ] Public HTTPS URL opens without requesting access.
- [ ] Fresh, resume, back, forward, refresh, reset, and 404 flows work.
- [ ] Every visible link, button, question, resolution choice, and report action works.
- [ ] No login, upload, payment, OTP, or real identifier is requested.
- [ ] No placeholder, fake success, unfinished control, or dead legacy route is visible.
- [ ] Browser console has no errors on the exact demo path.
- [ ] `npm ci`, lint, tests, and production build pass from a clean checkout.

## Usability and accessibility

- [ ] Purpose, fictional-data boundary, and main action appear in the first viewport.
- [ ] One primary action is visually obvious per screen.
- [ ] Full journey works at 390 px, 768 px, and 1440 px without horizontal overflow.
- [ ] Full journey works with keyboard only and visible focus.
- [ ] Skip link, landmarks, headings, labels, fieldsets, and status announcements are correct.
- [ ] Meaning is not communicated by colour alone.
- [ ] Layout works at 200% zoom and reduced-motion preference is respected.
- [ ] Print/report view, if visible, contains no clipped content or real identifier.
- [ ] Slow-network reload still gives a useful deterministic journey.

## Honesty and safety

- [ ] “Independent prototype” disclosure persists across the journey.
- [ ] No State Emblem, government logo, seal, or implied endorsement appears.
- [ ] All names, records, identifiers, amounts, and backend actions are clearly synthetic.
- [ ] Tax Health is described as readiness, not compliance or government status.
- [ ] Recommendation is indicative, reasoned, dated, and bounded.
- [ ] Regime comparison is labelled illustrative with supported inputs and assumptions.
- [ ] Unsupported cases stop the simple result and recommend qualified help.
- [ ] Official links are canonical, external, and clearly labelled.
- [ ] No private API, scraping, live government test, or sensitive data is used.

## Submission package

- [ ] Video is two minutes or less: citizen demo in minute one, build/choices in minute two.
- [ ] Video link is public and tested while signed out.
- [ ] Project summary is under 250 words.
- [ ] README explains problem, citizen, walkthrough, setup, architecture, privacy, working/mock boundaries, and limitations.
- [ ] `THIRD_PARTY_NOTICES.md` matches every shipped dependency and asset.
- [ ] Codex build log accurately describes meaningful contribution.
- [ ] Existing starter versus hackathon work is disclosed.
- [ ] Solo/team registration, 18+ eligibility, email, WhatsApp, and teammate-email requirements are handled by the submitter.
- [ ] Submit before **28 August 2026, 8:00 PM IST**; official brief says there is no grace period.

## Final evidence to capture

- Public application URL:
- Public video URL:
- Commit SHA deployed:
- Deployment timestamp (IST):
- Clean-install/lint/test/build result:
- Mobile browser/device checked:
- Desktop browser checked:
- Submitter email used consistently:
- Teammate registered email, or “solo”:

## Current audit status — 25 August 2026

- Local clean install: passed.
- Automated tests at `c3ba343`: 5 files, 23 tests passed. Post-audit hardening tree: 6 files, 39 tests passed.
- Lint and production build on the post-audit hardening tree: passed.
- Dependency audit: 0 known vulnerabilities reported by npm on the audit date.
- PR: [#1 — Build KarSaathi: a simple tax readiness journey](https://github.com/sufyaanahmed/ITR-Seva/pull/1) is open.
- Deployment gate: not passed. The Vercel status check is failing at GitHub/Vercel authorization, so a public signed-out application URL is not yet evidenced.
- Local rendered QA: happy and “Not sure” outcomes, 404 recovery, mobile progress/touch sizing, 390/768/1440 px overflow, and captured console warnings/errors passed. Keyboard-only, true 200% zoom, print/export, slow-network, and every check on the final public deployment remain open.

See [IMPLEMENTATION_DECISIONS.md](IMPLEMENTATION_DECISIONS.md) for the complete final execution checklist.

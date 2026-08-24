# KarSaathi design direction

## Product feeling

KarSaathi should feel like a calm person sitting beside a first-time taxpayer: clear, patient, and honest. It is an independent consumer aid, not a government portal, a filing product, or an AI dashboard.

The interface should answer three questions on every screen:

1. Where am I?
2. What does this mean?
3. What is the one next action?

## Core principles

### Keep it obvious

- Use one primary action per view.
- Ask one decision at a time when possible.
- Prefer everyday language: “bank interest is missing” before “income-source discrepancy.”
- Put a short explanation beside the decision, not behind a help icon.
- Show progress in a familiar step sequence.
- Preserve answers when moving backward.

### Keep it narrow

- Design the primary path for the bundled fictional first-time salaried taxpayer.
- Show only guidance relevant to the answers given.
- Escalate complex cases instead of adding more forms.
- Do not expose admin, payment, authentication, or filing simulations.

### Earn trust through honesty

- Keep the independent-prototype disclosure visible in the application shell.
- Label all data “fictional” or “synthetic.”
- State why a recommendation was produced and which answers affected it.
- State assumptions and dates beside calculations.
- Mark official links as external.
- Never use the State Emblem, government logos, official seals, or language implying affiliation.

## Visual language

Use a warm, editorial utility style:

- off-white page background;
- deep green or ink for primary text and actions;
- restrained amber for “needs attention”;
- strong typography, generous spacing, and thin borders;
- familiar checklists, comparison tables, progress markers, and callouts;
- minimal shadows and modest corner radii.

Avoid gradients, glass effects, carousels, decorative loaders, dashboards full of cards, chat-first layouts, and animation that does not explain a state change.

Status must never depend on colour alone. Pair colour with a label and, where helpful, an icon or text summary: “Matched,” “Needs attention,” “Resolved,” or “Outside this demo.”

## Content voice

- Direct: “Check the bank interest below.”
- Specific: “AIS and the bank certificate show different values.”
- Non-judgmental: “These records do not match yet.”
- Bounded: “This looks like an ITR-1 case based on the answers in this demo.”
- Actionable: “Confirm which source matches your records, then continue.”

Do not use “success” for filing, payment, verification, or government submission. KarSaathi can only say the demo checklist is complete or ready for the next official step.

## Responsive behaviour

Design first at 390 px.

- Keep the page title, current step, and action visible without horizontal scrolling.
- Stack source comparisons into labelled records when a table no longer fits.
- Use full-width primary buttons on small screens.
- Keep touch targets at least 44 by 44 CSS pixels.
- Do not fix tall navigation or action bars over content.
- Make Hindi and long tax terms wrap safely.

Desktop layouts may place the progress summary beside the main task, but should not introduce extra actions.

## Accessibility

- Include a skip link and semantic header, navigation, main, and footer landmarks.
- Use real labels, fieldsets, legends, and buttons.
- Maintain logical heading order and visible keyboard focus.
- Move focus to the new step heading after navigation.
- Announce validation and reconciliation status changes accessibly.
- Respect `prefers-reduced-motion`.
- Support keyboard-only use and 200% zoom.
- Use sufficient contrast for text, focus rings, controls, and status labels.

## Performance

- No splash screen or intentional delay.
- No large hero media, webfont dependency, or decorative animation library.
- Keep synthetic fixtures small and local.
- Render useful deterministic guidance if any optional API is unavailable.

## Definition of a finished screen

A screen is finished when its purpose is apparent in the first viewport, its primary action works, keyboard focus is predictable, error and unsupported states are written, mobile has no horizontal overflow, and every displayed value can be traced to a synthetic source or documented rule.

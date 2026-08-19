# Visa seva — Design System

## 1. Design Direction

Bharat Visa Portal should feel like a modern, trustworthy public-service website with an editorial visual identity.

Primary inspiration:

- White House-style editorial hierarchy
- Modern civic/public-service UX
- Passport and document visual language
- Accessibility-first interaction design
- Low-bandwidth and low-end-device friendly design

The design should NOT feel like:

- A SaaS dashboard
- A fintech application
- A generic AI application
- A flashy startup landing page
- A government website clone
- A video-heavy marketing site
- A card-heavy mobile application

The core visual idea:

> Editorial Government + Passport / Document

The interface should communicate:

- Trust
- Clarity
- Authority
- Simplicity
- Accessibility
- Human control

---

# 2. Design Principles

## 2.1 Content First

Typography and layout should create visual interest.

Do not depend on:

- Video
- Large background images
- Carousels
- Animations
- Decorative illustrations
- Heavy JavaScript

The site should remain attractive when all non-essential images are disabled.

---

## 2.2 One Application, Multiple Users

The same UI must work for:

- Normal users
- Elderly users
- Low-vision users
- Keyboard users
- Screen-reader users
- Mobile users
- Low-connectivity users
- AI agents

Do not create separate visual interfaces for AI agents.

Use semantic HTML and machine-readable metadata underneath the same UI.

---

## 2.3 Calm, Not Flashy

Avoid excessive:

- Shadows
- Gradients
- Rounded cards
- Animations
- Floating elements
- Glassmorphism
- Decorative icons
- Bright colors

Prefer:

- Whitespace
- Typography
- Borders
- Rules
- Clear hierarchy
- Large controls

---

# 3. Visual Theme

Use a combination of:

## Editorial Government

Characteristics:

- Large display headings
- Generous whitespace
- Strong horizontal rules
- Black/navy typography
- Serif display typography
- Clean sans-serif interface typography
- Structured navigation
- Editorial content sections

## Passport / Document

Characteristics:

- Document-like layouts
- Application IDs
- Passport/document artifacts
- Stamp-inspired graphics
- Fine borders
- Timeline structures
- Paper-like surfaces
- Subtle security-pattern details

Do not make the UI look like an actual government document.

All visual artifacts must clearly belong to the fictional prototype.

---

# 4. Color System

Primary colors:

```text
--color-background: #FFFFFF;
--color-surface: #F7F7F5;
--color-surface-dark: #EFEFED;

--color-text: #111111;
--color-text-secondary: #4F4F4F;
--color-text-muted: #6B6B6B;

--color-primary: #163A5F;
--color-primary-dark: #0B2540;
--color-primary-light: #E8EEF4;

--color-border: #D6D6D2;
--color-border-dark: #999994;

--color-success: #176B45;
--color-success-bg: #EAF5EF;

--color-warning: #8A5A00;
--color-warning-bg: #FFF5DD;

--color-error: #A32D2D;
--color-error-bg: #FCECEC;

--color-info: #245A8D;
--color-info-bg: #EAF2F8;
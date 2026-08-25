# Research and source register

Accessed 25 August 2026 unless noted otherwise. Tax information changes; re-check the applicable Act, Rules, forms, notifications, and official guidance before using any rule outside this fictional demo.

## Research question

How can an individual or organisation understand which records matter, reconcile differences before return preparation, and know what still needs attention—without recreating the e-Filing portal or pretending that one taxpayer type represents everyone?

## Official evidence

### Build What Moves India

- [Builder Brief](https://buildwhatmovesindia.com/brief): asks builders to solve one real public-service problem through a complete working citizen journey; design for mobile, slower connections, and limited digital experience; use mock/synthetic data; disclose what works and what is mocked; and avoid live government systems, real sensitive data, and misleading official branding.
- [FAQ](https://buildwhatmovesindia.com/faq): confirms that Codex must be meaningfully involved, every demonstrated feature must work, libraries/assets must be permitted and disclosed, and the build must be an independent prototype.

These requirements drove the narrow journey, persistent disclosure, absence of login/upload/payment, deterministic fixtures, licence notice, and Codex build log.

### Income-tax records

- [AIS — Annual Information Statement FAQs](https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/ais%20-%20annual%20information%20statement-faqs): describes AIS as a comprehensive view of taxpayer information with a feedback facility. It distinguishes AIS from Form 26AS, which from AY 2023–24 principally displays TDS/TCS-related data while other details are available in AIS.
- [Salaried individuals — returns and forms for AY 2026–27](https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1): gives an official overview of ITR forms for salaried individuals and the eligibility/exclusion conditions for ITR-1. The page itself says its guidance is not exhaustive.
- [Domestic company — returns and forms for AY 2026–27](https://www.incometax.gov.in/iec/foportal/help/company/return-applicable): states that ITR-6 applies to companies other than those claiming exemption under Section 11 and describes multiple company tax options and forms. Its overview is explicitly not exhaustive.
- [Partnership firm / LLP — returns and forms for AY 2026–27](https://www.incometax.gov.in/iec/foportal/help/partnership-firm-llp): states that ITR-5 applies to firms and LLPs, while an eligible resident firm other than an LLP may opt for ITR-4 under the listed presumptive-income conditions. Its overview is explicitly not exhaustive.
- [AOP / BOI / trust / AJP — returns and forms for AY 2026–27](https://www.incometax.gov.in/iec/foportal/help/non-company/return-applicable-0): shows that “non-company” covers materially different entity types and that ITR-5 and ITR-7 applicability depends on the entity and statutory basis. This is why KarSaathi does not present its firm/LLP sample as universal non-company guidance.
- [Income and Tax Estimator](https://www.incometax.gov.in/iec/foportal/income-tax-estimator): shows that a proper estimate considers taxpayer facts, income heads, deductions, and tax details and can compare old and new regimes.
- [Income Tax Calculator user manual](https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/income-tax-calculator-um): documents the official calculator and distinguishes Assessment Year under the Income-tax Act, 1961 from Tax Year under the Income-tax Act, 2025.
- [Income-tax Act 2025 — objective and scope FAQs](https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/objective-and-scope-new-act-faq): states that “Tax Year” applies from 1 April 2026 for income earned during FY 2026–27 onward. The Rahul demo concerns FY 2025–26 / AY 2026–27, so its source labels retain FY/AY terminology.
- [Income Tax e-Filing portal](https://www.incometax.gov.in/): canonical external destination for official services.

### OpenAI, if an optional explainer is enabled

- [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses): official guidance for response generation.
- [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs): official guidance for schema-constrained model responses.
- [API key safety](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety): keys must not be deployed in browser code or committed to the repository.

## Product interpretation

The official sources support these product decisions:

- AIS, Form 26AS, Form 16, and the taxpayer’s own records are related but not interchangeable.
- A mismatch should be surfaced for review, not silently treated as an error or automatically “fixed.”
- ITR guidance needs both inclusion and exclusion questions; a single income value is insufficient.
- A regime comparison needs explicit scope and assumptions. Unsupported income should disable or qualify the estimate.
- A domestic company and a firm/LLP cannot safely reuse an individual regime comparison. Entity status, eligibility, elections, audit facts and other provisions change both the route and calculation.
- “Non-company” is a portal/category label, not one homogenous taxpayer. A bounded LLP example is more honest than a single flow that claims to cover firms, HUFs, trusts, societies, AOPs and BOIs alike.
- KarSaathi should hand the citizen to the official portal rather than imitate filing.

## Anecdotal evidence

Public forum discussions were considered only as problem signals, not as authority. Common themes include confusion between FY and AY, uncertainty about AIS versus Form 26AS, missing bank interest, duplicate-looking entries, and anxiety about choosing an ITR form. Forum posts are self-reported, may be incomplete, and are not used to set a tax rule or calculation.

The prototype still needs direct moderated research with first-time filers, including mobile-only users and Hindi-preferring users. No participant data was collected for this hackathon build.

## Assumptions and open validation

- Rahul is fictional, resident, salaried, and intentionally constrained to a simple demonstrable case.
- Aster Components Private Limited is a fictional domestic-company sample. Its likely-route wording is bounded to a private company not claiming Section 11 exemption; it is not a company-return eligibility engine.
- Mehta & Rao Advisory LLP is a fictional firm/LLP sample. The path demonstrates an LLP-like readiness journey and must not be generalized to HUFs, trusts, societies, AOPs, BOIs, cooperative societies or every partnership firm.
- Amounts and mismatches are teaching fixtures, not representative population data.
- “Likely ITR-1” is an indicative outcome based only on captured answers; it is never a binding determination.
- Any “likely ITR-6” or “likely ITR-5” wording is likewise a non-binding routing aid based only on the selected fictional entity and captured answers.
- “Tax Health” means readiness of the selected fictional evidence/review pack, not compliance, filing, refund, audit completion, or government status.
- The visual regime comparison is illustrative and must display its rule period and supported inputs. It does not model every exemption/deduction (including possible Section 80TTA treatment), family/age nuance, surcharge case, statutory rounding rule, or tax-credit/payable computation.
- Company and firm/LLP tax calculations are deliberately omitted. “Not offered” is an honest product boundary, not a zero-tax result, an error state, or evidence that the entity is ready.
- Before submission, a qualified reviewer should compare all implemented individual slabs, deductions, rebate, cess, rounding, and all three journeys’ route wording, questions, labels and escalation branches against official material applicable to FY 2025–26 / AY 2026–27.

## Scope decisions

Included in the feedback-driven iteration: a trustworthy profile selector; three bounded synthetic journeys for an individual, domestic private company and firm/LLP; one shared five-step interaction; profile-specific questions, individual reconciliation and entity review-pack checks; Tax Health reports; and a tightly scoped visual regime comparison for the individual sample only.

Deferred: entity tax calculators, universal non-company coverage, real document upload, notice simplification, “Where does my tax go?”, real accounts, payments, e-verification, government integration, and comprehensive filing-form coverage. Deferral keeps the visible MVP understandable and avoids false precision.

The three-journey iteration passes local lint, 56 automated tests, production build, diff checks, and responsive rendered QA. This source register is still not a substitute for qualified tax review or public-deployment verification.

Implementation tradeoffs, evidence, risks, and release gates are recorded in [IMPLEMENTATION_DECISIONS.md](IMPLEMENTATION_DECISIONS.md).

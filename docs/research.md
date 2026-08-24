# Research and source register

Accessed 25 August 2026 unless noted otherwise. Tax information changes; re-check the applicable Act, Rules, forms, notifications, and official guidance before using any rule outside this fictional demo.

## Research question

How can a first-time salaried taxpayer understand which records matter, reconcile differences before filing, and know whether the case is ready for the official e-filing journey?

## Official evidence

### Build What Moves India

- [Builder Brief](https://buildwhatmovesindia.com/brief): asks builders to solve one real public-service problem through a complete working citizen journey; design for mobile, slower connections, and limited digital experience; use mock/synthetic data; disclose what works and what is mocked; and avoid live government systems, real sensitive data, and misleading official branding.
- [FAQ](https://buildwhatmovesindia.com/faq): confirms that Codex must be meaningfully involved, every demonstrated feature must work, libraries/assets must be permitted and disclosed, and the build must be an independent prototype.

These requirements drove the narrow journey, persistent disclosure, absence of login/upload/payment, deterministic fixtures, licence notice, and Codex build log.

### Income-tax records

- [AIS — Annual Information Statement FAQs](https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/ais%20-%20annual%20information%20statement-faqs): describes AIS as a comprehensive view of taxpayer information with a feedback facility. It distinguishes AIS from Form 26AS, which from AY 2023–24 principally displays TDS/TCS-related data while other details are available in AIS.
- [Salaried individuals — returns and forms for AY 2026–27](https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1): gives an official overview of ITR forms for salaried individuals and the eligibility/exclusion conditions for ITR-1. The page itself says its guidance is not exhaustive.
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
- KarSaathi should hand the citizen to the official portal rather than imitate filing.

## Anecdotal evidence

Public forum discussions were considered only as problem signals, not as authority. Common themes include confusion between FY and AY, uncertainty about AIS versus Form 26AS, missing bank interest, duplicate-looking entries, and anxiety about choosing an ITR form. Forum posts are self-reported, may be incomplete, and are not used to set a tax rule or calculation.

The prototype still needs direct moderated research with first-time filers, including mobile-only users and Hindi-preferring users. No participant data was collected for this hackathon build.

## Assumptions and open validation

- Rahul is fictional, resident, salaried, and intentionally constrained to a simple demonstrable case.
- Amounts and mismatches are teaching fixtures, not representative population data.
- “Likely ITR-1” is an indicative outcome based only on captured answers; it is never a binding determination.
- “Tax Health” means readiness of the synthetic evidence set, not compliance, filing, refund, or government status.
- The visual regime comparison is illustrative and must display its rule period and supported inputs. It does not model every exemption/deduction (including possible Section 80TTA treatment), family/age nuance, surcharge case, statutory rounding rule, or tax-credit/payable computation.
- Before submission, a qualified reviewer should compare all implemented slabs, deductions, rebate, cess, rounding, eligibility branches, and labels against official material applicable to FY 2025–26 / AY 2026–27.

## Scope decisions

Included now: trustworthy homepage, guided tax journey, personalised questions, small embedded visual explanations, evidence reconciliation, Tax Health report, and a tightly scoped visual regime comparison.

Deferred: real document upload, notice simplification, “Where does my tax go?”, real accounts, payments, e-verification, government integration, and comprehensive filing-form coverage. Deferral keeps every visible MVP feature working and the core journey easy to understand.

Implementation tradeoffs, evidence, risks, and release gates are recorded in [IMPLEMENTATION_DECISIONS.md](IMPLEMENTATION_DECISIONS.md).

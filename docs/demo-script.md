# Two-minute demo script

Target length: 1:50–1:58. Record the deployed public build in a fresh browser at approximately 390 px width. Do not show a feature unless it works in that exact deployment.

Status: this script targets the locally validated three-journey iteration. Final timing, qualified tax review, and every claim on the public deployment remain pending.

## 0:00–1:00 — citizen journey

**0:00–0:08 — Homepage**

“This is KarSaathi, an independent return-readiness prototype using only fictional data. It helps an individual or organisation see what needs attention before return preparation.”

Point briefly to the independent-prototype label. Select **Choose a sample journey**.

**0:08–0:17 — Choose the taxpayer type**

“The original prototype assumed one salaried user. Feedback led to three bounded examples—individual, domestic company, and firm/LLP—without adding a dashboard or service maze.”

Show all three cards, then choose **Individual**.

**0:17–0:27 — Tax journey and records**

“Rahul already has four records, but they answer different questions. KarSaathi shows the filing journey and explains Form 16, AIS, Form 26AS, and the bank certificate in plain language.”

Show one embedded visual explanation, then continue.

**0:27–0:43 — Reconciliation**

“Here is the real problem: fixed-deposit interest is missing and a savings-interest entry may be repeated. KarSaathi explains each issue, lets Rahul record a decision, and keeps the resolution visible.”

Resolve both seeded issues. Do not describe this as changing AIS or filing a correction.

**0:43–0:52 — Personalised questions**

“Instead of a wall of rules, Rahul answers only seven questions that affect this simple case. The guidance is deterministic, and a complex answer would stop the simple recommendation.”

Complete the supported answers and continue.

**0:52–1:00 — Result and Tax Health**

“The result explains why this looks like an ITR-1 case and shows a tightly scoped illustrative regime comparison. Tax Health then records what matched, what Rahul decided, and the next official step—not a filed return or tax advice.”

Open the readiness report and show the official external destination label.

## 1:00–2:00 — how and why

**1:00–1:15 — Product choice**

“We started from a broad portal clone and narrowed it to one readiness problem with one familiar five-step pattern. Profile-specific records, questions and reports make the three samples real without creating three separate products.”

**1:15–1:32 — Architecture**

“The React interface runs on bundled fictional records. Deterministic domain rules handle reconciliation, unsupported cases and likely routes. Versioned browser state keeps each sample separate and preserves compatible legacy individual links.”

**1:32–1:45 — Safety and honesty**

“No real PAN, Aadhaar, OTP, payment, notice, or document enters the app. Entity tax estimates are deliberately omitted rather than guessed, and the LLP sample never claims to represent every non-company entity.”

**1:45–1:56 — Codex contribution**

“Codex meaningfully helped audit the inherited repository, research the official brief and tax guidance, reshape the product, implement and test it, check mobile and failure states, and produce the submission evidence.”

**1:56–2:00 — Close**

“KarSaathi: know before you file.”

## Recording checklist

- Use the public URL with no editor, terminal, private dashboard, or API key visible.
- Start from reset demo state and close unrelated browser tabs and notifications.
- Briefly open the company and firm/LLP cards before recording to confirm their routes, copy and no-estimate states; the timed path may remain individual-led.
- Keep the pointer still unless it indicates the next action.
- Use 125–140 spoken words per minute and captions if available.
- Do a final timed run; the official limit is two minutes with no grace implied.
- Verify that every claim above matches the deployed build. Remove any sentence for a feature that is not working.

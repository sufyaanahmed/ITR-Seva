# Dodo Payments evaluation

Reviewed 5 September 2026 against the provider's current documentation.

## Decision

Keep the implemented checkout in sandbox mode. Do not enable live Dodo collection for this visa-service workflow without written merchant approval. Dodo's merchant acceptance policy restricts services facilitating government filings, licences and permits, and certain regulated/professional services. Visa application processing appears likely to fall within these restrictions; that is an inference about this service, not a provider decision on Visa Seva. [Merchant acceptance policy](https://docs.dodopayments.com/miscellaneous/merchant-acceptance).

## Methods and testing

Dodo documents credit/debit cards (including Visa and Mastercard), digital wallets, and regional methods. Availability varies by customer location, currency, account eligibility, and checkout configuration. The current Visa Seva UI represents Visa/Mastercard in sandbox checkout; it does not imply a live acquiring agreement. [Payment methods](https://docs.dodopayments.com/features/payment-methods).

Dodo has separate test and live environments and test payment methods. Live access requires account verification. Test API base: `https://test.dodopayments.com`. Do not use real card details in tests. [Test mode versus live mode](https://docs.dodopayments.com/miscellaneous/test-mode-vs-live-mode).

## Agent assistance

Dodo provides MCP/API tooling for payment operations and integration assistance. This is distinct from a mandate allowing an assistant to spend a user's money. Visa Seva's MCP tools only create a checkout link and read payment status. Authorization remains in the browser checkout. [Dodo developer introduction and MCP tools](https://docs.dodopayments.com/introduction).

## Future adapter requirements

If the provider approves the business model, implement test-mode hosted checkout behind the same application service. Keep price/currency on the server, map provider sessions to application IDs, verify webhook signatures against the raw request body, store provider event IDs under a unique constraint, and reconcile pending sessions with the provider API. Never mark an application paid from a redirect query parameter, assistant claim, or client callback. Do not expose the sandbox outcome endpoint for live sessions. Add webhook replay, out-of-order delivery, mismatched amount/currency, cancellation and network-interruption tests before enabling live collection.

## Email reference

Email retries use Resend's idempotency key support, which retains keys for 24 hours. Visa Seva stops automatic retries at 23 hours to allow an operator to reconcile uncertain deliveries. [Resend idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys).

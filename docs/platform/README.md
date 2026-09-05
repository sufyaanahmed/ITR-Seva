# Visa Seva application platform

The Supabase platform is an opt-in extension to the existing public site. The Rust backend in `backend/` remains an independent showcase/load-test service. It never receives personal application data through the new platform.

## Run

1. Create or select a Supabase project. Run the three SQL files in `supabase/migrations/` in filename order using the SQL editor, or link the Supabase CLI and run `supabase db push`. Do not run these against the Rust backend database.
2. In Supabase Auth, enable passwordless email authentication for applicants and password login for assigned administrators. Add the public and admin origins to allowed redirect URLs. Use a verified SMTP sender for Supabase authentication emails.
3. Configure the platform values in `.env` using `.env.example`. `VITE_SUPABASE_ANON_KEY` is the publishable/anon key, never the service role key. `SUPABASE_SERVICE_ROLE_KEY` is server-only. Keep `VITE_SHOWCASE_BACKEND` unset when running this platform.
4. Run `npm run platform:dev` (Node 22+) and `npm run dev -- --host 127.0.0.1`. The API uses port 3001; Vite proxies `/api/platform`, `/oauth`, `/mcp`, and OAuth metadata routes.
5. Open `http://127.0.0.1:5173/applications` to request a secure email link. Applicants do not register or choose passwords. The existing application wizard opens immediately without authentication and offers secure storage and continues into review, confirmation, checkout, and submission.
6. Open `http://admin.localhost:5173` for the separate admin entry point. If your OS does not resolve `admin.localhost`, use a local hostname mapping. There is no public navigation link or `/admin` route.
7. Create the admin account in Supabase Auth, then explicitly assign its role using the SQL editor:

```sql
insert into public.platform_roles(user_id, role)
values ('AUTH_USER_UUID', 'decision_maker');
```

Roles: `reviewer` can review and request information; `decision_maker` and `administrator` can also accept/reject. There is no self-service role assignment, including for administrators. Manage roles through privileged operations only.

8. Configure `RESEND_API_KEY` and a verified `EMAIL_FROM`, then run `npm run platform:emails`. `npm run platform:emails -- --once` processes one batch for scheduled execution. No emails are sent until this worker is configured and run.

## Provisioned environments (5 September 2026)

- Public application and API: https://visa-seva-platform.vercel.app
- Separate admin portal: https://visa-seva-admin.vercel.app
- MCP endpoint: https://visa-seva-platform.vercel.app/mcp
- Supabase project: `ollqqjxxbhldmfcuvzvb` (Visa Seva, Mumbai). All three migrations are applied.
- Local Supabase: API `54321`, database `54322`, Studio `54323`, Mailpit `54324`.
- Local API: `http://127.0.0.1:3001`; public UI: `http://127.0.0.1:5173`; admin: `http://admin.localhost:5173`.

The existing visa-seva.vercel.app deployment belongs to a different Vercel context and was not changed. The dedicated public/admin projects are in the `nisar5` Vercel team. Vercel preview URLs remain protected; use the production URLs above.

### Email setup status

The user selected Supabase's built-in authentication email sender for now. The dashboard switch away from custom Resend SMTP is prepared but still awaits explicit approval of Supabase's template-reset and two-emails-per-hour confirmation. The hosted frontend uses `VITE_AUTH_EMAIL_TEMPLATE=default`: it shows link-based access without an email-code prompt. The callback exchanges Supabase's standard PKCE code, handles expired links, and removes the callback parameters from browser history. Open the email link in the same browser where it was requested.

Supabase's default sender only emails project team members and is rate limited. It cannot send general application-status notifications. Status and decision notifications stay queued; `EMAIL_FROM` is unset and the hosted recurring email worker is not installed. Do not describe arbitrary-applicant delivery as enabled. See [Supabase SMTP limits](https://supabase.com/docs/guides/auth/auth-smtp).

The dedicated Resend key remains stored privately for possible future use, but no custom sending domain is configured. A prior Resend setup email to the owner was confirmed delivered. The earlier SMTP and email scheduler approval requests are superseded by the decision to use Supabase's built-in sender for now.

The public and admin authentication redirect URLs are saved. No broad authentication configuration sync is needed. Existing MFA and OTP defaults remain intact. Local development continues using its custom link-and-code template through Mailpit.

`api/email-cron.js` and `scripts/platform-email-schedule.mjs` remain available for a future verified provider. The scheduler is not installed or active. It must be explicitly approved before execution, and `EMAIL_FROM` must identify a verified sender before activation.

### Local setup and validation

```sh
npx supabase start
npm run platform:local-env
npm run platform:dev
npm run dev -- --host 127.0.0.1
npm run platform:emails
npm run test:platform:e2e
```

The local worker uses Mailpit, so synthetic test messages stay in the local inbox. Both local and hosted runs passed ten integration scenarios. Local validation exercises actual magic-link and code emails. Hosted validation exchanges generated single-use authentication tokens, runs real API/Storage/RLS/MCP operations, and verifies the email outbox. It does not claim hosted SMTP delivery is configured.

```sh
npm run test:platform:hosted
```

Hosted validation is restricted to this dedicated project and uses synthetic `@visa-seva.test` identities. Do not deliver their notifications through a live provider. Test access is stored privately at `/private/tmp/visa-seva-hosted-validation.json`; these are validation accounts, not permanent staff provisioning.

### Deployment

Server credentials live only in ignored environment files and Vercel server variables. The public project deploys the Express API through `api/index.js`. Its Vite browser bundle uses only the public Supabase key. `vercel.json` routes API, OAuth, and MCP requests separately from the SPA, with server functions in Mumbai.

```sh
vercel --prod --yes
npm run platform:admin-build
vercel link --cwd /private/tmp/visa-seva-admin-deploy --project visa-seva-admin --yes
vercel --cwd /private/tmp/visa-seva-admin-deploy --local-config /private/tmp/visa-seva-admin-deploy/vercel.json --prod --yes
```

The admin build sets `VITE_APP_ROLE=admin` and contains no server API or service-role key. Its project link is preserved across rebuilds. Always pass its explicit local configuration when deploying from the main repository.

## Shared application behavior

- Form definitions and validation live in `src/domain/applicationForm.js`; `platform/rules.js` adds server validation of select values and stored document completeness.
- All state mutations go through `platform_command`, a service-role-only transaction. It locks the application row, enforces ownership and admin roles, checks versions, records audit events, and queues notifications with status changes.
- Direct browser writes to application, payment, decision, or role tables are revoked. RLS allows applicants to read only their own rows; staff read permissions derive from the server-controlled role table.
- Payment and application statuses are independent. The sandbox amount is a configurable test amount, not a claimed government fee.
- A draft key gives create retries the same application. Only one pending/processing/paid checkout may exist per application. Final payment results are immutable; payment retries create a new session only after failure or cancellation.
- A user confirms the exact version on the website. Edits invalidate confirmation. Submission requires payment and confirmation less than 24 hours old. Assistants cannot approve or pay for users. Additional-information responses reuse successful payment.
- Documents are held in a private bucket. Uploads are checked for allowed type, byte limits, JPEG decoding and dimensions, and basic PDF signatures/active content. Downloads are authorized and expire after 60 seconds. Object paths are not provided to MCP tools.
- This is not a comprehensive malware scanner or a visual/content authenticity check. Before accepting untrusted production uploads, add malware scanning/quarantine and content checks. Superseded private object bytes need a retention/cleanup job; metadata removal immediately prevents API access to them.
- Emails target the authenticated account email, not an arbitrary form address. Status history and decision reasons are available after sign-in. The transactional outbox retries failed sends and uses provider idempotency keys. `sent` means accepted by the provider; `delivered` and `bounced` are retrieved separately. Uncertain attempts older than 23 hours go to `needs_attention` instead of risking duplicates outside Resend's deduplication window. Keep sender and public URL stable while retrying queued messages.
- Server request bodies and upload sizes are bounded. API rate limiting is process-local; multi-replica hosting needs a shared rate-limit store or gateway. Configure a trusted proxy hop explicitly before using forwarded client IPs. Expired OAuth requests and grants should be pruned on a retention schedule.

## Verification

```sh
npm test
npm run build -- --outDir /private/tmp/visa-seva-platform-build
```

Database tests execute migrations against PGlite/PostgreSQL, including real RLS and transactional functions. HTTP tests use the real Express/MCP transports with controlled authentication fixtures. They do not substitute for a deployed Supabase/Auth/Storage integration test.

After configuring Supabase, verify with two applicant accounts and separate reviewer/decision-maker accounts: cross-account isolation; save/reload/upload; confirm; payment decline/retry/interruption; submit; information request/resubmission; accept/reject; actual email delivery; OAuth consent/revocation. Check mobile layouts and keyboard navigation with real application data. See `MCP.md` and `DODO-EVALUATION.md` for connection and provider details.

## Applicant magic links

For the current hosted built-in sender, use the standard PKCE callback described above. The custom-template instructions below apply only after enabling a custom SMTP provider.

Applicants start the wizard without an access gate. Unverified answers stay in the existing tab draft. Saving to the backend or reopening protected records asks only for an email link or one-time email code. Once verified, subsequent “Save and continue” actions persist to Supabase. Admin password authentication remains separate.

Configure **both the Magic Link and Confirm Signup templates** in Supabase Auth with:

```html
<h2>Your Visa Seva application</h2>
<p>
  <a href="{{ .RedirectTo }}&token_hash={{ .TokenHash }}"
    >Open your application securely</a
  >
</p>
<p>Or enter this code in the application tab: <strong>{{ .Token }}</strong></p>
```

Our email requests always set RedirectTo to `/auth/confirm?next=...`. Allow this callback path under the public origin in Supabase. The callback exchanges the single-use token hash and immediately removes it from browser history. It works across devices without depending on a PKCE verifier from the original tab. Keep the email expiry short (Supabase defaults to one hour); returning applicants request a fresh link, even years later. Long-term record retention is a separate operational policy and is not promised by link lifetime.

Supabase auth sessions use its standard browser storage and cross-tab synchronization; application answers and file bytes are not copied into that storage. A link opened in a new tab unlocks the original form tab too; the applicant can continue saving there. Entering the emailed code is the same-tab option. On another device, previously saved applications are available, while unsaved answers remain on the original device. Closing secure access signs out and clears the tab's draft. No passwords or sign-up controls are shown to applicants.

[Supabase passwordless email reference](https://supabase.com/docs/guides/auth/auth-email-passwordless).

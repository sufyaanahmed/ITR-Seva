import assert from "node:assert/strict";
import { randomBytes, randomUUID, createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import sharp from "sharp";
import { getSteps } from "../src/domain/applicationForm.js";
import { getRequiredDocuments } from "../src/domain/documentRequirements.js";
import { configuration } from "../platform/server.js";
import { deliverEmails } from "../platform/email-worker.js";
import { mailpitFetcher } from "../platform/mailpit.js";
const config = configuration();
const hosted = process.argv.includes("--hosted");
assert.ok(
  hosted
    ? process.env.SUPABASE_PROJECT_REF === "ollqqjxxbhldmfcuvzvb" &&
        new URL(process.env.SUPABASE_URL).hostname ===
          "ollqqjxxbhldmfcuvzvb.supabase.co"
    : ["127.0.0.1", "localhost"].includes(
        new URL(process.env.SUPABASE_URL).hostname,
      ),
  "Validation is restricted to local Supabase or the dedicated Visa Seva project.",
);
const db = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);
const publicClient = () =>
  createClient(process.env.SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
const inbox = process.env.MAILPIT_URL || "http://127.0.0.1:54324";
const run = Date.now().toString(36);
const checks = [];
const pass = (label) => {
  checks.push(label);
  console.log(`PASS ${label}`);
};
async function request(
  path,
  { token, method = "GET", body, raw, expected = 200 } = {},
) {
  const r = await fetch(`${config.apiUrl}${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": raw ? "application/octet-stream" : "application/json",
    },
    body: raw || (body ? JSON.stringify(body) : undefined),
  });
  const data = r.status === 204 ? null : await r.json();
  assert.equal(
    r.status,
    expected,
    `${method} ${path}: ${JSON.stringify(data)}`,
  );
  return data;
}
async function findMail(email) {
  for (let attempt = 0; attempt < 30; attempt++) {
    const result = await (
      await fetch(
        `${inbox}/api/v1/search?query=${encodeURIComponent(`to:${email}`)}`,
      )
    ).json();
    if (result.messages?.length)
      return (
        await fetch(`${inbox}/api/v1/message/${result.messages[0].ID}`)
      ).json();
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error("Email not received in local inbox");
}
async function applicant(label, byCode = false) {
  const email = `${label}-${run}@visa-seva.test`;
  const auth = publicClient();
  if (hosted) {
    const created = await db.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: {
        redirectTo: `${config.publicUrl}/auth/confirm?next=%2Fapplications`,
      },
    });
    assert.ifError(created.error);
    const verified = await auth.auth.verifyOtp({
      token_hash: created.data.properties.hashed_token,
      type: "email",
    });
    assert.ifError(verified.error);
    const replay = await publicClient().auth.verifyOtp({
      token_hash: created.data.properties.hashed_token,
      type: "email",
    });
    assert.ok(replay.error);
    return {
      email,
      id: verified.data.user.id,
      token: verified.data.session.access_token,
    };
  }
  const sent = await auth.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${config.publicUrl}/auth/confirm?next=%2Fapplications`,
    },
  });
  assert.ifError(sent.error);
  const mail = await findMail(email);
  const href = mail.HTML.match(/href="([^"]+)"/)?.[1]?.replaceAll("&amp;", "&");
  assert.ok(href, "Email contains the configured application link");
  const link = new URL(href);
  assert.equal(link.pathname, "/auth/confirm");
  assert.ok(link.searchParams.get("token_hash"));
  const code = mail.HTML.match(/<strong>(\d+)<\/strong>/)?.[1];
  assert.ok(code);
  const verified = await auth.auth.verifyOtp(
    byCode
      ? { email, token: code, type: "email" }
      : { token_hash: link.searchParams.get("token_hash"), type: "email" },
  );
  assert.ifError(verified.error);
  assert.ok(verified.data.session);
  const replay = await publicClient().auth.verifyOtp({
    token_hash: link.searchParams.get("token_hash"),
    type: "email",
  });
  assert.ok(replay.error, "Email links must be single use");
  return {
    email,
    id: verified.data.user.id,
    token: verified.data.session.access_token,
  };
}
async function admin(role) {
  const email = `${role}-${run}@visa-seva.test`;
  const password = randomBytes(24).toString("base64url");
  const created = await db.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  assert.ifError(created.error);
  assert.ifError(
    (
      await db
        .from("platform_roles")
        .insert({ user_id: created.data.user.id, role })
    ).error,
  );
  const auth = await publicClient().auth.signInWithPassword({
    email,
    password,
  });
  assert.ifError(auth.error);
  return {
    email,
    password,
    id: created.data.user.id,
    token: auth.data.session.access_token,
  };
}
function answers(email) {
  const data = {
    application_type: "regular",
    visa_category: "employment",
    nationality: "Canada",
    email,
    confirm_email: email,
    review_accuracy: true,
  };
  for (let round = 0; round < 3; round++)
    for (const step of getSteps("regular", data))
      for (const field of step.fields || []) {
        if (field.visible && !field.visible(data)) continue;
        if (data[field.name] !== undefined) continue;
        if (field.type === "checkbox") data[field.name] = true;
        else if (field.type === "select")
          data[field.name] = field.options.includes("no")
            ? "no"
            : field.options[0];
        else if (field.type === "email") data[field.name] = email;
        else if (field.type === "date")
          data[field.name] =
            field.name === "date_of_birth"
              ? "1990-01-01"
              : field.name.includes("issue")
                ? "2024-01-01"
                : field.name.includes("expiry")
                  ? "2035-01-01"
                  : new Date(Date.now() + 45 * 86400000)
                      .toISOString()
                      .slice(0, 10);
        else
          data[field.name] = field.name.includes("phone")
            ? "+14165550123"
            : field.name === "given_name"
              ? "ALEX"
              : field.name === "surname"
                ? "TESTER"
                : "Synthetic validation example";
      }
  return data;
}
function pdf() {
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 600 800] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  const content =
    "BT /F1 16 Tf 50 730 Td (Synthetic test document - not a passport) Tj ET";
  objects.push(
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  );
  let text = "%PDF-1.4\n%" + "local-test ".repeat(1100) + "\n";
  const offsets = [0];
  objects.forEach((value, i) => {
    offsets.push(Buffer.byteLength(text));
    text += `${i + 1} 0 obj\n${value}\nendobj\n`;
  });
  const xref = Buffer.byteLength(text);
  text += `xref\n0 6\n0000000000 65535 f \n${offsets
    .slice(1)
    .map((n) => String(n).padStart(10, "0") + " 00000 n ")
    .join(
      "\n",
    )}\ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(text);
}
const owner = await applicant("applicant");
const other = await applicant("other", true);
pass(
  hosted
    ? "Hosted auth token exchange and replay rejection (email transport tested separately)"
    : "Real passwordless magic link and same-tab code, including replay rejection",
);
const reviewer = await admin("reviewer");
const decider = await admin("decision_maker");
pass("Separate admin authentication and server-controlled roles");
const data = answers(owner.email);
let app = await request("/api/platform/applications", {
  token: owner.token,
  method: "POST",
  body: { answers: data, draft_key: `e2e-${run}` },
  expected: 201,
});
const duplicate = await request("/api/platform/applications", {
  token: owner.token,
  method: "POST",
  body: { answers: data, draft_key: `e2e-${run}` },
  expected: 201,
});
assert.equal(app.id, duplicate.id);
const path = `/api/platform/applications/${app.id}`;
await request(path, { token: other.token, expected: 404 });
await request("/api/platform/admin/counts", {
  token: owner.token,
  expected: 403,
});
const rls = await fetch(
  `${process.env.SUPABASE_URL}/rest/v1/applications?id=eq.${app.id}`,
  {
    headers: {
      apikey: process.env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${other.token}`,
    },
  },
);
assert.deepEqual(await rls.json(), []);
pass("Application create retry, cross-applicant isolation and database RLS");
await request(path, {
  token: owner.token,
  method: "PATCH",
  body: { answers: data, version: 99 },
  expected: 400,
});
let validation = await request(`${path}/validate`, {
  token: owner.token,
  method: "POST",
});
assert.equal(validation.complete, false);
assert.equal(validation.missingDocuments.length, 3);
await request(`${path}/documents/photograph?version=${app.version}`, {
  token: owner.token,
  method: "POST",
  raw: Buffer.from("not an image"),
  expected: 400,
});
const photograph = await sharp(randomBytes(512 * 512 * 3), {
  raw: { width: 512, height: 512, channels: 3 },
})
  .jpeg({ quality: 70 })
  .toBuffer();
for (const document of getRequiredDocuments(data))
  app = await request(
    `${path}/documents/${document.type}?version=${app.version}`,
    {
      token: owner.token,
      method: "POST",
      raw: document.type === "photograph" ? photograph : pdf(),
    },
  );
app = await request(path, { token: owner.token });
assert.equal(app.documents.length, 3);
const signed = await request(`${path}/documents/${app.documents[0].id}`, {
  token: owner.token,
});
assert.equal((await fetch(signed.signedUrl)).status, 200);
await request(`${path}/documents/${app.documents[0].id}`, {
  token: other.token,
  expected: 404,
});
validation = await request(`${path}/validate`, {
  token: owner.token,
  method: "POST",
});
assert.equal(validation.complete, true, JSON.stringify(validation));
pass(
  "Real private document uploads, byte validation, authorized downloads and completeness",
);
// Full OAuth consent + PKCE exchange, using real Supabase storage and a real MCP client.
const verifier = randomBytes(32).toString("base64url"),
  challenge = createHash("sha256").update(verifier).digest("base64url");
const redirect = "http://127.0.0.1:45678/callback";
const client = await request("/oauth/register", {
  method: "POST",
  body: {
    client_name: "Visa Seva local validation",
    redirect_uris: [redirect],
  },
  expected: 201,
});
const authParams = new URLSearchParams({
  client_id: client.client_id,
  redirect_uri: redirect,
  response_type: "code",
  code_challenge_method: "S256",
  code_challenge: challenge,
  state: randomUUID(),
  scope: "applications:read drafts:write applications:submit checkout:create",
  resource: `${config.apiUrl}/mcp`,
});
const authorize = await fetch(
  `${config.apiUrl}/oauth/authorize?${authParams}`,
  { redirect: "manual" },
);
assert.ok(
  [302, 303, 307].includes(authorize.status),
  `Unexpected OAuth redirect ${authorize.status}`,
);
assert.equal(
  new URL(authorize.headers.get("location")).origin,
  config.publicUrl,
);
const consentId = new URL(authorize.headers.get("location")).searchParams.get(
  "request",
);
await request(`/oauth/request/${consentId}`, { token: owner.token });
const consent = await request(`/oauth/request/${consentId}`, {
  token: owner.token,
  method: "POST",
  body: { approved: true },
});
const code = new URL(consent.redirect).searchParams.get("code");
const tokenBody = {
  grant_type: "authorization_code",
  code,
  client_id: client.client_id,
  redirect_uri: redirect,
  code_verifier: verifier,
  resource: `${config.apiUrl}/mcp`,
};
const grant = await request("/oauth/token", {
  method: "POST",
  body: tokenBody,
});
await request("/oauth/token", {
  method: "POST",
  body: tokenBody,
  expected: 400,
});
const mcp = new Client({ name: "local-end-to-end", version: "1" });
await mcp.connect(
  new StreamableHTTPClientTransport(new URL(`${config.apiUrl}/mcp`), {
    requestInit: { headers: { Authorization: `Bearer ${grant.access_token}` } },
  }),
);
const call = async (name, args) => {
  const r = await mcp.callTool({ name, arguments: args });
  assert.notEqual(r.isError, true, JSON.stringify(r));
  return JSON.parse(r.content[0].text);
};
assert.equal(
  (await call("read_application", { id: app.id })).reference,
  app.reference,
);
const premature = await mcp.callTool({
  name: "submit_application",
  arguments: { id: app.id, version: app.version },
});
assert.equal(premature.isError, true);
pass(
  "Real OAuth registration, consent, PKCE, single-use code and MCP ownership",
);
app = await request(`${path}/confirm`, {
  token: owner.token,
  method: "POST",
  body: { version: app.version },
});
let checkout = await call("create_checkout", {
  id: app.id,
  version: app.version,
  request_key: randomUUID(),
});
const retry = await call("create_checkout", {
  id: app.id,
  version: app.version,
  request_key: randomUUID(),
});
assert.equal(checkout.id, retry.id);
for (const outcome of ["processing", "pending", "failed"])
  await request(`${path}/payments/${checkout.id}`, {
    token: owner.token,
    method: "POST",
    body: { outcome },
  });
checkout = await call("create_checkout", {
  id: app.id,
  version: app.version,
  request_key: randomUUID(),
});
await request(`${path}/payments/${checkout.id}`, {
  token: owner.token,
  method: "POST",
  body: { outcome: "cancelled" },
});
checkout = await call("create_checkout", {
  id: app.id,
  version: app.version,
  request_key: randomUUID(),
});
await request(`${path}/payments/${checkout.id}`, {
  token: owner.token,
  method: "POST",
  body: { outcome: "paid" },
});
await request(`${path}/payments/${checkout.id}`, {
  token: owner.token,
  method: "POST",
  body: { outcome: "failed" },
});
app = await call("submit_application", { id: app.id, version: app.version });
assert.equal(app.status, "submitted");
assert.equal(app.payment_status, "paid");
const again = await call("submit_application", {
  id: app.id,
  version: app.version,
});
assert.equal(again.id, app.id);
pass(
  "Payment processing, interruption, decline, cancellation, retry, duplicate outcomes and confirmed submission",
);
const adminPath = `/api/platform/admin/applications/${app.id}`;
const move = async (who, status, reason) => {
  app = await request(`${adminPath}/transition`, {
    token: who.token,
    method: "POST",
    body: { version: app.version, status, reason },
  });
};
await move(reviewer, "under_review", "Reviewing the submitted documents.");
await request(`${adminPath}/transition`, {
  token: reviewer.token,
  method: "POST",
  body: {
    version: app.version,
    status: "accepted",
    reason: "Not allowed for a reviewer",
  },
  expected: 400,
});
await move(
  reviewer,
  "waiting_for_information",
  "Please confirm your employer contact number.",
);
app = await request(path, {
  token: owner.token,
  method: "PATCH",
  body: {
    version: app.version,
    answers: { ...data, employer_phone: "+14165550124" },
  },
});
await request(`${path}/submit`, {
  token: owner.token,
  method: "POST",
  body: { version: app.version },
  expected: 400,
});
app = await request(`${path}/confirm`, {
  token: owner.token,
  method: "POST",
  body: { version: app.version },
});
app = await call("submit_application", { id: app.id, version: app.version });
await move(reviewer, "under_review", "Updated employer contact reviewed.");
await move(
  decider,
  "accepted",
  "Your application review is complete. See your application for next steps.",
);
pass(
  "Information request, edited-answer reconfirmation, no second charge, and authorized acceptance",
);
const rejected = await request("/api/platform/applications", {
  token: owner.token,
  method: "POST",
  body: { answers: data, draft_key: `reject-${run}` },
  expected: 201,
});
// Second branch uses the same real service to produce a rejection outcome.
let second = rejected;
const secondPath = `/api/platform/applications/${second.id}`;
for (const d of getRequiredDocuments(data))
  second = await request(
    `${secondPath}/documents/${d.type}?version=${second.version}`,
    {
      token: owner.token,
      method: "POST",
      raw: d.type === "photograph" ? photograph : pdf(),
    },
  );
second = await request(`${secondPath}/confirm`, {
  token: owner.token,
  method: "POST",
  body: { version: second.version },
});
const cp = await request(`${secondPath}/checkout`, {
  token: owner.token,
  method: "POST",
  body: { version: second.version, request_key: randomUUID() },
});
await request(`${secondPath}/payments/${cp.id}`, {
  token: owner.token,
  method: "POST",
  body: { outcome: "paid" },
});
second = await request(`${secondPath}/submit`, {
  token: owner.token,
  method: "POST",
  body: { version: second.version },
});
for (const status of ["under_review", "rejected"])
  second = await request(
    `/api/platform/admin/applications/${second.id}/transition`,
    {
      token: decider.token,
      method: "POST",
      body: {
        version: second.version,
        status,
        reason:
          status === "rejected"
            ? "The supporting document is not suitable. Review the required evidence before a new application."
            : "Review started.",
      },
    },
  );
assert.equal(second.status, "rejected");
pass("Rejected application with recorded decision reason");
if (!hosted) {
  await deliverEmails(db, config, {
    apiKey: "local",
    from: process.env.EMAIL_FROM,
    fetcher: mailpitFetcher(inbox),
  });
  const notifications = (
    await db
      .from("email_notifications")
      .select("*")
      .in("application_id", [app.id, second.id])
  ).data;
  assert.ok(notifications.length >= 6);
  assert.ok(
    notifications.every((n) => n.status === "delivered"),
    JSON.stringify(
      notifications.map((n) => ({ status: n.status, error: n.last_error })),
    ),
  );
  for (const message of notifications) {
    const email = await (
      await fetch(`${inbox}/api/v1/message/${message.provider_id}`)
    ).json();
    assert.ok(
      email.Text.includes(
        `${config.publicUrl}/applications/${message.application_id}`,
      ),
    );
  }
  const before = notifications.length;
  await deliverEmails(db, config, {
    apiKey: "local",
    from: process.env.EMAIL_FROM,
    fetcher: mailpitFetcher(inbox),
  });
  assert.equal(
    (
      await db
        .from("email_notifications")
        .select("id")
        .in("application_id", [app.id, second.id])
    ).data.length,
    before,
  );
  pass(
    "Actual submission, information request, acceptance and rejection emails in the local inbox",
  );
} else {
  const notifications = (
    await db
      .from("email_notifications")
      .select("id,status")
      .in("application_id", [app.id, second.id])
  ).data;
  assert.ok(notifications.length >= 6);
  assert.ok(notifications.every((n) => n.status === "queued"));
  pass("Hosted status changes queue durable email notifications");
}
const grants = await request("/api/platform/agents", { token: owner.token });
const active = grants.find((g) => g.label === "OAuth assistant");
assert.ok(active);
await request(`/api/platform/agents/${active.id}`, {
  token: owner.token,
  method: "DELETE",
  expected: 204,
});
await mcp.close();
await request("/mcp", {
  token: grant.access_token,
  method: "POST",
  body: { jsonrpc: "2.0", id: 1, method: "tools/list" },
  expected: 401,
});
pass("Assistant revocation takes effect immediately");
await writeFile(
  `/private/tmp/visa-seva-${hosted ? "hosted" : "local"}-validation.json`,
  JSON.stringify(
    {
      run,
      owner: { email: owner.email },
      reviewer: { email: reviewer.email, password: reviewer.password },
      decider: { email: decider.email, password: decider.password },
      applicationId: app.id,
      rejectedApplicationId: second.id,
      checks,
    },
    null,
    2,
  ),
  { mode: 0o600 },
);
console.log(
  `Validated ${checks.length} end-to-end scenarios. Test access saved privately.`,
);

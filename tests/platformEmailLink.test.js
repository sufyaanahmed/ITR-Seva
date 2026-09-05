import test from "node:test";
import assert from "node:assert/strict";
import { completeEmailLink } from "../src/platform/emailLink.js";
test("standard Supabase links exchange their PKCE code", async () => {
  let called;
  await completeEmailLink(
    {
      auth: {
        exchangeCodeForSession: async (code) => {
          called = code;
          return { data: { session: { access_token: "test" } } };
        },
      },
    },
    new URLSearchParams("code=one-time-code"),
  );
  assert.equal(called, "one-time-code");
});
test("custom email links retain token-hash verification", async () => {
  let called;
  await completeEmailLink(
    {
      auth: {
        verifyOtp: async (value) => {
          called = value;
          return { data: { session: {} } };
        },
      },
    },
    new URLSearchParams("token_hash=single-use-token"),
  );
  assert.deepEqual(called, { token_hash: "single-use-token", type: "email" });
});
test("missing verifier or expired standard links offer browser recovery", async () => {
  await assert.rejects(
    completeEmailLink(
      {
        auth: {
          exchangeCodeForSession: async () => ({
            error: new Error("missing verifier"),
          }),
        },
      },
      new URLSearchParams("code=expired"),
    ),
    /browser where you requested/,
  );
});
test("incomplete and error callbacks never attempt an exchange", async () => {
  await assert.rejects(
    completeEmailLink({ auth: {} }, new URLSearchParams()),
    /incomplete/,
  );
  await assert.rejects(
    completeEmailLink(
      { auth: {} },
      new URLSearchParams("error=access_denied&code=invalid"),
    ),
    /expired/,
  );
});

import express from "express";
import { createHash, randomBytes } from "node:crypto";
import { z } from "zod";
import { ApiError, hash, unwrap } from "./service.js";
const redirectSchema = z
  .string()
  .url()
  .max(2048)
  .refine((value) => {
    const u = new URL(value);
    return (
      !u.hash &&
      !u.username &&
      !u.password &&
      (u.protocol === "https:" ||
        (u.protocol === "http:" &&
          ["127.0.0.1", "localhost", "[::1]"].includes(u.hostname)))
    );
  });
export function installOAuth(app, db, config, human, scopes) {
  const resource = `${config.apiUrl}/mcp`;
  app.get("/.well-known/oauth-protected-resource", (_req, res) =>
    res.json({
      resource,
      authorization_servers: [config.apiUrl],
      scopes_supported: scopes,
      bearer_methods_supported: ["header"],
      resource_name: "Visa Seva",
    }),
  );
  app.get("/.well-known/oauth-protected-resource/mcp", (_req, res) =>
    res.redirect("/.well-known/oauth-protected-resource"),
  );
  app.get("/.well-known/oauth-authorization-server", (_req, res) =>
    res.json({
      issuer: config.apiUrl,
      authorization_endpoint: `${config.apiUrl}/oauth/authorize`,
      token_endpoint: `${config.apiUrl}/oauth/token`,
      registration_endpoint: `${config.apiUrl}/oauth/register`,
      response_types_supported: ["code"],
      grant_types_supported: ["authorization_code"],
      token_endpoint_auth_methods_supported: ["none"],
      code_challenge_methods_supported: ["S256"],
      scopes_supported: scopes,
    }),
  );
  app.post("/oauth/register", async (req, res) => {
    const uris = z
      .array(redirectSchema)
      .min(1)
      .max(5)
      .parse(req.body.redirect_uris);
    const name = z
      .string()
      .min(1)
      .max(80)
      .parse(req.body.client_name || "AI assistant");
    const c = unwrap(
      await db
        .from("platform_oauth_clients")
        .insert({ name, redirect_uris: uris })
        .select()
        .single(),
    );
    res.status(201).json({
      client_id: c.id,
      client_name: c.name,
      redirect_uris: uris,
      token_endpoint_auth_method: "none",
      grant_types: ["authorization_code"],
      response_types: ["code"],
    });
  });
  app.get("/oauth/authorize", async (req, res) => {
    const q = z
      .object({
        client_id: z.string().uuid(),
        redirect_uri: redirectSchema,
        response_type: z.literal("code"),
        code_challenge_method: z.literal("S256"),
        code_challenge: z.string().regex(/^[A-Za-z0-9_-]{43}$/),
        state: z.string().min(1).max(1024),
        scope: z.string().max(200),
        resource: z.literal(resource),
      })
      .parse(req.query);
    const c = unwrap(
      await db
        .from("platform_oauth_clients")
        .select("*")
        .eq("id", q.client_id)
        .maybeSingle(),
    );
    if (!c?.redirect_uris.includes(q.redirect_uri))
      throw new ApiError(400, "Invalid OAuth client or redirect URI.");
    const requested = q.scope.split(" ").filter(Boolean);
    if (!requested.length || requested.some((s) => !scopes.includes(s)))
      throw new ApiError(400, "Invalid OAuth scope.");
    const r = unwrap(
      await db
        .from("platform_oauth_requests")
        .insert({
          client_id: c.id,
          redirect_uri: q.redirect_uri,
          state: q.state,
          challenge: q.code_challenge,
          scopes: requested,
          resource,
        })
        .select("id")
        .single(),
    );
    res.redirect(`${config.publicUrl}/assistant-consent?request=${r.id}`);
  });
  app.get("/oauth/request/:id", human, async (req, res) => {
    const r = unwrap(
      await db
        .from("platform_oauth_requests")
        .select("id,client_id,scopes,expires_at,redirect_uri")
        .eq("id", z.string().uuid().parse(req.params.id))
        .gt("expires_at", new Date().toISOString())
        .is("code_hash", null)
        .maybeSingle(),
    );
    if (!r) throw new ApiError(404, "Authorization request expired.");
    const c = unwrap(
      await db
        .from("platform_oauth_clients")
        .select("name")
        .eq("id", r.client_id)
        .single(),
    );
    res.json({
      ...r,
      client_name: c.name,
      redirect_origin: new URL(r.redirect_uri).origin,
    });
  });
  app.post("/oauth/request/:id", human, async (req, res) => {
    const approved = z.boolean().parse(req.body.approved);
    const code = randomBytes(32).toString("base64url");
    const r = unwrap(
      await db
        .from("platform_oauth_requests")
        .update({
          owner_id: req.actor.id,
          code_hash: hash(code),
          ...(!approved ? { used_at: new Date().toISOString() } : {}),
        })
        .eq("id", z.string().uuid().parse(req.params.id))
        .is("code_hash", null)
        .gt("expires_at", new Date().toISOString())
        .select()
        .maybeSingle(),
    );
    if (!r)
      throw new ApiError(
        409,
        "Authorization request expired or already answered.",
      );
    unwrap(
      await db.from("platform_audit").insert({
        actor_id: req.actor.id,
        actor_kind: "applicant",
        action: approved ? "oauth_consent_granted" : "oauth_consent_denied",
      }),
    );
    const url = new URL(r.redirect_uri);
    url.searchParams.set("state", r.state);
    url.searchParams.set(
      approved ? "code" : "error",
      approved ? code : "access_denied",
    );
    res.json({ redirect: url.toString() });
  });
  app.post(
    "/oauth/token",
    express.urlencoded({ extended: false, limit: "8kb" }),
    async (req, res) => {
      const b = z
        .object({
          grant_type: z.literal("authorization_code"),
          code: z.string().min(32).max(256),
          client_id: z.string().uuid(),
          redirect_uri: redirectSchema,
          code_verifier: z.string().regex(/^[A-Za-z0-9._~-]{43,128}$/),
          resource: z.literal(resource),
        })
        .parse(req.body);
      const token = `vs_agent_${randomBytes(32).toString("base64url")}`;
      const result = await db.rpc("redeem_platform_code", {
        code_digest: hash(b.code),
        client: b.client_id,
        redirect: b.redirect_uri,
        pkce: createHash("sha256").update(b.code_verifier).digest("base64url"),
        audience: b.resource,
        token_digest: hash(token),
      });
      if (result.error) return res.status(400).json({ error: "invalid_grant" });
      res.json({ access_token: token, token_type: "Bearer", ...result.data });
    },
  );
}

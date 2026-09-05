import { timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { configuration } from "../platform/server.js";
import { deliverEmails } from "../platform/email-worker.js";
export default async function emailCron(req, res) {
  const expected = Buffer.from(`Bearer ${process.env.CRON_SECRET || ""}`);
  const actual = Buffer.from(req.headers.authorization || "");
  if (
    !process.env.CRON_SECRET ||
    actual.length !== expected.length ||
    !timingSafeEqual(actual, expected)
  )
    return res.status(401).json({ error: "Unauthorized" });
  try {
    const db = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } },
    );
    const count = await deliverEmails(db, configuration(), {
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM,
    });
    res.json({ processed: count });
  } catch (error) {
    res.status(503).json({ error: "Email delivery is not ready." });
  }
}

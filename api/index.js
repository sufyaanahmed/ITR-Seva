import { createClient } from "@supabase/supabase-js";
import { waitUntil } from "@vercel/functions";
import { createApp, configuration } from "../platform/server.js";
import { deliverEmails } from "../platform/email-worker.js";
let handler;
export default function api(req, res) {
  if (!handler) {
    const config = configuration();
    const db = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const app = createApp(db, config);
    handler = (req, res) => {
      if (
        req.method === "POST" &&
        process.env.RESEND_API_KEY &&
        process.env.EMAIL_FROM
      )
        res.on("finish", () =>
          waitUntil(
            deliverEmails(db, config, {
              apiKey: process.env.RESEND_API_KEY,
              from: process.env.EMAIL_FROM,
            }).catch((error) => console.error("Email worker:", error.message)),
          ),
        );
      return app(req, res);
    };
  }
  return handler(req, res);
}
